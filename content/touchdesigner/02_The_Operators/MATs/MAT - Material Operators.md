---
tags:
  - touchdesigner
  - td/operators
  - mat
  - operators
date: 2026-02-11
---

# MAT - Material Operators

MATs are TouchDesigner's family of shaders. The wiki: "MATs or Materials are an Operator Family that applies a Shader to a SOP or 3D Geometry Object for rendering textured surfaces with lighting." A SOP defines geometry; a MAT decides how that geometry catches light, takes a texture, and writes pixels in a Render TOP.

You don't wire a MAT to a SOP. You assign it on the Geo COMP that wraps the SOP, by setting the COMP's Material parameter to the MAT's path.

## MAT Comparison

| MAT               | What it does                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Constant MAT**  | "applies a constant flat color to the geometry" with no specular shading. Useful for unlit UI, debug, holdouts.               |
| **Phong MAT**     | "applies a phong shader to the geometry." Per-pixel diffuse + specular + ambient + emit. The classic real-time look.          |
| **PBR MAT**       | "applies a PBR shader to the geometry." Metallic/roughness workflow, Image-Based Lighting from an Environment Light COMP.     |
| **Wireframe MAT** | Renders only edges as lines. Debug visualizer.                                                                                |
| **Line MAT**      | "renders the geometry edges as lines and points with different geometry." Stylized line work.                                 |
| **Point Sprite**  | "special material for use with Point Sprite geometry type." Per-point billboarded sprites.                                    |
| **Depth MAT**     | "can be used to get depth information from the geometry for a depth-pass render." Used as a holdout in multi-pass setups.     |
| **GLSL MAT**      | "applies Pixel and Vertex GLSL shaders to the geometry." Drop down to custom shaders when no built-in MAT does what you need. |

## Phong MAT: the Default Workhorse

The Phong shader calculates lighting per-pixel and is the right starting point for almost any unlit-to-realistic spectrum that doesn't need PBR. Key parameters:

| Parameter     | Description                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| **Diffuse**   | "The color of the diffuse light reflected from the material."                                               |
| **Specular**  | "The color of the specular light reflected from the material."                                              |
| **Ambient**   | "The color of the ambient light reflected from the material." Toggle "Ambient uses Diffuse" to lock them.   |
| **Emit**      | "This is the color that the material will emit even if there is no light." For self-lit signs, displays.    |
| **Shininess** | "Higher settings are more glossy, like plastic or shiny metal. Lower settings give more of a matte finish." |

A second specular lobe (Secondary Specular / Secondary Shininess) is available when you want a tight highlight on top of a broader sheen.

## PBR MAT: When You Need Realism

The PBR MAT uses the metallic/roughness workflow common to modern engines and pairs with an Environment Light COMP for image-based lighting.

| Parameter             | Description                                                                        |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Base Color**        | "Base color of the texture, used to calculate diffuse and specular contributions." |
| **Metallic**          | 0.0 = dielectric, 1.0 = metal. Drives how the surface reflects vs absorbs.         |
| **Roughness**         | 0.0 = mirror, 1.0 = matte. Spreads the specular lobe.                              |
| **Normal Map**        | "Uses a Normal Map from TOPs to create a 'bump map' effect."                       |
| **Ambient Occlusion** | "Affects the contribution from the Environment Light COMP."                        |

PBR without an Environment Light renders dark and lifeless. Drop an Environment Light COMP and feed it an HDR map (Environment TOP) for IBL.

## Texturing

MATs accept TOP inputs through Map parameters: Color Map, Normal Map, Roughness Map, Metallic Map, Emit Map. Drag a TOP onto a Map parameter (Connect Link) or type the path directly. UVs come from the SOP's `uv` vertex attribute. Mipmaps default on; toggle off in the TOP's Common page if you need pixel-perfect sampling.

## When to Drop to GLSL

GLSL MAT is the escape hatch when the built-ins can't do what you need: custom lighting models, post-vertex displacement, screen-space tricks, or per-instance shading logic. The boilerplate is significant; consider TouchDesigner's GLSL helper functions (`TDPhongResult`, `TDInstanceCustomAttrib0`, `TDOutputSwizzle`) before writing your own from scratch. See the Ch 05 page on shaders.

## Common Gotchas

- **No MAT assigned, no shading.** A Geo COMP with a blank Material parameter renders with the default unlit shader. If your geo looks chalk-white instead of lit, set the Material.
- **Phong looks black.** Phong needs a Light COMP. With no light in the scene, Diffuse + Specular contribute zero and you see Ambient + Emit only.
- **PBR looks black.** PBR additionally needs an Environment Light. Even with directional lights, the IBL component carries most of the visual interest.
- **Transparent MATs sort wrong.** Render TOP draws geometry without depth-sorting transparent primitives by default. Multi-pass setups or separate Render TOPs per layer are the usual fix.
- **Texture Map paths.** A Map that's set to a non-existent op path silently uses the default (white). Check the parameter for the warning state.

## Related Nodes

- [[Geo COMP]]: the COMP that hosts the Material parameter
- [[Render TOP]]: where the MAT actually runs
- [[touchdesigner/03_Rendering_and_Output/Cameras and Lights|Cameras and Lights]]: the Light COMPs needed for shaded MATs
- [[TOP - Texture Operators]]: where Map textures come from

---

[[touchdesigner/02_The_Operators/POPs/index|(y-) Next Chapter: POPs]]

---

[[touchdesigner/02_The_Operators/MATs/index|(y) Return to MATs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
