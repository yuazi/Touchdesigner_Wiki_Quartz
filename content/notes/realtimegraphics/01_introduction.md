---
title: "01_introduction — The Challenge of Real-Time Graphics"
tags:
  - rtg
  - graphics
  - introduction
  - master
date: 2026-04-14
---
[[notes/realtimegraphics/index|Back to RTG Index]] | [[notes/realtimegraphics/02_gpu_overview|Next: (y-02) GPU Overview]]

## Mental Model First

- **Real-Time is about Throughput**: Unlike offline rendering (Pixar), where a frame can take hours, we have ~6.9ms (at 144Hz) to finish everything.
- **The CPU is the Director, the GPU is the Factory**: The CPU handles the logic, AI, and physics, then sends "draw calls" to the GPU, which mass-produces pixels.
- **Abstractions Matter**: Modern APIs (Vulkan) are verbose because they remove the "magic" of the driver. You now have to manage memory and synchronization yourself.
- **Graphics is Math in Motion**: Everything you see is a series of matrix multiplications and dot products executed billions of times per second.

---

## Why Real-Time Graphics?

Machine perception and interaction require visual feedback. Whether it's **CAD**, **Games**, **Medical Visualization**, or **CGI Previews**, the goal is the same: compute millions of pixels in milliseconds.

### The Numbers Problem

Consider 4K gaming at 144 Hz:
- **Resolution**: $3840 \times 2160 = 8.3 \text{ million pixels}$.
- **Refresh Rate**: $144 \text{ images/second}$.
- **Throughput**: $8.3 \text{ Mpx} \times 144 \text{ Hz} \approx 1.2 \text{ Gigatexel/second}$ of just output data.
- **The Reality**: Each pixel might require hundreds of shading operations, texture lookups, and depth tests. We are talking about **TFLOPS** (Teraflops) of computation.

### Specialized Hardware vs. Parallelization
To solve this, we don't use faster serial processors; we use thousands of slower, specialized cores.
- **CPU**: Optimized for low-latency branch prediction and complex logic.
- **GPU**: Optimized for massive data-parallel throughput.

---

## Course Tools: Diligent Engine

While we learn the low-level concepts of Vulkan and DX12, we use **Diligent Engine** as a modern abstraction layer.

- **Cross-Platform**: Works on Vulkan, OpenGL, DX11/12, and Metal.
- **Simplification**: It provides a unified way to handle **Pipeline State Objects (PSO)** and **Resource Descriptors** without the 2000+ lines of "boilerplate" required for a basic Vulkan triangle.
- **Shader Support**: Supports both **GLSL** and **HLSL**, allowing us to focus on the math of the Fragment Shader rather than API-specific plumbing.

---

## Lab Exercises: The Roadmap to a Renderer

The lab is designed as a series of building blocks:

1. **Basic Rendering**:
   - Setting up **Indexed Buffers** (saving memory).
   - Creating a **Rotating Cube** (Model-View-Projection matrix math).
   - **Texturing**: Mapping 2D images onto 3D surfaces.
2. **Post-Processing**:
   - Learning "Screen-Space" techniques.
   - **Bilateral Upscaling**: Intelligent scaling that preserves edges.
   - **Anti-Aliasing**: Fighting the "jaggies" (SSAA/MSAA).
3. **Particle Systems**:
   - Moving simulation to the GPU using **Compute Shaders**.
   - **GPU Instancing**: Drawing thousands of objects (billboards) in a single draw call.
4. **Advanced Project**:
   - **Hardware Raytracing**: Utilizing RT cores for shadows and reflections.
   - **SSAO (Screen Space Ambient Occlusion)**: Faking global illumination by darkening crevices.

---

## Prerequisites & Exam

- **Knowledge**: Assumes you know basic Computer Graphics (Rasterization, Shading).
- **Programming**: Strong **C++** is essential. You'll be dealing with pointers, memory layouts, and high-performance code.
- **Exam**: Usually a written exam, focusing on the architecture and the math behind the rendering pipeline.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
