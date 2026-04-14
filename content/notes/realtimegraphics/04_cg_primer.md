---
title: "04_cg_primer — Foundations of 3D Math"
tags:
  - rtg
  - math
  - shading
  - transformations
date: 2026-04-14
---
[[notes/realtimegraphics/03_gpu_pipeline|Back: (y-03) Graphics Pipeline]] | [[notes/realtimegraphics/index|RTG Index]]

## Mental Model First: The World is a Matrix

Every 3D object you see is essentially just a list of numbers. To move them, scale them, or view them from a camera, we perform matrix multiplications. The goal of this "primer" is to understand the math that turns those raw numbers into a final pixel.

---

## 1. Homogeneous Coordinates ($w$)

In 3D, we use $4 \times 4$ matrices for $3 \times 1$ vectors. Why the extra dimension?

- **The Problem**: You cannot represent "Translation" as a $3 \times 3$ matrix multiplication. Rotation is linear, but translation is not.
- **The Solution ($w$)**: By adding a 4th component, we can perform all transformations (Rotation, Scale, Translation) as a single matrix operation.
  - **Points**: $w = 1$. Moving a point changes its location.
  - **Vectors**: $w = 0$. Moving a vector doesn't change it (it has no position, only direction).

---

## 2. The Transformation Chain

A vertex goes through a "pipeline" of coordinate spaces:

1. **Object Space**: The coordinates as defined in the 3D model (e.g., $(0,0,0)$ is the center of the car).
2. **World Space**: Where the car is placed in the scene. (**Model Matrix**)
3. **View Space**: Where the car is relative to the camera. (**View Matrix**)
4. **Clip Space**: The result of the **Projection Matrix**. This determines what's in the camera's FOV.
5. **NDC (Normalized Device Coordinates)**: Everything is now between $-1$ and $1$.
6. **Screen Space**: Mapped to the actual pixel width and height of your monitor.

---

## 3. Projection: Flattening the World

### Orthographic Projection
- Used for engineering (CAD) and UI.
- No perspective distortion; objects far away are the same size as objects close up.

### Perspective Projection
- Mimics the human eye. 
- Farther objects appear smaller.
- The projection matrix is a frustum (a pyramid with the top cut off). 

**💡 Math Trick**: Perspective division happens automatically in hardware. After the vertex shader, the GPU divides the $x, y, z$ by $w$. This "squashes" the world into the viewing cube.

---

## 4. Visibility: Clipping & Culling

GPUs don't waste time drawing what you can't see.

- **Frustum Culling**: Discarding entire objects outside the camera's viewing pyramid (done on CPU).
- **Back-Face Culling**: If a triangle's normal points away from the camera, it's not visible. The GPU skips it.
- **Z-Buffer (Depth Buffer)**: Each pixel stores its "depth" ($1/z$). If a new pixel is closer, it overwrites the old one. If it's further, it's discarded.

---

## 5. Shading Models

### Lambertian (Diffuse)
The simplest model for matte surfaces.
$$I = L \cdot \max(0, n \cdot l)$$
- $n$: Surface normal.
- $l$: Vector pointing to the light.
- **Intuition**: Surfaces directly facing the light are bright; those at an angle are dimmer.

### Blinn-Phong (Specular Highlights)
Adds "shininess" to objects. 
- Uses the **Half-vector** $h$ (the average of the light vector and the view vector).
- The "dot product" of the normal and the half-vector determines the specular highlight.

---

## 6. Textures: Mipmapping & Filtering

Textures are just 2D images wrapped around 3D models.

- **UV Mapping**: Assigning coordinates $(u,v)$ between $0$ and $1$ to every vertex.
- **Mipmapping**: Pre-calculating smaller versions of a texture. If an object is far away, the GPU uses a smaller version to avoid "shimmering" (aliasing).
- **Anisotropic Filtering**: Improves texture clarity on surfaces viewed at sharp angles (like a road extending into the distance).

---

## 7. Alpha Blending

How we handle transparency. The most common formula is **Source Alpha**:
$$C_{final} = \alpha_s \cdot C_s + (1 - \alpha_s) \cdot C_d$$
- $C_s$: New (source) color.
- $C_d$: Existing (destination) color in the buffer.
- $\alpha_s$: Transparency of the new pixel.

**⚠️ Warning**: For alpha blending to work correctly, you **must** draw your objects from back to front. Otherwise, the depth test will discard transparent pixels behind them.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
