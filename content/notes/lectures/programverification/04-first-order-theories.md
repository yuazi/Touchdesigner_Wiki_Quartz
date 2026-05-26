---
title: "L04 - First-Order Theories"
tags:
  - program-verification
  - first-order-logic
  - theories
  - equality
  - arithmetic
date: 2026-04-16
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[/notes/lectures/programverification/05-smt-lib|Next: (y-05) SMT-LIB]]

## Mental Model for First-Order Theories

- **Pure FOL** is too broad. It doesn't know that $1+1=2$ or that $a=b \wedge b=c \to a=c$ unless we tell it.
- A **Theory ($T$)** constrains the meaning of symbols (like $=, +, \le$) using a specific **Signature** and a set of **Axioms**.
- Instead of checking if a formula is "valid in all models," we check if it is **$T$-valid** (valid in all models that obey the theory's rules).
- This is how we bridge the gap between abstract logic and actual program variables (integers, arrays, bits).

## What is a First-Order Theory?

A **Theory ($T$)** constrains the meaning of symbols (like $=, +, \le, \text{read}$) using a specific **Signature** and a set of **Axioms**. This allows us to bridge the gap between abstract logic and actual program variables.

### Formal Definition

![[pictures/programverification/04/Lecture04_Pg083_First_Order_Theories_Definition.png]]

A first-order theory $T$ consists of:

1.  **Signature ($\Sigma$)**: A set of constant, function, and predicate symbols.
2.  **Axioms ($\mathcal{A}_T$)**: A set of closed $\Sigma$-formulas.

### $T$-Models and $T$-Validity

![[pictures/programverification/04/Lecture04_Pg084_T_Validity_And_T_Satisfiability.png]]

- **$T$-Model**: A model $M$ is a $T$-model if it satisfies all axioms in $\mathcal{A}_T$.
- **$T$-Satisfiable**: A formula $\phi$ is $T$-satisfiable if there exists a **$T$-model** $M$ such that $M \models \phi$.
- **$T$-Valid**: A formula $\phi$ is $T$-valid (denoted $T \models \phi$) if every $T$-model satisfies $\phi$.
- **$T$-Equivalent**: $\phi_1$ and $\phi_2$ are $T$-equivalent if $\phi_1 \leftrightarrow \phi_2$ is $T$-valid.

---

## Example: Rock-Paper-Scissors Theory ($T_{RPS}$)

![[pictures/programverification/04/Lecture04_Pg091_Rock_Paper_Scissors_Theory.png]]

To define the game Rock-Paper-Scissors, we need a specific theory.

- **Signature**: $\{R, P, S, \text{beat}/2, =/2\}$
- **Axioms**:
  1.  $\text{beat}(P, R)$
  2.  $\text{beat}(R, S)$
  3.  $\text{beat}(S, P)$
  4.  $\neg \text{beat}(R, R)$
  5.  $\neg \text{beat}(R, P)$
  6.  $\neg \text{beat}(S, S)$
  7.  $\neg \text{beat}(S, R)$
  8.  $\neg \text{beat}(P, P)$
  9.  $\neg \text{beat}(P, S)$
  10. $\forall x. x=R \vee x=P \vee x=S$ (Domain is restricted to these three)

### 🧠 Deep Dive: Reasoning in $T_{RPS}$

Is the formula $\neg \exists x. \forall y. \text{beat}(x, y)$ (no move wins against all others) $T$-valid?

- **Yes**. Because move $x$ would have to beat $R, P$, and $S$. But axioms 4, 6, and 8 state that no move beats itself.
  Is the formula $\forall x. \exists y. \text{beat}(x, y)$ (every move has something it beats) $T$-valid?
- **Yes**. $R$ beats $S$, $P$ beats $R$, and $S$ beats $P$.

---

## Theory of Equality ($T_E$)

![[pictures/programverification/04/Lecture04_Pg087_Theory_Of_Equality_T_E.png]]

$T_E$ is the foundation of most SMT reasoning. Its signature includes $=/2$ and all other constant/function/predicate symbols.

### Axioms

1.  **Reflexivity**: $\forall x. x = x$
2.  **Symmetry**: $\forall x, y. x = y \to y = x$
3.  **Transitivity**: $\forall x, y, z. (x = y \wedge y = z) \to x = z$
4.  **Function Congruence**: For each $n$-ary $f$, $\forall \bar{x}, \bar{y}. (\bigwedge_i x_i = y_i) \to f(\bar{x}) = f(\bar{y})$
5.  **Predicate Congruence**: For each $n$-ary $p$, $\forall \bar{x}, \bar{y}. (\bigwedge_i x_i = y_i) \to (p(\bar{x}) \leftrightarrow p(\bar{y}))$

### 🧠 Deep Dive: Axiom Schemata

![[pictures/programverification/04/Lecture04_Pg088_Axiom_Schemata.png]]

Axioms like **Function Congruence** are actually **Axiom Schemata**. Since a signature can have infinitely many functions, we cannot list every axiom. Instead, we provide a "template."
For a binary function $f(x, y)$, the schema generates:
$$\forall x_1, x_2, y_1, y_2. (x_1 = y_1 \wedge x_2 = y_2) \to f(x_1, x_2) = f(y_1, y_2)$$

---

## Arithmetic Theories

### 1. Peano Arithmetic ($T_{PA}$)

![[pictures/programverification/04/Lecture04_Pg098_Peano_Arithmetic_T_Pa.png]]

Theory of **Natural Numbers** ($\mathbb{N}$) with addition and multiplication.

- **Signature**: $\{0, 1, +, \cdot, =\}$
- **Axioms**: Successor rules, Plus/Times rules, and the **Induction Schema**:
  $$\phi[0] \wedge (\forall x. \phi[x] \to \phi[x + 1]) \to \forall x. \phi[x]$$

### 🧠 Deep Dive: Expressiveness of $T_{PA}$

$T_{PA}$ can express almost all of mathematics. Even exponentiation $x^n$, which is not in the signature, can be encoded using a complex formula $\text{EXP}(x, n, r)$.

- **Gödel showed** that for every recursive function $f$, there is a $\Sigma_{PA}$ formula $\phi$ such that $\phi(\bar{x}, r) \leftrightarrow r = f(\bar{x})$.
- This high expressiveness comes at a price: **$T_{PA}$ is undecidable**.

### 2. Presburger Arithmetic ($T_N$)

![[pictures/programverification/04/Lecture04_Pg102_Presburger_Arithmetic_T_N.png]]

Natural numbers with **addition only** (no multiplication).

- **Signature**: $\{0, 1, +, =\}$
- **Decidability**: $T_N$ is **decidable**. It is the most common theory for loop bounds and simple offsets.

### 3. Theory of Integers ($T_Z$)

![[pictures/programverification/04/Lecture04_Pg103_Theory_Of_Integers_T_Z.png]]

Integers ($\mathbb{Z}$) with $\{+, -, <, =\}$.

### 🧠 Deep Dive: Transforming $T_Z$ to $T_N$

To decide $T_Z$-validity for a formula $\phi$, we transform its negation $\neg \phi$ into an equisatisfiable $T_N$ formula:

1.  Replace every integer variable $x$ with $x_p - x_n$ (where $x_p, x_n$ are natural numbers).
2.  Eliminate subtraction by moving terms to the other side of $=$ or $>$.
3.  Replace $a > b$ with $\exists u. \neg(u=0) \wedge a = b + u$.
    If the resulting $T_N$ formula is unsatisfiable, then $\phi$ is $T_Z$-valid.

---

## Theory of Arrays ($T_A$)

![[pictures/programverification/04/Lecture04_Pg114_Theory_Of_Arrays_T_A.png]]

Used to model computer memory and data structures. Unlike functions in FOL, arrays are "first-class objects" that can be modified.

- **Signature**: $\{\text{select}, \text{store}, =\}$
- **Axioms**:
  1.  **Reflexivity, Symmetry, Transitivity** of $=$.
  2.  **Array Congruence**: $\forall a, i, j. i = j \to \text{select}(a, i) = \text{select}(a, j)$
  3.  **Read-over-Write 1**: $\forall a, v, i, j. i = j \to \text{select}(\text{store}(a, i, v), j) = v$
  4.  **Read-over-Write 2**: $\forall a, v, i, j. i \ne j \to \text{select}(\text{store}(a, i, v), j) = \text{select}(a, j)$
  5.  **Extensionality**: $\forall a, b. (\forall i. \text{select}(a, i) = \text{select}(b, i)) \leftrightarrow a = b$
      - _Intuition_: Two arrays are equal if and only if they have the same values at every index.

### 💡 Application: Modeling Memory

In a verifier, a pointer `*ptr` is modeled as `select(mem, ptr)`, and an assignment `*ptr = v` becomes `mem' = store(mem, ptr, v)`.

---

## Summary of Decidability

![[pictures/programverification/03/Lecture03_Pg093_Decidability.png]]

| Logic / Theory                    | Satisfiability                 | Validity       |
| :-------------------------------- | :----------------------------- | :------------- |
| **Propositional Logic (PL)**      | Decidable                      | Decidable      |
| **First-Order Logic (FOL)**       | Undecidable                    | Semi-decidable |
| **Theory of Equality ($T_E$)**    | Undecidable (Decidable for QF) | Undecidable    |
| **Presburger Arithmetic ($T_N$)** | Decidable                      | Decidable      |
| **Peano Arithmetic ($T_{PA}$)**   | Undecidable                    | Undecidable    |

In program verification, we usually care about **$T$-Satisfiability**. If a "bad state" (like an assertion failure) is $T$-satisfiable, it means there is a real execution that leads to a bug.

---

## Summary

1.  **Theories** give specific meaning to symbols (e.g., how $+$ or \`read\` behave).
2.  **$T_E$ (Equality)** provides the foundation for all reasoning.
3.  **Arithmetic theories** range from easy (Presburger) to impossible (Peano).
4.  **Array theory** allows us to model computer memory.
5.  Verification tools combine these theories to reason about complex code.

## Self-Check

1. What two components define a first-order theory $T$, and what does $T$-validity mean?

> [!success]- Answer
> A theory is a pair $(\Sigma, \mathcal{A}_T)$: a signature of constant, function, and predicate symbols and a set of closed axioms over that signature. A formula $\phi$ is $T$-valid if every $T$-model (every model that satisfies all axioms in $\mathcal{A}_T$) also satisfies $\phi$.

2. What are the five axioms of the theory of equality $T_E$?

> [!success]- Answer
> Reflexivity ($\forall x. x = x$), symmetry, transitivity, function congruence (equal arguments yield equal results for every $f$), and predicate congruence (equal arguments yield equivalent atoms for every $p$). Function and predicate congruence are axiom schemata because the signature can contain infinitely many symbols.

3. Why is Presburger arithmetic $T_N$ decidable while Peano arithmetic $T_{PA}$ is not?

> [!success]- Answer
> $T_N$ has only addition over the naturals; the resulting structure has elimination procedures (quantifier elimination via Cooper's algorithm) that decide both satisfiability and validity. $T_{PA}$ adds multiplication, which is enough to encode any recursive function (Gödel), so it can express the halting problem and becomes undecidable. The difference is multiplication.

4. State the two read-over-write axioms of $T_A$ and what they say in plain English.

> [!success]- Answer
> $\forall a, v, i, j. i = j \to \text{select}(\text{store}(a, i, v), j) = v$ says reading at the index you just wrote returns the written value. $\forall a, v, i, j. i \ne j \to \text{select}(\text{store}(a, i, v), j) = \text{select}(a, j)$ says reading at a different index returns the original array's value. Together with extensionality they capture how arrays behave.

5. Why does verification usually care about $T$-satisfiability of "bad states" rather than validity?

> [!success]- Answer
> If the formula expressing "some execution reaches a bad state" is $T$-satisfiable, there is an actual execution (a $T$-model) that exhibits the bug; the satisfying model is the counterexample. Verification is therefore typically framed as showing that the negation (no bad execution exists) is $T$-valid, equivalently the bad-state formula is $T$-unsatisfiable.

---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[/notes/lectures/programverification/05-smt-lib|Next: (y-05) SMT-LIB]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
