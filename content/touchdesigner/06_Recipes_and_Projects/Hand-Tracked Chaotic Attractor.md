---
title: "Hand-Tracked Chaotic Attractor"
tags:
  - touchdesigner
  - td/tutorials
  - td/tracking
  - td/interaction
  - td/mediapipe
  - td/generative
  - td/sop
  - td/chop
  - td/chaos
date: 2026-03-08
---

**Related:** [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] · [[Hand Tracking|(y-) Hand Tracking]] · [[Sierpinski Tetrahedron with Hand Tracking|(y-) Sierpinski with Hand Tracking]]

> Tested on M1 Pro · TD 2023+. Performance numbers in Part 7 are from that machine specifically — results will vary.

---

## Overview

Want to make your TouchDesigner projects react to your hand movements in real time, without installing any extra plugins? This tutorial shows you how to drive a mesmerizing Lorenz attractor (you know, that classic butterfly-shaped chaotic system) using nothing but Python scripts in TouchDesigner and your webcam. The best part? Everything runs natively, so you won't need to juggle external dependencies or worry about performance hits from plugins.

```
Webcam → Script CHOP (MediaPipe) → Filter/Lag CHOPs → Math CHOPs
  → Script SOP (Lorenz) → Geo COMP → Render TOP → Post FX → Output
```

See also: [[notes/random/lorenz-attractor|(y-) The Lorenz Attractor]] — the maths behind the system.

---

## Part 1 — Node layout

Create these inside `/project1`:

### Tracking

| Node          | Type        | Notes                         |
| ------------- | ----------- | ----------------------------- |
| `script_hand` | Script CHOP | MediaPipe code lives here     |
| `filter_hand` | Filter CHOP | Smooth jitter, width ~5       |
| `lag_hand`    | Lag CHOP    | Lag In: 0.08, Lag Out: 0.15   |
| `null_ctrl`   | Null CHOP   | Tap point for downstream refs |

### Geometry

| Node            | Type        | Notes                  |
| --------------- | ----------- | ---------------------- |
| `script_lorenz` | Script SOP  | Lorenz code lives here |
| `geo_attractor` | Geo COMP    | SOP = `script_lorenz`  |
| `cam1`          | Camera COMP | Translate Z = 8        |
| `light1`        | Light COMP  | Default is fine        |
| `render1`       | Render TOP  | 1920×1080              |

### Post FX

```
render1 → level1 → bloom1 → feedback1 ┐
                                        ↓
                              composite1 → null_out
```

In `composite1`: Operation → **Over**. Wire `bloom1` into input 0, `feedback1` into input 1, then wire `composite1` back into `feedback1`. Set `feedback1` Opacity to **0.92–0.96** for trails.

### Output

| Node      | Type        | Notes                 |
| --------- | ----------- | --------------------- |
| `window1` | Window COMP | Operator → `null_out` |

---

## Part 2 — MediaPipe Script CHOP

Install outside TD first:

```bash
pip install mediapipe opencv-python
```

Create `script_hand` (Script CHOP) and paste this into its DAT:

```python
# script_hand callbacks DAT
# Dependencies: mediapipe, opencv-python (installed outside TD)

import cv2
import mediapipe as mp
import math
import time

def _get_state(op):
    """Use op.store for safe persistent state between cooks."""
    if 'state' not in op.store:
        op.store['state'] = {
            'cap': None,
            'hands': None,
            'last_t': time.time(),
            'last_x': 0.5,
            'last_y': 0.5,
        }
    return op.store['state']

def _init(op):
    st = _get_state(op)
    if st['cap'] is None:
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        st['cap'] = cap
    if st['hands'] is None:
        mp_hands = mp.solutions.hands
        st['hands'] = mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            model_complexity=0,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.6,
        )

def onSetupParameters(scriptOp):
    pass  # no custom params needed on this CHOP

def onCook(scriptOp):
    _init(scriptOp)
    st = _get_state(scriptOp)

    scriptOp.clear()
    for name in ['hand_present', 'x', 'y', 'pinch', 'vel']:
        scriptOp.appendChan(name)

    ok, frame = st['cap'].read()
    if not ok:
        scriptOp['hand_present'][0] = 0
        scriptOp['x'][0] = st['last_x']
        scriptOp['y'][0] = st['last_y']
        scriptOp['pinch'][0] = 0.0
        scriptOp['vel'][0] = 0.0
        return

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = st['hands'].process(frame_rgb)

    now = time.time()
    dt = max(1e-4, now - st['last_t'])
    st['last_t'] = now

    if results.multi_hand_landmarks:
        lm = results.multi_hand_landmarks[0].landmark

        # Palm center: average wrist + 4 MCP joints
        palm_idx = [0, 5, 9, 13, 17]
        cx = sum(lm[i].x for i in palm_idx) / len(palm_idx)
        cy = 1.0 - sum(lm[i].y for i in palm_idx) / len(palm_idx)  # flip Y

        # Pinch: thumb tip (4) to index tip (8), normalized 0..1
        pdx = lm[4].x - lm[8].x
        pdy = lm[4].y - lm[8].y
        pinch_dist = math.sqrt(pdx * pdx + pdy * pdy)
        # ~0.25 = open, ~0.05 = closed
        pinch = max(0.0, min(1.0, (0.25 - pinch_dist) / 0.20))

        vx = (cx - st['last_x']) / dt
        vy = (cy - st['last_y']) / dt
        vel = min(1.0, math.sqrt(vx * vx + vy * vy) * 0.015)

        st['last_x'] = cx
        st['last_y'] = cy

        scriptOp['hand_present'][0] = 1.0
        scriptOp['x'][0] = cx
        scriptOp['y'][0] = cy
        scriptOp['pinch'][0] = pinch
        scriptOp['vel'][0] = vel
    else:
        scriptOp['hand_present'][0] = 0.0
        scriptOp['x'][0] = st['last_x']
        scriptOp['y'][0] = st['last_y']
        scriptOp['pinch'][0] = 0.0
        scriptOp['vel'][0] = 0.0
```

> `op.store` keeps state between cooks without breaking on network reloads. Don't use `globals()` here.

```
script_hand → filter_hand → lag_hand → null_ctrl
```

---

## Part 3 — Control mapping

> One Math CHOP can't remap different channels to different ranges — you need a separate one per channel.

### Option A — Separate Math CHOPs

**`math_sigma`** — channel `x`, From 0→1, To 8→20, rename output to `sigma`

**`math_rho`** — channel `y`, From 0→1, To 20→45, rename output to `rho`

**`math_beta`** — channel `pinch`, From 0→1, To 1.8→3.5, rename output to `beta`

Merge them: `math_sigma + math_rho + math_beta → merge_params`

### Option B — Expressions directly in Script SOP parameters

Skip the Math CHOPs. Type into the parameter fields of `script_lorenz`:

- **Sigma**: `tdu.remap(op('null_ctrl')['x'][0], 0, 1, 8, 20)`
- **Rho**: `tdu.remap(op('null_ctrl')['y'][0], 0, 1, 20, 45)`
- **Beta**: `tdu.remap(op('null_ctrl')['pinch'][0], 0, 1, 1.8, 3.5)`

Start with Option B — it's less to set up.

---

## Part 4 — Lorenz Script SOP

Create a **Script SOP** named `script_lorenz`.

### Custom parameters (Gear icon → Custom Parameters)

| Name     | Type  | Default |
| -------- | ----- | ------- |
| `Sigma`  | Float | 10.0    |
| `Rho`    | Float | 28.0    |
| `Beta`   | Float | 2.667   |
| `Points` | Int   | 6000    |
| `Dt`     | Float | 0.005   |
| `Scale`  | Float | 0.08    |

### DAT code

```python
def onCook(scriptOp):
    scriptOp.clear()

    sigma = float(scriptOp.par.Sigma)
    rho   = float(scriptOp.par.Rho)
    beta  = float(scriptOp.par.Beta)
    n     = int(scriptOp.par.Points)
    dt    = float(scriptOp.par.Dt)
    s     = float(scriptOp.par.Scale)

    x, y, z = 0.1, 0.0, 0.0

    poly = scriptOp.appendPoly(n, closed=False, addPoints=True)

    for i in range(n):
        dx = sigma * (y - x)
        dy = x * (rho - z) - y
        dz = x * y - beta * z
        x += dx * dt
        y += dy * dt
        z += dz * dt

        pt = scriptOp.points[i]
        pt.x = x * s
        pt.y = y * s
        pt.z = z * s
```

In `geo_attractor` parameters → SOP path = `../script_lorenz`

---

## Part 5 — Render setup

**Geo COMP (`geo_attractor`):** Render on, Primitive Type → Line (or Point for a dot cloud), Constant MAT with a bright colour.

**Camera (`cam1`):** Translate Z = 8.

**Render TOP (`render1`):** 1920×1080, Camera `../cam1`, background black.

**Post FX:**

```
render1
  → level1       (Brightness: 1.2, Gamma: 0.9)
  → bloom1       (Threshold: 0.3, Size: 0.015)
  → composite1   (input 0 = bloom1, input 1 = feedback1, Op = Over)
  ↑___ feedback1 ← composite1   (Opacity: 0.93)

composite1 → null_out
```

See [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]] for how the feedback chain works.

---

## Part 6 — Output

In `window1`: Operator → `../null_out`, match render resolution. Open Window or Perform Mode (F1).

---

## Part 7 — Performance (M1 Pro)

These numbers are from my machine — use them as a rough reference.

| Setting              | Value                      |
| -------------------- | -------------------------- |
| Starting point count | 4,000–6,000                |
| Safe target          | 20,000–40,000              |
| MediaPipe resolution | 640×480                    |
| Cook mode            | Realtime                   |
| Turn off             | All viewers during perform |
| TD build             | 2023+ recommended          |

If CPU spikes, reduce Points first, then lower dt a little. Add a Timer CHOP to run the Script CHOP at 30fps if you want to decouple tracking from render framerate. Keep `model_complexity=0` in MediaPipe.

---

## Where to go from here

- **Gesture switching** — detect open hand vs fist to swap between Lorenz, Rössler, and Thomas attractors
- **Colour reaction** — map `vel` to hue shift in a GLSL MAT, see [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Introduction to GLSL]]
- **GPU particles** — replace the Script SOP with a feedback TOP based solver for 500k+ particles, see [[5 Ways To Make Particles]]

---

## Related

- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]]
- [[Hand Tracking|(y-) Hand Tracking]]
- [[Sierpinski Tetrahedron with Hand Tracking|(y-) Sierpinski with Hand Tracking]]
- [[notes/random/lorenz-attractor|(y-) The Lorenz Attractor]]
- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]]
- [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]]
- [[touchdesigner/02_The_Operators/SOPs/index|(y-) SOPs]]
- [[touchdesigner/02_The_Operators/CHOPs/index|(y-) CHOPs]]

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]]

---
