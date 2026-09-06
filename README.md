# medahad.github.io

Personal portfolio of **Medhane Hadush** — AI/LLM security, cybersecurity engineering, agentic AI, and game modding (RioticGamer).

Live: https://medahad.github.io/

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no framework, no trackers.

```
medahad.github.io
├── index.html               # single page portfolio
├── 404.html                 # terminal-styled not-found page
├── MedhaneHadush_CV.pdf     # current CV
├── assets/
│   ├── css/style.css        # design system, dark + light themes
│   ├── js/main.js           # theme, nav, reveal, counters, hero network, tilt, judge pipeline, fleet demo
│   ├── js/terminal.js       # interactive terminal (help, whoami, skills, scan, mods, ...)
│   ├── js/constellation.js  # 3D skill graph rendered on canvas
│   └── img/                 # portrait + Open Graph image
└── .nojekyll
```

## Features

- Dark / light theme with system preference detection and persistence
- Interactive terminal with an OWASP LLM Top 10 scan demo, history and tab completion (`/` or `` ` `` to focus)
- 3D skill constellation (drag, hover, filter by domain)
- Animated judge-model pipeline and multi-agent fleet demos
- Scroll-driven timeline, counters, reveal and tilt effects, cursor glow
- Respects `prefers-reduced-motion`

## Local preview

Open `index.html` directly, or serve the folder:

```bash
python -m http.server 8080
```

## Updating the CV

Replace `MedhaneHadush_CV.pdf` (keep the filename so existing links keep working).
