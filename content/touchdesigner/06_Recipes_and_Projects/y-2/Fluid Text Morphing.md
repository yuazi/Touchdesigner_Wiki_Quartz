---
title: "Fluid Text Morphing"
tags:
  - touchdesigner
  - td/recipes
  - pop
  - text
  - morphing
  - okamirufu
date: 2026-03-18
---

> **Inspired by:** [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV)

Transform 2D text into a dynamic, 3D point cloud that "melts," "morphs," and "dissolves" with a liquid-like fluidity. This technique bridges the 2D TOP world with the 3D POP world.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Creating the text source.
> - **POPs (Point Operators):** Driving the "melting" simulation.
> - **SOPs (Surface Operators):** Turning points into renderable geometry.

---

## Part 1: High-Contrast Text Source

1.  **Text TOP:** Create a **Text TOP**.
    - **Font** → Choose a thick, bold font (e.g., Arial Black).
    - **Size** → `256 x 256` (lower resolutions work faster for point conversion).
    - **Content** → Type a single word or letter.
2.  **Edge TOP:** Connect the Text TOP to an **Edge TOP** if you want to only generate points on the outline of the text.

---

## Part 2: Pixel to Point Conversion (POPs)

1.  **The Container:** Create a **Geo COMP** and enter it.
2.  **Bridge to POPs:** Create a **POP SOP** and enter it.
3.  **TOP to POP:** Add a **TOP to POP**. Drag your Text TOP into the "TOP" parameter.
    - **Source Color** → `RGB`. This creates points based on pixel brightness.
    - **Step** → `1, 1`. This creates one point for every pixel.
    - **Threshold** → `0.5`. This ensures points only exist where the text is white.

---

## Part 3: The "Melting" Simulation

1.  **Noise POP (Vertical Flow):** Add a **Noise POP**.
    - **Amplitude** → `0.5`.
    - **Noise Tab** → Set "Monochrome" to `Off`.
    - **Transform (Translate Y)** → `absTime.seconds * 0.5`.
    - This creates a vertical "drip" effect as points move through a noise field.
2.  **Force POP (Dissolve):** Add a **Force POP**.
    - Animate the **Magnitude** to "explode" or "dissolve" the text when you trigger a button or a music beat.
3.  **Solver POP:** Add a **Solver POP** after the noise and forces to give the motion physical persistence.

---

## Part 4: Shading & Rendering

- Use a **Geometry COMP** for instancing or convert the points into **Point Sprites** (see the [[Organic Amoeba|Amoeba Recipe]] for the rendering setup).
- Add a **Bloom TOP** at the end of your chain to make the melting points glow with a neon "Y2K" energy.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Noise Amplitude** | Higher = more chaotic, "melting" distortion; Lower = text remains legible but wiggles. |
| **Vertical Drip Speed** | Higher = text "melts" rapidly like water; Lower = slow, honey-like viscous flow. |
| **Force Magnitude** | Higher = explosive, violent dissolution of the text; Lower = gentle drifting of points. |
| **Bloom Intensity** | Higher = points become glowing embers; Lower = sharp, distinct digital pixels. |

## Network Architecture

To visualize how the data flows, here is a map of the final network:

```text
[ TEXT SOURCE ]
Text TOP ──▶ Edge TOP (Optional)
                │
      ┌─────────┘
      ▼
[ POP NETWORK ]
TOP to POP (Pixel Position)
      │
      ▼
Noise POP (Vertical Drip)
      │
      ▼
Force POP (Trigger Dissolve)
      │
      ▼
Solver POP (Physics Engine)
      │
      ▼
[ POP SOP ] ───▶ [ Geo COMP ] ───▶ [ Bloom TOP ]
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
