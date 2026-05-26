---
title: "L19  -  Constraint-Based Invariant Synthesis"
tags:
  - program-verification
  - invariants
  - synthesis
  - horn-clauses
  - formal-methods
date: 2025-07-20
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/18-trace-abstraction-and-automata|Previous: (y-18) Trace Abstraction and Floyd-Hoare Automata]]

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
![[pictures/programverification/07/Lecture07_Pg497_Semantics_Of_Loops_While_B_St.png]]

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

## Self-Check

1. What three obligations must a loop invariant $I$ satisfy for a while loop with guard $B$, precondition $\phi_{\text{pre}}$, and postcondition $\phi_{\text{post}}$?

> [!success]- Answer
> Initial entry: $\phi_{\text{pre}} \to I$. Inductivity: $I \wedge B \wedge \text{body} \to I'$ (where $I'$ is $I$ in the post-iteration variables). Safety exit: $I \wedge \neg B \to \phi_{\text{post}}$. The three conditions are exactly what the Hoare while rule needs.

2. What is a template, and what is the solver searching for?

> [!success]- Answer
> A template is a parameterized invariant shape such as $a \cdot x + b \cdot y \le c$ or $L \le x \le U$, with the parameters left symbolic. The solver searches for concrete numeric values of those parameters that make all three loop obligations valid. The template restricts the search space to a tractable family.

3. Give the general form of a constrained Horn clause and identify its components.

> [!success]- Answer
> $\forall \vec{x}. (\phi \wedge P_1(\vec{x}_1) \wedge \dots \wedge P_n(\vec{x}_n) \to P_0(\vec{x}_0))$, where $\phi$ is a pure theory formula and each $P_i$ is an uninterpreted predicate standing in for an unknown invariant. The body is a conjunction of known constraints plus predicate atoms, and the head is one predicate atom.

4. Write the three Horn clauses generated for a generic loop `while B { body }`.

> [!success]- Answer
> Entry: $\text{Pre}(x) \to \text{Inv}(x)$. Inductivity: $\text{Inv}(x) \wedge B(x) \wedge \text{Trans}(x, x') \to \text{Inv}(x')$. Safety: $\text{Inv}(x) \wedge \neg B(x) \to \text{Post}(x)$. A CHC solver finds an interpretation of $\text{Inv}$ that satisfies all three.

5. Which SMT tools are designed to solve Horn-clause systems, and why does verification use them rather than ordinary SAT solvers?

> [!success]- Answer
> Tools such as Spacer (part of Z3) and Eldarica are CHC solvers. Ordinary SAT or SMT solvers check satisfiability of a fixed formula, but CHC solvers search over interpretations of uninterpreted predicates that satisfy a recursive set of implications, which is exactly the shape produced by program-verification conditions over loops and procedure calls.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/18-trace-abstraction-and-automata|Previous: (y-18) Trace Abstraction and Floyd-Hoare Automata]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
