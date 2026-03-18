---
tags:
  - touchdesigner
  - td/rendering
  - rendering
date: 2026-02-16
---

# Rendering Basics

In TouchDesigner, rendering involves converting 3D geometry (SOPs), materials (MATs), lighting, and camera perspectives into a 2D image (TOP).

## The Core Pipeline

A standard 3D rendering pipeline requires four main components:

1. **Geometry (SOP):** A 3D model, e.g., a Sphere SOP. It must be placed inside a Geometry COMP (or have its display/render flags active if it's already inside one).
2. **Camera COMP:** Defines the perspective and view frustum from which the scene is observed.
3. **Light COMP:** Illuminates the scene. Without lighting, materials using typical phong shading will appear completely black.
4. **Render TOP:** The node that actually computes the final image, taking the Camera, Geometry, and Light(s) as its inputs.

## Specialized Rendering: POP Render TOP

For high-performance point clouds and particles processed via **POP - Point Operators**, a specialized **POP Render TOP** is used. This bypasses the traditional Camera/Light pipeline to efficiently draw millions of points onto a 2D image, often utilizing GPU-based vertex and fragment logic for maximum speed.

## Render Settings

The **Render TOP** has several crucial parameters on its setup pages:

- **Resolution:** By default, it inherits from its inputs or uses a preset (like 1280x720). You can customize this in the _Common_ page.
- **Pixel Format:** 8-bit, 16-bit float, or 32-bit float. Use higher bit depths for HDR imaging, feedback loops, or precise depth passes.
- **Anti-alias:** Smooths the jagged edges of geometry. Higher values cost more performance.

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]]

---
