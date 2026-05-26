---
tags:
  - touchdesigner
  - td/operators
  - operators
  - pop
date: 2026-02-11
---

# POP - Point Operators (GPU Points)

POPs ("Point Operators") are TouchDesigner's GPU-resident operator family for points and point-based geometry. The wiki: "POPs are a replacement and re-think of TouchDesigner's historically first operator family, SOPs (1989), with many new features and benefits." Points are the fundamental record; primitives can be built on top of them, but the unit of work is the per-point attribute, processed in massive parallel on the GPU.

If you've worked the SOP path, the move to POPs is mostly a switch from CPU-bound, thousands-of-points serial processing to GPU-bound, millions-of-points parallel processing.

## Why GPU Points

| Concern         | SOPs                                         | POPs                                                        |
| --------------- | -------------------------------------------- | ----------------------------------------------------------- |
| Where they live | CPU memory, single-threaded modify           | GPU memory, parallel modify across thousands of cores       |
| Practical scale | Thousands to low tens of thousands of points | Hundreds of thousands to millions of points                 |
| Round-trip cost | Free to read on CPU                          | Slow to read back to CPU; design pipelines that stay on GPU |
| Particle work   | Particle SOP (legacy)                        | Feedback POP with full attribute control                    |
| Point clouds    | Encodable as 4-channel CHOPs/SOPs (awkward)  | Native primitive type                                       |

The wiki summary: "POPs advantages over SOPs: GPU execution with 'high GPU parallelism' instead of CPU processing... native point cloud support without 4-channel format mapping... particle systems via Feedback POP with more flexible attribute control." SOPs still beat POPs when you need closed polygons with arbitrary sides or true NURBS surfaces.

## POP Categories

The wiki splits POPs into the same shape as SOPs:

- **Generators** create points: Add POP, From File, Sphere POP, Box POP, Grid POP, Line POP, **Text POP** (2025+), **Trace POP** (2025+)
- **Filters / Modifiers** edit attributes: Transform POP, Attribute POP, Limit POP, Sort POP, **Triangulate POP** (2025+)
- **Forces** apply per-point physics: Force POP, Noise POP, Gravity, Wind, Turbulence
- **Simulation** advances state: Feedback POP (the particle workhorse), Solver POP
- **Export** write to disk: **Alembic Out POP** (2025+)
- **DMX / Lighting**: **DMX Fixture POP**, **DMX Out POP** (2025+) — see below
- **Bridges** convert: SOP to POP, TOP to POP, CHOP to POP, POP to SOP, POP to TOP, POP to CHOP
- **Render** outputs pixels: POP Render TOP

## The Bridges

| Bridge        | Use it when                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------- |
| `SOP to POP`  | You modeled in SOPs and want to particle-ize or instance from the points                       |
| `TOP to POP`  | Pixel data becomes per-point attributes (RGB → XYZ for point clouds, alpha → mass)             |
| `CHOP to POP` | Channel data becomes per-point attributes (e.g. driving 1000 instances from 1000 CHOP samples) |
| `POP to TOP`  | Per-point attributes become a texture for use elsewhere                                        |
| `POP to SOP`  | Round-trip back to CPU geometry (rarely needed, expensive)                                     |
| `POP to CHOP` | Aggregate or sample per-point data back into channels                                          |

## Typical Pipeline

```
generator (Add POP / From SOP / TOP to POP)
    ↓
modifiers (Transform POP, Force POP, Noise POP)
    ↓
simulation step (Feedback POP for particles)
    ↓
either:
   POP Render TOP             (direct render to a texture)
or:
   Geo COMP (Instance from POP)  (instance geometry per point)
```

POP Render TOP is the primary render route: it consumes a POP and produces a TOP directly. The alternative is to feed POP attributes into the Instance page of a Geo COMP, drawing instanced geometry per point.

## Custom Attributes

POPs carry whatever attributes you stamp on them. Standard ones include `P` (position), `Cd` (color), `N` (normal), `pscale` (point scale), `mass`, `vel`. Add custom attributes via Attribute POP, and downstream ops will preserve them as long as the chain knows about them. A GLSL MAT receiving instanced POP data can read these via `TDInstanceCustomAttrib0()` and friends.

## Common Gotchas

- **Modern GPU and recent build required.** Per the wiki, POPs need "GPU-accelerated graphics cards or chips." On older drivers or older Touch builds the POP family won't even appear in the OP Create dialog.
- **Attribute drops downstream.** If a downstream POP doesn't declare a custom attribute it expects to operate on, the attribute is silently dropped at that node. Hover and check what each POP actually outputs.
- **POP cook fits in the TOP cook chain.** POP Render TOP cooks when its TOP output is asked for, and that pulls the upstream POP chain. The pull-system rules from [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]] apply unchanged.
- **Don't expect SOP semantics.** A POP isn't a Mesh; primitives are optional. If you need to merge polygons or build a closed surface, do that work in SOPs (or convert at the end).

## 2025 POP Additions

### Text POP and Trace POP

**Text POP** generates text as 3D geometry entirely on the GPU: output modes are line strips (outline strokes) or filled triangles. It supersedes the Text COMP + Geo Text COMP path for point-based text work. Parameters mirror the Text SOP but compute on GPU.

**Trace POP** takes a 2D TOP input and traces its bright edges into line-strip point geometry. It is a focused version of the Polygonize POP, tuned for 2D outline extraction and optimized to output the correct winding for the Triangulate POP.

**Triangulate POP** takes closed line strips (from Trace POP or drawn geometry) and fills them with triangles. Two modes: convex-only (fast, fully parallel) and convex+concave (handles complex shapes but slower for long strips). Use the convex-only mode for real-time text fill; use concave only when you need non-convex polygon interiors.

**Alembic Out POP** writes POP point data to an `.abc` Alembic file. Supports multi-frame animation, built-in and custom attributes, and multiple POPs as separate Alembic objects in one file.

### DMX Lighting via POPs

As of TD 2025, DMX fixtures can be driven entirely through POPs — staying on the GPU rather than moving through CHOP channels.

- **DMX Fixture POP:** Define a fixture's channel profile (pan, tilt, color, dimmer, strobe, gobo, etc.). Each POP instance represents one fixture.
- **DMX Out POP:** Takes one or more DMX Fixture POPs, merges all universes, and transmits to hardware via DMX USB, Art-Net, sACN, KiNET, or FTDI.

The POP path scales better than the CHOP path for large LED arrays or pixel-mapped installations because attribute math stays on the GPU. For simple fixture control (a handful of PAR cans), the CHOP-based **DMX Out CHOP** remains simpler to set up.

## Practical Examples

- [[touchdesigner/06_Recipes_and_Projects/y-2/Image to POPs|Image to POPs: Pointcloud / Line Grid]]: TOP to POP for converting 2D pixel data into 3D point clouds and stylized wireframe grids.
- [[touchdesigner/06_Recipes_and_Projects/y-2/Organic Amoeba|Organic Amoeba]]: Noise POPs and Attribute POPs for lifelike, pulsating organic forms.

## Related Nodes

- [[touchdesigner/03_Rendering_and_Output/Instancing|Instancing]]: Geo COMP can instance geometry from POP attributes
- [[Geo COMP]]: the COMP that hosts the instance source
- [[SOP - Surface Operators]]: the CPU side of point-based geometry

---

[[touchdesigner/02_The_Operators/SOPs/index|(y-) Next Chapter: SOPs]]

---

[[touchdesigner/02_The_Operators/POPs/index|(y) Return to POPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
