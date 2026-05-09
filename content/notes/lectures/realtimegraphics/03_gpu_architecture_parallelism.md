---
title: "03_gpu_architecture — Hardware Parallelism & Modern Pipelines"
tags:
  - rtg
  - gpu
  - architecture
  - simd
  - parallelism
date: 2026-04-14
---
[[notes/lectures/realtimegraphics/02_graphics_pipeline|Back: (y-02) Graphics Pipeline]] | [[notes/lectures/realtimegraphics/04_cg_primer|Next: (y-04) Graphics Primer]]

## Mental Model First: The Scheduling Game

- **GPUs Hate Waiting**: The ALUs (math units) are very fast, but memory access is very slow. The GPU's primary trick is **Latency Hiding**—switching to a different group of threads the moment one group has to wait for data.
- **Lockstep Execution**: Threads are not independent. They move in "Warps" or "Wavefronts." If one thread in a warp takes an `if` branch and another takes the `else`, the hardware has to execute both paths for the whole warp (**Divergence**).
- **The Unified Model**: Modern GPUs don't have "vertex cores" and "pixel cores" separately. They have **Generic Processing Cores** that can do any job, allowing for dynamic load balancing.

---

## 1. Hardware Architectures: SIMD vs. SIMT

### SIMD (Single Instruction, Multiple Data)
![[pictures/realtimegraphics/03/L03_Pg-08.jpg]]

<p class="image-caption">L03_Pg-08: SIMD uses a single instruction to operate on a vector of data at once (e.g., 4 floats).</p>

- **Level**: Low-level hardware vector units.
- **Execution**: A single ALU operation on a vector register.

### SIMT (Single Instruction, Multiple Threads)
![[pictures/realtimegraphics/03/L03_Pg-11.jpg]]

<p class="image-caption">L03_Pg-11: SIMT is a higher-level abstraction where thousands of threads execute the same program in parallel.</p>

- **Warp (NVIDIA)**: 32 threads.
- **Wavefront (AMD)**: 64 threads.
- **Concept**: Each thread has its own register state, but they all share a single **Program Counter**. They execute in lockstep.

---

## 2. The Cost of Divergence

![[pictures/realtimegraphics/03/L03_Pg-12.jpg]]

<p class="image-caption">L03_Pg-12: Branch Divergence forces the GPU to execute both paths of an 'if/else', masking out the inactive threads. Performance drops by 50% here.</p>

### 💡 Intuition: The Bus Analogy
Imagine a bus (Warp) of 32 people. At a fork in the road:
- **No Divergence**: Everyone wants to go Left. The bus turns Left. Speed: 100%.
- **Divergence**: 16 people want Left, 16 want Right. The bus must drive down the Left road (16 people wait), then *backup*, and drive down the Right road (the other 16 people wait). Speed: 50%.

---

## 3. Latency Hiding (The GPU's Secret)

![[pictures/realtimegraphics/03/L03_Pg-35.jpg]]

<p class="image-caption">L03_Pg-35: The GPU scheduler keeps thousands of threads "in flight" so it can always find work to do while others wait for memory.</p>

- **Memory Stall**: Accessing VRAM takes ~400–800 cycles.
- **Solution**: The scheduler instantly context-switches to a ready Warp. Because registers are stored on-chip for all active warps, this switch is **zero-overhead**.

---

## 4. Modern Pipeline Stages

### Mesh Shaders (The Future)
![[pictures/realtimegraphics/03/L03_Pg-48.jpg]]

<p class="image-caption">L03_Pg-48: Mesh shaders replace the old fixed-function geometry stages with a more flexible, compute-like model using Meshlets.</p>

- **Task Shader**: Coarse-grained culling (LOD).
- **Mesh Shader**: Generates vertices/triangles directly.

---

## 5. Display & Buffering

### Double vs. Triple Buffering
![[pictures/realtimegraphics/03/L03_Pg-59.jpg]]

<p class="image-caption">L03_Pg-59: Double buffering prevents flickering but causes "tearing" if the swap happens mid-scanout.</p>

### Presentation Modes (Vulkan)
- **FIFO (V-Sync)**: Classic queue. Prevents tearing but limits FPS and adds latency.
- **Mailbox (Triple Buffering)**: The "Very Modern" mode. The GPU always works on the latest available back buffer. No tearing + lowest latency.

---

### Applied Exam Focus
- **SIMT Divergence**: Understand that `if/else` is not "free" on a GPU; it's serialized within a warp.
- **Latency Hiding**: Know that GPUs don't have large caches; they have **massive multithreading** to hide memory stalls.
- **Presentation Modes**: Be able to explain why **Mailbox** is the preferred mode for high-performance interactive apps.

---
[[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]]
