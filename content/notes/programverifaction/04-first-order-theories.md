---
title: "L04 — First-Order Theories"
tags:
  - program-verification
  - first-order-logic
  - theories
  - equality
  - arithmetic
date: 2026-04-16
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[notes/programverifaction/05-smt-lib|Next: (y-05) SMT-LIB]]

## Mental Model for First-Order Theories
![[Lecture04_Pg082_Mental_Model_For_First_Order_Theories.png]]


- **Pure FOL** is too broad. It doesn't know that $1+1=2$ or that $a=b \wedge b=c \to a=c$ unless we tell it.
- A **Theory ($T$)** constrains the meaning of symbols (like $=, +, \le$) using a specific **Signature** and a set of **Axioms**.
- Instead of checking if a formula is "valid in all models," we check if it is **$T$-valid** (valid in all models that obey the theory's rules).
- This is how we bridge the gap between abstract logic and actual program variables (integers, arrays, bits).

## What is a First-Order Theory?
![[Lecture04_Pg082_What_Is_A_First_Order_Theory.png]]


A theory $T$ consists of:
1.  **Signature ($\Sigma$)**: The set of allowed symbols (constants, functions, predicates).
2.  **Axioms ($\mathcal{A}_T$)**: A set of closed formulas that define how those symbols behave.

---

## Theory of Equality ($T_E$)

Equality is the most fundamental theory. Even if a solver knows nothing else, it usually knows how $=$ works.

### Axioms of $T_E$
1.  **Reflexivity**: $\forall x. x = x$
2.  **Symmetry**: $\forall x, y. x = y \to y = x$
3.  **Transitivity**: $\forall x, y, z. (x = y \wedge y = z) \to x = z$
4.  **Function Congruence**: If $x = y$, then $f(x) = f(y)$.
5.  **Predicate Congruence (Equivalence)**: If $x = y$, then $p(x) \leftrightarrow p(y)$.

### 💡 Intuition: Congruence
Congruence means that functions and predicates are "well-behaved." If two inputs are identical, the output must be identical. This allows a verifier to substitute $b$ for $a$ if it knows $a=b$.

---

## Peano Arithmetic ($T_{PA}$)
![[Lecture04_Pg096_Peano_Arithmetic_T_Pa.png]]


This is the theory of **Natural Numbers** ($\mathbb{N}$) with addition and multiplication.

- **Signature**: $\{0, 1, +, \cdot, =\}$
- **Key Axioms**:
  - $0$ is not a successor of any number.
  - **Induction Schema**: If a property holds for $0$ and holds for $n \to n+1$, it holds for all $n$.
  - Definitions for $+$ and $\cdot$.

### ⚠️ Warning: Undecidability
- **Peano Arithmetic** is **undecidable**. There is no algorithm that can tell you if any arbitrary statement about integers (with multiplication) is true.
- **Presburger Arithmetic** (only addition, no multiplication) **is decidable**. This is why verifiers love linear integer arithmetic but struggle with $x \cdot y$.

---

## Other Important Theories

| Theory | Signature | Use Case |
|---|---|---|
| **Integers ($T_\mathbb{Z}$)** | $\{0, 1, +, -, <, =\}$ | Standard loop counters and array indices. |
| **Reals ($T_\mathbb{R}$)** | $\{0, 1, +, \cdot, <, =\}$ | Physical systems and scientific computing. |
| **Arrays ($T_A$)** | $\{\text{read}, \text{write}, =\}$ | Modeling memory and data structures. |

### The Array Axioms (Select)
![[Lecture04_Pg113_The_Array_Axioms_Select.png]]

- **Read-over-Write**: $\text{read}(\text{write}(a, i, v), i) = v$. (If you write $v$ to index $i$ and then read from $i$, you get $v$).
- **Independence**: If $i \ne j$, then $\text{read}(\text{write}(a, i, v), j) = \text{read}(a, j)$.

---

## $T$-Validity and $T$-Satisfiability
![[Lecture04_Pg083_T_Validity_And_T_Satisfiability.png]]


- **$T$-Satisfiable**: There exists a model that obeys all axioms of $T$ and makes the formula true.
- **$T$-Valid**: The formula is true in *every* model that obeys the axioms of $T$.

In program verification, we usually care about **$T$-Satisfiability**. If a "bad state" (like an assertion failure) is $T$-satisfiable, it means there is a real execution that leads to a bug.

---

## Summary

1.  **Theories** give specific meaning to symbols (e.g., how $+$ or \`read\` behave).
2.  **$T_E$ (Equality)** provides the foundation for all reasoning.
3.  **Arithmetic theories** range from easy (Presburger) to impossible (Peano).
4.  **Array theory** allows us to model computer memory.
5.  Verification tools combine these theories to reason about complex code.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[notes/programverifaction/05-smt-lib|Next: (y-05) SMT-LIB]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
