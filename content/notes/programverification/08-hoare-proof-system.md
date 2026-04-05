---
title: "L08 — Hoare Proof System"
tags:
  - program-verification
  - hoare-logic
  - proof-system
  - formal-methods
date: 2025-05-14
---

[[index|Back to Program Verification Index]] | [[07-relational-semantics|Previous: (y-07) Relational Semantics]] | [[09-ultimate-referee|Next: (y-09) Ultimate Referee]]

## Mental Model for the Hoare Proof System
![[pictures/programverification/08/Lecture08_Pg210_Mental_Model_For_The_Hoare_Proof.png]]


- **Logic through Code**: Hoare Logic is a way to "transport" mathematical facts through program statements.
- **Hoare Triple**: The basic unit of reasoning, written `{P} st {Q}`. It means: "If $P$ is true before $st$, then $Q$ will be true after $st$ (if it terminates)."
- **Mechanical Rules**: Instead of thinking about all possible values, we follow a set of purely syntactic rules to build a **Derivation Tree**.
- **The Loop Challenge**: For every loop, we must discover a "magical" formula called a **Loop Invariant** that remains true throughout the loop's execution.
## The Hoare Triple
![[pictures/programverification/08/Lecture08_Pg208_The_Hoare_Triple.png]]


A **Hoare Triple** is written as:
$$\{P\} \ S \ \{Q\}$$
- **$P$ (Precondition):** An assertion about the program state before execution.
- **$S$ (Statement):** The code being analyzed.
- **$Q$ (Postcondition):** An assertion guaranteed to be true after execution.

### Relational Semantics Connection
![[pictures/programverification/08/Lecture08_Pg208_Relational_Semantics_Connection.png]]

A triple is **valid** if the program $S$ satisfies the precondition-postcondition pair $(P, Q)$. Mathematically, this means the set of reachable states from $P$ via $S$ is a subset of $Q$:
$$\text{post}(\{P\}, [[S]]) \subseteq \{Q\}$$

---

## Key Rules of the Hoare Proof System

### 1. Assignment Axiom (assig)
![[pictures/programverification/08/Lecture08_Pg270_1_Assignment_Axiom_Assig.png]]

$$\{Q[x \mapsto \text{expr}]\} \ x := \text{expr} \ \{Q\}$$
To prove $Q$ holds *after* an assignment, we must prove $Q$ with $x$ replaced by the expression *before* the assignment.

### Example Derivation
Let's prove the correctness of a simple program: `x := x + 1; y := x; {x = y}`.

We build the derivation tree from the bottom up:

1.  **Goal**: $\{true\} \ x := x + 1; y := x \ \{x = y\}$
2.  **Step 1 (Composition)**: We need an intermediate assertion $R$. Using the assignment axiom backwards for $y := x$ with postcondition $x=y$, we get $R = (x = x)$, which is $true$.
3.  **Step 2 (Assignment)**: For $x := x + 1$ with postcondition $true$, the precondition is $true[x \mapsto x+1]$, which is still $true$.

**Formal Tree**:
$$
\frac{
    \frac{}{\{ (x+1=x+1) \} \ x := x + 1 \ \{ (x=x) \}} (assig)
    \quad
    \frac{}{\{ (x=x) \} \ y := x \ \{ (x=y) \}} (assig)
}{
    \{ true \} \ x := x + 1; y := x \ \{ x = y \}
} (compo)
$$
*(Note: We use Strengthen Precondition to turn $true$ into $x+1=x+1$ and $x=x$ into $true$)*

---

## Key Rules (Continued)
... (rest of the rules) ...
![[pictures/programverification/08/Lecture08_Pg211_2_Composition_Rule_Compo.png]]

$$\frac{\{P\} \ st_1 \ \{R\} \quad \{R\} \ st_2 \ \{Q\}}{\{P\} \ st_1; st_2 \ \{Q\}}$$
To prove a sequence, find an intermediate assertion $R$ that links them.

### 3. Consequence Rules (strepre / weakpos)
![[pictures/programverification/08/Lecture08_Pg224_3_Consequence_Rules_Strepre_Weakpos.png]]

- **Strengthen Precondition**: If $P' \to P$ and $\{P\} st \{Q\}$ is valid, then $\{P'\} st \{Q\}$ is valid.
- **Weaken Postcondition**: If $\{P\} st \{Q\}$ is valid and $Q \to Q'$, then $\{P\} st \{Q'\}$ is valid.

### 4. Conditional Rule (condi)
![[pictures/programverification/08/Lecture08_Pg214_4_Conditional_Rule_Condi.png]]

$$\frac{\{P \wedge B\} \ st_1 \ \{Q\} \quad \{P \wedge \neg B\} \ st_2 \ \{Q\}}{\{P\} \ \text{if } B \ \{st_1\} \ \text{else } \{st_2\} \ \{Q\}}$$

---

## Reasoning About Loops: The While Rule

Loops are the only part of the system that requires "creative" thinking.
$$\frac{\{I \wedge B\} \ st \ \{I\}}{\{I\} \ \text{while } B \ \{st\} \ \{I \wedge \neg B\}}$$

- **$I$ (Loop Invariant)**: A formula that must be true before the loop starts, after every iteration, and when the loop exits.
- To prove a loop correct, you must:
  1. **Find** a suitable invariant $I$.
  2. **Prove** that the loop body $st$ preserves $I$.
  3. **Show** that $I \wedge \neg B$ implies your desired postcondition.

---

## Soundness

A proof system is **Sound** if every Hoare triple we can derive is actually true in the real program semantics.
- We prove this by showing that each individual rule (Assignment, Composition, etc.) is correct.
- If the rules are sound, the whole derivation tree is guaranteed to be correct.

---

## Summary

1.  **Hoare Logic** allows us to prove code correctness mathematically.
2.  **Triples** link preconditions, statements, and postconditions.
3.  **Assignments** work "backwards" (substitution).
4.  **Loops** require an **Inductive Invariant** ($I$).
5.  **Derivations** are mechanical proofs built from these rules.

---
[[index|Back to Program Verification Index]] | [[07-relational-semantics|Previous: (y-07) Relational Semantics]] | [[09-ultimate-referee|Next: (y-09) Ultimate Referee]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
