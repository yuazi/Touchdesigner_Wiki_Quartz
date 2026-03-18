---
title: "Real-time Audio Visualizer with FFT"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - instancing
  - fft
  - recipes
  - visualization
date: 2026-03-16
---

Want to make your visuals really "dance" to the music? This recipe shows you how to build a responsive audio visualizer that feels connected to every beat. We'll take a sound feed, break it into frequency bands (Bass, Mids, Treble), and use those numbers to drive a 3D scene.

> [!info] New to TouchDesigner?
> If this is your first time, check out the [[Basic VJ Mixer]] first. We'll be using:
>
> - **CHOPs (Channel Operators):** For audio signals and numbers.
> - **TOPs (Texture Operators):** For images and the final render.
> - **SOPs (Surface Operators):** For 3D shapes.
> - **COMPs (Components):** For the 3D "world" (Camera, Light, Geometry).

---

## 1. Turning Sound into Data (CHOPs)

First, we need to listen to audio and turn it into numbers we can use.

### 1.1 Get the Audio

1.  Add an **Audio Device In CHOP**. This grabs sound from your microphone or system audio.
2.  Add an **Audio Spectrum CHOP** and connect the audio into it.
    - _What it does:_ This is called an **FFT**. It splits the sound into a graph where the left side is **Bass** and the right side is **Treble**.

### 1.2 Smooth and Prep

1.  Connect the spectrum to a **Lag CHOP**.
    - _Why?_ Raw audio is very "jittery." A Lag of `0.05` makes the movement look smooth and organic rather than flickering.
2.  Connect to a **Math CHOP**. In the "Mult-Add" tab, set **Multiply** to `2.0`. This makes the visual more sensitive to quiet sounds.
3.  Connect to a **Null CHOP** and name it `OUT_AUDIO`.

---

## 2. Setting Up the 3D Scene (COMPs & SOPs)

We need a 3D "world" to visualize the music.

1.  **The Shape:** Create a **Box SOP**.
2.  **The Container:** Connect the Box to a **Geometry COMP**.
3.  **The Environment:** Add a **Camera COMP**, a **Light COMP**, and a **Render TOP**.
    - _Tip:_ You should now see a single box in the `render1` node.

---

## 3. The Visualization (Instancing)

We want to create a row of boxes that jump to different frequencies.

### 3.1 Create the Grid

1.  Add a **Noise TOP**. Set its resolution to `32 x 1` (this gives us 32 points in a line).
2.  Connect it to a **TOP to CHOP**. This converts the "image" of noise into a list of numbers.
3.  Add a **Rename CHOP** and rename the channel `r` to `tx` (Translate X).
4.  Add a **Math CHOP** and multiply by `10` to spread the boxes out.
5.  Connect to a **Null CHOP** named `NULL_INSTANCES`.

### 3.2 Link to Audio

1.  Go to your **Geometry COMP** → **Instance** tab.
2.  Turn **Instancing** → `On`.
3.  Drag `NULL_INSTANCES` into the **Instance CHOP** field.
4.  Map **Translate X** to the `tx` channel.
5.  Map **Scale Y** (Height) to your `OUT_AUDIO` channel.

---

## 4. Making it "Pop" (Post-Processing)

Let's make it look professional with some glow.

1.  Connect your **Render TOP** to a **Bloom TOP**.
    - Set **Threshold** to `0.5` and **Intensity** to `0.8`.
2.  Connect to an **HSV Adjust TOP**.
    - _Tip:_ Use a Python expression in the **Hue Offset** parameter: `absTime.seconds * 5`. Now the colors will slowly shift over time!
3.  Finish with a **Null TOP** named `OUT`.

---

## Troubleshooting

- **"I don't hear/see anything!"** — Check the "Device" parameter on your **Audio Device In**. Make sure your mic isn't muted.
- **"The boxes are too tall."** — Use a **Math CHOP** after your audio spectrum to lower the **Multiply** value.
- **"The movement is too fast."** — Increase the **Lag** value (try `0.1` or `0.2`).
- **"Nothing is rendering."** — Ensure your **Render TOP** has the `geo1`, `cam1`, and `light1` paths set in its parameters.

---

## Next Steps

- **Change the Layout:** Use a `Grid SOP` instead of a `Noise TOP` to arrange the boxes in a 2D square.
- **Reactive Color:** Map the audio volume to the **Instance Color** parameters so it gets brighter on loud kicks.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Lag (Smoothing)** | Higher (0.2) = smooth, liquid transitions; Lower (0.01) = sharp, snappy response to beats. |
| **Math Multiply** | Higher = more reactive to quiet sounds; Lower = requires loud audio to trigger movement. |
| **Bloom Intensity** | Higher = blinding, ethereal glow; Lower = subtle, clean highlights on the boxes. |
| **Hue Offset Speed** | Higher = rapid, psychedelic color cycling; Lower = slow, majestic mood shifts. |
| **Noise Grid Size** | Higher (64x1) = more boxes/finer frequency detail; Lower (8x1) = fewer, chunky bars. |

## Network Architecture

To visualize how the audio and 3D data flows, here is the final network map:

```text
[ AUDIO DATA (CHOPs) ]           [ 3D GEOMETRY ]
Audio In ──▶ Spectrum (FFT)      Box SOP 
               │                   │
               ▼                   ▼
[ PROCESSING ]                 [ Geo COMP (geo1) ] ◀──────────┐
Lag (Smooth) ────────────────▶ (Instancing On)                │
                                   │                          │
[ LAYOUT DATA ]                    ▼                          ▼
Noise TOP ──▶ TOP to CHOP ──▶ [ Merge CHOP ] ────────▶ [ Render TOP ]
               (tx, ty)            │
                                   ▼
[ RENDERING ]                  [ Bloom TOP ] ──▶ [ HSV Adjust ] ──▶ [ OUT ]
```

### Data Flow Explanation
1.  **Audio Analysis:** The `Audio Spectrum CHOP` is the core. It performs an **FFT**, converting time-based sound into a frequency graph (Bass → Treble).
2.  **Smoothing:** We use a `Lag CHOP` because raw audio data jumps 60 times a second. The lag ensures the boxes move fluidly rather than "jittering."
3.  **Layout Logic:** The `Noise TOP` generates the static grid positions. The `TOP to CHOP` converts these pixels into the `tx` (Translate X) coordinates for our 32 boxes.
4.  **The Bridge (Instancing):** The `Geo COMP` takes the 32 layout coordinates and the 32 audio frequency heights, spawning 32 copies of the `Box SOP` on the GPU.
5.  **Post-Processing:** The `Bloom TOP` and `HSV Adjust TOP` are the final layers. They add a glow and a slow color cycle to make the visual feel alive.

---

[[../index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
