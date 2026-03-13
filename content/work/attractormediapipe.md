---
title: AttractorMediaPipe
tags:
  - work
  - projects
  - python
  - moderngl
  - mediapipe
  - chaos
  - generative
date: 2026-03-11
---

AttractorMediaPipe is a standalone **Python viewer for strange attractors** that combines **ModernGL rendering**, **MediaPipe hand tracking**, and **Datashader snapshot export**. It is not just a Lorenz sketch. It is a small real time system for exploring multiple chaotic attractors as glowing point trails, either with gestures or with keyboard and mouse controls.

The project sits right in the overlap of the things I like most: mathematical systems, visual software, interaction design, and tools that feel a bit like instruments.

> Built with `pygame`, `moderngl`, `numba`, `datashader`, `opencv-python`, `mediapipe`, `numpy`, and `Pillow`.

---

## What it does

AttractorMediaPipe shows one attractor at a time as a bright additive trail, but the fun of it is moving between them. You can switch through **Lorenz**, **Aizawa**, **Sprott B**, **Thomas**, **Dadras**, **Chen**, **Langford**, **Rossler**, and **Halvorsen**, and each one gives the viewer a different feel.

Some look airy and open. Others feel tighter, rougher, or more intense. So switching attractors does more than change the math in the background. It changes the mood of the whole piece.

![[pictures/attractor_aizawa.png|Aizawa attractor with grain-texture background]] *A dense Aizawa attractor snapshot from the viewer, rendered as glowing trails against the project's grain-texture background.*

There are also two ways to use it. With a webcam, it turns into a gesture-controlled interface. Without one, it still works well with keyboard and mouse, which makes it feel more like a real tool and less like a one-off experiment.

When the camera is enabled, the left hand handles **speed** and **luminosity**, while the right hand controls **yaw**, **pitch**, **zoom**, and **trail length**. Left pinky-to-palm resets the current attractor; right pinky-to-palm advances to the next one.

Around the main view, there is also an overlay with helper text, parameter sliders, an attractor list, a placard, and an optional picture-in-picture webcam view with skeleton overlays. Those details help the project feel more finished and easier to actually use.

---

## Why I made it

I wanted the piece to feel somewhere between a technical demo, a visual instrument, and a software object you could exhibit.

Strange attractors already have a built in tension between order and instability. What interested me here was not just plotting them, but building a viewer that lets them be explored live, switched between quickly, and exported cleanly at high resolution.

That combination matters to me: live interaction for play and discovery, then a separate higher density render path for still images that actually hold up.

---

## How it works

The project architecture is split into a few clear parts:

```text
attractors/  -> attractor definitions and manager
hands/       -> MediaPipe tracking and gesture interpretation
renderer/    -> ModernGL live scene + Datashader snapshot export
main.py      -> app loop, controls, camera session, CLI modes
```

The main technical pieces are:

- Each attractor is implemented as its own class, while an **AttractorManager** handles switching, trail buffers, normalization, projection, and placard metadata.
- The live simulation uses **Numba based RK4 stepping** and batched sampling so the trails stay responsive while still feeling dense.
- **MediaPipe** tracks up to two hands, then a gesture layer maps pinches and pinky touch gestures into scene controls and attractor switching.
- The live view is rendered through **ModernGL** as animated additive point sprites with shader based pulse and drift.
- The export path uses **Datashader** to generate dense 4K snapshots of the current attractor with inferno inspired density coloring.
- A procedural grain-texture background with subtle drift keeps the visual aesthetic cohesive, while a fog veil layered on top keeps the attractor legible against the busy trail.

One detail I especially like is that the project is not locked to webcam input. It still works as a keyboard and mouse viewer with `--no-camera`, and it can also run in snapshot only or headless export modes.

---

## What I learned

- Gesture control becomes much more usable when each hand has a clear role. Splitting navigation and parameter changes across left and right hands keeps the interface understandable.
- Real time rendering and export rendering should not be the same pipeline. The live viewer needs responsiveness; the still image exporter needs density and resolution.
- A project like this benefits from **good fallback paths**. Camera off, headless export, direct attractor selection, and tests all make it more robust than a one off experiment.
- Presentation matters. The placard, figure list, overlay, and PiP are not decoration only; they make the software feel intentional.

---

## Potential next steps

These are directions suggested by the current codebase, not features already documented in the repo:

- Push more of the trail generation and shading further onto the GPU
- Expand the snapshot pipeline with more export looks and metadata presets
- Keep refining the interaction language so the viewer feels closer to a real performance tool

---

## Related

- [GitHub Repo](https://github.com/yuazi/attractormediapipe)
- [[notes/lorenz-attractor|(y-) The Lorenz Attractor]] — background on one of the systems included in the viewer

[[index|Return to Work]]

---
