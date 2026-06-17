---
title: "Reaction-Diffusion Living Canvas"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - glsl
  - feedback
  - generative
date: 2026-06-18
---

**Reaction-diffusion** is the math behind leopard spots, coral, and the patterns on seashells. Implemented as a GLSL feedback loop, it grows organic, ever-changing textures that never repeat. It is the definitive "living wallpaper" for a gallery wall or a quiet corner of a room, and it teaches the GLSL-plus-feedback pattern that half of generative TouchDesigner relies on.

> [!info] Before You Start
> - Helpful background: [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|Introduction to GLSL]] and [[touchdesigner/03_Rendering_and_Output/Feedback Loops|Feedback Loops]].
> - We implement the classic **Gray-Scott** model: two virtual chemicals, A and B, where A feeds B and B decays.

---

## 1. The Two-Chemical Idea

Each pixel stores two values:

- **A** diffuses (spreads) quickly.
- **B** diffuses slowly and is produced where A and B meet, consuming A.

The interplay of "feed" (how fast A is added) and "kill" (how fast B is removed) decides whether you get spots, stripes, mazes, or coral. We store A in the red channel and B in the green channel of a TOP.

---

## 2. Build the Feedback Loop

1.  Add a **GLSL TOP**. Set it to read its own previous frame via a **Feedback TOP**.
2.  In the shader, for each pixel:
    - Compute the **Laplacian** (sample the 8 neighbours, subtract the centre) for A and B.
    - Apply the Gray-Scott update equations with your `feed` and `kill` uniforms.
3.  Initialise with a field of A = 1, B = 0, then seed a few small squares of B = 1 to kick it off.

> [!tip] The numbers that matter
> `feed` around `0.055` and `kill` around `0.062` gives the classic coral. Nudge them by `0.001` at a time; this system is famously sensitive and a tiny change flips the whole pattern.

---

## 3. Colour It

The raw simulation is greyscale. Make it gorgeous:

1.  Take the B channel as your pattern.
2.  Run it through a **Lookup TOP** with a rich gradient (deep blue to gold reads as "ocean coral").
3.  Add a subtle **Bloom** and a slight **Blur** so it looks painted rather than digital.

---

## 4. Make It Interactive (optional)

1.  Feed your webcam or a MediaPipe hand position in as the **seed**: wherever you touch, you inject chemical B and growth blooms from your fingertip.
2.  Or modulate `feed`/`kill` from an audio bass envelope so the pattern shifts texture with the music.

---

## Troubleshooting

- **"The pattern dies out / goes flat."** - Your `feed`/`kill` pair is in a dead zone. Return to `0.055`/`0.062` and adjust gently.
- **"It explodes into noise."** - Your timestep is too large. Run several small simulation sub-steps per frame, or lower the diffusion rates.
- **"It is grid-aligned and blocky."** - Sample neighbours in true pixel units; make sure the Laplacian uses the correct texel size uniform.

---

## Next Steps

- **Animate the parameters:** Slowly drift `feed` and `kill` over minutes so the wall keeps reinventing itself.
- **3D displacement:** Use the pattern as a height map on geometry for a coral relief sculpture.
- **Style it with AI:** Pipe the canvas into [[touchdesigner/08_Trending_2026/Live AI Painting with TouchDiffusion|live AI painting]] for a hybrid organic look.

---

## Parameter Tuning & Behavior

| Parameter        | Behavior                                                                       |
| :--------------- | :----------------------------------------------------------------------------- |
| **Feed rate**     | Higher = denser growth; Lower = sparse, isolated spots.                        |
| **Kill rate**     | Higher = patterns shrink and vanish; Lower = they spread and merge.            |
| **Sub-steps/frame** | More = stable and smooth but costlier; Fewer = faster but can destabilise.    |
| **Gradient (Lookup)** | Sets the entire mood: icy, coral, molten, monochrome.                        |

## Network Architecture

```text
[ SEED ]                       [ Constant/Noise TOP ] (A=1, B seeds)
                                      │  (first frame only)
                                      ▼
[ SIMULATION ]   ┌────────────▶ [ GLSL TOP ] (Gray-Scott update)
                 │                    │
                 │                    ▼
                 └──────────── [ Feedback TOP ] (previous frame)
                                      │
                                      ▼
[ COLOUR ]                     [ Lookup TOP ] (gradient on channel B)
                                      │
                                      ▼
[ OUT ]                        [ Blur ] ──▶ [ Bloom ] ──▶ [ OUT ]

        (optional: webcam / hand position ──▶ injects B into the GLSL seed)
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
