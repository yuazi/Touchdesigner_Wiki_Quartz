---
title: "L05  -  SMT-LIB"
tags:
  - program-verification
  - smt-lib
  - solvers
  - z3
  - formal-methods
date: 2026-04-16
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/04-first-order-theories|Previous: (y-04) First-Order Theories]] | [[/notes/lectures/programverification/06-boogie-and-boostan|Next: (y-06) Boogie and Boostan]]

## Mental Model for SMT-LIB

- **SMT-LIB** is the "assembly language" of formal verification. It's a standardized language that almost all modern SMT solvers (like Z3, CVC5, and SMTInterpol) understand.
- It is based on **Sorted First-Order Logic**. Everything has a type (a "sort").
- The syntax uses **Prefix Notation** (Lisp-style), which makes it easy for machines to parse but requires humans to get used to nested parentheses.
- An **SMT Script** is a sequence of commands that define the environment, state assumptions, and ask questions about satisfiability.

## Introduction to SMT-LIB

![[pictures/programverification/05/Lecture05_Pg128_Smt_Lib.png]]

SMT-LIB (Satisfiability Modulo Theories Library) provides a standard for theories, logics, and solver interaction. Instead of learning a new language for every tool, we use SMT-LIB as a universal interface.

---

## Prefix Notation (S-Expressions)

In SMT-LIB, operators come _before_ their arguments.

| Standard Math          | SMT-LIB (Lisp-style)     |
| ---------------------- | ------------------------ |
| $x + y = 10$           | `(= (+ x y) 10)`         |
| $x \ge 0 \wedge x < 5$ | `(and (>= x 0) (< x 5))` |
| $\neg P \vee Q$        | `(or (not P) Q)`         |

---

## The SMT-LIB Script Lifecycle

A typical script follows these steps, using the **4 main commands**:

1.  **`define-fun`**: Define a function (often used for complex expressions or predicates).
2.  **`assert`**: State a formula that must be true.
3.  **`check-sat`**: Ask the solver if there's an assignment that makes all assertions true.
4.  **`get-model`**: If `sat`, ask for a concrete assignment to the variables.

### Full Lifecycle Example

1.  **Set Logic**: Tell the solver which theories you need.
    - **`QF_LIA`**: Quantifier-Free Linear Integer Arithmetic.
    - **`QF_LRA`**: Quantifier-Free Linear Real Arithmetic.
    - **`QF_A`**: Quantifier-Free Formulas over Arrays.
    - **`AUFLIA`**: Arrays, Uninterpreted Functions, and Linear Integer Arithmetic.
2.  **Declare Symbols**: Define your constants and functions.
3.  **Assert**: State your constraints or the negation of what you want to prove.
4.  **Check-Sat**: Ask the solver: "Is there any assignment that makes all assertions true?"
5.  **Get-Model**: If the answer is `sat`, ask for a concrete example.

---

## Satisfiability vs. Validity

In SMT, the primary operation is `(check-sat)`. However, in verification, we often want to know if a formula $F$ is **valid** (true in all models).

> **Theorem**: A formula $F$ is **valid** if and only if its negation $\neg F$ is **unsatisfiable**.

To prove that $F$ is valid, we:

1.  Assert the **negation** `(not F)`.
2.  Run `(check-sat)`.
3.  If the result is **`unsat`**, then $F$ is **valid**.
4.  If the result is **`sat`**, then $F$ is **invalid**, and the model provided by the solver is a **counterexample**.

### Example: Checking Validity of Contraposition

We want to check if $(P \Rightarrow Q) \Rightarrow (\neg Q \Rightarrow \neg P)$ is valid.

```lisp
; 1. Declare variables
(declare-fun P () Bool)
(declare-fun Q () Bool)

; 2. Define the formula F
; F: (=> (=> P Q) (=> (not Q) (not P)))

; 3. Assert the negation (not F)
(assert (not (=> (=> P Q) (=> (not Q) (not P)))))

; 4. Check satisfiability
(check-sat)

; Result should be 'unsat', proving the original formula is valid.
```

---

## Important SMT Logics

![[pictures/programverification/05/Lecture05_Pg132_Smt_Lib_Logics.png]]

Solvers use these labels to pick the best algorithm for the job:

- **QF_LIA**: Most common for software (integers, addition, comparisons).
- **QF_A**: Used for programs with arrays or memory.
- **UFLIA**: Adds "Uninterpreted Functions," which allows the solver to reason about function calls it doesn't have a definition for (relying only on congruence).

### 🧠 Deep Dive: Integer Division in SMT

SMT solvers support integer division `div`, but it comes with **pitfalls**:

- **Division by Zero**: Most solvers (like Z3) define `(div y 0)` to be some fixed but unspecified value. This means `(= (div y 0) (div y 0))` is `true`, even though it looks like an error!
- **Non-Linearity**: If both `y` and `z` are variables, `(div y z)` makes the formula non-linear, which is **undecidable** in general.

```lisp
(declare-fun x () Int)
(declare-fun y () Int)
(declare-fun z () Int)
(assert (= x (div y z))) ; Dangerous if z is a variable!
(check-sat)
```

---

## Summary

1.  **SMT-LIB** is the standard interface for talking to solvers.
2.  Uses **Prefix Notation** (S-expressions).
3.  **Scripts** follow a Declare $\to$ Assert $\to$ Check pattern.
4.  **Sorted Logic** ensures that we don't accidentally add a Boolean to an Integer.
5.  **Logics** define the specific subset of FOL and theories being used.

## Self-Check

1. Translate $x + y = 10 \wedge x \ge 0$ into SMT-LIB prefix notation.

> [!success]- Answer
> `(and (= (+ x y) 10) (>= x 0))`. Each operator comes before its operands, and conjunctions wrap the two atoms with `and`.

2. How do you use `(check-sat)` to prove that a formula $F$ is valid?

> [!success]- Answer
> Assert the negation `(assert (not F))` and call `(check-sat)`. If the solver replies `unsat`, the negation has no model, so $F$ is valid. If it replies `sat`, the returned model is a concrete counterexample to $F$.

3. What logic label would you choose for verifying a program that manipulates integer counters and array indices, and why?

> [!success]- Answer
> `AUFLIA`: Arrays, Uninterpreted Functions, and Linear Integer Arithmetic. It includes the array theory you need for indexed memory, uninterpreted functions for code you do not unfold, and linear integer arithmetic for the counter math. `QF_LIA` alone would not let you reason about arrays; `QF_A` alone would not handle the integer arithmetic.

4. Why is `(div y z)` dangerous when `z` is a variable?

> [!success]- Answer
> Two issues. First, integer division by a variable makes the formula non-linear, and non-linear integer arithmetic is undecidable in general, so the solver may time out or give up. Second, division by zero is implementation-defined: Z3 picks some fixed but unspecified value, so `(div y 0)` does not raise an error but produces a value the formula then reasons about as if it were real, which can hide real bugs.

5. List the four main SMT-LIB commands in the order a typical script uses them.

> [!success]- Answer
> `define-fun` (or `declare-fun`) to introduce symbols, `assert` to state the constraints, `check-sat` to ask whether they are jointly satisfiable, and `get-model` to retrieve a concrete satisfying assignment when the answer is `sat`. The lifecycle is declare, assert, check, model.

---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/04-first-order-theories|Previous: (y-04) First-Order Theories]] | [[/notes/lectures/programverification/06-boogie-and-boostan|Next: (y-06) Boogie and Boostan]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
