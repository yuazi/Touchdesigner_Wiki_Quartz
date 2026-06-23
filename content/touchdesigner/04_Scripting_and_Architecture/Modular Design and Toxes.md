---
title: "Modular Design and Toxes"
tags:
  - touchdesigner
  - td/architecture
  - modular
  - python
  - tox
date: 2026-02-21
---

A `.toe` file (your project) is one giant binary blob. The moment a project gets serious, you'll want to factor parts of it out into reusable, version-controllable units. The unit you factor out is the **`.tox`**: a saved component that contains one COMP plus everything inside it.

## What a `.tox` Is

Per the Derivative wiki, a `.tox` is "a TouchDesigner Component file, the file type used to save a Component of your TouchDesigner project. A .tox file contains one component which in turn can contain multiple components."

That means a `.tox` is portable: drop it into a different `.toe`, drop it into another COMP, share it with a collaborator, and the entire internal network plus parameters travels with it.

## Saving a `.tox`

| Action                                  | How                                                        |
| --------------------------------------- | ---------------------------------------------------------- |
| Save a COMP to `.tox`                   | RMB the COMP → **Save Component .tox...**                  |
| Load a `.tox` into an empty COMP        | Drag-drop the `.tox` from Finder/Explorer into the network |
| Replace a COMP's contents from a `.tox` | Set the COMP's `External .tox` parameter to a path         |

## The External `.tox` Workflow

Every COMP has an `External .tox` parameter on its **Common** page. When set, the COMP's contents are loaded from the file on disk each time the project starts. This is how you keep modular pieces in their own files outside the `.toe`.

| Common page parameter       | What it does                                                                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **External .tox**           | Path to the on-disk `.tox`. Contents load from this file at project start.                                                                                           |
| **Reload .tox** (pulse)     | Re-read the file without restarting the project.                                                                                                                     |
| **Save Backup of External** | When on, the contents are also baked into the `.toe` as a fallback. If the external file goes missing, the backup loads instead.                                     |
| **Sub-Component to Load**   | Reach into the `.tox` and pull out a nested COMP. E.g. if `proj.tox` contains `proj/geo1`, setting this to `geo1` makes the loaded COMP be `geo1` instead of `proj`. |

## Toxes and Git

`.toe` files are binary and miserable for source control: any meaningful change produces an unmergeable diff. The standard workaround is to keep your project as a thin shell that loads modular `.tox` files. You commit the `.tox` files; multiple developers can work on different modules without merge conflicts on the main `.toe`.

There's an active community of helper extensions for the "save external" workflow (auto-save on file save, version stamps in the COMP's Common page) since stock TouchDesigner doesn't bundle this. Worth searching the forum if you want a cleaner save story.

## Engine COMP: Process Isolation

The Engine COMP runs a `.tox` in a separate OS process via TouchEngine. Use cases:

- A misbehaving module can crash without taking the main project down.
- Run a heavy module on its own clock so a stutter in it doesn't drop your main framerate.
- Mix-and-match `.tox` files built in different TouchDesigner versions.

Trade-offs:

- Communication is restricted to TOP, CHOP, and DAT data through buffers (latency cost).
- Custom parameters are one-way only (host writes to the engine, not back).
- Buffer sizes and clock-sync settings need tuning to your workload.

## Custom Parameters: The Module Interface

A `.tox` is only as reusable as its interface. The interface is the wrapper COMP's custom parameters.

1. RMB the COMP → **Customize Component...**
2. Add custom parameters that represent every knob someone using this module would want.
3. Inside the COMP, bind internal node parameters to those custom parameters (Bind mode, purple).
4. Save as `.tox`.

Now anyone who drops this `.tox` in sees a clean parameter surface and never has to dive inside.

See [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]] for the full pattern.

## Python Extensions: When State Gets Complex

When module logic is more than a few callback DATs, **Extensions** scale better. An Extension is a Python class attached to a COMP whose methods become callable as `op('myComp').MyMethod()`.

1. RMB the COMP → **Customize Component...**
2. Open the **Extension Code** section, name your class (e.g. `MyModuleExt`), click **Add**.
3. TouchDesigner creates a Text DAT with a class skeleton.
4. Define methods like `def Fire(self):` and call them externally as `op('myComp').Fire()`.

Extensions also let you cleanly hold per-COMP state in `self`, instead of stuffing it into Storage or hidden DATs.

## Wiring Across Modules: Avoid Spaghetti

Keep wires inside their owning COMP. To pass data between modules, use these mechanisms instead of dragging long wires:

- **Global OP Shortcuts**: name a top-level singleton (audio engine, settings) and reference as `op.AUDIO` from anywhere. See [[touchdesigner/04_Scripting_and_Architecture/The op and me objects|The op and me objects]].
- **Parent Shortcuts**: reference a containing COMP by stable name regardless of nesting depth.
- **In/Out ops** at the COMP boundary: clean inputs/outputs on the wrapper. See [[touchdesigner/01_Core_Concepts/Connecting Nodes|Connecting Nodes]].
- **Select TOP/CHOP/SOP/DAT**: pulls data from another op by path, no wire required.

## What's Next

- [[touchdesigner/04_Scripting_and_Architecture/Custom Parameters|Custom Parameters]]: design the interface of your `.tox`
- [[touchdesigner/04_Scripting_and_Architecture/Container and Widgets|Container and Widgets]]: ship a UI alongside the parameters

---

> [!tip]- 📚 Learning Path · Stage 6 - Scripting & Architecture · step 33 of 44
> [[touchdesigner/04_Scripting_and_Architecture/Cooking|(y-) ← Prev: Cooking]] · [[touchdesigner/Learning Path|(y) Path Overview]] · [[touchdesigner/04_Scripting_and_Architecture/Performance Monitoring|(y-) Next: Performance Monitoring →]]

---

[[touchdesigner/04_Scripting_and_Architecture/index|(y) Return to Scripting & Architecture]] | [[touchdesigner/index|(y) Return to TouchDesigner]] | [[/index|(y) Return to Home]]
