---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
date: 2026-02-11
---

# Constant CHOP

The **Constant CHOP** is the simplest CHOP — it outputs one or more channels with fixed, user-defined values that do not change over time. Think of it as a named variable or knob.

## Key Parameters

| Parameter          | Description                                   |
| ------------------ | --------------------------------------------- |
| **Name 0, 1, 2…**  | Channel names (e.g. `r`, `g`, `b` or `speed`) |
| **Value 0, 1, 2…** | The fixed numeric value for each channel      |

Click the **`+`** button to add more name/value pairs.

## Why Use It?

The Constant CHOP transforms a raw number into a **named, wireable channel**. This lets you:

- Feed a value into a **Math CHOP** pipeline without hardcoding it in expressions.
- Create a **single source of truth** — one Constant that multiple nodes reference, so you only need to update one place.
- Use it as a **manual override** by putting it in a `Switch CHOP`.

## Common Usage Patterns

### Global speed control

```
Constant CHOP  →  chan: "speed", value: 1.0
  → [referenced by op('speed')['speed'] in multiple LFO/Noise CHOPs]
```

Change `speed` in one place, affect the whole network.

### Colour constant

```
Constant CHOP
  chan0: "r" = 0.2
  chan1: "g" = 0.8
  chan2: "b" = 0.5
  → Math CHOP → [drive RGB parameters of a Light or Material]
```

### Combining with a null

A common pattern is:

```
Constant CHOP → Null CHOP (named e.g. CTRL_Speed)
```

The Null acts as a clean output point and makes references more stable if you swap out the Constant for an LFO or UI slider later.

## Practical Example: Swappable Signal Source

Place a Constant and an LFO side-by-side, feed both into a **Switch CHOP**, and control which one is active with a parameter. This gives you a manual/auto toggle.

## Differences from Just Typing a Number

|                            | Typed in parameter  | Constant CHOP        |
| -------------------------- | ------------------- | -------------------- |
| Can drive multiple targets | ✗ (must copy value) | ✓ (one wire to many) |
| Can be automated later     | Requires rewrite    | Just swap in an LFO  |

---

| Visible in network | ✗ | ✓ |
| Named | ✗ | ✓ |

## Common Gotchas

- The Constant CHOP's value is **not** keyframeable by default — if you want animation, switch to an **Animation CHOP** or an **LFO CHOP**.
- When you export a Constant channel to a parameter, changing the parameter directly will stop working (the export overrides it).

## Related Nodes

- [[LFO CHOP]] — time-varying signal
- [[Noise - CHOP and TOP|(y-) Noise CHOP]] — random/organic signal
- [[Math CHOP]] — combine and remap constant values

---

[[LFO CHOP|(y-) Next Page: LFO CHOP]]

---
[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
