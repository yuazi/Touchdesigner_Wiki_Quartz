---
title: "02_graphics_pipeline — The GPU as a Factory"
tags:
  - rtg
  - gpu
  - pipeline
  - architecture
  - vulkan
date: 2026-04-14
---
[[notes/realtimegraphics/01_introduction|Back: (y-01) Introduction]] | [[notes/realtimegraphics/03_gpu_architecture_parallelism|Next: (y-03) GPU Architecture & Parallelism]]

## Mental Model First: The Graphics Factory

- **Object Order (Rasterization)**: "Where do I see what?" Go through all objects and project them onto the screen. This is a high-throughput assembly line.
- **Fixed-Function vs. Programmable**: Some parts of the factory are "hard-wired" for speed (Rasterizer, ROP), while others allow you to write your own "programs" (Vertex/Fragment Shaders).
- **The "Weakest Link"**: If your fragment shader is complex but your triangles are small, the fragment shader is the bottleneck. If you have too many triangles, the vertex shader is the bottleneck.

![[pictures/realtimegraphics/02/L02_Pg-02.jpg]]

<p class="image-caption">L02_Pg-02: Comparing Image Synthesis strategies. Rasterization (Object Order) vs. Raytracing (Image Order).</p>

---

## 1. Architecture: The Pipeline Concept

In real-time rendering, the pipeline is a chain of stages where each stage depends on the result of the previous one. A bottleneck in any stage limits the entire system's throughput.

![[pictures/realtimegraphics/02/L02_Pg-04.jpg]]

<p class="image-caption">L02_Pg-04: The conceptual "Logical Pipeline." Raw data enters at the top, and final pixels exit at the bottom.</p>

---

## 2. The Application Stage (CPU)

Unlike later stages, the Application Stage is **fully programmable** and runs entirely on the CPU. It is often the bottleneck for complex games.

- **Primary Tasks**:
    - **Culling**: Identifying which objects are outside the view frustum.
    - **Animation**: Solving skeletal matrices.
    - **Physics/Collision**: "Is the player touching the wall?"
- **Output**: Draw Calls (Instructions for the GPU) and Vertex Buffers.

---

## 3. The Geometry Processing Stage

This stage transforms the 3D geometry into 2D clip-space coordinates.

### 1. Input Assembler (Fixed)
![[pictures/realtimegraphics/02/L02_Pg-05.jpg]]

<p class="image-caption">L02_Pg-05: The IA reads raw buffers and "assembles" them into primitives (triangles, lines).</p>

- **Task**: Reads raw vertex data from memory.
- **Key Feature**: It can attach system-generated values like `vertex_id` or `instance_id`.

### 2. Vertex Shader (Programmable)
![[pictures/realtimegraphics/02/L02_Pg-06.jpg]]

<p class="image-caption">L02_Pg-06: The VS is where the math happens. Moving vertices from model space to clip space.</p>

- **Mandatory Output**: `gl_Position`.
- **Operations**: $P \times V \times M \times \text{vertex}$.

### 3. Clipping & Culling (Fixed)
![[pictures/realtimegraphics/02/L02_Pg-08.jpg]]

<p class="image-caption">L02_Pg-08: Primitives outside the view frustum are culled; those intersecting are clipped.</p>

---

## 4. The Rasterization Stage

### Rasterizer (Fixed)
![[pictures/realtimegraphics/02/L02_Pg-09.jpg]]

<p class="image-caption">L02_Pg-09: The Rasterizer "slices" triangles into fragments (potential pixels).</p>

### Interpolation
![[pictures/realtimegraphics/02/L02_Pg-10.jpg]]

<p class="image-caption">L02_Pg-10: Attributes (Color, UVs) are mathematically interpolated across the surface of the triangle.</p>

---

## 5. The Pixel Processing Stage

### 1. Fragment Shader (Programmable)
![[pictures/realtimegraphics/02/L02_Pg-11.jpg]]

<p class="image-caption">L02_Pg-11: The FS determines the color. This is where textures are looked up and lighting is calculated.</p>

### 2. Raster Operations (ROP - Fixed)
![[pictures/realtimegraphics/02/L02_Pg-13.jpg]]

<p class="image-caption">L02_Pg-13: The ROP handles the "Final Merger" (Depth testing, Alpha blending).</p>

---

## 6. Modern API Architecture (The Shoe Factory)

![[pictures/realtimegraphics/02/L02_Pg-15.jpg]]

<p class="image-caption">L02_Pg-15: In Vulkan/DX12, you don't just "draw"; you build a factory line (PSO).</p>

### Key Vulkan Handles
![[pictures/realtimegraphics/02/L02_Pg-16.jpg]]

<p class="image-caption">L02_Pg-16: The hierarchy of Vulkan objects: Instance $\to$ Physical Device $\to$ Logical Device.</p>

### 💡 Intuition: Why use a PSO (Pipeline State Object)?
![[pictures/realtimegraphics/02/L02_Pg-20.jpg]]

<p class="image-caption">L02_Pg-20: The PSO contains all state (Shaders, Blending, Depth) in one immutable object.</p>

In older APIs (OpenGL), changing the blend mode was a simple state change. In Vulkan, everything is baked into a **PSO**. This allows the GPU driver to optimize hardware registers *before* the draw call, avoiding costly re-validation during the frame.

---

### Applied Exam Focus
- **Fixed vs. Programmable**: Be able to identify which stage is fixed (Rasterizer, IA, ROP) and which is programmable (VS, FS, GS, CS).
- **Object vs Image Order**: Know the difference between Rasterization and Raytracing.
- **Interpolation**: Understand that this happens *between* the Vertex and Fragment shaders.
- **Vulkan handles**: Understand the difference between a Physical Device (Hardware) and a Logical Device (Interface).

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
