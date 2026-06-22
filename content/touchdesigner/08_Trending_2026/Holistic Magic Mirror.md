---
title: "Holistic Magic Mirror"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - mediapipe
  - holistic
  - installation
date: 2026-06-18
---

A "magic mirror" reacts to your whole presence at once: a crown of light follows your head, particles trail your hands, and the background colour breathes with your posture. We get all of it from running several **MediaPipe** models together (face, hands, and pose), the holistic approach that defines 2026 installation work. The viewer sees a stylised reflection that knows where they are looking and reaching.

> [!info] Before You Start
>
> - Finish at least one earlier MediaPipe recipe so you are comfortable with the plugin.
> - You need the **MediaPipe TouchDesigner plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - This recipe is heavier than the single-model ones. A recent GPU helps.

---

## 1. Turn On the Models

1.  In the MediaPipe COMP, enable **Face**, **Hands**, and **Pose** together.
2.  Each outputs its own set of channels. Keep three **Select CHOP**s, one per model, so the data stays organised.
3.  Watch your FPS. If it dips, drop the pose model's complexity setting or run face at a lower rate.

> [!tip] Route by OSC if it stutters
> Some performers run MediaPipe in a separate process and stream landmarks into TouchDesigner over **OSC** (see [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|OSC and MIDI]]). It keeps the heavy inference off your render thread.

---

## 2. The Mirror Base

1.  Show the webcam, mirrored, as the base layer (a real reflection).
2.  Optionally stylise it: posterize, edge-detect, or run it through the [[touchdesigner/08_Trending_2026/Reaction Diffusion Living Canvas|reaction-diffusion]] shader for a painted look.

---

## 3. Layer the Reactive Elements

Build one element per tracked feature:

1.  **Head crown:** Use the face position to place a ring of instanced glowing shapes above the head.
2.  **Hand trails:** Feed both index fingertips into [[touchdesigner/08_Trending_2026/Air Drawing Light Painting|light-painting]] feedback trails.
3.  **Posture mood:** Use shoulder width or arm spread from the pose model to drive the background hue and bloom (arms wide equals bright and warm).

Composite all layers over the mirror base with additive blending.

---

## 4. Tie It Together

1.  Add gentle **Lag** on every tracked value so the mirror feels smooth and slightly magical rather than twitchy.
2.  Add a slow ambient drift to the background even when no one moves, so it never looks frozen.
3.  Run full screen on a vertical display for the classic mirror format.

---

## Troubleshooting

- **"FPS collapses with all three models."** - That is expected. Reduce pose complexity, run face every other frame, and lower the render resolution. Or move inference to OSC as above.
- **"Elements lag behind me."** - Lower the Lag smoothing on position channels (keep smoothing only on colour/mood).
- **"Tracking drops when I raise my arms."** - Make sure your whole body is in frame and well lit; back up from the camera.

---

## Next Steps

- **Expression-aware:** Use face blendshapes so the crown sparkles when you smile (see [[touchdesigner/06_Recipes_and_Projects/y-2/MediaPipe Face Tracking for Interactive Expressions|MediaPipe Face Tracking]]).
- **AI mirror:** Pipe the stylised mirror into [[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|live AI painting]] for a fully generative reflection.
- **Couple mode:** Track two people and draw a connecting light bridge between their hands.

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                              |
| :------------------- | :-------------------------------------------------------------------- |
| **Pose complexity**  | Higher = accurate joints but slow; Lower = fast but rougher tracking. |
| **Position lag**     | Higher = dreamy, floaty mirror; Lower = tight and responsive.         |
| **Mood (hue) range** | Wider = dramatic colour swings with posture; Narrower = subtle.       |
| **Element opacity**  | Higher = bold overlay; Lower = ghostly, reflection-first look.        |

## Network Architecture

```text
[ INPUT ]                      [ Video Device In TOP ] (webcam, mirrored)
                                  │                        │
                                  │                        ▼
                                  │                 [ MediaPipe.tox ]
                                  │                 (Face + Hands + Pose)
                                  │                        │
                                  │        ┌───────────────┼───────────────┐
                                  │        ▼               ▼               ▼
                                  │  [ Face Select ]  [ Hands Select ] [ Pose Select ]
                                  │        │               │               │
                                  │        ▼               ▼               ▼
                                  │  [ Head crown ]  [ Hand trails ]  [ Mood / hue ]
                                  │        │               │               │
                                  ▼        └───────┬───────┴───────────────┘
[ MIRROR ]                 [ stylise ] ──▶ [ Composite (additive) ]
                                                   │
                                                   ▼
[ OUT ]                                     [ Bloom TOP ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
