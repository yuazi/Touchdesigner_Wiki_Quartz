---
title: "L03 — First-Order Logic"
tags:
  - program-verification
  - first-order-logic
  - logic
  - formal-methods
date: 2026-04-14
---

[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[/notes/programverification/04-first-order-theories|Next: (y-04) First-Order Theories]]

## Mental Model for First-Order Logic

- **First-Order Logic (FOL)** is Propositional Logic + **Objects, Functions, and Relations**. It allows us to talk about "all elements" ($\forall$) or "some elements" ($\exists$).
- **Syntax**: We build **Terms** (representing objects) and **Formulas** (representing truth).
- **Semantics**: A formula is only true or false relative to a **Model** (a universe of objects and a mapping of symbols to meanings).
- **Substitution**: The "engine" of reasoning in FOL. To prove something about "all $x$", we often substitute $x$ with a specific term $t$.

## Introduction to First-Order Logic

While Propositional Logic is powerful, it can't easily express statements about objects and their properties. **First-Order Logic (FOL)**, also known as **Predicate Logic**, adds the machinery needed to formalize math and complex program states.

### 🧠 Deep Dive: Famous Theorems in FOL
These examples show how FOL can formalize complex mathematical statements.
![[pictures/programverification/03/Lecture03_Pg058_Deep_Dive_Famous_Theorems_In_Fol.png]]

1.  **Triangle Inequality**: The length of one side of a triangle is less than the sum of the lengths of the other two sides.
    $$\forall x, y, z. \text{triangle}(x, y, z) \to \text{length}(x) < \text{length}(y) + \text{length}(z)$$
2.  **Fermat's Last Theorem**: For any integer $n > 2$, no three positive integers $a, b, c$ satisfy $a^n + b^n = c^n$.
    $$\forall n. (\text{integer}(n) \wedge n > 2) \to \forall a, b, c. (\text{integer}(a) \wedge \text{integer}(b) \wedge \text{integer}(c) \wedge a > 0 \wedge b > 0 \wedge c > 0) \to a^n + b^n \neq c^n$$
3.  **Pumping Lemma (for Regular Languages)**:
    $$\forall L. \text{regular}(L) \to \exists n. \forall z. (z \in L \wedge |z| \ge n \to \exists u, v, w. (z = uvw \wedge |v| \ge 1 \wedge |uv| \le n \wedge \forall i \ge 0. uv^iw \in L))$$

---

## Syntax: Terms and Formulas

In FOL, we distinguish between **Terms** (representing values/objects) and **Formulas** (representing truth values).

### 1. The Vocabulary (Signature)
A vocabulary $\mathcal{V}$ is a tuple $(V_{Var}, V_{Const}, V_{Fun}, V_{Pred})$:
- **Variables ($V_{Var}$)**: A countable set $\{x, y, z, \dots\}$.
- **Constants ($V_{Const}$)**: A countable set $\{c_1, c_2, \dots\}$.
- **Function Symbols ($V_{Fun}$)**: Each with an **arity** $n \ge 1$ (e.g., $f/1, +/2$).
- **Predicate Symbols ($V_{Pred}$)**: Each with an **arity** $n \ge 0$ (e.g., $p/1, \le/2$). Arity 0 predicates are like propositional variables.

### 2. Terms
Terms are the "nouns" of the language. They are defined inductively:
1. Every variable $x \in V_{Var}$ is a term.
2. Every constant $c \in V_{Const}$ is a term.
3. If $t_1, \dots, t_n$ are terms and $f \in V_{Fun}$ has arity $n$, then $f(t_1, \dots, t_n)$ is a term.

### 3. Formulas
Formulas are the "sentences". They are defined inductively:
1. `false` is a formula.
2. **Atoms**: If $t_1, \dots, t_n$ are terms and $p \in V_{Pred}$ has arity $n$, then $p(t_1, \dots, t_n)$ is a formula.
3. **Connectives**: If $\phi$ and $\psi$ are formulas, then $\neg \phi, (\phi \wedge \psi), (\phi \vee \psi), (\phi \to \psi)$ are formulas.
4. **Quantifiers**: If $\phi$ is a formula and $x \in V_{Var}$, then $\exists x. \phi$ and $\forall x. \phi$ are formulas.
   - *Abbreviation*: $\forall x. \phi := \neg \exists x. \neg \phi$.

---

## Semantics: Models and Interpretations

A formula is assigned a truth value relative to a **Model** $M = (D, I)$ and a **Variable Assignment** $\rho$.

- **Interpretation Domain ($D$)**: A non-empty set of objects.
- **Interpretation Function ($I$)**:
  - For $c \in V_{Const}$, $I(c) \in D$.
  - For $f \in V_{Fun}$ of arity $n$, $I(f): D^n \to D$.
  - For $p \in V_{Pred}$ of arity $n$, $I(p) \subseteq D^n$ (a relation).
- **Variable Assignment ($\rho$)**: A mapping $\rho: V_{Var} \to D$.
  - **Notation**: $\rho[x \mapsto d]$ denotes a mapping that is the same as $\rho$ except it maps $x$ to $d$.

### Evaluation of Terms $[[t]]_{M,\rho}$
1. $[[x]]_{M,\rho} = \rho(x)$
2. $[[c]]_{M,\rho} = I(c)$
3. $[[f(t_1, \dots, t_n)]]_{M,\rho} = I(f)([[t_1]]_{M,\rho}, \dots, [[t_n]]_{M,\rho})$

### Evaluation of Formulas $[[\phi]]_{M,\rho}$
1. $[[false]]_{M,\rho} = \text{false}$
2. $[[p(t_1, \dots, t_n)]]_{M,\rho} = \text{true}$ iff $([[t_1]]_{M,\rho}, \dots, [[t_n]]_{M,\rho}) \in I(p)$
3. $[[\neg \phi]]_{M,\rho} = \text{true}$ iff $[[\phi]]_{M,\rho} = \text{false}$
4. $[[\phi_1 \wedge \phi_2]]_{M,\rho} = \text{true}$ iff $[[\phi_1]]_{M,\rho} = \text{true}$ and $[[\phi_2]]_{M,\rho} = \text{true}$
5. $[[\exists x. \phi]]_{M,\rho} = \text{true}$ iff there exists $d \in D$ such that $[[\phi]]_{M,\rho[x \mapsto d]} = \text{true}$

---

## Free vs. Bound Variables

- **Free Variables (`freevars`)**: The variables not captured by a quantifier.
  - `freevars(x) = {x}`, `freevars(c) = ∅`
  - `freevars(p(t1, ..., tn)) = freevars(t1) ∪ ... ∪ freevars(tn)`
  - `freevars(∃x. φ) = freevars(φ) \ {x}`
- **Bound Variable**: A variable $x$ in the scope of $\forall x$ or $\exists x$.
- **Closed Formula (Sentence)**: A formula where `freevars(φ) = ∅`. Its truth value is independent of the variable assignment $\rho$.

---

## Substitution and Variable Capture

**Substitution** $\phi[x \mapsto t]$ means replacing every **free** occurrence of $x$ in $\phi$ with the term $t$. To avoid **Variable Capture**, we must ensure that no variable in $t$ becomes bound after substitution.

**Formal Definition ($\psi\sigma$)**:
If $\psi = \exists x. \phi$ and we apply substitution $\sigma$:
1. If $x \notin vars(\sigma)$, then $(\exists x. \phi)\sigma = \exists x. (\phi\sigma)$.
2. If $x \in vars(\sigma)$, we must **rename** $x$ to a fresh variable $x'$:
   $(\exists x. \phi)\sigma = \exists x'. (\phi[x \mapsto x'])\sigma$

---

## NFOL: Natural Deduction for FOL

NFOL extends Natural Deduction for Propositional Logic (NPL) with rules for quantifiers.

| Rule | Intro/Elim | Formula | Side Condition |
| :--- | :--- | :--- | :--- |
| **($I\forall$)** | Intro $\forall$ | $\frac{\Gamma \vdash \phi[x \mapsto y]}{\Gamma \vdash \forall x.\phi}$ | (a) $y \notin freevars(\Gamma)$ and (b) ($x=y$ or $y \notin freevars(\phi)$) |
| **($E\forall$)** | Elim $\forall$ | $\frac{\Gamma \vdash \forall x.\phi}{\Gamma \vdash \phi[x \mapsto t]}$ | None |
| **($I\exists$)** | Intro $\exists$ | $\frac{\Gamma \vdash \phi[x \mapsto t]}{\Gamma \vdash \exists x.\phi}$ | None |
| **($E\exists$)** | Elim $\exists$ | $\frac{\Gamma \vdash \exists x.\phi \quad \Gamma \cup \{\phi[x \mapsto y]\} \vdash \psi}{\Gamma \vdash \psi}$ | (a) $y \notin freevars(\Gamma \cup \{\psi\})$ and (b) ($x=y$ or $y \notin freevars(\phi)$) |

### 💡 Why the Side Conditions?
The condition "$y \notin freevars(\Gamma)$" in $(I\forall)$ ensures that $y$ is an **arbitrary** element. If we knew something specific about $y$ (i.e., it was in $\Gamma$), we couldn't generalize it to "all $x$".

---

## Decidability
- **Satisfiability in FOL** is **undecidable** (Church-Turing Theorem).
- **Validity in FOL** is **semi-decidable** (we can enumerate proofs, but if a formula is invalid, we might never find out).

### Example: A Derivation in NFOL
![[pictures/programverification/03/Lecture03_Pg474_Example_A_Derivation_In_Nfol.png]]

**Goal**: Prove $\{\forall x,y,z. p(x,y) \wedge p(y,z) \to p(x,z), \forall x,y. p(x,y) \to p(y,x)\} \vdash p(a,b) \wedge p(b,c) \to p(c,a)$.

Let $\Gamma = \{\forall x,y,z. p(x,y) \wedge p(y,z) \to p(x,z), \forall x,y. p(x,y) \to p(y,x)\}$.

1.  **Bottom-up**: $\Gamma \vdash p(a,b) \wedge p(b,c) \to p(c,a)$.
2.  Use **($I\to$)**: $\Gamma \cup \{p(a,b) \wedge p(b,c)\} \vdash p(c,a)$. Let $\Gamma' = \Gamma \cup \{p(a,b) \wedge p(b,c)\}$.
3.  Use **($E\forall$)** on transitivity in $\Gamma'$ with $x \mapsto a, y \mapsto b, z \mapsto c$: $\Gamma' \vdash p(a,b) \wedge p(b,c) \to p(a,c)$.
4.  Use **($E\wedge_1$)** and **($E\wedge_2$)** on $\Gamma'$ to get $p(a,b)$ and $p(b,c)$.
5.  Use **($I\wedge$)** on these to get $\Gamma' \vdash p(a,b) \wedge p(b,c)$.
6.  Use **($E\to$)** with steps 3 and 5 to get $\Gamma' \vdash p(a,c)$.
7.  Use **($E\forall$)** on symmetry in $\Gamma'$ with $x \mapsto a, y \mapsto c$: $\Gamma' \vdash p(a,c) \to p(c,a)$.
8.  Use **($E\to$)** with steps 6 and 7 to get $\Gamma' \vdash p(c,a)$. **QED**.

---

## Summary

1.  **FOL** = Propositional Logic + Quantifiers + Functions/Predicates.
2.  **Terms** represent objects; **Formulas** represent truth.
3.  **Models** give meaning to symbols.
4.  **Decidability**: Satisfiability in FOL is **undecidable**, but Validity is **semi-decidable**.

---
[[/notes/programverification/index|Back to Program Verification Index]] | [[/notes/programverification/02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[/notes/programverification/04-first-order-theories|Next: (y-04) First-Order Theories]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
