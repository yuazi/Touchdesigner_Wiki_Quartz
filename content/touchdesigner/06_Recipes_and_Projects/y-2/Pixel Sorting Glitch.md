---
title: "Pixel Sorting Glitch Effect"
tags:
  - touchdesigner
  - td/recipes
  - glsl
  - glitch
  - webcam
  - feedback
  - recipes
date: 2026-05-26
---

Bright pixels get dragged horizontally across the frame, leaving streaks of color that look like corrupted data. This is pixel sorting - popularized by Kim Asendorf's Processing sketches and now everywhere in live visuals and music videos.

A GLSL shader does the sort. An optional feedback loop turns it into datamosh.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Webcam input and compositing.
> - **GLSL:** Brightness-based pixel shift as a per-pixel shader.

---

## Part 1: Webcam Input

1. Add a **Video Device In TOP** set to your webcam.
2. Connect to a **Null TOP** named `CAM`.

---

## Part 2: Write the Sort Shader

1. Add a **GLSL TOP** at the same resolution as `CAM`.
2. Connect `CAM` to input 0.
3. Right-click → **Edit Pixel Shader**. Paste:

```glsl
uniform sampler2D sTD2DInputs[TD_NUM_2D_INPUTS];

uniform float uThreshold;
uniform float uSortStrength;
uniform float uDirection;   // 1.0 = right, -1.0 = left

layout(location = 0) out vec4 fragColor;

void main()
{
    vec2 uv    = vUV.st;

    vec4 color = texture(sTD2DInputs[0], uv);
    float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));

    if (luma > uThreshold) {
        float offset = (luma - uThreshold) * uSortStrength * uDirection;
        fragColor    = TDOutputSwizzle(texture(sTD2DInputs[0], vec2(uv.x + offset, uv.y)));
    } else {
        fragColor = TDOutputSwizzle(color);
    }
}
```

> [!info] What the shader does
> Pixels above `uThreshold` sample from a position shifted right by `(brightness - threshold) × strength`. Brighter pixels reach further, leaving longer streaks. Dark pixels stay put.

---

## Part 3: Add Custom Parameters

Right-click the **GLSL TOP** → **Customize Component** → add three float uniforms:

| Name | Default | Min | Max |
| ---- | ------- | --- | --- |
| `uThreshold` | `0.5` | `0.0` | `1.0` |
| `uSortStrength` | `0.3` | `0.0` | `1.0` |
| `uDirection` | `1.0` | `-1.0` | `1.0` |

Start with the defaults. Drop `uThreshold` to `0.3` to sort more of the image, raise to `0.7` to isolate only the brightest highlights.

---

## Part 4: Add Feedback for Datamosh

Without feedback each frame sorts fresh from the clean webcam. With feedback, displaced pixels pile up across frames and the image slowly disintegrates.

1. Add a **Feedback TOP**.
2. **Mix TOP**: Input 0 = Feedback, Input 1 = GLSL output. **Blend** → `0.7`.
3. Connect to a **Null TOP** named `SORT_OUT`.
4. Set **Feedback TOP Target** → `SORT_OUT`.

> [!tip] Performance toggle
> Wire a **Select TOP** before `SORT_OUT` to switch between the raw GLSL output and the Mix TOP output. Clean toggle between sorted and datamoshed during a performance.

---

## Part 5: Polish

1. **HSV Adjust TOP** → **Saturation Multiplier** `1.3`.
2. **Bloom TOP** (Threshold: `0.5`, Intensity: `0.6`).
3. Connect to a **Null TOP** named `OUT`.

---

## Variations

| Variant | How to do it |
| --- | --- |
| **Vertical sort** | Change `uv.x + offset` to `uv.y + offset` |
| **Color channel split** | Three GLSL TOPs (one per channel), different `uSortStrength` each. Merge with `Reorder TOP`. |
| **Motion-triggered** | Route `Optical Flow TOP` luma to `uThreshold` - motion activates the sort. |
| **Audio-reactive** | Bind `uSortStrength` to an Analyze CHOP RMS so beats extend the streaks. |

---

## Troubleshooting

- **"Whole image turns to horizontal bars."** - `uSortStrength` is too high. Drop to `0.1` and build up.
- **"Nothing moves - looks like normal webcam."** - Check `uThreshold` is below `1.0` and that GLSL input 0 is connected to `CAM`. Check the Info DAT for compile errors.
- **"Shader compile error (green or pink output)."** - Open the GLSL TOP → **Info DAT** for the error. Usually a missing semicolon or uniform name mismatch.
- **"Datamosh fills completely, loses image."** - Mix TOP blend too high. Try `0.5`. Confirm Feedback Target is `SORT_OUT`.

---

## Next Steps

- **Hardware knob:** Bind `uThreshold` to a **MIDI In CHOP** so a physical knob sweeps the sort boundary live.
- **Masked sort:** Use a body segmentation mask to restrict pixel sorting to the webcam subject only.
- **Chromatic sort:** Split webcam into R, G, B with `Reorder TOP`, sort each channel with a different `uSortStrength`, recombine. Channels drift apart as chromatic aberration.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **uThreshold** | Lower = more pixels sorted; Higher = only peak highlights affected. |
| **uSortStrength** | Higher = long streaks; Lower = subtle shimmer. |
| **uDirection** | `1.0` = streaks right; `-1.0` = streaks left. |
| **Feedback Blend** | Higher = datamosh smear; Lower = crisp per-frame sort. |
| **Bloom Intensity** | Higher = neon glow; Lower = harsh clean glitch. |

## Network Architecture

```text
Video Device In ──▶ CAM
                     │
                     ▼
               GLSL TOP (sort shader)
                     │
              Mix TOP (0.7 old + 0.3 new) ◀── Feedback TOP
                     │                         (target: SORT_OUT)
                     ▼
               SORT_OUT
                     │
          HSV Adjust ──▶ Bloom ──▶ OUT
```

---

Sources:
- [Glitches, pixel sorting and data moshing - Derivative Community](https://derivative.ca/community-post/tutorial/glitches-pixel-sorting-and-data-moshing/64888)
- [Pixel Sorting - AllTouchDesigner](https://alltd.org/tag/pixelsorting/)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
