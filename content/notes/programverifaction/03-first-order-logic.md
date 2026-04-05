---
title: "L03 — First-Order Logic"
tags:
  - program-verification
  - first-order-logic
  - logic
  - formal-methods
date: 2026-04-14
---

[[index|Back to Program Verification Index]] | [[02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[04-first-order-theories|Next: (y-04) First-Order Theories]]

## Mental Model for First-Order Logic

- **First-Order Logic (FOL)** is Propositional Logic + **Objects, Functions, and Relations**. It allows us to talk about "all elements" ($\forall$) or "some elements" ($\exists$).
- **Syntax**: We build **Terms** (representing objects) and **Formulas** (representing truth).
- **Semantics**: A formula is only true or false relative to a **Model** (a universe of objects and a mapping of symbols to meanings).
- **Substitution**: The "engine" of reasoning in FOL. To prove something about "all $x$", we often substitute $x$ with a specific term $t$.

## Introduction to First-Order Logic

While Propositional Logic is powerful, it can't easily express statements like "Every integer has a square." FOL adds the machinery needed to formalize math and complex program states.

### 🧠 Deep Dive: Famous Theorems in FOL
![[../../pictures/programverifaction/03/Lecture03_Pg058_Deep_Dive_Famous_Theorems_In_Fol.png]]

- **Triangle Inequality**: $\forall x, y, z. d(x, z) \le d(x, y) + d(y, z)$
- **Fermat's Last Theorem**: $\neg \exists n > 2. \exists a, b, c > 0. a^n + b^n = c^n$
- **Pumping Lemma**: $\forall L. Regular(L) \to \exists p. \forall s \in L. (|s| \ge p \to \exists u, v, w. (s = uvw \wedge |uv| \le p \wedge |v| \ge 1 \wedge \forall i \ge 0. uv^iw \in L))$

---

## Syntax: Terms and Formulas
![[../../pictures/programverifaction/03/Lecture03_Pg135_Syntax_Terms_And_Formulas.png]]


In FOL, we distinguish between things that represent **values** (Terms) and things that represent **truth** (Formulas).

### 1. The Vocabulary (Signature)
A vocabulary $\mathcal{V}$ consists of:
- **Variables**: $x, y, z, \dots$
- **Constants**: $0, 1, a, b, \dots$
- **Functions**: $f(x), +(x, y), \dots$ (each has an **arity**)
- **Predicates**: $p(x), \le(x, y), \dots$ (each has an **arity**)

### 2. Terms
![[../../pictures/programverifaction/03/Lecture03_Pg134_2_Terms.png]]

Terms are the "nouns" of our language.
- Every variable is a term.
- Every constant is a term.
- If $f$ is an $n$-ary function and $t_1, \dots, t_n$ are terms, then $f(t_1, \dots, t_n)$ is a term.

### 3. Formulas
Formulas are the "sentences" that can be true or false.
- `false` is a formula.
- $p(t_1, \dots, t_n)$ is an **atom** (the simplest formula).
- If $\phi$ and $\psi$ are formulas, then $\neg \phi, \phi \wedge \psi, \phi \vee \psi, \phi \to \psi$ are formulas.
- **Quantifiers**: If $\phi$ is a formula, then $\exists x. \phi$ and $\forall x. \phi$ are formulas.

---

## Semantics: Models and Interpretations

A formula doesn't have a truth value until we provide a **Model** $M = (D, I)$:
- **Domain ($D$)**: The set of all objects we are talking about (e.g., all integers, all people).
- **Interpretation ($I$)**: Maps symbols to the domain.
  - Constants $\to$ elements of $D$.
  - Functions $\to$ actual operations on $D$.
  - Predicates $\to$ relations (sets of tuples) over $D$.

### Formal Definition: Variable Assignment
A **Variable Assignment** $\rho: Var \to D$ is a mapping from variables to elements of the domain.

The value of a term $t$ under a model $M$ and assignment $\rho$, denoted $\mathcal{V}_{M,\rho}(t)$, is:
- $x \in Var \implies \rho(x)$
- $c \in Const \implies I(c)$
- $f(t_1, \dots, t_n) \implies I(f)(\mathcal{V}_{M,\rho}(t_1), \dots, \mathcal{V}_{M,\rho}(t_n))$

A formula $\phi$ is **satisfied** by $M$ and $\rho$ ($M, \rho \models \phi$) if:
- $M, \rho \models p(t_1, \dots, t_n)$ iff $(\mathcal{V}_{M,\rho}(t_1), \dots, \mathcal{V}_{M,\rho}(t_n)) \in I(p)$
- $M, \rho \models \forall x. \phi$ iff for all $d \in D$, $M, \rho[x \mapsto d] \models \phi$
- $M, \rho \models \exists x. \phi$ iff there exists $d \in D$ such that $M, \rho[x \mapsto d] \models \phi$

### 💡 Intuition: Truth is Relative
The formula $\forall x. \exists y. y > x$ is **true** if $D$ is the set of integers, but **false** if $D$ is a finite set of people (there is no "taller" person if you are already the tallest).

---

## Free vs. Bound Variables
![[../../pictures/programverifaction/03/Lecture03_Pg067_Free_Vs_Bound_Variables.png]]


- **Bound Variable**: A variable under the scope of a quantifier ($\forall x$ or $\exists x$).
- **Free Variable**: A variable that is NOT bound.
- **Closed Formula (Sentence)**: A formula with no free variables. Its truth value depends *only* on the model, not on any specific variable assignment.

### Proof Rules of NFOL
![[../../pictures/programverifaction/03/Lecture03_Pg072_Proof_Rules_Of_Nfol.png]]

NFOL includes all rules from NPL, plus four rules for quantifiers.

| Rule | Name | Formula | Side Condition |
| :--- | :--- | :--- | :--- |
| **Intro $\forall$** | ($I\forall$) | $\frac{\Gamma \vdash \phi[x \mapsto y]}{\Gamma \vdash \forall x.\phi}$ | $y \notin freevars(\Gamma)$ and ($x=y$ or $y \notin freevars(\phi)$) |
| **Elim $\forall$** | ($E\forall$) | $\frac{\Gamma \vdash \forall x.\phi}{\Gamma \vdash \phi[x \mapsto t]}$ | None |
| **Intro $\exists$** | ($I\exists$) | $\frac{\Gamma \vdash \phi[x \mapsto t]}{\Gamma \vdash \exists x.\phi}$ | None |
| **Elim $\exists$** | ($E\exists$) | $\frac{\Gamma \vdash \exists x.\phi \quad \Gamma \cup \{\phi[x \mapsto y]\} \vdash \psi}{\Gamma \vdash \psi}$ | $y \notin freevars(\Gamma \cup \{\psi\})$ and ($x=y$ or $y \notin freevars(\phi)$) |

---

## 🧠 Deep Dive: Substitution and Free Variables
Substitution is more than just "search and replace." We must avoid **Variable Capture**.

- **Free Variables**: Variables that are not under the scope of any quantifier.
    - Example: In $\exists x. p(x, y)$, $x$ is **bound**, but $y$ is **free**.
- **Substitution $\phi[x \mapsto t]$**: Replace all free occurrences of $x$ with $t$.
- **Variable Capture**: If $t$ contains a variable $y$, and you substitute $x \mapsto t$ inside $\forall y. \dots$, the $y$ in $t$ is suddenly bound!
    - **Rule**: If $x$ is inside the scope of a quantifier for a variable $y$ that appears in $t$, you must first **rename** the bound $y$ to a "fresh" $z$.

### Example: A Derivation in NFOL
![[../../pictures/programverifaction/03/Lecture03_Pg474_Example_A_Derivation_In_Nfol.png]]

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
[[index|Back to Program Verification Index]] | [[02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[04-first-order-theories|Next: (y-04) First-Order Theories]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
