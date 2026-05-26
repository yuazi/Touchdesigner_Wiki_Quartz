---
title: "L16  -  Abstractions and Abstract Reachability Graphs"
tags:
  - program-verification
  - abstraction
  - arg
  - strongest-post
  - formal-methods
date: 2025-07-09
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/15-correctness-via-assert|Previous: (y-15) Correctness via Assert Statements]] | [[/notes/lectures/programverification/17-infeasibility-and-cegar|Next: (y-17) Infeasibility Proofs and CEGAR]]

## Mental Model for Abstractions

- **The State Space Explosion**: Programs have too many states to check individually. **Abstraction** allows us to group many concrete states into one "abstract" state.
- **Predicates as Buckets**: We use a finite set of formulas (Predicates) $B$ to categorize states. For example, if $B = \{x > 0\}$, we only care if $x$ is positive or not.
    - **Finite Approximation**: This analogy helps understand how we map an infinite number of concrete states (all possible values of $x$) into a finite set of "buckets" defined by our predicates.
- **Abstract Reachability Graph (ARG)**: A graph where each node is an **Abstract Configuration** $(\ell, \phi)$. It represents "at location $\ell$, the program state satisfies $\phi$."
- **Safety Proof**: If we can build an ARG where no node $(\ell_{\text{err}}, \phi)$ has a satisfiable $\phi$, we have proven the program safe.

## Abstract Strongest Post ($sp_B^\#$)
![[pictures/programverification/13/Lecture13_Pg407_Abstract_Strongest_Post_Sp_B.png]]


The standard $sp$ can produce complex formulas. The **Abstract Strongest Post** forces the result to be a conjunction of formulas from our set $B$.

$$sp_B^\#(\psi, st) = \bigwedge \{ \phi \in B \mid sp(\psi, st) \subseteq \phi \}$$

- *Intuition*: We take the real strongest postcondition and "round it up" to the nearest combination of predicates we already know.
- This ensures the number of possible abstract states remains finite.

---

## Abstract Reachability Graphs (ARG)
![[pictures/programverification/13/Lecture13_Pg405_Abstract_Reachability_Graphs_Arg.png]]


An ARG is a way to systematically explore the abstract state space of a program.

### Formal Definition
An ARG is a pair $(AC, T)$ where:
- **$AC$**: A set of abstract configurations $(\ell, S)$, where $\ell$ is a program location and $S$ is a set of states (represented by a formula).
- **$T$**: A set of abstract transitions $((1, S), st, (\ell', S'))$.

### Construction Algorithm
1.  **Start** at the initial location with the precondition: $(\ell_{\text{init}}, \phi_{\text{pre}})$.
2.  **Explore**: For each outgoing edge in the CFG, compute the new abstract state using $sp_B^\#$.
3.  **Worklist**: Continue until no new abstract configurations are discovered.

---

## Safety in the ARG

An ARG is a **Safety Proof** if:
- For every location $\ell_{\text{err}}$ (an error location), the corresponding formula $S$ in $(\ell_{\text{err}}, S)$ is `false`.
- This means that within our abstraction $B$, it is impossible to reach the error state.

### 💡 Intuition: Precision vs. Scalability
- If $B$ is too small (e.g., $B = \emptyset$), the ARG will be small but might say the program is "unsafe" even if it's actually safe (a **False Positive**).
- If $B$ is too large, the ARG might be too big for a computer to handle, but it will be more precise.

---

## Summary

1.  **Abstraction** simplifies the program by focusing on a few key properties (Predicates).
2.  **$sp_B^\#$** keeps the reasoning within the bounds of our chosen predicates.
3.  **ARG** is the graph of all reachable abstract states.
4.  A program is **Safe** if its ARG never reaches an error state with a satisfiable formula.
5.  **The Guesswork**: The main challenge in verification is finding a "good" set $B$ that is precise enough to prove safety but small enough to be efficient.

## Self-Check

1. What role does the predicate set $B$ play in abstract interpretation, and why must it be finite?

> [!success]- Answer
> $B$ is the finite vocabulary the abstraction is allowed to use. Every abstract state is a conjunction of predicates drawn from $B$ (or their negations), which makes the set of possible abstract states finite. Finiteness is what guarantees the ARG construction terminates, even when the concrete state space is infinite.

2. Define $sp_B^\#(\psi, st)$ and explain what "rounding up" means.

> [!success]- Answer
> $sp_B^\#(\psi, st)$ is the conjunction of all $\phi \in B$ such that $sp(\psi, st) \subseteq \phi$. It takes the concrete strongest postcondition and replaces it with the strongest combination of $B$-predicates that is still implied by it, which is generally weaker than the real $sp$. That weakening is the "rounding up" that keeps results inside the predicate vocabulary.

3. What are the two components of an ARG node, and what does the node mean?

> [!success]- Answer
> A node is an abstract configuration $(\ell, \phi)$ where $\ell$ is a CFG location and $\phi$ is a formula (a $B$-state) representing a set of concrete states. The node asserts: "when the program reaches $\ell$, the actual state satisfies $\phi$".

4. Under what condition does an ARG constitute a safety proof?

> [!success]- Answer
> Every node $(\ell_{\text{err}}, \phi)$ at an error location must have $\phi$ equivalent to `false`. That means in the abstraction, no concrete state can be witnessing an assertion failure, and since the ARG over-approximates real reachability, the program is genuinely safe.

5. Describe the trade-off involved in choosing the predicate set $B$.

> [!success]- Answer
> A small $B$ yields a small ARG that may be too coarse to prove safety, producing false alarms (the abstraction says an error state is reachable when concretely it is not). A large $B$ gives more precision but explodes the abstract state space and cost. The "guesswork" is finding a $B$ precise enough to prove the property and small enough to scale.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/15-correctness-via-assert|Previous: (y-15) Correctness via Assert Statements]] | [[/notes/lectures/programverification/17-infeasibility-and-cegar|Next: (y-17) Infeasibility Proofs and CEGAR]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
