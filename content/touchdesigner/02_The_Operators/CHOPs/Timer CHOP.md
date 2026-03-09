---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
  - timer
date: 2026-02-11
---

# Timer CHOP

The **Timer CHOP** is the most robust and accurate way to handle triggers, countdowns, and time-based events in TouchDesigner. It is significantly more reliable for complex logic than building your own counters.

## Key Concepts

The Timer CHOP doesn't just "count up." It manages a state machine for a segment of time.

- **Length:** The duration the timer will run.
- **Segments:** You can have the timer run through an array of different times (e.g., a 5-second intro, a 10-second main sequence, a 2-second outro). This is driven by an attached DAT table.
- **Initialize / Start / Initialize Start:**
  - _Initialize:_ Resets the timer to 0 but does not play it.
  - _Start:_ Begins playback.
  - _Initialize Start:_ Does both simultaneously.

## Outputs

The power of the Timer CHOP lies in what it outputs automatically. When you connect it to a Null CHOP, you'll see several channels:

1.  **timer_fraction:** Goes from 0.0 to 1.0 over the length of the timer. This is the most useful channel for driving animations or crossfades.
2.  **timer_seconds:** The actual elapsed time.
3.  **running:** Outputs a 1 when playing, 0 when stopped.
4.  **done:** Fires a 1 exactly when the timer finishes. Perfect for triggering the _next_ event in a sequence.

## The Timer Callback DAT

When you create a Timer CHOP, it usually comes attached to a Text DAT full of Python callbacks (e.g., `onInitialize`, `onStart`, `onDone`).

This is incredibly powerful. You can write Python code that _only executes_ when those specific events happen. For example, triggering a sound effect using `onStart()`, and loading a new level using `onDone()`.

[[touchdesigner/02_The_Operators/CHOPs/index|↑ Back to CHOPs]] | [[touchdesigner/02_The_Operators/index|↑ Back to The Operators]] | [[touchdesigner/index|↑ Back to TouchDesigner]]

---
