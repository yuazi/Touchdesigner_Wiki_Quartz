---
title: "Audio Terrain Generator"
tags:
  - touchdesigner
  - td/recipes
  - audio
  - terrain
  - sop
  - visualization
  - recipes
date: 2026-05-26
---

Build a living, breathing 3D landscape where the mountains rise and fall with the bass, and the whole terrain scrolls endlessly forward. A staple of live concert backdrops and music video aesthetics.

> [!info] Operator Families in this Recipe
>
> - **SOPs (Surface Operators):** Building the 3D terrain mesh.
> - **CHOPs (Channel Operators):** Extracting audio amplitude.
> - **TOPs (Texture Operators):** Post-processing the render.

---

## Part 1: Build the Grid

1. Add a **Grid SOP**.
   - **Rows** → `50`, **Columns** → `50`.
   - **Size X** → `4`, **Size Y** → `4`.
2. Add a **Noise SOP** directly after the Grid SOP.
   - **Amplitude** → `0` for now. We will drive this from audio.
   - **Period** → `0.8`.
   - Right-click the **Offset Z** parameter → Expression → type `absTime.seconds * 0.5`. This scrolls the noise field over time, making the terrain appear to move forward.
3. Connect to a **Null SOP** named `OUT_TERRAIN`.

---

## Part 2: Extract Audio Amplitude

1. Add an **Audio Device In CHOP** (microphone or system audio).
2. Add an **Analyze CHOP** right after it.
   - **Function** → `RMS Power`. This converts the audio stream into one number representing loudness per frame (typically `0` to `0.3` for normal speaking).
3. Add a **Math CHOP**:
   - **Multiply** → `5.0`. Amplifies the small RMS value into a range that visibly moves the terrain.
4. Connect to a **Null CHOP** named `AUDIO_AMP`.

---

## Part 3: Link Audio to Terrain

1. Select the **Noise SOP**. Look at its **Amplitude** parameter.
2. Make `AUDIO_AMP` active (click the **+** icon on it).
3. Drag the `chan1` channel from the `AUDIO_AMP` viewer onto the **Amplitude** parameter.
4. Select **CHOP Reference**.

The terrain's height is now driven by volume. Loud bass = tall peaks, silence = flat ground.

---

## Part 4: Render the Scene

1. Create a **Geo COMP**. Inside it, connect the SOP chain ending with `OUT_TERRAIN` to the `out1` node.
   - Optional: add a **Wire Frame SOP** before `out1` to show the mesh as clean wireframe lines.
2. Back in the root network, add a **Camera COMP**:
   - **Translate Z** → `3`, **Rotate X** → `-30`. This looks down at the terrain from a front-low angle.
3. Add a **Light COMP** and a **Render TOP**.
4. Assign a **Constant MAT** (bright cyan or green) to the Geo COMP for a classic terrain wireframe look.

---

## Part 5: Post-Processing

1. Connect the **Render TOP** to an **HSV Adjust TOP**.
   - Animate **Hue** → right-click → Expression → `absTime.seconds * 5`. Slowly cycles color.
2. Add a **Bloom TOP** (Threshold: `0.3`, Intensity: `0.7`) for glowing grid edges.
3. Finish with a **Null TOP** named `OUT`.

---

## Bonus: Frequency-Specific Terrain (Equalizer Effect)

Instead of overall volume driving uniform height, make each column of terrain respond to a different audio frequency:

1. Replace the Analyze CHOP chain with: **Audio Spectrum CHOP** → **Resample CHOP** (set to `50` samples, matching the Grid's column count).
2. Connect the Resample CHOP to a **CHOP to TOP**. This creates a 50x1-pixel texture where each pixel's brightness = one frequency band's amplitude.
3. Remove the Noise SOP. Replace it with a **Displace SOP**:
   - **SOP input** → Grid SOP.
   - **Texture** input → CHOP to TOP output.
   - **Direction** → `Normal`, **Scale** → `0.5`.
4. Each of the 50 grid columns now rises to the height of its corresponding frequency band - a true 3D equalizer.

---

## Troubleshooting

- **"The terrain doesn't react to music."** - Check that `AUDIO_AMP` is active and the CHOP Reference is properly set on the Noise SOP's Amplitude parameter. Open the Noise SOP parameters and confirm the Amplitude field shows an expression rather than a plain number.
- **"Terrain moves but barely."** - Increase the Multiply on the Math CHOP (try `10` or `20`).
- **"Wireframe renders as a solid blob."** - Make sure the Wire Frame SOP is inside the Geo COMP and is the last SOP connected to `out1`.
- **"Noise pattern does not scroll."** - Confirm the `absTime.seconds * 0.5` expression is on **Offset Z** of the Noise SOP (not on the Grid SOP).

---

## Next Steps

- **Camera fly-through:** Animate **Translate Z** on the Camera COMP with `absTime.seconds * -0.3` to slowly fly through the terrain.
- **Multiple layers:** Duplicate the Grid+Noise chain at different Noise Seeds and blend them in a Composite TOP for multi-depth terrain.
- **Color by height:** Use a **GLSL TOP** to colorize the render: low elevations in blue (water), high elevations in white (snow).

---

## Parameter Tuning & Behavior

| Parameter                           | Behavior                                                                               |
| :---------------------------------- | :------------------------------------------------------------------------------------- |
| **Grid Rows/Columns**               | Higher = finer terrain detail (heavier); Lower = chunky, angular hills.                |
| **Noise Period**                    | Higher = wide, rolling hills; Lower = tight, jagged spikes.                            |
| **Noise Scroll Speed (expression)** | Higher multiplier (e.g., `* 2.0`) = fast-moving terrain; Lower = slow, hypnotic drift. |
| **Math Multiply (audio)**           | Higher = dramatic mountains on loud audio; Lower = subtle, gentle undulation.          |
| **Bloom Intensity**                 | Higher = neon grid edges; Lower = clean wireframe.                                     |

## Network Architecture

```text
[ AUDIO ]                            [ TERRAIN ]
Audio Device In                      Grid SOP (50x50)
       │                                    │
       ▼                                    ▼
Analyze CHOP (RMS)                   Noise SOP ◀── Animate Offset Z
       │                             (Amplitude bound to AUDIO_AMP)
       ▼                                    │
Math CHOP (x5)                       Wire Frame SOP
       │                                    │
       ▼                                    ▼
Null (AUDIO_AMP) ──────────────▶  Geo COMP ──▶ Render TOP
                                              │
                                              ▼
                               HSV Adjust ──▶ Bloom TOP ──▶ OUT
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
