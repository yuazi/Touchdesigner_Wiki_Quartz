---
title: "L13 — Predicate Transformers"
tags:
  - program-verification
  - predicate-transformers
  - wp
  - sp
  - formal-methods
date: 2025-06-15
---

[[index|Back to Program Verification Index]] | [[12-control-flow-graphs|Previous: (y-12) Control-Flow Graphs]] | [[14-bmc|Next: (y-14) Bounded Model Checking]]

## Mental Model for Predicate Transformers

- **Automated Reasoning**: Hoare Logic is great for humans, but machines need something more mechanical. **Predicate Transformers** are functions that take a formula and a statement and "transform" it into a new formula.
- **Strongest Postcondition ($sp$)**: Moving **forward**. If $\phi$ is true *before* $S$, what is the most specific thing we can say is true *after* $S$?
- **Weakest Precondition ($wp$)**: Moving **backward**. If we want $\psi$ to be true *after* $S$, what is the most general thing that must be true *before* $S$?
- **The Engine of Solvers**: Tools like Boogie use these transformers to turn a program's path into a single logic formula that can be sent to Z3.

## Strongest Postcondition ($sp$)
<!-- Review Needed: close slide match for 'Strongest Postcondition ($sp$)' (p339: 0.485, p341: 0.477) -->
![[../../pictures/programverifaction/12/Lecture12_Pg339_Strongest_Postcondition_Sp.png]]
![[../../pictures/programverifaction/12/Lecture12_Pg341_Strongest_Postcondition_Sp.png]]


$sp(\phi, S)$ calculates the set of all states reachable from $\phi$ by executing $S$.

### 1. Assignment: `x := expr`
![[../../pictures/programverifaction/12/Lecture12_Pg221_1_Assignment_X_Expr.png]]

$$sp(\phi, x := e) \equiv \exists x_{\text{old}}. \phi[x \mapsto x_{\text{old}}] \wedge x = e[x \mapsto x_{\text{old}}]$$
- *Intuition*: We "save" the old value of $x$ as $x_{\text{old}}$. The new state is one where the old $\phi$ was true (using $x_{\text{old}}$) and the new $x$ is the result of the expression.

### 2. Havoc: `havoc x`
![[../../pictures/programverifaction/12/Lecture12_Pg284_2_Havoc_Havoc_X.png]]

$$sp(\phi, \text{havoc } x) \equiv \exists x_{\text{old}}. \phi[x \mapsto x_{\text{old}}]$$
- *Intuition*: We lose all specific information about $x$, but everything else in $\phi$ remains true.

### 3. Assume: `assume P`
$$sp(\phi, \text{assume } P) \equiv \phi \wedge P$$
- *Intuition*: We simply add the assumed fact to our knowledge base.

---

## Weakest Precondition ($wp$)

$wp(S, \psi)$ calculates the "least restrictive" condition required to guarantee $\psi$ after $S$.

### 1. Assignment: `x := expr`
![[../../pictures/programverifaction/13/Lecture13_Pg270_1_Assignment_X_Expr.png]]

$$wp(x := e, \psi) \equiv \psi[x \mapsto e]$$
- *Intuition*: This is exactly the same as the Hoare Assignment Axiom! Just substitute the expression into the postcondition.

### 2. Assume: `assume P`
$$wp(\text{assume } P, \psi) \equiv P \to \psi$$
- *Intuition*: If the assumption $P$ holds, then $\psi$ must hold. If $P$ is false, the execution is ignored (vacuously true).

---

## The Problem of Quantifiers

When we compute $sp$ forward, we often end up with many existential quantifiers ($\exists \hat{x}$). 
- **Example**: $sp(x=5, x:=x+1)$ becomes $\exists \hat{x}. \hat{x}=5 \wedge x=\hat{x}+1$.
- **Quantifier Elimination**: We can simplify this to $x=6$.
- Solvers use techniques like **Destructive Equality Resolution** to "solve" these quantifiers and keep the formulas small.

---

## Summary

1.  **Predicate Transformers** ($sp$ and $wp$) automate the "transport" of logic through code.
2.  **Forward Analysis ($sp$)**: Tracks what we know as we execute.
3.  **Backward Analysis ($wp$)**: Tracks what we *need* to know to reach a goal.
4.  **$sp$ for Assume**: Conjunction ($\wedge$).
5.  **$wp$ for Assume**: Implication ($\to$).
6.  **Verification**: To prove `{P} S {Q}`, we check if $sp(P, S) \to Q$ (or if $P \to wp(S, Q)$).

---
[[index|Back to Program Verification Index]] | [[12-control-flow-graphs|Previous: (y-12) Control-Flow Graphs]] | [[14-bmc|Next: (y-14) Bounded Model Checking]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
