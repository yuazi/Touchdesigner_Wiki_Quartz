---
title: "L02 — Propositional Logic"
tags:
  - program-verification
  - propositional-logic
  - logic
  - formal-methods
date: 2026-04-09
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/01-introduction|Previous: (y-01) Introduction to Program Verification]] | [[/notes/lectures/programverification/03-first-order-logic|Next: (y-03) First-Order Logic]]

## Mental Model for Propositional Logic

- **Propositional Logic** is the simplest "language" of logic. It deals with statements that are either **true** or **false**.
- A **satisfiable** formula is one that *can* be true; a **valid** formula is one that *must* be true (no matter what).
- **SMT Solvers** (like Z3) are our robotic assistants. They take a complex formula and either find a way to make it true or prove it's impossible.
- **Proof Systems** are a set of mechanical rules for deriving truth. They allow us to move from premises to conclusions without making mistakes.

## Introduction to Propositional Logic
![[pictures/programverification/02/Lecture02_Pg030_Outline_Of_Propositional_Logic.png]]


Propositional logic (PL) is the foundation of program verification. We use it to describe the state of a program and the conditions that must hold at each point in the code.

---

## Syntax of Propositional Logic
![[pictures/programverification/02/Lecture02_Pg031_Syntax_Of_Propositional_Logic.png]]


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
![[pictures/programverification/02/Lecture02_Pg033_Semantics.png]]


A **variable assignment** ($\rho$) maps every variable to a truth value (`true` or `false`).

- **Satisfiable**: There exists *at least one* assignment that makes the formula true.
- **Valid (Tautology)**: *Every* possible assignment makes the formula true.
- **Unsatisfiable (Contradiction)**: *No* assignment makes it true.

> **Key Theorem**: A formula $F$ is **valid** if and only if $\neg F$ is **unsatisfiable**.

---

## Truth Tables
![[pictures/programverification/02/Lecture02_Pg035_Truth_Tables.png]]


Truth tables are the "brute force" way to check logic. You list every possible combination of inputs and calculate the output.

### Example: Truth Table for $F_5$
![[pictures/programverification/02/Lecture02_Pg036_Truth_Table_Example.png]]

Let $F_5: (P \to Q) \wedge (P \vee Q) \wedge \neg Q$.

| $P$ | $Q$ | $P \to Q$ | $P \vee Q$ | $\neg Q$ | $(P \to Q) \wedge (P \vee Q) \wedge \neg Q$ |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F | F | T | F | T | **F** |
| F | T | T | T | F | **F** |
| T | F | F | T | T | **F** |
| T | T | T | T | F | **F** |

**Conclusion**: Since the final column is `false` for every possible assignment, $F_5$ is **unsatisfiable**.

**Limitation**: For $n$ variables, you need $2^n$ rows. If you have 100 variables (common in program verification), the table would have more rows than atoms in the universe!

---

## Using SMT Solvers (Z3) for SAT
![[pictures/programverification/02/Lecture02_Pg038_Smt_Solvers_For_Sat.png]]


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
![[pictures/programverification/02/Lecture02_Pg045_Proof_Rules_Of_Npl.png]]


A **Proof System** is a set of rules for deriving implications $\Gamma \models F$ (meaning "if all formulas in $\Gamma$ are true, then $F$ must be true").

### Rules of NPL
Rules are written as $\frac{\text{Premises}}{\text{Conclusion}}$.

| Rule | Name | Formula |
| :--- | :--- | :--- |
| **Axiom** | (Ax) | $\Gamma \cup \{F\} \vdash F$ |
| **RAA** | (RAA) | $\frac{\Gamma \cup \{\neg F\} \vdash \text{false}}{\Gamma \vdash F}$ (Reductio ad Absurdum) |
| **Intro $\wedge$** | ($I\wedge$) | $\frac{\Gamma \vdash F_1 \quad \Gamma \vdash F_2}{\Gamma \vdash F_1 \wedge F_2}$ |
| **Elim $\wedge$** | ($E\wedge_i$) | $\frac{\Gamma \vdash F_1 \wedge F_2}{\Gamma \vdash F_i}$ (for $i \in \{1, 2\}$) |
| **Intro $\vee$** | ($I\vee_i$) | $\frac{\Gamma \vdash F_i}{\Gamma \vdash F_1 \vee F_2}$ (for $i \in \{1, 2\}$) |
| **Elim $\vee$** | ($E\vee$) | $\frac{\Gamma \vdash F_1 \vee F_2 \quad \Gamma \cup \{F_1\} \vdash F_3 \quad \Gamma \cup \{F_2\} \vdash F_3}{\Gamma \vdash F_3}$ |
| **Intro $\to$** | ($I\to$) | $\frac{\Gamma \cup \{F_1\} \vdash F_2}{\Gamma \vdash F_1 \to F_2}$ |
| **Elim $\to$** | ($E\to$) | $\frac{\Gamma \vdash F_1 \quad \Gamma \vdash F_1 \to F_2}{\Gamma \vdash F_2}$ (Modus Ponens) |
| **Intro $\neg$** | ($I\neg$) | $\frac{\Gamma \cup \{F\} \vdash \text{false}}{\Gamma \vdash \neg F}$ |
| **Elim $\neg$** | ($E\neg$) | $\frac{\Gamma \vdash F_1 \quad \Gamma \vdash \neg F_1}{\Gamma \vdash F_2}$ (Ex Falso Quodlibet) |

### 🧠 Deep Dive: A Derivation Example
**Goal**: Prove $\{A, A \to B\} \vdash A \wedge B$.
Let $\Gamma = \{A, A \to B\}$.

1.  **Bottom-up**: We want to prove $\Gamma \vdash A \wedge B$.
2.  Use **(I$\wedge$)**: This splits the proof into two branches: $\Gamma \vdash A$ and $\Gamma \vdash B$.
3.  **Left branch**: $\Gamma \vdash A$. Since $A \in \Gamma$, this is finished by **(Ax)**.
4.  **Right branch**: $\Gamma \vdash B$. Since $B \notin \Gamma$, we use **(E$\to$)** (Modus Ponens).
5.  This requires proving $\Gamma \vdash A$ and $\Gamma \vdash A \to B$. Both are finished by **(Ax)** as they are in $\Gamma$.

### 💡 Intuition: Formal Proofs
A formal proof is like a game of LEGO. You start with your base blocks (axioms) and use the connection rules to build the final shape (the conclusion). If you follow the rules, the final shape is guaranteed to be stable.

### Guide for Finding a Derivation
![[pictures/programverification/02/Lecture02_Pg051_Guide_For_Proving_Implications.png]]

1.  **Start at the bottom**: Write the goal implication as the root of your tree.
2.  **Look at the Top-Level Operator**: If the RHS is $F_1 \wedge F_2$, use ($I\wedge$) to split the problem.
3.  **Use (Ax) ASAP**: As soon as the formula on the right is in the set on the left, you've finished that branch.
4.  **No replacements**: You cannot swap $A \wedge B$ for $B \wedge A$ without a specific rule; the proof system is purely mechanical/syntactic.

---

## Summary

1. **Syntax**: The "grammar" of logic (atoms and connectives).
2. **Semantics**: The "meaning" (truth values and assignments).
3. **Satisfiability**: Can it be true? **Validity**: Must it be true?
4. **SMT Solvers**: Automated tools for solving logic.
5. **Proof Systems**: Mechanical rules for human (or machine) reasoning.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/01-introduction|Previous: (y-01) Introduction to Program Verification]] | [[/notes/lectures/programverification/03-first-order-logic|Next: (y-03) First-Order Logic]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
