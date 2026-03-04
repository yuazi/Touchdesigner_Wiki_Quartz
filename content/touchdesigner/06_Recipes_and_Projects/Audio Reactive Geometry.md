---
tags:
  - touchdesigner
  - td/recipes
  - audio
  - instancing
  - recipes
date: 2026-03-02
---
[[touchdesigner/06_Recipes_and_Projects/index|Recipes & Projects]]

# Recipe: Audio Reactive Geometry

This recipe connects audio analysis directly to geometry instancing, creating a classic "EQ visualizer" effect where bars or shapes react to different frequencies.

## 1. The Audio Analysis
1. Create an `Audio File In CHOP` (or `Audio Device In` for live microphone).
2. Connect it to an `Audio Spectrum CHOP`. This converts the waveform over time into frequency buckets (low bass on the left, high treble on the right).
3. Connect that to a `Null CHOP` named `OUT_AUDIO`.

*Optional:* The raw spectrum might be too noisy. Place a `Filter CHOP` or `Lag CHOP` before the null to smooth out the jittery movement.

## 2. The Geometry Setup
1. Create a `Box SOP`. We want a thin, tall rectangle to act as an EQ bar.
2. Connect it to a `Geometry COMP`.
3. Create a `Camera COMP`, `Light COMP`, and `Render TOP` to view the 3D scene.

## 3. The Instancing Magic
1. Select your `Geometry COMP`.
2. Go to the **Instance** page and turn *Instancing* ON.
3. Drag the `OUT_AUDIO` null onto the *Instance CHOP/DAT* field.
4. **The Layout:** We want the bars spread out horizontally. We don't have X coordinates yet, so we need to generate them.
   - *Alternative setup:* Before `OUT_AUDIO`, branch off a `Pattern CHOP` (Type: Ramp, 0 to 1) and merge it with the spectrum data using a `Merge CHOP`.
   - Now in the Instance page, map the `tx` parameter to the pattern channel.
5. **The Reaction:** Map the `ty` (or `sy` for scaling height) parameter to the audio channel coming from the spectrum (`chan1`).

Now, you have a row of boxes whose heights (or Y-positions) dynamically spike with the frequencies of the playing song.
---
[[touchdesigner/06_Recipes_and_Projects/index|Back to Recipes and Projects]] | [[touchdesigner/index|Back to Main Page]]
