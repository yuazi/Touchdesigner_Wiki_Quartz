---
title: "04_cg_primer — Foundations of 3D Math"
tags:
  - rtg
  - math
  - shading
  - transformations
date: 2026-05-12
---

[[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|Back: (y-03) GPU Architecture]] | [[notes/lectures/realtimegraphics/05_shading_models|Next: (y-05) Shading Models]] | [[notes/lectures/realtimegraphics/index|RTG Index]]

## Mental Model First: Geometry as Data

- **Objects become triangles.** The GPU is built around simple primitives that can be transformed, rasterized, and interpolated efficiently.
- **Transforms are matrix products.** Movement through object, world, camera, clip, and screen spaces is mostly linear algebra.
- **Rasterization is inside testing plus interpolation.** Edge equations decide coverage; barycentric coordinates carry attributes across the triangle.
- **Visibility is an order test.** The depth buffer does not need exact metric depth, only a value that preserves near/far ordering.

---

## 1. Object Order and Triangle Data

![[pictures/realtimegraphics/04/L04_Pg-02.jpg]]

<p class="image-caption">L04_Pg-02: Object-order image synthesis visits objects and projects their primitives to the screen.</p>

Computer graphics usually starts from scene geometry, not from pixels. The renderer projects objects into the image and lets rasterization find the covered samples.

### Indexed Triangles

![[pictures/realtimegraphics/04/L04_Pg-05.jpg]]

<p class="image-caption">L04_Pg-05: Indexed triangles store each vertex once and reference it from multiple triangles.</p>

A triangle soup duplicates vertices for every triangle. Indexed geometry stores shared vertices once, then uses an index buffer to define triangles. This reduces memory and improves vertex reuse.

---

## 2. Transformation Pipeline

![[pictures/realtimegraphics/04/L04_Pg-08.jpg]]

<p class="image-caption">L04_Pg-08: Vertices move from object space through world, camera, clip, normalized device, and viewport spaces.</p>

The standard chain is:

1. **Object space**: local model coordinates.
2. **World space**: object placed in the scene.
3. **Camera space**: coordinates relative to the camera.
4. **Clip space**: projection applied; clipping can happen.
5. **Normalized device coordinates**: after perspective divide.
6. **Viewport space**: final screen coordinates.

### Homogeneous Coordinates

![[pictures/realtimegraphics/04/L04_Pg-09.jpg]]

<p class="image-caption">L04_Pg-09: Homogeneous coordinates add a w component so affine transforms and projection fit into matrix form.</p>

The fourth coordinate lets translation, scaling, rotation, and projection share the same representation:

$$\mathbf{v}' = M \mathbf{v}$$

For points, $w = 1$. After projection, the hardware divides by $w$ to return to 3D normalized coordinates.

---

## 3. Core Transform Matrices

### Translation

![[pictures/realtimegraphics/04/L04_Pg-11.jpg]]

<p class="image-caption">L04_Pg-11: Translation moves a point by storing offsets in the fourth column of a homogeneous matrix.</p>

Translation is not linear in 3D coordinates alone, but it becomes a matrix multiplication in homogeneous coordinates.

### Scaling

![[pictures/realtimegraphics/04/L04_Pg-12.jpg]]

<p class="image-caption">L04_Pg-12: Scaling stretches coordinates along each axis.</p>

Scaling changes object size. Non-uniform scaling can distort normals, which matters later for lighting.

### Rotation

![[pictures/realtimegraphics/04/L04_Pg-13.jpg]]

<p class="image-caption">L04_Pg-13: Rotation matrices change orientation while preserving distances around the chosen axis.</p>

Rotation order matters because matrix multiplication is not commutative. `Rz * Ry * Rx` generally differs from `Rx * Ry * Rz`.

---

## 4. Projection and Camera Space

### Perspective Projection

![[pictures/realtimegraphics/04/L04_Pg-16.jpg]]

<p class="image-caption">L04_Pg-16: Perspective projection makes farther objects appear smaller by preparing coordinates for division by depth.</p>

Perspective projection encodes the camera frustum. The visual effect comes from the later divide by $w$, not from a simple 2D scale.

### Normalization of Homogeneous Coordinates

![[pictures/realtimegraphics/04/L04_Pg-18.jpg]]

<p class="image-caption">L04_Pg-18: Dividing by w maps homogeneous coordinates back into ordinary 3D coordinates.</p>

All nonzero scalar multiples of a homogeneous point represent the same Euclidean point. Normalization picks the representative with $w = 1$.

### Camera Transformation

![[pictures/realtimegraphics/04/L04_Pg-20.jpg]]

<p class="image-caption">L04_Pg-20: The camera transform is built from camera position, direction, and up vector.</p>

The view matrix can be understood as moving the world so the camera becomes the origin looking down its canonical direction.

### Normalized Device Coordinates

![[pictures/realtimegraphics/04/L04_Pg-21.jpg]]

<p class="image-caption">L04_Pg-21: After perspective division, visible geometry lies inside normalized device coordinates.</p>

NDC is the canonical space used before viewport mapping. It makes screen mapping independent of the actual window size.

---

## 5. Culling, Clipping, and Rasterization

### Culling and Clipping

![[pictures/realtimegraphics/04/L04_Pg-22.jpg]]

<p class="image-caption">L04_Pg-22: Culling rejects fully invisible geometry; clipping handles primitives that cross the visible boundary.</p>

Rejecting invisible primitives early protects later stages from unnecessary work.

### Rasterization and Edge Equations

![[pictures/realtimegraphics/04/L04_Pg-26.jpg]]

<p class="image-caption">L04_Pg-26: Rasterization uses edge equations to decide whether samples lie inside a triangle.</p>

Each triangle edge defines a half-plane. A sample is inside when it lies on the correct side of every edge.

### Hierarchical Rasterization

![[pictures/realtimegraphics/04/L04_Pg-30.jpg]]

<p class="image-caption">L04_Pg-30: Hierarchical rasterization tests tiles before individual samples.</p>

Tile-level tests are a throughput optimization: large fully inside/outside regions can be accepted or rejected without checking every pixel first.

---

## 6. Depth and Visibility

### Depth as an Order Relation

![[pictures/realtimegraphics/04/L04_Pg-31.jpg]]

<p class="image-caption">L04_Pg-31: Depth values only need to preserve visibility ordering, not physical distance linearly.</p>

The depth buffer answers: **which fragment is closer?** A nonlinear projection is acceptable if the ordering is correct and precision is sufficient.

### Depth Buffer Algorithm

![[pictures/realtimegraphics/04/L04_Pg-35.jpg]]

<p class="image-caption">L04_Pg-35: The z-buffer stores the nearest depth per pixel and updates it when a closer fragment arrives.</p>

This avoids sorting all triangles by depth. The GPU can draw primitives in arbitrary order and let the depth test resolve visibility.

---

## 7. Shading and Material Basics

### Lambert Shading

![[pictures/realtimegraphics/04/L04_Pg-37.jpg]]

<p class="image-caption">L04_Pg-37: Lambert shading uses the dot product between surface normal and light direction for diffuse light.</p>

The basic diffuse term is:

$$L = k_d \circ I_L \circ \max(\mathbf{n} \cdot \mathbf{l}, 0)$$

It is view-independent: rotating the camera does not change the brightness if light and surface orientation stay fixed.

### Phong Shading

![[pictures/realtimegraphics/04/L04_Pg-38.jpg]]

<p class="image-caption">L04_Pg-38: Phong shading adds ambient, diffuse, and specular terms.</p>

Phong introduces a view-dependent highlight. It is useful as a first specular model, even though the next lecture explains why it is not physically accurate.

---

## 8. Textures and Interpolation

### Textures

![[pictures/realtimegraphics/04/L04_Pg-39.jpg]]

<p class="image-caption">L04_Pg-39: Textures simulate spatially varying material properties such as color, reflection, and shininess.</p>

Textures let one mesh reuse the same geometry while changing appearance across the surface.

### Texture Coordinates

![[pictures/realtimegraphics/04/L04_Pg-41.jpg]]

<p class="image-caption">L04_Pg-41: Texture coordinates attach a 2D parameterization to mesh vertices.</p>

Each vertex stores $(u, v)$ coordinates. Rasterization interpolates them for fragments, and the fragment shader samples the texture.

### Barycentric Coordinates

![[pictures/realtimegraphics/04/L04_Pg-42.jpg]]

<p class="image-caption">L04_Pg-42: Barycentric coordinates express a point inside a triangle as weighted vertex contributions.</p>

For a point $P$ inside a triangle:

$$P = \lambda_1 V_1 + \lambda_2 V_2 + \lambda_3 V_3,\quad \lambda_1 + \lambda_2 + \lambda_3 = 1$$

The same weights interpolate colors, normals, texture coordinates, and other vertex attributes.

### Alpha Blending

![[pictures/realtimegraphics/04/L04_Pg-43.jpg]]

<p class="image-caption">L04_Pg-43: Alpha blending combines the new fragment color with the existing framebuffer color.</p>

Transparency is order-dependent. Correct alpha blending usually requires drawing transparent objects from back to front after opaque objects.

---

### Applied Exam Focus

- **Spaces in order**: object -> world -> camera -> clip -> NDC -> viewport.
- **Homogeneous coordinates**: know why the fourth coordinate makes translation and projection matrix-based.
- **Perspective divide**: understand that perspective comes from dividing by $w$.
- **Rasterization**: connect edge equations, barycentric coordinates, and interpolation.
- **Depth buffer**: explain why unsorted triangles can still produce correct visibility.
- **Alpha blending**: remember that transparent rendering is order-dependent.

---

[[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|Back: (y-03) GPU Architecture]] | [[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]] | [[notes/lectures/realtimegraphics/05_shading_models|Next: (y-05) Shading Models]]
