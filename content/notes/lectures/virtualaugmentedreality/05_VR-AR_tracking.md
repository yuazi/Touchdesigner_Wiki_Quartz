---
title: "05_VR-AR - Tracking in VR/AR"
tags:
  - vrar
  - tracking
  - sensors
  - registration
date: 2026-05-12
---

[[/notes/lectures/virtualaugmentedreality/04_VR-AR_Interaction|Previous: (y-04) Interaction]] | [[/notes/lectures/virtualaugmentedreality/index|VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/06_VR-AR_CompVision|Next: (y-06) Computer Vision for AR]]

## Mental Model First

- **Tracking estimates pose over time.** VR/AR needs to know where the head, controllers, body, or real-world targets are.
- **Registration is the goal.** Tracking is useful because it lets virtual content align with the user's view, body, or world.
- **No sensor is perfect.** Every tracking technology trades off accuracy, precision, latency, workspace, robustness, and setup complexity.
- **Sensor fusion is the practical answer.** Modern systems combine sensors because single measurements are incomplete or unreliable.

## 1. Tracking, Calibration, and Registration

![[pictures/virtualaugmentedreality/05/Lecture05_Pg004_Tracking_Calibration_Registration.png]]

<p class="image-caption">Registration aligns spatial properties, calibration adjusts measurements offline, and tracking estimates pose in real time.</p>

The three terms are related but not interchangeable:

| Concept      | Meaning                            | Role in VR/AR                                                      |
| :----------- | :--------------------------------- | :----------------------------------------------------------------- |
| Registration | Alignment of spatial properties    | Makes virtual objects appear in the correct real or virtual place. |
| Calibration  | Offline adjustment of measurements | Corrects sensor and display parameters before or during use.       |
| Tracking     | Real-time measurement of pose      | Updates the system as the user or object moves.                    |

Tracking examples from the lecture include head tracking, controller tracking, and motion tracking. In AR, the tracking result must support stable 3D registration; otherwise augmentations drift or jitter relative to the real world.

## 2. Coordinate Systems and Frames of Reference

![[pictures/virtualaugmentedreality/05/Lecture05_Pg005_Coordinate_Systems.png]]

<p class="image-caption">Coordinate systems distinguish local object coordinates, world coordinates, display coordinates, and sensor-related coordinate frames.</p>

Coordinate systems are the bookkeeping layer of tracking. A tracked object may have local coordinates, but the application needs to know its pose relative to the world, the user's head, the display, or another object. Tracking therefore produces transformations between coordinate systems.

![[pictures/virtualaugmentedreality/05/Lecture05_Pg010_Degrees_Of_Freedom.png]]

<p class="image-caption">Full tracking requires six degrees of freedom: three positional dimensions and three rotational dimensions.</p>

Degrees of freedom:

- **3DOF orientation**: roll, pitch, and yaw.
- **3DOF position**: x, y, and z.
- **6DOF pose**: position plus orientation.

Frames of reference determine what an augmentation is stable relative to:

- **World-stabilized** content stays fixed in the physical or virtual world.
- **Body-stabilized** content moves with the user.
- **Screen-stabilized** content stays fixed in display space.

## 3. Measurement Coordinates, Phenomena, and Principles

![[pictures/virtualaugmentedreality/05/Lecture05_Pg007_Measurement_Coordinates.png]]

<p class="image-caption">Measurement coordinates distinguish global and local measurements, with different workspace and precision implications.</p>

The lecture separates tracking by what is measured and how it is measured:

- **Global vs. local measurements**: global systems can cover city-scale or unlimited workspaces, while local systems often offer higher precision in a restricted volume.
- **Physical phenomena**: visible light, infrared light, radio waves, sound, magnetic fields, acceleration, and mechanical motion can all support tracking.
- **Measurement principles**: signal strength, signal direction, time of flight, and direct geometric measurement.

Geometric measurement examples:

- **Trilateration** uses distances.
- **Triangulation** uses angles.
- **Rigid sensor arrangements** can provide more constraints through known geometry.

## 4. Outside-In vs. Inside-Out Tracking

![[pictures/virtualaugmentedreality/05/Lecture05_Pg013_Outside_In_Inside_Out.png]]

<p class="image-caption">Outside-in tracking uses stationary sensors observing mobile objects; inside-out tracking puts sensors on the mobile device observing the world.</p>

| Architecture | Sensor Location          | Typical Strength                       | Typical Weakness                                       |
| :----------- | :----------------------- | :------------------------------------- | :----------------------------------------------------- |
| Outside-in   | Fixed in the environment | Accurate in a prepared tracking volume | Limited workspace and line-of-sight occlusion          |
| Inside-out   | On the tracked device    | Mobile and flexible workspace          | Requires onboard sensing and environment understanding |

Signal sources can be passive or active:

- **Passive sources** use existing signals such as natural light or Earth's magnetic field.
- **Active sources** emit signals intentionally, such as infrared LEDs, lasers, or ultrasonic pulses.

## 5. Measurement Error and Temporal Behavior

![[pictures/virtualaugmentedreality/05/Lecture05_Pg015_Measurement_Error.png]]

<p class="image-caption">Measurement quality is described by accuracy, precision, noise, jitter, drift, latency, and update rate.</p>

Important error concepts:

- **Accuracy**: closeness to the true value.
- **Precision**: repeatability of the measurement.
- **Noise/jitter**: short-term unstable variation.
- **Drift**: gradual accumulated deviation over time.
- **Latency**: delay between real motion and reported measurement.
- **Update rate**: number of measurements per time interval.

These are independent. A sensor can be precise but inaccurate, low-latency but noisy, or accurate but too slow for comfortable VR.

## 6. Stationary and Mobile Tracking Systems

![[pictures/virtualaugmentedreality/05/Lecture05_Pg017_Stationary_Tracking_Systems.png]]

<p class="image-caption">Stationary tracking systems in the lecture include mechanical, electromagnetic, and ultrasonic tracking.</p>

Stationary systems in the lecture:

- **Mechanical tracking**: articulated arms with joints, encoders, or potentiometers. High precision but physically restrictive.
- **Electromagnetic tracking**: a stationary source produces magnetic fields; sensor coils infer pose. Metal and electromagnetic interference can distort measurements.
- **Ultrasonic tracking**: uses sound time of flight and trilateration, often requiring synchronization.

Mobile sensors:

- **GPS**: planet-scale radio time-of-flight, requiring signals from at least four satellites.
- **Differential GPS**: uses correction signals to compensate atmospheric distortion.
- **Wireless networks**: WiFi, Bluetooth, or mobile towers can provide coarse location through signal strength or geometry.
- **Magnetometer**: measures direction of Earth's magnetic field.
- **Gyroscope**: measures rotational velocity.
- **Linear accelerometer**: measures acceleration with a MEMS device.
- **Odometer**: measures movement mechanically or opto-electrically, such as a wheel encoder.

## 7. Optical Tracking

![[pictures/virtualaugmentedreality/05/Lecture05_Pg029_Optical_Tracking.png]]

<p class="image-caption">Optical tracking uses cameras, model-based or model-free tracking, and passive or active illumination.</p>

Optical tracking matters because cameras are cheap and powerful. The lecture distinguishes:

- **Model-based tracking**: a tracking model representing the 3D world is available.
- **Model-free tracking**: the system works from observed image features without a prepared full model.
- **Passive illumination**: uses natural or existing light.
- **Active illumination**: adds controlled light, such as infrared.

![[pictures/virtualaugmentedreality/05/Lecture05_Pg035_Markers_Natural_Features.png]]

<p class="image-caption">Fiducial markers are artificial tracking targets; natural features use salient points in the environment.</p>

Marker and feature tradeoffs:

- **Fiducial markers** are artificial, easy to detect, and can provide enough points for pose estimation.
- **Retro-reflective markers** reflect light back toward the light source and are easy to see with infrared cameras.
- **Natural features** avoid instrumenting the environment but require robust image processing and target identification.

## 8. Sensor Fusion

![[pictures/virtualaugmentedreality/05/Lecture05_Pg041_Sensor_Fusion.png]]

<p class="image-caption">Sensor fusion combines multiple sensors, such as cameras, inertial sensors, GPS, magnetometers, and wireless signals.</p>

Fusion types from the lecture:

| Fusion Type   | Meaning                                                                         | Example Idea                                              |
| :------------ | :------------------------------------------------------------------------------ | :-------------------------------------------------------- |
| Complementary | Sensors measure different degrees of freedom or compensate different weaknesses | Combine fast inertial data with visual correction.        |
| Competitive   | Sensors measure the same degree of freedom redundantly                          | Use a worse sensor only when a better one is unavailable. |
| Statistical   | Measurements are combined into an estimate of true system state                 | Improve quality by modeling uncertainty.                  |
| Cooperative   | One sensor helps another obtain a measurement                                   | Assisted GPS combines cell tower and GPS information.     |

The central reason for fusion is that tracking must be fast, stable, and accurate at the same time, while individual sensors usually satisfy only part of that requirement.

### Applied Exam Focus

- **Terminology**: registration, calibration, and tracking are distinct.
- **Pose**: full pose is 6DOF: three translation and three rotation dimensions.
- **Architecture**: outside-in vs. inside-out is about where the sensors are.
- **Quality**: accuracy, precision, jitter, drift, latency, and update rate describe different failures.
- **Technology**: know mechanical, electromagnetic, ultrasonic, GPS, wireless, magnetometer, gyroscope, accelerometer, odometer, optical, marker, and natural-feature tracking at a high level.
- **Fusion**: explain complementary, competitive, statistical, and cooperative sensor fusion.

## Self-Check

1. Why does AR require registration in addition to ordinary tracking?

> [!success]- Answer
> Tracking produces a pose: where the device is, in some sensor coordinate frame. AR adds the requirement that virtual content stays geometrically aligned with the real world, which means the tracked pose has to be translated into the world frame and the virtual scene rendered from it. Without that registration step, augmentations drift or jitter relative to the physical scene, breaking Azuma's "registered in 3D" criterion.

2. What is the difference between accuracy and precision?

> [!success]- Answer
> Accuracy is how close measurements are to the true value (bias). Precision is how close repeated measurements are to each other (spread). A sensor can be precise but biased (tight cluster, wrong place), or accurate on average but jittery, or both. The two failure modes are independent and have to be evaluated separately.

3. Why can a high-update-rate sensor still be bad for VR?

> [!success]- Answer
> Update rate is only one quality axis. A fast sensor can still have high latency (the samples are stale), low accuracy (the values are wrong), or high jitter (the values flicker). VR comfort depends on the whole chain: late samples cause swimming, biased samples cause registration drift, and jittery samples cause visible shake even at high frame rates.

4. How do outside-in and inside-out tracking differ?

> [!success]- Answer
> Outside-in places stationary sensors in the environment that observe markers or features on the mobile device. Inside-out puts the sensors on the mobile device itself, observing the static environment. Outside-in tends to give higher precision in a fixed instrumented volume; inside-out is portable and scales to larger areas but has to do scene understanding on the device.

5. Why are natural features attractive but difficult for tracking?

> [!success]- Answer
> Natural features avoid the visual clutter and setup of fiducial markers, so the environment does not have to be instrumented. The difficulty is that ordinary scenes contain many ambiguous, repetitive, or low-texture regions. The system must detect salient points, describe them well enough to recognize across viewpoints, and verify geometric consistency, all in real time. Markers sidestep all of that by being designed for easy detection.

6. How do registration, calibration, and tracking differ?

> [!success]- Answer
> Tracking is the real-time measurement of pose as the user or object moves. Calibration is the offline (or occasional) adjustment of sensor and display parameters so measurements are correct. Registration is the goal: aligning virtual content with the real or virtual world so it appears in the right place. Tracking feeds registration, and calibration keeps the numbers that registration depends on accurate; mixing them up is a common exam error.

7. Name the four sensor-fusion types and give the idea behind each.

> [!success]- Answer
> Complementary fusion combines sensors that measure different degrees of freedom or cover each other's weaknesses (fast inertial data corrected by slower vision). Competitive fusion uses sensors that measure the same quantity redundantly, falling back to a worse sensor when a better one is unavailable. Statistical fusion combines measurements into a single state estimate by modelling uncertainty (Kalman-style). Cooperative fusion has one sensor help another obtain a measurement, as in assisted GPS using cell-tower information. Fusion exists because no single sensor is simultaneously fast, accurate, and robust.

---

[[/notes/lectures/virtualaugmentedreality/04_VR-AR_Interaction|Previous: (y-04) Interaction]] | [[/notes/lectures/virtualaugmentedreality/index|(y) Back to VR/AR Index]] | [[/notes/lectures/virtualaugmentedreality/06_VR-AR_CompVision|Next: (y-06) Computer Vision for AR]]
