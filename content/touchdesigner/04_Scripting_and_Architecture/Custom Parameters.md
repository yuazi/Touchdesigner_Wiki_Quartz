---
title: "Custom Parameters"
tags:
  - touchdesigner
  - td/architecture
  - scripting
date: 2026-02-21
---

Custom parameters let you expose a clean control surface on a COMP. Instead of digging into a nested network to tweak a noise frequency or a blur radius, you wrap the network in a Base COMP and expose just the settings that matter as new parameters on the wrapper. This is how every reusable module in TouchDesigner is built.

## Why

- A clean "Master Control" surface for a project, with no internal noise.
- Reusable modules: drop the COMP into another project and the same controls come along.
- A natural binding target for UI sliders, OSC, MIDI, or external automation.
- A versionable interface: the inner network can change without breaking callers.

## Creating via the Component Editor

The simplest path:

1. RMB the COMP → **Customize Component...** to open the Component Editor Dialog.
2. Name a page (e.g. `Settings`) and click **Add Page**.
3. Type a parameter label, pick the style (Float, Int, Toggle, Menu, RGB, ...), set the size (1-4), click **Add Par**.

> [!note] **Naming rule:** the label gets converted to a valid parameter name automatically: first letter capitalized, no spaces or special characters. So a label `Speed factor` becomes the parameter `Speedfactor` accessed as `op.par.Speedfactor`.

In the dialog you can also drag to reorder, drag between pages, double-click to rename, and `x` to delete. RMB or `Ctrl+C` / `Ctrl+V` copies parameters between components.

## Parameter Types

Every type listed under [[touchdesigner/01_Core_Concepts/Parameters|Parameters]] is creatable. The most common:

| Type                         | Method                       | Notes                                  |
| ---------------------------- | ---------------------------- | -------------------------------------- |
| Float                        | `appendFloat`                | `size=1..4` for multi-value            |
| Int                          | `appendInt`                  | `size=1..4`                            |
| Toggle                       | `appendToggle`               | On/off                                 |
| Menu                         | `appendMenu`                 | Fixed menu options                     |
| Str Menu                     | `appendStrMenu`              | Dynamic menu populated from a callback |
| Pulse                        | `appendPulse`                | Button, fires once                     |
| Momentary                    | `appendMomentary`            | True while held, False on release      |
| String                       | `appendStr`                  | Text                                   |
| File / Folder                | `appendFile`, `appendFolder` | File/dir picker                        |
| RGB / RGBA                   | `appendRGB`, `appendRGBA`    | Color (size 3 / 4)                     |
| XYZ / XY / WH / UV           | `appendXYZ`, etc.            | Named multi-value with preset sizing   |
| OP / TOP / CHOP / SOP / COMP | `appendOP`, `appendTOP`, ... | Path picker constrained to a family    |

## Creating in Python

Sometimes you want to script parameter creation (templating, generating from a config, etc.).

```python
comp = op('myEffect')
page = comp.appendCustomPage('Settings')
page.appendFloat('Speed', size=1)
page.appendInt('Iterations', size=1)
page.appendToggle('Active')
page.appendRGB('Tint')                  # auto sizes to 3
page.appendPulse('Reset')
page.appendStrMenu('Mode')              # populate menuNames/menuLabels separately
```

All `append*` methods return a `ParGroup` (the row of related parameters, e.g. R/G/B for an RGB).

## Modifying Parameters

Once a parameter exists, every attribute of it is editable from script:

```python
p = op('myEffect').par.Speed
p.label = 'Speed (Hz)'
p.default = 1.0
p.normMin = 0.0
p.normMax = 5.0          # slider range
p.clampMin = True
p.enable = False         # grey out
p.expr = 'absTime.frame * 0.01'
p.mode = ParMode.EXPRESSION
```

Delete with `p.destroy()`. Wipe everything with `comp.destroyCustomPars()`.

## Pulse Parameters and Callbacks

Pulse parameters do nothing on their own. Wire them to a `Parameter Execute DAT`:

```python
# Parameter Execute DAT, watching myEffect.par.Reset
def onPulse(par):
    op('feedback1').par.reset.pulse()
    return
```

This is the standard pattern for a "Reset" or "Reload" button on a COMP.

## Internal Wiring: Bind vs Expression

Two common ways to make an internal node respond to a custom param:

**Bind (preferred for one-to-one):** click the internal parameter's mode button to purple, set the bound parameter to `parent.MyEffect.par.Speed`. The internal value tracks the wrapper's value bidirectionally.

**Expression:** click the mode to blue, type `parent.MyEffect.par.Speed * 2`. Read-only but lets you transform the value.

Inside the COMP, the shorthand is even cleaner: if you set the COMP's Parent Shortcut to `Effect`, all internal expressions can use `parent.Effect.par.Speed` regardless of how the COMP gets nested later. See [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]] for parent shortcuts.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|Modular Design and Toxes]]: packaging a custom-param-rich COMP for reuse
- [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|Container and Widgets]]: building a UI on top of your custom params

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
