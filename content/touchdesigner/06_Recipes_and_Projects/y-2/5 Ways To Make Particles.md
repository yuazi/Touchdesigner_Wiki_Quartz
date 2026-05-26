---
title: "5 Ways To Make Particles in TouchDesigner"
tags:
  - touchdesigner
  - td/recipes
  - particles
  - instancing
  - recipes
  - td/tutorials
date: 2026-03-02
---

> **Based on:** [5 Ways To Make Particles in TouchDesigner](https://www.youtube.com/watch?v=kNeSa7XivUs) by **anya maryina**

TouchDesigner provides multiple distinct methodologies for particle system implementation, each characterized by different balances between setup complexity, computational efficiency, and parameter control granularity. Technique selection should be driven by specific project requirements regarding visual fidelity, particle count, and desired behavioral sophistication.

---

## Overview

| #   | Method                     | Best For                                    | GPU?     |
| --- | -------------------------- | ------------------------------------------- | -------- |
| 1   | **Line MAT**               | Glowing stroke look, fast setup             | No (CPU) |
| 2   | **particlesGPU** (Palette) | GPU particles without building from scratch | Yes      |
| 3   | **Instancing via CHOPs**   | Audio reactive geometry, CHOP positions     | Yes      |
| 4   | **Instancing via TOPs**    | Texture driven placement, very large counts | Yes      |
| 5   | **Particle SOP**           | Quick prototype, low count                  | No (CPU) |

---

## Method 1 - Line MAT

Assign a Line MAT to any geometry and its edges render as smooth, controllable lines. You don't actually spawn particles - you animate geometry and the edges become the trails. Fast to set up and looks good on projected visuals.

### Setup

1. Drop a **`Grid SOP`** into your network, set it to something sparse like `10 × 10`.
2. Add a **`Noise SOP`** after it. Animate its **Offset** with `absTime.seconds * 0.3` - this pushes the points around each frame.
3. Create a **`Geo COMP`**, point it at the Noise SOP output.
4. Assign a **`Line MAT`** to the Geo COMP.
5. On the Line MAT:
   - **Width** → `0.002` for thin lines, go higher for thicker strokes
   - **Color** → something bright, e.g. cyan `0, 1, 1`
   - **Lighting** → off
6. Add a **`Camera COMP`**, **`Light COMP`**, **`Render TOP`** to see it.

Swap the Grid SOP for a **`Particle SOP`** if you want actual moving particles rendered as lines. Stick a **`Trail SOP`** in the chain to leave visible trails behind moving points. To make it audio reactive, drive the Noise SOP offset from a CHOP.

Runs on the CPU, so keep point counts reasonable - above ~5k edges it's better to switch to instancing.

---

## Method 2 - particlesGPU (Palette)

The Palette has a `particlesGPU` component you can drag straight into your network. Everything is already wired up inside - emitter, forces, render chain. Fastest way to get GPU particles running without building anything yourself.

### Setup

1. Open the Palette (`Alt+L` or Window → Palette).
2. Go to **Generative → particlesGPU** and drag it into your network.
3. The exposed parameters on the component are all you need to start:
   - **Emit Rate** - particles per second
   - **Life** - lifetime in seconds
   - **Force** - noise amplitude, controls how turbulent the movement is
   - **Colour A / Colour B** - birth and death colours
4. Connect the `render` output to wherever you need it.

Don't go inside the component the first time through - the exposed parameters are enough to get a lot of variation. The internal feedback opacity controls trail length if you do want to dig in. For audio reactivity, export an Analyze CHOP (RMS) into the Force or Emit Rate parameter via a reference expression.

---

## Method 3 - Instancing via CHOPs

Instancing renders one piece of geometry at many different positions in one draw call. Here the positions come from a CHOP - one sample per instance. Good when you want each particle to be an actual 3D object and you want to drive it with audio.

### Setup

1. Create a **`Geo COMP`**. Inside it, make the instance geometry - a `Sphere SOP` at `Rows: 3, Cols: 5` or a `Box SOP` scaled to `0.02`. Keep it simple.
2. In the root network, create a **`Noise CHOP`**:
   - **Channel Names** → `tx ty tz`
   - **Samples** → how many instances you want, e.g. `500`
   - **Amplitude** → `2`
   - Animate **Offset** with `absTime.seconds * 0.1`
3. On the **Instance** page of the Geo COMP:
   - **Instancing** → On
   - **Instance CHOP** → the Noise CHOP
   - **Translate X/Y/Z** → `tx`, `ty`, `tz`
4. Add Camera, Light, Render TOP.

For audio reactivity:

```
Audio Device In CHOP → Audio Spectrum CHOP → Analyze CHOP (RMS)
  → Math CHOP (To Range: 0.5 → 3.0)
  → Noise CHOP Amplitude parameter
```

For scale variation, add `sx sy sz` channels to the Noise CHOP and map them on the Instance page. For colour per instance, add `r g b` channels and enable Instance Color on the MAT.

---

## Method 4 - Instancing via TOPs

Same idea as Method 3 but positions come from a texture instead of a CHOP. Each pixel maps to one instance, so a 512×512 texture gives you 262,144 instances. This is where the counts get big.

### Setup

1. Create a **`Geo COMP`** with instance geometry (same as Method 3).
2. Create a **`Noise TOP`**:
   - **Resolution** → `256 × 256` (= 65,536 instances)
   - **Data Format** → `32-bit float (RGBA)`
   - R, G, B carry X, Y, Z positions
3. On the **Instance** page of the Geo COMP:
   - **Instancing** → On
   - **Instance OP** → the Noise TOP
   - Translate X/Y/Z → R, G, B channels of the texture
4. Adjust **Translate Range** to match your scene scale, e.g. `-2` to `2`.

|                  | CHOP instancing | TOP instancing        |
| ---------------- | --------------- | --------------------- |
| Max count        | ~10k–50k        | Hundreds of thousands |
| Position updates | Per sample      | Per pixel on the GPU  |
| Audio reactivity | Easy            | Needs extra routing   |
| Custom physics   | Script CHOP     | GLSL TOP              |

You can also feed a `particlesGPU` component's internal state texture directly into the Instance OP - each pixel already encodes a particle position, so you get the simulation driving real 3D geometry with no extra work.

---

## Method 5 - Particle SOP

The oldest way to do particles in TD. Runs on the CPU, no GPU involvement. Fine for prototyping or when you just need a few thousand particles quickly.

### Setup

1. Drop a **`Particle SOP`** into your network.
2. Connect a **`Grid SOP`** or **`Sphere SOP`** into its first input - that's the emitter surface.
3. Parameters to set:
   - **Emit Attribute** → `Always`
   - **Max Particles** → `5000`
   - **Life Expectancy** → `3`
   - **Velocity** → e.g. `0, 0.1, 0` for upward drift
4. Connect output to a **`Null SOP`** named `OUT_particles`.
5. Create a **`Geo COMP`**, point its SOP at `OUT_particles`, assign a **`Point Sprite MAT`** or **`Constant MAT`**.

Performance drops fast above ~50k particles. Use this to figure out what you want, then switch to particlesGPU or instancing once you know.

---

## Picking one

```
Glowing line aesthetic, fast?          → Method 1 (Line MAT)
GPU particles, don't want to build?    → Method 2 (particlesGPU)
Audio reactive 3D geometry?            → Method 3 (Instancing via CHOPs)
Hundreds of thousands of instances?    → Method 4 (Instancing via TOPs)
Quick prototype, don't care about GPU? → Method 5 (Particle SOP)
```

---

## Related Notes

- [[Particle System with POPs|(y-) Recipe: Particle System with POPs]]
- [[Dreamscape Particle Cloud|(y-) Recipe: Dreamscape Particle Cloud]]
- [[GLSL Feedback Effect|(y-) Recipe: GLSL Feedback Effect]]

---

## Parameter Tuning & Behavior

| Parameter                   | Behavior                                                                         |
| :-------------------------- | :------------------------------------------------------------------------------- |
| **Line Width (M1)**         | Higher = thick, neon strokes; Lower = delicate, hair-like trails.                |
| **Emit Rate (M2)**          | Higher = dense clouds/smoke; Lower = sparse, individual "dust" particles.        |
| **Noise Amplitude (M3/4)**  | Higher = more turbulent, chaotic movement; Lower = straight, predictable motion. |
| **Texture Resolution (M4)** | 256x256 = 65k particles; 512x512 = 262k particles (requires more GPU power).     |
| **Max Particles (M5)**      | Limits CPU load; keep below 50,000 for stable performance.                       |

## Network Architecture

Because this guide covers 5 different methods, here are the simplified maps for each:

### Method 1: Line MAT (CPU Edge Rendering)

```text
Grid SOP (10x10) ──▶ Noise SOP (Animate Offset) ──▶ Geo COMP ──▶ [ Line MAT ]
                                                       │
                                                       ▼
[ Camera ] ──▶ [ Light ] ───────────────────────▶ [ Render TOP ]
```

### Method 2: particlesGPU (Palette Plugin)

```text
[ Palette: particlesGPU ] ──▶ [ Render Output ] ──▶ [ Level/Blur TOPs ]
          ▲
          │ (Reference)
    [ Analyze CHOP ] ──▶ [ Audio In ]
```

### Method 3: Instancing via CHOPs (Geometry-per-Sample)

```text
[ Noise CHOP ] (tx, ty, tz) ──┐
                              ▼
[ Sphere SOP ] ────────▶ [ Geo COMP ] (Instancing On) ──▶ [ Render TOP ]
```

### Method 4: Instancing via TOPs (Geometry-per-Pixel)

```text
[ Noise TOP ] (RGBA / 32-bit) ┐
                              ▼
[ Sphere SOP ] ────────▶ [ Geo COMP ] (Instancing On) ──▶ [ Render TOP ]
```

### Method 5: Particle SOP (Classic CPU Simulation)

```text
[ Grid SOP ] (Emitter) ──▶ [ Particle SOP ] ──▶ [ Geo COMP ] ──▶ [ Constant MAT ]
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
