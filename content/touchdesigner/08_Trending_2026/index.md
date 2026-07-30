---
title: "(y8) Trending: Gallery-Grade 2026"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - mediapipe
  - generative
date: 2026-06-18
---

Fifteen project studies across two formats: ten installation-scale builds and five shorter, reel-style recreations. The chapter focuses on **real-time AI** (live diffusion, monocular depth, Gaussian splats), **camera-only body interaction** (MediaPipe presence, hands, and holistic tracking), and generative systems that can run as finished gallery loops.

> [!tip] Want to amaze someone?
> Every recipe here is built to look finished on a big screen or projector. Pick one, swap in a photo or song that means something to the two of you, and you have an installation-quality piece in an evening.

> [!info] What you'll need
>
> - TouchDesigner 2025+ (any build with the **POP** family).
> - The **MediaPipe TouchDesigner plugin** by Torin Blankensmith: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - For the AI recipes: an NVIDIA GPU (RTX 20-series or newer) and the **TouchDiffusion** plugin by olegchomp: [download here](https://github.com/olegchomp/TouchDiffusion).
> - A webcam, and ideally a dark room.

---

## Real-Time AI (the 2026 headline)

- **[[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|(y-) Live AI Painting with TouchDiffusion]]**: Turn your webcam, or any TOP, into a continuously repainted AI canvas using StreamDiffusion. The single hottest TD technique of the year.
- **[[touchdesigner/08_Trending_2026/ControlNet Pose to Art|(y-) ControlNet Pose-to-Art]]**: Your body pose drives a living AI artwork. Move, and the painting regenerates around your silhouette.
- **[[touchdesigner/08_Trending_2026/Gaussian Splatting Scenes|(y-) Gaussian Splatting Scenes]]**: Import a 3D Gaussian Splat of a real place and fly a camera through it. Photoreal volumetric memories.
- **[[touchdesigner/08_Trending_2026/Depth Anything Parallax Portraits|(y-) Depth Anything Parallax Portraits]]**: Use AI monocular depth to turn a single flat photo into a living 2.5D parallax scene.

## MediaPipe Installations (camera-only interaction)

- **[[touchdesigner/08_Trending_2026/Interactive Portrait Wall|(y-) Interactive Portrait Wall]]**: A gallery piece where a viewer who steps closer dissolves into a cloud of particles. Pure presence and proximity.
- **[[touchdesigner/08_Trending_2026/Air Drawing Light Painting|(y-) Air-Drawing Light Painting]]**: Pinch your fingers in the air and paint glowing ribbons of light. The crowd-pleaser interactive.
- **[[touchdesigner/08_Trending_2026/Holistic Magic Mirror|(y-) Holistic Magic Mirror]]**: Face, hands, and body tracked at once to build a responsive "magic mirror" that reacts to your whole presence.

## Generative & Atmospheric (gallery loops)

- **[[touchdesigner/08_Trending_2026/Reaction Diffusion Living Canvas|(y-) Reaction-Diffusion Living Canvas]]**: A GLSL Gray-Scott system that grows organic, coral-like textures forever. The definitive "living wallpaper."
- **[[touchdesigner/08_Trending_2026/Volumetric Audio Nebula|(y-) Volumetric Audio Nebula]]**: A glowing 3D nebula of points that breathes with music. The perfect romantic ambient loop.
- **[[touchdesigner/08_Trending_2026/Projection Mapped Memory Garden|(y-) Projection-Mapped Memory Garden]]**: The finale. Combine presence detection with projection mapping so flowers bloom on a real wall when someone walks up.

## Viral Right Now (recreate these reels)

Five art-video styles going viral on TikTok and Instagram in June 2026, each as a step-by-step recreate-it tutorial with the original linked and a vertical export for posting.

- **[[touchdesigner/08_Trending_2026/Viral - Photo to Exploding Particles|(y-) Photo to Exploding Particles]]**: A photo shatters into a 3D point cloud on the beat. The scroll-stopper.
- **[[touchdesigner/08_Trending_2026/Viral - Hand-Tracked Metaballs|(y-) Hand-Tracked Metaballs]]**: Glowing chrome blobs merge at your fingertips. MediaPipe hands.
- **[[touchdesigner/08_Trending_2026/Viral - Audio Reactive Hand Tracking Reel|(y-) Audio-Reactive Hand-Tracking Reel]]**: Visuals that pulse with the music and bend to your hands at once.
- **[[touchdesigner/08_Trending_2026/Viral - Real-Time AI Repaint Reel|(y-) Real-Time AI Repaint Reel]]**: Live footage repainted as oil/Ghibli in real time. Before/after reveal.
- **[[touchdesigner/08_Trending_2026/Viral - Smoky Optical Flow Particles|(y-) Smoky Optical-Flow Particles]]**: Ink-in-water smoke that follows motion. Hypnotic loop.

---

## Suggested order

If you are new to these techniques, build the ten installation projects in this order. Each one teaches a skill the next reuses:

1. Reaction-Diffusion Living Canvas (GLSL + feedback).
2. Volumetric Audio Nebula (POPs + audio).
3. Interactive Portrait Wall (MediaPipe presence).
4. Air-Drawing Light Painting (MediaPipe hands + feedback).
5. Holistic Magic Mirror (combining tracking models).
6. Depth Anything Parallax Portraits (AI depth, no body tracking).
7. Live AI Painting with TouchDiffusion (real-time diffusion).
8. ControlNet Pose-to-Art (diffusion + pose).
9. Gaussian Splatting Scenes (volumetric capture).
10. Projection-Mapped Memory Garden (the installation finale).

The five viral tutorials are shorter variations rather than prerequisites. Try them whenever their source technique—POPs, MediaPipe, optical flow, audio analysis, or live diffusion—feels familiar.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
