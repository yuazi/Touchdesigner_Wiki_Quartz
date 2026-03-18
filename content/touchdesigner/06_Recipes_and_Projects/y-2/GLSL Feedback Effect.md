---
tags:
  - touchdesigner
  - td/recipes
  - feedback
  - glsl
  - recipes
  - shader
date: 2026-03-02
---

# Recipe: GLSL Feedback Effect

This document details the implementation of recursive texture processing systems in TouchDesigner using Feedback TOP operators in conjunction with custom GLSL shaders. Such configurations enable the generation of complex temporal visual phenomena including trajectory trails, recursive diffusion patterns, and evolving procedural textures - all executed with full GPU acceleration for real-time performance capabilities.

The specific implementation described herein focuses on a compound transformation feedback system incorporating spatial scaling, rotational transformation, and temporal decay parameters, establishing a foundational framework for advanced real-time visual synthesis applications.

---

## Part 1: The Feedback Loop

A feedback loop in TouchDesigner is built with a **Feedback TOP**:

```
[Source TOP]
     ↓
  GLSL TOP  ←──────────────┐
     ↓                     │
 Feedback TOP ─────────────┘
     ↓
  Null TOP (OUT_FEEDBACK)
```

Step by step:

1. Create a **`Noise TOP`** as your seed texture (or any visual source).
2. Create a **`GLSL TOP`** — this is where the effect lives.
3. Create a **`Feedback TOP`**.
   - Set its **Target TOP** parameter to the path of the **GLSL TOP** (e.g. `glsl1`).
   - This makes the Feedback TOP read from the GLSL TOP's _previous_ frame.
4. Connect: `Noise TOP → input[0] of GLSL TOP`, `Feedback TOP → input[1] of GLSL TOP`.
5. Connect the `GLSL TOP` output to a `Null TOP`.

Now the shader receives both fresh input (slot 0) and last frame's output (slot 1).

---

## Part 2: The GLSL Shader

Open the `GLSL TOP`, go to its DAT and replace the pixel shader with:

```glsl
uniform sampler2D sTD2DInputs[2];  // [0] = fresh source, [1] = feedback
uniform vec4 uTDOutputInfo;

// Uniforms (add these as Custom Parameters on the GLSL TOP)
uniform float uZoom;       // e.g. 1.002
uniform float uRotation;   // e.g. 0.001 (radians per frame)
uniform float uDecay;      // e.g. 0.97 (how fast trails fade)
uniform vec2  uOffset;     // e.g. 0.0, 0.0 (translate each frame)

out vec4 fragColor;

void main()
{
    vec2 uv = vTD2DInputCoord.st;

    // Centre the UV so transforms are around the middle
    vec2 centred = uv - 0.5;

    // Apply rotation
    float c = cos(uRotation);
    float s = sin(uRotation);
    centred = vec2(c * centred.x - s * centred.y,
                   s * centred.x + c * centred.y);

    // Apply zoom (scale back toward centre)
    centred /= uZoom;

    // Apply translate offset
    centred += uOffset;

    // Return to 0-1 UV space
    vec2 feedbackUV = centred + 0.5;

    // Sample last frame's output, apply decay to fade trails
    vec4 feedback = texture(sTD2DInputs[1], feedbackUV) * uDecay;

    // Sample fresh source
    vec4 fresh = texture(sTD2DInputs[0], uv);

    // Combine: add new content on top of decayed history
    fragColor = TDOutputSwizzle(max(fresh, feedback));
}
```

---

## Part 3: Adding Custom Parameters

For the uniforms to be tweakable, create **Custom Parameters** on the GLSL TOP:

1. Right-click the GLSL TOP → **Customize Component…**
2. Add float parameters matching the uniform names:
   - `uZoom` — default `1.002`, range `0.99–1.05`
   - `uRotation` — default `0.001`, range `-0.05–0.05`
   - `uDecay` — default `0.97`, range `0.5–1.0`
   - `uOffset` — default `0, 0` (XY float pair)

Now sliders appear on the parameter panel for live tweaking during performance.

---

## Part 4: Driving with Audio

```
Audio Device In CHOP → Audio Spectrum CHOP → Analyze CHOP (RMS)
  → Math CHOP (remap: e.g. 0→1 becomes 1.000→1.008)
  → [CHOP reference onto GLSL TOP's uZoom custom parameter]
```

Kick drums push the zoom, creating the classic "zoom-in-on-beat" VJ effect.

---

## Visual Variations

| Change                                  | Effect                                                  |
| --------------------------------------- | ------------------------------------------------------- |
| `uZoom > 1`                             | Content zooms in and expands outward — "into the abyss" |
| `uZoom < 1`                             | Content shrinks inward — imploding tunnel               |
| `uRotation != 0`                        | Trails spiral                                           |
| `uDecay` close to 1                     | Long, persistent trails                                 |
| `uDecay` close to 0.5                   | Short, quickly fading traces                            |
| Add `sin(absTime.seconds)` to `uOffset` | Drifting, oscillating trails                            |

---

## Common Gotchas

- **Feedback explodes to white** → `uDecay` is too high (≥ 1.0). Drop it to `0.97`.
- **Nothing feeds back** → confirm the Feedback TOP's **Target TOP** path is exactly the GLSL TOP's name.
- **Green/uniform shader errors** → check the GLSL TOP's `Info` OP for compile errors; common issue is uniform name mismatch.
- **1-frame latency** in the loop is unavoidable and is what makes feedback work — the Feedback TOP always serves the _previous_ frame.
- For **reaction-diffusion** (Turing patterns), replace the simple zoom/rotate with a two-channel diffusion equation in the shader — a natural next step from this recipe.

## Related Topics

- [[Feedback Loops]] — pure TOP-based feedback without GLSL
- [[Introduction to GLSL]] — GLSL fundamentals in TouchDesigner

---

## Network Architecture

To visualize how the data flows, here is a map of the final network:

```text
[ SOURCE ]
Noise TOP (Seed) ──┐
                   │ (Input 0)
                   ▼
[ FEEDBACK LOOP ] ──▶ [ GLSL TOP ] ──▶ [ Null TOP (OUT) ]
       ▲           (Input 1)  │
       │                      │
       └──── [ Feedback TOP ] ◄┘
                   ▲
                   │ (Target: glsl1)
[ CONTROL ]        │
Audio In ──▶ Analyze ──▶ Math ──▶ [ uZoom Parameter ]
```

### Data Flow Explanation
1.  **Dual Input:** The `GLSL TOP` is the brain. It takes the current frame from the `Noise TOP` (Input 0) and the previous frame from the `Feedback TOP` (Input 1).
2.  **Shader Logic:** Inside the GLSL code, we transform the feedback texture (rotate/zoom/offset) and then "mix" or "max" it with the fresh source.
3.  **Recursive Loop:** The `Feedback TOP` is set to "target" the GLSL TOP. This means every frame, it grabs the output of the shader and feeds it back into Input 1 for the *next* frame.
4.  **Decay:** The `uDecay` parameter in the shader multiplies the feedback by a value like 0.97. This ensures that old trails eventually fade to black rather than staying on screen forever.
5.  **Audio Link:** By mapping audio energy to `uZoom`, the entire feedback "pulses" outward on every beat.

---

[[Index|(y) Return to Recipes & Projects]]
[[../index|(y) Return to Recipes & Projects]]
[[touchdesigner/index|(y) Return to TouchDesigner]]
