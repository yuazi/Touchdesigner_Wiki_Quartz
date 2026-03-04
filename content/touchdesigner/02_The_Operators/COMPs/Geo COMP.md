---
tags:
  - touchdesigner
  - td/operators
  - comp
  - operators
  - rendering
date: 2026-02-11
---
# Geo COMP

The **Geometry COMP** (`Geo COMP`) is the fundamental container that places 3D geometry into the scene. It wraps a SOP network (your mesh/points) and adds the properties needed to render it: transform, material, instancing, and render settings.

You can think of the Geo COMP as the "actor" on stage — it holds a mesh (from SOPs) and tells the Render TOP how, where, and how many times to draw it.

## Key Pages

### Xform (Transform) Page
Controls where the geometry sits in 3D space:

| Parameter | Description |
|---|---|
| **Translate (tx, ty, tz)** | Position in world space |
| **Rotate (rx, ry, rz)** | Euler angles in degrees |
| **Scale (sx, sy, sz)** | Uniform or non-uniform scale |
| **Pivot** | Point around which rotation and scale is applied |
| **Order** | Transformation and rotation order — matters for complex rigs |

### Render Page
| Parameter | Description |
|---|---|
| **Render** | On/Off — whether this geometry is picked up by Render TOPs |
| **Display** | On/Off — whether it shows in viewport previews |
| **Material** | Path to a MAT operator for the surface shader |
| **Shadow Caster / Receiver** | Enable shadow casting/receiving |

### Instance Page
This is where instancing lives — see [[Instancing]] for a full guide.

| Parameter | Description |
|---|---|
| **Instancing** | Turn ON to duplicate this geometry many times |
| **Instance CHOP/DAT** | The CHOP or DAT providing per-instance transform data |
| **Translate (tx/ty/tz)** | Which channels from the Instance CHOP drive position |
| **Rotate / Scale** | Similarly mapped channel names |

## Wiring Geometry In

The Geo COMP takes **SOP operators** as its input:
```
Box SOP → [input 0 of Geo COMP]
```
Alternatively, you can build the SOP network **inside** the Geo COMP:
- Double-click the Geo COMP to go inside it.
- You'll find a default `torus1` SOP and `out1` SOP.
- Replace the torus with your own geometry. The `out1` SOP is what gets displayed.

You can also reference an external SOP without wiring it in, by using a **SOP To** operator or a CHOP Reference inside the network.

## Typical Rendering Setup

```
Box SOP
  └→ Geo COMP
       ├── Material: op('/project1/phong1')    ← MAT reference in the Render page
       └── Xform: tx = op('lfo1')['chan1']     ← expression on tx

Camera COMP
Light COMP
Render TOP
  └── [auto-discovers Geo COMP, Camera, Light at same level]
  └→ Null TOP (OUT_RENDER)
```

## Animating the Transform
You can drive any Xform parameter with a CHOP reference or expression:
- **Rotate Y continuously:** `absTime.seconds * 30` (30°/sec)
- **From LFO:** `op('lfo1')['chan1'] * 5`
- **CHOP Export:** Drag a CHOP channel onto `ty` and choose Export

## Material Assignment
The Geo COMP does not have its own surface look — you must assign a MAT:
1. Go to the **Render page** of the Geo COMP.
2. Set the **Material** field to the path of your MAT node (e.g. `/project1/phong1`).
3. Alternatively, you can assign materials **per primitive** inside the SOP network using an `Material SOP`.

## Common Gotchas
- **Nothing renders** → check the Render flag is ON, a Material is assigned, and the Camera is pointing at it.
- **Geometry is inside-out** → flip normals using a **Facet SOP** (Normals → Reverse).
- **Moving the Geo COMP doesn't move the mesh** → make sure you're editing the Geo COMP's Xform, not the SOP inside it.
- **Instancing shows only one copy** → the Instance CHOP must have more than one sample; check the CHOP channel count with the Info popup (`I`).

## Related Nodes
- [[SOP - Surface Operators|SOP]] — geometry source
- [[Render TOP]] — renders the scene to a texture
- [[MAT - Material Operators|MAT]] — surface shaders
- [[Instancing]] — duplicating geometry efficiently

---
[[touchdesigner/02_The_Operators/COMPs/index|Back to COMPs]] | [[touchdesigner/02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to TouchDesigner]]

---
[[touchdesigner/02_The_Operators/COMPs/index|Back to COMPs]]
