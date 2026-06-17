---
title: "Viral: Hand-Tracked Metaballs"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - td/viral
  - mediapipe
  - handtracking
  - metaballs
date: 2026-06-18
---

Wave your hand and glowing blobs gather at your fingertips, merging and splitting like mercury. The "viral blob" effect, driven by MediaPipe hand tracking. It reads instantly on camera, which is exactly why it spreads.

> [!info] Watch the trend
> - [Interactive Particles & Metaballs in TouchDesigner (YouTube)](https://www.youtube.com/watch?v=FAYpBUBDonY)
> - [Hand-Tracked Interactive Orbit Gallery, Apr 2026 (YouTube)](https://www.youtube.com/watch?v=9WL-sOtpAXI)
>
> Technique base: [[touchdesigner/08_Trending_2026/Air Drawing Light Painting|Air-Drawing Light Painting]] and [[touchdesigner/06_Recipes_and_Projects/y-3/Hand Tracking Tutorial|Complete Hand Tracking Walkthrough]].
> You need the **MediaPipe plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).

---

## 1. Track Fingertips

1.  Enable the MediaPipe **Hand Tracking** model.
2.  With a **Select CHOP**, grab the X and Y of the five fingertips (and the palm centre).
3.  Map their normalised coordinates to your canvas. Smooth with a **Lag CHOP** so the blobs glide.

---

## 2. What Is a Metaball?

A metaball is a soft field around a point. Where two fields overlap, they fuse into one smooth blob instead of two circles. We build the field in a **GLSL TOP**.

1.  In the shader, for each pixel, sum `radius / distance(pixel, fingertip)` over all fingertips.
2.  Threshold the sum: above the cutoff is "inside the blob," producing organic merged shapes.
3.  Feed the fingertip positions in as a uniform array from the CHOP.

> [!tip] No code version
> If you would rather avoid GLSL, place a soft white **Circle TOP** at each fingertip, composite them additively, then run a hard **threshold** plus blur. It is the same idea: soft fields plus a cutoff equals fusing blobs.

---

## 3. Make It Liquid Chrome

1.  Use the blob mask to drive a **normal map** (from its gradient) and shade it like metal: bright rim, dark core, a reflected environment.
2.  Add **chromatic aberration** and **bloom** for that premium mercury look.
3.  Optional: feed the blobs through [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|GLSL]] feedback so they leave a brief liquid trail.

---

## 4. Post It

1.  Mirror the webcam so your motion feels natural.
2.  Set output to **1080x1920** vertical, hands centred.
3.  Record a 10 to 15 second clip of playful hand movement and post over trending audio.

---

## Troubleshooting

- **"Blobs do not merge."** - Increase the per-fingertip radius so nearby fields overlap before fusing.
- **"Edges are jagged."** - Add a small blur after the threshold, or use a smooth (soft) threshold instead of a hard cut.
- **"It jitters."** - More Lag on the fingertip CHOP; normalise positions by hand size so it is stable at any distance.

---

## Parameter Tuning & Behavior

| Parameter         | Behavior                                                              |
| :---------------- | :------------------------------------------------------------------- |
| **Field radius**   | Larger = blobs merge eagerly; Smaller = stay as separate dots.       |
| **Threshold**      | Higher = small tight blobs; Lower = big gooey mass.                  |
| **Fingertip lag**  | Higher = slow, liquid follow; Lower = snappy and responsive.         |
| **Bloom / rim**    | Higher = glowing chrome; Lower = matte, subtle.                      |

## Network Architecture

```text
[ INPUT ]         [ Video Device In TOP ] (webcam, mirrored)
                         │
                         ▼
[ TRACKING ]      [ MediaPipe.tox ] (Hand model)
                         │
                         ▼
[ POSITIONS ]     [ Select CHOP: 5 fingertips ] ──▶ [ Lag CHOP ]
                         │
                         ▼
[ FIELD ]         [ GLSL TOP ] sum(radius / dist) + threshold
                         │
                         ▼
[ SHADE ]         [ normal-from-gradient ] ──▶ chrome shading
                         │
                         ▼
[ OUT ]           [ Bloom ] ──▶ [ Chromatic Aberration ] ──▶ [ OUT 1080x1920 ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
