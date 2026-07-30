---
tags:
  - touchdesigner
  - td/rendering
  - rendering
  - instancing
  - advanced
date: 2026-02-16
---

# Geometry Instancing

Instancing draws the same piece of geometry many times in one render call. The geometry uploads to the GPU once; per-instance data (position, rotation, scale, color, custom attributes) provides the variation. The GPU is built for this: thousands or millions of instances cost a fraction of what the same number of separate Geo COMPs would.

In TouchDesigner, instancing lives on the **Instance page** of the Geometry COMP. There are three Instance pages (Instance, Instance 2, Instance 3) carrying related parameters.

## Enabling Instancing

1. Drop a Geo COMP. Inside, build the source mesh you want to repeat (e.g. a Box SOP fed into an `out1` Out SOP, or just toggle the Render flag on a SOP inside the COMP).
2. On the Geo COMP's Instance page, set **Instancing** to On.
3. Pick how to count instances: **Instance Count Mode** = Manual (uses Num Instances) or Instance OP(s) Length (derived from CHOP samples / DAT rows).
4. Choose a **Default Instance OP** ("Specify a path to a CHOP or DAT used to transform the instances") and individual Translate/Rotate/Scale OPs as needed.

## Instance Sources

The Instance system reads per-instance data from one of these op types:

| Source type | How data maps                                                                           | Best for                                             |
| ----------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **CHOP**    | Channels become attributes; samples become instances. 1000-sample CHOP = 1000 instances | Tens of thousands of instances; computed values      |
| **DAT**     | Columns become attributes; rows become instances                                        | Externally driven layouts (CSV, JSON-derived tables) |
| **TOP**     | RGBA pixel values become attributes; pixel positions become instance indices            | Massive counts; precomputed layouts; texture-driven  |
| **SOP**     | SOP attributes (like point positions) become instance attributes                        | Using existing 3D points as instance positions       |

Per the wiki: when data is supplied by a TOP, "the TOP's RGBA channels are assigned to instance attributes." Same logic for CHOP channels, SOP attributes, DAT columns.

## Key Instance Page Parameters

| Parameter                   | Description                                                                                       |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| **Instancing**              | "Turns on instancing for the Geometry Component"                                                  |
| **Instance Count Mode**     | Manual (use Num Instances) or Instance OP(s) Length (from CHOP samples / DAT rows)                |
| **Num Instances**           | Manual count                                                                                      |
| **Default Instance OP**     | "Specify a path to a CHOP or DAT used to transform the instances"                                 |
| **Translate OP** + tx/ty/tz | Source op for translation, plus channel/column indexes                                            |
| **Rotate OP** + rx/ry/rz    | Source op for rotation                                                                            |
| **Scale OP** + sx/sy/sz     | Source op for scale                                                                               |
| **Pivot OP** + px/py/pz     | Per-instance pivot point                                                                          |
| **Transform Order**         | Six options (srt, str, rst, rts, tsr, trs) controlling the order Translate / Rotate / Scale apply |
| **Rotate Order**            | Six rotation sequence options (xyz, xzy, yxz, yzx, zxy, zyx)                                      |
| **Active**                  | "Select the data channel that will be used to control which instances are rendered"               |
| **First Row**               | For DAT sources: Ignored / Names / Values                                                         |

Color and texture instancing live on Instance 2 and Instance 3 pages; the same OP + index pattern applies.

## Per-Instance Custom Attributes

Declare custom attributes on the Instance page; they get exposed to the shader. In a GLSL MAT, read them with the helper functions `TDInstanceCustomAttrib0()`, `TDInstanceCustomAttrib1()`, etc. Use this when you need the shader to know a per-instance value beyond the standard transform/color slots (e.g. a per-instance "age" for fading particles).

## Practical Example: 1000-Instance Grid Driven by Noise

```
inside geo1:
   box1 (small, render flag on)

at the level above:
   noise1 (Noise CHOP)
      Channels: tx ty tz
      Period: 4
      Amplitude: 5
      [1000 samples on the timeline]
   noise2 (Noise CHOP)
      Channels: r g b
      Period: 6
      Amplitude: 0.5
      Offset: 0.5

geo1 (Instance page):
   Instancing: On
   Instance Count Mode: Instance OP(s) Length
   Translate OP: noise1
   tx index: 0, ty index: 1, tz index: 2
   (Color OP on Instance 2 page: noise2, r/g/b indexes 0/1/2)
```

Result: 1000 boxes scattered through space with smoothly noise-driven positions and colors. Cooks fast because all the per-instance work runs on the GPU.

## Performance

| Source            | Practical instance ceiling | Notes                                                |
| ----------------- | -------------------------- | ---------------------------------------------------- |
| **CHOP**          | Tens of thousands          | CHOP cook is CPU; samples upload each cook           |
| **DAT**           | Tens of thousands          | Same constraint as CHOP                              |
| **SOP**           | Tens of thousands          | CPU-side; consider POPs for higher counts            |
| **TOP**           | Hundreds of thousands+     | Data already on GPU; no upload cost                  |
| **POP** (via TOP) | Millions                   | Native GPU; the high-end choice for particle systems |

Texture-driven color (a TOP feeding the Color OP slot) is essentially free per instance, far cheaper than swapping per-instance MATs.

## Common Gotchas

- **Wrong CHOP channel order.** The tx/ty/tz indexes refer to channel positions in the source CHOP. If you reordered channels upstream, the wrong values feed the wrong axes. Use Select CHOP to pin channel names if it matters.
- **TOP source needs sufficient precision.** An 8-bit TOP clamps to `[0, 1]`, so positions feeding `tx ty tz` cap at 1 unit unless you scale. Switch the source TOP to 16- or 32-bit float for real coordinate ranges.
- **Translate OP empty.** Forgetting to set Translate OP (relying on default) can leave all instances at origin. Verify with the Geo COMP's middle-mouse popup.
- **Instance Count Mode mismatch.** Set to Manual but expecting samples? You get Num Instances copies regardless of source op size. Switch to Instance OP(s) Length if the source determines count.
- **Custom attributes need GLSL MAT or a MAT that supports them.** Built-in MATs honor Color but not arbitrary custom attributes. For per-instance "age" or "type" data driving the shader, drop a GLSL MAT.

## Related Pages

- [[Geo COMP]]: the host of the Instance pages
- [[POP - Point Operators]]: for million-point instance sources
- [[Render TOP]]: where the instanced render lands
- [[touchdesigner/03_Rendering_and_Output/Rendering Basics|Rendering Basics]]: the rest of the render pipeline

---

> [!tip]- 📚 Learning Path · Stage 4 - Rendering & 3D · step 23 of 44
> [[touchdesigner/03_Rendering_and_Output/Cameras and Lights|(y-) ← Prev: Cameras and Lights]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Next: Feedback Loops →]]

---

[[touchdesigner/03_Rendering_and_Output/index|(y) Return to Rendering & Output]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
