---
title: "Viral: Real-Time AI Repaint Reel"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - td/viral
  - ai
  - streamdiffusion
  - comfyui
date: 2026-06-18
---

Live footage continuously repainted into an oil painting, a Ghibli watercolour, or molten glass, in real time, following your every move. This is the headline AI-art trend of 2026 and a guaranteed save on Reels. This tutorial focuses on getting a clean, postable repaint loop, building on the engine setup from the main diffusion recipe.

> [!info] Watch the trend
> - [Audio-Reactive Generative Art Using ComfyUI + TouchDesigner](https://www.classcentral.com/course/youtube-comfyui-generative-ai-with-touchdesigner-355092)
>
> Engine setup first: [[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|Live AI Painting with TouchDiffusion]]. Pose-locked version: [[touchdesigner/08_Trending_2026/ControlNet Pose to Art|ControlNet Pose-to-Art]].

> [!warning] On a Mac?
> Local StreamDiffusion needs NVIDIA. On Apple Silicon use **Hosted StreamDiffusion (Daydream)** or DotSimulate's **StreamDiffusionTD** in cloud mode. The reel workflow below is identical; only the engine runs remotely.

---

## 1. Pick the Two Routes

- **TouchDiffusion / StreamDiffusionTD:** fastest path, one node, frame-by-frame repaint. Best for live performance.
- **ComfyUI bridge:** you run a ComfyUI graph and pipe frames between it and TouchDesigner (Spout/NDI or a TCP bridge). Best when you want multiple models, LoRAs, or ControlNets stacked.

For a first viral clip, use the single-node route. Reach for ComfyUI when you want a very specific look.

---

## 2. The Repaint Loop

1.  Feed your **webcam** (or a clip of you two) into the diffusion node at `512x512`.
2.  Prompt the style: `Studio Ghibli watercolour, soft light, hand-painted` or `thick oil painting, golden hour`.
3.  Set **denoise/strength** to `0.4`–`0.55` so your motion stays readable while the style fully takes over.
4.  Lock the **seed** so the look is consistent frame to frame.

---

## 3. Kill the Flicker (the pro step)

Raw real-time diffusion shimmers. Tame it:

1.  Add a slight **Lag** or **Blur** on the input so the model sees smoother frames.
2.  Add a light **Feedback TOP** blend (mix ~15% of the previous output) to stabilise across frames.
3.  Keep movement slow and deliberate while recording.

---

## 4. Audio-React It (optional, very viral)

1.  Bind **denoise strength** to a bass envelope so the painting "melts" harder on the drop, then resolves.
2.  Or swap the **prompt** on a beat via a [[touchdesigner/02_The_Operators/DATs/index|DAT]] so the style morphs through the song.

---

## 5. Post It

1.  Output **1080x1920** vertical.
2.  A before/after reveal (real face, then painted) performs extremely well; show a second of raw webcam, then let the repaint take over.
3.  Record over trending audio and post.

---

## Troubleshooting

- **"It flickers like crazy."** - Lower strength, add input blur and the feedback blend, slow your movement.
- **"4 FPS."** - Drop resolution and denoise steps, close other GPU apps, ensure the optimized (TensorRT) engine is active. On Mac, use the cloud path.
- **"My face turns into a monster."** - Lower strength so structure is preserved, or add a ControlNet (see the pose recipe) to lock composition.

---

## Parameter Tuning & Behavior

| Parameter        | Behavior                                                                 |
| :--------------- | :----------------------------------------------------------------------- |
| **Strength**      | Higher = fully AI, ignores you; Lower = your footage shows through.      |
| **Seed**          | Fixed = stable style; Random = shifting, less coherent.                  |
| **Feedback blend** | Higher = very stable but smeary; Lower = crisp but flickery.            |
| **Steps**         | Higher = detailed but slow; Lower = fast and painterly.                  |

## Network Architecture

```text
[ SOURCE ]    [ Video Device In TOP ] ──▶ [ Resolution 512 ] ──▶ [ slight Blur/Lag ]
                                                                       │
                                                                       ▼
[ ENGINE ]    [ TouchDiffusion / StreamDiffusionTD / ComfyUI bridge ]
              (Prompt + Strength + Seed)   ◀── optional bass env on Strength
                                                                       │
                                                                       ▼
[ STABILISE ] [ Feedback TOP ] (blend ~15% previous output)
                                                                       │
                                                                       ▼
[ OUT ]       [ Bloom / grade ] ──▶ [ OUT 1080x1920 ] ──▶ [ Movie File Out ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
