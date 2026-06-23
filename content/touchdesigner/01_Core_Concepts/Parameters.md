---
title: "Parameters"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-02-06
---

Every operator has a set of **parameters** that control what it does. They live in the **Parameter Dialog**, a floating panel you toggle with the `p` key. Parameters can be numbers, toggles, menus, strings, paths, pulses, even Python objects.

## Opening and Navigating the Dialog

| Action                               | How                                             |
| ------------------------------------ | ----------------------------------------------- |
| Toggle parameter dialog              | Press `p` while hovering a Network Editor pane  |
| Open as floating window              | RMB on the operator → Parameters...             |
| Switch parameter pages               | Click the page tabs along the top of the dialog |
| Open right-click menu on a parameter | RMB the parameter row                           |

The dialog always shows one operator at a time. Selecting a different node updates it live.

## The Four Parameter Modes

This is the most important concept on this page. Every parameter sits in one of four modes, indicated by a colored mode button on the left of the parameter row. **All four mode values persist simultaneously**, so you can flip between modes without losing data.

| Mode           | Color  | What it does                                                            |
| -------------- | ------ | ----------------------------------------------------------------------- |
| **Constant**   | Grey   | A literal value you type in. The default.                               |
| **Expression** | Blue   | A Python expression evaluated each cook. Example: `absTime.frame * 0.5` |
| **Export**     | Green  | A CHOP channel or DAT cell pushed into the parameter, overriding it     |
| **Bind**       | Purple | A bi-directional link to another parameter, table cell, or Bind CHOP    |

Click the colored button to switch modes. Right-click it to access mode-specific options (set expression, remove export, reset, etc.).

> [!tip] **Constant for setup, Export for performance, Bind for UI.** If you have many channels driving many parameters, Export is faster than Expression because it skips per-cook Python eval.

## Parameter Types

| Type          | Example use                 | Notes                                 |
| ------------- | --------------------------- | ------------------------------------- |
| Float         | `Translate X`               | Single floating-point value           |
| Int           | `Resolution Width`          | Integer                               |
| Toggle        | `Active`, `Cooking`         | On/off                                |
| Menu          | `Operator Type`, `Filter`   | Dropdown of named options             |
| Pulse         | `Reset`, `Reload`           | A button that fires once when clicked |
| String        | `File Path`, `Label`        | Text                                  |
| OP path       | `Camera`, `Render Geometry` | Path to another operator              |
| RGB / RGBA    | Material color              | 3- or 4-component color               |
| XYZ / XY / UV | Translate, Tile             | Multi-value (size up to 4)            |
| Python        | Custom data slot            | Holds a Python object                 |

Multi-value parameters (RGB, XYZ, etc.) sit on a single row but expose each component for individual mode selection. You can have R as a Constant, G as an Expression, and B as an Export, all at once.

## Reading and Writing from Python

```python
n = op('transform1')

# Read the current evaluated value
n.par.tx.eval()         # 0.5
n.par.tx                # the Par object itself

# Write a constant value
n.par.tx = 1.0

# Set an expression (auto-switches to Expression mode)
n.par.ty.expr = 'absTime.frame * 0.1'

# Inspect the current mode
n.par.tx.mode           # ParMode.CONSTANT, .EXPRESSION, .EXPORT, or .BIND

# Pulse a Pulse parameter from script
n.par.Reset.pulse()
```

## Right-Click Options Worth Knowing

RMB any parameter row to get common operations: reset to default, copy/paste value, switch mode, edit expression in a larger window, find what's exporting/binding to it.

## What's Next

- [[touchdesigner/01_Core_Concepts/Expressions and Parameters|Expressions and Parameters]]: deep dive on the expression language
- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]: how to add your own parameters to a COMP

---

> [!tip]- 📚 Learning Path · Stage 1 - Foundations · step 5 of 44
> [[touchdesigner/01_Core_Concepts/Connecting Nodes|(y-) ← Prev: Connecting Nodes]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/01_Core_Concepts/Expressions and Parameters|(y-) Next: Expressions and Parameters →]]

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
