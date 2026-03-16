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

Want to create particle systems that can handle hundreds of thousands of particles without melting your CPU? That's exactly what POPs (Point Operators) are for - they run entirely on the GPU, letting you push insane amounts of particles with forces, colors, and all the good stuff while keeping your processor happy. This recipe builds you a solid foundation that you can extend in all sorts of creative directions.

## How POPs fit into a network

POPs work on point clouds — big sets of 3D points each carrying attributes like position, velocity, colour, and age. They live inside a **POP SOP**, which is the node that bridges the POP world and the SOP world inside a Geo COMP.

---

## Part 1: Basic emitter

1. Create a **`Geo COMP`** in your root network and enter it.
2. Delete the default torus. Place a **`POP SOP`**.
3. Double-click into the POP SOP to enter the POP network.
4. Add a **`Source POP`**:
   - **Source Type** → `Point`, or connect a SOP for surface emission
   - **Emit Rate** → `1000` per second
   - **Life Expectancy** → `3` seconds
5. Add a **`Solver POP`** after it — without this, nothing moves.

```
Source POP → Solver POP → [output]
```

---

## Part 2: Forces

Drop force nodes between the Source and Solver:

| Node              | What it does                                               |
| ----------------- | ---------------------------------------------------------- |
| **Force POP**     | Constant push in a direction — set Y to `-9.8` for gravity |
| **Wind POP**      | Noise-based turbulence                                     |
| **Attractor POP** | Pulls particles toward a point                             |
| **Collision POP** | Bounces particles off a SOP surface                        |

```
Source POP → Force POP → Wind POP → Solver POP → output
```

---

## Part 3: Colour over lifetime

Use the **Color POP** to change colour as particles age:

1. Add a **`Color POP`** before the Solver.
2. **Color Source** → `Ramp`
3. Design a gradient — e.g. white at birth, orange in the middle, transparent at death.
4. **Life Source** → `Normalized Life` so the ramp runs from 0 to 1 across the full lifespan.

> If you've used Houdini, you might look for "colour-over-life" — that's not a TD term. In TD this is just the Color POP with Life Source set to Normalized Life.

---

## Part 4: Rendering

The POP SOP outputs points. Back in the Geo COMP's SOP network, you need to render them.

**Sprites (simplest):** Connect POP SOP → **`Sprite SOP`** → `out1`. Assign a **`Point Sprite MAT`** on the Geo COMP. Each particle becomes a billboard quad facing the camera.

**Instanced geometry:** Connect POP SOP to a **`Geometry COMP`** with Instancing on. Set the Instance CHOP/DAT to the POP SOP and map `tx ty tz` to the position attributes. Each particle renders as actual geometry.

---

## Part 5: Audio reactivity

```
Audio Device In CHOP → Audio Spectrum CHOP → Analyze CHOP (RMS/Peak)
  → Math CHOP (remap 0→1 to 100→5000)
  → Source POP Emit Rate parameter
```

---

## Common issues

- **No particles showing** — check the Solver POP is in the chain.
- **Particles shoot off screen** — add a Force POP with some gravity, or lower the initial velocity on the Source POP.
- **Framerate tanks** — add a Kill POP to cull old or distant particles, or lower the POP SOP cook resolution.
- **Colour not changing** — Life Source needs to be `Normalized Life`, not `Age`.

[[Index|Return to Recipes & Projects]]

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]] | [[touchdesigner/index|Return to TouchDesigner]]

---
