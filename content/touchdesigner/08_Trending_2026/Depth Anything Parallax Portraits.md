---
title: "Depth Anything Parallax Portraits"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - ai
  - depthanything
  - parallax
date: 2026-06-18
---

**Depth Anything v2** is the AI model that estimates a depth map from a single flat photo, no depth camera needed. In 2026 it ships as a drop-in TouchDesigner `.tox`, which means you can take one ordinary photo of someone, generate its depth, and turn it into a living 2.5D scene where the camera drifts and the subject separates from the background. It is the most "wow per minute" recipe in this chapter.

> [!info] Before You Start
>
> - Grab a depth plugin. The popular one is **TDDepthAnything** by olegchomp: [GitHub](https://github.com/olegchomp/TDDepthAnything) (a drop-in `.tox` that turns any TOP into a real-time depth map). There is also **TDDepthAnythingRT** by jetXS for a TensorRT path.
> - On Apple Silicon, prefer a build that runs the model on CPU/MPS, or use a pre-baked depth map exported from a desktop tool. The TouchDesigner displacement steps are GPU and run anywhere.

---

## 1. Get a Depth Map

1.  Add a **Movie File In TOP** and load your photo.
2.  Drop in the `TDDepthAnything.tox` and feed your photo into it.
3.  Its output is a greyscale **depth map**: white is near, black is far.

> [!tip] No NVIDIA card?
> You do not need real-time depth for a still photo. Generate the depth map once (in the plugin, or any Depth Anything web demo), save it as an image, and load it as a second Movie File In TOP. The rest of the recipe is the same.

---

## 2. Displace in 3D

We turn the flat photo into geometry pushed forward and back by the depth map.

1.  Add a **Grid SOP**, set rows and columns high (around `200x200`) for smooth displacement.
2.  Add a **Point SOP** (or a GLSL displacement) and offset each point's Z by the depth map value.
3.  Apply your colour photo as the texture in a **Phong/PBR MAT**.
4.  Render the result with a **Render TOP**.

> [!tip] POP alternative
> For a softer, particle look, sample the photo and depth into a [[touchdesigner/02_The_Operators/POPs/index|POP]] point cloud instead of a grid. Each pixel becomes a glowing point at its depth.

---

## 3. Add the Parallax Move

This subtle camera drift is what sells the illusion.

1.  Add a **Camera COMP**.
2.  Animate its X and Y position with a slow **LFO CHOP** (amplitude small, around `0.1`).
3.  Aim it at the centre of the scene. As the camera sways, near pixels move more than far pixels: instant parallax.

---

## 4. Make It a Gift

1.  Use a favourite photo of the two of you.
2.  Add soft **depth of field** so the background gently blurs as the camera moves.
3.  Add gentle floating **particles** in front for atmosphere.
4.  Render a 10 second loop to a movie file.

---

## Troubleshooting

- **"The displacement looks spiky."** - The depth map is noisy. Add a small **Blur TOP** on the depth before displacing.
- **"Edges tear apart."** - This is normal at big depth jumps (the model cannot invent hidden pixels). Keep the camera move small, or inpaint the gaps with a stretched-edge background layer.
- **"The plugin will not load on my Mac."** - Use the pre-baked depth map approach from step 1.

---

## Next Steps

- **Live version:** Feed your webcam instead of a photo for a real-time depth-displaced mirror (needs the real-time/TensorRT build).
- **Depth-keyed effects:** Use the depth map to fog only the background, or to colour-grade near and far differently.
- **Combine with splats:** Pair with [[touchdesigner/08_Trending_2026/Gaussian Splatting Scenes|Gaussian Splatting Scenes]] for fully volumetric memories.

---

## Parameter Tuning & Behavior

| Parameter           | Behavior                                                                 |
| :------------------ | :----------------------------------------------------------------------- |
| **Displace amount** | Higher = dramatic 3D pop but more edge tearing; Lower = subtle, clean.   |
| **Depth blur**      | Higher = smooth surfaces; Lower = crisp but spiky.                       |
| **Camera sway**     | Larger = strong parallax but reveals gaps; Smaller = gentle, believable. |
| **Grid resolution** | Higher = smoother displacement; Lower = faceted, lower-poly look.        |

## Network Architecture

```text
[ SOURCE ]                     [ Movie File In TOP ] (photo)
                                  │            │
                                  │            ▼
                                  │     [ TDDepthAnything.tox ] ──▶ depth map
                                  │            │
                                  ▼            ▼  (+ Blur TOP)
[ GEOMETRY ]              [ Grid SOP ] ──▶ [ Point/GLSL displace by depth ]
                                          │  (colour photo as texture)
                                          ▼
[ RENDER ]                       [ Render TOP ] ◀── [ Camera COMP + slow LFO ]
                                          │
                                          ▼
[ POLISH ]                       [ Depth of Field ] ──▶ [ particles ] ──▶ [ OUT ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
