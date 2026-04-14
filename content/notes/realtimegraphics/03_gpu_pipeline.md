---
title: "03_gpu_pipeline — The Modern Vulkan Pipeline"
tags:
  - rtg
  - vulkan
  - pipeline
  - rendering
date: 2026-04-14
---
[[notes/realtimegraphics/02_gpu_overview|Back: (y-02) GPU Overview]] | [[notes/realtimegraphics/04_cg_primer|Next: (y-04) Graphics Primer]]

## Mental Model First: The Assembly Line

A graphics pipeline is a sequence of processing stages. Some are fixed (like hardware-based triangle clipping), and others are programmable (shaders). In Vulkan, this pipeline is **immutable**. You cannot change it once it's created. If you want a different shader, you need a different pipeline.

---

## The Complete Stages of the Graphics Pipeline

### 1. Input Assembler (IA) - Fixed
- **Purpose**: Reads raw vertex data from your buffers.
- **Key Task**: It "assembles" these points into primitives (Triangles, Lines, or Points) based on your topology settings.
- **Topology**: `TRIANGLE_LIST`, `TRIANGLE_STRIP`, `POINT_LIST`.

### 2. Vertex Shader (VS) - Programmable
- **Input**: One vertex at a time.
- **Main Goal**: Transform the vertex from "Model Space" into "Clip Space".
- **Math**: $V_{clip} = M_{proj} \times M_{view} \times M_{model} \times V_{model}$.
- It's also where you handle bone-skinning for animated characters.

### 3. Tesselation & Geometry Shaders (Optional)
- **Tesselation**: Subdivides low-poly geometry into high-poly models dynamically on the GPU.
- **Geometry**: Can create or destroy geometry (e.g., turning a point into a particle billboard).

### 4. Rasterizer (RS) - Fixed
- **The Magic Step**: Converts your mathematical triangles into actual pixels (fragments).
- **Clipping**: Primitives outside the viewing frustum are discarded.
- **Perspective Correct Interpolation**: It calculates how to interpolate colors and UVs across the triangle's surface.

### 5. Fragment Shader (FS) - Programmable
- **Purpose**: Calculate the color of a single pixel.
- **Operations**: Texture sampling, lighting calculations (Phong/PBR), and alpha testing.
- **Performance**: This is often the most expensive stage, especially with complex materials.

### 6. Color Blending & Depth Testing (Fixed)
- **Depth Test**: Compares the new pixel's depth with what's already in the Z-buffer. If it's further away, it's discarded (**Z-Culling**).
- **Blending**: Combines the new color with the existing one (for transparency).

---

## From OpenGL to Vulkan: The State Shift

### OpenGL (The State Machine)
Imagine a giant wall of switches. You flip a switch to "Red," then you say "Draw." You flip a switch to "Blending On," then "Draw." The driver has to check every switch every time you draw, which is very slow.

### Vulkan (The Pipeline State Object - PSO)
In Vulkan, you bake all those "switches" into a single, immutable **Pipeline State Object**. 
- You create the PSO once during loading.
- At runtime, you just say "Use PSO #1" and "Draw."
- This allows the driver to optimize the hardware for that specific combination of settings, leading to zero CPU overhead during the actual frame.

---

## Synchronization: Fences vs. Semaphores

The GPU and CPU run in parallel. If the CPU tries to write to a buffer while the GPU is reading it, everything crashes. Vulkan forces you to handle this explicitly.

| Tool | Purpose | Control |
| :--- | :--- | :--- |
| **Fence** | CPU waits for GPU | You (application) |
| **Semaphore** | GPU stage waits for another GPU stage | The GPU Driver |

**Example**: You use a Semaphore to tell the "Fragment Shader" to wait until the "Image" has been acquired from the swapchain. You use a Fence to tell the "CPU" to wait before starting the next frame.

---

## The Swapchain and Presentation Engine

To avoid "tearing" (where you see half of two different frames), we use **Double or Triple Buffering**.

- **Front Buffer**: What is currently being shown on the screen.
- **Back Buffer**: What the GPU is currently drawing.
- **V-Sync**: The process of swapping the Front and Back buffers only during the monitor's "Vertical Refresh" period.

### Vulkan Presentation Modes:
1. **Immediate**: No waiting. High tearing, lowest latency.
2. **FIFO**: Standard V-Sync. No tearing, but can cause stutter if frame rate drops below refresh rate.
3. **Mailbox**: "Triple Buffering." Lowest latency without tearing, as the GPU always works on the latest available back buffer.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
