---
title: Rendering Basics
tags:
  - touchdesigner
  - td/rendering
  - rendering
date: 2026-02-16
---

A 3D render in TouchDesigner is the work of four cooperating ops: a **Geometry COMP** holds the geometry, a **Camera COMP** is the eye, a **Light COMP** illuminates, and a **Render TOP** runs the GPU pass that produces a 2D texture. Everything else (post-process chains, multi-pass setups, instancing, custom shaders) builds on this minimum recipe.

## The Minimum Scene

```
geo1 (Geo COMP)              ──┐
   contains: sphere1 (SOP)     │
   Material: phong1 (MAT)      │
                                │
cam1 (Camera COMP) ─────────────┤── render1 (Render TOP) ── output
                                │
light1 (Light COMP) ────────────┘
```

Drop a Geo COMP, a Camera COMP, and a Light COMP at the root. Drop a Render TOP. Set the Render TOP's parameters: Camera = `cam1`, Geometry = `*` (all geos in the same parent), Lights = `*`. Toggle the Render TOP's viewer; you should see your sphere lit from the default light position.

## Each Piece's Role

| Op              | Role                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Geo COMP**    | Holds SOPs and a Material assignment. Provides the object-level transform (Translate / Rotate / Scale).                          |
| **Camera COMP** | The viewpoint. Defines projection (perspective vs ortho), FOV, near/far clipping.                                                |
| **Light COMP**  | Illuminates. Options for Point / Cone / Distant, with shadow controls. (Ambient Light and Environment Light are separate COMPs.) |
| **Render TOP**  | The actual GPU pass. Takes Camera + Geometry + Lights and writes pixels.                                                         |

The Render TOP is the active piece; everything else is referenced by name from its parameters.

## Render TOP Key Parameters

A short list of the most-used. Full reference on the [[Render TOP]] page.

| Parameter               | What it does                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| **Camera(s)**           | "Specifies which Cameras to look through when rendering the scene." Multiple cameras supported.      |
| **Geometry**            | Pattern of Geo COMPs to include. Wildcards work: `geo* ^geo7` includes all `geo*` except `geo7`.     |
| **Lights**              | Pattern of Light COMPs to use. Same wildcard syntax.                                                 |
| **Render Mode**         | Standard, Cube Map, Fish-Eye, Dual Paraboloid, UV Unwrap, Cube Map Omnidirectional Stereo            |
| **Anti-Alias**          | 1x (off) through 32x; medium/high quality variants at 8x/16x. Higher = more graphics memory.         |
| **Pixel Format**        | Same options as any TOP. 8-bit fixed by default; 16/32-bit float for HDR and packed data.            |
| **Color Output Needed** | Disable to skip the copy from offscreen buffer to TOP texture. Save GPU memory in depth-only passes. |

## Material Assignment

A SOP doesn't carry a material; the Geo COMP it's wrapped in does. Set the Geo COMP's Material parameter to your MAT's path (e.g. `phong1`). Per the wiki: "A default material will be assigned if none is listed." That default is unlit; objects look chalk-white.

For shaded looks, drop a Phong MAT. For PBR, drop a PBR MAT and an Environment Light COMP. See [[MAT - Material Operators]].

## Multi-Pass Rendering

Two patterns:

- **Independent Render TOPs.** Drop a second Render TOP with a different Camera, different Geometry pattern, or different Lights. Composite the results downstream.
- **Render Pass TOP.** Per the wiki: "re-uses the off-screen buffer that the Render TOP creates," enabling a second pass on the same buffer without duplicating GPU memory. Render Pass TOPs chain linearly and only one per source.

Use Render Pass for matched-camera composites (e.g. solid pass + transparent pass, or geo pass + UI overlay pass) where the second pass shares the same projection.

## Anti-Aliasing

The Render TOP's Anti-Alias parameter offers 1x through 32x MSAA, with quality variants at 8x and 16x. The trade is graphics memory and GPU bandwidth: 16x roughly doubles the framebuffer footprint over 4x.

For paths where aliasing is cheaper to fix in screen space (post-blur, FXAA-style filters), 1x render + a small post-blur is sometimes a better trade. Check on the actual GPU before assuming.

## POP Render Path

For point clouds and GPU particles, the **POP Render TOP** is the dedicated render route. It draws POPs directly to a TOP without going through the Camera/Light/Geo pipeline, which is what makes million-point renders viable. See [[POP - Point Operators]].

## Common Gotchas

- **Black render.** Three usual causes: no light in the Lights pattern, the Geo COMP's Render flag is off (the small `R` flag, not the Display flag), or the camera is sitting inside the geometry looking the wrong way.
- **Wrong scale.** The default Camera is at `(0, 0, 5)` looking at the origin. A Sphere SOP at default radius 1 fills most of the frame; a 100-unit grid clips out the back. Adjust either the Camera's position or the SOP's scale.
- **Near/Far clip too tight.** Default near 0.1 / far 1000 covers most scenes, but a city-scale scene clips at the back; a microscale scene clips at the front. Check the Camera's View page.
- **Transparent MATs sort wrong.** Default Render TOP doesn't depth-sort transparent primitives. Use a separate Render TOP per transparent group, or a Render Pass with explicit ordering.
- **POP Render TOP doesn't use Camera COMP unchanged.** It has its own camera/projection settings. Don't expect a regular Camera COMP setup to feed both a Render TOP and a POP Render TOP identically.

## Related Pages

- [[touchdesigner/03_Rendering_and_Output/Cameras and Lights|Cameras and Lights]]: full breakdown of the Camera and Light COMPs
- [[Render TOP]]: full parameter reference
- [[Geo COMP]]: the wrapper for SOPs in a render scene
- [[MAT - Material Operators]]: shader options
- [[touchdesigner/03_Rendering_and_Output/Instancing|Instancing]]: drawing thousands of copies of one geo
- [[touchdesigner/03_Rendering_and_Output/Feedback Loops|Feedback Loops]]: TOP-side feedback patterns

---

> [!tip]- 📚 Learning Path · Stage 4 - Rendering & 3D · step 21 of 44
> [[touchdesigner/02_The_Operators/POPs/POP - Point Operators|(y-) ← Prev: POPs]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/03_Rendering_and_Output/Cameras and Lights|(y-) Next: Cameras and Lights →]]

---

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
