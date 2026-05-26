---
title: "06_VR-AR - Computer Vision for AR"
tags:
  - vrar
  - computer-vision
  - tracking
  - ar
date: 2026-05-12
---

[[/notes/lectures/virtualaugmentedreality/05_VR-AR_tracking|Previous: (y-05) Tracking]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/07_VR-AR_Calibration|Next: (y-07) Calibration and Registration]]

## Mental Model First

- **Computer vision turns pixels into pose.** AR needs the camera image to tell the system where markers, targets, cameras, and the user are.
- **Marker tracking is controlled vision.** It makes the target easy to detect by designing the visual target.
- **Natural feature tracking is less intrusive but harder.** The system must detect, describe, match, and verify features from ordinary images.
- **SLAM adds persistence.** Instead of only detecting a known target each frame, the system tracks camera motion and builds or maintains a map.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg002_Outline.png]]

<p class="image-caption">The lecture outline covers marker tracking, multiple-camera infrared tracking, natural feature tracking, SLAM, and outdoor tracking.</p>

## 1. Marker Tracking

![[pictures/virtualaugmentedreality/06/Lecture06_Pg005_Marker_Tracking.png]]

<p class="image-caption">Marker tracking captures an image with a known camera, searches for quadrilaterals, normalizes marker content, identifies the marker, and estimates pose.</p>

The marker-tracking pipeline in the slide:

1. Capture an image with a known camera.
2. Search for quadrilaterals.
3. Normalize the quadrilateral region.
4. Identify the marker.
5. Estimate pose.

Markers are useful because they intentionally create strong image evidence. The environment is instrumented so tracking becomes easier, faster, and less ambiguous.

### Pinhole Camera Assumption

![[pictures/virtualaugmentedreality/06/Lecture06_Pg006_Pinhole_Camera.png]]

<p class="image-caption">The pinhole camera model projects a 3D point through a center of projection onto a 2D image point.</p>

The marker tracking section assumes a pinhole camera model: a 3D point projects to a 2D point through a center of projection. This is the geometric basis for recovering pose from observed image points.

## 2. Homography and Pose

![[pictures/virtualaugmentedreality/06/Lecture06_Pg009_Homography_Pose.png]]

<p class="image-caption">A planar marker allows pose estimation from a homography because the marker corners lie in one plane.</p>

For a flat marker, the corners lie on a plane. A homography describes how points on that plane map into the image. Once the system has the marker corner correspondences, it can estimate the camera-marker relationship.

Important idea:

- A planar marker gives a known local coordinate system.
- The image gives the observed 2D corner positions.
- The homography links the two.
- Pose estimation recovers the relative transformation needed for AR registration.

## 3. Multiple-Camera Infrared Tracking

![[pictures/virtualaugmentedreality/06/Lecture06_Pg011_Multiple_Camera_IR.png]]

<p class="image-caption">Multiple-camera infrared tracking detects blobs, establishes correspondences, reconstructs 3D points, matches targets, and computes absolute orientation.</p>

The multiple-camera IR pipeline:

1. Detect blobs in all images.
2. Establish point correspondences.
3. Reconstruct 3D candidate points.
4. Match candidate points to target points.
5. Compute absolute orientation.

The system often sees more candidate points than target points, so correspondence and target matching are central.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg013_Triangulation.png]]

<p class="image-caption">With two cameras, triangulation reconstructs a 3D point from matching image points and known camera geometry.</p>

Epipolar geometry narrows the correspondence search: if a point appears in one camera, the matching point in another camera must lie on an epipolar line. This makes multi-camera matching more constrained than blind search.

## 4. Natural Feature Tracking by Detection

![[pictures/virtualaugmentedreality/06/Lecture06_Pg019_Interest_Point_Detection.png]]

<p class="image-caption">Interest point detection searches for salient image points such as Harris corners, where gradients vary strongly in more than one direction.</p>

Natural feature tracking avoids artificial markers. The lecture contrast is:

| Approach          | Strength                       | Weakness                                              |
| :---------------- | :----------------------------- | :---------------------------------------------------- |
| Markers and blobs | Minimal computational demands  | Visual clutter and need to instrument the environment |
| Natural features  | No artificial targets required | More computation and more ambiguity                   |

Tracking by detection determines the camera pose from matching interest points in every frame, without relying on previous-frame motion. It is simple and robust to reinitialization, but it is computationally expensive.

## 5. Descriptors and SIFT

![[pictures/virtualaugmentedreality/06/Lecture06_Pg023_Sift.png]]

<p class="image-caption">SIFT builds a scale space, applies differences of Gaussians, and finds extrema for scale-invariant keypoints.</p>

A detected feature is not enough; it needs a descriptor. A good descriptor should be distinctive and capture the local texture neighborhood.

SIFT workflow from the slides:

- create a scale space,
- compute differences of Gaussians,
- find extrema in a 26-neighborhood,
- turn remaining keypoints into descriptors,
- match descriptors against a tracking model.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg027_Descriptor_Matching.png]]

<p class="image-caption">Descriptor matching compares feature descriptors from the current image against descriptors from the tracking model.</p>

After descriptor matching, the system still needs consistency checks. The lecture includes checks such as overall rotation consistency and line-side tests, which reject geometrically inconsistent matches.

## 6. Pose From Matches

![[pictures/virtualaugmentedreality/06/Lecture06_Pg030_P3P.png]]

<p class="image-caption">The three-point pose problem estimates camera pose from known 3D points and their observed image directions.</p>

P3P is an old geometric idea: if a camera observes known points under known angular relationships, the camera pose can be recovered. In AR, this is the final bridge from image correspondences to a pose usable for rendering registered content.

## 7. Detection vs. Incremental Tracking

Tracking by detection:

- detects targets every frame,
- is simple,
- can initialize and recover tracking,
- can be slow.

Incremental tracking:

- uses prior frame information and a motion model,
- tracks patches or features over time,
- can be fast,
- can drift or fail under large motion, blur, tilt, lighting changes, or occlusion.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg040_Detection_And_Tracking.png]]

<p class="image-caption">Combined detection and tracking uses detection for initialization and recovery, and tracking for fast frame-to-frame updates.</p>

The practical design is hybrid because detection and tracking have orthogonal strengths.

## 8. SLAM: Simultaneous Localization and Mapping

SLAM estimates camera motion while also building or maintaining a map. It is important when the system cannot assume a fully known target or environment.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg046_Keyframe_SLAM.png]]

<p class="image-caption">Keyframe SLAM repeatedly extracts or tracks features, estimates pose, chooses keyframes, adds map points, and optimizes the map.</p>

Keyframe SLAM concepts from the slides:

- repeat tracking until tracking is lost,
- extract or track features in the live image,
- match features against the map,
- estimate pose,
- add keyframes when baseline is large enough,
- add new map points,
- optimize by minimizing reprojection error through bundle adjustment.

Map optimization matters because it reduces drift over time.

## 9. Dense SLAM and KinectFusion

![[pictures/virtualaugmentedreality/06/Lecture06_Pg053_KinectFusion.png]]

<p class="image-caption">KinectFusion is a dense SLAM approach using depth input for 3D scanning and model creation.</p>

KinectFusion-style dense SLAM uses depth maps rather than only sparse features. The slide sequence includes:

- convert input depth map to a point cloud,
- compute normals,
- use iterative closest point for tracking,
- integrate depth into a volumetric representation,
- render the surface, often by raycasting the zero-level set.

This is still localization and mapping, but the map is denser than a sparse point cloud of keypoints.

## 10. Outdoor Tracking

![[pictures/virtualaugmentedreality/06/Lecture06_Pg061_Outdoor_Tracking.png]]

<p class="image-caption">Outdoor tracking faces free roaming users, unusable textures, repetitive structures, changing lighting, and weather.</p>

Outdoor AR introduces new difficulties:

- large workspaces,
- changing clouds and lighting,
- repetitive windows and facades,
- dynamic objects,
- weather,
- need for efficient search over large maps.

![[pictures/virtualaugmentedreality/06/Lecture06_Pg063_Sensor_Priors.png]]

<p class="image-caption">Sensor priors such as GPS, viewing direction, gravity alignment, and GIS data prune the outdoor localization search space.</p>

Sparse point clouds with descriptors are common, but search must be pruned. Priors can come from GPS, magnetometer viewing direction, gravity-aligned features, GIS data such as OpenStreetMap, panoramas, or hybrid SLAM.

### Applied Exam Focus

- **Marker tracking pipeline**: capture image, find quadrilaterals, normalize, identify, estimate pose.
- **Planar pose**: homography works because marker corners lie in a plane.
- **Multi-camera IR**: blob detection, correspondences, 3D reconstruction, target matching, absolute orientation.
- **Natural features**: detect interest points, create descriptors, match descriptors, verify geometry, estimate pose.
- **SIFT**: scale space, Difference of Gaussians, extrema, descriptor creation.
- **Detection vs. incremental tracking**: robust initialization vs. fast frame-to-frame tracking.
- **SLAM**: localize while mapping; keyframes and bundle adjustment manage drift.
- **Outdoor tracking**: prune the search with sensor and GIS priors.

## Self-Check

1. Why are square markers easier to track than natural objects?

> [!success]- Answer
> Square markers are designed to produce strong, unambiguous visual evidence: high contrast edges, four predictable corners, and a unique interior code. The detection pipeline can scan for quadrilaterals, normalize the warped patch, and identify the marker without solving the general object recognition problem. Natural objects do not provide those guarantees, so detection and matching are much harder.

2. What does a homography give you for a planar marker?

> [!success]- Answer
> A homography is the projective mapping between two views of a plane. For a planar marker, the four known marker corners in the marker's local 2D frame correspond to the observed 2D corners in the image, and the homography links the two. From that homography the camera pose relative to the marker (the rotation and translation that explain the corner observations) can be recovered.

3. Why is epipolar geometry useful in multiple-camera tracking?

> [!success]- Answer
> Epipolar geometry constrains the search for stereo correspondences: if a 3D point projects to a pixel in one camera, its projection in the other camera must lie on a specific line (the epipolar line). That turns 2D correspondence search into 1D search, which is much faster and rejects most false matches. Multi-camera blob tracking uses this constraint to decide which blob in camera B matches which blob in camera A.

4. What is the difference between detecting an interest point and describing it?

> [!success]- Answer
> Detection finds where a salient point sits in the image (corners, blobs, extrema of a scale-space filter). Description summarizes the local image neighborhood around that point into a vector that can be matched across images. Detection answers "is this point worth keeping?"; description answers "is this point the same as that one in another image?". Both are needed for matching across viewpoints.

5. Why combine detection and incremental tracking?

> [!success]- Answer
> Detection (tracking by detection) is robust because it re-acquires the pose from scratch each frame, so it recovers from occlusion or rapid motion, but it is expensive. Incremental tracking uses the previous frame's pose to predict the current one and only refines locally, which is much cheaper but drifts and fails after large motion. Combining them gives the speed of incremental tracking with the robustness of periodic detection-based re-initialization.

6. What does bundle adjustment optimize in SLAM?

> [!success]- Answer
> Bundle adjustment jointly refines all camera poses and all 3D point positions to minimize the total reprojection error: the difference between observed 2D feature positions in each frame and the projection of the estimated 3D points using the estimated poses. It is the global polishing step that keeps a SLAM map consistent and limits drift, especially when loop closures bring previously inconsistent observations into agreement.

---

[[/notes/lectures/virtualaugmentedreality/05_VR-AR_tracking|Previous: (y-05) Tracking]] | [[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/07_VR-AR_Calibration|Next: (y-07) Calibration and Registration]]
