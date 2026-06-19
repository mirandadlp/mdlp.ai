# mdlp.ai

Full-screen dark hero landing page for **mdlp.ai** — built with React + Vite +
Tailwind CSS v4 + Motion (framer-motion) + Lucide icons, with a fullscreen HLS
background video (hls.js) and a glassmorphism navbar.

## Stack

- **React 19** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Motion** (`motion/react`) for animations
- **lucide-react** for icons
- **hls.js** for the Mux HLS background video

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build -> dist/
npm run preview  # preview the production build
```

## Structure

```
index.html               # Vite entry HTML
src/
  main.jsx               # React mount
  index.css              # fonts, Tailwind, .liquid-glass / .glass-pill
  App.jsx                # single-screen layout (video + navbar + hero)
  components/
    BackgroundVideo.jsx  # fullscreen HLS video (hls.js / native Safari)
    Navbar.jsx           # glassmorphism navbar
    Hero.jsx             # heading + email-capture CTA with typewriter
```

## Notes

- The previous static HTML/CSS/JS version of the site is preserved in `legacy/`.
- Brand-facing copy (logo, nav links, tagline, heading, CTA, typewriter text)
  is tailored to mdlp.ai's AI-consulting positioning. The underlying structure,
  classes, and animations follow the original template spec.
