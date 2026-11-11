# medahad.github.io

Personal portfolio of **Medhane Hadush**: AI/LLM security, cybersecurity engineering and agentic AI.

Live: https://medahad.github.io/

## Design

A single page that reads like a Linux terminal session: every section is a shell command (`whoami`, `cat about.txt`, `cat skills.md`, `ls projects/`, `cat contact`, …) followed by its output. Dark background, monospace system fonts, one green accent for prompts, links and emphasis. The only motion is the blinking cursor on the last prompt, and it stops when the visitor prefers reduced motion.

## Stack

Plain HTML and CSS, served by GitHub Pages straight from `main`. No build step, no framework, no JavaScript, no external fonts or CDNs, no trackers.

```
medahad.github.io
├── index.html               # single-page portfolio (terminal session)
├── 404.html                 # not-found page, same terminal look
├── MedhaneHadush_CV.pdf     # current CV (keep this filename)
├── assets/
│   ├── css/style.css        # colours, layout, terminal styling
│   ├── favicon.svg
│   └── img/                 # portrait (240/480 px WebP + JPEG, plus original) and og.jpg (1200×630)
└── .nojekyll
```

## Editing

- **Content** lives in `index.html`. Each section is a `<section>` whose heading is the command (`<h2 class="cmd">`) and whose output sits in `.out`. Projects and side projects are `<article class="sub">` blocks, each with its own `cat` line.
- **Old links** keep working: `#terminal` lands on `whoami`, `#ai-security` on the judge-model pipeline, `#modding` on side projects, `#credentials` on education.
- **Colours** are the custom properties at the top of `style.css` (`--bg`, `--text`, `--muted`, `--accent`); all text meets WCAG AAA contrast on the background.
- **Portrait**: replace the `medhane*.jpg/webp` files at the same sizes.
- **CV**: replace `MedhaneHadush_CV.pdf`, keeping the filename so links keep working.

## Local preview

```bash
python3 -m http.server 8080
```
