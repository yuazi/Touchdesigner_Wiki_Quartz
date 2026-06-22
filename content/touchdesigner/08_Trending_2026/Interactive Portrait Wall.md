---
title: "Interactive Portrait Wall"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - mediapipe
  - installation
  - particles
date: 2026-06-18
---

A gallery favourite for 2026: a large screen showing a calm portrait. When someone steps closer, their silhouette dissolves into a cloud of drifting particles, then reforms when they step back. It uses nothing but a webcam and the **MediaPipe** body-segmentation model. No depth camera, no floor sensors. This is the recipe that makes people stop walking and start playing.

> [!info] Before You Start
>
> - You need the **MediaPipe TouchDesigner plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - A webcam mounted near the screen, pointing at the viewer.

---

## 1. Get a Clean Silhouette

1.  Set up the MediaPipe plugin and enable the **Image Segmentation** (person mask) model.
2.  Its output is a white-on-black mask of any person in frame.
3.  Smooth it with a small **Blur TOP** and a **Lag CHOP**-driven threshold so edges do not jitter.

> [!tip] Why segmentation, not pose?
> Pose gives you joints; segmentation gives you the whole body shape. For a particle dissolve you want the full silhouette, so the mask model is the right tool.

---

## 2. Estimate "Closeness"

We have no depth sensor, so we infer proximity from how much of the frame the person fills.

1.  Feed the mask into an **Analyze TOP** set to **Average**. This gives one number: the fraction of white pixels.
2.  A person far away is a small white blob (low value). Up close they fill the frame (high value).
3.  Pipe that into a **CHOP** via **TOP to CHOP**, smooth it, and call it `PROXIMITY`.

---

## 3. Turn the Portrait into Particles

1.  Bring your base portrait image into a **POP** point cloud (one point per pixel; see [[touchdesigner/06_Recipes_and_Projects/y-2/Image to POPs|Image to POPs]]).
2.  Add a **Noise POP** that pushes each point along a turbulent vector.
3.  Bind the noise **amplitude** to `PROXIMITY`. Far away: zero noise, crisp portrait. Close up: high noise, the portrait scatters into a storm of points.

---

## 4. The Reform Moment

1.  Add a **Lag** on `PROXIMITY` with a slow rise and even slower fall.
2.  This makes the portrait scatter quickly as someone approaches and reassemble gently as they leave, which feels alive rather than mechanical.
3.  Render the points with additive blending and a soft **Bloom TOP** for that glowing gallery look.

---

## Troubleshooting

- **"The mask is noisy and the portrait flickers."** - Blur the mask and raise the Lag smoothing. Good, even lighting on the viewer helps enormously.
- **"Proximity jumps around."** - Average over a slightly cropped region (ignore the frame edges) and smooth the CHOP more.
- **"It lags / low FPS."** - Run only the segmentation model in MediaPipe, and cap the POP point count to your portrait resolution divided by 2.

---

## Next Steps

- **Colour shift:** Also bind `PROXIMITY` to a hue rotation so the portrait warms up as people approach.
- **Multi-person:** The mask already handles several people; the closest/largest one dominates the dissolve.
- **Sound:** Add a soft whoosh whose volume tracks `PROXIMITY` for a fuller installation.

---

## Parameter Tuning & Behavior

| Parameter                | Behavior                                                           |
| :----------------------- | :----------------------------------------------------------------- |
| **Noise amplitude**      | Higher = explosive scatter; Lower = gentle shimmer.                |
| **Proximity lag (fall)** | Slower = portrait reforms dreamily; Faster = snaps back instantly. |
| **Mask blur**            | Higher = soft, stable silhouette; Lower = sharp but jittery.       |
| **Bloom intensity**      | Higher = ethereal glow; Lower = grounded, photographic.            |

## Network Architecture

```text
[ INPUT ]                      [ Video Device In TOP ] (webcam)
                                      │
                                      ▼
[ TRACKING ]                   [ MediaPipe.tox ] (Segmentation mask)
                                      │
                          ┌───────────┴───────────┐
                          ▼                        ▼
[ PROXIMITY ]   [ Analyze TOP (avg) ]      (mask not needed downstream)
                          │
                          ▼
                [ TOP to CHOP ] ──▶ [ Lag CHOP ] ──▶ PROXIMITY
                          │
                          ▼
[ PARTICLES ]   [ Portrait ] ──▶ [ Image-to-POP ] ──▶ [ Noise POP (amp = PROXIMITY) ]
                                                              │
                                                              ▼
[ RENDER ]                                          [ Render TOP (additive) ]
                                                              │
                                                              ▼
[ OUT ]                                             [ Bloom TOP ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
