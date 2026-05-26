---
title: "L11  -  Nondeterminism: Havoc and Assume"
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

## Self-Check

1. Give the relational semantics of `havoc x` in words.

> [!success]- Answer
> The relation contains every pair $(s_1, s_2)$ where $s_2$ agrees with $s_1$ on every variable other than $x$, and $s_2(x)$ can be any value in the domain of $x$. After `havoc x`, the verifier reasons about all possible values of $x$.

2. Give the relational semantics of `assume P` and describe what happens when $P$ is false in the current state.

> [!success]- Answer
> $[[\text{assume } P]] = \{(s, s) \mid s \models P\}$, a partial identity relation. If the current state $s$ does not satisfy $P$, there is no pair starting at $s$, so the execution path is dropped from consideration. The verifier simply ignores those paths.

3. How is `x = read_positive_int()` modeled with `havoc` and `assume`?

> [!success]- Answer
> Write `havoc x; assume x > 0;`. `havoc` introduces an arbitrary value for `x`, and `assume` filters out the executions where that value is not positive. Every surviving execution has `x > 0`, which captures the external-input situation without referring to actual I/O.

4. What is the operational difference between `assert P` and `assume P`?

> [!success]- Answer
> `assert P` is a proof obligation: the verifier must show $P$ holds along every path that reaches it; otherwise it reports a bug. `assume P` is a constraint: the verifier treats $P$ as given, and paths where $P$ fails simply disappear. Asserts catch errors; assumes encode environmental facts and the conditions taken on branches.

5. Why is an `if (B) {...}` branch internally modeled with an `assume`?

> [!success]- Answer
> Entering the then branch only makes sense in states where the guard $B$ holds, so the verifier prepends `assume B` to that branch and `assume !B` to the else branch. This reuses the `assume` machinery to filter states by the guard, and matches the conditional Hoare rule's split between $\varphi \wedge B$ and $\varphi \wedge \neg B$.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/10-array-theory-and-arrays-in-boostan|Previous: (y-10) Array Theory and Arrays in Boostan]] | [[/notes/lectures/programverification/12-control-flow-graphs|Next: (y-12) Control-Flow Graphs]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
