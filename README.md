# medahad.github.io

Personal portfolio of **Medhane Hadush**: AI/LLM security, cybersecurity engineering and agentic AI.

Live: https://medahad.github.io/

## Design

The site is a small glass Linux desktop. A CSS gradient wallpaper sits behind a frosted top panel (identity, the focused app's name, a clock in the visitor's local time, and a light/dark toggle) and a dock at the bottom. Two windows are open on load:

- **Terminal**: an interactive shell. It auto-runs `help` on load.
- **Browser**: shows the CV as a clean, readable web page at a decorative `https://medahad.github.io/cv` address.

Windows have close / minimize / maximize buttons. On desktops with a mouse they can be dragged by the title bar and resized from the bottom-right corner, and they stay inside the screen. The focused window comes to the front. The dock reopens or focuses each app and also links to the CV PDF, email, LinkedIn and GitHub.

On phones the windows fill the screen between the panel and the dock, one at a time, and dragging is off. The terminal gets a row of tappable command chips, and the dock hides while the on-screen keyboard is open.

The first visit in a session gets a fade-in under one second. It is skipped on later visits and when the visitor prefers reduced motion; reduced motion also turns off window animations and the caret blink. Fonts are system stacks only (`system-ui` for the desktop and CV, `ui-monospace` for the terminal).

### Terminal commands

| Command | What it does |
| --- | --- |
| `help` | List every command (runs automatically on load) |
| `whoami` | Name, role, location, intro and key numbers |
| `about` | The about text |
| `highlights` | AI automation videos and PedTalk AI |
| `currently` | What he's working on right now |
| `experience` | Roles and dates |
| `projects [name]` | All projects and side projects, or one (`projects qbitdojo`) |
| `skills` | Skill groups |
| `education` | Education, certifications, frameworks and languages |
| `talks` | Talks and teaching |
| `languages` | Spoken languages |
| `contact` | Email, LinkedIn, GitHub and CV |
| `cv` | Open the CV in the Browser window and link the PDF |
| `open <app>` | `open terminal`, `open browser`, `open cv`, `open pdf`, or a section/project (`open projects`, `open fleethawk`) |
| `ls [dir]` | List the virtual home: `about.txt`, `highlights.txt`, `projects/`, `side-projects/`, `contact`, `MedhaneHadush_CV.pdf`, … |
| `cat <file>` | Print a file, e.g. `cat about.txt`, `cat projects/qbitdojo.md` |
| `cd <dir>` / `pwd` | Move around the virtual home |
| `neofetch` | A system-info card built from his details (the ASCII shield is decoration) |
| `theme [light\|dark]` | Toggle the desktop theme (remembered in `localStorage`) |
| `history`, `date`, `echo`, `clear` | The usual |
| `exit` / `close` | Close the terminal; reopen it from the dock |

Tab completes commands, files and `open` targets, and ↑/↓ walk the history. Ctrl+L clears the screen and Ctrl+C cancels the current line. When the input is empty, or there is nothing to complete, Tab moves focus on as usual.

## How content works

The CV in `index.html` is the **single source of truth**. The terminal has no copy of the content: each command reads the matching CV section (`#about`, `#experience`, `[data-file]` project cards, …) and renders it as terminal text, keeping links. To change a fact, edit the HTML once and both windows update.

- Elements marked `data-term="skip"` (portrait, call-to-action buttons) are left out of terminal output.
- Projects and side projects need a `data-file="name.md"` attribute to appear in `ls projects/` / `cat`.
- Old links still land somewhere sensible. `#about`, `#experience`, `#projects`, `#skills`, `#highlights`, `#talks`, `#contact`, `#ai-security`, `#modding`, `#credentials` and every project id scroll the Browser window to that section. `#terminal` focuses the terminal.

## Without JavaScript

The desktop is progressive enhancement. A tiny inline script adds a `js` class to `<html>`, and all desktop styling hangs off it. Without JavaScript (or if `assets/js/desktop.js` fails to load) the panel, dock and terminal are hidden. The full CV is then shown as a normal scrolling page on a single glass card, with every section and link, plus a short `<noscript>` note. Search engines see the same complete content. Printing produces just the CV.

## Stack

Plain HTML, CSS and one vanilla JavaScript file, served by GitHub Pages straight from `main`. No build step, no framework, no trackers or analytics, no font or script CDNs.

```
medahad.github.io
├── index.html               # the CV markup + desktop shell (panel, windows, dock)
├── 404.html                 # not-found page: a single glass terminal window
├── MedhaneHadush_CV.pdf     # current CV (keep this filename)
├── assets/
│   ├── css/style.css        # wallpaper, glass, windows, dock, terminal, CV page, 404, print
│   ├── js/desktop.js        # window manager, dock, clock, browser chrome, terminal
│   ├── favicon.svg
│   └── img/                 # portrait (240/480 px WebP + JPEG, plus original) and og.jpg (1200×630)
└── .nojekyll
```

## Editing

- **Content**: edit the CV sections in `index.html` (see *How content works*).
- **Colours**: custom properties at the top of `style.css`. The dark theme is the default and `:root[data-theme="light"]` overrides it. The terminal keeps its own dark palette (`--t-*`) in both themes. Panels get more opaque automatically when `backdrop-filter` isn't supported, so text contrast holds.
- **Portrait**: replace the `medhane*.jpg/webp` files at the same sizes.
- **CV**: replace `MedhaneHadush_CV.pdf`, keeping the filename so links keep working.

## Local preview

```bash
python3 -m http.server 8080
```
