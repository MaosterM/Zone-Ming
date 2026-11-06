# Zone-Ming

Personal portfolio of Cheah Yi Ming, with designs inspired by cyberpunk and viral websites.

**Live site: https://maosterm.github.io/Zone-Ming/**

## What's inside

- **Page wipes:** three slanted slabs sweep across, the destination name flashes, and the route swaps while the screen is covered
- **Animated background:** drifting neon gradients, matrix rain on canvas, scanlines and a glitch flicker
- **3D scene:** slanted chrome shards that re-form into a new shape on each page
- **Text effects:** RGB-split glitch and a glyph decode, with the real text always in the DOM for screen readers
- **Extras:** custom cursor, smooth scrolling, a full-screen mobile menu and reduced-motion support

Built with Vite, React, TypeScript, Tailwind CSS v4, GSAP, Lenis, three.js and React Router.

## Run it locally

You need Node.js 24 (22 should also work).

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Typechecks and builds to `dist/` |
| `npm run lint` | Runs oxlint |
| `npm run serve:pages` | Serves `dist/` the way GitHub Pages does, at http://localhost:4174/Zone-Ming/ |

Use `npm run serve:pages` to test a build. `npm run preview` did not serve the JS bundle when this was tested.

## Edit your content

All personal content lives in one file: [`src/data/profile.ts`](src/data/profile.ts).

| To change | Edit |
|---|---|
| Role, bio, status, email and links | `profile` |
| Skills | `skills` |
| Projects | `projects` |

**To add a project,** copy an entry in `projects`, give it a unique `slug`, and put its image in `public/projects/`. The Work list, project page, previous and next links, and transition label all update from that entry.

**To replace a cover graphic with a real screenshot,** save it over the file in `public/projects/` and update `imageAlt` to describe what it shows. Images look best at 16:9, with the important part towards the top.

**To make the contact form send directly,** create a [Formspree](https://formspree.io) form and paste its endpoint into `formspreeEndpoint`. While that is empty, the form opens the visitor's email app instead.

## Deploy

Pushing to `main` deploys automatically through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Pull requests run lint and build only.

To set it up on a new copy of this repo:

1. In the repo on GitHub, go to **Settings > Pages** and set **Source** to **GitHub Actions**.
2. If the repo isn't named `Zone-Ming`, change `BASE` in [`vite.config.ts`](vite.config.ts), `BASE` in [`scripts/serve-pages.mjs`](scripts/serve-pages.mjs), and nothing else.
3. Push to `main`.

Each known page gets a real HTML file at build time, so direct links work. Unknown addresses use [`public/404.html`](public/404.html), which redirects to the app's Signal lost page while keeping the URL.

## Project layout

```text
src/
  components/   Background, MatrixRain, GradientField, GlitchOverlay, Scene3D,
                PageTransition, GlitchText, ScrambleText, Heading, Nav, Footer,
                Cursor, ButtonLink, ContactForm, StatusPanel
  pages/        Home, Work, ProjectDetail, About, Contact, NotFound
  data/         profile.ts, all personal content
  lib/          motion, smooth scroll, routes, transition state, assets,
                shardScene (three.js), scenePlacements (the shape on each page)
```

## Motion rules worth keeping

- **One animation loop.** Lenis, the rain and the 3D scene all run from `gsap.ticker`. Don't add another `requestAnimationFrame` loop.
- **Reduced motion is checked everywhere.** New animation must have a resting state, through `usePrefersReducedMotion` or `prefersReducedMotion`.
- **`clip-path` cuts off focus rings.** On anything focusable, put the slanted shape on a pseudo-element, as `.btn` and `.logo-tile` do.
- **Timelines can't skip the cover.** `lagSmoothing` in `src/lib/motion.ts` limits how far one slow frame can advance a timeline, so a page swap is never shown uncovered.
- **Devices without a real GPU skip the 3D scene** and its download. The rest of the background still runs.

## How to change the 3D scene

Shapes and their positions on each page are in [`src/lib/scenePlacements.ts`](src/lib/scenePlacements.ts). `x` and `y` run from -1 to 1 across the screen, and `opacity` should stay low wherever the shape can sit behind small text.
