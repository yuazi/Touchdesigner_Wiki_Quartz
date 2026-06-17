---
title: "Viral: Smoky Optical-Flow Particles"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - td/viral
  - opticalflow
  - particles
  - feedback
date: 2026-06-18
---

Ink-in-water smoke that swirls along the motion in a video, hypnotic, endlessly looped, very save-able. It works by reading **optical flow** (which direction each pixel is moving) from footage or a webcam, then pushing particles along that flow. Move, and smoke trails follow you.

> [!info] Watch the trend
> - [Creating Smoky Particle Feedback Effects in TouchDesigner](https://www.classcentral.com/course/youtube-smoky-particle-feedback-fx-in-touchdesigner-344208)
> - [Video to move particles with Optical Flow + ParticlesGPU (AllTouchDesigner)](https://alltd.org/touchdesigner-using-video-to-move-particles-with-optical-flow-and-particlesgpu/)
>
> Technique base: [[touchdesigner/08_Trending_2026/Reaction Diffusion Living Canvas|Reaction-Diffusion Living Canvas]] (feedback) and [[touchdesigner/06_Recipes_and_Projects/y-3/Real-time Motion History and Optical Flow|Motion History & Optical Flow]].

---

## 1. Get the Flow Field

1.  Add a **Video Device In TOP** (webcam) or a **Movie File In TOP**.
2.  Add an **Optical Flow TOP**. Its output encodes motion direction and speed as colour (a velocity field): red/green channels are X/Y movement.
3.  Smooth it with a small **Blur** so the field is not noisy.

> [!tip] What optical flow gives you
> Every pixel gets a little arrow saying "this is moving up-left, fast." That arrow field is exactly what you need to steer particles or smoke.

---

## 2. Drive the Smoke (two ways)

**A) Feedback smoke (no particles, pure TOPs):**

1.  Build a **Feedback TOP** loop holding a "density" image.
2.  Each frame, **displace** the fed-back density by the optical-flow velocity (a GLSL or Displace TOP), then fade slightly.
3.  Inject density where there is motion. The result smears and curls like smoke.

**B) GPU particles:**

1.  Use a **ParticlesGPU** / POP system.
2.  Sample the flow field at each particle's position and add it to the particle velocity.
3.  Particles stream along the motion, leaving trails.

Start with A: it is fewer nodes and reads as smoke immediately.

---

## 3. Make It Beautiful

1.  Run the density through a **Lookup TOP** gradient (smoke white, or ink blue to violet).
2.  Add **bloom** and a gentle **Blur** so it glows and softens.
3.  Slightly **zoom the feedback** each frame for a drifting, rising-smoke feel.

---

## 4. Loop and Post

1.  For a seamless loop, drive motion from a looping clip rather than a live cam.
2.  Output **1080x1920**, record 10 to 20 seconds.
3.  Calm, slow footage gives the most elegant smoke; fast motion gives turbulent bursts.

---

## Troubleshooting

- **"The flow is just noise."** - Blur the input and the flow output; raise the Optical Flow smoothing. Good lighting reduces false motion.
- **"Smoke builds up and whites out."** - Increase the per-frame fade (multiply density by ~0.96) so it dissipates.
- **"It looks flat."** - Add the feedback zoom and a colour gradient; flat grey density never looks like smoke.

---

## Parameter Tuning & Behavior

| Parameter          | Behavior                                                              |
| :----------------- | :------------------------------------------------------------------- |
| **Flow strength**   | Higher = violent swirls; Lower = lazy drifting smoke.                |
| **Density fade**    | Closer to 1 = thick lingering smoke; Lower = wispy, quick-clearing.  |
| **Feedback zoom**   | Higher = fast rising/expanding; Lower = settled, hovering.           |
| **Input blur**      | Higher = smooth elegant flow; Lower = detailed but jittery.          |

## Network Architecture

```text
[ SOURCE ]    [ Video Device In / Movie File In TOP ]
                         │
                         ▼
[ MOTION ]    [ Optical Flow TOP ] (velocity field) ──▶ [ Blur ]
                         │
                         ▼
[ SMOKE ]     ┌──▶ [ Displace by velocity (GLSL) ] ──┐
              │            (+ inject density at motion) │
              └──────── [ Feedback TOP ] (fade ×0.96, slight zoom) ◀┘
                         │
                         ▼
[ COLOUR ]    [ Lookup TOP gradient ]
                         │
                         ▼
[ OUT ]       [ Bloom ] ──▶ [ Blur ] ──▶ [ OUT 1080x1920 ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
