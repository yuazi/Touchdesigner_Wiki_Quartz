---
title: "Viewer Active Mode"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-03-01
---

Every node has a small button in the bottom-right corner (looks like a plus sign or a target). This is the **Viewer Active** button.

## What it does

- **Off:** Clicking on the node allows you to move it around the network.
- **On:** You can interact with the node's visual display directly without leaving the network editor.

## Common Use Cases

1. **3D Navigation:** In a **SOP** or **Geo COMP**, activating the viewer allows you to left-click to rotate, right-click to zoom, and middle-click to pan around the 3D object.
2. **UI Interaction:** In a **Button COMP** or **Slider COMP**, you must activate the viewer to test the UI's functionality.
3. **DAT Editing:** Activating the viewer on a **Text DAT** allows you to type directly into the node (though an external editor is usually preferred).
4. **Channel Inspection:** In a **CHOP**, you can scrub through the time-slice or zoom into specific samples.

## Shortcut

Select a node and press **A** to toggle Viewer Active.

> [!tip] Performance Note
> Having many nodes with Viewer Active enabled can slightly impact your frame rate (FPS) because the GPU has to render the UI for each active node. It's good practice to keep them off when not in use.

---
[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
