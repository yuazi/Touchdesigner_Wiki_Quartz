---
title: "L07  -  Relational Semantics"
tags:
  - program-verification
  - semantics
  - boostan
  - relational-semantics
  - formal-methods
date: 2025-05-05
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/06-boogie-and-boostan|Previous: (y-06) Boogie and Boostan]] | [[/notes/lectures/programverification/08-hoare-proof-system|Next: (y-08) Hoare Proof System]]

## Mental Model for Relational Semantics

- **Programs as Relations**: In verification, we don't just "run" code; we view a statement as a **Binary Relation** between the state *before* and the state *after*.
- **State**: A mapping from every program variable to a value (e.g., $\{a \to 5, b \to 10\}$).
- **Composition**: Running two statements in a row is mathematically represented as the **Relational Composition** of their individual relations.
- **Loops**: A `while` loop is represented as the **Reflexive Transitive Closure** ($R^*$) of its body, filtered by the exit condition.

## What is a Program State?
![[pictures/programverification/07/Lecture07_Pg181_Program_State.png]]


A **Program State** $s$ is a function that assigns a value to every variable in the program. 
- If we have variables $V = \{a, b\}$, a state might be $s = \{a \mapsto 23, b \mapsto 42\}$.
- We use FOL formulas to describe **sets of states**. For example, the formula $a > 0 \wedge b = 0$ represents all possible states where $a$ is positive and $b$ is zero.

---

## Relational Semantics of Boostan
![[pictures/programverification/07/Lecture07_Pg180_Idea_Binary_Relation.png]]


We define the meaning (semantics) of each Boostan statement $[[\text{stmt}]]$ as a relation $R \subseteq \text{State} \times \text{State}$.

### 1. Assignment: `x := expr`
![[pictures/programverification/07/Lecture07_Pg184_Semantics_Of_Assignment.png]]

The relation consists of pairs $(s, s')$ where:
- The new value of $x$ (in $s'$) is the result of evaluating `expr` in the old state $s$.
- All other variables $v \ne x$ remain unchanged ($s'(v) = s(v)$).

**Formal Definition**:
$$[[x := e]] = \{ (s, s') \mid s'(x) = [[e]]_s \text{ and } \forall v \ne x, s'(v) = s(v) \}$$

### 2. Composition: `st1; st2`

Running `st1` followed by `st2` is the relational composition: $[[st1]] \circ [[st2]]$.
- $(s, s'')$ is in the relation if there exists an intermediate state $s'$ that links them.

**Formal Definition**:
$$[[st_1; st_2]] = [[st_1]] \circ [[st_2]] = \{ (s, s'') \mid \exists s', (s, s') \in [[st_1]] \text{ and } (s', s'') \in [[st_2]] \}$$

### 3. If-Then-Else: `if (B) {st1} else {st2}`
![[pictures/programverification/07/Lecture07_Pg190_Semantics_Of_If_Then_Else.png]]

The relation follows one of two branches based on the Boolean condition $B$.

**Formal Definition**:
$$[[ \text{if } B \ \{st_1\} \ \text{else } \{st_2\} ]] = (\{B\} \times \text{State} \cap [[st_1]]) \cup (\{\neg B\} \times \text{State} \cap [[st_2]])$$

---

## Semantics of Loops: `while (B) {st}`
![[pictures/programverification/07/Lecture07_Pg193_Semantics_Of_While.png]]


Loops are the most complex part of relational semantics. We use the **Reflexive Transitive Closure** ($R^*$) to model an arbitrary number of iterations (0 or more).

1.  Let $R_{body}$ be the relation of the loop body given that $B$ is true: $R_{body} = \{ (s, s') \mid s \in \{B\} \text{ and } (s, s') \in [[st]] \}$.
2.  The loop execution is $R_{body}^*$. This represents "running the body $n$ times."
3.  The final state must satisfy $\neg B$ (the loop must have terminated).

**Formal Definition**:
$$[[ \text{while } B \ \{st\} ]] = (\{ (s, s') \mid s \in \{B\} \text{ and } (s, s') \in [[st]] \})^* \circ \{ (s, s) \mid s \in \{\neg B\} \}$$
Equivalently:
$$[[ \text{while } B \ \{st\} ]] = R_{body}^* \cap (\text{State} \times \{\neg B\})$$

---

## Precondition-Postcondition Pairs
![[pictures/programverification/07/Lecture07_Pg199_Precondition_Postcondition_Pairs.png]]



We say a program is **correct** with respect to a precondition $\phi_{\text{pre}}$ and a postcondition $\phi_{\text{post}}$ if the set of all possible final states is contained within the postcondition.

**Formal Definition**:
$$\text{post}(\{\phi_{\text{pre}}\}, [[st]]) \subseteq \{\phi_{\text{post}}\}$$
Where $\text{post}(Y, R) = \{ s' \mid \exists s \in Y, (s, s') \in R \}$.

---

## Summary

1.  **State**: Mapping from variables to values.
2.  **Statements as Relations**: Mapping from "State Before" to "State After".
3.  **Composition**: Sequence of statements = mathematical composition of relations.
4.  **While Loops**: Use reflexive transitive closure ($R^*$) to model arbitrary iterations.
5.  **Correctness**: The set of reachable final states must be a subset of the desired postcondition.

## Self-Check

1. Why does relational semantics view a statement as a binary relation rather than a function?

> [!success]- Answer
> A function takes one input state to one output state, which does not handle non-determinism (`havoc`) or filtering (`assume`). A binary relation $R \subseteq \text{State} \times \text{State}$ allows a state to be related to several successors (non-determinism) or to none at all (a blocked path). This matches Boostan's actual behavior.

2. Give the relation $[[x := e]]$ in words.

> [!success]- Answer
> The pair $(s, s')$ is in $[[x := e]]$ iff $s'(x)$ equals the value of $e$ evaluated in $s$, and $s'$ agrees with $s$ on every other variable. Assignment changes exactly the assigned variable and leaves the rest of the state untouched.

3. How is sequencing $st_1; st_2$ defined in relational semantics, and what does the intermediate state mean?

> [!success]- Answer
> $[[st_1; st_2]] = [[st_1]] \circ [[st_2]] = \{(s, s'') \mid \exists s'. (s, s') \in [[st_1]] \wedge (s', s'') \in [[st_2]]\}$. The intermediate state $s'$ is the state after $st_1$ runs and before $st_2$ runs; sequencing is exactly relational composition.

4. Why does the semantics of `while (B) {st}` use the reflexive transitive closure $R^*$?

> [!success]- Answer
> A loop may execute its body zero, one, or arbitrarily many times before $B$ becomes false. $R^*$ is the smallest relation containing all finite iterations of $R$ plus the identity (zero iterations). Intersecting with $\text{State} \times \{\neg B\}$ keeps only those final states where the loop guard has become false, i.e., the loop actually terminated.

5. What does $\text{post}(\{\phi_{\text{pre}}\}, [[st]]) \subseteq \{\phi_{\text{post}}\}$ say about partial correctness?

> [!success]- Answer
> For every initial state satisfying $\phi_{\text{pre}}$, every state reachable through $[[st]]$ satisfies $\phi_{\text{post}}$. It is partial because the inclusion is vacuous when $st$ has no terminating execution from $s$: the relation simply contains no pair starting at $s$. Total correctness would additionally require termination.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/06-boogie-and-boostan|Previous: (y-06) Boogie and Boostan]] | [[/notes/lectures/programverification/08-hoare-proof-system|Next: (y-08) Hoare Proof System]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
