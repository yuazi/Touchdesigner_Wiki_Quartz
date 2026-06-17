---
title: "Projection-Mapped Memory Garden"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - projectionmapping
  - mediapipe
  - installation
date: 2026-06-18
---

The finale. Point a projector at a real wall or object, and digital flowers bloom across it. When someone walks up, the garden wakes: petals unfurl from where they stand, captured by a webcam running **MediaPipe** presence detection. This combines everything in the chapter, projection mapping plus camera tracking plus generative growth, into one installation. It is the piece to build when you want to turn a room into a surprise.

> [!info] Before You Start
> - You need a **projector** and a **webcam**, ideally mounted near the projector facing the same wall.
> - You need the **MediaPipe TouchDesigner plugin**: [download here](https://github.com/torinmb/mediapipe-touchdesigner/releases).
> - Helpful background: TD's projection-mapping workflow (the **Camera Schnappr** / palette mapping tools).

---

## 1. Map the Surface

1.  Build your garden visuals in a **Render TOP** or composite as usual.
2.  Use TouchDesigner's projection-mapping tool (the **Camera Schnappr** palette component, or a **Geometry COMP** with corner-pin) to warp the output so it lines up with the real wall or object.
3.  Calibrate by dragging corner points until the projected image sits exactly on the surface.

> [!tip] Dark room wins
> Projection mapping lives and dies by contrast. The darker the room, the more the flowers glow on the wall.

---

## 2. Detect Presence

1.  Run the webcam through MediaPipe's **Segmentation** or **Pose** model.
2.  Get the person's horizontal position and proximity (reuse the proximity trick from [[touchdesigner/08_Trending_2026/Interactive Portrait Wall|Interactive Portrait Wall]]).
3.  Map their position in the camera frame to a position on the projected wall. Calibrate so "standing here" lights up "there."

---

## 3. Grow the Garden

1.  Place flower sprites or instanced 3D flowers as a [[touchdesigner/03_Rendering_and_Output/Instancing|instanced]] field across the wall.
2.  Keep each flower's bloom amount at 0 by default (closed bud).
3.  Where a person stands, raise the bloom amount of nearby flowers over a second or two: petals open, colour saturates, a soft glow rises.
4.  When they leave, let blooms slowly close again. Persistence makes it feel like the garden remembers.

---

## 4. The Memory Layer

This is what makes it personal:

1.  Hide a few special flowers that, when bloomed, reveal a photo or a short message (a date, a place, an inside joke).
2.  Trigger gentle ambient audio that swells with the total bloom in the scene.
3.  Let the garden idle with a slow breathing animation so it is alive even in an empty room.

---

## Troubleshooting

- **"The projection does not line up."** - Recalibrate the corner pins, and do not move the projector or wall afterward. Mark the projector's feet with tape.
- **"Blooms trigger in the wrong place."** - Your camera-to-wall mapping is off. Re-check the calibration: walk to known spots and adjust the position mapping until it matches.
- **"Washed out / invisible."** - Too much ambient light. Darken the room and raise the bloom/contrast of the visuals.
- **"Tracking is jittery."** - Smooth the presence position with a **Lag CHOP**; the garden should respond calmly.

---

## Next Steps

- **Two visitors:** Let two people grow separate patches that merge into a shared bloom when they stand together.
- **Seasons:** Cycle the palette slowly so the garden drifts through spring to autumn over the evening.
- **AI bloom:** Replace the sprites with [[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|live AI-painted]] flowers for an endlessly varied garden.

---

## Parameter Tuning & Behavior

| Parameter           | Behavior                                                                    |
| :------------------ | :-------------------------------------------------------------------------- |
| **Bloom radius**     | Larger = a wide swath wakes around the visitor; Smaller = a tight footprint. |
| **Bloom rise time**  | Faster = instant, playful; Slower = graceful, cinematic unfurling.           |
| **Close (fade) time** | Slower = the garden "remembers" longer; Faster = resets quickly.            |
| **Presence lag**     | Higher = calm, smooth response; Lower = snappy but jittery.                  |

## Network Architecture

```text
[ TRACKING ]                   [ Video Device In TOP ] (webcam)
                                      │
                                      ▼
                               [ MediaPipe.tox ] (Segmentation/Pose)
                                      │
                                      ▼
                       [ position + proximity → CHOP, Lag ]  (WALL_POS)
                                      │
                                      ▼
[ GARDEN ]      [ Flower instances ] ◀── bloom amount driven near WALL_POS
                                      │  (rise fast, fall slow = "memory")
                                      ▼
[ COMPOSITE ]                  [ Render TOP ] (+ glow, ambient breathing)
                                      │
                                      ▼
[ MAPPING ]                    [ Camera Schnappr / corner-pin warp ]
                                      │
                                      ▼
[ OUTPUT ]                     [ Window/Projector OUT ]  ──▶ real wall
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
