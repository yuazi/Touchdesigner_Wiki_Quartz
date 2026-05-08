---
title: "05_VR-AR — Tracking in VR/AR"
tags:
  - vrar
  - tracking
  - sensors
  - theory
date: 2026-05-12
---
[[/notes/virtualaugmentedreality/04_VR-AR_Interaction|Back: (y-04) Interaction]] | [[/notes/virtualaugmentedreality/index|VR/AR Index]]

## 1. The Trinity of Alignment
![](pictures/virtualaugmentedreality/05/Lecture05_Pg004_1_The_Trinity_Of_Alignment.png)


- **Registration**: The mathematical alignment of virtual objects with the real world (or the user's view).
- **Calibration**: An offline process to adjust sensors (e.g., measuring the distance between eyes or camera offsets).
- **Tracking**: The dynamic, real-time sensing of the user's pose (position and orientation) in 3D space.

---

## 2. Tracking Fundamentals

### Degrees of Freedom (DOF)
![](pictures/virtualaugmentedreality/05/Lecture05_Pg010_Degrees_Of_Freedom_Dof.png)

- **3DOF**: Orientation only (Roll, Pitch, Yaw). Used in early VR (Google Cardboard).
- **6DOF**: Orientation + Position (X, Y, Z). Essential for "true" VR/AR where you can walk around objects.

### Frames of Reference
![](pictures/virtualaugmentedreality/05/Lecture05_Pg006_Frames_Of_Reference.png)

- **World-stabilized**: Virtual objects stay locked to a physical location (e.g., a virtual TV on a real wall).
- **Body-stabilized**: Objects move with the user (e.g., a "tool-belt" or HUD).
- **Screen-stabilized**: Objects are locked to the display (e.g., low-battery warning).

### Outside-In vs. Inside-Out
![](pictures/virtualaugmentedreality/05/Lecture05_Pg013_Outside_In_Vs_Inside_Out.png)

- **Outside-In**: Sensors are stationary in the room (e.g., Valve Index Lighthouses, Oculus Rift CV1 cameras). 
    - *Pros*: Very accurate. 
    - *Cons*: "Occlusion" (blocking the line of sight) and limited "tracking volume."
- **Inside-Out**: Sensors are on the HMD looking out (e.g., Quest 3, HoloLens).
    - *Pros*: Unlimited space (SLAM), easy setup. 
    - *Cons*: Computationally expensive.

---

## 3. Sensor Types & Technologies

### A. Mechanical
- Physical linkage (like an arm). Very fast and precise but restricts movement.

### B. Electromagnetic
- A base station generates a magnetic field. Sensors measure the field's strength/angle.
- *Problem*: Metal objects in the room can distort the field.

### C. Inertial (IMU)
- **Gyroscopes**: Measure angular velocity (3DOF orientation).
- **Accelerometers**: Measure linear acceleration (positional change).
- **Magnetometers**: Electronic compass.
- *Problem*: **Drift**. Errors accumulate over time, causing the world to "slide" away.

### D. Optical Tracking (The King of Modern VR)
- **Markers (Fiducials)**: Using unique patterns (QR codes, retro-reflective balls) that are easy for cameras to see.
- **Natural Features**: Tracking the environment itself (corners of a table, texture of a rug) using **Computer Vision**.
- **Active Illumination**: Using Infrared (IR) LEDs and filters so the camera only sees the "glow" of the markers.

---

## 4. Sensor Fusion
![](pictures/virtualaugmentedreality/05/Lecture05_Pg043_4_Sensor_Fusion.png)

Combining data from multiple sensors to overcome individual weaknesses.
- **Complementary**: Combining different types (e.g., IMU for fast motion + Camera for slow, accurate drift correction).
- **Statistical (Kalman Filters)**: Using math to predict the next state and correcting it with new measurements.
- **Cooperative**: One sensor helps another (e.g., Assisted GPS).

---

## 5. Measurement Errors
![](pictures/virtualaugmentedreality/05/Lecture05_Pg015_5_Measurement_Errors.png)

- **Accuracy**: How close the measurement is to the "ground truth."
- **Precision (Jitter)**: How stable the measurement is when the object is still.
- **Latency**: The time between moving and the computer knowing you moved. (VR goal: < 15ms).

---

## 6. Self-Assessment Quiz

**Q1: What is the difference between 3DOF and 6DOF?**
> *Answer: 3DOF only tracks which way you are looking (rotation). 6DOF tracks rotation AND where you are in space (translation), allowing you to duck, lean, and walk.*

**Q2: Why is "Drift" a problem for IMU sensors?**
> *Answer: Because IMUs measure change (acceleration/velocity) rather than absolute position. You must "integrate" these values to find position, and small errors in the sensor add up every millisecond, leading to large offsets over time.*

**Q3: Define SLAM in the context of Inside-Out tracking.**
> *Answer: **Simultaneous Localization and Mapping**. The device builds a map of the room while simultaneously figuring out where it is within that map.*

**Q4: Which is better for large-scale outdoor AR: GPS or Marker-based tracking?**
> *Answer: GPS is better for coarse localization (finding the right street), but marker-based (or natural feature tracking) is needed for precise "registration" of virtual objects on a specific wall or table.*

---
[[/notes/virtualaugmentedreality/index|(y) Back to VR/AR Index]]
