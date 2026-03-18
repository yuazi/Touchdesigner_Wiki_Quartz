---
tags:
  - touchdesigner
  - td/recipes
  - pop
  - vectorfield
  - instancing
  - okamirufu
date: 2026-03-18
---

# Recipe: Vector Field Instancing

Create a dense, swirling 3D field where millions of individual points follow a fluid-like path. This is the foundation of many generative art "vortex" effects.

> [!info] Operator Families in this Recipe
>
> - **POPs (Point Operators):** Creating and animating the vector field.
> - **SOPs (Surface Operators):** The base geometry for instancing.
> - **COMPs (Components):** Managing the 3D scene and rendering.

---

## Part 1: High-Density 3D Grid

1.  **The Container:** Create a **Geo COMP** and enter it.
2.  **The POP Bridge:** Create a **POP SOP**. Double-click to enter the POP network.
3.  **The Base:** Add a **Grid POP**.
    - **Size** → `5, 5, 5`.
    - **Rows/Columns/Layers** → `50, 50, 50`. This creates 125,000 base points.
4.  **The Force Field:** Add a **Noise POP**.
    - **Output Tab** → Set "Output" to `Offset Position` or `Velocity`.
    - **Noise Tab** → Set "Monochrome" to `Off`. This generates unique X, Y, and Z vectors for each point.
    - **Amplitude** → `0.5`.
    - **Period** → `2.0`.
5.  **The Motion:** Animate the **Transform (Translate Z)** of the Noise POP using `absTime.seconds * 0.1` to make the field "flow" over time.

---

## Part 2: Instancing Tiny Geometry

Instead of rendering simple points, we can instance 3D geometry onto every point in the field.

1.  **The Instance Source:** Connect your POP SOP to the **Instancing Tab** of your **Geo COMP**.
2.  **The Shape:** Create a **Sphere SOP** (set to "Mesh" and low frequency) or a small **Box SOP**.
3.  **Enable Instancing:** Turn on "Instancing" in the Geo COMP.
    - **Translate X/Y/Z** → Use the `P(0)`, `P(1)`, and `P(2)` attributes from the POP SOP.
    - **Scale X/Y/Z** → Map to the Noise POP's output to make instances shrink and grow as they move.

---

## Part 3: Shading & Lighting

1.  Apply a **Constant MAT** or a **PBR MAT** to the Geo COMP.
2.  **Point Coloring:** In the POP network, add an **Attribute POP** to set the `Cd` (Color) attribute based on the point's velocity. This makes fast-moving particles glow brighter.
3.  **The Look:** Combine this with the [[Chromatic Aberration Feedback|Post-Processing Recipe]] for a high-end generative aesthetic.

---

## Part 4: Interactive Control

- Connect an **Audio File In CHOP** to the Noise POP's **Amplitude**.
- Now, the entire field will "pulse" or "vibrate" in sync with the beat, creating a powerful audio-visual experience.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
