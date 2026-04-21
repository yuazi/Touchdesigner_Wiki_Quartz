---
title: "L04 — First-Order Theories"
tags:
  - program-verification
  - first-order-logic
  - theories
  - equality
  - arithmetic
date: 2026-04-16
---

[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[/notes/programverification/05-smt-lib|Next: (y-05) SMT-LIB]]

## Mental Model for First-Order Theories
![[pictures/programverification/04/Lecture04_Pg082_Mental_Model_For_First_Order_Theories.png]]


- **Pure FOL** is too broad. It doesn't know that $1+1=2$ or that $a=b \wedge b=c \to a=c$ unless we tell it.
- A **Theory ($T$)** constrains the meaning of symbols (like $=, +, \le$) using a specific **Signature** and a set of **Axioms**.
- Instead of checking if a formula is "valid in all models," we check if it is **$T$-valid** (valid in all models that obey the theory's rules).
- This is how we bridge the gap between abstract logic and actual program variables (integers, arrays, bits).

## What is a First-Order Theory?
![[pictures/programverification/04/Lecture04_Pg082_What_Is_A_First_Order_Theory.png]]


A theory $T$ consists of:
1.  **Signature ($\Sigma$)**: The set of allowed symbols (constants, functions, predicates).
2.  **Axioms ($\mathcal{A}_T$)**: A set of closed formulas that define how those symbols behave.

### 🧠 Deep Dive: The Rock-Paper-Scissors Theory ($T_{RPS}$)
![[pictures/programverification/04/Lecture04_Pg090_Deep_Dive_The_Rock_Paper_Scissors.png]]

Imagine a theory for the game Rock-Paper-Scissors.
- **Signature**: $\{R, P, S, beat, =\}$
- **Axioms**:
  1.  $\forall x. x=R \vee x=P \vee x=S$ (Only three moves exist)
  2.  $R \ne P \wedge P \ne S \wedge S \ne R$ (Moves are distinct)
  3.  $beat(P, R) \wedge beat(R, S) \wedge beat(S, P)$ (Winning rules)
  4.  $\forall x, y. beat(x, y) \to \neg beat(y, x)$ (Asymmetry)
  5.  ... (and so on, totaling about 10 axioms to fully define the game).

---

## Theory of Equality ($T_E$)

Equality is the most fundamental theory. Even if a solver knows nothing else, it usually knows how $=$ works.

### Axioms of $T_E$
1.  **Reflexivity**: $\forall x. x = x$
2.  **Symmetry**: $\forall x, y. x = y \to y = x$
3.  **Transitivity**: $\forall x, y, z. (x = y \wedge y = z) \to x = z$
4.  **Function Congruence**: $\forall \bar{x}, \bar{y}. (\bigwedge_i x_i = y_i) \to f(\bar{x}) = f(\bar{y})$
5.  **Predicate Congruence**: $\forall \bar{x}, \bar{y}. (\bigwedge_i x_i = y_i) \to (p(\bar{x}) \leftrightarrow p(\bar{y}))$

### 🧠 Deep Dive: Axiom Schemata
![[pictures/programverification/04/Lecture04_Pg087_Deep_Dive_Axiom_Schemata.png]]

Axioms like **Function Congruence** are actually **Axiom Schemata**. This means they represent an infinite set of axioms, one for every possible function $f$.
For a binary function $f_2(x, y)$, the specific axiom is:
$$\forall x_1, x_2, y_1, y_2. (x_1 = y_1 \wedge x_2 = y_2) \to f_2(x_1, x_2) = f_2(y_1, y_2)$$

### 💡 Intuition: Congruence
Congruence means that functions and predicates are "well-behaved." If two inputs are identical, the output must be identical. This allows a verifier to substitute $b$ for $a$ if it knows $a=b$.

---

## Natural Numbers and Integers
![[pictures/programverification/04/Lecture04_Pg096_Natural_Numbers_And_Integers.png]]


We distinguish between several theories of arithmetic depending on whether they allow multiplication and which domain they cover.

### Peano Arithmetic ($T_{PA}$)
![[pictures/programverification/04/Lecture04_Pg096_Peano_Arithmetic_T_Pa.png]]


This is the theory of **Natural Numbers** ($\mathbb{N}$) with addition and multiplication.

- **Signature**: $\{0, 1, +, \cdot, =\}$
- **Key Axioms**:
  1.  **Zero**: $\forall x. \neg(x + 1 = 0)$
  2.  **Successor**: $\forall x, y. x + 1 = y + 1 \to x = y$
  3.  **Induction Schema**: $\phi[0] \wedge (\forall x. \phi[x] \to \phi[x + 1]) \to \forall x. \phi[x]$
  4.  **Plus Zero**: $\forall x. x + 0 = x$
  5.  **Plus Successor**: $\forall x, y. x + (y + 1) = (x + y) + 1$
  6.  **Times Zero**: $\forall x. x \cdot 0 = 0$
  7.  **Times Successor**: $\forall x, y. x \cdot (y + 1) = x \cdot y + x$

### Expressiveness of $T_{PA}$
$T_{PA}$ is incredibly powerful and can express almost all of mathematics:
- **Pythagorean Theorem**: $\forall a, b, c. a^2 + b^2 = c^2 \leftrightarrow \dots$ (where $x^2$ is $x \cdot x$).
- **Fermat's Last Theorem**: $\forall n. n > 2 \to \neg \exists a, b, c. a > 0 \wedge b > 0 \wedge c > 0 \wedge a^n + b^n = c^n$ (Note: exponentiation $a^n$ must be encoded using Gödel's $\beta$-function since it's not in the signature).

### ⚠️ Gödel's First Incompleteness Theorem
In any consistent formal theory $T$ that is "sufficiently strong" (like $T_{PA}$), there are statements that are **true** but **unprovable** within $T$. This means no computer program can ever perfectly verify every true property of software that uses full integer multiplication.

### Presburger Arithmetic ($T_N$)
![[pictures/programverification/04/Lecture04_Pg101_Presburger_Arithmetic_T_N.png]]

Presburger Arithmetic is the fragment of $T_{PA}$ that **excludes multiplication**. 
- **Signature**: $\{0, 1, +, =\}$
- **Decidability**: Unlike $T_{PA}$, Presburger Arithmetic **is decidable**. This makes it the "sweet spot" for many automated verification tools.

### Theory of Integers ($T_Z$)
![[pictures/programverification/04/Lecture04_Pg254_Theory_Of_Integers_T_Z.png]]

The Theory of Integers (or Linear Integer Arithmetic) covers $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$.
- **Signature**: $\{\dots, -1, 0, 1, \dots, +, -, <, =\}$
- **Expressiveness**: $T_Z$ and $T_N$ have the same expressiveness (every $T_Z$ formula can be transformed into an equisatisfiable $T_N$ formula).

### ⚠️ Warning: Undecidability
- **Peano Arithmetic** is **undecidable**. There is no algorithm that can tell you if any arbitrary statement about integers (with multiplication) is true.
- The quantifier-free fragment of $T_{PA}$ is also undecidable (Matiyasevich's Theorem).
- Verification tools usually stick to **Linear Arithmetic** (no $x \cdot y$ where both are variables) to remain decidable.

---

## Other Important Theories

| Theory | Signature | Use Case |
|---|---|---|
| **Integers ($T_\mathbb{Z}$)** | $\{0, 1, +, -, <, =\}$ | Standard loop counters and array indices. |
| **Reals ($T_\mathbb{R}$)** | $\{0, 1, +, \cdot, <, =\}$ | Physical systems and scientific computing. |
| **Arrays ($T_A$)** | $\{\text{read}, \text{write}, =\}$ | Modeling memory and data structures. |

### The Array Axioms (Select)
![[pictures/programverification/04/Lecture04_Pg113_The_Array_Axioms_Select.png]]

- **Read-over-Write**: $\text{read}(\text{write}(a, i, v), i) = v$. (If you write $v$ to index $i$ and then read from $i$, you get $v$).
- **Independence**: If $i \ne j$, then $\text{read}(\text{write}(a, i, v), j) = \text{read}(a, j)$.

---

## $T$-Validity and $T$-Satisfiability
![[pictures/programverification/04/Lecture04_Pg083_T_Validity_And_T_Satisfiability.png]]


- **$T$-Satisfiable**: There exists a model that obeys all axioms of $T$ and makes the formula true.
- **$T$-Valid**: The formula is true in *every* model that obeys the axioms of $T$.

In program verification, we usually care about **$T$-Satisfiability**. If a "bad state" (like an assertion failure) is $T$-satisfiable, it means there is a real execution that leads to a bug.

---

## Summary

1.  **Theories** give specific meaning to symbols (e.g., how $+$ or \`read\` behave).
2.  **$T_E$ (Equality)** provides the foundation for all reasoning.
3.  **Arithmetic theories** range from easy (Presburger) to impossible (Peano).
4.  **Array theory** allows us to model computer memory.
5.  Verification tools combine these theories to reason about complex code.

---
[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/03-first-order-logic|Previous: (y-03) First-Order Logic]] | [[/notes/programverification/05-smt-lib|Next: (y-05) SMT-LIB]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
