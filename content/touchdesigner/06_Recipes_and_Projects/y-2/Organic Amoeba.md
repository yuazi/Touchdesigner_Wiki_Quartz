---
tags:
  - touchdesigner
  - td/recipes
  - pop
  - organic
  - okamirufu
date: 2026-03-18
---

# Recipe: Organic Amoeba (Fluid Point Geometry)

Inspired by the biomechanical and organic aesthetics of [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV), this recipe shows you how to create a "living," pulsating point cloud that looks like a microscopic organism or a floating amoeba.

> [!info] Operator Families in this Recipe
>
> - **POPs (Point Operators):** GPU-based point manipulation.
> - **SOPs (Surface Operators):** Converting points back to geometry.
> - **TOPs (Texture Operators):** Post-processing and "oily" feedback.

---

## Part 1: High-Resolution Point Source

1.  **The Container:** Create a **Geo COMP** and enter it.
2.  **The POP Bridge:** Create a **POP SOP**. Double-click to enter the POP network.
3.  **The Shape:** Add a **Circle POP**.
    - **Divisions** → `500` (or more for a super smooth silhouette).
    - **Radius** → `1.5, 1.5`.
4.  **The Motion:** Add a **Noise POP** after the Circle.
    - **Noise Type** → `Simplex 3D`.
    - **Amplitude** → `0.5`.
    - **Transform (Translate Z)** → `absTime.seconds * 0.2`. This "scrolls" through the 3D noise field, making the amoeba shift and pulse.
5.  **The Attributes:** Add an **Attribute POP**.
    - In the **Color** tab, set the Expression for RGB:
      - R: `me.inputPoint.pos.x`
      - G: `me.inputPoint.pos.y`
      - B: `me.inputPoint.pos.z`
    - This maps the point's position to its color, creating a shifting iridescent effect as it moves.

---

## Part 2: Converting to Mesh

Back in the **Geo COMP** (one level up):

1.  Connect the **POP SOP** output to a **SOP to POP** (if you want to process more) or directly to a **Convert SOP**.
2.  **Convert To** → `Particles`.
3.  **Particle Type** → `Point Sprites`.
4.  Apply a **Point Sprite MAT** to the Geo COMP.

---

## Part 3: The "Oily" Feedback Loop

To get that characteristic fluid look, we use a feedback loop in the TOP world after rendering:

1.  **Render TOP** → **Feedback TOP**.
2.  **Feedback TOP** → **Blur TOP** (Filter Size: 3).
3.  **Blur TOP** → **Level TOP** (Opacity: 0.98).
4.  **Level TOP** → **Composite TOP** (Operation: `Screen` or `Add`).
5.  Drag the **Composite TOP** back onto the **Feedback TOP**.
6.  **The Trick:** Add a **Displace TOP** inside the feedback loop, driven by a small **Noise TOP**. This makes the trails "wiggle" and look like liquid ink.

---

## Part 4: Final Polish

Add a **Luma Blur TOP** at the end of your chain to create a depth-of-field effect, making the amoeba feel like it's being viewed through a microscope lens.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Circle Divisions** | Higher = ultra-smooth silhouette; Lower = jagged, crystal-like amoeba edges. |
| **Noise Amplitude** | Higher = more violent, "stretching" distortions; Lower = calm, subtle pulsing. |
| **Noise Z-Speed** | Higher = rapid shape-shifting; Lower = slow, lava-lamp-like evolution. |
| **Feedback Blur** | Higher = softer, "glowing" ink trails; Lower = sharper, more defined liquid movement. |
| **Displace Strength** | Higher = more "oily" turbulence in trails; Lower = straight, clean motion trails. |

## Network Architecture

To visualize how the data flows, here is a map of the final network:

```text
[ POP NETWORK ]
Circle POP (500 Divs) 
      │
      ▼
Noise POP (Simplex 3D) ───[ Animate Transform Z ]
      │
      ▼
Attribute POP (Pos to Color)
      │
      ▼
[ POP SOP ] ───▶ [ Convert SOP ] ───▶ [ Geo COMP ] ───▶ [ Render TOP ]
                                                             │
                                                             ▼
[ TOP FEEDBACK LOOP ] ◀──────────────────────────────────────┘
      │
      ▼
[ Feedback TOP ] ──▶ [ Displace TOP ] ──▶ [ Level TOP ] ──▶ [ Composite TOP (Screen) ]
```

### Data Flow Explanation
1.  **Generation:** The `Circle POP` creates the raw point data on the GPU. 
2.  **Displacement:** The `Noise POP` moves these points in 3D space. Because it's a POP, it can handle thousands of points with zero lag.
3.  **Shading:** The `Attribute POP` calculates a color for every point based on its current position. As the "amoeba" moves, its color changes.
4.  **Feedback:** The `Render TOP` output is fed into a `Feedback TOP`. The `Displace TOP` inside the loop uses a noise texture to "warp" the trails, creating the oily liquid look characteristic of the [Okamirufu style](https://www.youtube.com/@OkamirufuV).

---

[[../index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
