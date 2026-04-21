---
title: "01_VR-AR — Introduction & History of VR/AR"
tags:
  - vrar
  - history
  - theory
  - definitions
date: 2026-04-14
---
[[/notes/virtualaugmentedreality/00_VR-AR|Back: (y-00) Course Organization]] | [[/notes/virtualaugmentedreality/index|VR/AR Index]]

## Mental Model First: Tricking the Brain

- **VR is an Oxymoron**: It's a "virtual" (in essence, not in fact) "reality" (actually existing).
- **The Core Goal**: Inducing targeted behavior in an organism. We want to "fool" the brain into feeling present in a world that isn't there.
- **The Brain is Adaptable**: It doesn't need 8K graphics to feel "there." It needs low latency, consistent tracking, and correct proprioception.

---

## 1. Defining VR & AR

### Virtual Reality (VR)
"Inducing targeted behavior in an organism by using artificial sensory stimulation, while the organism has little or no awareness of the interference." (LaValle)

**The 4 Components of LaValle's Definition**:
1. **Targeted Behavior**: The organism has a designed "experience" (flying, walking, socializing).
2. **Organism**: Humans, but also fruit flies, cockroaches, fish, rodents, or monkeys.
3. **Artificial Sensory Stimulation**: Senses are co-opted/replaced by engineering.
4. **Awareness**: The organism is "fooled" into feeling present; the interference is accepted as natural.

### Augmented Reality (AR)
Unlike VR, which replaces your vision, AR overlays virtual information onto the physical environment.
- **Azuma's Criteria**: To be true AR, it must:
  1. Combine real and virtual content.
  2. Be interactive in real-time.
  3. Be registered in 3D (the virtual object stays locked in 3D space relative to the real world).

### Augmented Reality Feedback Loop
![AR Feedback Loop](pictures/virtualaugmentedreality/01/Lecture01_Pg015_AR_Feedback_Loop.png)
AR uses a feedback loop between the human user and the computer system. The system tracks the user’s viewpoint, registers the pose in the real world with virtual content, and presents **situated visualization**.

---

## 2. Immersion vs. Presence (Slater and Wilbur)

- **Immersion (Objective - System Property)**: The technological degree to which a VR system projects stimuli onto the sensory receptors (Slater and Wilbur 1997).
![Immersion Factors](pictures/virtualaugmentedreality/01/Lecture01_Pg009_Immersion_Factors.png)
    - **Extensiveness**: Range of sensory modalities (visuals, audio, haptics).
    - **Matching**: Congruence between modalities (e.g., head motion matches visual update).
    - **Surroundness**: Panoramic extent (FOV, spatialized audio, 360 tracking).
    - **Vividness**: Quality of simulation (resolution, frame rate, lighting).
    - **Interactability**: User's ability to make changes to the world.
    - **Plot**: The story and consistent portrayal of the experience.

- **Presence (Subjective - User Experience)**: The psychological "sense of being there."
    - **Break-in-presence (BIP)**: The moment the illusion breaks (e.g., due to lag or seeing the real world).

### The 4 Illusions of Presence (Lecture)
To achieve a high degree of presence, a system must sustain:
1. **Place Illusion (PI)**: The illusion of being in a stable, physical place.
2. **Self-Embodiment Illusion**: Seeing and feeling a virtual body (avatar) as your own.
3. **Physical Interaction Illusion**: Virtual objects respond to your actions.
4. **Social Communication Illusion**: Other agents respond to you as if you are there.

---

## 3. Mixed Reality Continuum & Fidelity

### Mixed Reality Continuum (Milgram)
![Mixed Reality Continuum](pictures/virtualaugmentedreality/01/Lecture01_Pg075_Mixed_Reality_Continuum.png)
Reality is not binary. It's a spectrum:
`Reality` $\to$ `Augmented Reality (AR)` $\to$ `Augmented Virtuality (AV)` $\to$ `Virtual Reality (VR)`.

- **Augmented Virtuality (AV)**: Bringing real-world elements into a virtual world.
- **Mediated Reality**: Technology that adds, removes, or alters our perception (Steve Mann).
- **Diminished Reality**: A subset of AR/Mediated Reality that *removes* real-world elements (e.g., erasing a wire from a view).

---

## Mixed Reality & Presence Cheat Sheet (Exam Prep)

| Concept | Key Definition | Critical Criteria |
| :--- | :--- | :--- |
| **Azuma's AR** | Overlaying virtual on real | 1. Combine Real/Virtual, 2. Real-time, 3. 3D Registered. |
| **Immersion** | **Objective** system properties | Resolution, FOV, Frame rate, Latency. |
| **Presence** | **Subjective** user feeling | Place Illusion (PI) and Plausibility Illusion (Psi). |
| **Milgram's MR** | Reality-Virtuality Continuum | Reality $\to$ AR $\to$ AV $\to$ VR. |
| **BIP** | Break-in-Presence | Moment the user remembers the real world (e.g., hitting a wall). |

### Slater's 4 Illusions of Presence:
1.  **Place Illusion (PI)**: The feeling of being "there" (stable world).
2.  **Plausibility Illusion (Psi)**: The feeling that what is happening is "real" (events respond to you).
3.  **Self-Embodiment**: Seeing a virtual body as your own.
4.  **Social Illusion**: Feeling that others in the world are also "present."

---

## 3. Fidelity Continua (McMahan 2003 / Jerald)
![Fidelity Continua](pictures/virtualaugmentedreality/01/Lecture01_Pg012_Fidelity_Continua.png)
1. **Representational Fidelity**: How realistic the world looks/sounds (Photorealistic $\to$ Abstract).
2. **Interaction Fidelity**: How realistic the interactions are (Physical training $\to$ Magic buttons).
3. **Experiential Fidelity**: How well the user's experience matches the creator's intention (Scripted $\to$ Free-roaming).

---

## 4. History: Milestones of Perception

- **1832: Wheatstone's Stereoscope**: Proved binocular disparity is key to 3D depth.
- **1870: Brewster Stereoscope**: Mass-produced (250k units), used lenses for 3D effect.
- **1960: Heilig's Stereoscopic TV**: First actual HMD patent.
- **1962: Sensorama (Heilig)**: Full-body simulator (3D video, sound, wind, vibration, smells like bread/exhaust).
- **1968: The Sword of Damocles (Sutherland)**: First HMD and AR system (wireframe 3D).
- **1988: NASA VIEW System**: Early HMD system.
- **Late 80s: Boeing Wire Harness**: First industrial AR use (David Mizell).
- **1990: Grope III**: Haptic display for molecular docking.
- **1993: KARMA**: First knowledge-driven AR (printer maintenance).
- **1994: Ultrasound Pregnancy Visualization**: First medical AR (Andrei State, UNC).
- **1994: NaviCam**: Handheld AR forerunner (Jun Rekimoto).
- **Late 90s: Construct3D**: Teaching geometry in AR to students.
- **1999: ARQuake**: First outdoor AR game (Bruce Thomas).
- **1999: ARToolKit**: First popular open-source AR framework (Mark Billinghurst).
- **1999: Invisible Train**: Handheld AR game with virtual trains on real tracks.

---

## 5. Fidelity & The Uncanny Valley

### The Uncanny Valley
![Uncanny Valley Chart](pictures/virtualaugmentedreality/01/Lecture01_Pg011_Uncanny_Valley.png)
As a virtual character becomes more human-like, our empathy increases—until they are "almost" human, at which point our reaction turns to revulsion. 

---

## 6. The Hype Cycle: Where are we?
![Gartner Hype Cycle](pictures/virtualaugmentedreality/01/Lecture01_Pg077_Gartner_Hype_Cycle.png)
VR and AR have historically been characterized by the **Gartner Hype Cycle**:
1. **Innovation Trigger**
2. **Peak of Inflated Expectations**
3. **Trough of Disillusionment**
4. **Slope of Enlightenment**
5. **Plateau of Productivity**

---

## 7. Applications

### Virtual Reality (VR)
- **Psychology**: **Freud-Me** (Perspective taking), Phobia treatment (Heights, Spiders).
- **Healthcare**: Surgery simulation, rehabilitation.
- **Heritage**: **Curia Julia** (voice propagation/archeology).
- **Fine Arts**: Jacolby Satterwhite's "Domestika".

### Augmented Reality (AR)
- **Industry**: **Discrepancy Analysis** (CAD vs. Factory floor), **Planar** display on wheels.
- **Infrastructure**: **Underground Inspection** (gas pipes via GPS/AR).
- **Medical**: **CamC** (X-ray overlay on C-arm), Needle insertion support.
- **Navigation/Info**: **Peak.AR** (mountain tops), **Wikitude Drive** (road perspective), **Google Translate**.
- **Broadcast/Retail**: **LiberoVision** (soccer broadcast), **IKEA Place** (virtual furniture), **Pictofit** (virtual try-on).
- **Games**: **Pokémon GO**, **Apple SwiftShot**, **Eye of Judgement** (Sony MR).

---
[[/notes/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
