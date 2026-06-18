---
title: "L13  -  Predicate Transformers"
tags:
  - program-verification
  - predicate-transformers
  - wp
  - sp
  - formal-methods
date: 2026-06-16
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/12-control-flow-graphs|Previous: (y-12) Control-Flow Graphs]] | [[/notes/lectures/programverification/14-bmc|Next: (y-14) Bounded Model Checking]]

## Mental Model for Predicate Transformers

![[pictures/programverification/13/Lecture13_Pg339_Strongest_Post_Along_Cfg.png]]

- **Automated Reasoning**: Hoare Logic is great for humans, but machines need something more mechanical. **Predicate Transformers** are functions that take a formula and a statement and "transform" it into a new formula.
- **Strongest Postcondition ($sp$)**: Moving **forward**. If $\phi$ is true _before_ $S$, what is the most specific thing we can say is true _after_ $S$?
- **Weakest Precondition ($wp$)**: Moving **backward**. If we want $\psi$ to be true _after_ $S$, what is the most general thing that must be true _before_ $S$?
- **The Engine of Solvers**: Tools like Boogie use these transformers to turn a program's path into a single logic formula that can be sent to Z3.

## Strongest Postcondition ($sp$)

![[pictures/programverification/13/Lecture13_Pg343_Definition_Strongest_Postcondition.png]]

$sp(\phi, S)$ calculates the set of all states reachable from $\phi$ by executing $S$.

### 1. Assignment: `x := expr`

![[pictures/programverification/13/Lecture13_Pg356_Sp_Of_Assignment.png]]

$$sp(\phi, x := e) \equiv \exists x_{\text{old}}. \phi[x \mapsto x_{\text{old}}] \wedge x = e[x \mapsto x_{\text{old}}]$$

- _Intuition_: We "save" the old value of $x$ as $x_{\text{old}}$. The new state is one where the old $\phi$ was true (using $x_{\text{old}}$) and the new $x$ is the result of the expression.

### 2. Havoc: `havoc x`

![[pictures/programverification/13/Lecture13_Pg357_Sp_Of_Havoc.png]]

$$sp(\phi, \text{havoc } x) \equiv \exists x_{\text{old}}. \phi[x \mapsto x_{\text{old}}]$$

- _Intuition_: We lose all specific information about $x$, but everything else in $\phi$ remains true.

### 3. Assume: `assume P`

![[pictures/programverification/13/Lecture13_Pg358_Sp_Of_Assume.png]]

$$sp(\phi, \text{assume } P) \equiv \phi \wedge P$$

- _Intuition_: We simply add the assumed fact to our knowledge base.

---

## Weakest Precondition ($wp$)

$wp(S, \psi)$ calculates the "least restrictive" condition required to guarantee $\psi$ after $S$.

### 1. Assignment: `x := expr`

$$wp(x := e, \psi) \equiv \psi[x \mapsto e]$$

- _Intuition_: This is exactly the same as the Hoare Assignment Axiom! Just substitute the expression into the postcondition.

### 2. Assume: `assume P`

$$wp(\text{assume } P, \psi) \equiv P \to \psi$$

- _Intuition_: If the assumption $P$ holds, then $\psi$ must hold. If $P$ is false, the execution is ignored (vacuously true).

---

## The Problem of Quantifiers

![[pictures/programverification/13/Lecture13_Pg351_Destructive_Equality_Resolution.png]]

When we compute $sp$ forward, we often end up with many existential quantifiers ($\exists \hat{x}$).

- **Example**: $sp(x=5, x:=x+1)$ becomes $\exists \hat{x}. \hat{x}=5 \wedge x=\hat{x}+1$.
- **Quantifier Elimination**: We can simplify this to $x=6$.
- Solvers use techniques like **Destructive Equality Resolution** to "solve" these quantifiers and keep the formulas small.

---

## Summary

1.  **Predicate Transformers** ($sp$ and $wp$) automate the "transport" of logic through code.
2.  **Forward Analysis ($sp$)**: Tracks what we know as we execute.
3.  **Backward Analysis ($wp$)**: Tracks what we _need_ to know to reach a goal.
4.  **$sp$ for Assume**: Conjunction ($\wedge$).
5.  **$wp$ for Assume**: Implication ($\to$).
6.  **Verification**: To prove `{P} S {Q}`, we check if $sp(P, S) \to Q$ (or if $P \to wp(S, Q)$).

## Self-Check

1. What is the intuitive difference between $sp(\phi, S)$ and $wp(S, \psi)$?

> [!success]- Answer
> $sp(\phi, S)$ moves forward: given that $\phi$ holds before $S$, it returns the strongest formula guaranteed to hold after $S$. $wp(S, \psi)$ moves backward: given the desired postcondition $\psi$, it returns the weakest precondition that guarantees $\psi$ holds after $S$. They are duals: one starts from what you know, the other from what you want.

2. Compute $sp(x = 5, x := x + 1)$ and simplify.

> [!success]- Answer
> By the rule, $sp(x=5, x := x+1) \equiv \exists x_{\text{old}}. x_{\text{old}} = 5 \wedge x = x_{\text{old}} + 1$. Substituting $x_{\text{old}} = 5$ gives $x = 6$, and the existential disappears. So the strongest postcondition is $x = 6$.

3. Compute $wp(x := x + 1, x > 0)$.

> [!success]- Answer
> $wp(x := e, \psi) \equiv \psi[x \mapsto e]$, so $wp(x := x+1, x > 0) \equiv (x+1) > 0$, equivalently $x > -1$ over integers ($x \ge 0$). This is exactly what the Hoare assignment axiom would give.

4. Why is $wp(\text{assume } P, \psi)$ equal to $P \to \psi$ rather than $P \wedge \psi$?

> [!success]- Answer
> The `assume P` filter only keeps executions where $P$ holds; on paths where $P$ is false, the relation is empty so $\psi$ has nothing to prove. So the precondition need only guarantee $\psi$ in the case that $P$ is actually true, which is exactly the implication $P \to \psi$.

5. State the verification condition for $\{P\}\ S\ \{Q\}$ using $sp$ or $wp$.

> [!success]- Answer
> Use $sp(P, S) \to Q$ (everything reachable from $P$ through $S$ implies $Q$), or equivalently $P \to wp(S, Q)$ (every initial state in $P$ satisfies the weakest precondition for $Q$). Either implication, if valid, certifies the Hoare triple.

---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/12-control-flow-graphs|Previous: (y-12) Control-Flow Graphs]] | [[/notes/lectures/programverification/14-bmc|Next: (y-14) Bounded Model Checking]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
