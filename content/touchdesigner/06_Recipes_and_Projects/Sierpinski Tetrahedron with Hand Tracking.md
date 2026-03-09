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

**Related:** [[Hand Tracking Tutorial|→ Hand Tracking Tutorial]] · [[Hand Tracking|↑ Back to Hand Tracking]] · [[Hand-Tracked Chaotic Attractor|→ Hand-Tracked Chaotic Attractor]]

---

## Overview

This tutorial walks you through building a **3D Sierpinski Tetrahedron** (the 3D equivalent of the Sierpinski triangle) using a clean instancing/copy approach, and then mapping hand data from MediaPipe to control the orientation and zoom.

---

## Part 1: Generating the 3D Sierpinski Tetrahedron

Instead of writing complex L-System rules, we use TouchDesigner's `Copy SOP` to recursively place smaller tetrahedrons onto the vertices of larger ones. It's elegant and highly customizable.

### 1. Create the Base Geometry

- Add a **Platonic Solids SOP** and set its _Type_ to `Tetrahedron`. Name it `platonic1`. This acts as our "template" layout — it has 4 points.
- Add a second **Platonic Solids SOP**, also set to `Tetrahedron`. Name it `platonic2`.
- Connect `platonic2` to a **Transform SOP** and set the _Uniform Scale_ to `0.5`.

### 2. The First Iteration

- Add a **Copy SOP**.
- Connect the **Transform SOP** to the _left_ input (Primitives to Copy).
- Connect `platonic1` to the _right_ input (Template Point SOP).

> **Result:** You should now see a larger tetrahedron made of 4 smaller ones. This is Iteration 1.

### 3. The Second Iteration (and beyond)

- Add a new **Transform SOP** after the `Copy SOP` and set its _Uniform Scale_ to `0.5`.
- Add a second **Copy SOP**.
- Connect the new **Transform SOP** to the _left_ input.
- Connect your original `platonic1` to the _right_ input.

> **Result:** Iteration 2. Repeat the "Transform (`0.5`) → Copy (onto `platonic1`)" chain 1 or 2 more times to increase the fractal detail.

### 4. Prepare for Rendering

- Connect your final `Copy SOP` to an **Attribute Create SOP** with _Compute Normals_ enabled so lighting works correctly, then into a **Geometry COMP** (`geo1`).
- Add a **Camera COMP**, a **Light COMP**, and a **Render TOP** to complete the standard 3D rendering pipeline.
- Add an **Out TOP** to view your final result.

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
  h1_wrist:x h1_wrist:y
  ```
- **For Zoom:** Track the pinch distance between thumb and index finger. Add another **Select CHOP** and select:
  ```
  h1_thumb_tip:x h1_thumb_tip:y h1_index_finger_tip:x h1_index_finger_tip:y
  ```

---

## Part 3: Mapping Hand Data to Geometry and Camera

Raw MediaPipe data is normalized (usually between 0 and 1) and jittery. We need to do some math and smoothing.

### 1. Controlling Orientation

- Connect the wrist **Select CHOP** (`h1_wrist:x`, `h1_wrist:y`) to a **Math CHOP**.
- In the Math CHOP's _Range_ tab, map _From Range_ `[0, 1]` to _To Range_ `[-180, 180]` (degrees).
- Connect this to a **Filter CHOP** to smooth the data — a filter width of `0.1` to `0.3` works well.
- Connect the Filter CHOP to a **Null CHOP**.
- Make `geo1` active. Drag the smoothed `x` channel to _Rotate Y_ and the `y` channel to _Rotate X_ (inverting the axes usually feels more intuitive when tracking hands).

### 2. Controlling Zoom (Pinch Gesture)

To zoom, calculate the distance between the thumb tip and index finger tip.

- Connect the finger tip **Select CHOP** to a **Math CHOP**.
- Use an **Expression CHOP** with the Pythagorean theorem to compute the distance:
  ```python
  math.sqrt((val(1)-val(3))**2 + (val(2)-val(4))**2)
  ```
- Connect that distance to another **Math CHOP** to remap the pinch range. For example, map _From Range_ `[0.05, 0.3]` (tight pinch vs. open hand) to a _To Range_ for the camera's Z translation, such as `[3, 10]`.
- Add a **Filter CHOP** for smoothness, then a **Null CHOP**.
- Drag the final distance channel to the _Translate Z_ (`tz`) parameter of the **Camera COMP**.

---

## Troubleshooting

| Problem           | Fix                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Laggy framerate   | Recursive geometries get heavy fast. 3–4 iterations are usually fine; 6–7 will crash your framerate.                                          |
| Hand disappearing | MediaPipe loses tracking on fast movement. Use a **Filter CHOP** to prevent the geometry from snapping violently back to default coordinates. |

[[touchdesigner/06_Recipes_and_Projects/index|↑ Back to Recipes & Projects]]

---
