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

This tutorial series details the implementation of real-time hand tracking in TouchDesigner using Google's MediaPipe framework via Torin Blankensmith's open-source plugin. The series covers end-to-end development from initial setup through to fully interactive, gesture-driven visual applications, requiring no machine learning expertise from the implementer.

> Note: Although this series focuses on hand tracking, the underlying plugin supports the complete suite of MediaPipe vision models (excluding Interactive Segmentation and Image Embedding). Mastery of the techniques presented here enables straightforward adaptation to face tracking, pose estimation, and other supported models.

---

## Tutorial

|                                                                                                  |                                                                                                        |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [[Hand Tracking Tutorial\|(y-) ★ Complete Step-by-Step Tutorial]]                                | Setup → core rig → watercolor brush → generative architecture - everything in one document             |
| [[Sierpinski Tetrahedron with Hand Tracking\|(y-) 3D Sierpinski Tetrahedron with Hand Tracking]] | Recursive fractal geometry with Copy SOP, controlled by wrist orientation and pinch-zoom via MediaPipe |

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

- [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|(y-) OSC and MIDI]] - alternative control input methods
- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]] - scripting gesture logic
- [[touchdesigner/02_The_Operators/CHOPs/index|(y-) CHOPs]] - processing tracking data as signals
- [[touchdesigner/03_Rendering_and_Output/Instancing|(y-) Instancing]] - rendering landmark spheres efficiently
- [[Particle System with POPs]] - driving particles from hand position
- [[Hand-Tracked Chaotic Attractor]] - Lorenz attractor driven by a custom Script CHOP (no plugin)

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
