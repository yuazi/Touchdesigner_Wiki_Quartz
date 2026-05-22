---
title: "L08 — Hoare Proof System"
tags:
  - program-verification
  - hoare-logic
  - proof-system
  - formal-methods
date: 2026-05-12
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/07-relational-semantics|Previous: (y-07) Relational Semantics]] | [[/notes/lectures/programverification/09-ultimate-referee|Next: (y-09) Ultimate Referee]]

## Mental Model for the Hoare Proof System

- **Semantics says what a program does.** Relational semantics gives the exact before/after relation of a statement.
- **Hoare logic gives a proof method.** Instead of calculating the whole relation, prove local triples and compose them.
- **The proof object is a tree.** Every node is a Hoare triple; every edge is justified by one rule and any required side condition.
- **Loops need insight.** The while rule is mechanical once an inductive invariant is chosen, but finding that invariant is the hard part.

---

## 1. Hoare Triples and Validity

![[pictures/programverification/08/Lecture08_Pg208_Hoare_Triple.png]]

A **Hoare triple** has the form:

$$\{\varphi\}\ st\ \{\psi\}$$

- $\varphi$: precondition, a set of allowed starting states.
- $st$: the Boostan statement.
- $\psi$: postcondition, the set of accepted final states.

The triple is **valid** iff `st` satisfies the precondition-postcondition pair:

$$post(\{\varphi\}, [[st]]) \subseteq \{\psi\}$$

So validity is still semantic; the proof system is just a structured way to establish it.

### Proof Systems Compared

![[pictures/programverification/08/Lecture08_Pg209_Proof_Systems_Compared.png]]

The course has already used proof systems for formulas:

- **NPL** derives valid propositional implications.
- **NFOL** derives valid first-order implications.
- **Hoare proof system** derives valid program triples.

The shape is analogous: syntax-driven rules produce objects that are guaranteed to be semantically valid if the system is sound.

---

## 2. Rules of the Hoare Proof System

![[pictures/programverification/08/Lecture08_Pg211_Rules_Overview.png]]

The core rules are:

1. **Assignment axiom**: reason backward through `x := expr`.
2. **Composition rule**: split `st1; st2` using an intermediate assertion.
3. **Strengthen precondition**: replace a precondition by a stronger one.
4. **Weaken postcondition**: replace a postcondition by a weaker one.
5. **Conditional rule**: prove both branches under the appropriate guard.
6. **While rule**: prove the body preserves an invariant.

### Derivations as Trees

![[pictures/programverification/08/Lecture08_Pg212_Derivation_Trees.png]]

A derivation is a tree whose labels are Hoare triples. For a parent node to be legal, its children must match one of the proof rules. This is important because a derivation is checkable: once the formulas and invariants are written down, the proof rules decide whether the tree is valid.

### Assignment and Composition

The assignment axiom is:

$$\{\varphi[x \mapsto expr]\}\ x := expr;\ \{\varphi\}$$

Read it backward: to make $\varphi$ true after assignment, require $\varphi$ with `x` replaced by `expr` before assignment.

The composition rule is:

$$
\frac{\{\varphi_1\}\ st_1\ \{\varphi_2\} \quad \{\varphi_2\}\ st_2\ \{\varphi_3\}}
{\{\varphi_1\}\ st_1st_2\ \{\varphi_3\}}
$$

The intermediate assertion $\varphi_2$ is the contract between the two statements.

---

## 3. Branches and Loops

### Conditional Rule

![[pictures/programverification/08/Lecture08_Pg214_Conditional_Rule.png]]

For `if (expr) { st1 } else { st2 }`, prove:

$$\{\varphi \land expr\}\ st_1\ \{\psi\}$$

and

$$\{\varphi \land \lnot expr\}\ st_2\ \{\psi\}$$

Both branches must establish the same postcondition. The guard only decides which branch relation is active.

### While Rule and Invariants

![[pictures/programverification/08/Lecture08_Pg215_While_Rule.png]]

The while rule is:

$$
\frac{\{\varphi \land expr\}\ st\ \{\varphi\}}
{\{\varphi\}\ while(expr)\{st\}\ \{\varphi \land \lnot expr\}}
$$

The formula $\varphi$ is an **inductive loop invariant**:

- true before the loop,
- preserved by one loop iteration,
- still true when the loop exits.

### Hoare Proof System Example

![[pictures/programverification/08/Lecture08_Pg216_Hoare_Proof_System_Example.png]]

The `Pab` example shows the typical workflow: choose a loop invariant, push obligations backward through assignments and conditionals, and use consequence rules when the exact syntactic preconditions do not line up.

---

## 4. Soundness of Individual Rules

Soundness means every derivable triple is actually valid in the relational semantics. The proof strategy is local first: prove that every rule preserves validity.

### Assignment Axiom

![[pictures/programverification/08/Lecture08_Pg221_Assignment_Axiom_Soundness.png]]

Assignment is sound because `x := expr` updates only `x`. Substituting `expr` for `x` in the precondition exactly predicts the formula that must hold after the update.

### Composition Rule

![[pictures/programverification/08/Lecture08_Pg222_Composition_Rule_Soundness.png]]

Composition is sound because postimages compose. If `st1` reaches only $\varphi_2$ states, and `st2` reaches only $\varphi_3$ states from there, then `st1; st2` reaches only $\varphi_3$ states.

### Consequence Rules

![[pictures/programverification/08/Lecture08_Pg223_Strengthen_Precondition_Soundness.png]]

Strengthening the precondition is safe because it reduces the set of starting states.

![[pictures/programverification/08/Lecture08_Pg224_Weakening_Postcondition_Soundness.png]]

Weakening the postcondition is safe because it enlarges the set of accepted final states.

---

## 5. Soundness of Control Flow

### Conditional Rule

![[pictures/programverification/08/Lecture08_Pg226_Conditional_Rule_Soundness.png]]

The conditional relation is the union of two guarded branch relations. If the then branch is valid under `expr` and the else branch is valid under `!expr`, the whole conditional is valid.

### While Rule

![[pictures/programverification/08/Lecture08_Pg227_While_Rule_Soundness.png]]

The loop semantics uses reflexive transitive closure. The proof shows by induction over the number of iterations that the invariant is preserved after every finite loop execution. At exit, the guard is false, so the postcondition is $\varphi \land \lnot expr$.

---

## 6. Soundness of the Whole System

![[pictures/programverification/08/Lecture08_Pg230_Soundness_Theorem.png]]

The final theorem is:

> If there is a derivation whose root is labelled by $\{\varphi\}\ st\ \{\psi\}$, then `st` satisfies the precondition-postcondition pair $(\{\varphi\}, \{\psi\})$.

The proof is by induction over derivation height:

1. Leaves are justified by sound axioms.
2. Children of an internal node are valid by the induction hypothesis.
3. The applied proof rule preserves validity.
4. Therefore the root triple is valid.

---

## Summary

- A Hoare triple connects a precondition, a statement, and a postcondition.
- The proof system derives triples using local syntactic rules.
- Assignment works backward through substitution.
- Composition needs an intermediate assertion.
- Conditionals split by the guard.
- Loops require an inductive invariant.
- Soundness bridges derivability back to relational semantics.

## Self-Check

1. State the validity condition for a Hoare triple $\{\varphi\}\ st\ \{\psi\}$ in semantic terms.

> [!success]- Answer
> The triple is valid iff $\text{post}(\{\varphi\}, [[st]]) \subseteq \{\psi\}$: every final state reachable from a $\varphi$-state through $st$ lies in $\psi$. The proof system is just a structured way to establish that semantic inclusion.

2. Write the assignment axiom and explain why it reads "backward".

> [!success]- Answer
> $\{\varphi[x \mapsto expr]\}\ x := expr\ \{\varphi\}$. To make $\varphi$ true after the assignment, the state before must satisfy $\varphi$ with every free occurrence of $x$ replaced by $expr$. The rule pushes the postcondition through the assignment back into a precondition, which is why proofs are typically done from the end backward.

3. Why does the composition rule need an intermediate assertion $\varphi_2$?

> [!success]- Answer
> The composition rule says $\{\varphi_1\}\ st_1\ \{\varphi_2\}$ and $\{\varphi_2\}\ st_2\ \{\varphi_3\}$ together give $\{\varphi_1\}\ st_1; st_2\ \{\varphi_3\}$. The intermediate $\varphi_2$ is the contract between the two pieces: it must be implied by what $st_1$ guarantees and strong enough for $st_2$ to need. Picking a good $\varphi_2$ is the main creative step in sequential proofs.

4. State the three requirements for $\varphi$ to be a loop invariant in the while rule.

> [!success]- Answer
> $\varphi$ must hold before the loop (so it implies the loop's precondition), be preserved by one iteration assuming the guard holds (i.e., $\{\varphi \wedge expr\}\ st\ \{\varphi\}$ is derivable), and combine with $\neg expr$ on exit to imply the desired postcondition. The rule yields $\{\varphi\}\ \text{while}(expr)\{st\}\ \{\varphi \wedge \neg expr\}$.

5. What does soundness of the Hoare proof system mean, and how is the soundness theorem proved?

> [!success]- Answer
> Soundness means every derivable triple is actually valid in the relational semantics. The proof is by induction on the height of the derivation: leaves are justified by sound axioms (assignment, plus side conditions), the induction hypothesis gives validity of all immediate sub-derivations, and each proof rule is shown locally to preserve validity. Combining these gives validity at the root.

---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/07-relational-semantics|Previous: (y-07) Relational Semantics]] | [[/notes/lectures/programverification/09-ultimate-referee|Next: (y-09) Ultimate Referee]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
