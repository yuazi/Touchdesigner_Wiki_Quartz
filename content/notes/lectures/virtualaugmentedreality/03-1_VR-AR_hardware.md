---
title: "03.1_VR-AR - Stereo Rendering and Hardware"
tags:
  - vrar
  - hardware
  - stereo
  - rendering
  - optics
date: 2026-04-21
---

[[/notes/lectures/virtualaugmentedreality/02_VR-AR_hcd|Previous: (y-02) Human-Centered Design]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/03-2_VR-AR_hardware-2|Next: (y-03.2) AR Displays and Input Hardware]]

## Mental Model First

Stereo VR works by giving each eye a slightly different image, but comfort depends on the whole optical chain: human depth cues, camera geometry, projection, lenses, display timing, field of view, and latency. A stereo image can be mathematically plausible and still feel bad if it violates how the visual system expects depth cues to agree.

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg004_How_We_See_3D.png]]

<p class="image-caption">Human 3D perception combines monocular 2D cues and binocular 3D cues.</p>

## 1. Depth Cues

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg009_Monocular_Depth_Cues.png]]

<p class="image-caption">Monocular cues such as motion parallax, occlusion, perspective, and aerial perspective support depth perception with one eye.</p>

Monocular cues are available even without stereo:

- **Motion parallax**: close objects move more across the retina than far objects during head motion.
- **Occlusion**: nearer objects hide farther objects.
- **Perspective**: parallel lines converge with distance.
- **Aerial perspective**: distant objects become lower contrast and color-shifted.

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg012_Binocular_Depth_Cues.png]]

<p class="image-caption">Binocular depth cues include stereopsis from retinal disparity and convergence from eye rotation.</p>

Binocular cues require both eyes:

- **Stereopsis** comes from the two retinal images differing because the eyes are separated by the interpupillary distance.
- **Convergence** is the inward rotation of both eyes for close objects.

## 2. Stereo Rendering

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg017_Parallax.png]]

<p class="image-caption">Parallax determines whether a point appears on, behind, or in front of the projection plane.</p>

Stereo rendering creates separate left-eye and right-eye images. The main parallax cases are:

- **Zero parallax**: object lies on the projection plane.
- **Positive parallax**: object appears behind the projection plane.
- **Negative parallax**: object appears in front of the projection plane.
- **Divergent parallax**: eyes would need to diverge outward; this is uncomfortable and should be avoided.

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg025_Off_Axis_Rendering.png]]

<p class="image-caption">Off-axis rendering keeps cameras parallel and shifts the projection frusta; toe-in rendering creates vertical parallax.</p>

The exam-critical comparison:

| Method             | What It Does                             | Why It Matters                                               |
| :----------------- | :--------------------------------------- | :----------------------------------------------------------- |
| Toe-in rendering   | Rotates cameras inward                   | Easy but introduces vertical parallax and eye strain.        |
| Off-axis rendering | Keeps cameras parallel and shifts frusta | Correct stereo geometry for comfortable horizontal parallax. |

## 3. Visual VR Output Hardware

VR output systems include anaglyph, polarized, shutter, CAVE-like projection, autostereoscopic displays, and head-mounted displays. Each technique separates images for the two eyes with a different tradeoff in cost, color quality, crosstalk, brightness, field of view, and user freedom.

Head-mounted displays dominate consumer VR because they move with the user and can fill much more of the visual field, but they bring optical and timing challenges.

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg048_Why_Lenses.png]]

<p class="image-caption">HMD lenses make a very close display focusable by shifting the apparent focal distance.</p>

## 4. HMD Challenges

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg054_Latency.png]]

<p class="image-caption">Presence requires exceptionally low latency because head motion must quickly affect the displayed photons.</p>

Important hardware challenges:

- **Latency**: delay between motion and visual update breaks presence and can cause discomfort.
- **Judder**: visible stutter during head motion, reduced by high refresh rate and low persistence displays.
- **Resolution**: the human visual field demands far more pixels than a normal screen because it spans a large field of view.
- **Lens distortion**: lenses improve focus but introduce distortion that rendering must pre-correct.

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg060_High_Resolution_Display.png]]

<p class="image-caption">Wide human field of view makes high-resolution VR display requirements extremely demanding.</p>

## 5. Vergence-Accommodation Conflict

![[pictures/virtualaugmentedreality/03-1/Lecture03-1_Pg063_Other_Display_Challenges.png]]

<p class="image-caption">Other display challenges include rolling display artifacts, reprojection, asymmetric gaze cones, cue conflicts, and vergence-accommodation conflict.</p>

The fixed display plane creates a mismatch:

- **Vergence** says the virtual object may be near or far.
- **Accommodation** remains tied to the physical screen or lens focal plane.

This conflict explains why comfortable UI distances matter. Light-field and varifocal displays try to reduce it, but most systems still rely on careful content placement.

## Exam Focus

- Name monocular and binocular depth cues.
- Explain parallax types and why divergent parallax is dangerous.
- Compare toe-in and off-axis stereo rendering.
- Explain why HMDs need lenses and why that creates optical tradeoffs.
- Relate latency, refresh rate, and low persistence to comfort.

## Self-Check

1. Why does toe-in rendering create vertical parallax?
2. What is the difference between stereopsis and convergence?
3. Why is divergent parallax uncomfortable?
4. What is vergence-accommodation conflict?

---

[[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
