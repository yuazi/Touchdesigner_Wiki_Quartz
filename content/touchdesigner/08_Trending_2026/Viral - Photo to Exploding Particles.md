---
title: "Viral: Photo to Exploding Particles"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - td/viral
  - pops
  - particles
date: 2026-06-18
---

The scroll-stopper that is everywhere on TikTok and Reels right now: a photo or video clip shatters into a living 3D cloud of points, drifts, then snaps back. This tutorial recreates the viral version end to end, including the vertical export so you can post it.

> [!info] Watch the trend
>
> - [IMAGE / VIDEO TO PARTICLES, TouchDesigner Tutorial (YouTube)](https://www.youtube.com/watch?v=TbM2_Cvygww)
> - [Video Motion Controlled Particles (Derivative)](https://derivative.ca/community-post/tutorial/video-motion-controlled-particles/70171)
>
> Technique base: [[touchdesigner/06_Recipes_and_Projects/y-2/Image to POPs|Image to POPs]] and [[touchdesigner/08_Trending_2026/Interactive Portrait Wall|Interactive Portrait Wall]].

---

## 1. Image into Points

1.  Add a **Movie File In TOP** with your photo or short clip.
2.  Convert it to points with a **TOP to POP** (one point per pixel). Each point keeps its colour.
3.  At this stage you have a flat wall of points that just looks like the image.

> [!tip] Resolution = particle count
> A `1280x720` image is nearly a million points. Start lower (around `640x360`) while you design, then raise it for the final render.

---

## 2. The Explode

This is the viral move.

1.  Add a **Noise POP** that outputs a 3D vector per point (turbulent, smooth).
2.  Push each point's position along that vector. Multiply by an **EXPLODE** amount.
3.  Animate `EXPLODE` from 0 (image intact) up to a big value (full cloud) and back, with an ease.
4.  Drive `EXPLODE` from a beat: a **Beat CHOP** or an audio bass envelope so it bursts on the drop.

---

## 3. Make It 3D and Cinematic

1.  Render the points as small instanced shapes or soft sprites with a **Render TOP**.
2.  Add a **Camera COMP** doing a slow push-in or orbit so the cloud has real depth.
3.  Light it: one key light, additive glow, a touch of **depth of field** so the front points are sharp.

---

## 4. Export the Reel

1.  Set your **Window/Render resolution to 1080x1920** (vertical).
2.  Frame the action centred for phone screens.
3.  Render to a movie with **Movie File Out TOP**, then drop it over a trending audio clip in your editor.

> [!tip] The personal version
> Use a photo of the two of you. Time the burst to the beat of a song that means something. That is the whole magic: a familiar image becoming light.

---

## Troubleshooting

- **"It just looks like floating dots, not my image."** - Lower the explode amount and reduce noise so the image reads at rest before it bursts.
- **"Too slow."** - Drop the source resolution (fewer points) and keep everything in POPs on the GPU.
- **"The burst looks mechanical."** - Ease the `EXPLODE` curve and add a slight per-point delay so points scatter in a wave, not all at once.

---

## Parameter Tuning & Behavior

| Parameter          | Behavior                                                  |
| :----------------- | :-------------------------------------------------------- |
| **Explode amount** | Higher = full disintegration; Lower = gentle shimmer.     |
| **Noise scale**    | Larger = big swirling clumps; Smaller = fine fizzy dust.  |
| **Point size**     | Larger = bold, painterly; Smaller = delicate starfield.   |
| **Camera speed**   | Slower = cinematic; Faster = energetic, music-video feel. |

## Network Architecture

```text
[ SOURCE ]        [ Movie File In TOP ] (photo/clip)
                         │
                         ▼
[ TO POINTS ]     [ TOP to POP ] (1 point/pixel, keeps colour)
                         │
                         ▼
[ EXPLODE ]       [ Noise POP ] ──▶ position += noise × EXPLODE  ◀── [ Beat/Bass env ]
                         │
                         ▼
[ RENDER ]        [ Render TOP ] ◀── [ Camera (slow push-in) ] + light
                         │
                         ▼
[ EXPORT ]        [ 1080x1920 ] ──▶ [ Movie File Out TOP ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
