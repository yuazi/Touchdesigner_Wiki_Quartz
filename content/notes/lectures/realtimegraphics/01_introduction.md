---
title: "01_introduction — The Challenge of Real-Time Graphics"
tags:
  - rtg
  - graphics
  - introduction
  - throughput
  - master
date: 2026-05-12
---

[[notes/lectures/realtimegraphics/index|Back to RTG Index]] | [[notes/lectures/realtimegraphics/02_graphics_pipeline|Next: (y-02) Graphics Pipeline]]

## Mental Model First: Real-Time Graphics Is a Throughput Problem

- **The target is interaction.** Real-time graphics means generated images arrive fast enough that users can react to them.
- **Pixels dominate the budget.** A 4K frame has millions of pixels; high refresh rates multiply that cost immediately.
- **GPUs exist for parallelism.** The workload is too large for one fast CPU thread, but many pixels, vertices, and samples can be processed together.
- **The course mixes concepts and implementation.** The lectures explain the pipeline; the lab turns those ideas into working renderer code.

---

## 1. What Real-Time Graphics Wants

![[pictures/realtimegraphics/01/L01_Pg-03.jpg]]

<p class="image-caption">L01_Pg-03: Real-time graphics aims for computer-generated imagery fast enough for interactive use.</p>

Real-time graphics is the engineering discipline behind games, visualization, CAD, VR/AR, simulation, and interactive previews. The image does not merely need to look good; it must arrive before the next display deadline.

### The Core Question

![[pictures/realtimegraphics/01/L01_Pg-04.jpg]]

<p class="image-caption">L01_Pg-04: The problem is computing millions of pixels from a complex 3D scene in real time.</p>

The central challenge is:

> How can we synthesize a complex 3D image quickly enough that interaction still feels continuous?

That question explains most of the later architecture: fixed-function hardware, shader parallelism, batching, buffering, and aggressive avoidance of wasted work.

---

## 2. Three Decades of Hardware Progress

![[pictures/realtimegraphics/01/L01_Pg-07.jpg]]

<p class="image-caption">L01_Pg-07: Hardware moved from room-scale specialist systems to consumer GPUs with far higher practical throughput.</p>

The lecture contrasts the SGI RealityMonster era with modern RTX-class GPUs. The important lesson is not only that hardware became faster, but that graphics became a mass-market parallel computing workload.

| Era   | Example               | Practical Meaning                              |
| :---- | :-------------------- | :--------------------------------------------- |
| 1990s | SGI RealityMonster    | Expensive, room-scale specialized rendering    |
| Today | GeForce RTX-class GPU | Desktop-scale hardware for real-time rendering |

### 💡 Intuition: Why Graphics Hardware Won

Graphics workloads have enormous regularity: many vertices pass through similar transforms, and many fragments run similar shading programs. Hardware that is specialized for this regularity wins on cost, power, and throughput.

---

## 3. Course Topics and Mental Map

![[pictures/realtimegraphics/01/L01_Pg-09.jpg]]

<p class="image-caption">L01_Pg-09: The course starts with the graphics pipeline and expands into shading, effects, global illumination, and acceleration structures.</p>

The course sequence can be read as a renderer roadmap:

1. **Graphics pipeline and Vulkan**: how work gets onto the GPU.
2. **Texturing and shading**: how visible surfaces receive color.
3. **Special effects**: post-processing and screen-space techniques.
4. **Global illumination and shadows**: indirect light and visibility.
5. **Acceleration structures**: making ray and scene queries fast enough.

---

## 4. Lab Overview

![[pictures/realtimegraphics/01/L01_Pg-14.jpg]]

<p class="image-caption">L01_Pg-14: The lab is organized around four programming exercises and individual pass requirements.</p>

The lab turns rendering concepts into code. The pass condition is strict: every exercise must be passed individually with more than 60 percent, so a weak assignment cannot simply be averaged away.

### Diligent Engine

![[pictures/realtimegraphics/01/L01_Pg-16.jpg]]

<p class="image-caption">L01_Pg-16: Diligent Engine provides a modern cross-platform rendering abstraction over APIs such as Vulkan and DirectX.</p>

Diligent Engine gives access to modern rendering concepts without forcing every exercise to start from raw Vulkan boilerplate. The point is to learn pipeline and algorithm design, not to spend all effort on platform setup.

---

## 5. Exercise Roadmap

![[pictures/realtimegraphics/01/L01_Pg-18.jpg]]

<p class="image-caption">L01_Pg-18: The exercises build from basic rendering to post-processing, particles, and a final advanced project.</p>

The assignments form a staged renderer:

1. **Basic Rendering**: buffers, indexed geometry, transformations, and basic draw calls.
2. **Screen-Space Post-Processing**: image-space filters, upscaling, and multisampling.
3. **Particle System**: many independent objects, instancing, and GPU-side simulation.
4. **Raytracing or SSAO**: advanced visibility or ambient occlusion effects.

### Screen-Space Post-Processing

![[pictures/realtimegraphics/01/L01_Pg-20.jpg]]

<p class="image-caption">L01_Pg-20: The second assignment focuses on screen-space processing such as upscaling and antialiasing.</p>

Post-processing treats the already-rendered image as input data. It is a natural place to learn image filters, sampling, and GPU memory access patterns.

### Particle Systems

![[pictures/realtimegraphics/01/L01_Pg-21.jpg]]

<p class="image-caption">L01_Pg-21: Particle simulation highlights the difference between CPU-side and GPU-side parallel work.</p>

Particles are a good fit for GPUs because many particles follow the same update rules independently. That makes them an early example of graphics as general parallel computation.

### Final Project Direction

![[pictures/realtimegraphics/01/L01_Pg-22.jpg]]

<p class="image-caption">L01_Pg-22: The final project options include hardware ray tracing or screen-space ambient occlusion.</p>

The final project asks for a more complete effect: ray tracing for visibility/reflection or SSAO for plausible contact shadowing in screen space.

---

## 6. Communication and Independence

![[pictures/realtimegraphics/01/L01_Pg-23.jpg]]

<p class="image-caption">L01_Pg-23: Exercise work is independent; discussion is allowed, but sharing code is not.</p>

The course allows discussion, but implementations must remain independent. Treat outside examples as learning material, not as code to copy.

---

### Applied Exam Focus

- **Throughput calculation**: explain why resolution, refresh rate, and sampling quickly become billions of operations.
- **Specialized hardware**: know why graphics workloads suit parallel GPU hardware.
- **Course map**: connect pipeline, shading, post-processing, particles, and ray tracing to the renderer pipeline.
- **Lab rule**: every exercise must exceed the individual pass threshold.

---

[[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]] | [[notes/lectures/realtimegraphics/02_graphics_pipeline|Next: (y-02) Graphics Pipeline]]
