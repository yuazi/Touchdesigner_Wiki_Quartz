---
title: "L16 — Bounded Model Checking and Synthesis"
tags:
  - program-verification
  - bmc
  - synthesis
  - invariants
  - smt
  - formal-methods
date: 2025-07-20
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/15-trace-abstraction-and-automata|Previous: (y-15) Trace Abstraction and Automata]]

## Mental Model for BMC and Synthesis

- **Bounded Model Checking (BMC)**: Don't try to prove everything. Just check "Is there a bug in the first $k$ steps?" 
- **Bug Hunter**: BMC is the fastest way to find shallow bugs in programs with large state spaces.
- **Loop Unrolling**: We "unroll" the loop $k$ times and convert it into a single (very large) logic formula for the SMT solver.
- **Invariant Synthesis**: Instead of guessing a loop invariant, we create a **Template** (e.g., $ax + by \le c$) and use the solver to find the coefficients $a, b, c$.

## Bounded Model Checking (BMC)
![[Lecture16_Pg371_Bounded_Model_Checking_Bmc.png]]


BMC is an **Incomplete** verification technique (it can prove a program is buggy, but often cannot prove it is safe for all possible inputs).

### The Process
1.  **Unroll Loops**: Replace a `while` loop with $k$ `if` statements.
2.  **Add Assumptions**: After $k$ steps, we assume the loop has terminated.
3.  **Translate to Formula**: Use **Single Static Assignment (SSA)** form to turn the program path into a logic formula.
4.  **Check with SMT**: Ask the solver: "Is this formula $\wedge$ (Error Location reached) satisfiable?"

### 💡 Intuition: Flashlight vs. Floodlight
- **Inductive Invariants** are a "Floodlight" that shows the entire program is safe.
- **BMC** is a "Flashlight" that shines a bright beam into the first few steps of execution. It is very detailed but has limited range.

---

## Constraint-Based Invariant Synthesis
![[Lecture16_Pg466_Constraint_Based_Invariant_Synthesis.png]]


Finding loop invariants is the hardest part of verification. Synthesis tries to automate it.

### 1. The Template
We assume the invariant has a certain shape (a "Template").
Example: $i \cdot c_1 + j \cdot c_2 \le c_3$ (where $c_i$ are unknown constants).

### 2. The Constraints
We generate three types of constraints based on the Hoare While Rule:
- **Precondition**: $P \to I$
- **Inductivity**: $I \wedge B \wedge \text{body} \to I'$
- **Postcondition**: $I \wedge \neg B \to Q$

### 3. Solving
We use an SMT solver (specifically one that handles **Horn Clauses**) to find values for $c_1, c_2, c_3$ that satisfy all these conditions simultaneously.

---

## The Verifier Hierarchy

| Technique | Goal | Effort | Completeness |
|---|---|---|---|
| **BMC** | Find Bugs | Low | Incomplete |
| **CEGAR** | Proof/Bug | High | Complete (for finite state) |
| **Trace Abstraction** | Proof/Bug | High | Complete (for finite state) |
| **Synthesis** | Find Invariants | High | Complete (if template is correct) |

---

## Summary

1.  **BMC** is a powerful bug-finding technique that unrolls loops to a fixed depth $k$.
2.  **BMC** is fast but cannot prove safety if the loop runs more than $k$ times.
3.  **Invariant Synthesis** uses math to "calculate" the reason a program is safe.
4.  **Templates** provide a structure for the solver to find the missing logic.
5.  **SMT Solvers** are the underlying engine for both BMC and Synthesis.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/15-trace-abstraction-and-automata|Previous: (y-15) Trace Abstraction and Automata]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
