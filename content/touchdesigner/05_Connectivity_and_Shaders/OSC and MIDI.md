---
tags:
  - touchdesigner
  - td/connectivity
  - io
  - midi
  - osc
date: 2026-02-26
---
# OSC and MIDI (Input/Output)

How to communicate with other software and controllers.

## OSC (Open Sound Control)
OSC is a network protocol for sending high-speed, low-latency data between applications.

- **OSC In CHOP:** Receive OSC messages.
- **OSC Out CHOP:** Send OSC messages.
- **Port Matching:** Ensure both sender and receiver use the same port (default is often 7000-8000).

## MIDI
Standard protocol for music hardware and software controllers.

- **MIDI In CHOP:** Receive notes and CC data.
- **MIDI Mapper:** Use the Dialogs > MIDI Device Mapper to connect your hardware.
---
[[touchdesigner/05_Connectivity_and_Shaders/index|Back to Connectivity and Shaders]] | [[touchdesigner/index|Back to Main Page]]
