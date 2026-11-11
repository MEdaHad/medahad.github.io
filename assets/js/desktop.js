/* medahad.github.io — glass desktop: window manager, dock, panel clock, browser chrome and an
   interactive terminal. All terminal output is read from the CV markup in index.html, so the
   terminal and the browser always show the same facts. No dependencies. */
(() => {
  'use strict';

  const d = document;
  const root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const mq = (q) => window.matchMedia(q);
  const reduceMQ = mq('(prefers-reduced-motion: reduce)');
  const compactMQ = mq('(max-width: 760px)');
  const coarseMQ = mq('(pointer: coarse)');
  const reduced = () => reduceMQ.matches;
  const compact = () => compactMQ.matches;
  const canDrag = () => !compact() && !coarseMQ.matches;
  const dur = () => (reduced() ? 0 : 220);

  function el(tag, props, ...kids) {
    const n = d.createElement(tag);
    if (props) {
      for (const k in props) {
        const v = props[k];
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      }
    }
    for (const k of kids) if (k != null && k !== false) n.append(k);
    return n;
  }

  function offsetIn(node, container) {
    let y = 0;
    while (node && node !== container) { y += node.offsetTop; node = node.offsetParent; }
    return y;
  }

  function store(kind, key, value) {
    try {
      const s = kind === 'local' ? localStorage : sessionStorage;
      if (value === undefined) return s.getItem(key);
      s.setItem(key, value);
    } catch (_) { /* storage disabled */ }
    return null;
  }

  /* ------------------------------------------------------------------
     Elements
     ------------------------------------------------------------------ */
  const desktop = $('#desktop');
  const panel = $('.panel', desktop);
  const dock = $('.dock', desktop);
  const panelApp = $('#panel-app');
  const pane = $('#cv');
  const wins = { terminal: $('#win-terminal'), browser: $('#win-browser') };
  const appNames = { terminal: 'Terminal', browser: 'Browser' };
  const state = {
    terminal: { s: 'open', g: null, max: false },
    browser: { s: 'open', g: null, max: false },
  };
  const dockBtn = (app) => $(`[data-open="${app}"]`, dock);
  let zTop = 10;
  let active = null;

  /* ------------------------------------------------------------------
     Window geometry
     ------------------------------------------------------------------ */
  const MIN_W = 320;
  const MIN_H = 220;

  function area() {
    const top = panel.offsetTop + panel.offsetHeight + 10;
    const bottom = (root.classList.contains('kb-open') ? desktop.clientHeight : dock.offsetTop) - 12;
    return { x: 8, y: top, w: desktop.clientWidth - 16, h: Math.max(160, bottom - top) };
  }

  function clamp(g, a) {
    const w = Math.min(Math.max(g.w, MIN_W), a.w);
    const h = Math.min(Math.max(g.h, MIN_H), a.h);
    return {
      w, h,
      x: Math.min(Math.max(g.x, a.x), a.x + a.w - w),
      y: Math.min(Math.max(g.y, a.y), a.y + a.h - h),
    };
  }

  function setBox(w, g) {
    w.style.left = g.x + 'px';
    w.style.top = g.y + 'px';
    w.style.width = g.w + 'px';
    w.style.height = g.h + 'px';
    w.style.right = 'auto';
    w.style.bottom = 'auto';
  }

  function clearBox(w) {
    for (const p of ['left', 'top', 'width', 'height', 'right', 'bottom']) w.style[p] = '';
  }

  function applyGeom(app) {
    const w = wins[app];
    const st = state[app];
    if (compact()) { clearBox(w); return; }
    const a = area();
    if (st.max) { setBox(w, a); return; }
    if (!st.g) { clearBox(w); st.g = { x: w.offsetLeft, y: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight }; }
    st.g = clamp(st.g, a);
    setBox(w, st.g);
  }

  function layoutFromCSS() {
    for (const app in wins) {
      const w = wins[app];
      const hidden = w.hidden;
      w.hidden = false;
      clearBox(w);
      state[app].g = compact() ? null : { x: w.offsetLeft, y: w.offsetTop, w: w.offsetWidth, h: w.offsetHeight };
      applyGeom(app);
      w.hidden = hidden;
    }
  }

  /* ------------------------------------------------------------------
     Focus, open, minimize, close
     ------------------------------------------------------------------ */
  function raise(app) {
    if (zTop > 900) {
      const order = Object.keys(wins).sort((a, b) => (+wins[a].style.zIndex || 0) - (+wins[b].style.zIndex || 0));
      zTop = 10;
      for (const k of order) wins[k].style.zIndex = ++zTop;
    }
    wins[app].style.zIndex = ++zTop;
  }

  function focusContent(app) {
    if (app === 'terminal') {
      if (!coarseMQ.matches) term.input.focus({ preventScroll: true });
    } else {
      pane.focus({ preventScroll: true });
    }
  }

  function focusWin(app, opts = {}) {
    if (state[app].s !== 'open') return;
    if (active !== app || wins[app].style.zIndex != zTop) raise(app);
    if (active !== app) {
      active = app;
      for (const k in wins) wins[k].classList.toggle('is-active', k === app);
      panelApp.textContent = appNames[app];
    }
    if (opts.focus) focusContent(app);
    updateDock();
  }

  function topOpen(except) {
    let best = null;
    let bz = -1;
    for (const k in wins) {
      if (k === except || state[k].s !== 'open') continue;
      const z = +wins[k].style.zIndex || 0;
      if (z > bz) { bz = z; best = k; }
    }
    return best;
  }

  function genie(app) {
    const w = wins[app];
    const icon = dockBtn(app);
    if (!icon || compact()) { w.style.removeProperty('--gx'); w.style.removeProperty('--gy'); return; }
    const ir = icon.getBoundingClientRect();
    const dr = desktop.getBoundingClientRect();
    const cx = w.offsetLeft + w.offsetWidth / 2;
    const cy = w.offsetTop + w.offsetHeight / 2;
    w.style.setProperty('--gx', Math.round(ir.left - dr.left + ir.width / 2 - cx) + 'px');
    w.style.setProperty('--gy', Math.round(ir.top - dr.top + ir.height / 2 - cy) + 'px');
  }

  function show(app, opts = {}) {
    const w = wins[app];
    const st = state[app];
    const was = st.s;
    if (was === 'open') { focusWin(app, opts); return; }
    clearTimeout(w._t);
    w.classList.remove('is-minimizing', 'is-closing');
    st.s = 'open';
    w.hidden = false;
    applyGeom(app);
    if (dur()) {
      if (was === 'min') genie(app); else { w.style.removeProperty('--gx'); w.style.removeProperty('--gy'); }
      w.classList.add('is-opening');
      void w.offsetWidth;
      w.classList.remove('is-opening');
    }
    if (app === 'terminal' && was === 'closed') term.reset();
    focusWin(app, opts);
  }

  function hide(app, how) {
    const w = wins[app];
    const st = state[app];
    if (st.s !== 'open') {
      if (how === 'closed') st.s = 'closed';
      updateDock();
      return;
    }
    const hadFocus = w.contains(d.activeElement);
    st.s = how;
    if (how === 'min') genie(app);
    w.classList.add(how === 'min' ? 'is-minimizing' : 'is-closing');
    w._t = setTimeout(() => {
      w.hidden = true;
      w.classList.remove('is-minimizing', 'is-closing');
    }, dur());
    w.classList.remove('is-active');
    if (active === app) {
      active = null;
      const next = topOpen(app);
      if (next) focusWin(next);
      else panelApp.textContent = 'Desktop';
    }
    if (hadFocus) dockBtn(app).focus({ preventScroll: true });
    updateDock();
  }

  function toggleMax(app) {
    if (compact()) return;
    const w = wins[app];
    const st = state[app];
    st.max = !st.max;
    w.classList.toggle('is-max', st.max);
    $('[data-action="maximize"]', w).setAttribute('aria-pressed', String(st.max));
    if (dur()) {
      w.classList.add('is-geom');
      clearTimeout(w._g);
      w._g = setTimeout(() => w.classList.remove('is-geom'), dur() + 40);
    }
    applyGeom(app);
    focusWin(app);
  }

  function updateDock() {
    for (const app in wins) {
      const b = dockBtn(app);
      const s = state[app].s;
      b.classList.toggle('is-running', s === 'open');
      b.classList.toggle('is-min', s === 'min');
      $('.dock-state', b).textContent =
        s === 'open' ? (active === app ? ', focused' : ', open') : s === 'min' ? ', minimized' : ', closed';
    }
  }

  function activate(app) {
    if (state[app].s === 'open' && active === app && !compact()) { focusContent(app); return; }
    show(app, { focus: true });
  }

  /* Window controls, focus and dock */
  for (const app in wins) {
    const w = wins[app];
    w.addEventListener('pointerdown', () => focusWin(app), true);
    w.addEventListener('focusin', () => focusWin(app));
    w.addEventListener('click', (e) => {
      const b = e.target.closest('[data-action]');
      if (!b || !w.contains(b)) return;
      const a = b.dataset.action;
      if (a === 'close') hide(app, 'closed');
      else if (a === 'minimize') hide(app, 'min');
      else if (a === 'maximize') toggleMax(app);
    });
    const bar = $('[data-drag]', w);
    bar.addEventListener('pointerdown', (e) => startDrag(e, app));
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('button, a')) toggleMax(app); });
    const grip = $('[data-resize]', w);
    if (grip) grip.addEventListener('pointerdown', (e) => startResize(e, app));
  }

  dock.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) activate(b.dataset.open);
  });

  /* Dragging and resizing (fine pointers on wide screens only) */
  function track(e, target, onMove) {
    e.preventDefault();
    const sx = e.clientX;
    const sy = e.clientY;
    try { target.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
    let raf = 0;
    let last = null;
    const move = (ev) => {
      last = ev;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; onMove(last.clientX - sx, last.clientY - sy); });
    };
    const end = () => {
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', end);
      target.removeEventListener('pointercancel', end);
      cancelAnimationFrame(raf);
      if (last) onMove(last.clientX - sx, last.clientY - sy);
      onMove(null);
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', end);
    target.addEventListener('pointercancel', end);
  }

  function startDrag(e, app) {
    const st = state[app];
    if (e.button !== 0 || !canDrag() || st.max || e.target.closest('button, a')) return;
    const w = wins[app];
    const g0 = { ...st.g };
    const a = area();
    w.classList.add('is-dragging');
    track(e, e.currentTarget, (dx, dy) => {
      if (dx === null) { w.classList.remove('is-dragging'); return; }
      st.g = clamp({ ...g0, x: g0.x + dx, y: g0.y + dy }, a);
      w.style.left = st.g.x + 'px';
      w.style.top = st.g.y + 'px';
    });
  }

  function startResize(e, app) {
    const st = state[app];
    if (e.button !== 0 || !canDrag() || st.max) return;
    const w = wins[app];
    const g0 = { ...st.g };
    const a = area();
    w.classList.add('is-dragging');
    track(e, e.currentTarget, (dx, dy) => {
      if (dx === null) { w.classList.remove('is-dragging'); return; }
      const g = {
        x: g0.x, y: g0.y,
        w: Math.min(Math.max(MIN_W, g0.w + dx), a.x + a.w - g0.x),
        h: Math.min(Math.max(MIN_H, g0.h + dy), a.y + a.h - g0.y),
      };
      st.g = g;
      setBox(w, g);
    });
  }

  /* Viewport changes, phone keyboards */
  let maxVH = 0;
  let lastW = 0;
  let resizeRaf = 0;
  function onViewport() {
    const vv = window.visualViewport;
    if (compact() && vv) {
      if (Math.abs(vv.width - lastW) > 40) maxVH = 0;
      lastW = vv.width;
      maxVH = Math.max(maxVH, vv.height);
      const kb = d.activeElement === term.input && vv.height < maxVH * 0.8;
      root.classList.toggle('kb-open', kb);
      root.style.setProperty('--vv-h', vv.height + 'px');
      root.style.setProperty('--vv-top', vv.offsetTop + 'px');
      if (kb) term.scrollToEnd();
    } else {
      root.classList.remove('kb-open');
      root.style.removeProperty('--vv-h');
      root.style.removeProperty('--vv-top');
    }
    for (const app in wins) if (state[app].s === 'open') applyGeom(app);
  }
  const queueViewport = () => { if (!resizeRaf) resizeRaf = requestAnimationFrame(() => { resizeRaf = 0; onViewport(); }); };
  window.addEventListener('resize', queueViewport);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', queueViewport);
    window.visualViewport.addEventListener('scroll', queueViewport);
  }
  const onMode = () => {
    root.classList.toggle('can-drag', canDrag());
    for (const app in state) { state[app].max = false; wins[app].classList.remove('is-max'); }
    layoutFromCSS();
    onViewport();
  };
  compactMQ.addEventListener('change', onMode);
  coarseMQ.addEventListener('change', onMode);

  /* ------------------------------------------------------------------
     Panel: clock and theme
     ------------------------------------------------------------------ */
  const clock = $('#clock');
  let clockTimer = 0;
  function tick() {
    const now = new Date();
    $('.clock-date', clock).textContent = now.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    $('.clock-time', clock).textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    clock.setAttribute('datetime', now.toISOString());
    clearTimeout(clockTimer);
    clockTimer = setTimeout(tick, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
  }
  d.addEventListener('visibilitychange', () => { if (!d.hidden) tick(); });

  const themeBtn = $('#theme-btn');
  const themeMeta = $('meta[name="theme-color"]');
  const currentTheme = () => (root.dataset.theme === 'light' ? 'light' : 'dark');
  function setTheme(t, save = true) {
    root.dataset.theme = t;
    if (save) store('local', 'theme', t);
    themeBtn.setAttribute('aria-pressed', String(t === 'light'));
    themeMeta.setAttribute('content', t === 'light' ? '#e9ecf6' : '#0b0e1c');
  }
  themeBtn.addEventListener('click', () => setTheme(currentTheme() === 'light' ? 'dark' : 'light'));

  /* ------------------------------------------------------------------
     Browser: in-page navigation, address bar, back / forward / reload
     ------------------------------------------------------------------ */
  const addrHash = $('#addr-hash');
  const navBtn = (n) => $(`[data-nav="${n}"]`, wins.browser);
  const nav = { stack: ['main'], i: 0 };

  function cvTarget(id) {
    if (!id || id === 'main' || id === 'top') return null;
    const t = d.getElementById(id);
    return t && pane.contains(t) ? t : undefined;
  }

  function scrollPane(target, smooth) {
    let top = 0;
    if (target) {
      const header = $('.site-header', pane);
      top = Math.max(0, offsetIn(target, pane) - header.offsetHeight - 16);
    }
    pane.scrollTo({ top, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  }

  function setAddress(id) {
    const clean = !id || id === 'main' || id === 'top';
    addrHash.textContent = clean ? '' : '#' + id;
    try { history.replaceState(null, '', clean ? location.pathname + location.search : '#' + id); } catch (_) { /* file:// */ }
  }

  function syncNavButtons() {
    navBtn('back').disabled = nav.i <= 0;
    navBtn('forward').disabled = nav.i >= nav.stack.length - 1;
  }

  function goTo(id, { push = true, focus = true, smooth = true } = {}) {
    const target = cvTarget(id);
    if (target === undefined) return false;
    show('browser');
    focusWin('browser');
    scrollPane(target, smooth);
    setAddress(id);
    if (push && nav.stack[nav.i] !== id) {
      nav.stack = nav.stack.slice(0, nav.i + 1);
      nav.stack.push(id);
      nav.i = nav.stack.length - 1;
    }
    syncNavButtons();
    if (focus) {
      const f = target || $('#main');
      if (!f.hasAttribute('tabindex')) f.setAttribute('tabindex', '-1');
      f.focus({ preventScroll: true });
    }
    return true;
  }

  function route(id, opts) {
    if (id === 'terminal' || id === 'win-terminal') { show('terminal', { focus: true }); return true; }
    return goTo(id || 'main', opts);
  }

  wins.browser.addEventListener('click', (e) => {
    const b = e.target.closest('[data-nav]');
    if (!b) return;
    const n = b.dataset.nav;
    if (n === 'back' && nav.i > 0) { nav.i--; goTo(nav.stack[nav.i], { push: false, focus: false }); }
    else if (n === 'forward' && nav.i < nav.stack.length - 1) { nav.i++; goTo(nav.stack[nav.i], { push: false, focus: false }); }
    else if (n === 'reload') {
      pane.classList.add('is-reloading');
      setTimeout(() => {
        pane.classList.remove('is-reloading');
        goTo(nav.stack[nav.i], { push: false, focus: false, smooth: false });
      }, reduced() ? 0 : 160);
    }
  });

  /* Every in-document #link (CV nav, skip links, terminal output) goes through the router */
  d.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    if (route(id)) e.preventDefault();
  });
  window.addEventListener('hashchange', () => route(decodeURIComponent(location.hash.slice(1))));

  /* Scroll spy for the CV's own nav */
  if ('IntersectionObserver' in window) {
    const links = new Map($$('.site-nav a', pane).map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        for (const a of links.values()) a.removeAttribute('aria-current');
        const a = links.get(en.target.id);
        if (a) a.setAttribute('aria-current', 'true');
      }
    }, { root: pane, rootMargin: '-25% 0px -65% 0px' });
    for (const id of links.keys()) { const s = d.getElementById(id); if (s) spy.observe(s); }
  }

  /* ------------------------------------------------------------------
     Content → terminal rendering (reads the CV markup)
     ------------------------------------------------------------------ */
  const norm = (s) => s.replace(/\s+/g, ' ');
  const skip = (n) => n.matches('[data-term="skip"], picture, img, svg, button, noscript, .sr-only');

  function inline(src, dest) {
    for (const c of src.childNodes) {
      if (c.nodeType === 3) { dest.append(norm(c.textContent)); continue; }
      if (c.nodeType !== 1 || skip(c)) continue;
      const tag = c.tagName;
      if (tag === 'A') {
        const a = el('a', { href: c.getAttribute('href'), rel: c.getAttribute('rel') }, norm(c.textContent).trim());
        dest.append(a);
      } else if (tag === 'Q') {
        dest.append('“'); inline(c, dest); dest.append('”');
      } else if (tag === 'STRONG' || tag === 'B') {
        const b = el('span', { class: c.closest('.owasp') ? 't-code' : 't-b' });
        inline(c, b);
        dest.append(b);
      } else if (tag === 'BR') {
        dest.append('\n');
      } else {
        inline(c, dest);
      }
    }
    return dest;
  }

  function line(src, cls) {
    const n = inline(src, el('div', { class: cls }));
    const first = n.firstChild;
    const last = n.lastChild;
    if (first && first.nodeType === 3) first.textContent = first.textContent.replace(/^\s+/, '');
    if (last && last.nodeType === 3) last.textContent = last.textContent.replace(/\s+$/, '');
    return n;
  }

  const BLOCK = 'H1,H2,H3,H4,P,UL,OL,DL,DIV,ARTICLE,SECTION,ASIDE,HEADER,BLOCKQUOTE';

  function block(src, out) {
    for (const c of src.children) {
      if (skip(c)) continue;
      switch (c.tagName) {
        case 'H1': out.append(line(c, 't-name')); break;
        case 'H2': out.append(line(c, 't-title')); break;
        case 'H3': out.append(line(c, 't-h')); break;
        case 'H4': out.append(line(c, 't-h2')); break;
        case 'P':
          out.append(line(c, c.matches('.tag, .meta, .job-meta, .loc, .lede, .frameworks') ? 't-p t-muted' : 't-p'));
          break;
        case 'UL':
        case 'OL':
          if (c.matches('.pipeline')) {
            const n = el('div', { class: 't-p' });
            if (c.dataset.label) n.append(el('span', { class: 't-muted', text: c.dataset.label + ': ' }));
            $$(':scope > li', c).forEach((li, i) => { if (i) n.append(' → '); n.append(norm(li.textContent).trim()); });
            out.append(n);
            break;
          }
          for (const li of c.children) {
            if (Array.from(li.children).some((k) => k.matches(BLOCK))) {
              const g = el('div', { class: 't-group' });
              block(li, g);
              out.append(g);
            } else {
              out.append(line(li, 't-li'));
            }
          }
          break;
        case 'DL': {
          const dl = el('dl', { class: 't-kv' });
          for (const row of $$(':scope > div', c)) dl.append(wrap('dt', line($('dt', row))), wrap('dd', line($('dd', row))));
          out.append(dl);
          break;
        }
        default:
          block(c, out);
      }
    }
    return out;
  }

  function wrap(tag, div) { const n = el(tag); n.append(...div.childNodes); return n; }

  const doc = (...sources) => {
    const out = el('div', { class: 't-doc' });
    for (const s of sources) if (s) block(s, out);
    return out;
  };

  /* ------------------------------------------------------------------
     Virtual home directory
     ------------------------------------------------------------------ */
  const PDF = 'MedhaneHadush_CV.pdf';
  const HOME = [
    { name: 'about.txt', sel: '#about' },
    { name: 'currently.txt', sel: '#currently' },
    { name: 'highlights.txt', sel: '#highlights' },
    { name: 'experience.md', sel: '#experience' },
    { name: 'projects', dir: '#projects' },
    { name: 'side-projects', dir: '#side-projects' },
    { name: 'skills.md', sel: '#skills' },
    { name: 'talks.txt', sel: '#talks' },
    { name: 'education.txt', sel: '#education' },
    { name: 'languages.txt', sel: '#languages' },
    { name: 'contact', sel: '#contact' },
    { name: PDF, pdf: true },
  ];

  function entries(dirPath) {
    if (dirPath === '~') return HOME;
    const node = HOME.find((n) => n.dir && '~/' + n.name === dirPath);
    if (!node) return null;
    return $$('[data-file]', $(node.dir)).map((a) => ({ name: a.dataset.file, el: a }));
  }

  /* Resolve a path relative to the current directory → { kind, path, node } | { error } */
  function resolve(arg, cwd) {
    let p = (arg || '').trim();
    let segs = cwd === '~' ? [] : [cwd.slice(2)];
    if (p === '~' || p.startsWith('~/') || p.startsWith('/')) { segs = []; p = p.replace(/^~?\/?/, ''); }
    for (const s of p.split('/')) {
      if (!s || s === '.') continue;
      if (s === '..') segs.pop(); else segs.push(s);
    }
    if (!segs.length) return { kind: 'dir', path: '~' };
    const top = HOME.find((n) => n.name === segs[0]);
    if (!top) return null;
    if (segs.length === 1) return { kind: top.dir ? 'dir' : 'file', path: '~/' + top.name, node: top };
    if (!top.dir) return { error: 'Not a directory' };
    if (segs.length > 2) return null;
    const f = entries('~/' + top.name).find((e) => e.name === segs[1]);
    return f ? { kind: 'file', path: '~/' + top.name + '/' + f.name, node: f } : null;
  }

  function readFile(node) {
    if (node.pdf) {
      return el('div', { class: 't-p' },
        el('a', { href: PDF, class: 't-pdf' }, PDF), ' is a PDF and won’t print nicely here. Download it, or run ',
        cmdLink('open cv'), ' to read the CV in the Browser.');
    }
    if (node.el) return doc(node.el);
    return doc($(node.sel));
  }

  /* ------------------------------------------------------------------
     Terminal
     ------------------------------------------------------------------ */
  const term = {
    win: wins.terminal,
    scroller: $('#term-scroll'),
    out: $('#term-out'),
    form: $('#term-form'),
    input: $('#term-input'),
    field: $('#term-field'),
    hist: [],
    hi: 0,
    draft: '',
    cwd: '~',
    autorun: null,
  };

  const mirror = {
    inner: $('.term-mirror-inner', term.field),
    before: $('.m-before', term.field),
    caret: $('.m-caret', term.field),
    after: $('.m-after', term.field),
  };

  function syncMirror() {
    const inp = term.input;
    const v = inp.value;
    const s = inp.selectionStart ?? v.length;
    const e = inp.selectionEnd ?? s;
    if (s !== e) {
      mirror.before.textContent = v;
      mirror.caret.hidden = true;
      mirror.after.textContent = '';
    } else {
      mirror.before.textContent = v.slice(0, s);
      mirror.caret.hidden = false;
      mirror.caret.textContent = v[s] || ' ';
      mirror.after.textContent = v.slice(s + 1);
    }
    requestAnimationFrame(() => {
      mirror.inner.style.transform = inp.scrollLeft ? `translateX(${-inp.scrollLeft}px)` : '';
    });
  }

  const cwdLabel = () => term.cwd;

  function setCwd(path) {
    term.cwd = path;
    for (const n of $$('[data-cwd]', term.win)) n.textContent = path;
  }

  function ps1() {
    return el('span', { class: 't-ps1', 'aria-hidden': 'true' },
      el('span', { class: 't-user', text: 'meda@hadush' }), ':',
      el('span', { class: 't-path', text: cwdLabel() }), '$');
  }

  function echo(cmd) {
    const n = el('div', { class: 't-cmd' }, ps1(), ' ', el('span', { class: 't-typed', text: cmd }));
    term.out.append(n);
    return n;
  }

  function print(...nodes) {
    const b = el('div', { class: 't-block' });
    for (const n of nodes) b.append(typeof n === 'string' ? el('div', { class: 't-p', text: n }) : n);
    term.out.append(b);
    return b;
  }

  function cmdLink(cmd, label) {
    return el('button', { type: 'button', class: 't-run', 'data-run': cmd }, label || cmd);
  }

  function err(...parts) { return el('div', { class: 't-p t-err' }, ...parts); }

  function scrollAfter(lineNode) {
    requestAnimationFrame(() => {
      const sc = term.scroller;
      if (!lineNode || !lineNode.isConnected) { sc.scrollTop = 0; return; }
      const top = offsetIn(lineNode, sc) - 8;
      sc.scrollTop = sc.scrollHeight - top > sc.clientHeight ? top : sc.scrollHeight;
    });
  }
  term.scrollToEnd = () => { term.scroller.scrollTop = term.scroller.scrollHeight; };

  /* Commands */
  const HELP = [
    ['Get to know me', [
      ['whoami', 'Name, role, location and a short intro'],
      ['about', 'The longer about text'],
      ['highlights', 'AI automation videos and PedTalk AI'],
      ['currently', 'What I’m working on right now'],
      ['experience', 'Roles and dates'],
      ['projects', 'All projects and side projects · projects <name> for one'],
      ['skills', 'Skill groups'],
      ['education', 'Education, certifications, frameworks and languages'],
      ['talks', 'Talks and teaching'],
      ['languages', 'Spoken languages'],
      ['contact', 'Email, LinkedIn, GitHub and CV'],
    ]],
    ['Desktop', [
      ['cv', 'Open the CV in the Browser window (+ PDF link)'],
      ['open <app>', 'open terminal | browser | cv | pdf, or a section: open projects'],
      ['theme', 'Toggle the light / dark desktop · theme light | dark'],
      ['neofetch', 'System-info card, portfolio edition'],
      ['exit', 'Close this terminal (reopen it from the dock) · also: close'],
    ]],
    ['Shell', [
      ['ls', 'List files in the virtual home directory'],
      ['cat <file>', 'Print a file, e.g. cat about.txt'],
      ['cd <dir>', 'Change directory: projects, side-projects, ~'],
      ['pwd', 'Print the current directory'],
      ['history', 'Show the commands you’ve run'],
      ['date', 'Current date and time'],
      ['echo <text>', 'Print some text'],
      ['clear', 'Clear the terminal (Ctrl+L)'],
      ['help', 'Show this list'],
    ]],
  ];

  function helpOut() {
    const wrap = el('div', { class: 't-doc' });
    for (const [group, rows] of HELP) {
      wrap.append(el('div', { class: 't-help-group', text: group }));
      const g = el('div', { class: 't-help' });
      for (const [cmd, desc] of rows) {
        const base = cmd.split(' ')[0];
        const b = cmdLink(cmd.includes('<') ? base + ' ' : base, cmd);
        if (cmd.includes('<')) b.dataset.fill = '1';
        g.append(el('div', null, b), el('div', { class: 't-muted', text: desc }));
      }
      wrap.append(g);
    }
    wrap.append(el('div', { class: 't-p t-muted', text: 'Tab completes · ↑/↓ history · Ctrl+L clears · click any command to run it.' }));
    return wrap;
  }

  const sectionIds = () => ['about', 'highlights', 'currently', 'experience', 'projects', 'side-projects', 'skills', 'talks', 'education', 'languages', 'contact'];
  const projectArticles = () => $$('[data-file]', pane);
  const slug = (a) => a.dataset.file.replace(/\.md$/, '');

  function findProject(q) {
    const s = q.toLowerCase().replace(/\.md$/, '');
    const all = projectArticles();
    return all.find((a) => slug(a) === s || a.id === s) || all.find((a) => slug(a).startsWith(s));
  }

  const OPEN_APPS = ['terminal', 'browser', 'cv', 'pdf'];

  function openTarget(arg) {
    const t = (arg || '').toLowerCase().replace(/^#/, '').replace(/\/$/, '');
    if (!t) return print(err('open: missing operand. Try ', cmdLink('open cv'), ' or ', cmdLink('open terminal'), '.'));
    if (t === 'terminal') { show('terminal', { focus: true }); return print(el('div', { class: 't-p t-muted', text: 'Terminal is already open — you’re in it.' })); }
    if (t === 'browser' || t === 'cv' || t === 'main') { route('main'); return print(el('div', { class: 't-p t-muted', text: 'Opened the CV in the Browser window.' })); }
    if (t === 'pdf' || t === PDF.toLowerCase()) {
      const w = window.open(PDF, '_blank', 'noopener');
      return print(el('div', { class: 't-p' }, w ? 'Opening ' : 'Download: ', el('a', { href: PDF, class: 't-pdf' }, PDF)));
    }
    const p = findProject(t);
    const id = sectionIds().includes(t) ? t : p ? p.id : t.replace(/\.(txt|md)$/, '');
    if (cvTarget(id)) {
      route(id);
      return print(el('div', { class: 't-p t-muted', text: `Opened #${id} in the Browser window.` }));
    }
    return print(err(`open: unknown app or section '${arg}'. Try `, cmdLink('open cv'), ', ', cmdLink('open browser'), ' or ', cmdLink('open projects'), '.'));
  }

  function lsOut(path) {
    const list = entries(path);
    const ul = el('ul', { class: 't-ls' });
    const rel = path === term.cwd ? '' : term.cwd === '~' ? path.slice(2) + '/' : path + '/';
    for (const n of list) {
      let item;
      if (n.dir) item = cmdLink('ls ' + rel + n.name, n.name + '/');
      else if (n.pdf) item = el('a', { href: PDF, class: 't-pdf' }, n.name);
      else item = cmdLink('cat ' + rel + n.name, n.name);
      if (n.dir) item.className = 't-run t-dir';
      else if (!n.pdf) item.className = 't-run t-file';
      ul.append(el('li', null, item));
    }
    return ul;
  }

  function neofetch() {
    const art = [
      '   .-----------.',
      '   |  |\\   /|  |',
      '   |  | \\ / |  |',
      '   |  |  V  |  |',
      '   |  |     |  |',
      '    \\         /',
      '     \'.     .\'',
      '       \'-.-\'',
    ].join('\n');
    const kv = el('dl', { class: 't-kv' });
    const row = (k, v) => { kv.append(el('dt', { text: k }), v instanceof Node ? el('dd', null, v) : el('dd', { text: v })); };
    row('Name', $('#name').textContent.trim());
    row('Role', $('.hero .role').textContent.trim());
    row('Location', $('.hero [data-k="location"]').textContent.trim());
    row('Building', $('.hero [data-k="building"]').textContent.trim().replace(/^building\s+/i, ''));
    for (const s of $$('.hero .stats > div')) {
      row(s.dataset.k, norm(`${$('dd', s).textContent} ${$('dt', s).textContent}`).trim());
    }
    row('Languages', $$('#languages dl > div').map((r) => `${$('dt', r).textContent} ${$('dd', r).textContent}`).join(' · '));
    const mail = $('#contact a[href^="mailto:"]');
    row('Contact', el('a', { href: mail.getAttribute('href') }, mail.textContent.trim()));
    const src = $('#source-link');
    row('Source', el('a', { href: src.getAttribute('href'), rel: 'noopener' }, src.getAttribute('href').replace(/^https:\/\//, '')));
    row('Shell', 'web terminal (this page)');
    const head = el('div', null, el('span', { class: 't-user t-b', text: 'meda' }), '@', el('span', { class: 't-path t-b', text: 'hadush' }));
    const sw = el('div', { class: 'swatches', 'aria-hidden': 'true' });
    for (const c of ['#2b3040', '#ff9a9a', '#7ee2a0', '#f0c674', '#8fb8ff', '#c9a8ff', '#7fd8e8', '#e3e7ee']) sw.append(el('span', { style: `background:${c}` }));
    return el('div', { class: 'neofetch' },
      el('pre', { 'aria-hidden': 'true', text: art }),
      el('div', null, head, el('div', { class: 't-muted', 'aria-hidden': 'true', text: '-----------' }), kv, sw));
  }

  const COMMANDS = {
    help: () => print(helpOut()),
    clear: () => { term.out.textContent = ''; },
    whoami: () => print(doc($('#terminal'))),
    about: () => print(doc($('#about'))),
    highlights: () => print(doc($('#highlights'))),
    currently: () => print(doc($('#currently'))),
    experience: () => print(doc($('#experience'))),
    skills: () => print(doc($('#skills'))),
    talks: () => print(doc($('#talks'))),
    languages: () => print(doc($('#languages'))),
    education: () => print(doc($('#education'), $('#languages'))),
    contact: () => print(doc($('#contact'))),
    projects: (args) => {
      if (!args.length) return print(doc($('#projects'), $('#side-projects')));
      const p = findProject(args[0]);
      if (p) return print(doc(p));
      return print(err(`projects: no project called '${args[0]}'. Try one of: `),
        el('div', { class: 't-p' }, ...projectArticles().flatMap((a, i) => [i ? ' ' : '', cmdLink('projects ' + slug(a), slug(a))])));
    },
    cv: () => {
      route('main');
      print(el('div', { class: 't-p' }, 'Opened the CV in the Browser window. PDF: ', el('a', { href: PDF, class: 't-pdf' }, PDF)));
    },
    open: (args) => openTarget(args.join(' ')),
    ls: (args) => {
      const paths = args.filter((a) => !a.startsWith('-'));
      if (!paths.length) return print(lsOut(term.cwd));
      for (const p of paths) {
        const r = resolve(p, term.cwd);
        if (!r || r.error) print(err(`ls: cannot access '${p}': ${r ? r.error : 'No such file or directory'}`));
        else if (r.kind === 'dir') { if (paths.length > 1) print(el('div', { class: 't-p t-b', text: p + ':' })); print(lsOut(r.path)); }
        else print(el('div', { class: 't-p', text: p }));
      }
    },
    cd: (args) => {
      const r = resolve(args[0] || '~', term.cwd);
      if (!r || r.error) return print(err(`cd: ${args[0]}: ${r ? r.error : 'No such file or directory'}`));
      if (r.kind !== 'dir') return print(err(`cd: ${args[0]}: Not a directory`));
      setCwd(r.path);
    },
    pwd: () => print(term.cwd.replace(/^~/, '/home/meda')),
    cat: (args) => {
      const files = args.filter((a) => !a.startsWith('-'));
      if (!files.length) return print(err('cat: missing file operand. Try '), el('div', null, cmdLink('cat about.txt'), ' or ', cmdLink('ls')));
      for (const f of files) {
        const r = resolve(f, term.cwd);
        if (!r || r.error) print(err(`cat: ${f}: ${r ? r.error : 'No such file or directory'}`));
        else if (r.kind === 'dir') print(err(`cat: ${f}: Is a directory`));
        else print(readFile(r.node));
      }
    },
    history: () => {
      const ol = el('div', { class: 't-doc' });
      term.hist.forEach((h, i) => ol.append(el('div', { class: 't-p' }, el('span', { class: 't-muted', text: String(i + 1).padStart(4, ' ') + '  ' }), h)));
      print(ol);
    },
    date: () => print(new Date().toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'long' })),
    neofetch: () => print(neofetch()),
    theme: (args) => {
      const want = (args[0] || '').toLowerCase();
      if (want && want !== 'light' && want !== 'dark') return print(err(`theme: unknown theme '${args[0]}'. Use light or dark.`));
      setTheme(want || (currentTheme() === 'light' ? 'dark' : 'light'));
      print(el('div', { class: 't-p t-muted', text: `Desktop theme: ${currentTheme()}` }));
    },
    echo: (args, raw) => print(raw.replace(/^\s*echo\s?/, '')),
    exit: () => hide('terminal', 'closed'),
    close: () => hide('terminal', 'closed'),
  };
  const NAMES = Object.keys(COMMANDS).sort();

  function tokenize(s) {
    return (s.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((t) => t.replace(/^(["'])(.*)\1$/, '$2'));
  }

  function run(raw) {
    const cmdline = raw.trim();
    const lineNode = echo(raw);
    if (cmdline) {
      if (term.hist[term.hist.length - 1] !== cmdline) term.hist.push(cmdline);
      if (term.hist.length > 200) term.hist.shift();
    }
    term.hi = term.hist.length;
    term.draft = '';
    const [name, ...args] = tokenize(cmdline);
    if (name) {
      const fn = COMMANDS[name.toLowerCase()];
      if (fn) fn(args, cmdline);
      else print(el('div', { class: 't-p' }, el('span', { class: 't-err', text: `${name}: command not found.` }), ' Type ', cmdLink('help'), ' to see what you can do.'));
    }
    scrollAfter(lineNode);
  }

  /* Tab completion */
  function lcp(list) {
    let p = list[0];
    for (const s of list) while (!s.startsWith(p)) p = p.slice(0, -1);
    return p;
  }

  function pathCandidates(prefix, dirsOnly) {
    const cut = prefix.lastIndexOf('/');
    const dirPart = cut >= 0 ? prefix.slice(0, cut + 1) : '';
    const r = resolve(dirPart || '.', term.cwd);
    if (!r || r.kind !== 'dir') return [];
    return entries(r.path)
      .filter((n) => !dirsOnly || n.dir)
      .map((n) => dirPart + n.name + (n.dir ? '/' : ''));
  }

  function complete() {
    const inp = term.input;
    const v = inp.value;
    if ((inp.selectionStart ?? v.length) !== v.length) return false;
    const parts = v.split(/\s+/);
    const cur = parts[parts.length - 1];
    let cands;
    if (parts.length === 1) {
      if (!cur) return false;
      cands = NAMES;
    } else {
      const c = parts[0].toLowerCase();
      if (c === 'cat' || c === 'ls') cands = pathCandidates(cur, false);
      else if (c === 'cd') cands = pathCandidates(cur, true);
      else if (c === 'open') cands = [...OPEN_APPS, ...sectionIds(), ...projectArticles().map(slug)];
      else if (c === 'projects') cands = projectArticles().map(slug);
      else if (c === 'theme') cands = ['light', 'dark'];
      else return false;
    }
    const matches = [...new Set(cands)].filter((c) => c.startsWith(cur));
    if (!matches.length) return false;
    const setLast = (s) => {
      parts[parts.length - 1] = s;
      inp.value = parts.join(' ');
      inp.setSelectionRange(inp.value.length, inp.value.length);
      syncMirror();
    };
    if (matches.length === 1) {
      if (matches[0] === cur && cur.endsWith('/')) return false;
      setLast(matches[0] + (matches[0].endsWith('/') ? '' : ' '));
      return true;
    }
    const common = lcp(matches);
    if (common.length > cur.length) { setLast(common); return true; }
    const lineNode = echo(v);
    print(el('div', { class: 't-ls' }, ...matches.map((m) => el('span', { class: m.endsWith('/') ? 't-dir' : 't-muted', text: m }))));
    scrollAfter(lineNode);
    return true;
  }

  /* Input events */
  function finishAutorun() {
    if (!term.autorun) return;
    clearTimeout(term.autorun);
    term.autorun = null;
    term.input.value = '';
    run('help');
    term.out.setAttribute('aria-live', 'polite');
  }

  term.form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (term.autorun) finishAutorun();
    const v = term.input.value;
    term.input.value = '';
    syncMirror();
    run(v);
  });

  term.input.addEventListener('keydown', (e) => {
    if (term.autorun) finishAutorun();
    const inp = term.input;
    if (e.key === 'Tab' && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      if (complete()) e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      if (!term.hist.length) return;
      e.preventDefault();
      if (term.hi === term.hist.length) term.draft = inp.value;
      term.hi = Math.max(0, term.hi - 1);
      inp.value = term.hist[term.hi];
      inp.setSelectionRange(inp.value.length, inp.value.length);
    } else if (e.key === 'ArrowDown') {
      if (term.hi >= term.hist.length) return;
      e.preventDefault();
      term.hi++;
      inp.value = term.hi === term.hist.length ? term.draft : term.hist[term.hi];
      inp.setSelectionRange(inp.value.length, inp.value.length);
    } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      COMMANDS.clear();
    } else if (e.ctrlKey && (e.key === 'c' || e.key === 'C') && inp.selectionStart === inp.selectionEnd) {
      e.preventDefault();
      echo(inp.value + '^C');
      inp.value = '';
      term.scrollToEnd();
    } else if (e.key === 'Escape' && inp.value) {
      inp.value = '';
    }
    requestAnimationFrame(syncMirror);
  });
  for (const ev of ['input', 'keyup', 'click', 'select', 'focus']) term.input.addEventListener(ev, syncMirror);
  d.addEventListener('selectionchange', () => { if (d.activeElement === term.input) syncMirror(); });
  term.input.addEventListener('focus', () => { term.field.classList.add('is-focused'); queueViewport(); });
  term.input.addEventListener('blur', () => { term.field.classList.remove('is-focused'); queueViewport(); });

  /* Clicking empty terminal space focuses the prompt (but keeps text selection possible) */
  term.scroller.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input')) return;
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;
    term.input.focus({ preventScroll: true });
  });

  /* Clickable commands: help entries, ls output, chips */
  term.win.addEventListener('click', (e) => {
    const b = e.target.closest('[data-run]');
    if (!b) return;
    const cmd = b.dataset.run;
    const touch = coarseMQ.matches;
    if (b.dataset.fill) {
      term.input.value = cmd;
      syncMirror();
      term.input.focus({ preventScroll: true });
      term.input.setSelectionRange(cmd.length, cmd.length);
      return;
    }
    if (term.autorun) finishAutorun();
    run(cmd);
    if (!touch && state.terminal.s === 'open' && active === 'terminal') term.input.focus({ preventScroll: true });
  });

  /* Typing anywhere on the desktop goes to the terminal */
  d.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
    const ae = d.activeElement;
    if (ae === term.input || state.terminal.s !== 'open') return;
    const onBody = !ae || ae === d.body || ae === d.documentElement;
    const inTerm = term.win.contains(ae) && !ae.matches('a, button');
    if (!onBody && !inTerm) return;
    focusWin('terminal');
    term.input.focus({ preventScroll: true });
  });

  term.reset = () => {
    term.out.textContent = '';
    setCwd('~');
    welcome();
    run('help');
  };

  function welcome() {
    print(el('div', { class: 't-p t-muted' },
      'Welcome to meda@hadush. This is a real (small) shell: type a command or click one. ',
      'The CV is open in the ', el('a', { href: '#main' }, 'Browser window'), '.'));
  }

  function startTerminal() {
    welcome();
    if (reduced()) { run('help'); term.out.setAttribute('aria-live', 'polite'); return; }
    const word = 'help';
    let i = 0;
    const step = () => {
      if (!term.autorun) return;
      i++;
      term.input.value = word.slice(0, i);
      syncMirror();
      if (i < word.length) term.autorun = setTimeout(step, 70);
      else term.autorun = setTimeout(finishAutorun, 160);
    };
    term.autorun = setTimeout(step, root.classList.contains('boot') ? 650 : 200);
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  function init() {
    pane.setAttribute('tabindex', '0');
    root.classList.toggle('can-drag', canDrag());
    setTheme(currentTheme(), false);
    layoutFromCSS();
    onViewport();
    tick();
    focusWin('browser');
    focusWin('terminal');
    syncMirror();
    startTerminal();

    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && hash !== 'terminal' && cvTarget(hash) !== undefined) {
      requestAnimationFrame(() => goTo(hash, { smooth: false, focus: false }));
      if (compact()) focusWin('browser');
    } else if (!coarseMQ.matches) {
      term.input.focus({ preventScroll: true });
    }

    if (root.classList.contains('boot')) {
      store('session', 'booted', '1');
      setTimeout(() => root.classList.remove('boot'), 1000);
    }
  }

  try {
    init();
  } catch (e) {
    root.classList.remove('js', 'boot');
    throw e;
  }
})();
