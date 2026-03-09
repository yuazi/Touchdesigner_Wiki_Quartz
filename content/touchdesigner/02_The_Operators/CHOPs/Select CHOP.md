---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
  - select
date: 2026-02-11
---

# Select CHOP

The **Select CHOP** is your primary tool for routing and filtering data channels. It extracts specific channels from any other CHOP in your project, even if that CHOP is inside a different component.

## Why Use It?

Instead of routing long, messy wires across your network (or between different COMPs), you use a Select CHOP to grab the data you need exactly where you need it. This keeps your networks clean and modular.

## Core Parameters

1. **CHOP:** The path to the source CHOP you want to pull data from.
   - Example: `../math1` or `/project1/audio_analysis/out1`
   - _Tip:_ You can drag and drop a source CHOP directly onto the Select CHOP to automatically fill this parameter.
2. **Channel Names:** The specific channel(s) you want to extract.
   - You can type channel names directly (e.g., `tx ty tz`).
   - You can use wildcards (e.g., `*` to select all, `chan[1-3]` to select 1, 2, and 3).
   - _Tip:_ Use the dropdown arrow next to the parameter to see a list of available channels from the source CHOP.
3. **Rename From / Rename To:** A powerful way to instantly rename channels as you select them.
   - Example: Rename `chan1` to `speed`.
   - Wildcards work here too: Rename `*` to `mouse_*` adds a prefix to all incoming channels.

## The Select TOP

There is an equivalent **Select TOP** that works exactly the same way, but for grabbing 2D image data/textures from another part of your network without drawing long wires.

[[touchdesigner/02_The_Operators/CHOPs/index|↑ Back to CHOPs]] | [[touchdesigner/02_The_Operators/index|↑ Back to The Operators]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
