---
title: "04_VR-AR — Interaction in VR/AR"
tags:
  - vrar
  - interaction
  - 3dui
  - ux
  - theory
date: 2026-05-05
---
[[/notes/virtualaugmentedreality/03-2_VR-AR_hardware-2|Back: (y-03.2) Hardware Part 2]] | [[/notes/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/virtualaugmentedreality/05_VR-AR_tracking|Next: (y-05) Tracking]]

## 1. Why 3D Interaction is Hard
Classical UI design (2D) relies on constraints (mouse on a table, windows on a screen). 3D Interaction (3DUI) lacks these:
- **Spatial Input**: 6 degrees of freedom (DOF) is harder to control than 2.
- **Fatigue**: "Gorilla Arm" (tiredness from holding arms in the air).
- **Precision**: Human hands shake; virtual rays are sensitive.
- **Midas Touch**: Everything you look at or touch might trigger an action accidentally.

---

## 2. Typical Interaction Tasks

### A. Selection (Picking)
![](pictures/virtualaugmentedreality/04/Lecture04_Pg011_A_Selection_Picking.png)

Identifying an object to interact with.
- **Raycasting**: A virtual laser pointer coming from the hand. Good for distant objects.
- **Virtual Hand**: Direct touch. You move your virtual hand to intersect with the object. Most natural but limited by arm reach.
- **BalloonProbe**: A technique to handle occlusion by "pushing aside" objects in a dense scene.
- **Eye Gaze + Gesture**: Using the eye to select and a small pinch to "click" (e.g., Apple Vision Pro).

### B. Manipulation (Modifying)
![](pictures/virtualaugmentedreality/04/Lecture04_Pg005_B_Manipulation_Modifying.png)

Changing an object's properties: **R**otate, **T**ranslate (move), **S**cale.
- **3D Widgets**: Using handles (arrows/rings) to constrain movement to one axis at a time.
- **Bimanual Interaction**: Using two hands (e.g., "stretching" an object to scale it).

### C. Navigation (Moving)
![](pictures/virtualaugmentedreality/04/Lecture04_Pg017_C_Navigation_Moving.png)

- **Travel (Motor task)**: The physical/virtual act of moving from A to B.
    - **Teleportation**: Instant movement. Reduces motion sickness because there is no optical flow.
    - **Redirected Walking**: Tricking the user into walking in circles while they think they are in a huge hall.
- **Wayfinding (Cognitive task)**: Using maps, landmarks, or arrows to know *where* to go.

### D. System Control (Commanding)
![](pictures/virtualaugmentedreality/04/Lecture04_Pg021_D_System_Control_Commanding.png)

- **Diegetic Menus**: Menus that exist inside the world (e.g., a virtual tablet in your hand).
- **TULIP**: Attaching menu items to your fingertips (ideal for pinch gestures).
- **Voice Commands**: "Hey Siri/Siri, open Safari."

---

## 3. AR-Specific Interaction
![](pictures/virtualaugmentedreality/04/Lecture04_Pg025_3_Ar_Specific_Interaction.png)


In AR, we interact with both virtual and real objects.
- **Tangible AR**: Using real-world "props" or markers to control virtual content (e.g., turning a physical cube to rotate a virtual car).
- **Magic Mirror**: A screen that behaves like a mirror, augmenting the user's reflection (e.g., virtual try-on for clothes).
- **Everywhere Display**: Turning any flat surface (table, wall) into a touch interface using a projector and camera.
- **World in Miniature (WIM)**: A small "god-view" model of the entire scene that you can interact with to make changes in the large-scale world.

---

## 4. Design Guidelines
![](pictures/virtualaugmentedreality/04/Lecture04_Pg024_4_Design_Guidelines.png)

1.  **Map to Device**: Use pointing for distant selection, and grasping for close manipulation.
2.  **Reduce DOF**: Don't force 6DOF if 1DOF (a slider) works better.
3.  **Clutching**: Provide a way to "let go" and reposition the hand (like lifting a mouse).
4.  **Feedback**: Always provide visual, audio, or haptic confirmation of an action.

---

## 5. Self-Assessment Quiz
![](pictures/virtualaugmentedreality/04/Lecture04_Pg017_5_Self_Assessment_Quiz.png)


**Q1: What is the "Heisenberg Effect" in spatial interaction?**
> *Answer: The act of "clicking" (pressing a button) often causes the hand to move slightly, changing the selection point and causing errors.*

**Q2: Difference between Wayfinding and Travel?**
> *Answer: Travel is the mechanical movement (walking, flying, teleporting). Wayfinding is the mental process of navigation (knowing where you are and how to get to the destination).*

**Q3: Why is "Teleportation" popular in VR?**
> *Answer: It minimizes "vestibular-visual conflict." Since the user doesn't see themselves moving continuously through space, the brain doesn't expect the feeling of motion, reducing nausea.*

**Q4: Name a benefit of "Tangible AR".**
> *Answer: It provides natural haptic feedback (you feel the physical object) and uses existing human skills for manipulating physical props.*

---
[[/notes/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
