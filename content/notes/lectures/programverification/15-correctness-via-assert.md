---
title: "L15  -  Correctness via Assert Statements"
tags:
  - program-verification
  - assertions
  - cfg
  - error-locations
  - formal-methods
date: 2025-06-30
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/14-bmc|Previous: (y-14) Bounded Model Checking]] | [[/notes/lectures/programverification/16-abstractions-and-arg|Next: (y-16) Abstractions and ARG]]

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

## Self-Check

1. What does an `assert P` statement mean operationally, and how is it different from `assume P`?

> [!success]- Answer
> `assert P` is a check at this exact program point: if $P$ is false the program is considered incorrect. `assume P` is a constraint: paths where $P$ is false simply disappear, no error is raised. Asserts produce bugs; assumes filter the state space.

2. How is an `assert expr` translated into a CFG?

> [!success]- Answer
> The source location $\ell_{\text{init}}$ gains two outgoing edges: an `assume expr` edge to the successor $\ell_{\text{ex}}$ for the success case, and an `assume !expr` edge to a dedicated error location $\ell_{\text{err}}$ for the failure case. Reaching $\ell_{\text{err}}$ in any execution constitutes an assertion failure.

3. What does "program safety" reduce to in this framework?

> [!success]- Answer
> Safety means no path of the CFG from the initial location reaches any error location. Equivalently, every abstract configuration $(\ell_{\text{err}}, \phi)$ reachable from the initial state must have $\phi$ equivalent to `false`. Verification becomes a graph reachability question with logical conditions on edges.

4. Why are local assertions more expressive than a single pre/post specification?

> [!success]- Answer
> A pre/post pair only checks the overall input-output relationship at the exit point. Asserts let you specify local invariants at any program point (loop heads, just after a critical assignment, before a dangerous operation). This catches bugs at the exact point they manifest, rather than letting them propagate to the final state.

5. In the example `assume x > 0; x := x - 1; assert x >= 0;`, why is the assert safe?

> [!success]- Answer
> The `assume x > 0` filters to states where $x \ge 1$ (integer domain). After `x := x - 1`, the new $x$ is at least $0$. The assert $x \ge 0$ therefore holds along every surviving path, so the error location is unreachable and the fragment is safe.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/14-bmc|Previous: (y-14) Bounded Model Checking]] | [[/notes/lectures/programverification/16-abstractions-and-arg|Next: (y-16) Abstractions and ARG]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
