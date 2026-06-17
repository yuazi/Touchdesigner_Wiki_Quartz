---
title: "Air-Drawing Light Painting"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - mediapipe
  - handtracking
  - feedback
date: 2026-06-18
---

Pinch your thumb and index finger together in the air and paint a glowing ribbon of light that hangs in space and slowly fades. Open your fingers to stop. This is the single most reliable crowd-pleaser in interactive art: people understand it in two seconds and immediately start signing their names in light. It runs on a webcam and the **MediaPipe** hand model.

> [!info] Before You Start
> - You need the **MediaPipe TouchDesigner plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - MediaPipe gives 21 keypoints per hand. We mainly use the thumb tip, index tip, and index knuckle.

---

## 1. Track the Pinch

1.  Set up the MediaPipe plugin with the **Hand Tracking** model on.
2.  Add a **Select CHOP** and grab the thumb tip and index tip positions (`H1` channels for the first hand).
3.  Compute the distance between them with a **Math CHOP** (or a small expression). Small distance equals a pinch.
4.  Add a **Logic CHOP** to turn "distance below threshold" into a clean `PINCH` on/off signal.

> [!tip] Why pinch instead of "always drawing"?
> A pinch gives people a pen-down and pen-up, exactly like a real brush. Without it, the screen fills with spaghetti in seconds.

---

## 2. Get the Brush Position

1.  Take the index fingertip X and Y from the hand model.
2.  These are normalised 0 to 1; map them to your canvas resolution.
3.  Draw a small soft dot at that position using a **Circle TOP** positioned by the coordinates, or a **GLSL TOP** that draws a glow at the point.

---

## 3. The Light Trail (Feedback)

This is the heart of the effect.

1.  Build a **Feedback TOP** loop: composite the new brush dot **over** the previous frame.
2.  Each frame, multiply the fed-back image by `0.97` so old strokes slowly fade.
3.  Gate the brush dot by `PINCH` so it only paints while you are pinching.

See [[touchdesigner/03_Rendering_and_Output/Feedback Loops|Feedback Loops]] for the wiring pattern.

---

## 4. Make It Beautiful

1.  Add a **Bloom TOP** after the feedback so the ribbon glows.
2.  Drive the brush **hue** from the hand's speed: fast strokes go hot, slow strokes go cool.
3.  Add a faint **chromatic aberration** for that premium look (see [[touchdesigner/06_Recipes_and_Projects/y-1/Chromatic Aberration Feedback|Chromatic Aberration Feedback]]).
4.  Mirror the webcam so the motion feels natural to the person painting.

---

## Troubleshooting

- **"It draws even when my hand is open."** - Your pinch threshold is too loose. Tighten it, and normalise the distance by hand size (distance from wrist to middle knuckle) so it works at any distance from the camera.
- **"The line is jittery."** - Add a **Lag** or **Filter CHOP** on the fingertip position before drawing.
- **"Strokes never fade / fade too fast."** - Tune the feedback multiply value. `0.99` lingers, `0.90` disappears quickly.

---

## Next Steps

- **Two-handed:** Track both hands for duets, or use the second hand's pinch to change colour.
- **Gesture clear:** Detect an open-palm "wipe" to fade the whole canvas at once.
- **Ribbon geometry:** Instead of a 2D trail, feed fingertip positions into a [[touchdesigner/02_The_Operators/POPs/index|POP]] line so the stroke becomes 3D and you can orbit it.

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                  |
| :------------------- | :------------------------------------------------------------------------ |
| **Pinch threshold**   | Lower = needs a tight pinch (fewer accidents); Higher = easy but messy.    |
| **Feedback multiply** | Closer to 1 = long-lasting trails; Lower = quick-fading strokes.           |
| **Brush size**        | Larger = bold marker; Smaller = fine pen.                                  |
| **Position lag**      | Higher = smooth, flowing lines; Lower = responsive but jittery.            |

## Network Architecture

```text
[ INPUT ]                      [ Video Device In TOP ] (webcam, mirrored)
                                      │
                                      ▼
[ TRACKING ]                   [ MediaPipe.tox ] (Hand model, 21 keypoints)
                                      │
                          ┌───────────┴────────────┐
                          ▼                         ▼
[ PINCH ]        [ Select CHOP: thumb+index ]   [ Select CHOP: index tip XY ]
                          │                         │
                          ▼                         ▼
                [ Math: distance ]          [ map to canvas + Lag ]
                          │                         │
                          ▼                         ▼
                [ Logic: PINCH ] ───────────▶ [ Brush dot (Circle/GLSL) ]
                                                    │ (gated by PINCH)
                                                    ▼
[ TRAIL ]                                   [ Feedback TOP ] (over + fade ×0.97)
                                                    │
                                                    ▼
[ OUT ]                                     [ Bloom ] ──▶ [ Chromatic Aberration ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
