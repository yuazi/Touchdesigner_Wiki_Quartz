---
tags:
  - touchdesigner
  - td/operators
  - comp
  - operators
date: 2026-02-11
---

# COMP - Components

COMPs are structural nodes. They can contain other networks or provide specialized functionality.

## 3D Components

- **Geometry:** Holds SOPs and MATs for rendering.
- **Camera:** Defines the viewpoint for a Render TOP.
- **Light:** Illuminates your 3D scene.

## Panel Components (UI)

- **Container:** A layout box for building custom user interfaces.
- **Button:** A clickable UI element.
- **Slider:** A draggable UI element.

## Utility

- **Base:** A simple container to keep your network organized (Folders).

## Custom Parameters

One of the most powerful features of COMPs (especially Base COMPs) is the ability to create Custom Parameters.

- Right-click a COMP and select "Customize Component...".
- You can add sliders, toggles, and string inputs to the _outside_ of the node.
- This allows you to build reusable "modules". You interact with the custom sliders on the outside, and Python/CHOP references drive the complex logic hidden on the inside.

## How to Use Components

To use Components effectively in your network:

1. **Adding a COMP:** Double-click on the network pane to open the OP Create Dialog, hit the 'TAB' key, and select the COMP family (gray color).
2. **Encapsulation:** Use a Base COMP or Container COMP to group multiple nodes. Simply select the nodes you want to group, right-click, and choose "Collapse Selected". This moves them inside a new Base COMP, keeping your main network clean.
3. **Navigating In/Out:** You can enter a COMP by scrolling into it with your mouse wheel or pressing `i` while selected. To exit, zoom out or press `u`.
4. **Connecting:** COMPs typically connect to other COMPs (like wire connections between Geometry COMPs and a Render COMP). They have special inputs/outputs depending on their type, and can pass internal data outside using In/Out components inside them.
5. **Custom Parameters Interface:** Right-click the COMP and select "Customize Component" to add your own parameters, creating a clean modular interface for complex internal mechanics.

[[touchdesigner/02_The_Operators/COMPs/index|↑ Back to COMPs]] | [[touchdesigner/02_The_Operators/index|↑ Back to The Operators]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
