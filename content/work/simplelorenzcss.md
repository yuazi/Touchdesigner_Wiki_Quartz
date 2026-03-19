---
title: "Ambient Chaos"
tags:
  - work
  - projects
  - archive
  - quartz
  - visual
  - chaos
date: 2026-03-11
---

Most digital gardens use static colors or simple gradients for their backgrounds. I wanted something that felt "alive" and reflected my interest in chaotic systems, so I built **simpleLorenzcss**.

It is a specialized background system for Quartz that renders a live **Lorenz attractor** and two **Halvorsen attractors** directly behind your notes. It is lightweight, interactive, and switches themes automatically with your site.

---

## The Core Concept

The background is not a video or a pre rendered image. It is a live simulation running in your browser. It uses differential equations to calculate the next position of thousands of particles every frame.

Here is the core update logic for a Lorenz attractor in TypeScript:

```typescript
const dt = 0.005
const sigma = 10,
  rho = 28,
  beta = 8 / 3

// Calculate the change in position
dx = sigma * (y - x) * dt
dy = (x * (rho - z) - y) * dt
dz = (x * y - beta * z) * dt

// Update the coordinates
x += dx
y += dy
z += dz
```

---

## The Deep Dive: How it works

The system is designed to be atmospheric rather than distracting. It stays in the background and only draws attention when you want it to.

### 1. Multi Attractor System

The simulation runs three distinct systems simultaneously:

- A **Lorenz attractor** stays centered to provide a focal point.
- Two **Halvorsen attractors** run on the left and right edges to fill the periphery.

### 2. Interactive Settings

A hidden gear button opens a settings panel where you can tune the math live. You can adjust constants like **sigma** and **rho**, change the simulation speed, or increase the particle count for a denser look.

### 3. Quartz Integration

The project is built specifically for **Quartz 4**. It hooks into the single page application routing to ensure the animation survives page transitions without restarting. It also reads the saved theme to automatically swap between light and dark palettes.

---

## Project Structure

The project is kept small and focused so it can be easily dropped into any Quartz garden:

- **`LorenzBackground.tsx`**: The React component that wires the feature into the layout.
- **`lorenz.inline.ts`**: The core animation script that handles the canvas and math.
- **`lorenz.css`**: Styles for the canvas, settings panel, and the focus mode toggle.

---

## Getting Started

This project is archived because it already fulfills its purpose as a clean extract for others to use.

```bash
git clone https://github.com/yuazi/simpleLorenzcss
```

---
[[notes/random/lorenz-attractor|The Lorenz Attractor]] | [[work/index|(y) Return to Work]] | [[/index|(y) Return to Home]]
