---
title: "01_VR-AR - Introduction and History"
tags:
  - vrar
  - history
  - definitions
  - theory
date: 2026-04-14
---

[[/notes/lectures/virtualaugmentedreality/00_VR-AR|Previous: (y-00) Course Organization]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/02_VR-AR_hcd|Next: (y-02) Human-Centered Design]]

## Mental Model First

VR replaces the user's sensory world; AR modifies the user's perception of the physical world. Both are about controlling a perception-action loop. The core question is not "is the image realistic?" but "does the system induce the intended experience and behavior while staying coherent, responsive, and registered?"

## 1. Definitions: VR, AR, and Mixed Reality

VR is commonly framed as a computer-generated environment that uses artificial sensory stimulation to induce targeted behavior. The system tries to make the user act as if the virtual situation were real enough.

AR keeps the physical world in view and overlays virtual information on top of it. Azuma's classic criteria are the exam anchor:

- combines real and virtual content,
- is interactive in real time,
- is registered in 3D.

![[pictures/virtualaugmentedreality/01/Lecture01_Pg015_AR_Feedback_Loop.png]]

<p class="image-caption">AR is a feedback loop: the user observes an augmented display, controls the viewpoint, the system tracks that view, and the computer updates the situated visualization.</p>

## 2. Immersion and Presence

![[pictures/virtualaugmentedreality/01/Lecture01_Pg009_Immersion_Presence.png]]

<p class="image-caption">Immersion is a system property; presence is the user's subjective feeling of being in the mediated environment.</p>

Use this distinction carefully:

- **Immersion** is objective: field of view, resolution, tracking volume, latency, refresh rate, audio, haptics, and interaction capability.
- **Presence** is subjective: the user's feeling of being there and accepting the mediated situation.
- **Break in presence** happens when the illusion collapses, often because of latency, visual mismatch, tracking error, or interaction failure.

## 3. History: Why Old Systems Still Matter

![[pictures/virtualaugmentedreality/01/Lecture01_Pg025_Sword_Of_Damocles.png]]

<p class="image-caption">Sutherland's Sword of Damocles is an early head-mounted AR system and a key milestone in immersive display history.</p>

Important milestones:

- Wheatstone's stereoscope showed the importance of binocular disparity.
- Heilig's Sensorama combined multiple sensory channels.
- Sutherland's Sword of Damocles introduced a tracked head-mounted display.
- NASA VIEW and later HMDs pushed VR toward practical systems.
- Boeing wire harness guidance, KARMA, NaviCam, ARToolKit, and outdoor AR systems shaped early AR practice.

The pattern is consistent: VR/AR progresses when display, tracking, registration, and interaction improve together.

## 4. Applications

![[pictures/virtualaugmentedreality/01/Lecture01_Pg040_Application_Examples.png]]

<p class="image-caption">VR application examples include entertainment, psychology, healthcare, education, training, fine arts, heritage, and archaeology.</p>

VR applications often benefit from replacing the environment: exposure therapy, training, simulation, art, virtual heritage, and embodied experiments. AR applications often benefit from keeping the real environment visible: maintenance, medical guidance, navigation, industrial discrepancy analysis, translation, retail, sports visualization, and situated information overlays.

## 5. Mixed Reality Continuum

![[pictures/virtualaugmentedreality/01/Lecture01_Pg075_Mixed_Reality_Continuum.png]]

<p class="image-caption">Milgram's continuum places real environments, AR, augmented virtuality, and virtual reality on one spectrum.</p>

The useful exam idea is that reality and virtuality are not binary:

`real environment -> augmented reality -> augmented virtuality -> virtual environment`

Related terms:

- **Augmented virtuality** brings real elements into a mostly virtual world.
- **Mediated reality** alters perception by adding, removing, or transforming information.
- **Diminished reality** removes real-world content from the user's view.

## 6. Hype and Adoption

![[pictures/virtualaugmentedreality/01/Lecture01_Pg079_AR_VR_Hype_Cycle.png]]

<p class="image-caption">The lecture places AR and VR on Gartner's hype cycle across multiple years, showing AR moving through inflated expectations and VR rising along the slope of enlightenment by 2017.</p>

The point is more specific than a generic hype-cycle diagram: AR and VR do not move through adoption at the same pace. The slide marks where Gartner placed AR and VR between 1995 and 2017, making the hype cycle a way to discuss the field's maturity rather than only a general technology-adoption curve.

## Exam Focus

- Define VR using artificial sensory stimulation and targeted behavior.
- Define AR using Azuma's three criteria.
- Separate immersion from presence.
- Explain the mixed reality continuum without treating AR and VR as unrelated fields.
- Connect historical systems to the technical challenge they exposed.

## Self-Check

1. Why is immersion objective while presence is subjective?

> [!success]- Answer
> Immersion is a property of the system: field of view, resolution, tracking volume, latency, refresh rate, audio, haptics, and interaction capability. Those can all be measured. Presence is the user's internal feeling of being in the mediated environment, which depends on the individual and the context. The same immersive setup can produce strong presence for one user and a break in presence for another.

2. Which three criteria make an application AR according to Azuma?

> [!success]- Answer
> It must combine real and virtual content, be interactive in real time, and be registered in 3D. All three are required; a static overlay or a non-real-time composite does not qualify.

3. Where does augmented virtuality sit on Milgram's continuum?

> [!success]- Answer
> Between augmented reality and virtual environment, closer to the virtual end. The world is mostly virtual, with real elements brought into it. The continuum runs: real environment, augmented reality, augmented virtuality, virtual environment.

4. Why does AR need tracking and registration more explicitly than ordinary screen graphics?

> [!success]- Answer
> Ordinary screen graphics live in the display's coordinate system; the real world is irrelevant. AR overlays virtual content on the physical environment, so the system must know the user's viewpoint and the world's geometry well enough to place virtual content at the right pixel. Without tracking and registration the overlay drifts and the illusion collapses, which is Azuma's "registered in 3D" criterion.

5. How does the lecture define VR, and how is that definition different from AR?

> [!success]- Answer
> VR is framed as a computer-generated environment that uses artificial sensory stimulation to induce targeted behaviour: the system stimulates the senses so the user acts as if the virtual situation were real. AR, by Azuma's criteria, instead keeps the real world in view and adds virtual content that is combined with reality, interactive in real time, and registered in 3D. The dividing line is whether the real world is replaced (VR) or kept and augmented (AR).

6. What recurring pattern does the history of VR/AR reveal about how the field advances?

> [!success]- Answer
> Progress happens when display, tracking, registration, and interaction improve together, not when any one alone does. Sutherland's Sword of Damocles paired a head-mounted display with head tracking; later milestones (NASA VIEW, Boeing wire-harness guidance, ARToolKit, outdoor AR) each advanced because the supporting capabilities matured in step. A great display with poor tracking, or good tracking with no interaction, does not produce a usable immersive system.

7. Distinguish augmented virtuality, mediated reality, and diminished reality.

> [!success]- Answer
> Augmented virtuality sits on Milgram's continuum near the virtual end: a mostly virtual world with real elements brought into it. Mediated reality is broader, altering perception by adding, removing, or transforming information. Diminished reality is the subtractive case, removing real-world content from the user's view. Standard AR only adds content, so diminished and mediated reality are generalizations of it.

---

[[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
