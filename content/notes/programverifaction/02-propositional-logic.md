---
title: "L02 — Propositional Logic"
tags:
  - program-verification
  - propositional-logic
  - logic
  - formal-methods
date: 2026-04-09
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/01-introduction|Previous: (y-01) Introduction]] | [[notes/programverifaction/03-first-order-logic|Next: (y-03) First-Order Logic]]

## Mental Model for Propositional Logic

- **Propositional Logic** is the simplest "language" of logic. It deals with statements that are either **true** or **false**.
- A **satisfiable** formula is one that *can* be true; a **valid** formula is one that *must* be true (no matter what).
- **SMT Solvers** (like Z3) are our robotic assistants. They take a complex formula and either find a way to make it true or prove it's impossible.
- **Proof Systems** are a set of mechanical rules for deriving truth. They allow us to move from premises to conclusions without making mistakes.

## Introduction to Propositional Logic
![[Lecture02_Pg029_Introduction_To_Propositional_Logic.png]]


Propositional logic (PL) is the foundation of program verification. We use it to describe the state of a program and the conditions that must hold at each point in the code.

---

## Syntax of Propositional Logic
![[Lecture02_Pg030_Syntax_Of_Propositional_Logic.png]]


A PL formula is built from:
- **Variables**: $X, Y, P, Q, \dots$
- **Constants**: `false`, `true`
- **Connectives**: $\neg$ (not), $\wedge$ (and), $\vee$ (or), $\to$ (implication), $\leftrightarrow$ (equivalence)

### 🧠 Deep Dive: Precedence
Just like math has PEMDAS, logic has its own order:
1. $\neg$ (Highest)
2. $\wedge$
3. $\vee$
4. $\to$
5. $\leftrightarrow$ (Lowest)

Example: $A \wedge B \vee C$ is $(A \wedge B) \vee C$.

---

## Semantics: What do formulas mean?
![[Lecture02_Pg032_Semantics_What_Do_Formulas_Mean.png]]


A **variable assignment** ($\rho$) maps every variable to a truth value (`true` or `false`).

- **Satisfiable**: There exists *at least one* assignment that makes the formula true.
- **Valid (Tautology)**: *Every* possible assignment makes the formula true.
- **Unsatisfiable (Contradiction)**: *No* assignment makes it true.

> **Key Theorem**: A formula $F$ is **valid** if and only if $\neg F$ is **unsatisfiable**.

---

## Truth Tables
![[Lecture02_Pg036_Truth_Tables.png]]


Truth tables are the "brute force" way to check logic. You list every possible combination of inputs and calculate the output.

| $P$ | $Q$ | $P \to Q$ | $P \vee Q$ | $(P \to Q) \wedge (P \vee Q)$ |
|---|---|---|---|---|
| F | F | T | F | F |
| F | T | T | T | T |
| T | F | F | T | F |
| T | T | T | T | T |

**Limitation**: For $n$ variables, you need $2^n$ rows. If you have 100 variables (common in program verification), the table would have more rows than atoms in the universe!

---

## Using SMT Solvers (Z3) for SAT
<!-- Review Needed: close slide match for 'Using SMT Solvers (Z3) for SAT' (p38: 0.484, p39: 0.465) -->
![[Lecture02_Pg038_Using_Smt_Solvers_Z3_For_Sat.png]]
![[Lecture02_Pg039_Using_Smt_Solvers_Z3_For_Sat.png]]


Instead of truth tables, we use **SMT Solvers**. They use clever algorithms (like CDCL) to solve formulas with thousands of variables in milliseconds.

In **SMT-LIB** notation, we write formulas in **prefix notation** (like Lisp).

Example for $(P \to Q) \wedge (P \vee Q)$:
```lisp
(declare-fun P () Bool)
(declare-fun Q () Bool)
(assert (and (=> P Q) (or P Q)))
(check-sat)
(get-model)
```

---

## Proof Systems: NPL
![[Lecture02_Pg209_Proof_Systems_Npl.png]]


A **Proof System** is a set of rules for deriving implications $\Gamma \models F$ (meaning "if all formulas in $\Gamma$ are true, then $F$ must be true").

### Rules of NPL
- **(Ax) Axiom**: If $F$ is in your assumptions, you can conclude $F$.
- **(I$\wedge$) And Introduction**: If you proved $A$ and you proved $B$, you can conclude $A \wedge B$.
- **(E$\wedge$) And Elimination**: If you have $A \wedge B$, you can conclude $A$ (or $B$).
- **(RAA) Reductio ad Absurdum**: To prove $F$, assume $\neg F$. If you find a contradiction (`false`), then $F$ must be true.

### 💡 Intuition: Formal Proofs
A formal proof is like a game of LEGO. You start with your base blocks (axioms) and use the connection rules to build the final shape (the conclusion). If you follow the rules, the final shape is guaranteed to be stable.

---

## Summary

1. **Syntax**: The "grammar" of logic (atoms and connectives).
2. **Semantics**: The "meaning" (truth values and assignments).
3. **Satisfiability**: Can it be true? **Validity**: Must it be true?
4. **SMT Solvers**: Automated tools for solving logic.
5. **Proof Systems**: Mechanical rules for human (or machine) reasoning.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/01-introduction|Previous: (y-01) Introduction]] | [[notes/programverifaction/03-first-order-logic|Next: (y-03) First-Order Logic]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
