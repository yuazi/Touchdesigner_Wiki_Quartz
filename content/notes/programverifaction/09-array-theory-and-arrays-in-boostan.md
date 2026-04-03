---
title: "L09 — Array Theory and Arrays in Boostan"
tags:
  - program-verification
  - arrays
  - smt
  - boostan
  - formal-methods
date: 2025-05-26
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[notes/programverifaction/10-nondeterminism-havoc-assume|Next: (y-10) Nondeterminism: Havoc and Assume]]

## Mental Model for Arrays
![[Lecture09_Pg257_Mental_Model_For_Arrays.png]]


- **Arrays as Maps**: In formal verification, an array is not a block of memory; it is a **Function** (or Map) from indices to values.
- **Select and Store**: We interact with this map using two operations: `select(a, i)` (reading) and `store(a, i, v)` (writing).
- **Immutable Updates**: `store` does not "change" an array. It returns a *new* array that is identical to the old one except at index $i$.
- **Axiomatic Reasoning**: We reason about arrays using the **Read-over-Write** axioms, which tell us exactly what happens to an index after a store operation.

## The SMT Theory of Arrays ($T_{arr}$)
![[Lecture09_Pg250_The_Smt_Theory_Of_Arrays_T.png]]


The signature $\Sigma_{arr}$ includes $\{ \text{select, store, } = \}$.

### Key Axioms
1.  **Read-over-Write (Hit)**: $\text{select}(\text{store}(a, i, v), i) = v$
    - *Intuition*: If you write $v$ to $i$ and then read from $i$, you get $v$.
2.  **Read-over-Write (Miss)**: $i \ne j \to \text{select}(\text{store}(a, i, v), j) = \text{select}(a, j)$
    - *Intuition*: Writing to index $i$ does not affect any other index $j$.
3.  **Extensionality**: $(\forall i. \text{select}(a, i) = \text{select}(b, i)) \leftrightarrow a = b$
    - *Intuition*: Two arrays are "equal" if and only if they contain the same values at every possible index.

---

## Arrays in Boostan
![[Lecture09_Pg267_Arrays_In_Boostan.png]]


We extend Boostan to support array assignments like `a[i] := expr`.

### 1. Syntax Extension
- **Left-hand side (LHS)**: Can now be a variable `x` or an array access `a[i]`.
- **Grammar**: $X_{lhs} \to X_{var} \mid X_{var}[X_{expr}]$.

### 2. Relational Semantics
![[Lecture09_Pg299_2_Relational_Semantics.png]]

The relation for `a[i] := expr` is:
- $a' = \text{store}(a, i, \text{expr})$
- All other variables (and other arrays) remain unchanged.

---

## Array Assignment in Hoare Logic
![[Lecture09_Pg270_Array_Assignment_In_Hoare_Logic.png]]


We add a new rule to the Hoare Proof System to handle array updates:

### Array Assignment Axiom (arrassig)
![[Lecture09_Pg270_Array_Assignment_Axiom_Arrassig.png]]

$$\{ \phi[a \mapsto \text{store}(a, i, \text{expr})] \} \ a[i] := \text{expr} \ \{ \phi \}$$

**Example**: To prove that `a[5] = 42` holds after `a[5] := 42`, we substitute `a` with `store(a, 5, 42)` in the postcondition:
- Postcondition: $\text{select}(a, 5) = 42$
- Precondition: $\text{select}(\text{store}(a, 5, 42), 5) = 42$
- Since $\text{select}(\text{store}(a, 5, 42), 5)$ is always $42$ (by axiom), the precondition simplifies to $42=42$ (True).

---

## Summary

1.  **Verification Arrays** are total maps from indices to values.
2.  **Select** is for reading; **Store** is for writing.
3.  **Read-over-Write** axioms allow a computer to "calculate" the effect of an array update.
4.  **Extensionality** allows us to prove that two arrays are identical.
5.  **Hoare Logic** handles arrays by treating the update as a substitution of the entire array object.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[notes/programverifaction/10-nondeterminism-havoc-assume|Next: (y-10) Nondeterminism: Havoc and Assume]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
