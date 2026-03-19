---
title: "MediaPipe Pose Tracking"
tags:
  - touchdesigner
  - td/recipes
  - posetracking
  - mediapipe
  - avatar
  - interaction
  - recipes
date: 2026-03-16
---

Want to build a digital character that mirrors your every move? This recipe shows you how to use **MediaPipe** to track your full body (skeleton) in real time. We'll use this data to drive interactive 2D and 3D avatars.

> [!info] Before You Start
> You will need to download the **MediaPipe TouchDesigner Plugin** by Torin Blankensmith.
> [Download it here](https://github.com/torinmb/mediapipe-touchdesigner/releases) (get the `release.zip`).

---

## 1. Setup the Plugin

1.  **Extract the Zip:** Place the `toxes/` folder right next to your `.toe` project file.
2.  **Add to TD:**
    - Press **Tab** and add a **Base COMP**. Name it `mediapipe_pose`.
    - Inside, drag in `MediaPipe.tox` and `Pose Tracking.tox`.
3.  **Turn it on:**
    - Click the `MediaPipe` node.
    - In the parameters, find **Pose Tracking** and toggle it **On**.
    - Set your **Webcam** in the dropdown.

---

## 2. Understanding the Data

The **Pose Tracking** node gives you 33 points (landmarks) representing your joints:

- **Upper Body:** Shoulders, Elbows, Wrists, Nose, Ears.
- **Lower Body:** Hips, Knees, Ankles, Heels, Toes.

Each point has an **X, Y, and Z** coordinate (0 to 1).
_Note: Y is often 0 at the top and 1 at the bottom._

---

## 3. Extracting Your Hands

Let's grab your wrist positions to drive some visuals.

1.  Add a **Select CHOP** and connect it to the output of the `Pose Tracking` node.
2.  In the **Channel Names** parameter, type: `P1_wrist_left_* P1_wrist_right_*`.
    - _The `_` grabs X, Y, and Z all at once.\*
3.  Add a **Math CHOP**. In the "Range" tab, set **From Range** `0 to 1` and **To Range** `-1 to 1`. This centers the data for 3D space.
4.  Add a **Null CHOP** and name it `HAND_DATA`.

---

## 4. Your First Project: The "Skeleton Puppet"

Let's make two spheres that follow your hands in 3D space.

1.  **The Shape:** Add a **Sphere SOP**.
2.  **The Container:** Connect it to a **Geometry COMP**.
3.  **Instancing:**
    - Go to the **Instance** tab. Turn **Instancing** → `On`.
    - Drag `HAND_DATA` into the **Instance CHOP** field.
4.  **The Mapping:**
    - Map **Translate X** to `P1_wrist_left_x`.
    - Map **Translate Y** to `P1_wrist_left_y`.
    - Map **Translate Z** to `P1_wrist_left_z`.
    - _Repeat for the right hand by adding another Geometry COMP or using a Merge CHOP._

---

## Troubleshooting

- **"The skeleton is upside down."** — Use a **Math CHOP** on the Y channel with **Multiply** set to `-1`.
- **"It's lagging."** — Pose tracking is very heavy. Make sure **Pose Tracking** is the _only_ model turned on in the MediaPipe COMP.
- **"The dots are shaky."** — Add a **Lag CHOP** between your Select CHOP and your Null to smooth out the movement.

---

## Next Steps

- **Draw the Bones:** Use the **Add SOP** to connect the dots (wrist to elbow, elbow to shoulder) to draw a stick figure.
- **Jump Trigger:** Detect when your `hip` Y-position goes above a certain height to trigger a sound.
- **Dance Visuals:** Use your movement speed (velocity) to drive the color of a background noise field.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **Math Range (-1 to 1)** | Determines how much of the 3D screen your movements fill. |
| **Lag / Smoothing** | Higher = puppet follows with "weight" and grace; Lower = puppet is "twitchy" and mirrors raw data. |
| **Hip Y-Threshold** | Adjusts the "sensitivity" for detecting a jump or a crouch. |
| **Sphere Scale** | Higher = large, bulbous joints; Lower = tiny, delicate points of light. |

## Network Architecture

To visualize how the pose tracking data flows, here is the final network map:

```text
[ VIDEO INPUT ]                  [ MEDIAPIPE PLUGIN ]
Webcam TOP ──────────────────▶ [ MediaPipe.tox ]
                                      │
                                      ▼
[ SKELETON DECODING ]          [ Pose Tracking.tox ]
                                      │
                                      ▼
[ JOINTS ]                     [ Select CHOP ] (P1_wrist_*)
                                      │
                                      ▼
[ COORDINATE REMAP ]           [ Math CHOP ] (0-1 to -1-1)
                                      │
                                      ▼
[ SMOOTHING ]                  [ Lag / Filter CHOP ]
                                      │
                                      ▼
[ EXPORT ]                     [ Null CHOP (HAND_DATA) ]
                                      │
                                      ▼
[ 3D PUPPET ]                  [ Geo COMP ] ◀──────────────┐
                               (Instancing On)             │
                                      │                    │
[ RENDERING ]                  [ Sphere SOP ] ────────▶ [ Render TOP ]
```

### Data Flow Explanation
1.  **Plugin Layer:** `MediaPipe.tox` is the engine. It runs the "BlazePose" model in an embedded browser and sends the 33 3D landmark points into TouchDesigner.
2.  **Joint Decoding:** The `Pose Tracking.tox` component decodes those 33 points into named channels for every joint (shoulders, elbows, wrists, etc.).
3.  **Data Extraction:** We use a `Select CHOP` to grab just the `wrist` channels. This gives us the X, Y, and Z positions of both your hands.
4.  **The Bridge (Instancing):** The `Geo COMP` takes the `HAND_DATA` CHOP and uses it to "spawn" two `Sphere SOPs` on the GPU — one for each hand.
5.  **Coordinate Remap:** Because MediaPipe uses a 0-1 (top-left) origin, we use a `Math CHOP` to remap this to TouchDesigner's centered 3D space (-1.0 to 1.0), ensuring the spheres move logically on screen.

---
[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
