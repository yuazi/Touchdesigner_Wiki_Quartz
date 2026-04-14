---
title: (y) Calendar
tags:
  - calendar
  - log
---

A running log of what I've been working on, learning, and building, ordered by time.

---

## 2026

### April

- Won **2nd place (🥈)** at **LIC8 (Legal Innovation Challenge 8)** in Stuttgart.
  - Developed **[[work/mbclient|MB Client]]**, a digital onboarding portal for the law firm Menold Bezler.
  - Focused on streamlining client collaboration through smart imports, real-time tracking, and automated scheduling to replace email chaos.

### March

- Completed major updates across the work portfolio.
  - **[[work/attractormediapipe|AttractorMediaPipe]]**: Expanded to 9 chaotic systems with a new hybrid rendering engine (ModernGL + Datashader) and snapshot-only CLI mode.
  - **[[work/sudokusolver|Sudoku Solver]]**: Finalized the Graph Neural Network (GNN) implementation for solving puzzles via node classification.
  - **[[work/keyboardai|Keyboard AI]]**: Refined the evolutionary algorithm and scoring model for ergonomic layout optimization.
  - **Digital Garden**: Synced all project pages with latest GitHub updates and refined the internal linking structure.
- Restructured this digital garden: moved TouchDesigner notes into their own subfolder, created the new homepage.
- Set up Quartz 4 with a custom theme, Lorenz background, and graph view.
- Added a BIOS-style boot sequence overlay so the garden opens with a short startup intro once per session.
- Made a simple Sudoku AI Trainer that uses GNN to learn
- Added a live settings panel to the Lorenz attractor background: a gear button in the bottom right corner lets you tune σ, ρ, β, trail length, particle count, and the Halvorsen _a_ parameter in real time.

  | Parameter    | Attractor | What it does                                                             |
  | ------------ | --------- | ------------------------------------------------------------------------ |
  | σ (sigma)    | Lorenz    | Rate at which the system rotates between the two lobes                   |
  | ρ (rho)      | Lorenz    | "Height" of the attractor. The classic butterfly shape appears around 28 |
  | β (beta)     | Lorenz    | Geometric decay factor; affects the thickness of the wings               |
  | Speed (dt)   | Both      | Simulation timestep. Higher values are faster but less accurate          |
  | Trail length | Both      | How many past positions are drawn as a tail                              |
  | Particles    | Both      | Number of simultaneous traces orbiting the attractor                     |
  | _a_          | Halvorsen | Sole parameter controlling the shape of the side attractors              |

---

## How I use this

Each entry is a brief note on what I shipped, read, or explored that week. It isn't a diary. It's more like a changelog for my brain.

---
[[/index|(y) Return to Home]]
