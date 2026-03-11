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

> Tested architecture for M1 Pro · TouchDesigner 2023+ (Apple Silicon native build)

---

## Overview

**Goal:** Real-time Lorenz attractor visuals driven by MediaPipe hand tracking via webcam — no plugin required, fully scripted in Python.

**Signal flow:**

```
Webcam → Script CHOP (MediaPipe) → Filter/Lag CHOPs → Math CHOPs
  → Script SOP (Lorenz) → Geo COMP → Render TOP → Post FX → Output
```

See also: [[notes/lorenz-attractor|(y-) The Lorenz Attractor]] — the maths behind the system.

---

## Part 1 — Node Layout

Create the following nodes inside `/project1`:

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

### Post FX (chain in order)

```
render1 → level1 → bloom1 → feedback1 ┐
                                        ↓
                              composite1 → null_out
```

> **Feedback wiring (critical):** In `composite1`, set Operation to **Over**.
> Wire `bloom1` into input 0 and `feedback1` into input 1.
> Wire `composite1` → `feedback1` (this closes the loop).
> Set `feedback1` Opacity to **0.92–0.96** for trails.

### Output

| Node      | Type        | Notes                 |
| --------- | ----------- | --------------------- |
| `window1` | Window COMP | Operator → `null_out` |

---

## Part 2 — MediaPipe Script CHOP

Install dependencies **outside TD** first:

```bash
pip install mediapipe opencv-python
```

Create `script_hand` (Script CHOP). Paste the following into its **DAT** (the callbacks script):

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

    # Always recreate channels each cook
    scriptOp.clear()
    for name in ['hand_present', 'x', 'y', 'pinch', 'vel']:
        scriptOp.appendChan(name)

    ok, frame = st['cap'].read()
    if not ok:
        # Camera read failed — hold last values
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

        # Pinch: distance thumb tip (4) to index tip (8), normalized 0..1
        pdx = lm[4].x - lm[8].x
        pdy = lm[4].y - lm[8].y
        pinch_dist = math.sqrt(pdx * pdx + pdy * pdy)
        # ~0.25 = open, ~0.05 = closed pinch
        pinch = max(0.0, min(1.0, (0.25 - pinch_dist) / 0.20))

        # Velocity (normalized)
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

> **State storage:** `op.store` is used instead of `globals()` — it's the TD-native way to persist data between cooks and won't break on network reloads.

**CHOP chain:**

```
script_hand → filter_hand → lag_hand → null_ctrl
```

---

## Part 3 — Control Mapping

> ⚠️ A single Math CHOP cannot remap **different channels to different ranges**. You need **three separate Math CHOPs**, one per channel being remapped.

### Option A — Separate Math CHOPs (recommended)

Create three Math CHOPs after `null_ctrl`:

**`math_sigma`** — Select channel `x`

- From Range: 0 → 1
- To Range: 8 → 20
- Rename output channel to `sigma`

**`math_rho`** — Select channel `y`

- From Range: 0 → 1
- To Range: 20 → 45
- Rename output channel to `rho`

**`math_beta`** — Select channel `pinch`

- From Range: 0 → 1
- To Range: 1.8 → 3.5
- Rename output channel to `beta`

Then use a **Merge CHOP** to combine: `math_sigma + math_rho + math_beta → merge_params`

### Option B — Expressions in Script SOP parameters (simpler)

Skip extra Math CHOPs entirely. In the Script SOP custom parameters, use `tdu.remap()` expressions directly:

- **`Sigma`** parameter:
  ```python
  tdu.remap(op('null_ctrl')['x'][0], 0, 1, 8, 20)
  ```
- **`Rho`** parameter:
  ```python
  tdu.remap(op('null_ctrl')['y'][0], 0, 1, 20, 45)
  ```
- **`Beta`** parameter:
  ```python
  tdu.remap(op('null_ctrl')['pinch'][0], 0, 1, 1.8, 3.5)
  ```

Option B is the easier starting point — type directly into the parameter fields of `script_lorenz`.

---

## Part 4 — Lorenz Script SOP

Create a **Script SOP** named `script_lorenz`.

### Custom Parameters (Gear icon → Custom Parameters)

| Name     | Type  | Default |
| -------- | ----- | ------- |
| `Sigma`  | Float | 10.0    |
| `Rho`    | Float | 28.0    |
| `Beta`   | Float | 2.667   |
| `Points` | Int   | 6000    |
| `Dt`     | Float | 0.005   |
| `Scale`  | Float | 0.08    |

### Script SOP DAT code

```python
def onCook(scriptOp):
    scriptOp.clear()

    sigma = float(scriptOp.par.Sigma)
    rho   = float(scriptOp.par.Rho)
    beta  = float(scriptOp.par.Beta)
    n     = int(scriptOp.par.Points)
    dt    = float(scriptOp.par.Dt)
    s     = float(scriptOp.par.Scale)

    # Seed position (slightly off-origin to start on attractor)
    x, y, z = 0.1, 0.0, 0.0

    # Build polyline
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

### Wire Script SOP to Geo COMP

In `geo_attractor` parameters → SOP path = `../script_lorenz`

---

## Part 5 — Render & Display Setup

### Geo COMP (`geo_attractor`)

- Render tab → **Render** = On
- Display tab → Primitive Type = **Line** (or **Point** for a dot cloud look)
- Material: leave default or use a simple Constant MAT with a bright color

### Camera (`cam1`)

- Translate: X=0, Y=0, Z=8
- Look At: point at `geo_attractor` or leave default

### Render TOP (`render1`)

- Resolution: 1920 × 1080
- Camera: `../cam1`
- Background Color: black (0, 0, 0, 1)

### Post FX chain

```
render1
  → level1       (Brightness: 1.2, Gamma: 0.9)
  → bloom1       (Threshold: 0.3, Size: 0.015)
  → composite1   (input 0 = bloom1, input 1 = feedback1, Op = Over)
  ↑___ feedback1 ← composite1   (Opacity: 0.93 for trails)

composite1 → null_out
```

See [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]] for a deeper explanation of how the feedback chain works.

---

## Part 6 — Output

In `window1` (Window COMP):

- Operator: `../null_out`
- Resolution: match render (1920×1080)
- Hit **Open Window** or use **Perform Mode** (F1) for full performance

---

## Part 7 — Performance Tips (M1 Pro)

| Setting              | Value                               |
| -------------------- | ----------------------------------- |
| Starting point count | 4,000–6,000                         |
| Safe target          | 20,000–40,000                       |
| MediaPipe resolution | 640×480                             |
| TD cook mode         | Realtime                            |
| Turn off             | All node viewers during perform     |
| TD build             | Latest stable, Apple Silicon native |

- If CPU spikes: reduce `Points` first, then lower `dt` slightly
- To decouple tracking FPS: add a **Timer CHOP** to only trigger Script CHOP at 30fps while render runs at 60fps
- Keep `model_complexity=0` in MediaPipe for speed

---

## Next Steps

- **Gesture switching:** detect open hand vs. fist to toggle between Lorenz / Rössler / Thomas attractors
- **Color reaction:** map `vel` to hue shift in a GLSL MAT — see [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Introduction to GLSL]]
- **GPU particles:** replace Script SOP with a feedback TOP-based GPU particle advection system for 500k+ particles — see [[5 Ways To Make Particles]]

---

## Related

- [[Hand Tracking Tutorial|(y-) Hand Tracking Tutorial]] — full setup walkthrough with the MediaPipe plugin
- [[Hand Tracking|(y-) Hand Tracking]] — video links and series overview
- [[Sierpinski Tetrahedron with Hand Tracking|(y-) Sierpinski with Hand Tracking]] — another script SOP driven by MediaPipe
- [[notes/lorenz-attractor|(y-) The Lorenz Attractor]] — the maths behind σ, ρ, β
- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|(y-) Python in TD]]
- [[touchdesigner/03_Rendering_and_Output/Feedback Loops|(y-) Feedback Loops]]
- [[touchdesigner/02_The_Operators/SOPs/index|(y-) SOPs]]
- [[touchdesigner/02_The_Operators/CHOPs/index|(y-) CHOPs]]

[[touchdesigner/06_Recipes_and_Projects/index|Return to Recipes & Projects]]

---
