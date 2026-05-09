---
title: "Connecting Nodes"
tags:
  - touchdesigner
  - td/core
  - workflow
date: 2026-02-06
---

You build networks by drawing **wires** between operators. Wires are the visible side of TouchDesigner's data flow, but the data isn't actually moving along them. The destination node _pulls_ from the source when it needs to cook. The wire just records "here's where to look."

> [!note] Per the Derivative wiki: a wire "doesn't actually pass or copy its data to the destination, it only informs the destination of where to get its data to operate on." See [[touchdesigner/04_Scripting_and_Architecture/Cooking|Cooking]] for why this matters.

## Connector Geometry

Every operator has connectors on its sides:

- **Left side**: inputs (data comes in)
- **Right side**: outputs (data goes out)
- **Bottom**: secondary inputs on a few ops (e.g. mask inputs, reference inputs)

Most ops have one of each. A few (Composite TOP, Switch CHOP, Merge CHOP) accept many inputs and stack them.

## Drawing and Removing Wires

| Action                | How                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Create a wire         | Click an output connector, move to a target connector, click again, or click-and-drag in one motion |
| Delete a wire         | Right-click the wire, choose Disconnect                                                             |
| Toggle wire style     | Press `s` in the Network Editor (splines vs straight lines)                                         |
| Visual cook indicator | Wires animate with dashes while their source is cooking                                             |

## The Family-Matching Rule

Wires only connect ops of the same family: TOP→TOP, CHOP→CHOP, SOP→SOP, DAT→DAT. To bridge families you use a dedicated converter op:

| From → To  | Use                                             |
| ---------- | ----------------------------------------------- |
| CHOP → DAT | `CHOP to DAT`                                   |
| DAT → CHOP | `DAT to CHOP`                                   |
| TOP → CHOP | `TOP to CHOP`                                   |
| CHOP → TOP | `CHOP to TOP`                                   |
| SOP → CHOP | `SOP to CHOP`                                   |
| CHOP → SOP | `CHOP to SOP`                                   |
| TOP → SOP  | `Trace SOP`, or sample texture in vertex shader |

So a typical cross-family pipeline (audio levels driving geometry) looks like `Audio File In CHOP → Analyze CHOP → CHOP to SOP → Geo COMP`.

## Multi-Input Operators

Some ops accept a variable number of inputs and stack them in order. **Order matters.**

- **Composite TOP**: layers in connection order (input 1 is the bottom layer)
- **Switch CHOP / Switch TOP**: picks one input by index parameter
- **Merge CHOP**: concatenates channels in connection order
- **Math CHOP**: combines all inputs by the configured operation

## Exposing I/O at the COMP Boundary

To turn a Base/Container COMP into a reusable module with its own inputs and outputs, drop **In** and **Out** ops _inside_ it:

```
project1/
  myEffect/         ← Base COMP
    in1   (In TOP)  ← becomes left connector on myEffect
    blur1 (Blur TOP)
    out1  (Out TOP) ← becomes right connector on myEffect
```

After this, `myEffect` shows up in the parent network with one TOP input and one TOP output, just like a built-in operator. Same pattern works with In/Out CHOP, In/Out SOP, In/Out DAT.

## Wiring Diagram Example

```
movie1 ──┐
         ├─→ composite1 ──→ blur1 ──→ out1
noise1 ──┘                    ↑
                            level1 (mask input via bottom connector)
```

## Walking Wires from Python

The OP class exposes connectivity as plain lists:

```python
n = op('blur1')
print(len(n.inputs))         # number of wired-in inputs
print(n.inputs[0].name)      # the upstream op
print(n.outputs[0].name)     # the first downstream op
n.inputConnectors            # all input connectors (wired or not)
n.outputConnectors           # all output connectors
```

`.inputs` / `.outputs` return only the _connected_ upstream/downstream operators. `.inputConnectors` / `.outputConnectors` return every connector slot, wired or not. Useful when iterating to find an empty input.

---

[[touchdesigner/01_Core_Concepts/index|(y) Return to Core Concepts]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
