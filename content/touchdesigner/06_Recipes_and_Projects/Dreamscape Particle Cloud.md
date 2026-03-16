---
title: "Dreamscape Particle Cloud"
tags:
  - touchdesigner
  - td/recipes
  - pop
  - particles
  - feedback
  - recipes
date: 2026-03-02
---

> **Based on:** [Touch Designer Dreamscape Particle Cloud Tutorial](https://www.youtube.com/watch?v=4tOldYnNFV0) by **söla**

This recipe details the implementation of a GPU-accelerated particle system utilizing TouchDesigner's Point Operators (POPs) for efficient particle simulation, coupled with a recursive feedback topology to generate persistent visual trails. The technique produces a characteristic volumetric aesthetic through strategic combination of noise-driven particle motion, point sprite rendering, and multi-stage post-processing.

---

## What You'll Build

A real-time particle system where thousands of points:

- Are seeded from a 3D mesh or noise field
- Drift and swirl driven by a Noise force
- Render as glowing soft points
- Pass through a feedback + blur chain for the dreamy trail effect

**Operators used:** SOP to POP, Noise POP, Force POP, Limit POP, POP SOP, Sprite SOP, Point Sprite MAT, Render TOP, Feedback TOP, Blur TOP, Level TOP, Composite TOP

---

## 1. Create the Source Geometry

This defines the _initial positions_ of the particles.

1. Drop a `Sphere SOP` (or any mesh you like — `Grid`, `Torus`, etc.).
2. Set its resolution high enough to give you a dense point cloud (e.g., rows/columns = 50).
3. Optionally add a `Noise SOP` after it to scatter points off the surface.
4. End the chain with a `Null SOP` — name it `GEO_SOURCE`.

---

## 2. Convert Geometry to POPs

1. Drop a `SOP to POP` node.
2. Set its **SOP** parameter to `op('GEO_SOURCE')`.
3. This seeds one particle per point of the geometry, inheriting its XYZ position.

> **Tip:** In the `SOP to POP` parameters, set **Attribute Scope** to `P N` to bring in position and normal data which you can use later for directional forces.

---

## 3. Add Movement with Noise

1. Connect a `Noise POP` after the `SOP to POP`.
2. Set **Type** to `Alligator` or `Simplex` for smooth organic motion.
3. Increase **Amplitude** to around `0.005–0.02` — small per-frame nudges add up to fluid movement.
4. Animate the **Offset** parameter over time to make the noise field move:
   - Right-click **Offset Z** → Expression → type `absTime.seconds * 0.1`

---

## 4. Add a Gravity / Attractor Force (Optional)

1. Drop a `Force POP`.
2. Set **Type** to `Point Attractor`.
3. Set the **Center** to `0, 0, 0` (or animate it).
4. Keep the **Strength** low (`0.001–0.005`) so particles drift toward center without collapsing.

This keeps the cloud from drifting off screen over time.

---

## 5. Contain the Points (Limit POP)

1. Add a `Limit POP` at the end of the chain.
2. Set **Type** to `Loop` and define a bounding box slightly larger than your geometry.
3. This wraps particles that escape back to the other side, keeping the cloud perpetual.

---

## 6. Render the Particles

To render POP points, bring them back into SOP space and use a standard Geo COMP + Render TOP setup.

1. Add a **`POP SOP`** at the end of your POP chain — this outputs the particle positions as SOP points each frame.
2. Connect the POP SOP output to a **`Sprite SOP`**, then to `out1`.
3. Create a **`Geo COMP`** and set its SOP to the POP SOP chain.
4. On the Geo COMP, assign a **`Point Sprite MAT`** in the material slot.
   - **Point Size:** `2–5` pixels
5. Add a **`Camera COMP`**, **`Light COMP`**, and **`Render TOP`**:
   - **Resolution:** `1920 × 1080` (or your output resolution)
   - **Background Color:** pure black (`0, 0, 0, 1`)

> The result is white/grey dots on black — the glow comes in the next step.

---

## 7. Colorize the Points

Insert a `Level TOP` after the `Render TOP`:

- **Opacity:** 1
- **Brightness:** slight boost

Then add a `HSV Adjust TOP` (or use a `Color Correct TOP`) to shift particle color into the hue you want — soft blues, magentas, or warm yellows work well for the dreamscape look.

---

## 8. The Dreamscape Glow — Feedback Loop

This is the key step that creates the soft trails and bloom.

```
Render TOP
    → Composite TOP  ←──────────────────┐
         ↓                              │
      Level TOP (darken: ~0.95)         │
         ↓                              │
      Blur TOP (size: 3–6px)            │
         ↓                              │
      Feedback TOP ────────────────────-┘
         ↓
      (composite new frame onto faded trail)
```

Step by step:

1. Drop a `Feedback TOP`. Set its **Target TOP** to itself (or a `Null TOP` at the end of the chain — see Quartz's [[Feedback Loops]] page for details).
2. After the Feedback TOP, add a `Level TOP` and set **Opacity** to `0.93–0.97`. This dims the old frame slightly each tick.
3. Add a `Blur TOP` (size 3–8px) to soften the fading trail.
4. Feed this blurred+dimmed output into a `Composite TOP`:
   - **Input 0:** Current `Render TOP` output (new frame)
   - **Input 1:** Feedback output (old trails)
   - **Operation:** `Add` or `Screen`

---

## 9. Final Post-Processing

After the Composite:

| Node             | Settings                      | Purpose                              |
| ---------------- | ----------------------------- | ------------------------------------ |
| `Blur TOP`       | Size: 8–20px                  | Adds soft bloom around bright points |
| `Level TOP`      | Brightness +10%, Contrast +5% | Punches up the image                 |
| `HSV Adjust TOP` | Hue rotate over time          | Slowly shifts color over time        |
| `Null TOP`       | Name: `OUT`                   | Output handle                        |

To animate the color shift:

- Right-click **Hue** on the `HSV Adjust TOP` → Expression → `absTime.seconds * 2`

---

## 10. Camera (Optional 3D Version)

For a fully 3D version with a moving camera, replace the Point Sprite MAT with a proper 3D material and add a moving camera:

1. On the Geo COMP, swap the Point Sprite MAT for a **Phong MAT** or **Constant MAT**.
2. Animate the `Camera COMP`'s `rz` (roll/orbit) with `absTime.seconds * 5`.

---

## Parameter Cheat Sheet

| Parameter                 | Value to Start          |
| ------------------------- | ----------------------- |
| Noise Amplitude           | `0.01`                  |
| Noise Offset Z expression | `absTime.seconds * 0.1` |
| Force Strength            | `0.002`                 |
| Point Size                | `3`                     |
| Feedback Level Opacity    | `0.95`                  |
| Blur Size                 | `5`                     |
| HSV Hue expression        | `absTime.seconds * 2`   |

---

## Variations to Try

- **Audio reactive:** Feed an `Audio Spectrum CHOP` into the Noise POP's **Amplitude** parameter
- **Mouse interaction:** Use `monitorInfo('mousex')` as the Force POP's center X
- **Multiple clouds:** Duplicate the entire POP chain with different noise seeds and composite them together
- **Color palettes:** Try `Add` mode in the Composite for an additive neon look, or `Screen` for softer pastels

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]] | [[touchdesigner/index|Return to TouchDesigner]]

---
