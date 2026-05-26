---
title: "02_graphics_pipeline  -  The GPU as a Factory"
tags:
  - rtg
  - gpu
  - pipeline
  - architecture
  - vulkan
date: 2026-05-12
---

[[notes/lectures/realtimegraphics/01_introduction|Back: (y-01) Introduction]] | [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|Next: (y-03) GPU Architecture & Parallelism]]

## Mental Model First: The Graphics Factory

- **Rasterization is object order.** The renderer visits objects, projects their primitives, and lets covered pixels fall out of the pipeline.
- **The pipeline mixes fixed and programmable work.** Fixed stages are fast and specialized; shader stages are flexible and developer-controlled.
- **APIs describe work, not pixels directly.** Modern APIs make applications declare resources, commands, state, synchronization, and presentation.
- **A frame is a production line.** Geometry enters as buffers; final color and depth values leave through the framebuffer.

---

## 1. Image Synthesis Orders

![[pictures/realtimegraphics/02/L02_Pg-02.jpg]]

<p class="image-caption">L02_Pg-02: Object-order rasterization projects primitives to the image; image-order methods trace from pixels into the scene.</p>

Rasterization asks: **which pixels does this object cover?** Ray tracing asks: **what object does this pixel see?** Real-time graphics historically relies on rasterization because object-order triangle processing maps extremely well to hardware.

### Rasterization Hardware

![[pictures/realtimegraphics/02/L02_Pg-03.jpg]]

<p class="image-caption">L02_Pg-03: Real-time hardware is optimized around rasterizing simple primitives, especially triangles.</p>

The triangle is the default primitive because it is planar, simple to interpolate over, and efficient to process in parallel.

---

## 2. Essential Graphics Pipeline

![[pictures/realtimegraphics/02/L02_Pg-05.jpg]]

<p class="image-caption">L02_Pg-05: The essential pipeline: input assembly, vertex shading, rasterization, fragment shading, and raster operations.</p>

The pipeline is a dependency chain. Each stage consumes the previous stage's output, so the slowest stage limits frame throughput.

### Input Assembler

![[pictures/realtimegraphics/02/L02_Pg-06.jpg]]

<p class="image-caption">L02_Pg-06: The input assembler reads vertex/index buffers and assembles points, lines, or triangles.</p>

The input assembler is fixed-function. It reads buffers, applies index order, and forms primitives for the programmable vertex stage.

### Vertex Shader

![[pictures/realtimegraphics/02/L02_Pg-07.jpg]]

<p class="image-caption">L02_Pg-07: The vertex shader transforms positions and forwards per-vertex attributes.</p>

The vertex shader runs once per vertex invocation. Its most important output is clip-space position; it can also pass attributes such as color, normals, or texture coordinates.

---

## 3. Rasterization and Pixel Work

### Rasterizer

![[pictures/realtimegraphics/02/L02_Pg-08.jpg]]

<p class="image-caption">L02_Pg-08: The rasterizer finds covered samples and interpolates vertex attributes across each primitive.</p>

Rasterization converts continuous triangle coverage into fragments. Attribute interpolation bridges the vertex and fragment stages.

### Fragment Shader

![[pictures/realtimegraphics/02/L02_Pg-09.jpg]]

<p class="image-caption">L02_Pg-09: The fragment shader computes per-fragment color using interpolation, lighting, textures, and shader logic.</p>

This is where most material appearance is computed. It can be cheap, like a constant color, or expensive, like a physically based material with several texture reads.

### Raster Operations

![[pictures/realtimegraphics/02/L02_Pg-10.jpg]]

<p class="image-caption">L02_Pg-10: Raster operations resolve depth, blending, stencil, and final writes into framebuffer attachments.</p>

Raster operations decide whether a fragment becomes a final pixel value. Multiple fragments can compete for the same pixel, so depth and blending matter here.

---

## 4. Graphics APIs

![[pictures/realtimegraphics/02/L02_Pg-12.jpg]]

<p class="image-caption">L02_Pg-12: A graphics API is hardware independent at the interface, but implemented by hardware-specific drivers.</p>

APIs such as Vulkan, OpenGL, OpenGL ES, and DirectX define how applications talk to graphics hardware. The API itself is portable; the driver implementation is vendor-specific.

### Vulkan Handles

![[pictures/realtimegraphics/02/L02_Pg-18.jpg]]

<p class="image-caption">L02_Pg-18: Vulkan exposes explicit handles such as instance, physical device, logical device, queues, and swap-chain objects.</p>

Vulkan makes many objects explicit:

- **Instance**: connection to the Vulkan runtime.
- **Physical device**: the actual GPU.
- **Logical device**: the application's interface to that GPU.
- **Queues**: ordered submission targets for work.

### Draw Calls

![[pictures/realtimegraphics/02/L02_Pg-19.jpg]]

<p class="image-caption">L02_Pg-19: Draw calls specify primitive type, buffers, offsets, and counts for GPU work.</p>

A draw call is not "draw this object" in a high-level sense. It is a compact command that tells the GPU which buffers, states, and primitive ranges to process.

---

## 5. Resources, Descriptors, and State

### Resources

![[pictures/realtimegraphics/02/L02_Pg-24.jpg]]

<p class="image-caption">L02_Pg-24: Resources are GPU-memory data objects such as buffers and images.</p>

Resources hold the data the GPU reads or writes: vertex buffers, index buffers, textures, storage buffers, render targets, and depth buffers.

### Resource Descriptors

![[pictures/realtimegraphics/02/L02_Pg-25.jpg]]

<p class="image-caption">L02_Pg-25: Descriptors tell shaders where resources live and how they may be used.</p>

Descriptors are the bridge between shader code and GPU memory. Without them, a shader has no stable way to locate textures, buffers, or samplers.

### Pipeline State Object

![[pictures/realtimegraphics/02/L02_Pg-28.jpg]]

<p class="image-caption">L02_Pg-28: A pipeline state object packages shaders and fixed-function render configuration into one immutable state bundle.</p>

Modern APIs prefer explicit immutable state. This reduces hidden driver work during rendering, but shifts responsibility to the application.

### CPU Main Loop

![[pictures/realtimegraphics/02/L02_Pg-29.jpg]]

<p class="image-caption">L02_Pg-29: Each frame acquires a swap-chain image, submits rendering commands, and presents the result.</p>

The CPU side of a frame is a loop of acquire, record/submit commands, synchronize, and present. Poor CPU-side organization can bottleneck the GPU.

### Command Buffers

![[pictures/realtimegraphics/02/L02_Pg-31.jpg]]

<p class="image-caption">L02_Pg-31: Command buffers collect rendering commands so they can be validated, reused, and submitted efficiently.</p>

Command buffers make API calls batchable. The application records a sequence once or per frame, and the GPU consumes that sequence asynchronously.

### 🧠 Deep Dive: Synchronization Primitives

Because the GPU executes commands asynchronously while the CPU keeps building the next frame, modern APIs expose explicit synchronization objects:

- **Fences**: GPU-to-CPU signalling. The CPU waits on a fence to know that the GPU has finished a submitted batch (e.g. before recycling a command buffer or reading back a screenshot).
- **Semaphores**: GPU-to-GPU signalling between queues or between submission boundaries. Standard frame setup uses an *image-available* semaphore (the swap-chain image is acquired and ready to render into) and a *render-finished* semaphore (rendering is done and the image is safe to present).
- **Barriers**: pipeline-stage and memory ordering inside one command buffer. They tell the driver when one stage's writes must be visible to a later stage's reads, and which cache flushes/invalidations are required.

The cost of getting this wrong: hangs, tearing, frames presented before they finished rendering, or stale data being read by the next frame. Validation layers exist precisely because the explicit-sync model is unforgiving.

---

## 6. Shader Programming Basics

### Anatomy of a GLSL Shader

![[pictures/realtimegraphics/02/L02_Pg-36.jpg]]

<p class="image-caption">L02_Pg-36: GLSL shaders declare uniforms, varying inputs, outputs, and the main function executed by each invocation.</p>

Shader programs run many times: once per vertex, per fragment, or per compute invocation depending on the stage.

### Built-In Variables

![[pictures/realtimegraphics/02/L02_Pg-37.jpg]]

<p class="image-caption">L02_Pg-37: Built-in variables connect shader code to fixed-function pipeline expectations.</p>

Examples include vertex IDs, instance IDs, clip-space positions, and fragment coordinates. They are the contract between programmable code and pipeline hardware.

### Minimal Vertex Shader

![[pictures/realtimegraphics/02/L02_Pg-39.jpg]]

<p class="image-caption">L02_Pg-39: A minimal vertex shader transforms a vertex position by an MVP matrix and forwards color.</p>

The essential vertex shader job is:

$$gl\_Position = MVP \cdot position$$

### Minimal Fragment Shader

![[pictures/realtimegraphics/02/L02_Pg-42.jpg]]

<p class="image-caption">L02_Pg-42: A minimal fragment shader writes interpolated color to the framebuffer.</p>

The fragment shader decides the output color for each surviving fragment. Later lectures make this stage much richer through texturing and shading models.

---

### Applied Exam Focus

- **Pipeline order**: input assembler -> vertex shader -> rasterizer -> fragment shader -> raster operations.
- **Fixed vs programmable**: know which stages are hardware-controlled and which run shader code.
- **Rasterization vs ray tracing**: object-order projection vs image-order visibility queries.
- **Vulkan explicitness**: resources, descriptors, command buffers, and pipeline state are explicit objects.

## Self-Check

1. What is the difference between object-order and image-order image synthesis?

> [!success]- Answer
> Object-order rasterization asks, for each primitive, which pixels it covers, and produces fragments for those pixels. Image-order ray tracing asks, for each pixel, what the closest surface along the viewing ray is. Real-time hardware is optimized around the first because triangle rasterization parallelizes very well.

2. List the five stages of the essential graphics pipeline in order, identifying which are fixed-function and which are programmable.

> [!success]- Answer
> Input assembler (fixed), vertex shader (programmable), rasterizer (fixed), fragment shader (programmable), raster operations (fixed). The programmable stages run shader code; the fixed stages perform standard hardware-driven work like primitive assembly, coverage, interpolation, depth tests, and blending.

3. What is a draw call, and why is it not the same as "draw this object"?

> [!success]- Answer
> A draw call is a compact command that tells the GPU which buffers, descriptor bindings, pipeline state, and primitive range to process. The application has to set up state, bind resources, and supply geometry separately; the draw call only kicks off processing for that configured slice of work.

4. What is a Pipeline State Object, and why do modern APIs prefer immutable state?

> [!success]- Answer
> A Pipeline State Object packages all shaders plus fixed-function configuration into one immutable bundle that the driver compiles once. This avoids per-draw driver work to chase state changes, which used to be a major CPU bottleneck in older APIs. The application takes on responsibility for organizing its state up front.

5. Write the minimal vertex-shader job, and describe how its output reaches the fragment shader.

> [!success]- Answer
> The minimum is $gl\_Position = MVP \cdot position$, transforming a vertex position into clip space. The rasterizer takes these clip-space positions, finds covered samples, and interpolates the vertex outputs (varyings) across each primitive; the fragment shader then runs once per resulting fragment with those interpolated values.

6. What is the role of descriptors in modern graphics APIs, and what problem do they solve?

> [!success]- Answer
> Descriptors are typed handles that connect shader code to GPU memory resources (buffers, textures, samplers). Without them the shader cannot locate where its inputs live, because the application may bind many different resources to many different shader slots. Modern APIs group descriptors into **descriptor sets** (or tables) that can be bound in bulk, so updating one set rebinds many resources cheaply  -  a major source of CPU overhead in older bindful APIs.

7. Why are graphics queues, present semaphores, and fences needed for a single frame in Vulkan?

> [!success]- Answer
> A frame is a producer-consumer pipeline: the CPU records commands, the GPU executes them, and the display swap chain presents the result. Fences tell the CPU when the GPU has finished using a command buffer so it can be recycled. Semaphores order GPU work between queues  -  an image-available semaphore signals when the swap chain image is safe to render into, and a render-finished semaphore tells the present queue that the image is ready to display. Without them the CPU could overwrite in-flight command buffers, or frames could be presented before they finished rendering.

8. What is a draw call's actual cost in modern explicit APIs, and what made it expensive in older APIs?

> [!success]- Answer
> In modern APIs (Vulkan, DX12) the draw call itself is cheap because state is pre-baked into a PSO and resources are pre-bound through descriptor sets; the driver just dispatches the GPU work. In older APIs (OpenGL, DX11) every draw call could trigger hidden driver work  -  shader recompilation for new state combinations, descriptor reshuffling, validation  -  which serialized CPU work and bottlenecked the frame. Modern APIs trade more application complexity for predictable per-draw cost and multithreaded recording.

---

[[notes/lectures/realtimegraphics/01_introduction|Back: (y-01) Introduction]] | [[notes/lectures/realtimegraphics/index|(y) Back to RTG Index]] | [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|Next: (y-03) GPU Architecture & Parallelism]]
