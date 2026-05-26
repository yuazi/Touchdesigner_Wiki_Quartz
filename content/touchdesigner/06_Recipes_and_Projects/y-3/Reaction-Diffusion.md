---
title: "Reaction-Diffusion (Gray-Scott Model)"
tags:
  - touchdesigner
  - td/recipes
  - glsl
  - simulation
  - feedback
  - generative
  - recipes
date: 2026-05-26
---

Reaction-diffusion simulates how two chemicals interact and spread across a surface. The result - spots, stripes, worm trails, and coral growths - are the same patterns that emerge on animal skins, seashells, and biological membranes. This recipe implements the classic **Gray-Scott model** entirely inside a GLSL feedback loop.

> [!info] Operator Families in this Recipe
>
> - **TOPs (Texture Operators):** Running the simulation as a GPU texture.
> - **GLSL:** The Gray-Scott differential equations as a pixel shader.
> - **Feedback TOP:** Feeding each frame back into the shader as input for the next.

---

## How It Works

Two chemicals - A (red channel) and B (green channel) - interact every frame:
- A flows in from outside (the "feed" rate) and gets consumed by B.
- B is created when A and B collide and is slowly removed (the "kill" rate).
- Both chemicals diffuse outward across the texture.

By tuning the feed and kill rates, wildly different patterns emerge.

---

## Part 1: Create the Feedback Loop

1. Create a **GLSL TOP** at **256x256** resolution.
2. Create a **Feedback TOP**. Set its **Target TOP** parameter to `glsl1` (or whatever your GLSL TOP is named).
3. Connect the **Feedback TOP** to **input 0** of the **GLSL TOP**.
4. Connect the **GLSL TOP** output to a **Null TOP** named `OUT_SIM`.

The GLSL TOP now reads its own previous output (via the Feedback TOP) and computes the next frame of the simulation.

---

## Part 2: Write the Shader

1. Click **Edit** on the GLSL TOP to open its pixel shader DAT.
2. Replace all contents with:

```glsl
uniform sampler2D sTD2DInputs[TD_NUM_2D_INPUTS];

uniform float uFeed;
uniform float uKill;
uniform float uDa;
uniform float uDb;
uniform float uDt;

layout(location = 0) out vec4 fragColor;

void main()
{
    vec2 uv     = vUV.st;
    vec2 texel  = 1.0 / uTDOutputInfo.res.zw;

    vec4 center = texture(sTD2DInputs[0], uv);

    // First frame: center.b == 0 means we have not seeded yet.
    // Self-seed with A=1 everywhere and a spot of B in the middle.
    if (center.b < 0.5) {
        float dist = length(uv - 0.5);
        float seedB = (dist < 0.04) ? 0.5 : 0.0;
        fragColor = TDOutputSwizzle(vec4(1.0, seedB, 1.0, 1.0));
        return;
    }

    // Sample the 4 neighbors
    vec4 up    = texture(sTD2DInputs[0], uv + vec2(0.0,      texel.y));
    vec4 down  = texture(sTD2DInputs[0], uv - vec2(0.0,      texel.y));
    vec4 left  = texture(sTD2DInputs[0], uv - vec2(texel.x,  0.0));
    vec4 right = texture(sTD2DInputs[0], uv + vec2(texel.x,  0.0));

    float A = center.r;
    float B = center.g;

    // Discrete Laplacian (5-point stencil)
    float lapA = up.r + down.r + left.r + right.r - 4.0 * A;
    float lapB = up.g + down.g + left.g + right.g - 4.0 * B;

    // Gray-Scott reaction
    float reaction = A * B * B;

    float newA = A + uDt * (uDa * lapA - reaction + uFeed * (1.0 - A));
    float newB = B + uDt * (uDb * lapB + reaction - (uFeed + uKill) * B);

    newA = clamp(newA, 0.0, 1.0);
    newB = clamp(newB, 0.0, 1.0);

    // Store A in Red, B in Green, seeded-flag in Blue
    fragColor = TDOutputSwizzle(vec4(newA, newB, 1.0, 1.0));
}
```

> [!info] The Blue Channel Trick
> The blue channel acts as an "initialized" flag. On the very first frame the Feedback TOP outputs zero - so `center.b < 0.5` is true, and the shader seeds the simulation (A=1 everywhere, a spot of B in the center). On every subsequent frame, blue is written as `1.0`, so the full Gray-Scott equations run instead.

---

## Part 3: Add Custom Parameters

Right-click the **GLSL TOP** → **Customize Component** to add these float parameters (they become the `uniform` variables in the shader):

| Name | Default | Min | Max | Notes |
| ---- | ------- | --- | --- | ----- |
| `uFeed` | `0.055` | `0.01` | `0.1` | Feed rate (how fast A flows in) |
| `uKill` | `0.062` | `0.01` | `0.1` | Kill rate (how fast B is removed) |
| `uDa` | `1.0` | `0.1` | `2.0` | Diffusion rate of A |
| `uDb` | `0.5` | `0.1` | `1.0` | Diffusion rate of B |
| `uDt` | `1.0` | `0.1` | `2.0` | Time step per frame |

---

## Part 4: Colorize the Output

The simulation stores data in the R and G channels. Map it to visible color:

1. Connect `OUT_SIM` to a **Level TOP**.
   - Lower **Red** to `0.0` (hide the A channel).
   - Keep **Green** at `1.0` (B channel = the pattern).
2. Connect to an **HSV Adjust TOP**.
   - Boost **Saturation Multiplier** to `1.5`.
   - Animate **Hue** → `absTime.seconds * 2` for a slow color evolution.
3. Optionally add an **Invert TOP** for a dark-background look (spots on black instead of white).

---

## Pattern Presets

Swap these values into `uFeed` and `uKill` to grow completely different structures. All use `uDa = 1.0`, `uDb = 0.5`, `uDt = 1.0`.

| Pattern | uFeed | uKill |
| ------- | ----- | ----- |
| Coral / Spots | `0.055` | `0.062` |
| Stripes | `0.025` | `0.050` |
| Worm Holes | `0.046` | `0.063` |
| Moving Spots | `0.030` | `0.060` |
| Dendrites (trees) | `0.040` | `0.059` |

Start with Coral and slowly drag `uKill` up to watch spots morph into stripes and then holes.

---

## Troubleshooting

- **"Simulation goes all white or all black."** - `uFeed` and `uKill` are outside a stable zone. Reset to the Coral preset (`0.055`, `0.062`) and adjust from there.
- **"Nothing ever appears."** - Check that the Feedback TOP's Target TOP parameter is exactly the name of your GLSL TOP. A mismatch means no loop.
- **"Shader compile errors (green uniform color)."** - Open the GLSL TOP's Info OP and read the error. The most common cause is a uniform name mismatch between the shader code and the Custom Parameter names.
- **"Simulation starts but resets every few seconds."** - The Feedback TOP is losing its target reference. Confirm the GLSL TOP has not been renamed.

---

## Next Steps

- **Audio reactivity:** Bind an **Analyze CHOP** (RMS) to `uFeed` to make the pattern "grow" with the beat.
- **Mouse interaction:** Use `monitorInfo('mousex')` / `monitorInfo('mousey')` in a **Constant TOP** and composite it over the simulation to "paint" new B into the system while it runs.
- **Multi-layer composite:** Run two separate Gray-Scott simulations with different presets and blend them together in a **Composite TOP** for richer patterns.
- **Reaction-diffusion as a displacement map:** Feed the B channel (Green) into a **Displace SOP** to drive a 3D surface that grows organic bumps.

---

## Parameter Tuning & Behavior

| Parameter | Behavior |
| :--- | :--- |
| **uFeed** | Lower = structures die out (patterns disappear); Higher = rapid, explosive growth. Sweet spot is narrow. |
| **uKill** | Lower = everything turns uniform; Higher = patterns become sparse, then vanish. |
| **uDa / uDb** | Ratio of Da to Db controls sharpness. Da = 2×Db (the default) gives typical crisp spots. |
| **uDt** | Higher = faster simulation (more generations per frame) but risks instability; Lower = slower, more stable. |
| **Resolution** | Higher (512x512) = more detail but heavier GPU cost; Lower (128x128) = faster, pixel-art look. |

## Network Architecture

```text
[ SEED + FEEDBACK LOOP ]
                        ┌──────────────────────────────┐
                        │ (previous frame via Feedback) │
                        ▼                               │
                  [ GLSL TOP ]  ──────────────────────▶ │
                  (Gray-Scott)          │           [ Feedback TOP ]
                                        │           (Target: glsl1)
                                        ▼
                                 Null (OUT_SIM)
                                        │
                                        ▼
                   Level TOP ──▶ HSV Adjust TOP ──▶ (Invert TOP) ──▶ OUT
```

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
