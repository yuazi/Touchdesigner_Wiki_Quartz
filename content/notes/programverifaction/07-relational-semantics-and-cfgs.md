---
title: "L07 — Relational Semantics and CFGs"
tags:
  - program-verification
  - semantics
  - boostan
  - relational-semantics
date: 2025-05-05
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/06-boogie-and-boostan|Previous: (y-06) Boogie and Boostan]] | [[notes/programverifaction/08-hoare-logic|Next: (y-08) Hoare Proof System]]

## Mental Model for Relational Semantics

- **Programs as Relations**: In verification, we don't just "run" code; we view a statement as a **Binary Relation** between the state *before* and the state *after*.
- **State**: A mapping from every program variable to a value (e.g., $\{a \to 5, b \to 10\}$).
- **Composition**: Running two statements in a row is mathematically represented as the **Relational Composition** of their individual relations.
- **Loops**: A `while` loop is represented as the **Reflexive Transitive Closure** ($R^*$) of its body, filtered by the exit condition.

## What is a Program State?
![[Lecture07_Pg181_What_Is_A_Program_State.png]]


A **Program State** $s$ is a function that assigns a value to every variable in the program. 
- If we have variables $V = \{a, b\}$, a state might be $s = \{a \mapsto 23, b \mapsto 42\}$.
- We use FOL formulas to describe **sets of states**. For example, the formula $a > 0 \wedge b = 0$ represents all possible states where $a$ is positive and $b$ is zero.

---

## Relational Semantics of Boostan
![[Lecture07_Pg145_Relational_Semantics_Of_Boostan.png]]


We define the meaning (semantics) of each Boostan statement $[[\text{stmt}]]$ as a relation $R \subseteq \text{State} \times \text{State}$.

### 1. Assignment: `x := expr`
![[Lecture07_Pg211_1_Assignment_X_Expr.png]]

The relation consists of pairs $(s_1, s_2)$ where:
- The new value of $x$ (in $s_2$) is the result of evaluating \`expr\` in the old state ($s_1$).
- All other variables $v \ne x$ remain unchanged ($s_2(v) = s_1(v)$).

### 2. Composition: `st1; st2`
![[Lecture07_Pg187_2_Composition_St1_St2.png]]

Running `st1` followed by `st2` is the composition: $[[\text{st1}]] \circ [[\text{st2}]]$.
- $(s_1, s_3) \in [[\text{st1; st2}]]$ if there exists an intermediate state $s_2$ such that $(s_1, s_2) \in [[\text{st1}]]$ and $(s_2, s_3) \in [[\text{st2}]]$.

### 3. If-Then-Else: `if (B) {st1} else {st2}`
<!-- Review Needed: close slide match for '3. If-Then-Else: `if (B) {st1} else {st2}`' (p187: 0.502, p189: 0.501) -->
![[Lecture07_Pg187_3_If_Then_Else_If_B.png]]
![[Lecture07_Pg189_3_If_Then_Else_If_B.png]]

- If the condition $B$ is true in $s_1$, we follow the relation of `st1`.
- If $B$ is false in $s_1$, we follow the relation of `st2`.

---

## Semantics of Loops: `while (B) {st}`

Loops are the most complex part of relational semantics. We use the **Reflexive Transitive Closure** ($R^*$).

1.  Let $R$ be the relation of the loop body *given that the condition $B$ is true*: $R = \{ (s, s') \mid s \in \{B\} \text{ and } (s, s') \in [[\text{st}]] \}$.
2.  The loop execution is $R^*$. This represents "running the body 0, 1, 2, or $n$ times."
3.  The final state must satisfy $\neg B$ (the loop must have terminated).

**Full Relation**: $[[\text{while (B) {st}}]] = R^* \cap (\text{State} \times \{\neg B\})$.

---

## Precondition-Postcondition Pairs
![[Lecture07_Pg199_Precondition_Postcondition_Pairs.png]]


We say a program is **correct** with respect to a precondition $\phi_{\text{pre}}$ and a postcondition $\phi_{\text{post}}$ if:
- For every state $s_1$ that satisfies $\phi_{\text{pre}}$, every possible final state $s_2$ reachable by the program must satisfy $\phi_{\text{post}}$.

Mathematically: $\text{post}(\{\phi_{\text{pre}}\}, [[\text{st}]]) \subseteq \{\phi_{\text{post}}\}$.

---

## Summary

1.  **State**: Mapping from variables to values.
2.  **Statements as Relations**: Mapping from "State Before" to "State After".
3.  **Composition**: Sequence of statements = mathematical composition of relations.
4.  **While Loops**: Use reflexive transitive closure ($R^*$) to model arbitrary iterations.
5.  **Correctness**: The set of reachable final states must be a subset of the desired postcondition.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/06-boogie-and-boostan|Previous: (y-06) Boogie and Boostan]] | [[notes/programverifaction/08-hoare-logic|Next: (y-08) Hoare Proof System]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
