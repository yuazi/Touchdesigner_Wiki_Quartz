---
title: "03.2_VR-AR — Stereo Rendering & VR/AR Hardware (Part 2)"
tags:
  - vrar
  - hardware
  - ar
  - hmd
  - theory
date: 2026-04-28
---
[[/notes/virtualaugmentedreality/03-1_VR-AR_hardware|Back: (y-03.1) Hardware Part 1]] | [[/notes/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/virtualaugmentedreality/04_VR-AR_Interaction|Next: (y-04) Interaction]]

## 1. Visual AR Output: OST vs. VST
![](pictures/virtualaugmentedreality/03/Lecture03_Pg003_1_Visual_Ar_Output_Ost_Vs.png)


There are two primary ways to combine virtual content with the real world in an HMD.

### Optical See-Through (OST)
![](pictures/virtualaugmentedreality/03/Lecture03_Pg004_Optical_See_Through_Ost.png)

Uses an **optical combiner** (like a half-silvered mirror or waveguide) to allow the user to see the real world directly, with virtual light reflected into the eye.
- **Examples**: Microsoft HoloLens, Magic Leap, Epson Moverio.
- **Pros**:
    - Real world is seen at "infinite" resolution/zero latency.
    - Safety: If the power fails, you can still see.
- **Cons**:
    - **Add-only light**: Can only add light to the scene (cannot render true black; everything looks slightly "ghostly").
    - **Registration**: Harder to align virtual objects perfectly because the real world doesn't go through the computer.

### Video See-Through (VST)
![](pictures/virtualaugmentedreality/03/Lecture03_Pg024_Video_See_Through_Vst.png)

Captures the real world via **cameras**, digitizes it, merges it with virtual content, and displays the result on an opaque screen.
- **Examples**: Meta Quest 3/Pro, Apple Vision Pro, Varjo XR-4.
- **Pros**:
    - **Occlusion**: Can "subtract" light (render a solid virtual object over a real one).
    - **Matched Latency**: Both real and virtual views are delayed by the same amount (easier on the brain for registration).
- **Cons**:
    - **Camera Resolution**: Real world is limited by camera quality.
    - **Cyber Sickness**: Even a tiny delay in the video feed can cause nausea.
    - **Safety**: If the system fails, you are blind.

---

## 2. Comparison Summary

| Feature | Optical See-Through (OST) | Video See-Through (VST) |
| :--- | :--- | :--- |
| **Real World View** | Direct (Light speed) | Digitized (Camera latency) |
| **Resolution** | Human eye limit | Camera/Display limit |
| **Light Logic** | Additive only (Ghostly) | Additive & Subtractive (Solid) |
| **Safety** | High (Fail-safe) | Low (Blind if failure) |
| **Latency** | Mixed (Real vs. Virtual) | Matched (Both delayed) |

---

## 3. Display Space Taxonomy
![](pictures/virtualaugmentedreality/03/Lecture03_Pg019_3_Display_Space_Taxonomy.png)

Where is the display relative to the user?

1.  **Head-mounted (Head Space)**: Moves with the head (HMDs).
2.  **Hand-held (Body Space)**: Smartphones, tablets (Magic Window).
3.  **Stationary (World Space)**: Monitors, "Magic Mirrors" (e.g., smart mirrors in retail).
4.  **Projected (World Space)**: Spatial AR (SAR). Projecting directly onto physical objects.

---

## 4. Spatial Augmented Reality (SAR)
![](pictures/virtualaugmentedreality/03/Lecture03_Pg033_4_Spatial_Augmented_Reality_Sar.png)

Instead of wearing a device, we project light onto the environment.
- **View-Independent**: Textures projected onto a white 3D model (e.g., projection mapping on buildings).
- **View-Dependent**: Requires tracking the user to project "anamorphic" 3D objects that look correct only from the user's perspective.

---

## 5. Input Devices for VR/AR

### 1. Hands & Haptics
![](pictures/virtualaugmentedreality/03/Lecture03_Pg039_1_Hands_Haptics.png)

- **Data Gloves**: Tracking finger joints (e.g., Jaron Lanier's 1987 Data Glove).
- **Haptic Gloves**: Provide resistance (brakes) or vibration to simulate touch (e.g., HaptX, SenseGlove).
- **Exoskeletons**: Large-scale force feedback for the whole arm/body.

### 2. Locomotion
- **Treadmills**: Omni-directional treadmills (e.g., Virtuix Omni) allow walking in any direction while staying in place.
- **Redirected Walking**: Subtly rotating the virtual world so the user walks in a circle in real life while thinking they are walking straight.

### 3. Other Senses
![](pictures/virtualaugmentedreality/03/Lecture03_Pg046_3_Other_Senses.png)

- **3D Audio**: Essential for "Place Illusion."
- **Olfactory/Taste**: Experimental displays for smell and flavor.

---

## 6. Self-Assessment Quiz
![](pictures/virtualaugmentedreality/03/Lecture03_Pg004_6_Self_Assessment_Quiz.png)


**Q1: Why can't an Optical See-Through display (like HoloLens) show a solid black cube?**
> *Answer: Because it works by adding light to the user's natural vision. You cannot "project black" onto the real world; black is simply the absence of light.*

**Q2: What is "matched latency" in Video See-Through?**
> *Answer: Since both the real-world feed and the virtual content are processed by the same computer, they are displayed to the user at the exact same moment. This avoids the "lagging virtual object" feel common in OST.*

**Q3: Define Spatial Augmented Reality (SAR).**
> *Answer: AR that uses projectors to cast graphical information directly onto physical objects instead of using an eye-worn or hand-held display.*

**Q4: What is the main safety risk of VST HMDs?**
> *Answer: If the hardware or software fails, the user becomes completely blind to their physical environment, which is dangerous in high-stakes scenarios (e.g., surgery).*

---
[[/notes/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
