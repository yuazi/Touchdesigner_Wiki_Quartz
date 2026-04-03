---
title: "Program Verification"
tags:
  - program-verification
  - formal-methods
  - software-engineering
---

# Program Verification

This course covers the formal verification of software using mathematical logic. We explore how to bridge the gap between source code and mathematical proofs of correctness.

## 🏗️ Foundations
1.  [[notes/programverifaction/01-introduction|L01 — Introduction to Program Verification]]
    *   What is a Program Verifier? Testing vs. Verification.
2.  [[notes/programverifaction/02-propositional-logic|L02 — Propositional Logic]]
    *   Syntax, Semantics, Satisfiability, and Validity.
3.  [[notes/programverifaction/03-first-order-logic|L03 — First-Order Logic]]
    *   Quantifiers, Terms, Formulas, and Models.
4.  [[notes/programverifaction/04-first-order-theories|L04 — First-Order Theories]]
    *   Equality ($T_E$), Peano Arithmetic ($T_{PA}$), and Array Theory ($T_A$).

## 💻 Languages & Tools
5.  [[notes/programverifaction/05-smt-lib|L05 — SMT-LIB]]
    *   The standard language for SMT solvers (Declare $\to$ Assert $\to$ Check).
6.  [[notes/programverifaction/06-boogie-and-boostan|L06 — Boogie and Boostan]]
    *   Intermediate verification languages and the Boogaloo interpreter.
9.  [[notes/programverifaction/09-array-theory-and-arrays-in-boostan|L09 — Array Theory and Arrays in Boostan]]
    *   Select/Store operations and the Read-over-Write axioms.
10. [[notes/programverifaction/10-nondeterminism-havoc-assume|L10 — Nondeterminism: Havoc and Assume]]
    *   Modeling user input and path filtering in verification.

## 🧠 Formal Reasoning
7.  [[notes/programverifaction/07-relational-semantics-and-cfgs|L07 — Relational Semantics and CFGs]]
    *   Program States, Relations, and Transitive Closure ($R^*$).
8.  [[notes/programverifaction/08-hoare-proof-system|L08 — Hoare Proof System]]
    *   Hoare Triples, Proof Rules, and Inductive Loop Invariants.
11. [[notes/programverifaction/11-control-flow-graphs|L11 — Control-Flow Graphs]]
    *   Flattening structured code into locations and primitive transitions.
12. [[notes/programverifaction/12-predicate-transformers|L12 — Predicate Transformers]]
    *   Strongest Postcondition ($sp$) and Weakest Precondition ($wp$).

## 🤖 Advanced Automata-Based Verification
13. [[notes/programverifaction/13-abstractions-and-arg|L13 — Abstractions and ARG]]
    *   Abstract Strongest Post ($sp_B^\#$) and Abstract Reachability Graphs.
14. [[notes/programverifaction/14-infeasibility-and-cegar|L14 — Infeasibility Proofs and CEGAR]]
    *   CounterExample-Guided Abstraction Refinement and Inductive Sequences.
15. [[notes/programverifaction/15-trace-abstraction-and-automata|L15 — Trace Abstraction and Automata]]
    *   Floyd-Hoare Automata and covering error traces with formal languages.

## 🚀 Modern Verification Techniques
16. [[notes/programverifaction/16-bmc-and-synthesis|L16 — Bounded Model Checking and Synthesis]]
    *   Loop unrolling ($k$-depth) and automated invariant template discovery.

## Tools
- **Z3**: A state-of-the-art SMT solver from Microsoft Research.
- **Ultimate Automizer**: An automated software verifier.
- **Boogaloo**: An interpreter and symbolic execution tool for Boogie.
- **Ultimate Referee**: A tool for checking loop invariants.

---
[[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
