---
title: "02_VR-AR — Human-Centered Design for VR/AR"
tags:
  - vrar
  - design
  - hcd
  - theory
date: 2026-04-21
---
[[/notes/virtualaugmentedreality/01_VR-AR|Back: (y-01) Introduction & History]] | [[/notes/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/virtualaugmentedreality/03-1_VR-AR_hardware|Next: (y-03.1) Stereo Rendering & Hardware]]

## Mental Model: VR is for Humans
![](pictures/virtualaugmentedreality/02/Lecture0202_Pg005_Mental_Model_Vr_Is_For_Humans.png)

<p class="image-caption">The core philosophy: VR and AR systems must be designed for the human sensory system to ensure comfort and presence.</p>

Human-Centered Design (HCD) in VR/AR isn't just about "good UI." It's about designing for the **human sensory system**. Because VR/AR co-opts our biological senses (vision, vestibular system), poor design doesn't just lead to "bad UX"—it leads to **physical illness**.

---

## 1. The Iterative Design Process
![](pictures/virtualaugmentedreality/02/Lecture0202_Pg004_1_The_Iterative_Design_Process.png)

<p class="image-caption">The iterative design loop: Analysis, Design, Prototyping, and Evaluation.</p>

The core methodology for VR/AR design is iterative. Unlike traditional software where you might "think everything through" first, VR requires a **"Create Culture"**:
**Analysis** $\to$ **Design** $\to$ **Prototype** $\to$ **Test**

### Why iteration is mandatory:
![](pictures/virtualaugmentedreality/02/Lecture0202_Pg004_Why_Iteration_Is_Mandatory.png)

<p class="image-caption">Why iteration is key: Exploring new UI patterns, managing biological sensitivity, and failing early.</p>

1. **Unexplored Space**: There are no "standard" UI patterns like the "Hamburger Menu" in VR yet.
2. **Biological Sensitivity**: Small changes in camera movement or latency can have massive impacts on user comfort.
3. **Fail Early, Fail Often**: It is significantly cheaper to find a nauseating interaction in a low-fi prototype than in the final shipped product.

---

## 2. Analysis & Constraints

### The Vision
Every project starts with a vision. As Eugene Ferguson noted, great engineering feats (like rockets) exist because they were first a mental picture. In VR, this vision defines the **Targeted Behavior**.

### Understanding Constraints
![](pictures/virtualaugmentedreality/02/Lecture0202_Pg007_Understanding_Constraints.png)

<p class="image-caption">Balancing the vision with real and overcomable constraints.</p>

- **Real Constraints**: Laws of physics, hardware limitations (e.g., FOV of the headset), or human biological limits (e.g., maximum comfortable rotation speed).
- **Overcomable Constraints**: Resource limits, budget, or misperceptions about what the technology can do.

### The "Elastic User" Threat
![](pictures/virtualaugmentedreality/02/Lecture0202_Pg008_The_Elastic_User_Threat.png)

<p class="image-caption">The Elastic User Threat: Avoid redefining user needs to fit design limitations.</p>

One of the biggest design failures is designing for an "elastic user"—a user whose needs and skills change whenever the designer faces a hard decision. To combat this, we use **Personas** and **User Stories** to keep the target human fixed.

---

## 3. Technical Requirements & Motion Sickness (Deep Dive)

According to **Jason Jerald** (*The VR Book*), maintaining the "Illusion of Presence" requires meeting strict technical thresholds.

### The Golden Rule: Latency
- **Motion-to-Photon Latency**: The time it takes for a user's head movement to be reflected as new photons on the display.
- **Threshold**: Ideally **< 20ms**.
- **The Result of Failure**: If latency exceeds **30ms**, the virtual world appears to "swim" or lag behind your eyes. This creates a sensory mismatch that triggers sickness.

### Theories of Motion Sickness
![](pictures/virtualaugmentedreality/02/Lecture02_Sensory_Conflict.png)

<p class="image-caption">Sensory Conflict: The mismatch between visual cues and vestibular input is a primary cause of motion sickness.</p>

1. **Sensory Conflict Theory**: The most accepted theory. Your eyes see you moving (visual), but your inner ear (vestibular) says you are sitting still. This conflict causes the brain to panic.
2. **Evolutionary (Poison) Theory**: The brain interprets the sensory mismatch as a sign of hallucination caused by poisoning (neurotoxins). It triggers the vomit response to "clear" the poison.
3. **Postural Instability**: Sickness occurs when the user can't maintain a stable balance because virtual cues conflict with gravity.

### Design Mitigations
- **Rest Frames**: Providing a stable reference point (e.g., a cockpit, a dashboard, or even a virtual "nose").
- **FOV Vignetting**: Narrowing the field of view during fast movement to reduce peripheral motion (where we are most sensitive to flow).
- **Snap Turning**: Using instant "teleport" rotations rather than smooth, artificial camera pans.
- **Constant Velocity**: Avoid acceleration. The human inner ear senses acceleration, not speed. A constant speed is much easier for the brain to handle.

---

## 4. VR Locomotion & Comfort Cheat Sheet (Exam Prep)

| Problem | Cause | Design Solution |
| :--- | :--- | :--- |
| **Cybersickness** | Sensory Conflict (Eyes see motion, ears don't) | Use **Teleportation** or **Snap Turning**. |
| **Vection** | Large-scale peripheral motion | **FOV Vignetting** (Blacking out the edges during movement). |
| **Instability** | Loss of horizon/grounding | **Rest Frames** (Keep a cockpit or static UI element visible). |
| **Nausea** | Frame rate drops / High latency | Maintain **90Hz+** and **<20ms** latency. |
| **Disorientation** | Unnatural camera rotation | Avoid **Yaw rotation** (panning the camera for the user). |

---

## 5. Prototyping & Testing

### Fidelity Granularities
- **Low-Fidelity**:
    - **Wizard-of-Oz**: A human simulates the system's responses (e.g., a developer manually moves a virtual object when the user points at it).
    - **Sketches/Storyboards**: Mapping out the flow before touching a line of code.
- **High-Fidelity**: Fully functional interactive environments.

### Testing Plethora
- **Heuristic Evaluation**: Experts check the system against a list of "usability rules."
- **Controlled Lab Studies**: Using Eye-tracking and biometric sensors to measure stress/focus.
- **Formative vs. Summative**: Testing *during* development to shape the design vs. testing *after* to measure final performance.

---

## 5. Self-Assessment Quiz

**Q1: Why is "Constant Velocity" preferred over "Acceleration" in VR locomotion?**
> *Answer: The vestibular system (inner ear) senses changes in motion (acceleration). If the camera accelerates while the user is physically still, a sensory conflict occurs. Constant velocity is often accepted as "stable" by the brain.*

**Q2: What is a "Wizard-of-Oz" prototype?**
> *Answer: A low-fidelity prototyping technique where the complex system logic is replaced by a human operator "behind the curtain" to test user reactions without building the full backend.*

**Q3: According to Jerald, what is the ideal Motion-to-Photon latency for VR?**
> *Answer: Under 20ms (ideally) to 30ms (maximum tolerable).*

**Q4: Explain the "Rest Frame Hypothesis."**
> *Answer: The theory that providing a stable, fixed reference point in the user's view (like a cockpit) helps ground the user and reduces motion sickness by providing a stationary reference against moving visuals.*

---
[[/notes/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
