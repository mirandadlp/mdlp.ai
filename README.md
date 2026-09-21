# mdlp.ai

Premium AI-consultant portfolio site for **mdlp.ai** — a dark, space/tech themed
single page built with plain **HTML, CSS, and JavaScript** (no frameworks, no
build step).

## Files

```
index.html            # page structure (hero, about, services, capabilities, why, contact)
styles.css            # theme, layout, and all animations
script.js             # starfield particles, scroll reveals, counters, starlet cursor
mdlp-portfolio.html   # the whole site bundled into one self-contained file
tools/build-single.mjs# regenerates mdlp-portfolio.html from the three files above
assets/background.mp4 # header background video
google0e8b4fce9d55d64d.html   # Google Search Console verification (see below)
```

## Use it

Just open `index.html` in any browser — no install or build required.
`mdlp-portfolio.html` is a single-file version (CSS + JS inlined) you can
download and open on its own.

After editing `index.html`, `styles.css`, or `script.js`, regenerate the
bundle with `node tools/build-single.mjs`.

## Deploying (Hostinger)

Upload into `public_html`:

1. `mdlp-portfolio.html`, **renamed to `index.html`**
2. the `assets` folder, alongside it
3. `google0e8b4fce9d55d64d.html`, **as-is at the top level**

## Google Search Console

The site is verified two ways, so verification survives if either is lost:

- **HTML file:** `google0e8b4fce9d55d64d.html` must stay at the site root and
  be reachable at `https://mdlp.ai/google0e8b4fce9d55d64d.html`. Don't rename
  it, edit its contents, or move it into a subfolder — Google reads it
  verbatim. It is not linked from the site, so visitors never see it.
- **Meta tag:** a `google-site-verification` meta tag in the `<head>` of
  `index.html` (and therefore of the generated bundle). Invisible on the page.

Leave both in place — removing them can un-verify the property.

## Features

- Dark futuristic space theme: starfield canvas, drifting aurora, nebula,
  shooting stars, glowing orb
- Trailing-starlet custom cursor
- Sticky glassmorphism navigation with a mobile menu
- Scroll-reveal animations, animated counters, hover interactions
- Fully responsive, high-contrast, with a `prefers-reduced-motion` fallback
- Contact section links directly to md@mdlp.ai
