---
tags:
  - touchdesigner
  - td/operators
  - operators
  - sop
date: 2026-02-11
---

# SOP - Surface Operators

SOPs ("Surface Operators") are TouchDesigner's family for 3D geometry. Per the wiki: "Surface Operators... are operators that can generate, import, modify and combine 3D surfaces (also called geometry)." They handle "3D points, polygons, lines, particles, surfaces, spheres and meatballs."

SOPs run on the **CPU**. That's the key trade-off vs the rest of the pipeline. Modeling, deformation, and topology edits are convenient but cost real CPU time per cook. For millions-of-points work, the wiki points you at POPs instead, "done primarily on the GPU using TOPs."

## Anatomy of Geometry

Every SOP holds geometry as four kinds of records:

| Record        | What it is                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Point**     | A 3D position. Holds the standard `P` (position) attribute and any custom point attributes.                              |
| **Vertex**    | A reference to a Point, used inside a Primitive. Multiple vertices can share one point. Holds per-corner data like `uv`. |
| **Primitive** | A face, polyline, curve, NURBS, or particle that groups vertices into a renderable thing.                                |
| **Attribute** | Named data stored at point, vertex, or primitive level. Standard ones: `P`, `N` (normal), `Cd` (color), `uv`.            |

Worked example: a Box SOP has **8 Points** (the corners), **6 Primitives** (the faces), and **24 Vertices** (because each of 6 quads has 4 corners, and the corners reference back to the 8 shared points). The Vertex layer is what lets the same point have a different `uv` on different faces.

When the same attribute exists at multiple levels, the wiki notes the precedence order is "Vertex Attributes, Point Attributes, Primitive Attributes" highest to lowest. Vertex wins for things like UVs that need to break at edges.

## SOP Categories

The wiki lists "Sweet 16" commonly-used SOPs: Circle, Grid, Merge, Copy, Switch, Texture, Noise, Transform, DAT to, CHOP to, Trace, Clip, Facet, Particle, Sweep, Sort. Practically the family groups into:

- **Generators** make geometry from nothing: Box, Sphere, Torus, Grid, Circle, Line, Add, Tube
- **Modifiers** push points around: Transform, Twist, Lattice, Magnet, Noise, Facet, Smooth
- **Topology** changes connectivity: Copy, Merge, Boolean, Convert, Polyloft, Skin, Sweep, Trace
- **Attribute** ops add/edit named data: Attribute Create, Point, Vertex, Primitive, Sort, Group
- **Bridges** convert from other families: CHOP to SOP, DAT to SOP, POP to SOP
- **Output / null** terminate a chain: Null, Out (boundary on a sub-network)

## Custom Attributes

Add an `Attribute Create SOP` after a generator and you can stamp custom per-point/vertex/primitive data. A common pattern: per-point random color, then read it in a GLSL MAT or instance it onto another mesh.

```
grid1 → attributecreate1 (Class: Point, Name: Cd, Type: float[4])
      → null1
      → [feeds Geo COMP, rendered with a MAT that respects vertex color]
```

`Cd` is the standard color name and most MATs read it without further setup.

## Hooking SOPs into a Render

A SOP by itself doesn't render. It needs a Geo COMP wrapper:

1. End the SOP chain with a Null SOP (clean reference target).
2. Drop a Geo COMP. By default it's empty.
3. Either drag the Null SOP inside the Geo COMP, or set the Geo COMP's Geometry parameter to the Null's path.
4. Assign a Material on the Geo COMP, plus a Camera and a Light.
5. Render TOP renders the result.

See [[Geo COMP]] and [[touchdesigner/03_Rendering_and_Output/Rendering Basics|Rendering Basics]] for the full flow.

## CPU Bottleneck and the GPU Alternative

SOP work is CPU-bound and serial. A Noise SOP on a 100,000-point Grid will warm your CPU. For point counts in the millions, or any per-frame physics, switch to POPs (the wiki's recommendation): "now done primarily on the GPU using TOPs" with the POP family handling attributes, forces, and rendering. See [[POP - Point Operators]].

## Common Gotchas

- **Convert silently drops attributes.** Going Mesh -> Polyloft -> Mesh round-trip can lose custom UVs. Verify with the middle-mouse info popup.
- **Transform SOP is not free.** Object-level transforms on the Geo COMP are GPU-handled at render time and cost zero per-point cycles. Use a Transform SOP only when the points themselves need different post-transform positions for downstream ops.
- **Merge order changes Primitive indexes.** If anything downstream references primitives by index, swapping inputs on a Merge will silently shift which primitive gets what.
- **`P` vs object-level position.** A point's `P` is in object space. Transforming the Geo COMP doesn't update `P` in upstream SOPs; only render position changes.

## Related Nodes

- [[Geo COMP]]: the COMP wrapper that renders SOP output
- [[POP - Point Operators]]: GPU alternative for huge point counts and particles
- [[Render TOP]]: the GPU pass that turns a Geo COMP into pixels
- [[touchdesigner/03_Rendering_and_Output/Rendering Basics|Rendering Basics]]: the full Geo + Camera + Light + Render TOP recipe

---

[[touchdesigner/02_The_Operators/TOPs/index|(y-) Next Chapter: TOPs]]

---

[[touchdesigner/02_The_Operators/SOPs/index|(y) Return to SOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
