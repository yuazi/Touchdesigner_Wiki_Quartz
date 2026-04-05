---
title: "L18 — Trace Abstraction and Floyd-Hoare Automata"
tags:
  - program-verification
  - trace-abstraction
  - automata
  - formal-languages
  - formal-methods
date: 2025-07-09
---

[[index|Back to Program Verification Index]] | [[17-infeasibility-and-cegar|Previous: (y-17) Infeasibility Proofs and CEGAR]] | [[19-invariant-synthesis|Next: (y-19) Constraint-Based Invariant Synthesis]]

## Mental Model for Trace Abstraction
<!-- Review Needed: close slide match for 'Mental Model for Trace Abstraction' (p455: 0.544, p456: 0.544) -->
![[pictures/programverification/15/Lecture15_Pg455_Mental_Model_For_Trace_Abstraction.png]]
![[pictures/programverification/15/Lecture15_Pg456_Mental_Model_For_Trace_Abstraction.png]]


- **Code as Language**: We can view a program as a **Formal Language** over an alphabet of statements (e.g., $x:=0$, $x<y$).
- **Trace**: A "word" in this language is a path through the program (a trace).
- **Verification via Automata**: Proving safety means showing that every "word" that leads to an error is **infeasible** (no execution can follow it).
- **Trace Abstraction**: We build an automaton that "covers" (accepts) many infeasible traces. If we can cover *all* possible error paths, we have a safety proof.

## Programs as Automata
![[pictures/programverification/15/Lecture15_Pg448_Programs_As_Automata.png]]


- **Alphabet ($\Sigma$)**: The set of all primitive statements (assignments, assume, assert) in the program. Each edge in the CFG is labeled with an element from $\Sigma$.
- **Automaton ($A_P$)**: The Control-Flow Graph itself is a finite automaton where locations are states and transitions are edges.
- **Error Traces**: The set of all "words" (traces) accepted by $A_P$ (those starting from $\ell_{\text{init}}$ and ending in an error location $\ell_{\text{err}}$).

---

## Floyd-Hoare Automata
<!-- Review Needed: close slide match for 'Floyd-Hoare Automata' (p445: 0.483, p447: 0.455) -->
![[pictures/programverification/15/Lecture15_Pg445_Floyd_Hoare_Automata.png]]
![[pictures/programverification/15/Lecture15_Pg447_Floyd_Hoare_Automata.png]]


A **Floyd-Hoare Automaton** (FHA) is a way to prove that many traces are infeasible at once.

### Definition
![[pictures/programverification/15/Lecture15_Pg444_Definition.png]]

An automaton $A$ is a Floyd-Hoare automaton if there exists a **Floyd-Hoare Annotation** $\beta$ mapping each state $q \in Q$ to a formula $\phi$ such that:
1.  **Inductivity**: For every transition $(q, st, q')$, the Hoare triple $\{\beta(q)\} \ st \ \{\beta(q')\}$ is valid.
2.  **Initial**: For initial states $q_0$, $\beta(q_0) = \text{true}$.
3.  **Safety**: For accepting (error) states $q_{err}$, $\beta(q_{err}) = \text{false}$.

### The Core Theorem
![[pictures/programverification/15/Lecture15_Pg447_The_Core_Theorem.png]]

- **If a trace is accepted by a Floyd-Hoare automaton, it is infeasible**.
- This is because the annotation $\beta$ along the accepting path forms an **Infeasibility Proof**.

---

## The Trace Abstraction Algorithm
<!-- Review Needed: close slide match for 'The Trace Abstraction Algorithm' (p455: 0.596, p456: 0.596) -->
![[pictures/programverification/15/Lecture15_Pg455_The_Trace_Abstraction_Algorithm.png]]
![[pictures/programverification/15/Lecture15_Pg456_The_Trace_Abstraction_Algorithm.png]]


1.  **Step 1: Pick an Error Trace**. Find a path $\pi$ in the program's CFG that leads to an error.
2.  **Step 2: Prove Infeasibility**. Show that $\pi$ is infeasible.
3.  **Step 3: Construct a Floyd-Hoare Automaton**.
    - Build an automaton $A_i$ that accepts $\pi$.
    - Generalize $A_i$ (add extra transitions and states) to accept as many other infeasible traces as possible.
4.  **Step 4: Subtract and Repeat**. 
    - Consider only the remaining error traces: $L(A_P) \setminus L(A_1 \cup \dots \cup A_i)$.
    - If there are no traces left, the **Program is Safe**.
    - Otherwise, go back to Step 1.

---

## 💡 Intuition: The Blanket Analogy
![[pictures/programverification/15/Lecture15_Pg449_Intuition_Covering_The_Error_Space.png]]


Imagine a field (the set of all possible error traces $L(A_P)$). 
- Some traces are feasible (real bugs). 
- Some are infeasible (safe but hard to analyze).
- **Trace Abstraction** is like placing "blankets" (Floyd-Hoare Automata) over the field. Each blanket covers a set of infeasible traces. 
- **The Goal**: If you can cover the entire set of potential error traces ($L(A_P)$) with these "blankets" without any of them covering a real bug, you have proven the program safe.

---

## Summary

1.  **Trace Abstraction** treats verification as an automata-theoretic problem.
2.  **Alphabet**: The program's statements.
3.  **Floyd-Hoare Automata**: Automata that only accept infeasible traces.
4.  **Proof of Safety**: A program is safe if all its error traces can be covered by a finite set of Floyd-Hoare automata.
5.  **Ultimate Automizer**: This is the core algorithm used in one of the most successful modern verifiers.

---
[[index|Back to Program Verification Index]] | [[17-infeasibility-and-cegar|Previous: (y-17) Infeasibility Proofs and CEGAR]] | [[19-invariant-synthesis|Next: (y-19) Constraint-Based Invariant Synthesis]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
