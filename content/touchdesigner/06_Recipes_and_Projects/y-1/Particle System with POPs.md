---
title: "Particle System with POPs"
tags:
  - touchdesigner
  - td/recipes
  - particles
  - pop
  - recipes
date: 2026-03-01
---

Want to create particle systems that can handle hundreds of thousands of particles without melting your CPU? That's exactly what **POPs (Point Operators)** are for—they run entirely on the GPU, letting you push insane amounts of particles with forces, colors, and all the good stuff while keeping your processor happy.

> [!info] Operator Families in this Recipe
>
> - **SOPs (Surface Operators):** 3D shapes like spheres and boxes.
> - **POPs (Point Operators):** Particles and points on the GPU.
> - **CHOPs (Channel Operators):** Numbers and audio signals.
> - **COMPs (Components):** The 3D "world" container.

---

## How POPs fit into a network

POPs work on **point clouds**—big sets of 3D points where each point has "attributes" like position, velocity, and color.

They live inside a **POP SOP**, which is the "bridge" node. It takes regular 3D shapes (SOPs), turns them into particles (POPs), and then brings them back into your 3D scene.

---

## Part 1: Basic Emitter

1.  **The Container:** Create a **Geo COMP** in your root network and double-click to enter it.
2.  **The Bridge:** Delete the default torus. Place a **POP SOP**.
3.  **The Network:** Double-click into the POP SOP node to enter the "POP world."
4.  **The Source:** Add a **Source POP**.
    - **Source Type** → `Point`
    - **Emit Rate** → `1000` (this creates 1,000 particles every second)
    - **Life Expectancy** → `3` (particles disappear after 3 seconds)
5.  **The Engine:** Add a **Solver POP** after the source. **Important:** Without a Solver, the particles won't move!

```
Source POP → Solver POP → [output]
```

---

## Part 2: Adding Forces

To make the particles move in interesting ways, drop "force" nodes between the Source and the Solver:

| Node              | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| **Force POP**     | A constant push. Set **Force Y** to `-9.8` for gravity. |
| **Wind POP**      | Adds "Noise" or turbulence to make it look like smoke.  |
| **Attractor POP** | Pulls particles toward a specific point.                |
| **Collision POP** | Makes particles bounce off another 3D shape (SOP).      |

---

## Part 3: Colour Over Lifetime

Let's make particles change color as they get older:

1.  Add a **Color POP** before the Solver.
2.  **Color Source** → `Ramp`.
3.  **Design your Gradient:** Click the Ramp parameter to design a color scheme (e.g., White at birth → Blue → Transparent at death).
4.  **Life Source** → `Normalized Life`. This ensures the color ramp spans the particle's entire life (0.0 to 1.0).

---

## Part 4: Rendering (Seeing the Result)

The POP SOP outputs "points," but we need to tell TouchDesigner _how_ to draw them.

- **Option A: Sprites (Easiest)**
  - Connect the POP SOP output to a **Sprite SOP**.
  - Back in the main network, assign a **Point Sprite MAT** to the Geo COMP.
  - Each particle becomes a glowing 2D "dot" facing the camera.

- **Option B: Instanced Geometry (Advanced)**
  - Follow the [[touchdesigner/06_Recipes_and_Projects/Audio Reactive Geometry|Instancing Recipe]] but use the POP SOP as your data source.
  - Each particle becomes a full 3D shape (like a small box or sphere).

---

## Part 5: Audio Reactivity

1.  Create an **Audio File In CHOP** and an **Analyze CHOP** (set to RMS Power).
2.  Use a **Math CHOP** to remap the volume (e.g., 0 to 0.1) to a high particle count (e.g., 100 to 5000).
3.  **Bind** this value to the **Emit Rate** on your **Source POP**. Now, every kick drum will burst a cloud of particles!

---

## Troubleshooting

- **"I don't see anything!"** — Make sure the **Solver POP** is connected and the **Display Flag** (the circle icon in the bottom right) is on.
- **"Particles fly away too fast"** — Lower the **Initial Velocity** on the Source POP.
- **"The colors aren't changing"** — Check that **Life Source** is set to `Normalized Life`.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Emit Rate** | Higher = denser clouds of particles; Lower = sparse, individual points. |
| **Life Expectancy** | Higher = particles stay on screen longer; Lower = quick "bursts" that vanish fast. |
| **Force Y (Gravity)** | Positive = particles float up; Negative = particles fall down like rain/snow. |
| **Wind Turbulence** | Higher = more chaotic, organic movement; Lower = straight, mechanical motion. |
| **Color Ramp** | Determines the mood; changing the gradient changes the "story" of the particle's life. |

## Network Architecture

To visualize how the GPU particles and data flows, here is the final network map:

```text
[ POP NETWORK (Inside POP SOP) ]
Source POP (1000/sec) ──┐
                        ▼
[ FORCES ]          [ Force POP ] (Gravity)
                        │
                        ▼
                    [ Wind POP ] (Turbulence)
                        │
                        ▼
[ ATTRIBUTES ]      [ Color POP ] (Ramp by Life)
                        │
                        ▼
[ SIMULATION ]      [ Solver POP ] (The Engine)
                        │
      ┌─────────────────┘
      ▼
[ POP SOP (Bridge) ] ──▶ [ Sprite SOP ] ──▶ [ Geo COMP ] ◀── [ Point Sprite MAT ]
                                               │
                                               ▼
[ AUDIO DRIVE ] ──▶ [ Analyze CHOP ] ──▶ [ Render TOP ]
```

### Data Flow Explanation
1.  **Emission:** The `Source POP` generates the initial points on the GPU. Unlike SOPs, these aren't "geometry" yet; they are just data points.
2.  **Forces & Physics:** The `Force` and `Wind` POPs apply mathematical vectors to every point's velocity attribute. The `Solver POP` then uses those velocities to update the points' positions every frame.
3.  **Attribute Mapping:** The `Color POP` looks at each particle's `Normalized Life` (0 to 1) and assigns a color from a ramp. As a particle gets older, it changes color automatically.
4.  **The Bridge:** The `POP SOP` acts as the bridge, bringing those GPU points back into TouchDesigner's main network so they can be rendered.
5.  **Rendering:** We use the `Sprite SOP` and `Point Sprite MAT` to draw each point as a 2D "glow" that always faces the camera.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
