---
tags:
  - touchdesigner
  - td/architecture
  - optimization
---
# Performance Monitoring

Maintaining a solid frame rate (typically 60fps) is essential for smooth interactives in TouchDesigner.

## The Performance Monitor
You can open this via the **Dialogs > Performance Monitor** menu. It breaks down the millisecond cost of rendering every single frame.

- It lists out each node that cooked in that frame and how long it took.
- This is your primary diagnostic tool when framerate drops inexplicably.

## Middle Mouse Button (MMB) Info
- Middle-clicking any node gives you information about its cook times. Look for nodes that take an unusually long time to evaluate, like heavy TOP operations or complex SOP manipulations. 

## The Probe
- `Probe` is an extremely useful external tool (built as a `.tox` by Derivative) designed to visually track CPU and GPU usage per node. 
- You can find it in your **Palette** panel under *Tools*, allowing you to observe performance live in the network editor.
---
[[04_Scripting_and_Architecture/index|Back to Scripting and Architecture]] | [[touchdesigner/index|Back to Main Page]]
