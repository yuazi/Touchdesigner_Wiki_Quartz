---
title: "L10  -  Array Theory and Arrays in Boostan"
tags:
  - program-verification
  - arrays
  - smt
  - boostan
  - formal-methods
date: 2025-05-26
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/09-ultimate-referee|Previous: (y-09) Ultimate Referee]] | [[/notes/lectures/programverification/11-nondeterminism-havoc-assume|Next: (y-11) Nondeterminism: Havoc and Assume]]

> [!warning] The Boostan-array integration here is from the 2025 course PDF. The pure $T_A$ axioms are now covered in the 2026 slides under [[/notes/lectures/programverification/04-first-order-theories|§4 First-Order Theories]]; the rest of this note refers to the older 514-page deck.

## Mental Model for Arrays
![[pictures/programverification/04/Lecture04_Pg114_Theory_Of_Arrays_T_A.png]]


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

## Self-Check

1. Why does verification model arrays as total maps from indices to values, rather than as blocks of memory?

> [!success]- Answer
> Total maps fit cleanly into first-order logic: each array is a function symbol with `select` and `store` as operations, and the read-over-write axioms describe their behavior. The memory-block view would force the logic to talk about addresses, allocation, and aliasing, which is much harder to axiomatize and decide.

2. State the two read-over-write axioms and what each one guarantees.

> [!success]- Answer
> Hit: $\text{select}(\text{store}(a, i, v), i) = v$ says reading the index you just wrote returns the value you wrote. Miss: $i \ne j \to \text{select}(\text{store}(a, i, v), j) = \text{select}(a, j)$ says writing index $i$ leaves every other index unchanged. Together they specify the entire input-output behavior of `store` and `select`.

3. What does the extensionality axiom let you prove about arrays?

> [!success]- Answer
> $(\forall i. \text{select}(a, i) = \text{select}(b, i)) \leftrightarrow a = b$. Two arrays are equal exactly when they map every index to the same value. This lets you reason about array equality elementwise instead of pointwise on a specific representation.

4. State the array-assignment axiom of Hoare logic and explain its substitution.

> [!success]- Answer
> $\{\phi[a \mapsto \text{store}(a, i, expr)]\}\ a[i] := expr\ \{\phi\}$. The whole array name `a` in the postcondition is replaced by the updated array term `store(a, i, expr)`. Like ordinary assignment, the rule reads backward: predict the precondition by substituting the updated value into the postcondition.

5. Use the array-assignment rule to derive the weakest precondition of `a[5] := 42` for the postcondition $\text{select}(a, 5) = 42$.

> [!success]- Answer
> Substitute $a$ with $\text{store}(a, 5, 42)$ in the postcondition: $\text{select}(\text{store}(a, 5, 42), 5) = 42$. Apply read-over-write Hit to simplify the left-hand side to $42$, giving $42 = 42$, which is `true`. So the weakest precondition is `true`.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/09-ultimate-referee|Previous: (y-09) Ultimate Referee]] | [[/notes/lectures/programverification/11-nondeterminism-havoc-assume|Next: (y-11) Nondeterminism: Havoc and Assume]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
