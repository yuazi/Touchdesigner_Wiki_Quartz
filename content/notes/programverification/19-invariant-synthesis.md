---
title: "L19 — Constraint-Based Invariant Synthesis"
tags:
  - program-verification
  - invariants
  - synthesis
  - horn-clauses
  - formal-methods
date: 2025-07-20
---

[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/18-trace-abstraction-and-automata|Previous: (y-18) Trace Abstraction and Floyd-Hoare Automata]]

## Mental Model for Invariant Synthesis

- **Automating the Guesswork**: Finding the right loop invariant is the hardest part of verification. **Invariant Synthesis** turns this creative task into a **Search** problem that a computer can solve.
- **Template-Based Search**: We define the "shape" of our invariant (e.g., $ax + by \le c$) and let the solver find the coefficients $a, b, c$.
- **From Hoare to Horn**: We translate the Hoare proof rules into mathematical constraints called **Horn Clauses**.
- **The Engine of Proofs**: Synthesis is how modern verifiers generate the "reasons" why code is safe, even when no human provided them.

## The Problem of Invariants

To prove a loop `while B { body }` safe, we need an invariant $I$ such that:
1.  **Initial Entry**: $\phi_{pre} \to I$
2.  **Inductivity**: $I \wedge B \wedge \text{body} \to I'$
3.  **Safety Exit**: $I \wedge \neg B \to \phi_{post}$

If $I$ is missing, we can't build a proof. **Synthesis** finds $I$ for us.

---

## 1. Templates

A template is a formula with **Unknown Parameters** (placeholders).
- **Linear Template**: $ax + by \le c$ (where $a, b, c$ are parameters to find).
- **Interval Template**: $L \le x \le U$

The solver's goal is to find concrete values for these parameters that make the Hoare rules work for all possible program executions.

---

## 2. Horn Clauses

A **Constrained Horn Clause (CHC)** is a formula of the form:
$$\forall \vec{x}. \ (\phi \wedge P_1(\vec{x}_1) \wedge \dots \wedge P_n(\vec{x}_n) \to P_0(\vec{x}_0))$$
- $\phi$ is a pure theory formula (e.g., $x > 0$).
- $P_i$ are **Uninterpreted Predicates** (the unknown invariants).

### Example: Horn Clauses for a Loop
![[pictures/programverification/19/Lecture19_Pg497_Example_Horn_Clauses_For_A_Loop.png]]

For a loop `while B { body }`, the requirements are encoded as:
1.  **Entry**: $Pre(x) \to Inv(x)$
2.  **Inductivity**: $Inv(x) \wedge B(x) \wedge Trans(x, x') \to Inv(x')$
3.  **Safety**: $Inv(x) \wedge \neg B(x) \to Post(x)$

Verification tools convert the entire program into a set of CHCs and use specialized SMT solvers like **Spacer** (part of Z3) or **Eldarica** to find the solution.

---

## 💡 Intuition: Connecting the Dots

Imagine you have two points (Initial and Error) and you need to build a "wall" (Invariant) that separates them.
- **BMC** checks if you can walk around the wall's current edges.
- **Abstraction** tries to build the wall from a fixed set of bricks.
- **Synthesis** calculates the exact mathematical equation of the wall that perfectly splits the space into "Safe" and "Dangerous."

---

## The Verifier Hierarchy (Review)

| Technique | Goal | Effort | Best For |
|---|---|---|---|
| **BMC** | Find Bugs | Low | Rapid debugging |
| **CEGAR** | Proof/Bug | High | Unknown predicates |
| **Trace Abstraction** | Proof/Bug | High | Large CFGs |
| **Synthesis** | Find Invariants | High | Mathematical/Numerical loops |

---

## Summary

1.  **Invariant Synthesis** automates the most difficult task in program verification.
2.  **Templates** restrict the search space to specific shapes of invariants.
3.  **Horn Clauses** provide the formal language for expressing invariant constraints.
4.  **SMT Solvers** use advanced algorithms to find solutions to these constraints.
5.  Verification is complete when we have a mathematical reason ($I$) for why no error can occur.

---
[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/18-trace-abstraction-and-automata|Previous: (y-18) Trace Abstraction and Floyd-Hoare Automata]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
