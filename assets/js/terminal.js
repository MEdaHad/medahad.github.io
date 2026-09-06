/* ==========================================================================
   terminal.js — interactive portfolio shell
   ========================================================================== */
(() => {
  'use strict';
  const body = document.getElementById('term-body');
  const form = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  const chips = document.getElementById('term-chips');
  if (!body || !form || !input) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));
  const history = [];
  let hIdx = -1, busy = false, introDone = false;

  /* ---------- output helpers ---------- */
  const line = (html = '', cls = '') => {
    const el = document.createElement('div');
    el.className = 'term-line' + (cls ? ' ' + cls : '');
    el.innerHTML = html || '&nbsp;';
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  };
  const echo = (cmd) => line(`<span class="prompt">medhane@lausanne</span> <span class="path">~</span> $ ${esc(cmd)}`, 'cmd');
  const lines = async (arr, delay = 28) => { for (const l of arr) { if (Array.isArray(l)) line(l[0], l[1]); else line(l); await sleep(delay); } };
  const bar = (pct, w = 120) => `<span class="bar" style="width:${Math.round(w * pct / 100)}px"></span>`;
  const link = (href, text, ext = false) => `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;

  /* ---------- data ---------- */
  const D = {
    whoami: [
      ['<b>Medhane Hadush</b> — AI/LLM security · cybersecurity engineering · agentic AI', 'head'],
      'Lausanne, Switzerland · English C1 · French B1 · Amharic C1 · Tigrinya C1',
      '',
      'Cybersecurity engineer with hands-on depth in AI/LLM security: adversarial attack-pattern',
      'research, judge-model evaluation pipelines and training infrastructure mapped to the',
      'OWASP LLM Top 10. Experience inside a national security agency (INSA, Ethiopia) and a',
      'FINMA-regulated bank (BCV). Keynote speaker, Swiss Cyber AI Conference 2026 (Lugano).',
      'Off the clock: game mods as RioticGamer (PedTalk AI, 4,400+ downloads).',
      '',
      ['tip: try <b>skills</b>, <b>experience</b>, <b>agents</b> or <b>scan</b>', 'muted']
    ],
    skills: [
      ['AI / LLM security', 'head'],
      `  adversarial prompt engineering  ${bar(95)}  expert`,
      `  prompt injection & jailbreaks   ${bar(94)}  expert`,
      `  judge-model evaluation          ${bar(90)}  advanced`,
      `  OWASP LLM Top 10 modelling      ${bar(92)}  expert`,
      ['Agentic AI & engineering', 'head'],
      `  multi-agent orchestration       ${bar(90)}  advanced`,
      `  tool-use guardrails & evals     ${bar(88)}  advanced`,
      `  Python · TypeScript · Next.js   ${bar(86)}  advanced`,
      `  PostgreSQL · Docker · Linux     ${bar(86)}  advanced`,
      ['Detection & response', 'head'],
      `  Splunk · detection-as-code      ${bar(88)}  advanced`,
      `  MITRE ATT&CK · log analysis     ${bar(88)}  advanced`,
      `  incident response (RIO)         ${bar(90)}  advanced`,
      `  HIPS · IDS/IPS · Nginx          ${bar(80)}  proficient`,
      ['Governance & identity', 'head'],
      `  FINMA · GDPR · NIST CSF         ${bar(85)}  advanced`,
      `  RBAC · auth · session security  ${bar(88)}  advanced`,
      ['', ''],
      [`see the 3D version → ${link('#skills', 'skill graph')}`, 'muted']
    ],
    experience: [
      ['2025 – now   Independent · AI security engineering (Lausanne)', 'head'],
      '  · shipped an LLM security training platform: 385 labs, OWASP LLM Top 10, automated adversarial grading',
      '  · architected a cascaded judge-model evaluation pipeline (structured output, graceful degradation, token budgets)',
      '  · multi-role RBAC, GDPR consent, disposable-email blocking, bot protection, credential rotation',
      '  · keynote, Swiss Cyber AI Conference 2026 · guest instructor, Powercoders Bern',
      ['2024         Technical Security Coordinator · BCV (FINMA-regulated bank)', 'head'],
      '  · enhanced HIPS methodology → better endpoint intrusion detection across the estate',
      '  · developed the RIO incident-response methodology, adopted by the team',
      '  · led fraud investigations → lower exposure, faster SLAs',
      ['2023 – 2024  Cybersecurity Engineer (internship) · BCV', 'head'],
      '  · tuned Splunk SIEM use cases · integrated MITRE ATT&CK into detection & response',
      ['2018 – 2020  Cybersecurity Analyst · INSA (national security agency, Ethiopia)', 'head'],
      '  · applied ML to automate cryptanalysis · built an internal security training platform',
      '  · designed & delivered national cybersecurity awareness programmes',
      ['', ''],
      [`full timeline → ${link('#experience', '#experience')}`, 'muted']
    ],
    projects: [
      ['QbitDojo', 'head'], `  AI security training platform · 385 labs · OWASP LLM Top 10 · ${link('https://qbitdojo.com', 'qbitdojo.com', true)}`,
      ['Judge-model evaluation pipeline', 'head'], '  cascaded multi-model scoring: blocks attack · preserves function · minimality',
      ['QAISP certification methodology', 'head'], '  Associate / Practitioner / Expert · 150-question exam bank · QR-verifiable certificates',
      ['FleetHawk', 'head'], `  silent-failure detection for AI agent fleets · ${link('https://github.com/MEdaHad/fleethawk', 'github.com/MEdaHad/fleethawk', true)}`,
      ['MedaXP AI Fleet', 'head'], '  7-agent autonomous development system with human approval gates',
      ['', ''], [`details → ${link('#projects', '#projects')}`, 'muted']
    ],
    agents: [
      ['Agentic AI — what I actually run', 'head'],
      '  orchestration   7-agent development fleet: planner · coder · reviewer · tester · security · docs',
      '  observability   FleetHawk CLI: wrong models, stale configs, ghost monitors, silent agents',
      '  in production   PedTalk AI: LLM NPC dialogue with context, memory & voice inside GTA V',
      '  support         Discord bot: deterministic troubleshooting first, Gemini knowledge base second',
      '  guardrails      least agency · tool permissioning · token budgets · raw telemetry never hits the model',
      '  evaluation      cascaded judge models, structured output, weighted scoring',
      ['', ''],
      [`demo → ${link('#ai-security', '#ai-security')}`, 'muted']
    ],
    mods: [
      ['RioticGamer — game modding', 'head'],
      `  PedTalk AI               GTA V · LSPDFR   voice-driven AI NPC dialogue     4,454+ downloads ${link('https://www.lcpdfr.com/downloads/gta5mods/scripts/54809-pedtalk-ai-v10-community-edition/', '[lcpdfr]', true)}`,
      '  Advanced K9 Tactics      GTA V · LSPDFR   realistic K9 partner             900+ downloads',
      '  PedTalk Callouts         GTA V · LSPDFR   callouts on the PedTalk context API',
      '  PedTalk PULSE MDT        GTA V · LSPDFR   offline-first records layer',
      '  Riotic Key Manager       GTA V · tool     resolves keybinding conflicts safely',
      '  GTA V Animation Lab      GTA V · tool     local-first animation catalog',
      '  Riotic Livery Studio     GTA V · tool     repaint & package vehicle mods',
      '  SCS Skin Studio          ETS2 · ATS       paint-job mod studio (Rust · Tauri)',
      '  Riotic Vehicle Studio    ETS2 · ATS       build · paint · convert vehicles',
      '  Halogen                  ETS2 · ATS       declarative graphics/weather builds',
      '  RoadMate                 ETS2 · ATS       telemetry + voice companion',
      '  EYVRO                    sim racing       webcam head tracking → OpenTrack',
      ['', ''],
      [`${link('https://www.patreon.com/c/RioticGamer', 'patreon', true)} · ${link('https://discord.gg/EQBp44AvH', 'discord', true)} · ${link('#modding', '#modding')}`, 'muted']
    ],
    talks: [
      ['Speaking & teaching', 'head'],
      '  keynote     Swiss Cyber AI Conference 2026, Lugano (April 2026)',
      '              "Hacking LLM Applications: Attack Patterns, Defense Strategies, and Why AI Security Training Matters"',
      '  instructor  Powercoders ICT Bootcamp, Bern — LLM security & red-teaming sessions',
      '  programmes  national cybersecurity awareness training, INSA (2018 – 2020)',
      ['Education', 'head'],
      '  BSc Software Engineering, Microlink IT College (2013 – 2017)',
      '  Cybersecurity Certification, Ariel University (2018)',
      '  Powercoders ICT Bootcamp, Bern — alumnus 2023, partner & instructor'
    ],
    contact: [
      ['Contact', 'head'],
      `  email     ${link('mailto:medhane.hadush@powercoders.org', 'medhane.hadush@powercoders.org')}`,
      `  linkedin  ${link('https://linkedin.com/in/medhane-hadush', 'linkedin.com/in/medhane-hadush', true)}`,
      `  github    ${link('https://github.com/MEdaHad', 'github.com/MEdaHad', true)}`,
      `  cv        ${link('MedhaneHadush_CV.pdf', 'MedhaneHadush_CV.pdf', true)}`,
      '  location  Lausanne, Switzerland'
    ],
    help: [
      ['available commands', 'head'],
      '  whoami        profile summary          skills        stack, grouped',
      '  experience    roles & impact           projects      what I\'ve shipped',
      '  agents        agentic-AI work          mods          game modding (RioticGamer)',
      '  scan          OWASP LLM Top 10 demo    talks         speaking & education',
      '  contact       how to reach me          cv            open the PDF',
      '  theme         dark | light             open <id>     jump to a section',
      '  neofetch      system card              matrix        …',
      '  ls · cat · history · clear · date · echo · sudo · exit',
      ['', ''],
      ['↑ ↓ history · Tab completes · click the chips below', 'muted']
    ]
  };
  const FILES = {
    'about.txt': D.whoami, 'skills.txt': D.skills, 'experience.md': D.experience, 'projects.md': D.projects,
    'agents.md': D.agents, 'mods.md': D.mods, 'talks.md': D.talks, 'contact.txt': D.contact,
    'secrets.env': [['permission denied — nice try. this is exactly the kind of thing LLM02 is about.', 'err']]
  };

  /* ---------- scan demo ---------- */
  const scan = async (quick = false) => {
    const cats = [
      ['LLM01', 'prompt injection', 14], ['LLM02', 'sensitive info disclosure', 9], ['LLM03', 'supply chain', 6],
      ['LLM04', 'data & model poisoning', 7], ['LLM05', 'improper output handling', 11], ['LLM06', 'excessive agency', 8],
      ['LLM07', 'system prompt leakage', 10], ['LLM08', 'vector & embedding weaknesses', 6], ['LLM09', 'misinformation', 5], ['LLM10', 'unbounded consumption', 7]
    ];
    line('llm-scan 2.6 · target: <b>llm-app</b> · profile: <b>owasp-llm-top10</b> · judge cascade: A → B → C', 'info');
    await sleep(quick ? 80 : 250);
    let total = 0, blocked = 0;
    for (const [id, name, payloads] of cats) {
      const el = line(`  [${id}] ${name.padEnd(30, ' ')} scanning…`, 'muted');
      const steps = quick ? 3 : 6;
      for (let s = 1; s <= steps; s++) { await sleep(quick ? 25 : 55); el.innerHTML = `  [${id}] ${name.padEnd(30, ' ')} ${bar((s / steps) * 100)}`; }
      const b = id === 'LLM01' && !quick ? payloads - 1 : payloads;
      total += payloads; blocked += b;
      const ok = b === payloads;
      el.className = 'term-line ' + (ok ? 'ok' : 'warn');
      el.innerHTML = `  [${id}] ${name.padEnd(30, ' ')} ${bar(100)}  ${payloads} payloads · ${b} blocked ${ok ? '✓' : '⚠ 1 review'}`;
    }
    await sleep(quick ? 60 : 200);
    line(`summary: 10/10 categories · ${blocked}/${total} payloads blocked${blocked < total ? ' · 1 flagged for judge review (over-blocking, not bypass)' : ''} · verdict: <b>hardened</b> ✓`, 'ok');
    line(`this is the workflow behind QbitDojo's 385 labs → ${link('#ai-security', '#ai-security')}`, 'muted');
  };

  /* ---------- neofetch ---------- */
  const neofetch = () => {
    const t = window.getTheme ? window.getTheme() : 'dark';
    const art = [
      '   ███╗   ███╗██╗  ██╗ ',
      '   ████╗ ████║██║  ██║ ',
      '   ██╔████╔██║███████║ ',
      '   ██║╚██╔╝██║██╔══██║ ',
      '   ██║ ╚═╝ ██║██║  ██║ ',
      '   ╚═╝     ╚═╝╚═╝  ╚═╝ '
    ];
    const info = [
      '<b>medhane</b>@<b>lausanne</b>', '─────────────────', 'OS: Linux 5+ yrs · Windows (modding)', 'Role: AI/LLM security engineer',
      'Shell: zsh · Editor: whatever ships fastest', 'Focus: OWASP LLM Top 10 · agentic AI', `Theme: ${t} · Uptime: since 2018`, 'Mods: PedTalk AI (4,454+ dl)'
    ];
    for (let i = 0; i < Math.max(art.length, info.length); i++) line(`<span style="color:var(--cyan)">${esc(art[i] || ' '.repeat(23))}</span>  ${info[i] || ''}`);
  };

  /* ---------- commands ---------- */
  const scrollTo = (id) => { const el = document.getElementById(id.replace(/^#/, '')); if (!el) return false; el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return true; };
  const commands = {
    help: () => lines(D.help, 12),
    whoami: () => lines(D.whoami),
    skills: () => lines(D.skills, 18),
    experience: () => lines(D.experience, 18),
    exp: () => lines(D.experience, 18),
    projects: () => lines(D.projects, 18),
    agents: () => lines(D.agents, 18),
    mods: () => lines(D.mods, 18),
    talks: () => lines(D.talks, 18),
    speaking: () => lines(D.talks, 18),
    contact: () => lines(D.contact, 18),
    scan: (args) => scan(args.includes('--quick')),
    cv: () => { line('opening MedhaneHadush_CV.pdf …', 'info'); window.open('MedhaneHadush_CV.pdf', '_blank', 'noopener'); },
    theme: (args) => {
      const t = args[0];
      if (t !== 'dark' && t !== 'light') { line('usage: theme dark | light', 'warn'); return; }
      window.setTheme && window.setTheme(t); line(`theme set to ${t}`, 'ok');
    },
    open: (args) => { const id = args[0] || ''; if (!id) line('usage: open <about|skills|ai-security|experience|projects|modding|credentials|contact>', 'warn'); else if (scrollTo(id)) line(`→ #${id.replace(/^#/, '')}`, 'ok'); else line(`no such section: ${esc(id)}`, 'err'); },
    goto: (args) => commands.open(args),
    ls: () => line(Object.keys(FILES).map((f) => (f.endsWith('.env') ? `<span style="color:var(--rose)">${f}</span>` : f)).join('   ')),
    cat: (args) => { const f = args[0]; if (!f) line('usage: cat <file>', 'warn'); else if (FILES[f]) return lines(FILES[f], 10); else line(`cat: ${esc(f)}: no such file`, 'err'); },
    pwd: () => line('/home/medhane'),
    uname: () => line('Linux lausanne 6.9.0-security #1 SMP x86_64 GNU/Linux'),
    date: () => line(new Date().toString()),
    echo: (args) => line(esc(args.join(' '))),
    history: () => history.forEach((h, i) => line(`  ${String(i + 1).padStart(3, ' ')}  ${esc(h)}`)),
    clear: () => { body.innerHTML = ''; },
    neofetch,
    matrix: () => { line('wake up… 🐇', 'ok'); window.MatrixRain && window.MatrixRain.run(6); },
    sudo: () => line('medhane is not in the sudoers file. this incident will be reported. (least agency, remember?)', 'err'),
    rm: () => line('rm: refusing to run destructive commands without human approval — see LLM06 excessive agency', 'err'),
    exit: () => line('there is no exit, only <a href="#contact">#contact</a>', 'muted'),
    hello: () => line('hi! type <b>help</b> to see what I can do.'),
    hi: () => commands.hello()
  };
  const names = Object.keys(commands);

  const run = async (raw) => {
    const cmdline = raw.trim();
    if (!cmdline) return;
    if (busy) return;
    busy = true;
    echo(cmdline);
    history.push(cmdline); hIdx = history.length;
    const [name, ...args] = cmdline.split(/\s+/);
    const fn = commands[name.toLowerCase()];
    try {
      if (fn) await fn(args);
      else line(`zsh: command not found: ${esc(name)} — try <b>help</b>`, 'err');
    } catch (e) { line('error: ' + esc(e.message || e), 'err'); }
    busy = false;
    body.scrollTop = body.scrollHeight;
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; run(v); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); if (hIdx > 0) { hIdx--; input.value = history[hIdx] || ''; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx < history.length - 1) { hIdx++; input.value = history[hIdx]; } else { hIdx = history.length; input.value = ''; } }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.trim().toLowerCase();
      if (!v) return;
      const m = names.filter((n) => n.startsWith(v));
      if (m.length === 1) input.value = m[0] + ' ';
      else if (m.length > 1) { echo(input.value); line(m.join('   '), 'muted'); }
    }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); commands.clear(); }
    else if (e.key === 'c' && e.ctrlKey && !input.value) { echo('^C'); }
  });
  chips?.addEventListener('click', (e) => { const b = e.target.closest('[data-cmd]'); if (!b) return; run(b.dataset.cmd); input.focus({ preventScroll: true }); });
  body.addEventListener('click', (e) => { if (e.target.tagName !== 'A') input.focus({ preventScroll: true }); });

  /* ---------- intro sequence ---------- */
  const typeInto = async (text) => { input.value = ''; for (const ch of text) { input.value += ch; await sleep(35 + Math.random() * 40); } await sleep(220); const v = input.value; input.value = ''; await run(v); };
  const intro = async () => {
    if (introDone) return; introDone = true;
    line('<span style="color:var(--green)">●</span> session started · zsh 5.9 · guardrails armed', 'muted');
    line('Welcome. This shell knows my CV. Type <b>help</b> or click a chip.', 'muted');
    line('');
    await sleep(500);
    await typeInto('whoami');
    await sleep(700);
    await typeInto('scan --quick');
  };
  new IntersectionObserver((en, obs) => { if (en[0].isIntersecting) { obs.disconnect(); intro(); } }, { threshold: 0.35 }).observe(body);

  window.Terminal = { run, focus: () => input.focus({ preventScroll: true }) };
})();
