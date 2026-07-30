---
title: Audio Reactivity
tags:
  - touchdesigner
  - td/connectivity
  - audio
  - chop
  - advanced
date: 2026-02-26
---

Audio reactivity is the process of extracting data from an audio signal and mapping it to visual parameters.

## Core Audio Nodes

The basic workflow utilizes these CHOPs:

1. **Audio File In CHOP:** Brings an audio file (.mp3, .wav) into the network. Or use an **Audio Device In CHOP** for live microphone/line input.
2. **Audio Analyzer comp (tox):** The easiest way to get bass, mid, and high frequency volumes.
3. **Math CHOP:** Essential for scaling audio data (which is usually between -1 and 1, or 0 and 1) to the desired range for a visual parameter.

## Processing the Signal

Often, raw audio data is too jittery or "spiky" for smooth visuals. You should smooth the data before mapping it:

- **Filter CHOP:** Adds inertia. Useful to round out hard spikes so motion flows rather than snapping.
- **Lag CHOP:** Limits how fast a value can rise or fall. Great for trailing audio envelopes.
- **Envelope CHOP:** Extracts the overall volume curve of a waveform, discarding the microscopic high-frequency oscillation, giving you a clean curve to drive a parameter like scale.

---

> [!tip]- 📚 Learning Path · Stage 7 - Connectivity & Shaders · step 36 of 44
> [[touchdesigner/05_Connectivity_and_Shaders/OSC and MIDI|(y-) ← Prev: OSC and MIDI]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/05_Connectivity_and_Shaders/Introduction to GLSL|(y-) Next: Introduction to GLSL →]]

---

[[touchdesigner/05_Connectivity_and_Shaders/index|(y) Return to Connectivity & Shaders]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
