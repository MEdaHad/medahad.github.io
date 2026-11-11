# medahad.github.io

Personal portfolio of **Medhane Hadush**: AI/LLM security, cybersecurity engineering and agentic AI.

Live: https://medahad.github.io/

## Stack

Plain HTML and CSS, served by GitHub Pages straight from `main`. No build step, no framework, no external fonts or CDNs, no trackers. The site works fully with JavaScript turned off; the only script is an optional light/dark toggle.

```
medahad.github.io
├── index.html               # single-page portfolio
├── 404.html                 # not-found page, same design
├── MedhaneHadush_CV.pdf     # current CV (keep this filename)
├── assets/
│   ├── css/style.css        # palette, type scale, layout (light + dark via light-dark())
│   ├── js/theme.js          # optional theme toggle (~1 KB)
│   ├── favicon.svg
│   └── img/                 # portrait (240/480/720 px, WebP + JPEG) and og.jpg (1200×630)
└── .nojekyll
```

## Editing

- **Content** lives in `index.html`, one section per `<section>`: intro, about + skills, experience, projects (incl. side projects), talks & education, contact.
- **Colours, type sizes and spacing** are CSS custom properties at the top of `style.css`. Each colour has a light and a dark value.
- **Portrait**: replace the `medhane*.jpg/webp` files at the same sizes.
- **CV**: replace `MedhaneHadush_CV.pdf`, keeping the filename so links keep working.

## Local preview

```bash
python3 -m http.server 8080
```
