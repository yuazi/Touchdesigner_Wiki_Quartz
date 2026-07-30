---
title: DAT - Data Operators
tags:
  - touchdesigner
  - td/operators
  - dat
  - operators
date: 2026-02-11
---

DATs ("DATa Operators") hold text. The wiki's definition: "DATs are used to hold text data like strings, scripts, and XML. DATs either contain multiple lines of text as in a script, or a table of rows and columns of cells, each containing one string."

This is the only operator family with two structural shapes: a Text DAT is a single multi-line string; a Table DAT is a 2D grid of strings. Almost every DAT chooses one of these shapes and exposes the same Python access pattern across the family.

## The Two Shapes

| Shape         | What it is                                              | Python access                                        |
| ------------- | ------------------------------------------------------- | ---------------------------------------------------- |
| **Text DAT**  | "free-form, multi-line ASCII text"                      | `op('script1').text` (read), `.text = '...'` (write) |
| **Table DAT** | "rows and columns of cells, each containing one string" | `op('table1')[r,c]`, `op('table1')[2,'select']`      |

Both expose the exact same node interface and connect to the same downstream ops. The shape just changes how you address content.

## Sweet 16 DATs

The wiki lists these as the commonly-used DATs: Text, Table, Merge, Select, Reorder, Insert, Evaluate, Script, CHOP to, CHOP Execute, Panel Execute, DAT Execute, OSC In / UDP In, Web, Render Pick, Multi Touch In.

Practically, group them as:

- **Storage**: Text, Table
- **Table manipulation**: Select, Merge, Reorder, Insert, Sort, Transpose, Evaluate
- **Script holders**: Text DAT (Python module), Script DAT (procedural table builder)
- **Bridges**: CHOP to DAT, DAT to CHOP, Convert
- **Network IO**: Web (HTTP), Web Client, Web Server, OSC In/Out, UDP In/Out, TCP/IP, Serial, MQTT
- **Input devices**: MIDI Event, Multi Touch In, Render Pick, Keyboard In
- **The Execute family**: see below

## The Execute Family

Each Execute DAT auto-creates with a Python skeleton and fires its callbacks at specific times.

| DAT                   | Fires when                                                              |
| --------------------- | ----------------------------------------------------------------------- |
| **Execute DAT**       | Project start, on frame start, on frame end, on play state change       |
| **OP Execute DAT**    | A monitored op is created, deleted, renamed, or has its flags changed   |
| **CHOP Execute DAT**  | A monitored CHOP channel changes value, goes off-to-on, or vice versa   |
| **Parameter Execute** | A monitored parameter is changed, in any of its modes                   |
| **Panel Execute DAT** | A panel state changes (clicked, hovered, dragged, value changed)        |
| **DAT Execute DAT**   | A monitored DAT changes content (table cell edits, text appended, etc.) |

See [[touchdesigner/04_Scripting_and_Architecture/Python in TD|Python in TD]] for the full list of callback method names and signatures.

## Common Patterns

**Config table.** Drop a Table DAT named `config`, fill rows with key/value cells, read it from anywhere:

```python
rate = float(op('config')['rate', 1].val)
mode = op('config')['mode', 1].val
```

The `.val` is needed because cells are strings; cast to int/float when you need a number.

**Script as a Python module.** Any Text DAT containing Python can be imported as a module via the `mod()` global, e.g. `mod('utils').my_helper(arg)`. The first call parses and caches the module; subsequent calls hit the cache. Edit the DAT contents and the cache invalidates, so iteration is fast.

**Reactive callback.** A CHOP Execute DAT pointed at a slider's output channel runs `onValueChange()` only when the channel changes. Cleaner than polling in `onFrameStart`.

```python
# CHOP Execute DAT, monitoring channel "Volume0"
def onValueChange(channel, sampleIndex, val, prev):
    op('mixer').par.Gain = val
```

## Common Gotchas

- **Cells are strings.** A Table DAT cell is always a string until you cast it. `op('config')['rate', 1] + 1` raises a TypeError; `int(op('config')['rate', 1].val) + 1` works.
- **`mod()` caches.** A `mod('utils')` call uses a cached parse. If you're editing the module DAT and the change doesn't take effect, the cache might be stale; restarting the DAT or saving the project re-parses.
- **Web DAT pulse vs Web Client.** Web DAT issues one HTTP request per pulse; Web Client DAT keeps a persistent connection open. Different tools, similar names.
- **`appendRow()` cooks downstream.** Mutating a Table DAT from inside a callback that itself fires from a downstream op can cause re-entrant cooks. Restructure to write outside the cook chain or use `run()` to defer.

## Related Nodes

- [[touchdesigner/04_Scripting_and_Architecture/Python in TD|Python in TD]]: full Python integration reference
- [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]]: scoping rules for the `op()` and `me` globals used in DAT scripts
- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]: Parameter Execute DAT is the Pulse-callback host

---

[[touchdesigner/02_The_Operators/MATs/index|(y-) Next Chapter: MATs]]

---

> [!tip]- 📚 Learning Path · Stage 3 - The Operator Families · step 18 of 44
> [[touchdesigner/02_The_Operators/COMPs/COMP - Components|(y-) ← Prev: COMPs]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/02_The_Operators/MATs/MAT - Material Operators|(y-) Next: MATs →]]

---

[[touchdesigner/02_The_Operators/DATs/index|(y) Return to DATs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
