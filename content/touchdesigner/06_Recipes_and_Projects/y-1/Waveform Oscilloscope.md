---
title: "Waveform Oscilloscope"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - oscilloscope
  - visualization
  - recipes
date: 2026-05-26
---

Turn live microphone or system audio into a glowing 3D waveform that pulses in real time with every beat, pluck, and breath. This is the visual equivalent of a hardware oscilloscope, and it takes about ten minutes to build.

> [!info] Operator Families in this Recipe
>
> - **CHOPs (Channel Operators):** Capturing audio and generating X positions.
> - **SOPs (Surface Operators):** Converting CHOP data into 3D geometry.
> - **MATs (Materials):** Rendering the waveform as a glowing line.

---

## Part 1: Capture the Audio

1. Press **Tab** and add an **Audio Device In CHOP**.
2. In the parameters, set **Device** to your microphone or system output.
3. Click the **Viewer flag** (eye icon) on the node and speak or play music. You should see the waveform jumping live in the preview.

---

## Part 2: Generate X Positions

`CHOP to SOP` needs a separate channel to spread points horizontally. We create one with a ramp.

1. Add a **Pattern CHOP**.
   - **Type** → `Ramp`.
   - **From** → `-0.5`, **To** → `0.5`. This spreads points from left to right.
   - **Channels** → type `tx`.
   - **Samples** → `1024`.
2. Add a **Resample CHOP** after your **Audio Device In CHOP**.
   - Connect the Resample CHOP to the Audio Device In.
   - Right-click **End** → Expression → `op('pattern1').end`. This syncs the audio length to the Pattern CHOP automatically.

---

## Part 3: Merge and Convert to Geometry

1. Add a **Merge CHOP** and connect:
   - Input 0: the **Resample CHOP** (audio, channel named `chan1`).
   - Input 1: the **Pattern CHOP** (ramp, channel named `tx`).
2. Add a **CHOP to SOP** after the Merge CHOP.
   - **TX** → `tx` (the ramp provides horizontal positions).
   - **TY** → `chan1` (audio amplitude provides vertical positions).
   - **TZ** → leave blank.

You now have a live polyline tracing the waveform shape.

---

## Part 4: Render It

1. Create a **Geo COMP**. Set its SOP path to your `CHOP to SOP` node (e.g., `../choptoSOP1`).
2. Create a **Line MAT** and drag it onto the Geo COMP.
   - **Line Width** → `0.003` for a thin elegant line, or `0.01` for a thick neon stroke.
   - **Color** → a bright saturated color (e.g., cyan `0, 1, 1`).
   - **Lighting** → Off.
3. Add a **Camera COMP** (Translate Z = `2`).
4. Add a **Render TOP**.

---

## Part 5: Polish

- Add a **Bloom TOP** (Threshold: `0.4`, Intensity: `0.8`) for a glow effect.
- Add an **HSV Adjust TOP** and animate **Hue** → `absTime.seconds * 10` for a slow color shift.

---

## Troubleshooting

- **"Flat line - nothing moves."** - Check microphone permissions and ensure **Device** is set correctly on the Audio Device In CHOP.
- **"Points are stacked vertically, not spread horizontally."** - Check that the Pattern CHOP's channel name is `tx` and that CHOP to SOP's TX field is set to `tx`.
- **"Waveform disappears when quiet."** - Add a **Lag CHOP** between the Resample CHOP and the Merge CHOP to add a decaying trail after sound stops.
- **"Geometry is too tall/clips off screen."** - Add a **Math CHOP** before the Merge (multiply the audio by `0.3`) to scale the amplitude down.

---

## Next Steps

- **Spectrum Mode:** Replace the raw audio with an **Audio Spectrum CHOP** to show the frequency spectrum (like a 3D EQ bar chart) instead of the waveform.
- **Reactive Color:** Bind an **Analyze CHOP** (RMS Power) to the Line MAT color so the line brightens on loud hits.
- **3D Depth:** Add a second waveform at a different Z position and composite them together for a stereo display.

---

## Parameter Tuning & Behavior

| Parameter                        | Behavior                                                                                        |
| :------------------------------- | :---------------------------------------------------------------------------------------------- |
| **Pattern From/To**              | Wider range (e.g., -2 to 2) = waveform spans more screen; Narrower = compact, centered display. |
| **Line Width**                   | Higher = thick neon stroke; Lower = delicate hairline.                                          |
| **Bloom Intensity**              | Higher = waveform glows like a laser; Lower = clean, flat line.                                 |
| **Math Multiply (before merge)** | Higher = more reactive to quiet audio; Lower = prevents clipping on loud signals.               |
| **Lag (Smoothing)**              | Higher = smooth, liquid waveform with trails; Lower = raw, every vibration visible.             |

## Network Architecture

```text
[ AUDIO ]                        [ POSITIONS ]
Audio Device In                  Pattern CHOP (tx, 1024 pts)
       │                                 │
       ▼                                 │
Resample CHOP (1024 pts) ──────────────▶ │
                                         ▼
                               Merge CHOP (chan1 + tx)
                                         │
                                         ▼
                               CHOP to SOP (TX=tx, TY=chan1)
                                         │
                                         ▼
                   Geo COMP (Line MAT) ──▶ Render TOP ──▶ Bloom ──▶ OUT
```

> [!tip]- 📚 Learning Path · Stage 2 - Your First Visuals · step 11 of 44
> [[touchdesigner/06_Recipes_and_Projects/y-1/Audio Reactive Geometry|(y-) ← Prev: Audio Reactive Geometry]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/06_Recipes_and_Projects/y-1/Chromatic Aberration Feedback|(y-) Next: Chromatic Aberration Feedback →]]

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
