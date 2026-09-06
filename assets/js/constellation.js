/* ==========================================================================
   constellation.js — 3D skill graph rendered on a 2D canvas
   A rotating sphere of skill nodes, clustered by domain, orbiting a wireframe
   icosahedron "core". Drag to rotate, hover for details, filter by category.
   ========================================================================== */
(() => {
  'use strict';
  const stage = document.getElementById('constellation-stage');
  const canvas = document.getElementById('skills-canvas');
  const tip = document.getElementById('constellation-tip');
  const legend = document.getElementById('constellation-legend');
  if (!stage || !canvas) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  const CATS = {
    ai: { label: 'AI / LLM security', v: '--cyan', rgb: '--accent-rgb' },
    agents: { label: 'Agentic AI & engineering', v: '--violet', rgb: '--violet-rgb' },
    detect: { label: 'Detection & response', v: '--green', rgb: '--green-rgb' },
    gov: { label: 'Governance & infra', v: '--amber', rgb: '--amber-rgb' },
    mod: { label: 'Systems & desktop', v: '--rose', rgb: '--rose-rgb' }
  };
  const SKILLS = [
    ['ai', 'Prompt injection', 'attack & defense patterns'], ['ai', 'Jailbreak research', 'adversarial prompting'], ['ai', 'Judge models', 'cascaded evaluation'],
    ['ai', 'OWASP LLM Top 10', 'threat modelling'], ['ai', 'Red-teaming', 'LLM apps & agents'], ['ai', 'Model evaluation', 'weighted scoring'],
    ['ai', 'Output handling', 'structured output'], ['ai', 'RAG security', 'embedding weaknesses'], ['ai', 'LLM supply chain', 'models & plugins'], ['ai', 'System-prompt hardening', 'leakage defenses'],
    ['agents', 'Multi-agent orchestration', '7-agent fleets'], ['agents', 'Tool-use guardrails', 'least agency'], ['agents', 'Agent observability', 'FleetHawk'],
    ['agents', 'Evals', 'grading pipelines'], ['agents', 'Gemini · Claude APIs', 'LLM integration'], ['agents', 'Python', '5+ years'],
    ['agents', 'TypeScript', 'Next.js · Node'], ['agents', 'Next.js', 'full-stack'], ['agents', 'Voice pipelines', 'STT / TTS'],
    ['detect', 'Splunk', 'SIEM · use cases'], ['detect', 'MITRE ATT&CK', 'mapping'], ['detect', 'Detection-as-code', 'engineering'],
    ['detect', 'Incident response', 'RIO methodology'], ['detect', 'Fraud investigation', 'banking'], ['detect', 'HIPS', 'endpoint'],
    ['detect', 'IDS / IPS', 'network'], ['detect', 'Log analysis', 'triage'],
    ['gov', 'FINMA', 'regulated banking'], ['gov', 'GDPR', 'privacy by design'], ['gov', 'NIST CSF', 'framework'],
    ['gov', 'OWASP Top 10', 'web'], ['gov', 'RBAC', 'multi-role'], ['gov', 'Session security', 'auth flows'],
    ['gov', 'Docker', 'containers'], ['gov', 'PostgreSQL', 'data'],
    ['mod', 'C# · .NET', 'runtime plugins & services'], ['mod', 'Rust · Tauri', 'desktop apps'], ['mod', 'C++', 'telemetry & native plugins'],
    ['mod', 'React', 'tool UIs'], ['mod', 'Real-time voice AI', 'STT · LLM · TTS'], ['mod', 'Computer vision', 'webcam head tracking'], ['mod', 'Build pipelines', 'declarative presets · packaging']
  ];

  /* ---- geometry ---- */
  const R = 1;
  const catKeys = Object.keys(CATS);
  const centers = {};
  catKeys.forEach((k, i) => {
    // spread cluster centres around the sphere
    const phi = Math.acos(1 - 2 * (i + 0.5) / catKeys.length);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    centers[k] = [Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)];
  });
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const nodes = SKILLS.map(([cat, name, sub], i) => {
    const c = centers[cat];
    const spread = 0.62;
    const p = norm([c[0] + (rand() - 0.5) * spread * 2, c[1] + (rand() - 0.5) * spread * 2, c[2] + (rand() - 0.5) * spread * 2]);
    const r = R * (0.86 + rand() * 0.16);
    return { cat, name, sub, x: p[0] * r, y: p[1] * r, z: p[2] * r, px: 0, py: 0, pz: 0, s: 1, id: i };
  });
  // edges: 2 nearest neighbours within category + cluster anchor to core
  const edges = [];
  const seen = new Set();
  nodes.forEach((a) => {
    const near = nodes.filter((b) => b !== a && b.cat === a.cat)
      .map((b) => [Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z), b]).sort((p, q) => p[0] - q[0]).slice(0, 2);
    near.forEach(([, b]) => { const key = a.id < b.id ? a.id + '-' + b.id : b.id + '-' + a.id; if (!seen.has(key)) { seen.add(key); edges.push([a, b]); } });
  });
  catKeys.forEach((k) => {
    const c = centers[k];
    const anchor = nodes.filter((n) => n.cat === k).sort((a, b) => Math.hypot(a.x - c[0], a.y - c[1], a.z - c[2]) - Math.hypot(b.x - c[0], b.y - c[1], b.z - c[2]))[0];
    if (anchor) edges.push([anchor, null]);
  });
  const pulses = [];

  // icosahedron core
  const t = (1 + Math.sqrt(5)) / 2;
  const icoV = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map((v) => norm(v).map((c) => c * 0.34));
  const icoE = [];
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) { const d = Math.hypot(icoV[i][0] - icoV[j][0], icoV[i][1] - icoV[j][1], icoV[i][2] - icoV[j][2]); if (d < 0.38) icoE.push([i, j]); }

  /* ---- state ---- */
  let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, scale = 1;
  let rotX = 0.35, rotY = 0, velY = reduced ? 0 : 0.0032, velX = 0, coreSpin = 0;
  let dragging = false, lastPX = 0, lastPY = 0, moved = 0;
  let hovered = null, activeCat = 'all', running = false, colors = {}, textColor = '#e7edf7', mutedColor = '#7f8a9e';
  let mouse = { x: -1, y: -1 };

  const readColors = () => {
    colors = {};
    catKeys.forEach((k) => { colors[k] = { hex: cssVar(CATS[k].v) || '#22d3ee', rgb: cssVar(CATS[k].rgb) || '34,211,238' }; });
    textColor = cssVar('--text') || '#e7edf7';
    mutedColor = cssVar('--muted') || '#7f8a9e';
  };
  readColors();
  document.addEventListener('themechange', readColors);

  const resize = () => {
    const r = stage.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = r.width; h = r.height;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2; cy = h / 2; scale = Math.min(w, h) * 0.36;
  };
  new ResizeObserver(resize).observe(stage);
  resize();

  const project = (x, y, z) => {
    // rotate around Y then X
    const cyv = Math.cos(rotY), syv = Math.sin(rotY), cxv = Math.cos(rotX), sxv = Math.sin(rotX);
    const x1 = x * cyv + z * syv, z1 = -x * syv + z * cyv;
    const y2 = y * cxv - z1 * sxv, z2 = y * sxv + z1 * cxv;
    const persp = 2.4 / (2.4 - z2);
    return [cx + x1 * scale * persp, cy + y2 * scale * persp, z2, persp];
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    // ambient glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.4);
    g.addColorStop(0, `rgba(${colors.ai.rgb},0.10)`); g.addColorStop(0.5, `rgba(${colors.agents.rgb},0.05)`); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // orbit rings
    ctx.strokeStyle = `rgba(${colors.ai.rgb},0.12)`; ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      ctx.beginPath();
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const tilt = k * 1.05;
        const p = project(Math.cos(a) * 0.98, Math.sin(a) * Math.sin(tilt) * 0.98, Math.sin(a) * Math.cos(tilt) * 0.98);
        if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
      }
      ctx.stroke();
    }
    // project nodes
    nodes.forEach((n) => { const p = project(n.x, n.y, n.z); n.px = p[0]; n.py = p[1]; n.pz = p[2]; n.s = p[3]; });
    // core
    const cs = Math.cos(coreSpin), sn = Math.sin(coreSpin);
    const coreP = icoV.map(([x, y, z]) => project(x * cs - z * sn, y, x * sn + z * cs));
    const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 0.42);
    coreG.addColorStop(0, `rgba(${colors.ai.rgb},0.35)`); coreG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = coreG; ctx.beginPath(); ctx.arc(cx, cy, scale * 0.42, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(${colors.ai.rgb},0.55)`; ctx.lineWidth = 1;
    icoE.forEach(([i, j]) => { ctx.beginPath(); ctx.moveTo(coreP[i][0], coreP[i][1]); ctx.lineTo(coreP[j][0], coreP[j][1]); ctx.stroke(); });
    ctx.fillStyle = `rgba(${colors.ai.rgb},0.9)`;
    coreP.forEach((p) => { ctx.beginPath(); ctx.arc(p[0], p[1], 1.6 * p[3], 0, Math.PI * 2); ctx.fill(); });
    ctx.font = `600 ${Math.max(9, scale * 0.085)}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center'; ctx.fillStyle = `rgba(${colors.ai.rgb},0.95)`;
    ctx.fillText('AI SECURITY', cx, cy + 4);

    const isDim = (n) => activeCat !== 'all' && n.cat !== activeCat;
    // edges
    edges.forEach(([a, b]) => {
      const dim = isDim(a) || (b && isDim(b));
      const hi = hovered && (a === hovered || b === hovered);
      const depth = b ? (a.pz + b.pz) / 2 : a.pz / 2;
      const alpha = dim ? 0.04 : (hi ? 0.9 : 0.14 + (depth + 1) * 0.12);
      ctx.strokeStyle = `rgba(${colors[a.cat].rgb},${alpha.toFixed(3)})`;
      ctx.lineWidth = hi ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b ? b.px : cx, b ? b.py : cy); ctx.stroke();
    });
    // pulses
    if (!reduced && pulses.length < 6 && Math.random() < 0.05) { const e = edges[Math.floor(Math.random() * edges.length)]; pulses.push({ e, t: 0, s: 0.012 + Math.random() * 0.01 }); }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]; p.t += p.s; if (p.t > 1) { pulses.splice(i, 1); continue; }
      const [a, b] = p.e; if (isDim(a)) continue;
      const bx = b ? b.px : cx, by = b ? b.py : cy;
      const x = a.px + (bx - a.px) * p.t, y = a.py + (by - a.py) * p.t;
      ctx.fillStyle = `rgba(${colors[a.cat].rgb},0.95)`; ctx.shadowColor = colors[a.cat].hex; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
    // nodes (back to front)
    const order = nodes.slice().sort((a, b) => a.pz - b.pz);
    order.forEach((n) => {
      const dim = isDim(n);
      const hi = n === hovered;
      const depthA = 0.35 + (n.pz + 1) * 0.325;
      const alpha = dim ? 0.12 : depthA;
      const r = (hi ? 6.5 : 3.2 + (activeCat === n.cat ? 1.2 : 0)) * n.s;
      ctx.fillStyle = `rgba(${colors[n.cat].rgb},${alpha.toFixed(3)})`;
      if (!dim) { ctx.shadowColor = colors[n.cat].hex; ctx.shadowBlur = hi ? 22 : 10; }
      ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      if (hi) { ctx.strokeStyle = `rgba(${colors[n.cat].rgb},0.6)`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(n.px, n.py, r + 6, 0, Math.PI * 2); ctx.stroke(); }
      // labels for front-facing nodes, or the active category
      const showLabel = !dim && (n.pz > 0.05 || hi || activeCat === n.cat);
      if (showLabel) {
        const fs = Math.max(9, 10.5 * n.s);
        ctx.font = `${hi ? 600 : 500} ${fs}px "Inter", system-ui, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillStyle = hi ? textColor : (activeCat === n.cat ? textColor : mutedColor);
        ctx.globalAlpha = hi ? 1 : Math.min(1, 0.45 + (n.pz + 0.2) * 0.7);
        ctx.fillText(n.name, n.px + r + 5, n.py + fs * 0.35);
        ctx.globalAlpha = 1;
      }
    });
  };

  const frame = () => {
    if (!running) return;
    if (!dragging) {
      rotY += velY; rotX += velX;
      velX *= 0.94;
      if (!reduced) velY += (0.0032 - velY) * 0.02;
      // gently bring tilt back toward a nice angle
      rotX += (0.35 - rotX) * 0.005;
    }
    coreSpin += reduced ? 0 : 0.012;
    draw();
    requestAnimationFrame(frame);
  };
  new IntersectionObserver((en) => { const was = running; running = en[0].isIntersecting; if (running && !was) requestAnimationFrame(frame); }, { threshold: 0.1 }).observe(stage);

  /* ---- interaction ---- */
  canvas.style.touchAction = 'pan-y';
  const pick = (x, y) => {
    let best = null, bd = 18 * 18;
    nodes.forEach((n) => { if (activeCat !== 'all' && n.cat !== activeCat) return; const d = (n.px - x) ** 2 + (n.py - y) ** 2; if (d < bd) { bd = d; best = n; } });
    return best;
  };
  const showTip = (n) => {
    if (!n) { tip.classList.remove('show'); return; }
    tip.querySelector('b').textContent = n.name;
    tip.querySelector('span').textContent = CATS[n.cat].label + ' · ' + n.sub;
    tip.style.left = Math.max(70, Math.min(w - 70, n.px)) + 'px';
    tip.style.top = n.py + 'px';
    tip.classList.add('show');
  };
  canvas.addEventListener('pointerdown', (e) => { dragging = true; moved = 0; lastPX = e.clientX; lastPY = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    if (dragging) {
      const dx = e.clientX - lastPX, dy = e.clientY - lastPY; moved += Math.abs(dx) + Math.abs(dy);
      velY = dx * 0.005; velX = dy * 0.004;
      rotY += velY; rotX = Math.max(-1.2, Math.min(1.2, rotX + velX));
      lastPX = e.clientX; lastPY = e.clientY;
      hovered = null; showTip(null);
    } else {
      hovered = pick(mouse.x, mouse.y);
      showTip(hovered);
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
    }
  });
  const endDrag = (e) => { if (!dragging) return; dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch (err) {} if (moved < 6) { hovered = pick(mouse.x, mouse.y); showTip(hovered); } };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);
  canvas.addEventListener('pointerleave', () => { if (!dragging) { hovered = null; showTip(null); } });

  legend?.addEventListener('click', (e) => {
    const b = e.target.closest('.legend-btn'); if (!b) return;
    activeCat = b.dataset.cat;
    Array.from(legend.querySelectorAll('.legend-btn')).forEach((x) => x.classList.toggle('active', x === b));
    hovered = null; showTip(null);
    const hint = document.getElementById('constellation-hint');
    if (hint) hint.textContent = activeCat === 'all' ? 'drag · hover · filter' : CATS[activeCat].label + ' · ' + nodes.filter((n) => n.cat === activeCat).length + ' nodes';
    if (!running) draw();
  });
  window.Constellation = { focus(cat) { const b = legend && legend.querySelector(`[data-cat="${cat}"]`); if (b) b.click(); } };
  draw();
})();
