---
title: "5 Ways To Make Particles in TouchDesigner"
tags:
  - touchdesigner
  - td/recipes
  - particles
  - pop
  - instancing
  - glsl
  - feedback
  - recipes
  - td/tutorials
date: 2026-03-02
---
[[touchdesigner/06_Recipes_and_Projects/index|Back to Recipes & Projects]]

> **Based on:** [5 Ways To Make Particles in TouchDesigner](https://www.youtube.com/watch?v=kNeSa7XivUs) by **anya maryina**

A comparative breakdown of every major particle approach in TouchDesigner. Each method has its own performance profile, creative ceiling, and ideal use case. Understanding all five lets you pick the right tool for any project.

---

## Overview of the 5 Methods

| # | Method | Best For | GPU Friendly? |
|---|---|---|---|
| 1 | **Particle SOP** | Quick prototyping, legacy compatibility | No (CPU) |
| 2 | **POP Network** | Large-scale physics simulations | Yes |
| 3 | **Instancing** | Geometry-per-particle, audio reactive | Yes |
| 4 | **GLSL / Feedback TOP** | Fully custom GPU particle logic | Yes (fully GPU) |
| 5 | **2D Feedback Particles** | Paint-like trails, 2D screens | Yes |

---

## Method 1 — Particle SOP (Classic)

The built-in `Particle SOP` is TD's legacy CPU-based particle solver. Simple, node-driven, no scripting. Good for rough prototypes or when your particle count is low (< ~10k).

### Setup

1. Drop a **`Particle SOP`** into your network.
2. Connect a **`Grid SOP`** or **`Sphere SOP`** into the **`Particle SOP`'s** first input — this is the emitter surface.
3. In the `Particle SOP` parameters:
   - **Emit Attribute** → `Always`
   - **Max Particles** → `5000`
   - **Life Expectancy** → `3`
   - **Velocity** → set a direction vector (e.g. `0, 0.1, 0` for upward drift)
4. Connect the output to a **`Null SOP`** named `OUT_particles`.
5. To render: drop a **`Geo COMP`**, point its SOP to `OUT_particles`, assign a **`Point Sprite MAT`** or **`Constant MAT`**.

### Limitations
- Runs on the **CPU** — performance falls off sharply above ~50k particles.
- No GPU forces or custom attributes without Python scripting.
- Use this to sketch an idea, then migrate to POPs or instancing for production.

---

## Method 2 — POP Network (Point Operators)

POPs are TD's **GPU-native** particle solver. The entire simulation runs on the graphics card each frame, which is why you can push **millions** of particles with forces, collisions, and colour ramps at full frame rate.

### Setup

1. Create a **`Geo COMP`** and enter it.
2. Delete the default torus. Drop a **`POP SOP`** — this is the bridge between the POP simulation and the SOP world.
3. Inside the `POP SOP`, navigate into the POP network.
4. Add the following chain:

```
POP Source → POP Force (gravity) → POP Noise → POP Color → POP Solver → [output]
```

#### POP Source parameters:
- **Emit Rate** → `2000` particles/sec
- **Life Expectancy** → `4` seconds
- **Initial Velocity** → small random spread, e.g. `0.1`

#### POP Force parameters:
- Set **Force Y** to `-0.1` or so to simulate a gentle gravity pull.

#### POP Noise parameters:
- **Type** → `Simplex`
- **Amplitude** → `0.005` — subtle turbulence each frame.
- Animate **Offset X** with `absTime.seconds * 0.05` for drifting noise.

#### POP Color parameters:
- **Color Source** → `Ramp`
- Map a white-to-orange-to-transparent gradient across normalized life (`0` → `1`).

5. Exit back to the Geo COMP's SOP network. Connect the `POP SOP` output to a **`Sprite SOP`** then to `out1`.
6. Assign a **`Point Sprite MAT`** on the Geo COMP — use a soft circle texture for the sprite.

> **Tip:** You can bring in audio data by exporting a CHOP channel into the **POP Noise amplitude** via `op('audio_analysis')['kick']`. Instant audio reactivity with no extra nodes.

---

## Method 3 — Instancing

Instancing renders one piece of geometry repeated at thousands of different positions, rotations, and scales — all in a single GPU draw call. You're not simulating particles; you're placing geometry. Ideal when each "particle" needs to be a 3D shape (cube, sphere, custom mesh).

### Setup

1. Drop a **`Geo COMP`** into your root network. Inside it, create the instance geometry (e.g. a small `Sphere SOP` or `Box SOP`). Keep it simple — one object.
2. Back at the root level, you need a **source of positions**. Options:
   - A **`Noise CHOP`** for organic fields
   - A **`SOP to CHOP`** to pull positions from a mesh
   - Audio analysis CHOPs

3. Select the `Geo COMP`. On the **Instance** page of its parameters:
   - Enable **Instancing** → `On`
   - **Instance CHOP** → point to your position CHOP
   - Map:
     - **Translate X/Y/Z** → `tx`, `ty`, `tz` channels
     - **Scale X/Y/Z** → `sx`, `sy`, `sz` (drive scale from audio amplitude)
     - **Rotate X/Y/Z** → `rx`, `ry`, `rz`

4. To generate a grid of instances from noise:
   - Drop a **`Noise CHOP`**, set **Channel Range** to `tx ty tz` with enough samples for your instance count.
   - Connect to the `Geo COMP` Instance CHOP.

5. Add a **`Camera COMP`** and **`Render TOP`** + **`Light COMP`** to see the scene.

### Tips
- Keep the instance geometry **low-poly** — 500 instances of a 100-poly sphere is cheaper than 500 instances of a 10k-poly one.
- You can vary **colour per instance** using a `Color` channel in the instance CHOP and enabling **Instance Color** in the MAT.

---

## Method 4 — GLSL Feedback Particle System

The most powerful and customizable approach. You store particle state (position, velocity, life) across frames in a **feedback texture**, and a **GLSL TOP** updates every pixel (particle) each frame on the GPU. No limits from TD's built-in solvers — you write the physics yourself.

### Core Concept

- Each **pixel** in a texture maps to one particle.
- **Red/Green/Blue/Alpha channels** store `X position`, `Y position`, `Velocity X`, `Velocity Y` (or whatever attributes you need).
- A **GLSL TOP** reads the previous frame's texture and writes the next frame's state.
- A **Feedback TOP** closes the loop.

### Setup

#### A. The State Texture (Initialization)

1. Drop a **`Noise TOP`** at full float precision: set **Data Format** → `32-bit float (RGBA)`.
2. This gives each pixel a random RGBA value — use it as the initial particle position/velocity seed.

#### B. The Update Shader (GLSL TOP)

1. Drop a **`GLSL TOP`** (not `GLSL Multi TOP`).
2. Connect:
   - **Input 0** → the Feedback TOP output (current particle state)
   - **Input 1** → any influence texture (optional: audio waveform, webcam, etc.)
3. Write the update shader. Basic example:

```glsl
// GLSL TOP — particle update
uniform float uTime;
uniform float uDrag;    // e.g. 0.98
uniform float uGravity; // e.g. -0.001

out vec4 fragColor;

void main() {
    vec2 uv = vUV.st;
    vec4 state = texture(sTD2DInputs[0], uv); // read current state

    vec2 pos = state.rg;   // position stored in R, G
    vec2 vel = state.ba;   // velocity stored in B, A

    // Apply gravity
    vel.y += uGravity;

    // Apply drag
    vel *= uDrag;

    // Update position
    pos += vel;

    // Wrap around edges
    pos = fract(pos + 1.0);

    fragColor = vec4(pos, vel);
}
```

4. For initialization, add a **`Switch TOP`** controlled by `me.time.frame == 1` to inject the seed texture on the first frame only.

#### C. The Feedback Loop

```
Noise TOP (seed) ──┐
                   ├─→ Switch TOP ──→ GLSL TOP (update) ──→ Feedback TOP ──┐
Feedback TOP ──────┘                                                         │
     └───────────────────────────────────────────────────────────────────────┘
```

#### D. Rendering the Particles

The state texture holds positions but doesn't draw anything yet. Convert positions to visible pixels:

1. **Option A — Point rendering:** Use a **`GLSL TOP`** to scatter bright pixels: for each UV, look up the position and draw a dot if distance < threshold. Expensive but precise.
2. **Option B — Sprite instancing:** Read the state texture via a **`TOP to CHOP`** and pipe into a `Geo COMP` with instancing (combine methods 3 and 4).
3. **Option C — Blur + composite:** Run the state texture through a **`Level TOP`** (remap) then **`Blur TOP`** to get soft glowing trails.

> **Tip:** Add a **`GLSL Multi TOP`** for rendering if you want per-particle sprite control. It lets you index each particle by `TDInstanceID`.

---

## Method 5 — 2D Feedback Particles

The simplest "particle feel" without a particle system at all. You're painting pixels into a texture that gets blurred and fed back into itself each frame, creating luminous trails that decay over time. Great for reactive visuals projected on a flat surface or screen.

### Setup

1. Drop a **`Trail TOP`** or a **`Constant TOP`** — this is your "emitter". Drive its position from mouse position (`CHOP → Screen XY`) or audio.
2. Connect to a **`Composite TOP`** set to **`Over`**.
3. Feed that into a **`Feedback TOP`** and route the Feedback output back into the `Composite TOP` as a second input.
4. Between the `Feedback TOP` output and the `Composite` input, insert:
   - **`Blur TOP`** (radius `2–4`) — softens edges
   - **`Level TOP`** with **Black Level** raised slightly (`0.02–0.05`) — causes the image to fade to black over time (the "decay")

```
Emitter TOP ─────────────────────────┐
                                      ▼
Feedback TOP → Blur → Level → Composite TOP → Feedback TOP (loop)
```

5. Add a **`Null TOP`** after the `Composite TOP` — this is your output for the Render or output viewport.

### Variations
- **Colour shift:** Add a `HSV Adjust TOP` inside the feedback loop — particles shift hue as they age.
- **Warping:** Insert a `Transform TOP` with a slight rotation or scale `< 1.0` before the feedback — particles spiral inward.
- **Audio reactive emitter:** Replace the constant position with a `CHOP to TOP` that maps audio amplitude to the Y-position of the emitter dot.

---

## Choosing the Right Method

```
Need quick results?               → Method 1 (Particle SOP)
Large-scale physics?              → Method 2 (POPs)
3D geometry per particle?         → Method 3 (Instancing)
Total custom control / GPU only?  → Method 4 (GLSL Feedback)
2D screen / trail aesthetic?      → Method 5 (2D Feedback)
```

---

## Related Notes

- [[Particle System with POPs|Recipe: Particle System with POPs]]
- [[Dreamscape Particle Cloud|Recipe: Dreamscape Particle Cloud]]
- [[GLSL Feedback Effect|Recipe: GLSL Feedback Effect]]

---
