---
title: "Image to POPs (Pointcloud and Line Grid)"
tags:
  - touchdesigner
  - td/recipes
  - pop
  - pointcloud
  - pppanik
date: 2026-03-25
---

> **Inspired by:** [PPPANIK - IMAGE TO POPs: POINTCLOUD / LINE GRID](https://www.youtube.com/watch?v=GJMIXo8pwSY)

This tutorial covers the "Image to POPs" workflow for high-performance conversion of 2D textures into 3D point clouds and structured line grids. This specific technique, popularized by **PPPANIK**, excels at creating clean, "holographic" digital blueprints and organic, high-density generative visuals.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Pre-processing the source image for the GPU.
> - **POPs (Point Operators):** Converting and manipulating millions of points on the GPU.
> - **MATs (Materials):** Applying the **Line MAT** for the classic wireframe/grid aesthetic.

---

## Part 1: Source Preparation (TOPs)

The density of your point cloud is directly tied to the resolution of your source image.

1.  **Movie File In TOP:** Load your image or video.
2.  **Fit TOP:** 
    - **Fit Method** → `Fit Outside`.
    - **Common Page > Output Resolution** → `200 x 200` (40,000 points) or `500 x 500` (250,000 points).
    - **Interpolation** → `Nearest`. This prevents pixel values from blending together during resize, so each point gets a clean, discrete color value.
3.  **Level TOP:** Increase **Contrast** to sharpen the distinction between light and dark areas.

---

## Part 2: Pixel-to-Point Conversion (POPs)

1.  **Geo COMP:** Create a new Geometry component and enter it. Delete the default Torus.
2.  **TOP to POP:** 
    - **TOP** → Reference your **Level TOP**.
    - **Position Mode** → `UV` or `Height`. 
    - This maps the pixel coordinates (0-1) to 3D space.
3.  **Delete POP:** 
    - **Operation** → `Delete by Expression`.
    - **Expression** → `me.inputPoint.color.r < 0.1`.
    - This "culls" the background, leaving only the points that represent the bright parts of your image.
4.  **Noise POP:** 
    - **Amplitude** → `0.15`.
    - **Transform (Translate Z)** → `absTime.seconds * 0.1`.
    - This adds a subtle, organic ripple to the point cloud.

---

## Part 3: The Line Grid Aesthetic

There are two main ways to achieve the "Grid" look:

### Method A: Instancing (Copy POP)
1.  **Rectangle POP:** Create a very small, thin rectangle.
2.  **Copy POP:** 
    - **Input 1:** Rectangle POP.
    - **Input 2:** Your point cloud (from Part 2).
    - **Copy Page > Use Template Point Attributes** → `On`.
3.  **Line MAT:** Apply a **Line Material** to the Geo COMP with **Draw Lines** and **Draw Points** enabled.

### Method B: Line Strips (Joining Points)
1.  **Join POP:** Connect your point cloud to a **Join POP**.
    - Set the **Maximum Join Distance** to a small value.
    - This connects neighboring points with line primitives, creating a structured mesh/grid.
2.  **Line MAT:** Apply a **Line Material**. Since the Join POP creates actual line primitives, the Line MAT will render them as a sleek, wireframe grid.

---

## Part 4: Rendering & Post-Processing (The "Pro" Look)

PPPANIK often uses a specific composite trick to make the visuals "pop":

1.  **Render TOP:** Standard setup with a Camera and Light.
2.  **The Glow (Feedback):**
    - **Render TOP** → **Feedback TOP** → **Blur TOP** (Filter Size 2) → **Level TOP** (Opacity 0.9) → **Add TOP**.
3.  **Softlight Composite (Pro Tip):**
    - Create two versions of your render: one clean (Pointcloud) and one with the Line Grid.
    - **Composite TOP:** Combine both versions.
    - **Operation** → `Softlight`.
    - This blends the sharp lines with the soft point cloud glow, creating a high-end, cinematic look.

---

## Pro Tip: Texture Indexing

If you want to instance thousands of *different* images onto these points (rather than just drawing lines), you must use **Texture Indexing**:

1.  **Index Creation:** Use a **Math POP** or **Attribute POP** to create a custom attribute called `tex_index`.
2.  **Expression:** Set the value to `me.inputPoint.id % [number_of_images]`.
3.  **Geo COMP:** In the **Instance 2** page, drag your POP into the "Texture Index OP" and set the "Texture Index Attribute" to your `tex_index`.
4.  **Result:** Every point in your cloud now displays a unique image from your texture array.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **TOP Resolution** | Directly controls "resolution" of the 3D form. 500+ requires a strong GPU. |
| **Delete Threshold** | Higher = "thinner" form; Lower = more background pixels included. |
| **Join Distance** | (Method B) Higher = more "messy" connections; Lower = strict grid structure. |
| **Feedback Blur** | Controls the "bloom" and softness of the digital trails. |

## Network Architecture

```text
[ SOURCE TOPs ]
Movie File In ──▶ Fit ──▶ Level ──▶ [ TOP to POP ]
                                         │
                                         ▼
[ POPs ]                           [ Delete POP ] ──▶ [ Noise POP ]
                                                              │
                                                              ▼
[ MAT ]                            [ Join POP ] ◀─────[ POP NETWORK ]
Line MAT ────────────────────────▶ [ Geo COMP ]
                                         │
                                         ▼
[ RENDERING ]                      [ Render TOP ] ──▶ [ Feedback Loop ]
                                                              │
                                                              ▼
[ POST-EFFECT ]                    [ Composite TOP (Softlight) ] ──▶ OUT
```

---
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
