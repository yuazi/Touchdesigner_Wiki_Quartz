---
title: "L15 — Correctness via Assert Statements"
tags:
  - program-verification
  - assertions
  - cfg
  - error-locations
  - formal-methods
date: 2025-06-30
---

[[notes/programverification/index|Back to Program Verification Index]] | [[notes/programverification/14-bmc|Previous: (y-14) Bounded Model Checking]] | [[notes/programverification/16-abstractions-and-arg|Next: (y-16) Abstractions and ARG]]

## Mental Model for Assert Statements

| Feature | Pre-Post Pair | Assert Statements |
| :--- | :--- | :--- |
| **Location** | Exit only | Anywhere in code |
| **Scope** | Global (Full path) | Local (Specific point) |
| **Granularity** | Coarse | Fine-grained |

- **Internal Correctness**: Instead of checking a "Pre-Post" pair at the very end, **Assert** statements let us specify correctness *anywhere* in the code.
- **Immediate Error**: If an `assert P` is reached and $P$ is false, the program is considered **erroneous** at that exact location.
- **Translation to CFG**: In a Control-Flow Graph, an `assert P` becomes a fork: one path where $P$ holds (Normal) and one where $\neg P$ holds (Error).
- **Error Locations**: We verification tools look for a path from the initial location to a special **Error Location** ($\ell_{\text{err}}$) created by these asserts.

## The `assert` Statement
![[pictures/programverification/15/Lecture15_Pg388_The_Assert_Statement.png]]


In Boogie and Boostan, `assert expr;` is a fundamental building block.
- **Evaluation**: The expression `expr` is evaluated when the statement is reached.
- **Behavior**: If `true`, the execution continues. If `false`, the program is **Incorrect**.

### Program Safety
A program is considered **safe** if all reachable error states are `false` (i.e., they are unreachable). Formally, for every error location $\ell_{\text{err}}$, if $(\ell_{\text{err}}, \phi)$ is an abstract configuration reachable from the initial state, then $\phi \equiv \text{false}$.

### Example: Assert vs Assume
```boogie
assume x > 0;
x := x - 1;
assert x >= 0;
```
1.  **Assume**: Filters the world so we only care about $x = 1, 2, 3 \dots$.
2.  **Assert**: Checks if the promise $x \ge 0$ holds after the decrement.

---

## CFG with Error Locations
![[pictures/programverification/15/Lecture15_Pg391_Cfg_With_Error_Locations.png]]


When we translate a program with asserts into a Control-Flow Graph (CFG), we add **Error Locations**.

### Translation of `assert expr;`
![[pictures/programverification/15/Lecture15_Pg292_Translation_Of_Assert_Expr.png]]

For a location $\ell_{init}$, an `assert expr;` creates two outgoing transitions:
1.  **Success**: $(\ell_{init}, \text{assume expr}, \ell_{ex})$ (Path continues).
2.  **Failure**: $(\ell_{init}, \text{assume !expr}, \ell_{err})$ (Leads to an error).

**A Program is Safe if NO path exists from the start to ANY error location.**

---

## 💡 Intuition: Correctness as Reachability

Imagine a program as a building.
- **Pre/Post-conditions**: You only care if the person exited through the right door.
- **Assert Statements**: You placed "security cameras" (asserts) in every room. If the person is caught doing something wrong in *any* room, the whole visit is considered a failure.
- **Verification**: The verifier acts as a security guard, proving that there is no possible path a visitor can take to trigger any of the cameras.

---

## Summary

1.  **Assert Statements** specify local correctness properties.
2.  **CFGs** model asserts as branches to special **Error Locations**.
3.  **Error Configuration**: A pair $(\ell, s)$ where $\ell$ is an error location.
4.  **Abstract Error Configuration**: A pair $(\ell, \phi)$ where $\ell$ is an error location and $\phi$ is satisfiable.
5.  **Safety**: Proving a program is safe means proving that its error locations are **unreachable**.

---
[[notes/programverification/index|Back to Program Verification Index]] | [[notes/programverification/14-bmc|Previous: (y-14) Bounded Model Checking]] | [[notes/programverification/16-abstractions-and-arg|Next: (y-16) Abstractions and ARG]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
