---
title: "L11 — Nondeterminism: Havoc and Assume"
tags:
  - program-verification
  - nondeterminism
  - boogie
  - boostan
  - formal-methods
date: 2025-05-28
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/10-array-theory-and-arrays-in-boostan|Previous: (y-10) Array Theory and Arrays in Boostan]] | [[/notes/lectures/programverification/12-control-flow-graphs|Next: (y-12) Control-Flow Graphs]]

## Mental Model for Nondeterminism

- **Beyond Predictability**: Real programs interact with the world (users, networks, hardware). We can't predict what a user will type, so we model it as **Nondeterminism**.
- **Havoc**: The `havoc x` statement is like a "chaos" command. It tells the verifier: "From this point on, $x$ could be absolutely *anything*."
- **Assume**: The `assume P` statement is a filter. It tells the verifier: "Throw away any execution where $P$ is false. Only focus on the worlds where $P$ holds."
- **Nondeterministic Choice**: By combining `havoc` and `assume`, we can model complex inputs (e.g., "user enters a positive number").

## Modeling Input with `havoc`

In standard programming, we use `scanf` or `read()`. In verification, we use `havoc`.

### The `havoc x` Statement
- **Meaning**: Assign an arbitrary value to $x$ from its domain.
- **Relational Semantics**: 
  - $s_2(v) = s_1(v)$ for all $v \ne x$.
  - $s_2(x)$ can be any value in $\text{Domain}(x)$.
- **Use Case**: Modeling uninitialized variables or external inputs inside a loop.

---

## The `assume` Statement


An `assume P` statement is NOT a check; it is a **constraint** on the verifier.

### Relational Semantics of `assume P`
![[pictures/programverification/10/Lecture10_Pg290_The_Assume_Statement.png]]

- **Partial Identity Relation**: $[[\text{assume P}]] = \{ (s, s) \mid s \in \text{States and } s \models P \}$.
- The relation is a subset of the **Identity Relation**.
- $(s, s) \in [[\text{assume P}]]$ if and only if $s$ satisfies $P$.
- If $s$ does not satisfy $P$, there is **no** successor state. The execution simply "disappears" (blocks).

### 💡 Intuition: Asserts vs. Assumes
- **`assert P`**: A **Requirement**. If $P$ is false, the program crashes (it's a bug).
- **`assume P`**: A **Promise**. If $P$ is false, the execution path simply ceases to exist. It's like the program "blocks" forever, so we don't have to worry about those cases.

---

## Modeling "User Input" (Havoc + Assume)
![[pictures/programverification/10/Lecture10_Pg278_Modeling_User_Input_Havoc_Assume.png]]


To model a C statement like `x = read_positive_int()`, where the user provides an input we don't control, we use the following pattern in Boogie/Boostan:

```boogie
havoc x;       // x could be absolutely anything (negative, zero, or positive)
assume x > 0;  // discard any world where the user didn't give a positive number
```
1.  **Result**: Every execution that survives the `assume` statement will have a value of $x$ that is strictly greater than zero.

---

## Why use `assume`?

1.  **Environmental Facts**: `assume temperature < 100;` (The sensor won't go higher).
2.  **Modular Verification**: When calling a function, we `assume` its postcondition holds.
3.  **Path Filtering**: `if (x > 0) { ... }` is internally modeled as an `assume x > 0` on the "true" branch.

---

## Summary

1.  **Nondeterminism** is essential for modeling the real world.
2.  **Havoc** resets a variable to a completely unknown state.
3.  **Assume** acts as a filter, removing "impossible" executions.
4.  **Asserts** are things we must prove; **Assumes** are things we get for free.
5.  **Relational Semantics**: `assume` is a partial identity; `havoc` is a broad relation allowing any value for one variable.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/10-array-theory-and-arrays-in-boostan|Previous: (y-10) Array Theory and Arrays in Boostan]] | [[/notes/lectures/programverification/12-control-flow-graphs|Next: (y-12) Control-Flow Graphs]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
