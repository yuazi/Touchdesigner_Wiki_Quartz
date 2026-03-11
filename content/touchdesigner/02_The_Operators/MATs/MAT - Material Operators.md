---
tags:
  - touchdesigner
  - td/operators
  - mat
  - operators
date: 2026-02-11
---

# MAT - Material Operators

MATs define the appearance of 3D geometry (SOPs). They are assigned to **Geometry COMPs**.

## Key MATs

- **Phong:** The standard material for lighting, textures, and reflections.
- **Constant:** A flat color material that ignores lighting.
- **PBR (Physically Based Rendering):** For high-quality, realistic materials using Roughness/Metallic maps.
- **GLSL:** Write custom vertex and fragment shaders.

## How to Use MATs

MATs are essential for giving your 3D geometry (SOPs) an actual surface appearance when rendered.

1. **Adding a MAT:** Open the OP Create Dialog (Tab) and select the MAT family (yellow color).
2. **Assigning a Material:**
   - You don't connect wires directly from a MAT to a SOP.
   - Instead, drag and drop your MAT onto a `Geometry COMP` (which contains your SOPs) and select "Material" from the pop-up menu.
   - Alternatively, type the MAT's name into the "Material" parameter of the Geometry COMP.
3. **Applying Textures:**
   - To add an image texture to a MAT (like a `Phong MAT` or `PBR MAT`), drag a TOP (like a `Movie File In TOP`) onto the MAT's specific map parameter (e.g., Color Map, Normal Map, or Roughness Map) and select **Connect Link**, or simply type the operator path as a string directly into the map parameter (e.g., `op('moviefilein1')`).
4. **Lighting:** Most materials (like Phong or PBR) require a `Light COMP` in the network to be visible in the render. Without a light, geometry with these materials might appear completely black.

[[touchdesigner/02_The_Operators/MATs/index|Return to MATs]] | [[touchdesigner/02_The_Operators/index|Return to The Operators]] | [[touchdesigner/index|Return to TouchDesigner]]

---
