---
title: "02_gpu_overview — The GPU as a Factory"
tags:
  - rtg
  - gpu
  - hardware
  - architecture
date: 2026-04-14
---
[[notes/realtimegraphics/01_introduction|Back: (y-01) Introduction]] | [[notes/realtimegraphics/03_gpu_pipeline|Next: (y-03) Graphics Pipeline]]

## Mental Model: Latency vs. Throughput

- **CPU = Formula 1 Car**: Low latency. If you need a single result *right now*, the CPU is king. It's built to handle complex branching and rapid changes in execution flow.
- **GPU = Massive Cargo Train**: High throughput. It takes a while to get moving (high latency to start a kernel), but once it's going, it moves millions of data points per second.
- **The Magic Trick (Latency Hiding)**: GPUs don't actually compute faster; they are just better at "hiding" the time spent waiting for memory by switching to another thread instantly.

---

## Detailed: The Shoe Factory Analogy

To understand why a GPU is different from a CPU, let's revisit the **factory floor**:

| Concept | Factory Equivalent | GPU Hardware |
| :--- | :--- | :--- |
| **Control Unit** | The Manager / Dispatcher | Command Processor |
| **Worker Threads** | Thousands of simple workers | CUDA Cores / Stream Processors |
| **Specialists** | Master craftsmen for specific tasks | RT Cores, Tensor Cores, Texture Units |
| **VRAM** | The onsite warehouse (fast but limited) | L1/L2 Cache & Global Memory (HBM/GDDR) |
| **PCIe Bus** | The delivery truck from the main office | Memory Controller & PCIe Interface |

### Why thousands of simple workers?
In a factory, if one worker is waiting for a delivery of leather (a memory fetch from VRAM), they don't sit idle. The manager simply tells them to step aside and lets another worker (thread) take their place at the workbench. This is **Hardware Multithreading**. 

With 10,000 workers, even if 9,000 are waiting for "leather," 1,000 are always working. This is how a GPU achieves **near-100% utilization**.

---

## The Architecture Evolution

Historically, GPUs were **Fixed-Function**. You couldn't "program" them; you just turned knobs (e.g., "set light 1 to red").

1. **Fixed Function (Pre-2000s)**: No shaders. Just hardwired logic for triangles and simple lighting.
2. **Programmable Shaders (2001 - DX8/Vulkan)**: The introduction of **Vertex** and **Pixel (Fragment)** shaders. At first, they had different hardware.
3. **Unified Architecture (Late 2000s - Present)**: Today, any "core" can be a vertex shader, a fragment shader, or a compute shader. This allows the GPU to balance its workload dynamically.
4. **Modern Specialized Hardware (2018 - Present)**:
   - **RT Cores**: Specialized logic for Ray-Triangle intersection.
   - **Tensor Cores**: Specialized logic for matrix multiplication (AI/Deep Learning).

---

## GPGPU: The Shift to General Computation

Around 2007 (with the release of CUDA), developers realized that a GPU is just a massive array of floating-point processors. 

- **Beyond Graphics**: If you can frame a problem (like protein folding, weather simulation, or training a Neural Network) as "do the same operation on many numbers," the GPU will outperform the CPU by 100x.
- **Compute Shaders**: In this course, we'll use Compute Shaders to run physics (particle systems) directly on the GPU, avoiding the slow "trip" back to the CPU.

---

## GPU Memory Hierarchy

VRAM is not like system RAM. It's much faster but has higher latency.
- **Global Memory (GDDR6/7)**: The bulk storage. High bandwidth (~1 TB/s) but takes hundreds of cycles to access.
- **Shared Memory / L1 Cache**: Extremely fast, per-block memory. Used for communication between threads.
- **Registers**: The fastest memory, local to each thread.

**💡 Pro Tip**: The biggest performance bottleneck in graphics is rarely the "math." It's almost always **Memory Bandwidth**. Moving data is expensive; computing on it is cheap.

---
[[notes/realtimegraphics/index|(y) Back to RTG Index]]
