---
title: "12_Haptics - Haptic Feedback in VR and AR"
tags:
  - vrar
  - haptics
  - tactile-feedback
  - kinesthetic-feedback
  - force-feedback
  - pseudo-haptics
date: 2026-07-11
---

[[/notes/lectures/virtualaugmentedreality/11_Immersive_Analytics|Previous: (y-11) Immersive Analytics]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/13_VR-AR_Evaluation_Future_Trends|Next: (y-13) Evaluation and Future Trends]]

## Mental Model First

- VR and AR render sight and sound convincingly, but the sense of touch is what is missing: reach for a virtual object and your hand passes through nothing. Haptics is the attempt to close that gap.
- Two channels of touch matter and map to two device families. Tactile feedback targets the skin (pressure, texture, vibration, stretch, temperature via mechanoreceptors and thermoreceptors); kinesthetic feedback targets muscles, tendons, and joints (forces, weight, resistance).
- Two orthogonal design axes classify every device. Grounded versus ungrounded: is the device anchored to the world (strong, independent forces, but bulky and restricting) or worn on the body (free movement, but only forces between body parts)? Active versus passive: can it push you independently of your movement, or can it only stop your movement?
- Beyond real forces there are illusions. Pseudo-haptics creates the impression of haptic properties (like weight) visually or with a substitute stimulus (like skin stretch), and haptic retargeting reuses one physical prop for many virtual objects.
- The perfect system (quick to don, comfortable, unrestricting, whole-body active force plus full tactile detail, cheap) does not exist, and the lecture's closing question is whether it is even possible.

## 1. What Is Missing in VR

The lecture opens with the question "what is missing?": current VR delivers convincing visuals and audio, but when the user reaches out to touch the virtual world there is nothing there. **Haptics** covers all technology that renders touch: the mechanical, thermal, and force sensations that the real world provides for free.

## 2. The Physiology of Haptic Feedback

![[pictures/virtualaugmentedreality/12/Lecture12_Pg007_Haptic_Feedback_Receptors.png]]

<p class="image-caption">The receptor map of haptic feedback (Huang et al. 2022): different skin receptors respond to pressure and texture, stroking and fluttering, skin stretching, and high-frequency vibration, while free nerve endings signal touch, vibration, cold, pain, and heat.</p>

Haptic hardware is designed against the body's receptor types (Huang et al. 2022). The skin's mechanoreceptors divide the tactile channel:

- **Pressure and texture** (Merkel cells)
- **Stroking and fluttering** (Meissner corpuscles)
- **Skin stretching** (Ruffini endings)
- **High-frequency vibration** (Pacinian corpuscles)
- **Free nerve endings**: touch, vibration, cold, **pain, heat** (thermoreceptors and nociceptors)

A device "renders" a sensation by driving the right receptor population: an eccentric motor for vibration, a pin array for pressure and texture, a stretching actuator for shear, a Peltier element for temperature.

![[pictures/virtualaugmentedreality/12/Lecture12_Pg008_Thermal_Haptics.png]]

<p class="image-caption">Thermal haptics: ThermOuch (SIGGRAPH Asia 2024) is a wearable thermo-haptic device that induces pain sensation in VR through the thermal grill illusion, interleaving warm and cool elements.</p>

Thermal haptics shows how far stimulus engineering can go: **ThermOuch** (Gao et al., SIGGRAPH Asia 2024) induces a **pain** sensation without harm via the **thermal grill illusion**, where interleaved warm and cool stimuli are perceived as burning pain.

## 3. Tactile Feedback Devices

![[pictures/virtualaugmentedreality/12/Lecture12_Pg011_Fluid_Reality_Gloves.png]]

<p class="image-caption">Fluid Reality: high-resolution, untethered haptic gloves using electroosmotic pump arrays  -  dense fingertip tactile pixels without bulky external compressors.</p>

**Tactile feedback devices** stimulate the skin. The state of the art example is **Fluid Reality**: high-resolution, untethered haptic gloves whose fingertip arrays are driven by **electroosmotic pump arrays**, achieving dense tactile "pixels" on the fingertip without tethered air compressors. Simpler tactile devices include vibration motors in controllers, vests, and belts.

## 4. Kinesthetic Feedback Devices

![[pictures/virtualaugmentedreality/12/Lecture12_Pg014_Kinesthetic_Feedback_Devices.png]]

<p class="image-caption">The kinesthetic zoo: INCA 6D (stringed, industrial), HapticGear, Transcalibur (weight-shifting controller), Drag:on (drag and weight shift), Thor's Hammer (propeller forces), Wireality (worn multi-string), Phantom Omni (mechanical arm).</p>

**Kinesthetic feedback devices** apply real forces to muscles and joints. The lecture's examples span the design space:

- **INCA 6D** (Perret and Dominjon): a commercial stringed haptic system for industrial applications, strings from the room's corners to an end effector.
- **HapticGear** (Hirose et al.): a wearable force display for immersive projection displays.
- **Transcalibur** (Shigeyama et al.): a VR controller that **moves weights** to render 2D shape through haptic shape illusion.
- **Drag:on** (Zenner and Krüger): a controller providing feedback via **drag and weight shift** (unfolding fans).
- **Thor's Hammer** (Heo et al.): an **ungrounded force feedback** device using **propeller-induced propulsive force**.
- **Wireality** (Fang et al.): worn **multi-string** haptics enabling complex tangible geometries, strings lock the fingers against a shoulder unit.
- **Phantom (Omni)**: the classic desktop **mechanical arm** delivering precise point forces to a stylus.

## 5. Grounded vs. Ungrounded Devices

![[pictures/virtualaugmentedreality/12/Lecture12_Pg018_Grounded_Ungrounded_Devices.png]]

<p class="image-caption">Grounded devices (INCA 6D, Phantom) anchor to the world and can exert independent forces; ungrounded devices (Thor's Hammer, Wireality) are carried or worn on the body.</p>

A **grounded** device is mechanically anchored to the environment (floor, ceiling, desk), so it can exert forces on the user that are independent of the user's body. An **ungrounded** device is worn or carried, so any force it produces must brace against another body part (or against air, as with propellers).

![[pictures/virtualaugmentedreality/12/Lecture12_Pg021_Grounded_Vs_Ungrounded_Pros_Cons.png]]

<p class="image-caption">The grounded versus ungrounded trade-off table: force strength, force relation, setup, comfort, hygiene, free movement, size, and price all pull in different directions.</p>

The full trade-off table:

| Attribute      | Grounded           | Ungrounded                     |
| :------------- | :----------------- | :----------------------------- |
| Force strength | High               | Low                            |
| Force relation | Independent forces | Only forces between body parts |
| Setup          | Nothing to put on  | Have to put on                 |
| Comfort        | High               | Low to medium                  |
| Hygiene        | Good               | Low                            |
| Free movement  | Restricted         | Unrestricted                   |
| Size           | Bulky              | Small                          |
| Price          | Medium to high     | Low to medium                  |

Room-scale examples of grounding the environment itself: **ZoomWalls** uses dynamic robotic walls that simulate haptic infrastructure for room-scale VR, and **PropellerHand** is a hand-mounted propeller-based force feedback device on the ungrounded side.

### 💡 Intuition

Grounded devices win on physics (they can push you, hard, in any direction, because the reaction force goes into the building), ungrounded devices win on everything ergonomic (freedom, size, price). The force relation row is the deep one: an ungrounded device can never simulate a wall that stops your whole body, because there is nothing external to brace against; it can only make your fingers feel resistance relative to your own shoulder.

## 6. Active vs. Passive Haptic Feedback

![[pictures/virtualaugmentedreality/12/Lecture12_Pg023_Active_Passive_Feedback_Devices.png]]

<p class="image-caption">Active devices apply forces independent of the user's movement (weight simulation, being hit); passive devices only produce forces when the user moves or activates muscles (colliding against a surface).</p>

The second axis is who initiates the force:

- **Active** haptic feedback devices can apply forces on the user **independent of the user's movement**. Example: weight simulation, or a moving ball hitting you. Pros: can simulate many more haptic interactions. Cons: **safety issues** and more complex implementation.
- **Passive** haptic feedback devices can **only stop movement**; forces arise only when the user moves or activates muscles. Example: colliding against a surface. Pros: fewer safety issues, simpler implementation. Cons: if the user is not moving, no haptics can be simulated.

An example of active feedback is **STROE**, an ungrounded string-based weight simulation device.

## 7. A Taxonomy of Feedback Devices

![[pictures/virtualaugmentedreality/12/Lecture12_Pg026_Types_Of_Feedback_Devices.png]]

<p class="image-caption">The lecture's device taxonomy: vibration, pressure, and skin stretch (ungrounded, tactile); propeller- and string-based, mechanical arm, encountered-type (kinesthetic, grounded or ungrounded); EMS-based; gloves (kinesthetic and tactile); pseudo-haptics.</p>

The lecture's map of device types, with their typical classification:

- **Vibration, pressure, skin stretch**: ungrounded, tactile.
- **Propeller-based, string-based, mechanical arm, encountered-type**: kinesthetic, grounded or ungrounded depending on construction.
- **EMS-based**: forces rendered directly through muscle stimulation.
- **Gloves**: ungrounded, kinesthetic and tactile combined.
- **Pseudo**: no real force at all, only illusion.

### EMS-Based Haptics

![[pictures/virtualaugmentedreality/12/Lecture12_Pg028_EMS_Haptics.png]]

<p class="image-caption">Electrical muscle stimulation: electrodes on the user's muscles render forces as stimulation, e.g. triggering the triceps so the user must fight with the biceps to lift a virtual weight.</p>

**Electrical Muscle Stimulation (EMS)** attaches electrodes to the user's muscles and renders forces as **muscle stimulation**. Example: when the user grabs a virtual weight, the system triggers the **triceps**, so the user has to use the **biceps** to lift against their own stimulated antagonist. The same principle simulates walls and heavy objects in VR (Lopes et al.): the body becomes its own grounded force display.

### Encountered-Type Haptics

![[pictures/virtualaugmentedreality/12/Lecture12_Pg030_Encountered_Type_Haptics.png]]

<p class="image-caption">Encountered-type haptics: physical actuators move to meet the user's hand exactly where the virtual contact happens, keeping tactile feedback synchronized with the visuals.</p>

**Encountered-type haptics** employs physical devices that **move and adjust to the user's hand or body**: the actuators continuously adapt to the user's movements so tactile feedback stays synchronized with the visual experience. Example: the user swings a sword in VR against an opponent's sword, and a mechanical arm positions a **physical sword** at exactly the position of the virtual opponent's blade. Systems demonstrated in the lecture: **CoVR**, a large-scale force-feedback robotic interface for non-deterministic VR scenarios, and **Beyond The Force**, which uses **quadcopters** to appropriate objects and the environment for haptics.

### Pseudo-Haptics

![[pictures/virtualaugmentedreality/12/Lecture12_Pg033_Pseudo_Haptics.png]]

<p class="image-caption">Pseudo-haptics gives only the illusion of haptic feedback, created visually or by substituting another haptic stimulus, e.g. simulating weight by stimulating skin stretch.</p>

**Pseudo-haptics** gives only the **illusion** of haptic feedback. The illusion can be created **visually** (manipulating the control-display ratio so an object "feels" heavy because the virtual hand lags) or with a **substitute haptic stimulus**, for example simulating **weight by stimulating skin stretch**. Examples:

- **Grabity**: a wearable haptic interface simulating **weight and grasping** through asymmetric vibration and skin stretch.
- **Haptic retargeting**: dynamically repurposing **one passive physical prop** for several virtual objects by imperceptibly warping the virtual hand's path so it always lands on the real prop.

### 🧠 Deep Dive: Why Illusions Are Competitive

Real force rendering fights physics: grounded robots are expensive and dangerous, ungrounded devices cannot produce net external force. Pseudo-haptics instead exploits that perception is multimodal and vision usually dominates: if the eyes see the hand slow down inside a "heavy" object, the brain infers weight even though the muscles feel nothing. Combined with sensory substitution (skin stretch standing in for load force) and retargeting (one prop, many objects), illusions deliver a large fraction of perceived realism at a tiny fraction of the hardware cost, which is why so much recent research lives here.

## 8. Haptic Gloves

![[pictures/virtualaugmentedreality/12/Lecture12_Pg036_Gloves.png]]

<p class="image-caption">Commercial haptic gloves: SenseGloves Nova, Manus Prime 3 Haptic XR, and HaptX Gloves G1  -  combining per-finger force feedback with tactile actuators.</p>

Gloves are the commercially most visible form factor, combining kinesthetic (per-finger resistance) and tactile (fingertip actuators) feedback: **SenseGloves Nova**, **Manus Prime 3 Haptic XR**, and **HaptX Gloves G1** (microfluidic tactile pixels plus force feedback).

## 9. Haptics in Applications: Automotive

![[pictures/virtualaugmentedreality/12/Lecture12_Pg038_Strives_Automotive.png]]

<p class="image-caption">Strives: string-based force feedback for automotive engineering  -  virtual prototypes of car interiors become graspable during design reviews in VR.</p>

The lecture's application example is the **automotive industry**: **Strives** (Achberger et al.) provides **string-based force feedback for automotive engineering**, letting engineers physically feel virtual car interior prototypes during VR design reviews, long before physical prototypes exist.

## 10. The Future of Haptics

![[pictures/virtualaugmentedreality/12/Lecture12_Pg040_Perfect_Haptic_System.png]]

<p class="image-caption">The perfect haptic feedback system: quick to put on, comfortable, unrestricting, active whole-body force feedback, tactile feedback everywhere (texture, pressure, temperature), and cheap. Is it even possible?</p>

What would a **perfect haptic feedback system** look like?

- Quick and simple to put on
- Comfortable
- Does not restrict movement
- **Active force feedback on the whole body**
- **Tactile feedback everywhere**: texture, pressure, temperature, ...
- Cheap

Every requirement fights another (whole-body active force wants grounding and bulk; comfort and price want neither), so the closing question is whether such a system is even possible. On the timeline from the first haptic device to today we remain far from the perfect system, and speculative paths like brain interfaces (the slide references Neuralink's implant setbacks) show how uncertain the endgame is.

---

## Exam Focus

- Haptics closes the missing touch channel in VR/AR; devices are designed against skin receptor types (Huang et al. 2022): pressure/texture, stroking/fluttering, skin stretch, high-frequency vibration, plus free nerve endings for touch, temperature, and pain.
- Tactile (skin) versus kinesthetic (muscles, tendons, joints) feedback; example devices for each (Fluid Reality electroosmotic gloves; INCA 6D, Phantom, Thor's Hammer, Wireality).
- Grounded versus ungrounded: know the full trade-off table (force strength, force relation, setup, comfort, hygiene, movement, size, price) and the key limit that ungrounded devices only produce forces between body parts.
- Active versus passive: active applies forces independent of user movement (more interactions, safety issues); passive only stops movement (safe, simple, but useless when the user is still).
- Device taxonomy: vibration/pressure/skin stretch (ungrounded tactile), propeller/string/mechanical arm/encountered-type (kinesthetic), EMS, gloves, pseudo.
- EMS renders force by stimulating antagonist muscles; encountered-type moves physical actuators to meet the user (CoVR, quadcopters); pseudo-haptics is pure illusion, visually or by stimulus substitution (Grabity, haptic retargeting).
- Application: Strives string-based force feedback in automotive engineering.
- The perfect-system checklist and why its requirements conflict.

## Self-Check

1. Distinguish tactile and kinesthetic feedback and name the receptor targets of each.

> [!success]- Answer
> Tactile feedback targets the skin: mechanoreceptors for pressure and texture, stroking and fluttering, skin stretching, and high-frequency vibration, plus free nerve endings for touch, cold, heat, and pain. Kinesthetic feedback targets the muscles, tendons, and joints, conveying forces, weight, and resistance to movement. Tactile devices stimulate the skin surface (vibration motors, pin arrays, pumps); kinesthetic devices apply real forces to the body (mechanical arms, strings, propellers).

2. Compare grounded and ungrounded haptic devices across the main attributes.

> [!success]- Answer
> Grounded devices are anchored to the environment: high force strength, forces independent of the user's body, nothing to put on, high comfort and good hygiene, but restricted movement, bulky, and medium to high price. Ungrounded devices are worn or carried: unrestricted movement, small, low to medium price, but low force strength, only forces between body parts, must be put on, lower comfort and hygiene. The fundamental physical difference is the force relation: only a grounded device can exert a net external force on the user, such as a wall that stops the hand absolutely.

3. What distinguishes active from passive haptic feedback, and what are the trade-offs?

> [!success]- Answer
> Active devices can apply forces on the user independent of the user's movement, for example simulating weight or a moving ball hitting the user; they can simulate more haptic interactions but raise safety issues and are more complex to implement. Passive devices can only stop movement: forces appear only when the user moves or activates muscles, as when colliding against a surface. They are safer and simpler, but if the user is not moving, no haptic sensation can be rendered at all.

4. How does EMS-based haptics render a force such as lifting a heavy virtual object?

> [!success]- Answer
> Electrodes are attached to the user's muscles and forces are rendered as muscle stimulation. To simulate grabbing a weight, the system stimulates the triceps (the antagonist), so the user must exert the biceps against their own stimulated muscle to lift, which feels like real load. The same principle can render walls and heavy objects: the user's own body supplies the reaction force, making EMS a kind of body-grounded force display without external mechanics.

5. What is encountered-type haptics? Give an example system.

> [!success]- Answer
> Encountered-type haptics uses physical devices that move and adjust to the user's hand or body, continuously adapting to the user's movements so tactile feedback is synchronized with the visual experience: the user encounters a real object exactly where the virtual object appears. Example: a mechanical arm positions a physical sword where the virtual opponent's sword is (as in CoVR, a large-scale force-feedback robotic interface), or quadcopters carry props to the point of contact (Beyond The Force).

6. Define pseudo-haptics and describe two concrete techniques.

> [!success]- Answer
> Pseudo-haptics gives only the illusion of haptic feedback, created either visually or by substituting a different haptic stimulus. Grabity simulates weight and grasping with a wearable device using skin stretch and asymmetric cues instead of real load forces. Haptic retargeting dynamically repurposes one passive physical prop for multiple virtual objects by imperceptibly warping the mapping between real and virtual hand movement so the hand always lands on the real prop. Another example is simulating weight purely by stimulating skin stretch.

7. Why is the "perfect haptic system" so hard, possibly impossible, to build?

> [!success]- Answer
> The wish list is: quick and simple to put on, comfortable, unrestricting, active force feedback on the whole body, tactile feedback everywhere (texture, pressure, temperature), and cheap. The requirements conflict physically: strong active whole-body forces demand grounding, bulk, and cost; freedom of movement and easy donning demand small ungrounded wearables that cannot produce independent external forces; full-body tactile coverage multiplies actuators, price, and discomfort. Every known device family sacrifices several of these attributes, which is why the lecture ends by asking whether the perfect system is even possible.

---

[[/notes/lectures/virtualaugmentedreality/11_Immersive_Analytics|Previous: (y-11) Immersive Analytics]] | [[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/13_VR-AR_Evaluation_Future_Trends|Next: (y-13) Evaluation and Future Trends]]
