---
title: simpleLorenzcss
tags:
  - work
  - projects
  - archive
  - quartz
  - visual
  - chaos
date: 2026-03-11
---

simpleLorenzcss is a small extracted repo for the animated background I use in my Quartz garden. It puts a Lorenz attractor in the center, two Halvorsen attractors on the sides, and runs the whole thing as a canvas layer behind the page content.

I put this one in the archive because it already does its job. It is small, specific, and does not really need much more.

---

## What it is

The repo is basically three files:

- `LorenzBackground.tsx` wires the feature into Quartz
- `lorenz.inline.ts` creates the canvas, runs the animation, and builds the settings UI
- `lorenz.css` styles the canvas, the gear button, the settings panel, and focus mode

The component itself renders nothing. It just hooks the background into Quartz and lets the script prepend a fixed canvas to `document.body`.

---

## What it does

The background is not static decoration. It is a small interactive system.

- A **Lorenz attractor** runs in the center
- Two **Halvorsen attractors** run on the left and right
- A gear button opens a settings panel for parameters like `sigma`, `rho`, `beta`, `a`, speed, trail length, and particle count
- A focus mode hides the normal Quartz layout so the background can take over the page
- The colors switch with the saved Quartz theme, so the background fits both light and dark mode

What I like about it is that it stays visually present without taking over the reading experience. The opacity is low by default, and the motion stays slow enough to feel atmospheric instead of distracting.

---

## How it works

The animation script steps particles forward with the Lorenz and Halvorsen equations, stores short trails for each particle, projects the 3D points into 2D, and redraws everything on every animation frame.

A few details make it feel more solid than a quick visual hack:

- The script warms the systems up before drawing so the curves start in a useful state
- It rebuilds the particle arrays when you change particle counts in the settings panel
- It responds to Quartz navigation events so the background survives SPA style page changes
- It reads Quartz's saved theme to swap palettes automatically

The whole thing is intentionally simple. No heavy framework, just a small Quartz component and an inline canvas animation.

---

## Why I archived it

This repo is more like a clean extract than a project I want to keep expanding.

It solved one clear problem well: packaging the background system into something I could drop into a Quartz site without dragging the whole garden with it. Once that was done, there was not much reason to keep expanding it.

That is why it makes sense in the archive. It is worth keeping around, but it does not need to stay in the active projects section.

---

## Related

- [GitHub Repo](https://github.com/yuazi/simpleLorenzcss)
- [[notes/lorenz-attractor|→ The Lorenz Attractor]]: background on the system used at the center of the animation

[[index|↑ Back to Work]]

---
