---
title: "Body Segmentation Composite"
tags:
  - touchdesigner
  - td/recipes
  - mediapipe
  - segmentation
  - composite
  - webcam
  - recipes
date: 2026-05-26
---

Use MediaPipe's body segmentation model to cut your live silhouette out of the webcam feed and composite it over a generative background in real time. No alpha channel juggling - just masks, multiplies, and an Add.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Webcam input, masking, and compositing.
> - **COMPs (Component Operators):** The MediaPipe plugin container.

---

## Before You Start

You need the free MediaPipe TouchDesigner plugin (`mediapipe.tox`) by Torin Blankensmith and Dom Scott. Download it from [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner). Drop the `.tox` file into your network - no Python installation needed.

---

## Part 1: Camera and MediaPipe Setup

1. Add a **Video Device In TOP** and set **Device** to your webcam. Connect to a **Null TOP** named `CAM`.
2. Drag `mediapipe.tox` into the network.
3. Connect `CAM` to the first input of `mediapipe1`.
4. In `mediapipe1` parameters, set **Model** to `SelfieSegmentation`.
5. Enable **Image Segmentation**.

> [!info] Finding the Mask Output
> Click the small triangle on `mediapipe1` to expand its output pins. The **Selfie Segmentation** mask is a separate output slot - white = person, black = background. If it shows all-black, wait a second for the model to warm up.

---

## Part 2: Clean the Mask

Raw segmentation masks have rough, flickery edges.

1. Connect the mask output to a **Blur TOP** → **Filter Size** `4`.
2. Connect to a **Threshold TOP** → **Threshold** `0.4`.
3. Connect to a **Null TOP** named `MASK`.

---

## Part 3: Generate the Background

1. Add a **Noise TOP** at the same resolution as `CAM` (e.g., `1280 x 720`).
   - **Type** → `Sparse`, **Amplitude** → `1.0`, **Period** → `0.5`.
   - Right-click **Translate X** → Expression → `absTime.seconds * 0.05`.
2. Add an **HSV Adjust TOP**.
   - **Saturation Multiplier** → `1.5`.
   - Right-click **Hue Offset** → Expression → `absTime.seconds * 10`.
3. Connect to a **Null TOP** named `BG`.

---

## Part 4: Composite Person Over Background

1. **Multiply TOP** (`FG_ONLY`): inputs `CAM` and `MASK`. Person pixels survive; everywhere else goes black.
2. **Invert TOP** on `MASK`.
3. **Multiply TOP** (`BG_ONLY`): inputs `BG` and the Invert output.
4. **Add TOP**: inputs `FG_ONLY` and `BG_ONLY`. Since the masks are exact inverses, no pixel is counted twice.
5. Connect to a **Null TOP** named `OUT`.

---

## Part 5: Polish

1. Before `OUT`, add a **Bloom TOP** (Threshold: `0.4`, Intensity: `0.5`).
2. Add a **Level TOP** → **Contrast** `1.2`.

---

## Background Variations

| Background Source                       | Effect                                      |
| --------------------------------------- | ------------------------------------------- |
| **Noise TOP** (default)                 | Organic flowing color field                 |
| **Feedback loop with Blur**             | Silhouette leaves glowing afterimage trails |
| **Video Device In TOP** (second camera) | Live video as background                    |
| **Slit-Scan Time Warp** output          | Silhouette over a temporal smear            |
| **Reaction-Diffusion** output           | Silhouette over growing biological patterns |

---

## Troubleshooting

- **"Mask is all black."** - Check that Image Segmentation is enabled and SelfieSegmentation is selected. Even lighting makes a big difference here.
- **"Edges flicker every frame."** - Increase Blur TOP filter size to `6` or `8`. For temporal smoothing, blend 85% previous mask + 15% new mask through a `Mix TOP`.
- **"Color fringe from clothing bleeds into background."** - Raise the Threshold to `0.55` for a tighter cutout.
- **"Performance is slow."** - Enable **GPU Mode** in the MediaPipe COMP. Dropping `CAM` to `640 x 480` also helps significantly.

---

## Next Steps

- **Neon silhouette:** Replace `CAM` in `FG_ONLY` with a `Constant TOP` (bright cyan). Your shape becomes a flat neon cutout.
- **Body-driven background:** Pipe `MASK` output into the Noise TOP's Translate X parameter so moving toward the camera shifts the background.
- **Multiple people:** Switch the model to `MultiClass` - it segments up to 4 people with separate color channels per person.

---

## Parameter Tuning & Behavior

| Parameter                     | Behavior                                                              |
| :---------------------------- | :-------------------------------------------------------------------- |
| **Blur Filter Size (mask)**   | Higher = softer edge; Lower = hard aliased edge.                      |
| **Threshold**                 | Higher = tighter cutout; Lower = keeps semi-transparent fringe areas. |
| **Noise Period (background)** | Higher = large blobs; Lower = fine grain texture.                     |
| **Hue Offset Speed**          | Higher = rapid cycling; Lower = slow ambient shift.                   |

## Network Architecture

```text
[ WEBCAM ]               [ MEDIAPIPE ]
Video Device In ──▶ CAM ──▶ mediapipe1 (SelfieSegmentation)
        │                        │
        │                  Mask output
        │                        │
        │                  Blur TOP
        │                        │
        │                  Threshold TOP
        │                        │
        │             ┌──────── MASK
        │             │          │
        │             │      Invert TOP
        │             │          │
        ▼             ▼          ▼
  Multiply TOP    Multiply TOP (BG × Inverted Mask)
  (CAM × MASK)        │
  FG_ONLY             │ BG_ONLY
        │             │
        └──────┬───────┘
               ▼
           Add TOP ──▶ Bloom ──▶ Level ──▶ OUT

[ BACKGROUND ]
Noise TOP ──▶ HSV Adjust ──▶ BG
```

---

Sources:

- [MediaPipe TouchDesigner Plugin - GitHub](https://github.com/torinmb/mediapipe-touchdesigner)
- [Background Removal - Derivative Community](https://derivative.ca/tags/background-removal)
- [Image Segmentation - Derivative Documentation](https://derivative.ca/tags/image-segmentation)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
