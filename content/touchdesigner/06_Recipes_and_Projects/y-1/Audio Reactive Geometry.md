---
title: "Audio Reactive Geometry"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - instancing
  - recipes
date: 2026-03-02
---

In this recipe, we'll create a classic 3D "Equalizer" visualization. You'll learn how to take a sound wave, break it into frequencies, and use those numbers to drive the height of thousands of 3D boxes.

> [!important] Key Concept: Instancing
> **Instancing** is a way to render hundreds or thousands of copies of a single shape (like a box) very efficiently. Instead of creating 100 separate nodes, we create _one_ box and tell TouchDesigner: "Put a copy of this box at every point in this list of numbers."

---

## 1. The Audio Analysis

First, we need to turn sound into data.

1.  **Audio In:** Create an **Audio File In CHOP**. It comes with a default song.
2.  **Break it down:** Connect it to an **Audio Spectrum CHOP**.
    - _What it does:_ It performs an "FFT" (Fast Fourier Transform). It turns the sound wave into a graph where the left side is the **Bass** and the right side is the **Treble**.
3.  **Smooth it out:** Connect the spectrum to a **Resample CHOP**. Set the "Method" to `New Rate, New Interval` and "End" to `40`.
    - _Why?_ This reduces the hundreds of frequency bars down to just 40, which is easier to see.
4.  **Finalize:** Connect to a **Null CHOP** and name it `OUT_AUDIO`.

---

## 2. The 3D Scene

We need a "World" for our geometry to live in.

1.  **The Shape:** Create a **Box SOP**.
2.  **The Container:** Connect the Box SOP to a **Geometry COMP**.
3.  **The View:** Add a **Camera COMP**, a **Light COMP**, and a **Render TOP**.
    - Now you should see a single box in your `render1` viewer.

---

## 3. The Instancing Magic

Now we tell the Geometry COMP to multiply that box.

1.  Select the **Geometry COMP**. Go to the **Instance** tab in the parameters.
2.  Turn **Instancing** → `On`.
3.  **Define the Data:** Drag your `OUT_AUDIO` Null CHOP into the **Instance CHOP/DAT** field.
    - _Wait!_ The box disappeared or looks weird. This is because we haven't told TD _where_ to put them yet.

---

## 4. Layout (The Grid)

We want the boxes to sit in a row, but our audio data only has "Height" (Y) values. We need "Position" (X) values.

1.  **Generate X positions:** Branch off from your `OUT_AUDIO` node and add a **Pattern CHOP**.
    - Set **Type** to `Ramp`.
    - Set **Number of Samples** to `40` (to match our audio).
    - Set **Amplitude** to `20` and **Offset** to `-10`. This spreads the values from -10 to +10.
2.  **Merge them:** Use a **Merge CHOP** to combine the original audio channel (`chan1`) and your new pattern channel (`ramp1`).
3.  **Update the Geo:** Connect this Merge CHOP to your `OUT_AUDIO` Null.
4.  **Map the Channels:**
    - On the Geometry COMP **Instance** page, find **Translate X**. Select `ramp1` from the dropdown.
    - Find **Scale Y** (to make them grow tall). Select `chan1` from the dropdown.

> [!tip] Visualizing the Result
> Look at your **Render TOP**. You should now see a row of 40 bars jumping up and down with the music!

---

## Troubleshooting

- **"The bars are too small/too big"** — Use a **Math CHOP** before the Null to multiply the audio values.
- **"The bars are jittery"** — Add a **Lag CHOP** or **Filter CHOP** before the Null to smooth the movement.
- **"I only see one bar"** — Check that your **Pattern CHOP** has the same "Number of Samples" as your audio spectrum.

---

## Next Steps

- **Add Color:** Use the audio data to drive the `Instance Color` parameters.
- **Change the Shape:** Replace the **Box SOP** with a **Sphere SOP** or **Tube SOP**.
- **3D Grid:** Use a **Noise TOP** to generate a 2D grid of boxes instead of a 1D row.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Resample (Samples)** | Higher = more 3D bars (finer frequency detail); Lower = fewer, thicker bars. |
| **Pattern Amplitude** | Higher = bars spread further apart across the screen; Lower = bars cluster together. |
| **Math (Multiply)** | Higher = bars grow taller/more reactive to sound; Lower = subtler, shorter movement. |
| **Lag/Filter** | Higher = smoother, "liquid" motion; Lower = raw, "jittery" real-time data response. |

## Network Architecture

To visualize how the data flows, here is a map of the final network:

```text
[ AUDIO PROCESSING ]            [ 3D SCENE ]
Audio File In CHOP             Box SOP 
       │                          │
       ▼                          ▼
Audio Spectrum CHOP (FFT)      Geometry COMP (Instancing On)
       │                          │
       ▼                 ┌────────┘
Resample CHOP (40 pts) ──┤ Map chan1 to Scale Y
       │                 └─ Map ramp1 to Translate X
       ▼
Pattern CHOP (Ramp) ──▶ Merge CHOP ──▶ Null (OUT_AUDIO)
```

### Data Flow Explanation
1.  **Analysis:** The `Audio Spectrum CHOP` performs an **FFT**, converting time-based sound into frequency-based height. 
2.  **Sampling:** We use the `Resample CHOP` to reduce the high frequency detail into a specific number (40). This matches our visual goal.
3.  **Layout:** The `Pattern CHOP` creates the "grid" (X positions). Without it, all 40 boxes would sit at the same X position (0). 
4.  **Instancing:** The `Geometry COMP` takes our 40 numbers and spawns 40 copies of the `Box SOP`. The `Y Scale` of each box is driven by its corresponding audio frequency.

---
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
