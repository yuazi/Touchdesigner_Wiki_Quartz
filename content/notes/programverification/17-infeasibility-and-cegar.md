---
title: "L17 — Infeasibility Proofs and CEGAR"
tags:
  - program-verification
  - cegar
  - infeasibility
  - refinement
  - formal-methods
date: 2025-07-07
---

[[index|Back to Program Verification Index]] | [[16-abstractions-and-arg|Previous: (y-16) Abstractions and ARG]] | [[18-trace-abstraction-and-automata|Next: (y-18) Trace Abstraction and Floyd-Hoare Automata]]

## Mental Model for CEGAR

- **Automated Refinement**: We don't know the best predicates $B$ for a program. **CEGAR (CounterExample-Guided Abstraction Refinement)** starts with nothing and learns the predicates it needs automatically.
- **Trace Analysis**: If our simplified (abstract) model finds an "error," we check if it's a real bug or just a **False Counterexample**.
- **Infeasibility Proofs**: If the error is a false alarm, we find an **Infeasibility Proof** (a sequence of formulas that prove the trace is impossible).
- **Learning**: We add the formulas from that proof to our set $B$, making our model more precise so it won't make that same mistake again.

## Traces and Feasibility

A **Trace** ($\pi$) is a sequence of statements $st_1, \dots, st_n$.
- **Feasible**: There is at least one execution that follows the trace.
- **Infeasible**: No execution can ever follow this trace.

### Infeasibility Proof
A sequence of formulas $\phi_0, \dots, \phi_n$ is a **Proof of Infeasibility** for $\pi$ if:
1.  $\phi_0 = \text{true}$
2.  Each step follows the logic: $sp(\phi_i, st_{i+1}) \subseteq \phi_{i+1}$
3.  The final result is $\phi_n = \text{false}$

---

## The CEGAR Approach (Step-by-Step)
![[pictures/programverification/14/Lecture14_Pg436_The_Cegar_Approach_Step_By_Step.png]]

1.  **Step 1: Start Simple**. Set the predicates $B = \emptyset$ (or some initial set).
2.  **Step 2: Build ARG**. Construct the Abstract Reachability Graph based on $B$.
3.  **Step 3: Check for Errors**.
    - If no error location $\ell_{\text{err}}$ is reachable in the ARG, the **Program is Safe**.
    - If an error location $\ell_{\text{err}}$ is reachable, find the **Abstract Error Trace** $\pi$ that led to it.
4.  **Step 4: Check Trace Feasibility**.
    - If $\pi$ is **Feasible** (satisfiable in concrete semantics), the **Program is Incorrect**. Return "Bug" + the concrete counterexample.
    - If $\pi$ is **Infeasible** (unsatisfiable in concrete semantics), our abstraction is too coarse.
5.  **Step 5: Refine**.
    - Find an **Infeasibility Proof** sequence $\phi_0, \phi_1, \dots, \phi_n$ for $\pi$ such that $\phi_0 = \text{true}, sp(\phi_i, st_{i+1}) \subseteq \phi_{i+1}$, and $\phi_n = \text{false}$.
    - Add these new formulas to our set of predicates $B$.
    - **Go back to Step 2**.

---

## 💡 Intuition: Progressive Learning

Imagine trying to find a path in a dark room.
- **Iteration 1**: You assume the room is empty. You walk forward and hit a chair (the chair is your error trace).
- **Refinement**: You now know "There is a chair at coordinate X." You add this to your mental map (your set $B$).
- **Iteration 2**: You build a new plan that avoids that chair. If you hit a table, you repeat the process.
- **End**: Eventually, you either reach the exit (Safety Proof) or prove there is no way out (Real Bug).

---

## Summary

1.  **CEGAR** automates the discovery of program properties (Predicates).
2.  **Traces** are paths through the program.
3.  **Infeasibility Proofs** are the source of new knowledge for the verifier.
4.  **Progress Property**: Once an error trace is proven infeasible, the verifier will never encounter it again in future iterations.
5.  **Power of Abstraction**: CEGAR allows us to verify complex programs without manually guessing invariants.

---
[[index|Back to Program Verification Index]] | [[16-abstractions-and-arg|Previous: (y-16) Abstractions and ARG]] | [[18-trace-abstraction-and-automata|Next: (y-18) Trace Abstraction and Floyd-Hoare Automata]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
