---
title: "01_introduction — The Challenge of Real-Time Graphics"
tags:
  - rtg
  - graphics
  - introduction
  - throughput
  - master
date: 2026-04-14
---
[[notes/realtimegraphics/index|Back to RTG Index]] | [[notes/realtimegraphics/02_graphics_pipeline|Next: (y-02) Graphics Pipeline]]

## Mental Model First

- **Graphics is a Throughput Problem**: Unlike a CPU which is a "sprint" for low latency, a GPU is a "marathon" for massive data-parallel throughput.
- **The Magic of 60Hz**: At 60 frames per second, the illusion of motion becomes solid to the human eye. To achieve this at 4K resolution, you have only **16.6 milliseconds** to compute over 8 million pixels.
- **Abstraction is Key**: We don't write raw Vulkan because it's too much boilerplate; we use a modern abstraction (Diligent Engine) to focus on the **algorithms** rather than the **API plumbing**.

## Introduction

**Real-Time Graphics** is about generating imagery so fast that the user can interact with it. 

I use the [[work/slidelink|SlideLink]] tool I built to automatically align these notes with the original lecture slides.

---

## The "Numbers Problem" (Math)

![[L01_Pg-08.jpg]]

<p class="image-caption">L01_Pg-08: The sheer volume of data is the primary engineering challenge in real-time rendering.</p>

To understand why we need GPUs, look at the math for a modern 4K display:

- **Resolution**: $3840 \times 2160 = 8.3$ Million pixels.
- **Refresh Rate**: 60 Hz (standard) or 144 Hz (gaming).
- **Anti-Aliasing**: 4x Multisamples per pixel.

$$8.3 \text{M pixels} \times 60 \text{ frames/sec} \times 4 \text{ samples} \approx \mathbf{2 \text{ Billion samples per second}}$$

Each sample requires multiple math operations (lighting, texturing, blending). A standard CPU core cannot handle billions of complex operations per second; we need **massive parallelization**.

### 💡 Intuition: Throughput vs. Latency

- **CPU (Latency-Oriented)**: A high-speed delivery truck. Fast at moving one package, but carries only a few at a time. If the truck stops for a red light (memory stall), everything waits.
- **GPU (Throughput-Oriented)**: A massive freight train. Much slower than a truck, but carries 10,000 packages. Even if the train slows down, the total number of packages delivered per hour is enormous.

---

## Three Decades of Progress (The Hardware Shift)

![[L01_Pg-07.jpg]]

<p class="image-caption">L01_Pg-07: Visualization of the 30-year jump from supercomputers to consumer hardware.</p>

| Feature | **1992: SGI RealityMonster** | **2026: GeForce RTX 5090** |
| :--- | :--- | :--- |
| **Form Factor** | 8 Racks (Room-sized) | Single PCIe Card |
| **Power** | Megawatts | ~450–600 Watts |
| **Cost** | ~$500,000 (1992 money) | ~$1,500–2,500 |
| **Performance** | ~80 Million Triangles/sec | ~2–4 **Billion** Triangles/sec |

---

## Lab Exercises: The Roadmap to a Renderer

![[L01_Pg-14.jpg]]

<p class="image-caption">L01_Pg-14: The 4-step journey you will take in the lab to build a modern renderer.</p>

The lab is managed by tutors **Fabian Schmierer**, **Yiangyu Wang**, and **Xuening Tian**.
- **Requirement**: You must pass every exercise with **> 60% individually**.

1. **Basic Rendering**:
   - **Indexed Buffers**: $N$ vertices, but $3N$ indices. Saves memory by reusing vertices.
   - **MVP Transformations**: Moving from Model Space $\to$ World Space $\to$ View Space $\to$ Clip Space.
2. **Screen-Space Post-Processing**:
   - **Bilateral Upscaling**: Using edge-detection to scale images without blurring.
   - **MSAA**: Using sub-pixel samples to fight the "jaggies."
3. **Particle Systems**:
   - **GPU Instancing**: Drawing 100,000 leaves or particles in a single draw call.
   - **Compute Shaders**: Moving the physics simulation off the CPU.
4. **Final Project**:
   - **Hardware Raytracing**: Using the RT cores for reflections.
   - **SSAO**: Screen Space Ambient Occlusion for realistic "soft shadows" in corners.

---

## ⚠️ Common Pitfalls: The Bottleneck Trap

Real-time graphics performance is a game of **bottlenecks**. You can have the fastest GPU in the world, but your framerate will still be low if:
1. **CPU Bound**: The CPU is too slow at preparing the command buffers (Draw Calls).
2. **Memory Bound**: You are trying to move too many textures from VRAM to the ALUs (Bandwidth).
3. **Fill-Rate Bound**: You are drawing too many transparent objects on top of each other (**Overdraw**).

### Applied Exam Focus
- **Throughput Calculation**: Be able to calculate the required gigapixels/sec for a given resolution and refresh rate.
- **SGI vs. GPU Comparison**: Understand why specialized hardware (fixed-function rasterizers) won over general-purpose supercomputers.
- **Course Administration**: 60% individual pass requirement for exercises; submissions via the university GitHub.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
