---
title: "L11 — Control-Flow Graphs"
tags:
  - program-verification
  - cfg
  - boostan
  - formal-methods
date: 2025-06-04
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/10-nondeterminism-havoc-assume|Previous: (y-10) Nondeterminism: Havoc and Assume]] | [[notes/programverifaction/12-predicate-transformers|Next: (y-12) Predicate Transformers]]

## Mental Model for Control-Flow Graphs (CFGs)
![[Lecture11_Pg390_Mental_Model_For_Control_Flow_Graphs.png]]


- **Flattening Code**: Real programs have nested structure (`if` inside `while` inside `if`). A **CFG** flattens this into a simple directed graph of locations and transitions.
- **Edges are Statements**: Every edge in the graph represents a single "primitive" operation (Assignment, Havoc, or Assume).
- **Paths as Executions**: A program execution is just a path from the **Initial Location** to the **Exit Location**.
- **Verification Ready**: Most automated tools (like Ultimate Automizer) convert code into a CFG before applying any verification algorithms.

## Formal Definition of a CFG

A Control-Flow Graph is a tuple $G = (Loc, \Delta, \ell_{\text{init}}, \ell_{\text{ex}})$ where:
- **$Loc$**: A finite set of **Locations** (the nodes of the graph).
- **$\Delta$**: A set of **Transitions** $(\ell, \text{stmt}, \ell')$. Each transition moves the program from one location to another by executing a statement.
- **$\ell_{\text{init}}$**: The starting point of the program.
- **$\ell_{\text{ex}}$**: The normal termination point of the program.

### Types of Transition Statements
In a CFG, we use only the most basic statements:
1.  **Assignments**: `x := expr` or `a[i] := expr`.
2.  **Havoc**: `havoc x`.
3.  **Assume**: `assume P`.

---

## Translating Boostan to CFG

Complex control structures are "desugared" into Assume statements and edges.

### 1. If-Then-Else
![[Lecture11_Pg189_1_If_Then_Else.png]]

An `if (B) {st1} else {st2}` statement becomes two branches:
- One branch starts with `assume B` followed by the edges for `st1`.
- The other branch starts with `assume !B` followed by the edges for `st2`.

### 2. While Loops
A `while (B) {st}` loop is represented as a cycle in the graph:
- A "back-edge" that starts with `assume B` and goes through the loop body back to the head.
- An "exit-edge" that starts with `assume !B` and moves to the next location after the loop.

---

## Program Executions and Correctness

An **Execution** is a sequence of states $(s_0, s_1, \dots, s_n)$ that follows a path of transitions $(\ell_0, \text{st}_1, \ell_1, \dots, \text{st}_n, \ell_n)$ in the graph.

### Error Locations
To verify assertions, we often add a special **Error Location** ($\ell_{\text{err}}$).
- If the program contains `assert P`, we translate this into a transition to $\ell_{\text{err}}$ that occurs if `assume !P` is true.
- **Goal of Verification**: Prove that no path from $\ell_{\text{init}}$ can ever reach $\ell_{\text{err}}$.

---

## Summary

1.  **CFGs** simplify program analysis by turning structured code into a directed graph.
2.  **Locations** represent points in the program execution; **Edges** represent atomic actions.
3.  **Complex Logic** (if, while) is handled by branching with `assume` statements.
4.  **Verification** becomes a graph-reachability problem: "Can we reach the error location?"
5.  **Tools** prefer CFGs because they provide a uniform way to represent different programming languages.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/10-nondeterminism-havoc-assume|Previous: (y-10) Nondeterminism: Havoc and Assume]] | [[notes/programverifaction/12-predicate-transformers|Next: (y-12) Predicate Transformers]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
