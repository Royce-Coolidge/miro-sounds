# CLAUDE.md

Guidance for working in this repo. Keep it current when architecture or conventions change.

## Project

Marketing website for **Miro Sounds**, a bespoke music & entertainment curation service for events. Single-page, animation-heavy React site. Live at https://mirosounds.com.

## Commands

- `npm run dev` — start Vite dev server (HMR)
- `npm run build` — production build (outputs to `build/`, **not** the Vite default `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` — ESLint over the repo
- `npm run build:analyze` — build in analyze mode (bundle visualizer is commented out in `vite.config.js`)

No test suite exists.

## Stack

- React 19 + Vite 6, JavaScript/JSX (no TypeScript)
- Routing: `react-router-dom` v7
- Animation: `gsap` (+ `@gsap/react`, ScrollTrigger, CustomEase), `framer-motion`, `split-type`
- Smooth scroll: `lenis` (`lenis/react`)
- Icons: `react-icons`, `lucide-react`

## Architecture

- Entry: `src/main.jsx` → `src/App.jsx`. `main.jsx` wraps everything in `<Router>`; `App.jsx` mounts `<Menu />` plus a `<Routes>` under `<AnimatePresence>`.
- **Effectively a single-page site.** `App.jsx` only renders the `Home` route (`/`). The other pages in `src/pages/` (Work, About, Contact, Project) exist but are **not wired into the router** — the whole experience lives in `src/pages/Home/Home.jsx`, a long file of stacked `<section>`s (`#hero`, `#how-we-work`, `#about`, `#contact`, etc.).
- **Navigation is anchor-based, not route-based.** `Menu` scrolls to in-page section IDs (`#about`, `#contact`, `#how-we-work`) via Lenis, rather than navigating routes.
- `vercel.json` rewrites all paths to `/` (SPA) and sets long cache headers on `/assets/*`.

## Directory layout

- `src/pages/<Page>/<Page>.jsx` + `.css` — page-level components (only `Home` is live).
- `src/components/<Name>/<Name>.jsx` + `.css` — reusable pieces: `Menu`, `Preloader`, `Transition`, `Footer`, `BackgroundVideo`, `ContactForm`, `AnimatedCopy`, `AnimatedH1`, `ParallaxImage`, `Reviews`, `FAQContainer`.
- `src/data/*.js` — static content arrays (`projects.js`, `workList.js`, `reviews.js`, `faqs.js`), each `export default`ed. Edit copy here, not in JSX where possible.
- `src/fonts.css` — self-hosted `@font-face` rules. Fonts live in `public/fonts/` (Rader, Messina Sans, Messina Sans Mono, Atelier).
- `public/` — static assets served at root (`/home/hero.mp4`, `/about/*.jpg`, `/work/*.jpg`, etc.). Reference these with absolute paths (`/home/hero.mp4`).

## Conventions

- One component per folder, co-located `.jsx` + `.css`; CSS is plain (no CSS modules / Tailwind). Class names are global — scope by prefixing with the component/section name.
- `no-unused-vars` is an error, but names matching `^[A-Z_]` are ignored (allows unused imported components/constants).

## Gotchas

- **BackgroundVideo timing is deliberate.** `src/components/BackgroundVideo/BackgroundVideo.jsx` intentionally coordinates playback with the preloader and mobile autoplay restrictions — it swaps `/home/hero.mp4` vs `/home/mobile-hero.mp4` by width and delays `play()`. See `VIDEO_PLAYBACK_FIX_EXPLANATION.md` before touching autoplay/preload behavior; small changes here regress mobile playback.
- `ScrollToTop` in `App.jsx` delays `window.scrollTo(0,0)` by 1400ms to sync with the page-transition animation.
- Build output dir is `build/` — keep `vite.config.js` (`outDir`) and `vercel.json` (`outputDirectory`) in agreement.
