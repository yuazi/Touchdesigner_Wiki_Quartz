---
title: "04_cg_primer — Foundations of 3D Math"
tags:
  - rtg
  - math
  - shading
  - transformations
date: 2026-04-14
---
[[notes/realtimegraphics/03_gpu_architecture_parallelism|Back: (y-03) GPU Architecture]] | [[notes/realtimegraphics/index|RTG Index]]

## Mental Model First: Geometry as Data

- **The GPU is a Matrix Machine**: Everything in 3D graphics—movement, rotation, perspective—is just a sequence of $4 \times 4$ matrix multiplications.
- **Homogeneous Coordinates**: We add a 4th dimension ($w$) to our 3D vectors to make translation and perspective projection possible with simple linear math.
- **Rasterization is Interpolation**: We only calculate colors/normals at the three corners of a triangle. The hardware then uses **Barycentric Coordinates** to smoothly fill in every pixel in between.

---

## 1. The Transformation Pipeline

![[L04_Pg-08.jpg]]

<p class="image-caption">L04_Pg-08: The journey of a vertex from a local model coordinate to a final pixel on your screen.</p>

1. **Model Space**: Local coordinates (e.g., $(0,0,0)$ is the center of the car).
2. **World Space**: Objects placed in the scene (Car is at $(10, 5, -20)$).
3. **View Space (Camera Space)**: Everything relative to the camera lens.
4. **Clip Space**: After applying projection; coordinates are ready for culling.
5. **NDC (Normalized Device Coordinates)**: After $w$-divide. Everything is in a $[-1, 1]$ cube.
6. **Viewport Space**: Actual screen coordinates (e.g., $(1920, 1080)$).

---

## 2. Core Matrix Math

### Translation, Scaling, Rotation
We use **Homogeneous Coordinates** $(x, y, z, w)$ to unify these operations.

- **Translation**:
  $$ \begin{bmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix} = \begin{bmatrix} x + t_x \\ y + t_y \\ z + t_z \\ 1 \end{bmatrix} $$

### Perspective Projection
![[L04_Pg-18.jpg]]

<p class="image-caption">L04_Pg-18: Perspective projection mimics how a camera lens (or human eye) works: objects get smaller as they get further away.</p>

The key is that $x$ and $y$ are divided by $z$. In a matrix, we store $z$ in the $w$ component, and the hardware later performs the **W-Divide**:
$$ x_{ndc} = x_{clip} / w_{clip} $$

---

## 3. Visibility & Interpolation

### The Z-Buffer
![[L04_Pg-28.jpg]]

<p class="image-caption">L04_Pg-28: The Z-buffer stores the depth of the closest object at every pixel to handle occlusions.</p>

- **💡 Intuition**: To keep things fast, the GPU doesn't sort triangles. It just draws them and keeps a "depth map." If a new pixel is closer than the stored value, it's drawn; otherwise, it's discarded.

### Barycentric Coordinates
![[L04_Pg-31.jpg]]

<p class="image-caption">L04_Pg-31: Barycentric coordinates allow us to find any point inside a triangle using weights $(\lambda_1, \lambda_2, \lambda_3)$.</p>

Any point $P$ inside $\triangle V_1 V_2 V_3$ is:
$$ P = \lambda_1 V_1 + \lambda_2 V_2 + \lambda_3 V_3, \quad \text{where } \lambda_1 + \lambda_2 + \lambda_3 = 1 $$

---

## 4. Shading Models

### Lambert (Diffuse)
![[L04_Pg-35.jpg]]

<p class="image-caption">L04_Pg-35: Diffuse shading depends only on the angle between the surface normal and the light source.</p>

$$ I = k_d \cdot \max(0, \mathbf{n} \cdot \mathbf{l}) $$

### Phong (Specular)
![[L04_Pg-36.jpg]]

<p class="image-caption">L04_Pg-36: Specular highlights depend on the viewer's position relative to the reflected light ray.</p>

---

## 5. Textures & Blending

### Mip-mapping
![[L04_Pg-40.jpg]]

<p class="image-caption">L04_Pg-40: Mip-maps are pre-filtered, smaller versions of textures used to prevent aliasing (shimmering) at a distance.</p>

### Alpha Blending (Transparency)
![[L04_Pg-43.jpg]]

<p class="image-caption">L04_Pg-43: Alpha blending requires drawing objects from back-to-front for correct results.</p>

---

### Applied Exam Focus
- **Transformation Pipeline**: Be able to name all spaces in order (Model $\to$ World $\to$ View $\to$ Clip $\to$ NDC $\to$ Viewport).
- **Perspective Division**: Understand that perspective happens because of the **$w$-divide**, not just the matrix multiplication.
- **Barycentric Interpolation**: Know that the hardware uses this to interpolate UVs and Normals across a triangle.
- **Alpha Blending**: Remember the **Back-to-Front** requirement for correct transparency.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
