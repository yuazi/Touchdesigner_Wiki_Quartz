# (y)usage Garden

A Quartz v4-based **_digital garden_** and personal knowledge base for my notes, experiments, and long-form references.

Live site: [yuazi.github.io/\_y_usagewiki](https://yuazi.github.io/_y_usagewiki)

## Overview

This repository is no longer a near-default Quartz starter. It is a customized Quartz fork with:

- a personal digital garden homepage and about page
- a large TouchDesigner wiki organized into seven topic areas
- notes, work logs, and calendar-style updates
- a custom Lorenz attractor background
- a BIOS-style intro boot overlay
- custom layout choices such as graph view, explorer, reader mode, and Quartz theme overrides

The content is written as markdown in an Obsidian-style vault under `content/`, then built into a static site with Quartz.

## Main Sections

- `TouchDesigner`: structured reference material for real-time interactive media, operators, scripting, shaders, rendering, and project recipes
- `Notes`: shorter topic pages, references, and side explorations
- `Calendar`: time-based log of what has been learned or worked on
- `Work`: active projects, shipped experiments, and professional/personal output

## Customizations In This Fork

- `quartz/components/LorenzBackground.tsx`: injects the animated Lorenz background
- `quartz/components/GardenBootOverlay.tsx`: mounts the fullscreen boot intro overlay
- `quartz/components/ReaderMode.tsx`: adds the reader mode toggle to the layout
- `quartz.layout.ts`: wires the shared page layout, sidebar tools, graph, explorer, and background components
- `quartz.config.ts`: defines the site title, base URL, analytics, theme typography, and dark/light palettes

The boot overlay is session-gated with `sessionStorage.gardenBooted`, so it only appears once per browser session unless cleared manually.

## Project Structure

```text
.
├── content/                     # Markdown source content
│   ├── about.md
│   ├── calendar/
│   ├── notes/
│   ├── touchdesigner/
│   └── work/
├── quartz/                      # Quartz source plus custom components/scripts/styles
│   ├── components/
│   ├── plugins/
│   └── styles/
├── public/                      # Generated static site output
├── docs/snippets/               # Reusable HTML/CSS/JS snippets used during customization work
├── quartz.config.ts             # Site configuration
├── quartz.layout.ts             # Shared and per-page layout configuration
└── package.json                 # Scripts and dependencies
```

Do not edit `public/` by hand. It is build output.

## Local Development

Requirements:

- Node.js `>=22`
- npm `>=10.9.2`

Install dependencies:

```bash
npm ci
```

Start the local dev server:

```bash
npx quartz build --serve
```

Quartz serves the site locally at `http://localhost:8080`.

Build the static site without serving:

```bash
npx quartz build
```

## Useful Scripts

```bash
npm run check    # TypeScript + Prettier check
npm run test     # Test suite
npm run format   # Format the repo with Prettier
```

## Deployment

Deployment is handled by GitHub Actions in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

- pushes to the `v4` branch trigger a production build
- the workflow runs `npm ci` and `npx quartz build`
- the generated `public/` directory is deployed to GitHub Pages

## Notes For Editing

- content pages live under `content/`
- most UI changes belong in `quartz/components/`, `quartz/components/scripts/`, or `quartz/components/styles/`
- sitewide theme values live in `quartz.config.ts`
- layout composition lives in `quartz.layout.ts`

If you want to replay the intro overlay during development, clear the session key in the browser console:

```js
sessionStorage.removeItem("gardenBooted")
```
