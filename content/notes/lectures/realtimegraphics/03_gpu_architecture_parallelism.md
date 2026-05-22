---
title: "03_gpu_architecture — Hardware Parallelism & Modern Pipelines"
tags:
  - rtg
  - gpu
  - architecture
  - simd
  - parallelism
date: 2026-05-12
---

[[notes/lectures/realtimegraphics/02_graphics_pipeline|Back: (y-02) Graphics Pipeline]] | [[notes/lectures/realtimegraphics/04_cg_primer|Next: (y-04) Graphics Primer]]

## Mental Model First: The Scheduling Game

- **GPUs win by keeping work in flight.** They tolerate long memory latency by switching to other ready work.
- **Throughput beats single-thread latency.** A GPU core is not trying to finish one task fastest; it is trying to finish many similar tasks per unit time.
- **Divergence wastes lanes.** When threads in a lockstep group disagree on control flow, inactive lanes wait.
- **Modern pipelines are flexible.** Newer stages such as mesh shaders move more geometry processing into programmable, compute-like units.

---

## 1. Goals for Fast Execution

![[pictures/realtimegraphics/03/L03_Pg-02.jpg]]

<p class="image-caption">L03_Pg-02: Fast GPU execution means maximizing parallelism, hiding latency, minimizing memory traffic, and avoiding unnecessary work.</p>

This slide is the performance model for the whole lecture. A GPU becomes slow when it cannot find enough independent work, waits on memory too often, or spends cycles on fragments and primitives that will not matter.

### Hardware Characteristics

![[pictures/realtimegraphics/03/L03_Pg-03.jpg]]

<p class="image-caption">L03_Pg-03: GPUs combine fixed-function units with programmable shader stages handled by symmetric multiprocessors.</p>

The hardware is mixed:

- fixed-function units for common high-throughput tasks,
- programmable shader units for developer-defined work,
- schedulers and command processors to feed the machine.

---

## 2. SIMD, SIMT, and Divergence

### SIMD Execution

![[pictures/realtimegraphics/03/L03_Pg-08.jpg]]

<p class="image-caption">L03_Pg-08: SIMD amortizes instruction management across many arithmetic lanes.</p>

SIMD means one instruction is applied to multiple data lanes. This is efficient when lanes do the same thing, but it becomes awkward when lanes need different control flow.

### Branch Divergence

![[pictures/realtimegraphics/03/L03_Pg-12.jpg]]

<p class="image-caption">L03_Pg-12: Divergent branches force a group to execute both paths with inactive lanes masked off.</p>

If half a warp takes the `if` path and half takes the `else` path, the hardware often serializes the paths. The branch is correct, but useful throughput drops.

### SIMT Avoids Stalling

![[pictures/realtimegraphics/03/L03_Pg-13.jpg]]

<p class="image-caption">L03_Pg-13: SIMT exposes many logical threads so the scheduler can swap work when one group stalls.</p>

SIMT presents many threads to the programmer, but schedules them in groups. The key benefit is latency hiding: while one group waits on memory, another group can run.

### 💡 Intuition: Occupancy as Insurance

High occupancy does not automatically mean high performance, but low occupancy removes the scheduler's options. If there are not enough resident groups, memory stalls become visible as idle hardware.

---

## 3. GPU Front End and Work Feeding

### Command Processor

![[pictures/realtimegraphics/03/L03_Pg-19.jpg]]

<p class="image-caption">L03_Pg-19: The command processor consumes the command stream and feeds the downstream GPU pipeline.</p>

The command processor is the front end. It handles state changes, command stream interpretation, memory transfers, and the launch of graphics or compute work.

### Scheduler

![[pictures/realtimegraphics/03/L03_Pg-20.jpg]]

<p class="image-caption">L03_Pg-20: The scheduler manages GPU work so available units receive ready tasks.</p>

Schedulers are responsible for keeping execution units busy while respecting dependencies and available resources.

### Vertex Batch Processing

![[pictures/realtimegraphics/03/L03_Pg-23.jpg]]

<p class="image-caption">L03_Pg-23: Vertex batch processing exploits shared vertices so repeated work can be reduced.</p>

Meshes reuse vertices across triangles. Batching and caching prevent the vertex shader from doing the same transformation more often than necessary.

---

## 4. Programmable Geometry Evolution

### Mesh Shaders and Meshlets

![[pictures/realtimegraphics/03/L03_Pg-24.jpg]]

<p class="image-caption">L03_Pg-24: Mesh shaders can output compact meshlets directly, replacing parts of the older fixed geometry path.</p>

Mesh shaders let applications organize geometry into small chunks that can be culled, generated, and emitted more flexibly than the classic vertex/geometry pipeline.

### Historical Graphics Pipeline

![[pictures/realtimegraphics/03/L03_Pg-28.jpg]]

<p class="image-caption">L03_Pg-28: The complete historical graphics pipeline includes tessellation and geometry shader stages.</p>

The historical pipeline contains many optional geometry stages. Understanding it helps explain both legacy APIs and why newer APIs try to simplify or replace some stages.

### Tessellation

![[pictures/realtimegraphics/03/L03_Pg-29.jpg]]

<p class="image-caption">L03_Pg-29: Tessellation subdivides patches into finer geometry under programmable control.</p>

Tessellation can add geometric detail based on distance, curvature, or screen size. It is powerful but can become expensive if it generates more primitives than the later pipeline can handle.

---

## 5. Rasterization, Depth, and Fragment Cost

### Rasterizer

![[pictures/realtimegraphics/03/L03_Pg-36.jpg]]

<p class="image-caption">L03_Pg-36: Rasterization turns triangles into covered samples and interpolated attributes.</p>

Rasterization is fixed-function, but its output volume depends heavily on primitive size and screen coverage.

### Variable Rasterizer Bandwidth

![[pictures/realtimegraphics/03/L03_Pg-37.jpg]]

<p class="image-caption">L03_Pg-37: Large and tiny primitives stress the rasterizer differently.</p>

Large triangles create many fragments. Tiny triangles can waste setup work and underutilize the hardware. Both extremes can become bottlenecks.

### Depth Buffer

![[pictures/realtimegraphics/03/L03_Pg-39.jpg]]

<p class="image-caption">L03_Pg-39: The depth buffer keeps the closest fragment per pixel without sorting all geometry.</p>

The z-buffer is an order test. It avoids sorting triangles globally and lets the GPU reject hidden fragments locally.

### Early-Z and Hierarchical Depth

![[pictures/realtimegraphics/03/L03_Pg-41.jpg]]

<p class="image-caption">L03_Pg-41: Hierarchical depth stores coarse depth summaries so hidden tiles can be rejected early.</p>

Early-Z is valuable because fragment shading can be expensive. Rejecting invisible fragments before shading saves texture reads, math, and bandwidth.

### Fragment Shading and ROP

![[pictures/realtimegraphics/03/L03_Pg-42.jpg]]

<p class="image-caption">L03_Pg-42: Fragment work is launched in groups, then raster operations merge visible results into the framebuffer.</p>

Fragment shading is programmable; ROP is fixed-function. The boundary matters because blending and depth writes obey primitive order and framebuffer rules.

---

## 6. Display Synchronization

### Display Synchronization

![[pictures/realtimegraphics/03/L03_Pg-48.jpg]]

<p class="image-caption">L03_Pg-48: Rendering must synchronize with display scan-out to avoid tearing and stale buffers.</p>

The display is continuously scanning out an image while the GPU is producing future images. Buffering separates those two timelines.

### Presentation Modes

![[pictures/realtimegraphics/03/L03_Pg-56.jpg]]

<p class="image-caption">L03_Pg-56: Presentation modes trade tearing, latency, and frame pacing.</p>

- **Immediate**: low latency, but can tear.
- **FIFO**: vertical sync style queue; no tearing, but can add latency.
- **Mailbox**: keeps the newest completed frame; useful for interactive workloads.

---

## 7. Driver and Modern API Direction

### Graphics Driver Architecture

![[pictures/realtimegraphics/03/L03_Pg-57.jpg]]

<p class="image-caption">L03_Pg-57: Driver architecture separates user-mode command preparation from kernel-mode system interaction.</p>

Drivers batch, validate, translate, and submit commands. Modern APIs try to make this work more predictable by exposing more responsibility to the application.

### Modern API Design

![[pictures/realtimegraphics/03/L03_Pg-65.jpg]]

<p class="image-caption">L03_Pg-65: Vulkan, DirectX 12, and Metal expose more explicit control and allow CPU-side multithreading.</p>

The tradeoff is clear: explicit APIs reduce hidden driver overhead, but require applications to manage more details correctly.

### Very Modern APIs

![[pictures/realtimegraphics/03/L03_Pg-68.jpg]]

<p class="image-caption">L03_Pg-68: Newer API directions move toward bindless resources and more pointer-like access models.</p>

Bindless and pointer-like models reduce the cost of binding many resources, but require careful memory and lifetime management.

---

### Applied Exam Focus

- **Latency hiding**: explain why many resident warps/wavefronts hide memory stalls.
- **Divergence**: understand why different branch paths inside one group serialize.
- **Early-Z**: know why rejecting hidden fragments before shading matters.
- **Modern APIs**: explain the tradeoff between explicit control and boilerplate.
- **Presentation**: distinguish immediate, FIFO, and mailbox behavior.

## Self-Check

1. Why do GPUs keep many warps or wavefronts resident on the same SIMT unit?

> [!success]- Answer
> When one warp stalls on a memory read, the scheduler can switch to another resident warp that has its operands ready. That latency hiding keeps the arithmetic units busy without expensive caches. The downside is that performance depends on having enough independent work to fill the slots.

2. Why does branch divergence within one warp hurt throughput?

> [!success]- Answer
> All lanes of a warp execute the same instruction in lockstep. If lanes take different sides of a branch, the warp serially executes each branch with the other lanes masked off, so the cost is the sum of both paths instead of one. Coherent branching keeps the SIMT model fast.

3. How does the z-buffer let the GPU avoid sorting all triangles globally?

> [!success]- Answer
> The depth buffer stores the closest depth seen so far at each pixel. When a new fragment arrives, the GPU compares its depth and writes the fragment only if it is closer. The comparison is local, so the rasterizer can process triangles in any order while still producing the same visible-surface result.

4. Why is early-Z (and hierarchical depth) so valuable in fragment-heavy scenes?

> [!success]- Answer
> Fragment shading can be expensive (texture reads, complex math, several lights). Rejecting a hidden fragment before it runs the shader saves all of that work. Hierarchical depth aggregates depth at tile level so entire tiles of fragments can be killed in one check, before any per-fragment work begins.

5. Compare immediate, FIFO, and mailbox presentation modes.

> [!success]- Answer
> Immediate pushes the new frame to the display as soon as it is ready, which is low-latency but can tear. FIFO queues frames and presents them in scan-out order, which avoids tearing but adds latency when the queue fills. Mailbox keeps only the most recent completed frame, dropping older ones, which gives low latency without tearing but at the cost of wasted GPU work for the dropped frames.

---

[[notes/lectures/realtimegraphics/02_graphics_pipeline|Back: (y-02) Graphics Pipeline]] | [[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]] | [[notes/lectures/realtimegraphics/04_cg_primer|Next: (y-04) Graphics Primer]]
