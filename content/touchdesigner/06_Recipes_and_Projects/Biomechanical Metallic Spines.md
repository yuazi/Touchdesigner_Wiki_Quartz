---
tags:
  - touchdesigner
  - td/recipes
  - pop
  - biomechanical
  - okamirufu
date: 2026-03-18
---

# Recipe: Biomechanical Metallic Spines

This recipe covers the creation of vertebral or rib-like structures using mathematical patterns and point rotation, a staple of the [Okamirufu Vizualizer](https://www.youtube.com/@OkamirufuV) aesthetic.

> [!info] Operator Families in this Recipe
>
> - **CHOPs (Channel Operators):** Defining the spine's profile.
> - **POPs (Point Operators):** Revolving the points into a 3D form.
> - **MATs (Materials):** PBR rendering for that chrome finish.

---

## Part 1: The Profile (CHOPs)

1.  **Generate Wave:** Add a **Pattern CHOP**.
    - **Type** → `Sine`.
    - **Amplitude** → `0.5`.
    - **Number of Samples** → `100`.
2.  **Add Variance:** Connect it to a **Noise CHOP** (set to "Add") to give it a more organic, irregular look.
3.  **The Spine Data:** Use a **Rename CHOP** to rename the channel to `ty` (y-position) and add a constant `tx` (x-position).

---

## Part 2: From Line to Spine (POPs)

1.  **The Container:** Create a **Geo COMP** and enter it.
2.  **Bridge to POPs:** Create a **POP SOP** and enter it.
3.  **CHOP to POP:** Add a **CHOP to POP**. Drag your CHOP into the "CHOP" parameter.
    - Set **Position** to look at your `tx` and `ty` channels.
4.  **Revolve POP:** Add a **Revolve POP** after the CHOP to POP.
    - **Angle** → `360`.
    - **Steps** → `40`.
    - This "sweeps" your mathematical curve in a circle, creating a 3D vertebral segment.
5.  **Noise POP (Small Scale):** Add a **Noise POP** with a very small amplitude and high frequency to add "micro-texture" to the surface of the spine.

---

## Part 3: The Metallic Shader (MATs)

1.  **PBR MAT:** Outside the Geo COMP, create a **PBR MAT**.
2.  **The Chrome Look:**
    - **Metallic** → `1.0` (Full).
    - **Roughness** → `0.1` (Very smooth).
    - **Base Color** → `White` (or slightly blue/teal for a futuristic feel).
3.  **Environment Map:** Crucial for PBR! Add an **Environment Light COMP** and use a high-contrast HDR image (TOP) to get realistic metallic reflections on your spines.
4.  **Assign MAT:** Drag your PBR MAT onto your Geo COMP.

---

## Part 4: Animation

- Go back to your **Pattern CHOP** and animate the **Phase** using `absTime.seconds * 0.1`.
- Watch as the entire vertebral structure pulses and breathes.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
