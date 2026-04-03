---
title: "L15 — Trace Abstraction and Floyd-Hoare Automata"
tags:
  - program-verification
  - trace-abstraction
  - automata
  - formal-languages
  - formal-methods
date: 2025-07-09
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/14-infeasibility-and-cegar|Previous: (y-14) Infeasibility Proofs and CEGAR]] | [[notes/programverifaction/16-bmc-and-synthesis|Next: (y-16) Bounded Model Checking and Synthesis]]

## Mental Model for Trace Abstraction
<!-- Review Needed: close slide match for 'Mental Model for Trace Abstraction' (p455: 0.544, p456: 0.544) -->
![[Lecture15_Pg455_Mental_Model_For_Trace_Abstraction.png]]
![[Lecture15_Pg456_Mental_Model_For_Trace_Abstraction.png]]


- **Code as Language**: We can view a program as a **Formal Language** over an alphabet of statements (e.g., $x:=0$, $x<y$).
- **Trace**: A "word" in this language is a path through the program (a trace).
- **Verification via Automata**: Proving safety means showing that every "word" that leads to an error is **infeasible** (no execution can follow it).
- **Trace Abstraction**: We build an automaton that "covers" (accepts) many infeasible traces. If we can cover *all* possible error paths, we have a safety proof.

## Programs as Automata
![[Lecture15_Pg448_Programs_As_Automata.png]]


- **Alphabet ($\Sigma$)**: The set of all primitive statements in the program.
- **Automaton ($A_P$)**: The Control-Flow Graph itself is a finite automaton.
- **Error Traces**: The set of all words accepted by $A_P$ (paths from initial to error locations).

---

## Floyd-Hoare Automata
<!-- Review Needed: close slide match for 'Floyd-Hoare Automata' (p445: 0.483, p447: 0.455) -->
![[Lecture15_Pg445_Floyd_Hoare_Automata.png]]
![[Lecture15_Pg447_Floyd_Hoare_Automata.png]]


A **Floyd-Hoare Automaton** is a way to prove that many traces are infeasible at once.

### Definition
![[Lecture15_Pg444_Definition.png]]

An automaton $A$ is a Floyd-Hoare automaton if there exists a **Floyd-Hoare Annotation** $\beta$ mapping each state $q$ to a formula $\phi$ such that:
1.  For every transition $(q, st, q')$, the Hoare triple $\{\beta(q)\} \ st \ \{\beta(q')\}$ is valid.
2.  Initial states are labeled `true`.
3.  Accepting states (error states) are labeled `false`.

### The Core Theorem
![[Lecture15_Pg447_The_Core_Theorem.png]]

- **If a trace is accepted by a Floyd-Hoare automaton, it is infeasible**.
- This is because the annotation $\beta$ along the accepting path forms an **Infeasibility Proof**.

---

## The Trace Abstraction Algorithm
<!-- Review Needed: close slide match for 'The Trace Abstraction Algorithm' (p455: 0.596, p456: 0.596) -->
![[Lecture15_Pg455_The_Trace_Abstraction_Algorithm.png]]
![[Lecture15_Pg456_The_Trace_Abstraction_Algorithm.png]]


1.  **Step 1: Pick an Error Trace**. Find a path $\pi$ in the program's CFG that leads to an error.
2.  **Step 2: Prove Infeasibility**. Show that $\pi$ is infeasible.
3.  **Step 3: Construct a Floyd-Hoare Automaton**.
    - Build an automaton $A_1$ that accepts $\pi$.
    - Generalize $A_1$ (add extra transitions and states) to accept as many other infeasible traces as possible.
4.  **Step 4: Subtract and Repeat**. 
    - Consider only the remaining error traces: $L(A_P) \setminus L(A_1)$.
    - If there are no traces left, the **Program is Safe**.
    - Otherwise, go back to Step 1.

---

## 💡 Intuition: Covering the Error Space
![[Lecture15_Pg449_Intuition_Covering_The_Error_Space.png]]


Imagine a field (the set of all possible error traces). 
- Some traces are feasible (real bugs). 
- Some are infeasible (safe but hard to analyze).
- **Trace Abstraction** is like placing "blankets" (Floyd-Hoare Automata) over the field. Each blanket covers a set of infeasible traces. 
- If you can cover the entire field without touching a single "bug," you've proven the program safe.

---

## Summary

1.  **Trace Abstraction** treats verification as an automata-theoretic problem.
2.  **Alphabet**: The program's statements.
3.  **Floyd-Hoare Automata**: Automata that only accept infeasible traces.
4.  **Proof of Safety**: A program is safe if all its error traces can be covered by a finite set of Floyd-Hoare automata.
5.  **Ultimate Automizer**: This is the core algorithm used in one of the most successful modern verifiers.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/14-infeasibility-and-cegar|Previous: (y-14) Infeasibility Proofs and CEGAR]] | [[notes/programverifaction/16-bmc-and-synthesis|Next: (y-16) Bounded Model Checking and Synthesis]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
