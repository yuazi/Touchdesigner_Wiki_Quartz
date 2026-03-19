---
tags:
  - touchdesigner
  - td/operators
  - dat
  - operators
date: 2026-02-11
---

# DAT - Data Operators (Text)

DATs are used for tables, scripts, XML, JSON, and plain text.

## Text vs. Tables

DATs generally fall into two categories:

- **Tables:** Data organized in rows and columns. Accessed via scripts using row/column indices or names (e.g., `op('table1')[0, 'name']`).
- **Text:** Free-form text strings. Typically used for Python scripts, GLSL shader code, or raw JSON payloads.

## Key DATs

- **Table:** Store data in rows and columns.
- **Text:** Write Python scripts or GLSL code.
- **Select:** Isolate rows/columns from a table.
- **Execute / CHOP Execute:** Run scripts based on events (Frame start, Project start, or CHOP value changes).
- **Web Client:** Make HTTP requests to REST APIs.
- **JSON:** Parse JSON strings into usable dictionaries/tables.

## How to Use DATs

DATs manage anything text or script-related in TouchDesigner.

1. **Adding a DAT:** Open the OP Create Dialog (Tab) and select the DAT family (pink/magenta color).
2. **Working with Text:**
   - Drop a `Text DAT` to write notes, Python scripts, or custom GLSL shaders.
   - Click the node and type directly into the viewer if 'Viewer Active' is on, or right-click and choose "Edit Contents" to open it in your external text editor (like VS Code).
3. **Working with Tables:**
   - Drop a `Table DAT`. You can add rows and columns via its parameters, and type in values in 'Viewer Active' mode.
   - Process tables using nodes like `Select DAT` to extract specific rows/columns or `Merge DAT` to combine multiple tables.
4. **Running Scripts:**
   - Attach your data/text to an Execute node (`CHOP Execute`, `DAT Execute`, `Panel Execute`) to trigger Python scripts when specific network events occur.
   - For example, you can write Python inside a `CHOP Execute` DAT's `onValueChange` function to print a message whenever a button is clicked.
5. **Conversion:**
   - DATs easily convert to other families. `DAT to CHOP` is incredibly useful for turning numerical table data into CHOP channels, while `CHOP to DAT` turns signals into a historical table of values.

---

[[touchdesigner/02_The_Operators/MATs/index|(y-) Next Chapter: MATs]]

---
[[touchdesigner/02_The_Operators/DATs/index|(y) Return to DATs]] | [[touchdesigner/02_The_Operators/index|(y) Return to The Operators]] | [[touchdesigner/index|(y) Return to TouchDesigner]]
