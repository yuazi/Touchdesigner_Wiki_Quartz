---
title: (y) Real-Time Graphics
tags:
  - notes
  - rtg
  - master
date: 2026-04-14
---

> [!abstract] Course Summary
> Focusing on the computation of computer-generated imagery (CGI) in real-time. This course covers the modern graphics pipeline, specialized hardware, and advanced rendering techniques like global illumination and hardware raytracing.

## Lecture Topics

- [[notes/realtimegraphics/01_introduction|(y-) 01_introduction]]: Why Real-Time Graphics? Course overview and lab exercises.
- [[notes/realtimegraphics/02_gpu_overview|(y-) 02_gpu_overview]]: GPU history, architecture, and the "Shoe Factory" analogy.
- [[notes/realtimegraphics/03_gpu_pipeline|(y-) 03_gpu_pipeline]]: Detailed pipeline stages and modern API vs. OpenGL.
- [[notes/realtimegraphics/04_cg_primer|(y-) 04_cg_primer]]: Math foundations, transformations, and shading models.
- **Special Effects**: 2D and 3D shading effects.
- **Global Illumination**: Shadows, high dynamic range (HDR), and realistic lighting.
- **Rendering Acceleration**: Level of Detail (LOD) and visibility algorithms.
- **Compute Shaders**: General-purpose computation on the GPU.

## Exercises

1. **Basic Rendering**: Indexed buffers, quads, rotating cubes, and texturing.
2. **Screen-Space Post-Processing**: Bilateral upscaling and anti-aliasing techniques.
3. **Particle System**: Billboards, GPU instancing, and compute shaders.
4. **Advanced Topics**: Hardware Raytracing or Screen-Space Ambient Occlusion (SSAO).

## Resources

- **Main Book**: *Real-Time Rendering, 4th Edition* by Tomas Akenine-Möller et al.
- **Engine**: [DiligentEngine](https://github.com/DiligentGraphics/DiligentEngine) — A modern cross-platform rendering engine.
- **Lecturer**: Dieter Schmalstieg

---
[[notes/index|(y) Back to Notes]]
