---
title: "L12 — Control-Flow Graphs"
tags:
  - program-verification
  - cfg
  - boostan
  - formal-methods
date: 2025-06-04
---

[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/11-nondeterminism-havoc-assume|Previous: (y-11) Nondeterminism: Havoc and Assume]] | [[/notes/programverification/13-predicate-transformers|Next: (y-13) Predicate Transformers]]

## Mental Model for Control-Flow Graphs (CFGs)
![[pictures/programverification/11/Lecture11_Pg390_Mental_Model_For_Control_Flow_Graphs.png]]


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
![[pictures/programverification/12/Lecture12_Pg221_1_Assignment_X_Expr.png]]
![[pictures/programverification/12/Lecture12_Pg284_2_Havoc_Havoc_X.png]]
![[pictures/programverification/12/Lecture12_Pg339_Strongest_Postcondition_Sp.png]]
![[pictures/programverification/12/Lecture12_Pg341_Strongest_Postcondition_Sp.png]]

1.  **Assignments**: `x := expr` or `a[i] := expr`.
2.  **Havoc**: `havoc x`.
3.  **Assume**: `assume P`.

---

## Translating Boostan to CFG

Complex control structures are "desugared" into Assume statements and graph edges.

### 1. If-Then-Else
![[pictures/programverification/11/Lecture11_Pg189_1_If_Then_Else.png]]

An `if (B) {st1} else {st2}` statement starting at $\ell_{\text{in}}$ and ending at $\ell_{\text{out}}$ becomes:
- **True Branch**: An edge $(\ell_{\text{in}}, \text{assume } B, \ell_{1})$ where $\ell_{1}$ is the start of $st_1$.
- **False Branch**: An edge $(\ell_{\text{in}}, \text{assume } \neg B, \ell_{2})$ where $\ell_{2}$ is the start of $st_2$.

### 2. While Loops
A `while (B) {st}` loop starting at $\ell_{\text{loop}}$ (the loop head) becomes:
- **Entry Edge**: An edge $(\ell_{\text{loop}}, \text{assume } B, \ell_{\text{body}})$ where $\ell_{\text{body}}$ is the start of the loop body.
- **Back Edge**: The body of the loop eventually leads back to $\ell_{\text{loop}}$.
- **Exit Edge**: An edge $(\ell_{\text{loop}}, \text{assume } \neg B, \ell_{\text{after}})$ where $\ell_{\text{after}}$ is the next statement after the loop.

### 3. Assert Statements (Error Locations)
To verify correctness, `assert P` is translated using a special **Error Location** ($\ell_{\text{err}}$):
- If the assertion holds, the program continues normally to $\ell_{\text{next}}$.
- If the assertion fails, the program transitions to the error location.
- **Formal Transition**: 
    - $(\ell_{\text{curr}}, \text{assume } P, \ell_{\text{next}})$
    - $(\ell_{\text{curr}}, \text{assume } \neg P, \ell_{\text{err}})$
- **Goal**: Prove that $\ell_{\text{err}}$ is **unreachable** from the start of the program.

---

## Program Executions and Correctness

An **Execution** is a sequence of states $(s_0, s_1, \dots, s_n)$ that follows a path of transitions $(\ell_0, \text{st}_1, \ell_1, \dots, \text{st}_n, \ell_n)$ in the graph.

---

## Summary

1.  **CFGs** simplify program analysis by turning structured code into a directed graph.
2.  **Locations** represent points in the program execution; **Edges** represent atomic actions.
3.  **Complex Logic** (if, while) is handled by branching with `assume` statements.
4.  **Verification** becomes a graph-reachability problem: "Can we reach the error location?"
5.  **Tools** prefer CFGs because they provide a uniform way to represent different programming languages.

---
[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/11-nondeterminism-havoc-assume|Previous: (y-11) Nondeterminism: Havoc and Assume]] | [[/notes/programverification/13-predicate-transformers|Next: (y-13) Predicate Transformers]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
