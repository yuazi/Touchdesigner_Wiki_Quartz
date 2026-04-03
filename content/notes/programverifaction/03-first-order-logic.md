---
title: "L03 — First-Order Logic"
tags:
  - program-verification
  - first-order-logic
  - logic
  - formal-methods
date: 2026-04-14
---

[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[notes/programverifaction/04-first-order-theories|Next: (y-04) First-Order Theories]]

## Mental Model for First-Order Logic

- **First-Order Logic (FOL)** is Propositional Logic + **Objects, Functions, and Relations**. It allows us to talk about "all elements" ($\forall$) or "some elements" ($\exists$).
- **Syntax**: We build **Terms** (representing objects) and **Formulas** (representing truth).
- **Semantics**: A formula is only true or false relative to a **Model** (a universe of objects and a mapping of symbols to meanings).
- **Substitution**: The "engine" of reasoning in FOL. To prove something about "all $x$", we often substitute $x$ with a specific term $t$.

## Introduction to First-Order Logic

While Propositional Logic is powerful, it can't easily express statements like "Every integer has a square." FOL adds the machinery needed to formalize math and complex program states.

---

## Syntax: Terms and Formulas
![[Lecture03_Pg135_Syntax_Terms_And_Formulas.png]]


In FOL, we distinguish between things that represent **values** (Terms) and things that represent **truth** (Formulas).

### 1. The Vocabulary (Signature)
A vocabulary $\mathcal{V}$ consists of:
- **Variables**: $x, y, z, \dots$
- **Constants**: $0, 1, a, b, \dots$
- **Functions**: $f(x), +(x, y), \dots$ (each has an **arity**)
- **Predicates**: $p(x), \le(x, y), \dots$ (each has an **arity**)

### 2. Terms
![[Lecture03_Pg134_2_Terms.png]]

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

### 💡 Intuition: Truth is Relative
The formula $\forall x. \exists y. y > x$ is **true** if $D$ is the set of integers, but **false** if $D$ is a finite set of people (there is no "taller" person if you are already the tallest).

---

## Free vs. Bound Variables
![[Lecture03_Pg067_Free_Vs_Bound_Variables.png]]


- **Bound Variable**: A variable under the scope of a quantifier ($\forall x$ or $\exists x$).
- **Free Variable**: A variable that is NOT bound.
- **Closed Formula (Sentence)**: A formula with no free variables. Its truth value depends *only* on the model, not on any specific variable assignment.

---

## Proof System: NFOL

NFOL extends the propositional rules with four new ones for quantifiers:

1.  **(I$\forall$) Universal Introduction**: To prove $\forall x. \phi$, prove $\phi[x \to y]$ for a "fresh" $y$ that doesn't appear in your assumptions.
2.  **(E$\forall$) Universal Elimination**: If you know $\forall x. \phi$, you can conclude $\phi[x \to t]$ for *any* term $t$.
3.  **(I$\exists$) Existential Introduction**: To prove $\exists x. \phi$, show that $\phi[x \to t]$ holds for some specific term $t$.
4.  **(E$\exists$) Existential Elimination**: If you know $\exists x. \phi$, you can assume $\phi[x \to y]$ holds for a fresh $y$ and see what follows.

---

## Summary

1.  **FOL** = Propositional Logic + Quantifiers + Functions/Predicates.
2.  **Terms** represent objects; **Formulas** represent truth.
3.  **Models** give meaning to symbols.
4.  **Decidability**: Satisfiability in FOL is **undecidable**, but Validity is **semi-decidable**.

---
[[notes/programverifaction/index|Back to Program Verification Index]] | [[notes/programverifaction/02-propositional-logic|Previous: (y-02) Propositional Logic]] | [[notes/programverifaction/04-first-order-theories|Next: (y-04) First-Order Theories]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
