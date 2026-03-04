---
tags:
  - touchdesigner
  - td/operators
  - chop
  - operators
date: 2026-02-11
---
# CHOP - Channel Operators (Data)

CHOPs are used for control signals, audio, and numeric data.

## Key CHOPs
- **Constant:** Create numeric values.
- **LFO:** Generate oscillating signals (Sine, Square, etc.).
- **Math:** Scale, offset, or combine signals.
- **Analyze:** Find the average, peak, or sum of a channel.
- **Select:** Isolate specific channels from another CHOP.
- **Trail:** View the history of a signal over time.

## Data Structure
CHOPs contain **Channels** (names like `chan1` or `tx`) and **Samples** (values changing over time).

## How to Use CHOPs

CHOPs are the nervous system of your TouchDesigner network, moving numbers from one place to another.

1. **Adding a CHOP:** Open the OP Create Dialog (Tab) and select the CHOP family (green color).
2. **Generating Signals:** Create a generator like an `LFO` or `Constant` to produce channels.
3. **Math and Processing:** Use nodes like `Math` to scale/shift ranges (e.g., mapping -1 to 1 from an LFO to 0 to 255 for color), and `Filter` or `Lag` to smooth abrupt changes in data.
4. **Driving Parameters (Exporting vs. Referencing):**
   To use a CHOP changing value to drive a parameter on another node (e.g., rotating a geometry), you have two main methods:
   - **CHOP Reference (Python):** 
     - Make the target node's parameter active. Drag the CHOP channel onto the target parameter and select "CHOP Reference". 
     - This writes a Python expression like `op('math1')['chan1']`. 
     - *Pros:* Extremely flexible. *Cons:* Slightly slower performance.
   - **Exporting (CHOP Export):**
     - Turn on the "Viewer Active" flag on the CHOP (bottom right corner). Click and drag the channel name directly onto the target parameter, and choose "Export CHOP".
     - A green highlight appears on the parameter. 
     - *Pros:* Significantly faster execution because it bypasses the Python interpreter. Preferred for high-frequency or numerous parameter updates.
   - **Binding (Bind CHOP/Python):**
     - Binding creates a two-way connection. If you bind a CHOP channel to a parameter, changing the parameter updates the CHOP, and changing the CHOP updates the parameter.
     - You can bind by dragging a parameter to another parameter and selecting "Bind", or by writing a Python expression starting with `op('someNode').par.someParam.bindMaster`.
     - *Pros:* Essential for building interactive UIs where sliders need to both control logic and reflect external changes.
     - *Cons:* Can sometimes lead to evaluation loops if not careful.
---
[[touchdesigner/02_The_Operators/CHOPs/index|Back to CHOPs]] | [[touchdesigner/02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to TouchDesigner]]

---
[[touchdesigner/02_The_Operators/CHOPs/index|Back to CHOPs]]
