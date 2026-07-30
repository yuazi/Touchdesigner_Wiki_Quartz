---
title: Select CHOP
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
  - select
date: 2026-02-11
---

The **Select CHOP** picks (and optionally renames) channels from a remote CHOP without drawing a wire. It's the canonical way to keep networks clean: instead of running a long wire across a project to grab one channel, drop a Select CHOP next to where you need the value and point it at the source.

The same pattern exists for the other families: Select TOP, Select SOP, Select DAT.

## Key Parameters

| Parameter            | Description                                                                                              |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| **CHOP**             | "The source(s) of the channels. (Assuming the CHOP is not directly connected)."                          |
| **Channel Names**    | "The names of the channels to keep. Name patterns may be used. Ex: `chan[1-5] *x /project1/geo1:t[xyz]`" |
| **Rename from**      | "The channel pattern to rename. See Pattern Matching."                                                   |
| **Rename to**        | "The replacement pattern for the names."                                                                 |
| **Filter by Digits** | Restrict selection to channels ending in specific digits                                                 |
| **Digits**           | Which digit suffixes count when Filter by Digits is on                                                   |
| **Strip Digits**     | "When On, the selected channel names are output without the digits."                                     |
| **Align**            | How to handle inputs with differing start/end times                                                      |
| **Automatic Prefix** | When two channels have the same name, prefix with the source op's name                                   |

## Pattern Syntax

The Channel Names field accepts TouchDesigner's standard pattern matching:

| Pattern          | Matches                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `*`              | Any sequence of characters                                          |
| `?`              | Any single character                                                |
| `[abc]`          | Any one character from the set                                      |
| `^pattern`       | Negation: anything NOT matching                                     |
| `chan[1-5]`      | Numeric range: `chan1`, `chan2`, ..., `chan5`                       |
| `chan[1-7:2]`    | Range with step: `chan1`, `chan3`, `chan5`, `chan7`                 |
| `chan[2-3,5,13]` | Specific integers                                                   |
| `tx ty tz`       | Space-separated list (legacy; new patterns prefer the set operator) |

> [!note] Per the wiki: "No spaces should appear within ranges" - use `[1,3,0-10:2]` not `[1, 3, 0-10:2]`.

## Why Select Instead of a Wire

- **Cross-COMP references stay clean.** A Select CHOP next to where you need the data, pointed at `/project1/audio_analysis/out1`, is more readable than a wire that crosses two layers.
- **Modules read state from a stable name.** A reusable `.tox` can `Select` from a fixed path inside its parent, regardless of how deeply it's nested when dropped in.
- **Renaming is built in.** Rename From/To lets you re-tag channels at the read site (e.g. project's `volume` becomes `gain` for this module's expectations).

## Practical Example: Grab Position from a 12-Channel Transform CHOP

```
/project1/transform_out (12 channels: tx ty tz rx ry rz sx sy sz px py pz)
   ↓ (no wire)
select1
   CHOP:           /project1/transform_out
   Channel Names:  t[xyz]
   Rename from:    t*
   Rename to:      pos*
   ↓
math1 → ...
```

Result: a CHOP with 3 channels named `posx`, `posy`, `posz`.

## Common Gotchas

- **Pattern matches on channel name, not order.** `tx ty tz` selects whatever is named `tx`, `ty`, `tz`, regardless of where they sit in the input. If you need positional pickup, that's not what Select does; use Reorder.
- **Rename runs after selection.** You select with the original names, then rename. So `Channel Names: pos*` looking for already-renamed names would miss them.
- **Missing source = empty CHOP, not error.** A typo in the CHOP path silently returns an empty CHOP. Watch the middle-mouse popup or the channel count in the corner if data unexpectedly vanishes.
- **Multiple sources need Align.** If you point at multiple CHOPs in the CHOP parameter and they have different sample ranges, the Align parameter decides how they merge. Default Automatic usually works, but check if you see clipped output.

## Related Nodes

- [[Math CHOP]]: combine and remap selected channels
- [[touchdesigner/01_Core_Concepts/Connecting Nodes|Connecting Nodes]]: when to use Select vs an actual wire
- [[touchdesigner/04_Scripting_and_Architecture/Modular Design and Toxes|Modular Design and Toxes]]: Select is the canonical cross-module read pattern

---

[[Timer CHOP|(y-) Next Page: Timer CHOP]]

---

[[touchdesigner/02_The_Operators/CHOPs/index|(y) Return to CHOPs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
