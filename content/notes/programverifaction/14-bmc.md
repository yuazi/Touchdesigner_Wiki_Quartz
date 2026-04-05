---
title: "L14 — Bounded Model Checking and Synthesis"
tags:
  - program-verification
  - bmc
  - synthesis
  - invariants
  - smt
  - formal-methods
date: 2025-07-20
---

[[index|Back to Program Verification Index]] | [[13-predicate-transformers|Previous: (y-13) Predicate Transformers]] | [[15-correctness-via-assert|Next: (y-15) Correctness via Assert Statements]]

## Mental Model for BMC and Synthesis

- **Bounded Model Checking (BMC)**: Don't try to prove everything. Just check "Is there a bug in the first $k$ steps?" 
- **Bug Hunter**: BMC is the fastest way to find shallow bugs in programs with large state spaces.
- **Loop Unrolling**: We "unroll" the loop $k$ times and convert it into a single (very large) logic formula for the SMT solver.
- **Invariant Synthesis**: Instead of guessing a loop invariant, we create a **Template** (e.g., $ax + by \le c$) and use the solver to find the coefficients $a, b, c$.

## Bounded Model Checking (BMC)
![[../../pictures/programverifaction/16/Lecture16_Pg371_Bounded_Model_Checking_Bmc.png]]


BMC is an **Incomplete** verification technique. It is highly effective at finding bugs but cannot generally prove that a program is safe for all possible inputs if it contains loops with unknown bounds.

### 1. Loop Unrolling for $k$ steps
To check for bugs in a program with a loop, we "unroll" the loop $k$ times:
- A `while (B) { body }` becomes a nested structure of $k$ `if (B) { body }` statements.
- After the $k$-th iteration, we add an `assume !B` statement. This tells the solver to only consider executions that terminate within $k$ steps.
- If the solver finds a counterexample, it has found a real bug that occurs within $k$ iterations.

### 2. Single Static Assignment (SSA) Form
To turn a sequence of statements (a path) into a single SMT formula, we use **SSA form**:
- Every time a variable `x` is assigned, we create a new version of that variable (`x1, x2, x3...`).
- **Example**: 
    - Path: `x := 1; x := x + 1; assume x > 2;`
    - SSA Formula: $(x_1 = 1) \wedge (x_2 = x_1 + 1) \wedge (x_2 > 2)$
- This formula is sent to an SMT solver like Z3. If it is **Satisfiable**, the path is feasible and the bug is real.

### 💡 Intuition: Flashlight vs. Floodlight
- **Inductive Invariants (Floodlight)**: Proving an invariant is like turning on a floodlight. It illuminates the entire state space at once, showing that no part of the "safe" area can ever lead to the "error" area. It is powerful but can be hard to find.
- **BMC (Flashlight)**: BMC is like a flashlight. You can point it down a specific path to a depth of $k$ steps. It shows you everything in that beam with perfect clarity (no need for invariants!), but it cannot see anything outside the beam or beyond the $k$-th step.

---

## Constraint-Based Invariant Synthesis
![[../../pictures/programverifaction/16/Lecture16_Pg466_Constraint_Based_Invariant_Synthesis.png]]


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
[[index|Back to Program Verification Index]] | [[13-predicate-transformers|Previous: (y-13) Predicate Transformers]] | [[15-correctness-via-assert|Next: (y-15) Correctness via Assert Statements]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
