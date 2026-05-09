---
title: "03.1_VR-AR — Stereo Rendering & VR/AR Hardware"
tags:
  - vrar
  - hardware
  - rendering
  - optics
  - theory
date: 2026-04-21
---
[[/notes/lectures/virtualaugmentedreality/02_VR-AR_hcd|Back: (y-02) Human-Centered Design]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/03-2_VR-AR_hardware-2|Next: (y-03.2) Hardware Part 2]]

## Depth Perception: The Human Vision System
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg004_Depth_Perception_The_Human_Vision_System.png)

<p class="image-caption">Depth Perception: The human vision system uses a combination of monocular and binocular cues to interpret 3D space.</p>


How do we see in 3D? Our brain synthesizes multiple "cues" to calculate depth.

### 1. Monocular (2D) Depth Cues
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg009_1_Monocular_2d_Depth_Cues.png)

<p class="image-caption">Monocular depth cues: How we perceive depth with just one eye through motion, occlusion, and perspective.</p>


These allow us to perceive depth even with one eye closed:
- **Motion Parallax**: As you move, close objects move faster across your retina than distant ones.
- **Occlusion**: A "near" object overlapping a "far" object.
- **Perspective**: The convergence of parallel lines (e.g., train tracks) toward a vanishing point.
- **Aerial Perspective**: Atmosphere makes distant objects look bluer and lower contrast (scattering).

### 2. Binocular (3D) Depth Cues
<!-- Review Needed: close slide match for '2. Binocular (3D) Depth Cues' (p12: 0.588, p11: 0.554) -->
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg012_2_Binocular_3d_Depth_Cues.png)

<p class="image-caption">Binocular depth cues: Stereopsis and convergence are the foundation of 3D vision and VR immersion.</p>

![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg011_2_Binocular_3d_Depth_Cues.png)

<p class="image-caption">Binocular disparity: The slightly different images seen by each eye are fused by the brain into a 3D volume.</p>


These require both eyes and are the core of VR's "stereo" effect:
- **Stereopsis (Retinal Disparity)**: Because our eyes are ~6.5cm apart (IPD), each eye sees a slightly different angle. The brain fuses these two 2D images into one 3D volume.
- **Convergence**: The physical rotation of the eyes inward to look at a close object.

---

## 2. Stereo Rendering Math
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg003_2_Stereo_Rendering_Math.png)

<p class="image-caption">The math behind stereo rendering involves calculating correct camera offsets and projection matrices.</p>


To create stereopsis digitally, we must render two images. The geometry matters.

### Parallax Values
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg017_Parallax_Values.png)

<p class="image-caption">Parallax types: Zero, Positive (behind screen), Negative (front of screen), and Divergent (avoid!).</p>


- **Zero Parallax**: The virtual object is exactly on the screen plane.
- **Positive Parallax**: Images for each eye are separated such that the object appears *behind* the screen.
- **Negative Parallax**: Images cross in a way that the object appears to "pop out" *in front* of the screen.
- **Divergent Parallax**: The eyes would have to rotate *outward* to see the object. This is biologically impossible/painful and must be avoided.

### Off-Axis vs. Toe-in Rendering
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg024_Off_Axis_Vs_Toe_In_Rendering.png)

<p class="image-caption">Off-Axis vs. Toe-In: Off-axis rendering is the correct way to avoid vertical parallax and eye strain.</p>


- **Toe-in (INCORRECT)**: Angling two cameras toward each other. This is easier to implement but creates **Vertical Parallax** (the same point appears at different heights for each eye). This is the primary cause of eye strain in poor 3D content.
- **Off-Axis (CORRECT)**: The two cameras remain parallel, but their **projection frustums are shifted (asymmetric)**. This keeps the projection planes coplanar and ensures only horizontal parallax is created, mimicking natural vision.

---

## 3. Optics & HMD Challenges

### Why do we need lenses?
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg048_Why_Do_We_Need_Lenses.png)

<p class="image-caption">Lenses in HMDs: Necessary to focus on a screen just centimeters away by shifting the focal plane.</p>


A screen 5cm from your face is impossible for the human eye to focus on. Lenses (Fresnel or Pancake) are used to "bend" the light so it appears to come from ~2 meters away (the **focal plane**).

### Challenge: Vergence-Accommodation Conflict (VAC)
![](pictures/virtualaugmentedreality/03/Lecture03_Vergence_Accommodation.png)

<p class="image-caption">Vergence-Accommodation Conflict: A major challenge where eyes converge at one distance but focus at another.</p>


This is the "Holy Grail" problem of VR hardware.
- **Vergence**: Your eyes rotate to look at a virtual object 20cm away.
- **Accommodation**: Your eyes physically focus (muscle change) on the screen, which the lenses make appear to be at a fixed 2m distance.
- **The Conflict**: Your brain receives two conflicting depth signals: "Convergence says 20cm, but Focus says 2m."
- **Current Solutions**: 
    - **Varifocal displays** (moving lenses/screens).
    - **Light Field displays** (projecting a field of light rays).
    - **Safe Zone Design**: Keeping all UI/text between 0.75m and 3.0m where the conflict is minimal.

### Challenge: Latency & Judder
![](pictures/virtualaugmentedreality/03/Lecture03_103_Pg054_Challenge_Latency_Judder.png)

<p class="image-caption">Latency and Judder: Low persistence displays help prevent image smearing during fast head movements.</p>


- **Judder**: The stuttering or "multiple imaging" effect seen when the frame rate is lower than the refresh rate during head movement.
- **Solution**: **Low Persistence Displays**. Instead of keeping a frame visible for the whole duration, the screen flashes the image briefly and goes black. This prevents the image from "smearing" across the retina as your eye moves.

---

## 4. Hardware Evolution Comparison (The Numbers)

To reach "Human Eye Resolution" (Retina) at a 160° FOV, we need roughly **16K x 16K per eye**. Here is where we are:

| Device | Year | Res (per eye) | PPD (Pixels Per Degree) | Latency Goal |
| :--- | :--- | :--- | :--- | :--- |
| **Oculus DK2** | 2014 | 960 x 1080 | ~10 PPD | ~50ms (Legacy) |
| **Meta Quest 3**| 2023 | 2064 x 2208 | ~25 PPD | < 20ms |
| **Apple Vision Pro**| 2024 | 3660 x 3200 | ~34-40 PPD | ~12ms |
| **Varjo VR-3** | 2021 | 1920x1920 (Focus) | **70 PPD** (Retina+) | < 20ms |
| **Human Limit**| -- | -- | **~60 PPD** | **< 7-15ms** |

---

## 5. Hardware Display Types

| Type | Mechanism | Pros/Cons |
| :--- | :--- | :--- |
| **Anaglyph** | Color filters (Red/Cyan) | Very cheap; poor color, high crosstalk. |
| **Polarized** | Light waves filtered by angle | Good color; requires silver screen/special monitors. |
| **Shutter** | Active glasses sync with 120Hz+ | High quality; expensive glasses, flickering issues. |
| **HMD** | Individual screens per eye | Full immersion; heavy, VAC issues. |
| **Autostereoscopic**| Parallax barriers (Nintendo 3DS) | No glasses needed; very small "sweet spot." |

---

## 5. Self-Assessment Quiz

**Q1: What is the main difference between "Toe-in" and "Off-axis" rendering?**
> *Answer: Toe-in angles the cameras, causing vertical parallax and eye strain. Off-axis keeps cameras parallel but shifts the frustum, creating correct horizontal parallax only.*

**Q2: Why does VR hardware cause "Vergence-Accommodation Conflict"?**
> *Answer: Because the eyes converge at various virtual distances while the physical focus (accommodation) remains fixed on the screen/lens focal plane (usually ~2m).*

**Q3: How does a "Low Persistence" display reduce motion blur?**
> *Answer: By only lighting the pixels for a fraction of the frame time. This prevents the image from being "painted" across the retina as the user's head moves.*

**Q4: Name three monocular depth cues.**
> *Answer: Motion parallax, Occlusion, Linear Perspective, Aerial Perspective, or Object Size.*

**Q5: What is the danger of "Divergent Parallax"?**
> *Answer: It forces the eyes to rotate outward (wall-eyed), which is unnatural and causes significant physical pain/discomfort.*

---
[[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
