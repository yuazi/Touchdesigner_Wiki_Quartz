---
title: "Hand Tracking in TouchDesigner"
tags:
  - touchdesigner
  - td/tutorials
  - td/tracking
  - td/interaction
  - td/mediapipe
date: 2026-03-01
---

**Author:** Torin Blankensmith
**Format:** 3-part YouTube series + bonus projects
**Playlist:** [Watch on YouTube](https://www.youtube.com/watch?v=e2FtkufeErY&list=PLgfxkm9xFocaQXGTxu7HlFomE05kPbO8z)
**Videos:** [Part 1](https://youtu.be/e2FtkufeErY) · [Part 2](https://youtu.be/XRw1AUa57Zw) · [Part 3](https://youtu.be/7o960C7nXSY) · [Bonus 1](https://youtu.be/UFVvmCuM2Is) · [Bonus 2](https://www.youtube.com/watch?v=IATX3biLoZg&t=1316s)
**Plugin repo:** [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner)
**Intro video:** [Quick overview on YouTube](https://www.youtube.com/watch?v=Cx4Ellaj6kk)

---

## Overview

A master class series on implementing real-time **hand tracking** in TouchDesigner using Google's **MediaPipe** framework, via Torin's open-source plugin. Covers setup through to a fully interactive, gesture-driven application — no ML code required.

> The plugin supports **all MediaPipe vision models** (except Interactive Segmentation and Image Embedding). The series focuses on hand tracking, but the same `.tox` pattern applies to the others.

---

## Tutorial

|                                                                                               |                                                                                                        |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [[Hand Tracking Tutorial\|→ ★ Complete Step-by-Step Tutorial]]                                | Setup → core rig → watercolor brush → generative architecture — everything in one document             |
| [[Sierpinski Tetrahedron with Hand Tracking\|→ 3D Sierpinski Tetrahedron with Hand Tracking]] | Recursive fractal geometry with Copy SOP, controlled by wrist orientation and pinch-zoom via MediaPipe |

---

## Videos

| Part    | Topic                                                     | Video                                                          |
| ------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| Part 1  | Plugin setup, camera config, 21 hand landmarks            | [▶ Watch](https://youtu.be/e2FtkufeErY)                        |
| Part 2  | Reading CHOP channels, remapping coordinates, Y-inversion | [▶ Watch](https://youtu.be/XRw1AUa57Zw)                        |
| Part 3  | Gesture recognition, driving visuals, smoothing           | [▶ Watch](https://youtu.be/7o960C7nXSY)                        |
| Bonus 1 | Generative Architecture with Hand Tracking                | [▶ Watch](https://youtu.be/UFVvmCuM2Is)                        |
| Bonus 2 | Watercolor Hand Tracking Brush                            | [▶ Watch](https://www.youtube.com/watch?v=IATX3biLoZg&t=1316s) |

---

## Related

- [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|→ OSC and MIDI]] — alternative control input methods
- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|→ Python in TD]] — scripting gesture logic
- [[touchdesigner/02_The_Operators/CHOPs/index|→ CHOPs]] — processing tracking data as signals
- [[touchdesigner/03_Rendering_and_Output/Instancing|→ Instancing]] — rendering landmark spheres efficiently
- [[Particle System with POPs]] — driving particles from hand position
- [[Hand-Tracked Chaotic Attractor]] — Lorenz attractor driven by a custom Script CHOP (no plugin)

[[touchdesigner/06_Recipes_and_Projects/index|↑ Back to Recipes & Projects]]

---
