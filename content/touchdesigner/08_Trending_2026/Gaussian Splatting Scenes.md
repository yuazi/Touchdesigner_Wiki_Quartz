---
title: "Gaussian Splatting Scenes"
tags:
  - touchdesigner
  - td/recipes
  - td/trending
  - gaussiansplatting
  - 3dgs
  - volumetric
date: 2026-06-18
---

**3D Gaussian Splatting (3DGS)** is the volumetric capture format that took over from NeRFs. You film a place with your phone, train a `.ply` of millions of fuzzy coloured "splats," and get a photoreal 3D scene you can fly a camera through. In 2026 there are TouchDesigner renderers that play these splats live, which means you can take the cafe where you had your first date and turn it into a slow, dreamy flythrough.

> [!info] Before You Start
> - Capture and train a splat first. The easy path is a phone app like **Polycam** or **Luma**, or the desktop trainer **Postshot**, exporting a `.ply`.
> - Grab a TD splat renderer. Community options include the **TD Gaussian Splatting** GLSL components on GitHub and Olib. Search "gaussian splatting" on [Olib](https://olib.amb-service.net/).

---

## 1. Capture a Good Splat

The render quality is decided here, not in TouchDesigner.

1.  Film slowly, in a full circle around your subject, keeping it centred.
2.  Cover multiple heights (low, eye level, high). More angles means fewer holes.
3.  Avoid moving objects, reflections, and changing light.
4.  Train, then export the `.ply`. Expect 500k to 3 million splats.

> [!tip] Splat count vs. performance
> Every splat is sorted and blended each frame. A 1 million splat scene runs comfortably on a mid GPU; 3 million may need a strong card. Decimate in the trainer if it stutters.

---

## 2. Load It in TouchDesigner

1.  Drop the splat renderer `.tox` into your project.
2.  Point its file parameter at your `.ply`.
3.  The splats load as a point cloud with per-point colour, scale, rotation, and opacity. The renderer handles the depth sorting and elliptical blending in GLSL.

---

## 3. Fly the Camera

This is where it becomes cinematic.

1.  Add a **Camera COMP**.
2.  Animate its position with an **LFO CHOP** or a hand-keyed **Animation COMP** for a slow orbit or push-in.
3.  Use a long, gentle move. Splats reward slow camera work; fast moves reveal the fuzz.

---

## 4. Make It a Keepsake

1.  Add subtle **depth of field** (defocus by distance) so the foreground stays sharp and the background melts.
2.  Grade it warm with an **HSV Adjust** or **Lookup TOP**.
3.  Render the flythrough to a movie with **Movie File Out TOP** and you have a gift you can text.

---

## Troubleshooting

- **"The splats look like a fog of blobs."** - Camera is too close or the capture was sparse. Pull back, and recapture with more angles.
- **"Performance tanks."** - Too many splats. Decimate in the trainer, or cull splats outside the camera frustum if the renderer supports it.
- **"Colours look washed out."** - Many renderers expect linear colour. Check whether the component wants an sRGB-to-linear step, and grade at the end.

---

## Next Steps

- **Inhabit it:** Composite a MediaPipe body silhouette (see [[touchdesigner/08_Trending_2026/Interactive Portrait Wall|Interactive Portrait Wall]]) into the splat scene so a person "stands inside" the memory.
- **Audio orbit:** Drive the camera orbit speed from a soft ambient track.
- **Particle hybrid:** Mix the splats with a few thousand glowing [[touchdesigner/02_The_Operators/POPs/index|POP]] particles for a magical, drifting-dust feel.

---

## Parameter Tuning & Behavior

| Parameter          | Behavior                                                                  |
| :----------------- | :------------------------------------------------------------------------ |
| **Splat scale**     | Higher = softer, more painterly; Lower = sharper but more gaps show.      |
| **Camera speed**    | Slower = cinematic and photoreal; Faster = reveals the fuzzy artefacts.   |
| **Depth of field**  | Stronger = dreamy focus pull; Weaker = everything crisp.                  |
| **Splat count**     | Higher = more detail and cost; Lower = faster but holes appear.           |

## Network Architecture

```text
[ CAPTURE (offline) ]          Phone video ──▶ Trainer (Postshot/Luma) ──▶ scene.ply
                                      │
                                      ▼
[ LOAD ]                       [ Gaussian Splat Renderer .tox ] (reads .ply)
                                      │
                                      ▼
[ CAMERA ]                     [ Camera COMP ] ◀── [ LFO / Animation COMP ] (slow orbit)
                                      │
                                      ▼
[ GRADE ]                      [ Depth of Field ] ──▶ [ HSV / Lookup ] ──▶ [ OUT ]
                                      │
                                      ▼
[ EXPORT ]                     [ Movie File Out TOP ]
```

[[touchdesigner/08_Trending_2026/index|(y) Return to Trending 2026]] | [[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
