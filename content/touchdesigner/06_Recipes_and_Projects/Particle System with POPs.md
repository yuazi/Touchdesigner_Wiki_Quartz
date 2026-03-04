---
tags:
  - touchdesigner
  - td/recipes
  - particles
  - pop
  - recipes
date: 2026-03-01
---
# Recipe: Particle System with POPs

**POP (Point Operator)** nodes run entirely on the GPU, making them the fastest way to simulate and render hundreds of thousands of particles in real time. This recipe builds a foundational particle system you can extend.

## How POPs Relate to SOPs
POPs operate on **point clouds** — large sets of 3D points with attributes (position, velocity, colour, life). Unlike SOPs, POP networks execute on the GPU inside a **Particle System COMP** (or within a **Geo COMP's SOP network** using a `POP SOP`).

---

## Part 1: The Basic Emitter

1. Create a **`Geo COMP`** in your root network.
2. Double-click inside it to enter its SOP network.
3. Delete the default torus. Place a **`POP SOP`** — this is the POP-to-SOP bridge.
4. Inside the `POP SOP`, there is already a network. **Double-click** into it to enter the POP network.
5. Inside the POP network, add a **`POP Source CHOP`**:
   - Set **Source Type** to `Point` or connect a SOP for surface emission.
   - Set **Emit Rate** to `1000` (particles per second).
   - Set **Life Expectancy** to `3` seconds.
6. Add a **`POP Solver CHOP`** after the emitter — this advances the simulation each frame.

Your particle chain so far:
```
POP Source → POP Solver → [POP network output]
```

---

## Part 2: Adding Forces

After the `POP Solver`, add force nodes:

| Node | Effect |
|---|---|
| **POP Force CHOP** | Constant directional force (like gravity: set Gravity to `0, -9.8, 0`) |
| **POP Wind CHOP** | Turbulent wind using noise |
| **POP Attractor CHOP** | Pulls particles toward a point in space |
| **POP Collision CHOP** | Bounces particles off a SOP surface |

Chain them between Solver and output:
```
POP Source → POP Force (gravity) → POP Wind → POP Solver → output
```

---

## Part 3: Colour Over Life

1. Add a **`POP Color CHOP`** in the chain.
2. Set **Color Source** to `Ramp`.
3. Design a gradient — e.g. bright white at birth, orange mid-life, transparent at death.
4. Set **Life Source** to `Normalized Life` so the ramp maps across 0→1 lifespan.

---

## Part 4: Rendering

Back in the Geo COMP's SOP network, the `POP SOP` outputs points. You need to render them:

**Option A — Sprites (fastest):**
1. Connect the `POP SOP` output to a **`Sprite SOP`** then to the `out1`.
2. Assign a **`Point Sprite MAT`** in the Geo COMP render page.
3. Each particle becomes a camera-facing textured quad.

**Option B — Instanced geometry:**
1. Connect the `POP SOP` to a **`Geometry COMP`** with **Instancing ON**.
2. Set the Instance CHOP/DAT to the POP SOP.
3. Map `tx`, `ty`, `tz` to the point position attributes.

---

## Part 5: Audio Reactivity

To make emission rate or force react to audio:
```
Audio Device In CHOP → Audio Spectrum CHOP → Analyze CHOP (RMS/Peak)
  → Math CHOP (remap 0→1 to 100→5000)
  → [CHOP reference onto POP Source's Emit Rate parameter]
```

---

## Common Gotchas
- **No particles visible** → make sure the `POP Solver` is in the chain; without it, positions never update.
- **Particles fly off screen instantly** → add gravity via `POP Force` or reduce initial velocity in `POP Source`.
- **Performance drops** → limit particle count with a `POP Kill` node (kill old/far particles), or reduce the POP SOP resolution.
- **Colour not changing** → confirm `Life Source` is set to `Normalized Life`, not `Age`.

[[Index|Back to Recipes & Projects]]

[[touchdesigner/06_Recipes_and_Projects/index|Back to Recipes & Projects]] | [[touchdesigner/index|Back to TouchDesigner]]

---
