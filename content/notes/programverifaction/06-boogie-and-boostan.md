---
title: "L06 — Boogie and Boostan"
tags:
  - program-verification
  - boogie
  - boostan
  - intermediate-language
date: 2026-04-30
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/05-smt-lib|Previous: (y-05) SMT-LIB]] | [[notes/programverifaction/07-control-flow-graphs|Next: (y-07) Control-Flow Graphs]]

## Mental Model for Boogie and Boostan

- **Why a new language?** Real languages (C, Java) are too messy to verify directly. We translate them into a "clean" intermediate language like **Boogie**.
- **Boogie** is a verification-oriented language. It has things programmers want (types, procedures) but is designed to be easily turned into logic formulas.
- **Boostan** is a tiny, formal fragment of Boogie that we use in class to define perfect mathematical rules for how code works.
- **Boogaloo** is a tool that lets us "run" Boogie code even when it's non-deterministic, helping us find bugs early.

## Why not verify C or Python directly?

1.  **Syntax Bloat**: These languages have hundreds of features that are hard to formalize.
2.  **Vague Semantics**: The rules for C are often defined in hundreds of pages of English text, which can be ambiguous.
3.  **Intermediate Power**: By translating many languages (C, Java, C#) into **one** intermediate language (Boogie), we only have to build **one** verifier.

---

## Boogie: The Verification Language
![[Lecture06_Pg148_Boogie_The_Verification_Language.png]]


Developed by Rustan Leino at Microsoft Research, Boogie is used by tools like **Ultimate Automizer** and **Dafny**.

### Key Features of Boogie
- **Procedures**: Named blocks of code with inputs and outputs.
- **Assignments**: `x := x + 1`.
- **Assumptions**: `assume x > 0`. If this is false, the execution "stops" or is ignored.
- **Assertions**: `assert x > 0`. This is a promise that *must* hold true.
- **Non-determinism**: Procedures can return "any" value that satisfies a condition.

---

## Boostan: The Teaching Language

Boostan is the language we will define formally in this course. It is a simplified version of Boogie with:
- **Relational Semantics**: We define code as a relation between the "State Before" and "State After".
- **Small Vocabulary**: Only the essential commands needed to learn the theory of verification.

---

## Tool: Boogaloo

Boogaloo is an **interpreter** and **symbolic executor** for Boogie.
- Unlike a standard compiler, Boogaloo can handle **non-deterministic** code.
- It explores different execution paths to see what *might* happen.
- Use the `-o` flag to control how many executions to explore (e.g., `-o 5`).

### 💡 Intuition: Asserts vs. Assumes
- **`assert P`**: Your job is to *prove* P is true. If it fails, the code is **incorrect**.
- **`assume P`**: The verifier can *take it for granted* that P is true. It is a filter that tells the verifier, "Only look at cases where P holds."

---

## Summary

1.  **Intermediate Languages** like Boogie simplify verification by providing clean semantics.
2.  **Boogie** is the industry standard for intermediate verification; **Boostan** is our teaching version.
3.  **Procedures** in Boogie allow us to modularize proofs.
4.  **Assumes** filter states, while **Asserts** check for bugs.
5.  **Boogaloo** helps us debug our Boogie programs before we run a full verifier.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/05-smt-lib|Previous: (y-05) SMT-LIB]] | [[notes/programverifaction/07-control-flow-graphs|Next: (y-07) Control-Flow Graphs]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
