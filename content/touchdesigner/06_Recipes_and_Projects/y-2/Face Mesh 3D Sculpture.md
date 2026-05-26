---
title: "Face Mesh 3D Sculpture"
tags:
  - touchdesigner
  - td/recipes
  - mediapipe
  - facemesh
  - pointcloud
  - webcam
  - recipes
date: 2026-05-26
---

MediaPipe tracks 468 points across your face every frame. This recipe turns them into a glowing 3D point cloud - a live digital sculpture that tilts and breathes with you. Unlike the facial expression recipe, the output here is geometry, not blendshape values.

> [!info] Operator Families in this Recipe
>
> - **COMPs:** MediaPipe plugin for face landmark extraction.
> - **CHOPs:** Converting DAT landmark data to positional channels.
> - **SOPs:** 3D geometry from CHOP data.
> - **TOPs:** Rendering and post-processing.

---

## Before You Start

You need the free MediaPipe plugin (`mediapipe.tox`) from [github.com/torinmb/mediapipe-touchdesigner](https://github.com/torinmb/mediapipe-touchdesigner).

---

## Part 1: MediaPipe Setup

1. Add a **Video Device In TOP** (webcam) → **Null TOP** named `CAM`.
2. Drag `mediapipe.tox` into the network.
3. Connect `CAM` to the first input of `mediapipe1`.
4. Set **Model** → `FaceMesh` and enable tracking.

Click the **FaceMesh** table output. You should see 468 rows with at least `x`, `y`, `z` columns. If the table is empty, move your face into frame and wait.

---

## Part 2: Convert Landmarks to CHOP Channels

1. **DAT to CHOP** connected to the FaceMesh table.
   - **First Row is Names** → on.
   - **Output** → `Channel per Column`. Creates one channel per column, 468 samples each.
2. **Select CHOP** → **Channel Names** `x y z`.
3. **Math CHOP** (Range tab):
   - **From Range** → `0` to `1`, **To Range** → `-0.5` to `0.5`.
   - This centers the face at the origin. Y needs to be flipped separately (MediaPipe y=0 is top; TD y=0 is center).

> [!tip] Flip only the Y channel
> In the Math CHOP Range tab, set the **Channel** field to `y` and use **To Range** `0.5` to `-0.5`. Leave X and Z at `-0.5` to `0.5`.

4. **Rename CHOP** → From `x y z`, To `tx ty tz`.
5. **Null CHOP** named `FACE_POINTS`.

---

## Part 3: Build the Point Cloud Geometry

1. **CHOP to SOP** with `FACE_POINTS` as input → **TX** `tx`, **TY** `ty`, **TZ** `tz`.

   Activate the viewer flag. You should see a face-shaped cluster of 468 points.

2. **Null SOP** named `FACE_GEO`.

---

## Part 4: Render as Instanced Spheres

1. Add a **Geo COMP**. Inside it: **Sphere SOP** (Radius `0.004`) → `out1`.
2. In the Geo COMP's **Instance** page:
   - **Instance CHOP** → `FACE_POINTS`.
   - **Translate X** → `tx`, **Translate Y** → `ty`, **Translate Z** → `tz`.
3. Add **Camera COMP** (Translate Z `1.5`), **Light COMP**, **Render TOP**.
4. Assign a **Phong MAT** → **Diffuse Color** cyan (`0, 1, 1`).

> [!info] Point Sprites vs. Instanced Spheres
> For a faster, flatter look, connect `FACE_GEO` directly to a Geo COMP and use a **Point Sprite MAT** instead. Instanced spheres are more sculptural but heavier.

---

## Part 5: Animate and Polish

1. Add a **Noise CHOP** with 3 channels (`noise_x`, `noise_y`, `noise_z`) at 468 samples.
   - **Amplitude** → `0.01`, **Phase** → `absTime.seconds * 0.5`.
2. **Math CHOP** (Add): sum `FACE_POINTS` and the Noise CHOP. Feed the result into Instancing instead of `FACE_POINTS` directly.
3. **Bloom TOP** (Threshold: `0.5`, Intensity: `0.8`) after the Render TOP.
4. **Over TOP**: fluid render over `CAM`.
5. **Null TOP** named `OUT`.

---

## Variations

| Variation | What to change |
| --- | --- |
| **Color by depth** | Bind `tz` to the Phong MAT diffuse channels via CHOP Reference - far = red, close = blue. |
| **Face wireframe** | Use the landmark data to drive a `Lines SOP` or the face mesh connectivity output. |
| **Audio-reactive jitter** | Swap Noise CHOP amplitude for an **Analyze CHOP** RMS value - your voice makes the face flutter. |
| **Multiple faces** | Set MediaPipe to multi-face mode (up to 5 faces) and offset each point cloud in Z. |

---

## Troubleshooting

- **"CHOP to SOP shows no points."** - `FACE_POINTS` must have exactly 3 channels named `tx`, `ty`, `tz` with 468 samples each. Open its viewer to inspect.
- **"Point cloud is upside-down or mirrored."** - Check that the Y range is `0.5` to `-0.5` (flipped). For a mirrored cloud, add a `Flip TOP` before MediaPipe.
- **"No face data from MediaPipe."** - The face mesh needs a well-lit, fully visible face. Extreme side angles or occlusion drops tracking.
- **"Instancing jumps."** - Add a **Lag CHOP** (Lag: `0.05`) between `FACE_POINTS` and the Geo COMP instancing input.

---

## Next Steps

- **Face-driven audio:** Select individual landmarks (e.g., `tx` of landmark 13 = upper lip center) and bind to audio synthesis parameters.
- **Deforming mesh:** Import a face mesh OBJ and use `SOP to CHOP` / `CHOP to SOP` round-tripping to displace its vertices with live MediaPipe data.
- **Landmark trails:** Feed the point cloud through a `Trail CHOP` to record the last N positions per landmark, then render as lines for a motion-history sculpture.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Sphere Radius** | Larger = chunky blobs; Smaller = delicate dust cloud. |
| **Noise Amplitude (jitter)** | Higher = erratic shimmer; Lower = clean anatomical tracking. |
| **Noise Phase Speed** | Higher = fast organic ripple; Lower = slow, breathing quality. |
| **Bloom Intensity** | Higher = glowing ghost; Lower = crisp technical point cloud. |

## Network Architecture

```text
Video Device In ──▶ CAM ──▶ mediapipe1 (FaceMesh)
                                 │
                           FaceMesh DAT (468 rows)
                                 │
                          DAT to CHOP → Select (x y z) → Math (remap) → Rename → FACE_POINTS
                                 │
                          + Noise CHOP (jitter) via Add Math CHOP
                                 │
                   Geo COMP (Sphere SOP, instanced at FACE_POINTS)
                                 │
                          Camera + Light + Render TOP
                                 │
                          Bloom TOP ──▶ Over (with CAM) ──▶ OUT
```

---

Sources:
- [Face, Hand, Pose Tracking with MediaPipe GPU Plugin - Derivative](https://derivative.ca/community-post/tutorial/face-hand-pose-tracking-more-touchdesigner-mediapipe-gpu-plugin/68278)
- [MediaPipe TouchDesigner Plugin - GitHub](https://github.com/torinmb/mediapipe-touchdesigner)

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
