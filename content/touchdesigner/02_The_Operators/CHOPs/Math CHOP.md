---
tags:
  - touchdesigner
  - td/operators
  - chop
  - math
  - operators
---
# Math CHOP

The **Math CHOP** is the workhorse for scaling, converting, and combining numerical data streams.

## Core Functions

The Math CHOP's parameter window is divided into three main operational tabs conceptually:

### 1. OP (Combine CHOPs)
*Combines channels from MULTIPLE connected Input CHOPs.*
- **Add:** Adds the values of `chan1` from Input A and `chan1` from Input B.
- **Multiply:** Multiplies the inputs.

### 2. Combine (Combine Channels)
*Combines multiple channels WITHIN a SINGLE CHOP.*
- Example: You have a CHOP with `chan1`, `chan2`, and `chan3`. Setting this to **Add** will output a single channel containing the sum of all three.
- Useful for checking if *any* condition is met (using Maximum) or if *all* conditions are met (using Minimum) across several boolean channels.

### 3. Range (Scaling Values)
*The most frequently used feature.* Maps the input value range to a new output value range.
- **From Range:** The expected minimum and maximum of the incoming data (e.g., `-1` to `1` from an LFO).
- **To Range:** The desired output range (e.g., `0` to `255` for color, or `0` to `360` for rotation).
- **Limit:** Often used in conjunction with Range. You can clamp the output so it never exceeds the To Range, even if the From Range is exceeded.

## Common Use Case: Normalizing Data
If you receive MIDI velocity data from `0` to `127`, you almost always want to pass it through a Math CHOP to scale it from `0` to `1` so it can cleanly drive transparency or scaling parameters elsewhere.
---
[[02_The_Operators/CHOPs/index|Back to CHOPs]] | [[02_The_Operators/index|Back to The Operators]] | [[touchdesigner/index|Back to Main Page]]
