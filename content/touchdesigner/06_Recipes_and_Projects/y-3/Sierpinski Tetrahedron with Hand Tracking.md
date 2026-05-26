---
title: "3D Sierpinski Tetrahedron with MediaPipe Hand Tracking"
tags:
  - touchdesigner
  - td/tutorials
  - td/tracking
  - td/interaction
  - td/mediapipe
  - td/generative
  - td/sop
  - td/fractal
date: 2026-03-01
---

**Related:** [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] · · [[Hand-Tracked Chaotic Attractor|(y-) Hand-Tracked Chaotic Attractor]]

---

## Overview

This tutorial walks you through building a **3D Sierpinski Tetrahedron** (the 3D equivalent of the Sierpinski triangle) using a clean instancing/copy approach, and then mapping hand data from MediaPipe to control the orientation and zoom.

---

## Part 1: Generating the 3D Sierpinski Tetrahedron

There are two ways to build this. **Method 1** is easier to understand visually, while **Method 2** is the industry standard for performance.

### Method 1: Recursive Copy SOP (Beginner)

Instead of writing complex L-System rules, we use TouchDesigner's `Copy SOP` to recursively place smaller tetrahedrons onto the vertices of larger ones.

1.  **Create the Base Geometry:**
    - Add a **Platonic Solids SOP** (Type: `Tetrahedron`). Name it `platonic1`. This is our "layout" with 4 points.
    - Add a second **Platonic Solids SOP** (Type: `Tetrahedron`). Name it `platonic2`.
    - Connect `platonic2` to a **Transform SOP** (Uniform Scale: `0.5`).
2.  **The First Iteration:**
    - Add a **Copy SOP**.
    - Connect the **Transform SOP** to the _left_ input (Primitives to Copy).
    - Connect `platonic1` to the _right_ input (Template Point SOP).
3.  **The Second Iteration (and beyond):**
    - Add a new **Transform SOP** after the `Copy SOP` (Uniform Scale: `0.5`).
    - Add a second **Copy SOP**.
    - Connect the new **Transform SOP** to the _left_ input.
    - Connect your original `platonic1` to the _right_ input.
    - Repeat this "Transform (0.5) → Copy" chain 1 or 2 more times.

---

### Method 2: GPU Instancing (Professional / High Performance)

For more than 3 iterations, the Copy SOP will tank your framerate. **Instancing** is much faster because it tells the GPU to render one tetrahedron many times at different positions.

1.  **Generate the Point Cloud:**
    - Follow the steps in Method 1, but instead of copying a `platonic2` tetrahedron, copy a single point (use an **Add SOP** with one point enabled).
    - This creates a fractal "cloud" of points where each tetrahedron should be.
2.  **Setup the Geo COMP:**
    - Connect your final `Copy SOP` (the point cloud) to a **Null SOP** named `OUT_points`.
    - Create a **Geometry COMP** (`geo1`).
    - Inside `geo1`, place one **Platonic Solids SOP** (Type: `Tetrahedron`) and a **Transform SOP** to set its base size.
3.  **Enable Instancing:**
    - On the **Instance** page of `geo1`, set **Instancing** to `On`.
    - Set **Instance SOP** to `../../OUT_points` (or use a **SOP to CHOP** and use the CHOP).
    - Map **Translate X/Y/Z** to `P(0)`, `P(1)`, and `P(2)`.
4.  **Set the Scale:**
    - Since each iteration halves the size, set the _Uniform Scale_ of the tetrahedron inside the Geo COMP to `0.5 ^ iterations`. For 4 iterations, that's `0.0625`.

---

## Part 2: Integrating MediaPipe for Hand Tracking

Recent versions of TouchDesigner make MediaPipe very easy to implement without external Python environments.

### 1. Load the MediaPipe Component

- Open the **Palette** (`Alt+L`).
- Navigate to **MachineLearning** (or **Tools**, depending on your TD build) and drag the **mediapipe** component into your network.
- Inside the component's parameters, enable _Hand Tracking_ and select your webcam as the video device.

### 2. Extracting Hand Coordinates

The MediaPipe component outputs a CHOP with data for all hand landmarks. We need a few specific channels.

- Connect a **Select CHOP** to the CHOP output of the MediaPipe component.
- **For Orientation (Rotation):** Track the dominant hand's wrist. In the Select CHOP's _Channel Names_ field, enter:
  ```
  H1_wrist_x H1_wrist_y
  ```
- **For Zoom:** Track the pinch distance between thumb and index finger. Add another **Select CHOP** and select:
  ```
  H1_thumb_tip_x H1_thumb_tip_y H1_index_fingertip_x H1_index_fingertip_y
  ```

---

## Part 3: Mapping Hand Data to Geometry and Camera

Raw MediaPipe data is normalized (usually between 0 and 1) and jittery. We need to do some math and smoothing.

### 1. Controlling Orientation

- Connect the wrist **Select CHOP** (`h1_wrist:x`, `h1_wrist:y`) to a **Math CHOP**.
- In the Math CHOP's _Range_ tab, map _From Range_ `[0, 1]` to _To Range_ `[-180, 180]` (degrees).
- Connect this to a **Filter CHOP** to smooth the data - a filter width of `0.1` to `0.3` works well.
- Connect the Filter CHOP to a **Null CHOP**.
- Make `geo1` active. Drag the smoothed `x` channel to _Rotate Y_ and the `y` channel to _Rotate X_ (inverting the axes usually feels more intuitive when tracking hands).

### 2. Controlling Zoom (Pinch Gesture)

To zoom, calculate the distance between the thumb tip and index finger tip.

- Connect the finger tip **Select CHOP** to a **Math CHOP**.
- Connect the finger tip **Select CHOP** to a **Script CHOP**. In its DAT, compute the Euclidean distance:
  ```python
  def onCook(scriptOp):
      scriptOp.clear()
      c = scriptOp.appendChan('pinch_dist')
      tx = op('select_pinch')['H1_thumb_tip_x'][0]
      ty = op('select_pinch')['H1_thumb_tip_y'][0]
      ix = op('select_pinch')['H1_index_fingertip_x'][0]
      iy = op('select_pinch')['H1_index_fingertip_y'][0]
      import math
      c[0] = math.sqrt((tx - ix)**2 + (ty - iy)**2)
  ```
  Name the Select CHOP `select_pinch` so the Script CHOP can reference it.

> **Why not Expression CHOP?** The Expression CHOP runs one expression per output channel, so you can't combine four input channels into one distance value without referencing the source operator directly. A Script CHOP is cleaner for this kind of multi-channel math.

- Connect that distance to another **Math CHOP** to remap the pinch range. For example, map _From Range_ `[0.05, 0.3]` (tight pinch vs. open hand) to a _To Range_ for the camera's Z translation, such as `[3, 10]`.
- Add a **Filter CHOP** for smoothness, then a **Null CHOP**.
- Drag the final distance channel to the _Translate Z_ (`tz`) parameter of the **Camera COMP**.

---

## Troubleshooting

| Problem           | Fix                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Laggy framerate   | Recursive geometries get heavy fast. **Switch to Method 2 (Instancing)** to handle 4+ iterations at a stable 60fps.                           |
| Hand disappearing | MediaPipe loses tracking on fast movement. Use a **Filter CHOP** to prevent the geometry from snapping violently back to default coordinates. |

---

## Parameter Tuning & Behavior

| Parameter          | Behavior                                                                                        |
| :----------------- | :---------------------------------------------------------------------------------------------- |
| **Iterations**     | Higher = more complex fractal detail (heavy on GPU/CPU); Lower = simpler geometric forms.       |
| **Rotation Range** | Higher = more sensitive hand-to-rotation mapping; Lower = stable, subtler orientation changes.  |
| **Filter Width**   | Higher = smooth, "floaty" movement; Lower = raw, responsive (but potentially jittery) tracking. |
| **Pinch Distance** | Determines the zoom range; a tight pinch vs. open hand maps to camera Z-depth.                  |

## Network Architecture

To visualize how the fractal geometry and hand tracking interact, here is the final network map:

```text
[ FRACTAL ENGINE ]               [ HAND TRACKING (MediaPipe) ]
Platonic Solids (Tetrahedron)    Webcam ──▶ [ MediaPipe Plugin ]
       │                                       │
       ▼                                       ▼
[ Copy SOP Chain ] ───────────┐          [ Select CHOP ] (Wrist/Tips)
(Method 1 or 2)               │                │
       │                      │                ▼
       ▼                      │          [ Math / Script CHOP ]
[ Geo COMP (geo1) ] ◀─────────┤          (Calculate Pinch & Remap)
       │                      │                │
       ▼                      ▼                ▼
[ Render TOP ] ◀───────── [ Camera COMP ] ◀─── [ Filter / Null CHOP ]
                                               (Smooth Data)
```

[[Hand Tracking|(y) Return to Hand Tracking]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
