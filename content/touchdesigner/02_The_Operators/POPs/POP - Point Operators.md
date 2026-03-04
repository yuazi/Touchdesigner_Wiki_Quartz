---
tags:
  - touchdesigner
  - td/operators
  - operators
  - pop
date: 2026-02-11
---
[[touchdesigner/02_The_Operators/POPs/index|POPs]]

# POP - Point Operators (GPU Points)

POPs are used for high-performance GPU-based point cloud processing and particle systems. Introduced in TouchDesigner 2023+, they represent a major shift from CPU-bound SOPs to massive GPU-driven point manipulation.

## Key POPs
- **Point:** Create and manipulate point attributes.
- **Merge:** Combine multiple point streams.
- **Force:** Apply physics-like forces (gravity, turbulence).
- **Attribute:** Modify point properties (color, size, custom).
- **Render:** Convert point data into a format for TOP rendering.
- **Convert:** Transfer data between SOPs/CHOPs and POPs.

## Data Structure
Unlike SOPs, which store geometry (points, vertices, primitives) on the CPU, POPs store attributes in a **GPU-optimized buffer**. This allows for millions of points to be processed in real-time.

- **Attributes:** Each point can carry various data (Position, Color, Velocity, Normal, Mass).
- **Massive Parallelism:** Operations on points are executed simultaneously on the GPU.

## Why use POPs?
1. **Performance:** Handle millions of points where SOPs would struggle with thousands.
2. **Particle Systems:** Built-in tools for simulation and life-cycle management.
3. **Interoperability:** Easily convert point data to and from TOPs (textures) or CHOPs (signals).

## How to Use POPs

POPs are the modern, high-performance way to handle particle systems and massive point clouds on the GPU.

1. **Adding a POP:** Open the OP Create Dialog (Tab) and select the POP family (dark gray/blue tint).
2. **Getting Points In:** 
   - You typically start by converting existing data. Use a `SOP to POP` to convert 3D geometry points, or a `TOP to POP` to convert texture pixels into points (where RGB becomes XYZ position).
3. **Processing Actions:** 
   - Pass your POP sequence through modifier nodes like `Point POP` (to math on point positions) or `Force POP` (to add noise, wind, or gravity). 
   - Unlike SOPs, operations on millions of points happen almost instantly because they run on the GPU.
4. **Rendering:**
   - You can't render POPs directly with a standard Geometry COMP.
   - Use a `Render POP` or convert the POP data back into a texture (`POP to TOP`) or geometry (`POP to SOP`) depending on how you wish to visualize the point cloud. Rendering as a texture (TOP) and using instancing is usually the most performant workflow.
5. **System Requirements:** Note that POPs require a modern GPU and TouchDesigner 2023.11290 or later.
---
[[touchdesigner/02_The_Operators/POPs/index|Back to POPs]] | [[touchdesigner/02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to Main Page]]
