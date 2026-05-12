---
title: "04_VR-AR - Interaction in VR/AR"
tags:
  - vrar
  - interaction
  - 3dui
  - ux
date: 2026-05-05
---

[[/notes/lectures/virtualaugmentedreality/03-2_VR-AR_hardware-2|Previous: (y-03.2) AR Displays and Input Hardware]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/05_VR-AR_tracking|Next: (y-05) Tracking]]

## Mental Model First

3D interaction is hard because it removes many helpful 2D constraints. The user must select, manipulate, navigate, and control systems in a space where precision, fatigue, depth, occlusion, and feedback all matter.

![[pictures/virtualaugmentedreality/04/Lecture04_Pg005_Typical_Tasks.png]]

<p class="image-caption">Typical 3D interaction tasks include object interaction, navigation, and system control.</p>

## 1. Why 3D Interaction Is Hard

Compared with desktop UI, VR/AR interaction has:

- more degrees of freedom,
- spatial ambiguity,
- less stable physical support,
- hand and arm fatigue,
- tracking noise,
- occlusion and depth perception problems,
- weaker standards and fewer mature tools than classical 2D UI.

Good interaction techniques add constraints where the real world no longer provides them.

## 2. Selection

![[pictures/virtualaugmentedreality/04/Lecture04_Pg007_Selection.png]]

<p class="image-caption">Selection is the basis for manipulation and can overcome real-world limits of reachability and visibility.</p>

Selection techniques:

- **Touch/direct hand**: natural for nearby objects but limited by reach.
- **Raycasting**: efficient for distant objects but sensitive to hand jitter.
- **Hand tracking**: uses the user's hands as the input device.
- **Eye tracking and multimodal input**: can be combined with voice or gestures, as introduced in the lecture's multimodal interaction section.

## 3. Manipulation

![[pictures/virtualaugmentedreality/04/Lecture04_Pg013_Manipulation.png]]

<p class="image-caption">Manipulation modifies object properties such as translation, rotation, scale, or more complex attributes.</p>

Manipulation starts after selection. The common operations are translate, rotate, and scale. A central design decision is whether to preserve full 6DOF control or constrain motion to make the task easier and more precise.

Useful principles:

- map technique to device capabilities,
- reduce degrees of freedom when possible,
- provide continuous feedback,
- support clutching or mode changes when the hand becomes awkwardly positioned.

## 4. Navigation

![[pictures/virtualaugmentedreality/04/Lecture04_Pg017_Navigation.png]]

<p class="image-caption">Navigation combines travel, the motor component of movement, with wayfinding, the cognitive component of deciding where to go.</p>

Navigation has two parts, both named in the lecture:

- **Travel**: moving through the environment.
- **Wayfinding**: understanding location, route, and destination.

The lecture explicitly contrasts redirected walking and teleportation as VR navigation techniques. Redirected walking is tied to the cited Razzaque, Kohn, and Whitton work; teleportation is presented as another common travel technique.

## 5. System Control and Complex Tasks

![[pictures/virtualaugmentedreality/04/Lecture04_Pg021_System_Control.png]]

<p class="image-caption">System control includes menus, commands, mode changes, and complex tasks such as 3D data exploration.</p>

System control issues:

- menus should be reachable and stable,
- command modes must be visible,
- gestures should avoid accidental activation,
- 2D interfaces inside 3D environments are sometimes the pragmatic choice.

## 6. AR-Specific Interaction

![[pictures/virtualaugmentedreality/04/Lecture04_Pg025_VR_AR_Interaction.png]]

<p class="image-caption">VR often interacts with virtual objects; AR must coordinate virtual objects, real objects, real surfaces, and shared physical space.</p>

![[pictures/virtualaugmentedreality/04/Lecture04_Pg043_World_In_Miniature.png]]

<p class="image-caption">World-in-miniature gives users an overview model that can be manipulated to affect the larger scene.</p>

AR-specific patterns include tangible props, magic mirrors, projection on surfaces, personal interaction panels, augmented maps, and world-in-miniature techniques.

## 7. Design Guidelines

![[pictures/virtualaugmentedreality/04/Lecture04_Pg024_Design_Guidelines.png]]

<p class="image-caption">Design guidelines emphasize device mapping, reducing degrees of freedom, and choosing techniques that lower error.</p>

Exam-ready guideline summary:

- There is no universal best technique.
- Match the technique to task, device, and environment.
- Reduce DOF when full freedom is unnecessary.
- Provide feedback for selection, manipulation, and mode changes.
- Design for physical comfort, not only task completion.

## Exam Focus

- Separate selection, manipulation, navigation, and system control.
- Explain travel vs. wayfinding.
- Explain why teleportation is comfortable.
- Describe how AR interaction differs from VR interaction.

## Self-Check

1. Why is raycasting useful and what problem does it introduce?
2. What is the difference between travel and wayfinding?
3. Why should manipulation often reduce degrees of freedom?
4. What does world-in-miniature provide?

---

[[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
