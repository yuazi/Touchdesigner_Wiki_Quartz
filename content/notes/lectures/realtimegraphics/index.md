---
title: (y) Real-Time Graphics
tags:
  - notes
  - rtg
  - master
date: 2026-04-14
---

> [!abstract] Course Summary
> How real-time CGI actually gets computed. Covers the modern graphics pipeline, GPU hardware, and advanced techniques like global illumination and hardware raytracing.

## Lecture Topics

- [[notes/lectures/realtimegraphics/01_introduction|(y-) 01_introduction]]: Why Real-Time Graphics? Course overview and lab exercises.
- [[notes/lectures/realtimegraphics/02_graphics_pipeline|(y-) 02_graphics_pipeline]]: GPU history, architecture, and the "Shoe Factory" analogy.
- [[notes/lectures/realtimegraphics/03_gpu_architecture_parallelism|(y-) 03_gpu_architecture_parallelism]]: Detailed pipeline stages and modern API vs. OpenGL.
- [[notes/lectures/realtimegraphics/04_cg_primer|(y-) 04_cg_primer]]: Math foundations, transformations, and shading models.
- [[notes/lectures/realtimegraphics/05_shading_models|(y-) 05_shading_models]]: BRDFs, Lambert, Phong, Blinn-Phong, Cook-Torrance, Disney BRDF.
- [[notes/lectures/realtimegraphics/06_textures|(y-) 06_textures]]: Texture mapping, filtering, multipass rendering, environment mapping, and bump/normal mapping.
- [[notes/lectures/realtimegraphics/07_deferred_shading|(y-) 07_deferred_shading]]: Deferred rendering, G-Buffers, deferred lighting, light volumes, visibility buffers, and normal encoding.
- [[notes/lectures/realtimegraphics/08_special_effects|(y-) 08_special_effects]]: Postprocessing pipeline, separable Gaussian, bloom, depth of field, bilateral filters, edge detection, anti-aliasing (SSAA/MSAA/MLAA/TAA), motion blur, lens flare, billboards, particle systems.
- [[notes/lectures/realtimegraphics/09_semi_global_illumination|(y-) 09_semi_global_illumination]]: Semi-global illumination, reflections, transparency/order-independent transparency, shadow techniques, and ambient occlusion.
- [[notes/lectures/realtimegraphics/10_global_illumination|(y-) 10_global_illumination]]: Real-time global illumination, radiosity, photon mapping, instant radiosity, reflective shadow maps, illumination probes, PRT, hybrid caching.
- [[notes/lectures/realtimegraphics/11_gpu_raytracing|(y-) 11_gpu_raytracing]]: GPU raytracing pipeline, RT cores, the five ray shader types, ray payload/attributes, hybrid rendering, raytraced shadows/AO/reflections, denoising.
- [[notes/lectures/realtimegraphics/12_hdr|(y-) 12_hdr]]: High dynamic range rendering, tone mapping operators, exposure and the human visual system, bloom, and HDR display output.
- [[notes/lectures/realtimegraphics/13_lod|(y-) 13_lod]]: Levels of detail, static/reactive/predictive selection, switching (popping, blending, geomorphing), simplification operators, quadric error metric, continuous/view-dependent/terrain LOD.
- [[notes/lectures/realtimegraphics/14_visibility|(y-) 14_visibility]]: Output-sensitive rendering, frustum/backface/occlusion culling, BVH, PVS classification, occluder fusion, cells and portals, hierarchical depth buffer, region visibility, virtual occluders.
- [[notes/lectures/realtimegraphics/15_virtual_textures|(y-) 15_virtual_textures]]: Clipmaps, virtual memory for textures, tiled virtual textures, tile fault pass, geometry clipmaps, and Nanite's combination of all acceleration techniques.
- **Compute Shaders**: General-purpose computation on the GPU.

## Exercises

1. **Basic Rendering**: Indexed buffers, quads, rotating cubes, and texturing.
2. **Screen-Space Post-Processing**: Bilateral upscaling and anti-aliasing techniques.
3. **Particle System**: Billboards, GPU instancing, and compute shaders.
4. **Advanced Topics**: Hardware Raytracing or Screen-Space Ambient Occlusion (SSAO).

## Resources

- **Main Book**: _Real-Time Rendering, 4th Edition_ by Tomas Akenine-Möller et al.
- **Engine**: [DiligentEngine](https://github.com/DiligentGraphics/DiligentEngine): cross-platform rendering engine.
- **Lecturer**: Dieter Schmalstieg

---

[[notes/index|(y) Back to Notes]]
