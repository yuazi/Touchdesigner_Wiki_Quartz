---
title: "L05 — SMT-LIB"
tags:
  - program-verification
  - smt-lib
  - solvers
  - z3
  - formal-methods
date: 2026-04-16
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/04-first-order-theories|Previous: (y-04) First-Order Theories]] | [[notes/programverifaction/06-boogie-and-boostan|Next: (y-06) Boogie and Boostan]]

## Mental Model for SMT-LIB

- **SMT-LIB** is the "assembly language" of formal verification. It's a standardized language that almost all modern SMT solvers (like Z3, CVC5, and SMTInterpol) understand.
- It is based on **Sorted First-Order Logic**. Everything has a type (a "sort").
- The syntax uses **Prefix Notation** (Lisp-style), which makes it easy for machines to parse but requires humans to get used to nested parentheses.
- An **SMT Script** is a sequence of commands that define the environment, state assumptions, and ask questions about satisfiability.

## Introduction to SMT-LIB
![[Lecture05_Pg127_Introduction_To_Smt_Lib.png]]


SMT-LIB (Satisfiability Modulo Theories Library) provides a standard for theories, logics, and solver interaction. Instead of learning a new language for every tool, we use SMT-LIB as a universal interface.

---

## Prefix Notation (S-Expressions)

In SMT-LIB, operators come *before* their arguments.

| Standard Math | SMT-LIB (Lisp-style) |
|---|---|
| $x + y = 10$ | `(= (+ x y) 10)` |
| $x \ge 0 \wedge x < 5$ | `(and (>= x 0) (< x 5))` |
| $\neg P \vee Q$ | `(or (not P) Q)` |

---

## The SMT-LIB Script Lifecycle

A typical script follows these steps:

1.  **Set Logic**: Tell the solver which theories you need (e.g., `QF_LIA` for Quantifier-Free Linear Integer Arithmetic).
2.  **Declare Symbols**: Define your constants and functions.
3.  **Assert**: State your constraints or the negation of what you want to prove.
4.  **Check-Sat**: Ask the solver: "Is there any assignment that makes all assertions true?"
5.  **Get-Model**: If the answer is `sat`, ask for a concrete example.

### Example Script
```lisp
; 1. Setup the logic
(set-logic QF_LIA)

; 2. Declare two integer constants
(declare-fun x () Int)
(declare-fun y () Int)

; 3. Assert some constraints
(assert (> x 0))
(assert (= y (* x 2)))
(assert (< y 10))

; 4. Check if a solution exists
(check-sat)

; 5. If sat, get the values
(get-model)
```

---

## Sorted Logic: Terms as Formulas
![[Lecture05_Pg133_Sorted_Logic_Terms_As_Formulas.png]]


In SMT-LIB, the distinction between "terms" and "formulas" is blurred:
- **Sorts**: Every symbol has a sort (like `Int`, `Real`, `Bool`, or user-defined sorts).
- **Functions**: Even logical connectives like `and` or `not` are just functions that take `Bool` arguments and return a `Bool`.
- **Predicates**: Relations like `<` are functions that take (e.g.) `Int` and return `Bool`.

**Why this matters**: It makes the language very consistent. A formula is just a term of sort `Bool`.

---

## Important SMT Logics
![[Lecture05_Pg131_Important_Smt_Logics.png]]


Solvers use these labels to pick the best algorithm for the job:

- **QF_LIA**: Quantifier-Free Linear Integer Arithmetic (Most common for software).
- **QF_LRA**: Quantifier-Free Linear Real Arithmetic.
- **QF_A**: Quantifier-Free Formulas over Arrays.
- **AUFLIA**: Arrays, Uninterpreted Functions, and Linear Integer Arithmetic.

---

## Summary

1.  **SMT-LIB** is the standard interface for talking to solvers.
2.  Uses **Prefix Notation** (S-expressions).
3.  **Scripts** follow a Declare $\to$ Assert $\to$ Check pattern.
4.  **Sorted Logic** ensures that we don't accidentally add a Boolean to an Integer.
5.  **Logics** define the specific subset of FOL and theories being used.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/04-first-order-theories|Previous: (y-04) First-Order Theories]] | [[notes/programverifaction/06-boogie-and-boostan|Next: (y-06) Boogie and Boostan]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
