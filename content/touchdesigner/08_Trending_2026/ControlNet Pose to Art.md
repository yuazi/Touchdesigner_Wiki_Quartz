---
title: "ControlNet Pose-to-Art"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - ai
  - controlnet
  - mediapipe
  - posetracking
date: 2026-06-18
---

Real-time diffusion alone is mesmerising, but it "wanders." **ControlNet** fixes that: it locks the AI's composition to a control image. In 2026 the favourite control signal is your own **body pose**, captured live with MediaPipe. Stand in front of the camera and a continuously regenerating artwork forms around your silhouette, following every move you make.

> [!info] Before You Start
> - Finish [[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|Live AI Painting with TouchDiffusion]] first; this builds directly on it.
> - You also need the **MediaPipe TouchDesigner plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - Confirm your TouchDiffusion build includes a **ControlNet (OpenPose)** option in its parameters.

---

## 1. Generate a Pose Skeleton Image

ControlNet wants a clean stick-figure image, not raw video.

1.  Set up the MediaPipe **Pose Tracking** model (see [[touchdesigner/06_Recipes_and_Projects/y-2/MediaPipe Pose Tracking for Full-Body Avatars|MediaPipe Pose Tracking]]).
2.  The plugin can output a rendered skeleton TOP directly. If yours does not, render the landmark CHOP positions as lines into a **Render TOP** on a black background.
3.  You now have a black image with a coloured stick figure that mirrors your body. This is the control image.

> [!tip] Keep it OpenPose-style
> ControlNet's pose model was trained on the OpenPose colour convention (each limb a different colour). The MediaPipe plugin's skeleton output already matches it closely enough to work.

---

## 2. Wire ControlNet

1.  In the TouchDiffusion node, enable the **ControlNet** input and set its mode to **OpenPose**.
2.  Feed your skeleton Render TOP into that ControlNet input.
3.  Keep your normal image input (a texture or solid colour) on the main input.
4.  Set **ControlNet weight** around `0.8` so the pose strongly guides the composition.

---

## 3. Prompt the Scene

1.  Prompt something figurative, for example: `a dancer made of blooming roses, dark background, dramatic light`.
2.  Because ControlNet holds the body shape, the roses will reliably form a human figure that matches your pose.
3.  Move slowly. The figure reshapes itself in real time.

---

## 4. Gallery Finish

1.  Add a **Feedback TOP** loop with a slight zoom and fade so old poses leave ghost trails of petals.
2.  Composite over a soft dark vignette.
3.  Project it large. A person walking up and striking a pose, then seeing themselves bloom into flowers, is the kind of moment that gets remembered.

---

## Troubleshooting

- **"The figure ignores my pose."** - Raise the ControlNet weight, and confirm the skeleton image is bright lines on a black background (no webcam feed bleeding through).
- **"Two skeletons appear."** - Limit MediaPipe to a single detected body, or mask to the closest person.
- **"It's too slow with ControlNet on."** - ControlNet adds cost. Lower the resolution and denoise steps; consider a lighter ControlNet model if your build offers one.

---

## Next Steps

- **Hand-aware:** Add the hand skeleton too so fingers shape detail in the artwork.
- **Theme cycling:** Drive the prompt from a [[touchdesigner/02_The_Operators/DATs/index|DAT]] table so the figure shifts from roses to fire to water.
- **Two people:** Track two bodies and prompt a "couple" scene.

---

## Parameter Tuning & Behavior

| Parameter            | Behavior                                                                  |
| :------------------- | :------------------------------------------------------------------------ |
| **ControlNet weight** | Higher = rigidly follows your pose; Lower = AI improvises the body shape.  |
| **Denoise strength**  | Higher = fully AI-painted; Lower = the control skeleton stays visible.     |
| **Feedback amount**   | Higher = long petal ghost-trails; Lower = crisp, immediate figure.         |
| **Skeleton line width** | Thicker = bolder, more confident figure; Thinner = delicate, fragmented.  |

## Network Architecture

```text
[ INPUT ]                      [ Video Device In TOP ] (webcam)
                                      │
                                      ▼
[ TRACKING ]                   [ MediaPipe.tox ] (Pose model)
                                      │
                                      ▼
[ CONTROL IMAGE ]              [ Render TOP ] (coloured skeleton on black)
                                      │
                                      ▼
[ AI ENGINE ]   [solid in]──▶ [ TouchDiffusion.tox ] ◀── [ ControlNet: OpenPose ]
                               (Prompt + Strength)
                                      │
                                      ▼
[ TRAILS ]                     [ Feedback TOP ] (zoom + fade)
                                      │
                                      ▼
[ OUT ]                        [ Vignette / Bloom ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
