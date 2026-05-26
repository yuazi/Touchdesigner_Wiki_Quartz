---
title: "(y-3) Advanced"
tags:
  - touchdesigner
  - td/recipes
date: 2026-03-01
---

Welcome to the **Advanced** module. These recipes involve deep dives into fluid dynamics, motion tracking, and complex math. We focus on high-performance simulations and sophisticated human-computer interaction systems.

---

## Physics & Simulation

- **[[GPU Fluid Simulation|(y-) GPU Fluid Simulation]]**: A complex TOP-based feedback system for smoke and liquid dynamics based on Jos Stam's stable fluids algorithm. Optimized for Apple Silicon.
- **[[Dreamscape Particle Cloud|(y-) Dreamscape Particle Cloud]]**: A stylized, glowing particle cloud that uses recursive feedback and blur chains to create the "bloom" effect characteristic of high-end generative art.
- **[[Vector Field Instancing|(y-) Vector Field Instancing]]**: Learn how to create millions of points following swirling vortex paths driven by an animated 3D vector noise grid on the GPU.
- **[[Reaction-Diffusion|(y-) Reaction-Diffusion (Gray-Scott Model)]]**: Simulate the chemical patterns found on animal skins and seashells entirely in a GLSL feedback loop. Spot, stripe, and worm-hole morphologies emerge from two parameters.

---

## Motion Tracking & Interaction

- **[[Fluid Brush Hand Tracking|(y-) Fluid Brush with Hand Tracking]]**: Your hand becomes a brush painting glowing fluid trails in real time. A MediaPipe wrist position drives a feedback loop combining diffusion, advection, and decay - the interactive wall installation technique.
- **[[Hand Tracking Tutorial|(y-) ★ Complete Hand Tracking Walkthrough]]**: A comprehensive project covering everything from initial setup to building a watercolor brush and a generative architecture scene driven by MediaPipe landmarks.
- **[[MediaPipe Hand Tracking Advanced Techniques|(y-) MediaPipe Hand Tracking Advanced]]**: Learn multi-hand tracking, complex gesture recognition (swipes, rotations, claps), and advanced interaction systems for large-scale installations.
- **[[Real-time Motion History and Optical Flow|(y-) Motion History & Optical Flow]]**: Motion analysis using simple webcams. Learn how to track speed and direction without expensive infrared sensors.
- **[[Hand Tracking|(y-) Hand Tracking Index]]**: The central hub for all MediaPipe resources, including video links and series overview.

---

## Math & Fractals

- **[[Sierpinski Tetrahedron with Hand Tracking|(y-) 3D Sierpinski Tetrahedron]]**: Fractal geometry controlled by hand orientation and pinch-zoom gestures. We use the **Copy SOP** and **GPU Instancing** for recursive complexity.
- **[[Hand-Tracked Chaotic Attractor|(y-) ★ Hand-Tracked Chaotic Attractor]]**: A math-heavy project using **Script CHOPs** to drive a Lorenz attractor system in real time, optimized for high framerates on modern hardware.
- **[[notes/random/neural-style-transfer|(y-) Real-time Neural Style Transfer]]**: A deep-learning recipe using OpenCV and pre-trained ONNX models inside the Script TOP.

---

[[touchdesigner/06_Recipes_and_Projects/index|(y) Return to Recipes & Projects]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
