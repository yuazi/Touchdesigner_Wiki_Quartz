---
title: "L16 — Abstractions and Abstract Reachability Graphs"
tags:
  - program-verification
  - abstraction
  - arg
  - strongest-post
  - formal-methods
date: 2025-07-09
---

[[notes/programverification/index|Back to Program Verification Index]] | [[notes/programverification/15-correctness-via-assert|Previous: (y-15) Correctness via Assert Statements]] | [[notes/programverification/17-infeasibility-and-cegar|Next: (y-17) Infeasibility Proofs and CEGAR]]

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

---
[[notes/programverification/index|Back to Program Verification Index]] | [[notes/programverification/15-correctness-via-assert|Previous: (y-15) Correctness via Assert Statements]] | [[notes/programverification/17-infeasibility-and-cegar|Next: (y-17) Infeasibility Proofs and CEGAR]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
