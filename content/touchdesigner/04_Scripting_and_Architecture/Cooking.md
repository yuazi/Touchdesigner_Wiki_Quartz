---
title: "Cooking in TouchDesigner"
tags:
  - touchdesigner
  - td/architecture
  - optimization
date: 2026-02-21
---

"Cooking" is TouchDesigner's word for _evaluating_ an operator. When a node cooks, it recomputes its output. Understanding when nodes cook (and more importantly, when they don't) is the foundation of every optimization in TouchDesigner.

## The Pull System

The single most common misconception: cooking does **not** start upstream and flow downstream. TouchDesigner is a _pull_ system.

> [!note] From the Derivative wiki: "TouchDesigner is a 'pull system'... a common misconception is that cooking starts upstream and moves downstream. For example if you have Constant CHOP connected to a Math CHOP, most people assume if you change a value in the Constant CHOP then the Math CHOP is forced to cook. This is incorrect."

A node only cooks when something downstream asks for its data. If nothing asks, it sits idle. Change a value in a Constant CHOP whose output is wired to a Math CHOP whose output is wired to nothing visible: zero cooks happen.

## Two Preconditions for a Cook

Both have to be true:

1. **A cook request from downstream.** Some viewer, render pipeline, output op, parameter reference, export, or explicit `op.cook()` call asks for this node's data.
2. **A reason to cook.** Inputs are dirty, a parameter changed, time advanced, or a referenced value moved.

Receive a request but have no reason: you don't cook. Have a reason but receive no request: you don't cook either.

## What Always Cooks

A handful of operators cook every frame regardless, because they have to:

- **Output ops**: Movie File Out TOP, Audio Device Out CHOP, Touch Out, OSC Out
- **External input ops** that monitor an outside source: Render TOP, Touch In CHOP, Pipe In CHOP
- **Time-series CHOPs** in some configurations
- **Active node viewers**: a visible viewer is itself a cook request

These are the nodes most commonly responsible for unintended cook chains. A Render TOP you forgot to disable will keep its entire upstream geo, light, and material chain hot.

## Operator States

| State    | Meaning                                                 |
| -------- | ------------------------------------------------------- |
| Clean    | Already cooked since the last reason; output is current |
| Dirty    | Something changed; needs to recook on next request      |
| Cookable | Has a cook request and a reason; will cook this frame   |

The middle-mouse info popup on a node shows current state and recent cook count.

## The Cooking Flag

Every COMP has a **Cooking Flag**: a flag on the COMP that disables cooking of its entire internal network when off. Wiki: "When activated, it disables the cooking of the component's internal network... none of the nodes will cook when cooking is off, consuming 0 msec time."

Use it for sub-networks that are dormant: settings panels nobody is looking at, an inactive scene, anything you've finished initializing and don't need to update.

> [!warning] When you reload a `.toe` containing a COMP whose Cooking Flag is off, the outputs of internal nodes start empty and undefined until you re-enable cooking. Setting parameters, table values, or rewiring while cooking is off "is generally not recommended" per the wiki.

## Forcing a Cook

| Method                                              | When to use                                   |
| --------------------------------------------------- | --------------------------------------------- |
| `op.cook()`                                         | Cook on demand from script                    |
| `op.cook(force=True)`                               | Cook even if not dirty                        |
| `op.cook(recurse=True)`                             | Cook this op and everything inside (COMPs)    |
| Pulse the `Cook` parameter on Trigger / Pulse CHOPs | Trigger downstream cooks from a network event |
| `me.cook()`                                         | Force-cook from inside a script               |

## Common Cook Mistakes

| Symptom                                                    | Likely cause                                                                                         |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A "disconnected" sub-network is still cooking              | Some op inside has a Viewer Active Flag on, or feeds a Render TOP, or is referenced by an expression |
| Cook time creeps up over a long session                    | Feedback loop accumulating, or storage append in a callback                                          |
| Frame rate drops when you open a UI panel                  | Panel COMP cook + Panel CHOP referencing many ops                                                    |
| A heavy CHOP cooks every frame even though nothing changes | Time-dependent CHOP without Time Slice on                                                            |
| Disabled module still costs time                           | Bypass disables the _op_ but not its viewer; toggle the COMP's Cooking Flag instead                  |

## Optimization Patterns

- **Null OP at chain ends.** Cleanly separates the producer from the consumer; downstream code references the Null instead of the active op, so you can edit upstream without breaking links.
- **Cooking Flag off** on idle COMPs.
- **CHOP/DAT Execute callbacks** for event-driven Python instead of running script every frame from a parameter expression.
- **Cache static values** in storage; recompute only when an input genuinely changes.

The golden rule: **only cook what is necessary, when it is necessary.**

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|Performance Monitoring]]: how to find what's actually cooking
- [[touchdesigner/01_Core_Concepts/Connecting Nodes|Connecting Nodes]]: how the wires you draw control the cook chain

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
