---
title: "Container and Widgets (Building Interfaces)"
tags:
  - touchdesigner
  - td/architecture
  - ui
  - widgets
date: 2026-02-21
---

When you build a control panel in TouchDesigner, you're working with **Panel Components**, a sub-family of COMPs designed for interactive 2D UI. The two pieces you'll use most are the **Container COMP** (the layout box) and any number of **Widget COMPs** dropped from the Palette (sliders, buttons, knobs).

## The Panel Components Family

| Panel COMP                     | Role                                                           |
| ------------------------------ | -------------------------------------------------------------- |
| **Container COMP**             | Layout box that holds and arranges other panels                |
| **Widget COMP**                | A Container with extra theming for the official Widget library |
| **Button COMP**                | Toggle, momentary, or radio buttons                            |
| **Slider COMP**                | 1D or 2D sliders, outputs 1 or 2 channels                      |
| **Field COMP** / **Text COMP** | Text entry and text rendering                                  |
| **List COMP**                  | Scrollable list of rows with custom rendering callbacks        |
| **Table COMP**                 | Tabular UI bound to a Table DAT                                |
| **OP Viewer COMP**             | Embeds another op's viewer as a UI element                     |
| **Parameter COMP**             | Auto-generated UI for an op's parameters                       |
| **Select COMP**                | Embeds another panel by reference (mirror it elsewhere)        |

Every Panel COMP renders to its own internal TOP, so you can grab the panel's output (`op('myPanel').panel.value`, or feed the COMP into a TOP chain) and composite it with the rest of your visuals.

## Container COMP: The Layout Box

A Container groups any number of buttons, sliders, fields, containers, and other Panel COMPs. Its parameters fall into a few groups:

| Page         | Key parameters                                                      |
| ------------ | ------------------------------------------------------------------- |
| **Layout**   | `Width`, `Height`, X/Y position, Fixed Aspect                       |
| **Look**     | Background Color (RGBA), Background TOP, Border A/B colors, Opacity |
| **Children** | `Align`, `Spacing`, `Margins`, Justify, Horizontal/Vertical Scroll  |
| **Panel**    | Display flag, Cursor, Drag/Drop, Click-through                      |

The `Align` parameter is the most important one for layout. It controls how children are positioned and (optionally) sized:

| Align                         | What it does                                 |
| ----------------------------- | -------------------------------------------- |
| None                          | Children sit at their absolute X/Y positions |
| Left to Right / Right to Left | Stack horizontally                           |
| Top to Bottom / Bottom to Top | Stack vertically                             |
| Grid Rows / Grid Columns      | Wrap into a grid                             |

Children themselves choose how they fill their slot via Anchors, Fixed, or Fill modes (set on the child's Layout page). Anchors give you responsive resizing as the parent changes size.

## Widget COMP: A Themed Container

A Widget COMP is a Container with extra parameters that hook into the **Widget library**, the curated set of pre-styled UI elements in the Palette under `widgets/`. If you drag a Slider, Button, or Knob in from the Palette, you're getting Widget COMPs with a consistent look.

The Widget library lives in the Palette browser at `widgets/`. Drag-and-drop into a Container, then style via the widget's `Look` and `Color` parameters.

## Building a Small Panel

The shortest path to a working control panel:

1. Create a Container COMP. Set Width=400, Height=300.
2. Set Align to Top to Bottom and add some Spacing.
3. Drop a Slider widget from the Palette inside the Container.
4. Drop a Button widget below it.
5. Toggle the Container's Viewer Flag, then the Viewer Active Flag (`a`), and click around. The slider drags, the button presses.

To wire the slider into a parameter on another op, the cleanest pattern is **binding**:

1. Click the target parameter's mode button to purple (Bind).
2. Set its bound parameter to `op('mySlider').par.Value0`.

The slider now drives the parameter, and dragging the parameter elsewhere drives the slider back.

For something more script-driven, a **Panel CHOP** can sample any panel's state into channels you can use anywhere:

```
panel1 (Panel CHOP, watching mySlider) → math1 → bind target
```

## Custom Params + Panel = Reusable Module

The standard module shape:

1. Wrap your network in a Base/Container COMP.
2. Add Custom Parameters on the wrapper. See [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]].
3. Bind internal nodes to the wrapper's custom parameters.
4. Build a small Panel UI inside the wrapper, with widgets bound to those same custom parameters.

You now have one COMP that exposes both a programmatic interface (custom parameters) and a UI interface (the panel), both pointing at the same underlying state.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]: the parameters your widgets bind to
- [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|Modular Design and Toxes]]: packaging the result as a reusable `.tox`

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
