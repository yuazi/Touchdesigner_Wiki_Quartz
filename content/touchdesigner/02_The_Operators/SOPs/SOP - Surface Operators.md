---
tags:
  - touchdesigner
  - td/operators
  - operators
  - sop
date: 2026-02-11
---

# SOP - Surface Operators (3D)

SOPs are used for 3D geometry and point data.

## Key SOPs

- **Sphere/Box/Torus:** Basic primitives.
- **Grid:** A flat plane of points.
- **Noise:** Deform geometry using 3D noise patterns.
- **Copy:** Repeat geometry at specific points.
- **Attribute Create:** Calculate normals or tangents.
- **Group:** Organize subsets of points or primitives.

## Anatomy of a SOP

Understanding how TouchDesigner structures 3D geometry is vital:

- **Points:** The lowest level. Just XYZ coordinates in space.
- **Vertices:** A reference to a Point, used to build higher-order shapes. (Multiple vertices can share a single point).
- **Primitives:** The faces, lines, or polygons constructed by connecting vertices.

_Example:_ A Box SOP has 8 Points (corners). But it has 6 Primitives (faces). Because each face needs 4 corners, the Box actually consists of 24 Vertices mapped back to those 8 logical Points.

## How to Use SOPs

SOPs are the traditional way of modeling and manipulating 3D data in TouchDesigner, executed on the CPU.

1. **Adding a SOP:** Open the OP Create Dialog (Tab) and select the SOP family (blue color).
2. **Creating Geometry:** Start with generator SOPs like `Box`, `Sphere`, or `Torus`.
3. **Modifying Geometry:** Pass the generator output into modifier SOPs like `Transform` to move it, `Noise` to deform point positions, or `Facet` to compute normals.
4. **Connecting:** Drag from the output on the right to an input on the left to pass geometry data.
5. **Viewing Data:** Middle-click any SOP to see how many points, vertices, and primitives it contains. Right-click the node and select "View" to open a separate 3D viewer.
6. **Rendering Process:**
   SOPs run on the CPU. To see them rendered on the GPU with textures and lighting:
   - Connect your final SOP to a `Null` SOP.
   - Right-click the `Null` SOP's output and select a `Geometry COMP` (under the COMP tab).
   - This places your SOP data inside an object that can be rendered using a `Render TOP`, along with a `Camera COMP` and a `Light COMP`.

[[touchdesigner/02_The_Operators/SOPs/index|↑ Back to SOPs]] | [[touchdesigner/02_The_Operators/index|↑ Back to The Operators]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
