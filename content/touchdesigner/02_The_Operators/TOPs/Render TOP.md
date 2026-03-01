---
tags:
  - touchdesigner
  - td/operators
  - top
  - rendering
  - operators
---
# Render TOP

The **Render TOP** is what converts your 3D scene — geometry, lights, cameras, and materials — into a 2D image you can display, process, or output. It is the bridge between the 3D (SOP/COMP) world and the 2D (TOP) world.

## Key Parameters

### Render Page
| Parameter | Description |
|---|---|
| **Camera** | Path to the Camera COMP that defines the viewpoint |
| **Geometry** | Comma-separated list of Geometry COMPs to render. Leave blank to auto-discover all visible Geo COMPs in the same level |
| **Lights** | Path(s) to Light COMPs. Leave blank for auto-discovery |
| **Background Color** | RGBA colour of the area behind all geometry |
| **Clear Options** | What to clear before each frame: colour, depth, both, or neither |

### Common Page
| Parameter | Description |
|---|---|
| **Resolution** | Output texture size (e.g. 1920×1080) |
| **Pixel Format** | Bit depth: `8-bit fixed` for standard use; `32-bit float` for HDR and compositing |

## Minimal 3D Scene Setup

The fastest way to get a rendered scene is:

```
Box SOP → Geo COMP
Camera COMP
Light COMP
Render TOP  ← set Camera to the Camera COMP
  → Null TOP (OUT_RENDER)
```

1. Create a **`Geo COMP`** and connect your geometry SOP into its first input.
2. Add a **`Camera COMP`** and a **`Light COMP`** at the same network level as the Geo COMP.
3. Add a **`Render TOP`**. It will auto-discover the Camera and Lights if they are at the same level.
4. Hit play — you'll see the geometry rendered.

## Multiple Geometry Objects
To render several objects, either:
- List them explicitly in the **Geometry** parameter: `/project1/geo1, /project1/geo2`
- Or put all geometry inside a **Container COMP** and reference that level — the Render TOP discovers everything inside it.

## Post-Processing the Image
Because the Render TOP outputs a standard TOP, you can chain any TOP after it:
```
Render TOP → Level TOP (adjust brightness/contrast)
           → Blur TOP
           → Composite TOP (overlay UI elements)
           → Out TOP
```

## Multiple Render Passes
For effects that require separation (e.g. rendering geometry and particles separately to composite them):
1. Use two Render TOPs, one per layer.
2. Control which geometry each renders by setting the **Geometry** parameter explicitly.
3. Use a **Composite TOP** or **Over TOP** to combine them.

## Pixel Format Tips
- **`8-bit fixed (RGBA)`** — standard, fast, enough for most work
- **`16-bit float (RGBA)`** — better for compositing with transparency
- **`32-bit float (RGBA)`** — full HDR; needed for GLSL shaders that output values outside 0–1

## Common Gotchas
- **Black output** → check that the Camera COMP path is correct and that geometry is inside the camera's frustum.
- **Geometry not appearing** → make sure the Geo COMP's visible flag (eye icon) is on, and its material is assigned.
- **Render is slow** → reduce resolution, reduce polygon count upstream in SOPs, or use instancing instead of duplicating geometry.
- **Alpha is not transparent** → set the Background Color alpha to 0 and use a pixel format with alpha (`RGBA`).
- The Render TOP does **not** need to be connected to the Camera COMP or Geo COMP with wires — it references them by name/path.

## Related Nodes
- [[COMP - Components|Geo COMP]] — holds the 3D geometry
- [[SOP - Surface Operators|SOP]] — geometry source
- [[MAT - Material Operators|MAT]] — shaders applied to geometry
- [[Rendering Basics]] — full rendering workflow walkthrough

---
[[02_The_Operators/TOPs/index|Back to TOPs]] | [[02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to Main Page]]
