---
title: "L10 — Array Theory and Arrays in Boostan"
tags:
  - program-verification
  - arrays
  - smt
  - boostan
  - formal-methods
date: 2025-05-26
---

[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/09-ultimate-referee|Previous: (y-09) Ultimate Referee]] | [[/notes/programverification/11-nondeterminism-havoc-assume|Next: (y-11) Nondeterminism: Havoc and Assume]]

## Mental Model for Arrays
![[pictures/programverification/04/Lecture04_Pg257_Theory_Of_Arrays_T_A.png]]


- **Arrays as Maps**: In formal verification, an array is not a block of memory; it is a **Function** (or Map) from indices to values.
- **Select and Store**: We interact with this map using two operations: `select(a, i)` (reading) and `store(a, i, v)` (writing).
- **Immutable Updates**: `store` does not "change" an array. It returns a *new* array that is identical to the old one except at index $i$.
- **Axiomatic Reasoning**: We reason about arrays using the **Read-over-Write** axioms, which tell us exactly what happens to an index after a store operation.

## The SMT Theory of Arrays ($T_{arr}$)
![[pictures/programverification/09/Lecture09_Pg250_The_Smt_Theory_Of_Arrays_T.png]]


The signature $\Sigma_{arr}$ includes $\{ \text{select, store, } = \}$.

### Key Axioms
1.  **Read-over-Write (Hit)**: $\text{select}(\text{store}(a, i, v), i) = v$
    - *Intuition*: If you write $v$ to index $i$ and then read from $i$, you are guaranteed to get $v$.
2.  **Read-over-Write (Miss)**: $i \ne j \to \text{select}(\text{store}(a, i, v), j) = \text{select}(a, j)$
    - *Intuition*: Writing to index $i$ does not change the value at any other index $j$.
3.  **Extensionality**: $(\forall i. \text{select}(a, i) = \text{select}(b, i)) \leftrightarrow a = b$
    - *Intuition*: Two arrays $a$ and $b$ are the same array object if and only if they map every index $i$ to the same value.

---

## Arrays in Boostan
![[pictures/programverification/09/Lecture09_Pg267_Arrays_In_Boostan.png]]


We extend Boostan to support array assignments like `a[i] := expr`.

### 1. Syntax Extension
- **Left-hand side (LHS)**: Can now be a variable `x` or an array access `a[i]`.
- **Grammar**: $X_{lhs} \to X_{var} \mid X_{var}[X_{expr}]$.

### 2. Relational Semantics
![[pictures/programverification/09/Lecture09_Pg299_2_Relational_Semantics.png]]

The relation for `a[i] := expr` is defined by:
- $a' = \text{store}(a, i, \text{expr})$
- For all other variables and arrays, $v' = v$.

---

## Array Assignment in Hoare Logic


We add a new rule to the Hoare Proof System to handle array updates:

### Array Assignment Axiom (arrassig)
![[pictures/programverification/13/Lecture13_Pg270_1_Assignment_X_Expr.png]]

The formal rule is:
$$\{ \phi[a \mapsto \text{store}(a, i, \text{expr})] \} \ a[i] := \text{expr} \ \{ \phi \}$$

### 💡 Substitution Example
To prove that `{ \text{select}(a, 5) = 42 }` is a postcondition for `a[5] := 42`, we find the weakest precondition:
1.  Postcondition $\phi$: $\text{select}(a, 5) = 42$
2.  Substitute $a$ with $\text{store}(a, 5, 42)$: $\text{select}(\text{store}(a, 5, 42), 5) = 42$
3.  Simplify using Read-over-Write (Hit): $42 = 42$
4.  Result: The precondition is simply `True`.

---

## Summary

1.  **Verification Arrays** are total maps from indices to values.
2.  **Select** is for reading; **Store** is for writing.
3.  **Read-over-Write** axioms allow a computer to "calculate" the effect of an array update.
4.  **Extensionality** allows us to prove that two arrays are identical.
5.  **Hoare Logic** handles arrays by treating the update as a substitution of the entire array object.

---
[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/09-ultimate-referee|Previous: (y-09) Ultimate Referee]] | [[/notes/programverification/11-nondeterminism-havoc-assume|Next: (y-11) Nondeterminism: Havoc and Assume]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
