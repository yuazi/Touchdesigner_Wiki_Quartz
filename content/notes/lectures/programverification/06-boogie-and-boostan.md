---
title: "L06  -  Boogie and Boostan"
tags:
  - program-verification
  - boogie
  - boostan
  - intermediate-language
  - formal-methods
date: 2026-04-30
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/05-smt-lib|Previous: (y-05) SMT-LIB]] | [[/notes/lectures/programverification/07-relational-semantics|Next: (y-07) Relational Semantics]]

## Mental Model for Boogie and Boostan

- **Why a new language?** Real languages (C, Java) are too messy to verify directly. We translate them into a "clean" intermediate language like **Boogie**.
- **Boogie** is a verification-oriented language. It has things programmers want (types, procedures) but is designed to be easily turned into logic formulas.
- **Boostan** is a tiny, formal fragment of Boogie that we use in class to define perfect mathematical rules for how code works.
- **Boogaloo** is a tool that lets us "run" Boogie code even when it's non-deterministic, helping us find bugs early.

## Why not verify C or Python directly?

1.  **Syntax Bloat**: These languages have hundreds of features that are hard to formalize.
2.  **Vague Semantics**: The rules for C are often defined in hundreds of pages of English text, which can be ambiguous.
3.  **Intermediate Power**: By translating many languages (C, Java, C#) into **one** intermediate language (Boogie), we only have to build **one** verifier.

---

## The Verification Pipeline

Modern verifiers follow a specific translation chain:
1.  **Source Code** (e.g., C, Java): Messy, complex, and hardware-specific.
2.  **Intermediate Language** (e.g., **Boogie**): Clean, mathematical, and focused on assertions/assumptions.
3.  **SMT Solver** (e.g., **Z3**): Receives the logic formulas and checks if an assertion violation is "satisfiable" (meaning a bug exists).

---

## Boogie: The Verification Language
![[pictures/programverification/06/Lecture06_Pg149_Boogie.png]]


Developed by Rustan Leino at Microsoft Research, Boogie is used by tools like **Ultimate Automizer** and **Dafny**.

### Key Features of Boogie
- **Procedures**: Named blocks of code with inputs and outputs.
- **`requires P`**: A **precondition** that must hold before calling the procedure.
- **`ensures Q`**: A **postcondition** that the procedure promises to satisfy upon termination.
- **Assignments**: `x := x + 1`.
- **Assumptions**: `assume x > 0`. If this is false, the execution "stops" or is ignored.
- **Assertions**: `assert x > 0`. This is a promise that *must* hold true.

### Example Boogie Code
```boogie
procedure Square(a: int) returns (square: int)
    requires a >= 0;    // Precondition
    ensures square >= a; // Postcondition
{
    square := a * a;
    if (square == 0) {
        assume {:print "a is zero"} true;
    } else {
        assume {:print "a = ", a} true;
    }
}
```

---

## Tool: Boogaloo

Boogaloo is an **interpreter** and **symbolic executor** for Boogie. It allows you to explore the state space of your Boogie code before running a full proof tool.

### Command Line Options
![[pictures/programverification/06/Lecture06_Pg150_Boogie_Tools_Boogaloo.png]]

- **`-o [n]`**: Control the total number of **executions** to explore.
- **`-n [n]`**: Limit the number of executions per **unique sequence of statements** (prevents getting stuck in infinite loops).
- **`-c=0`**: Turns off **"concrete mode"** (allows variables to take symbolic values instead of just simple constants).
- **`-p [proc]`**: Specifies the **entry procedure** to begin execution.

### 💡 Intuition: Asserts vs. Assumes
...
- **`assume P`**: The verifier can *take it for granted* that P is true. It is a filter that tells the verifier, "Only look at cases where P holds." If P is false, the path is ignored.

---

## Boostan: The Formal Fragment
![[pictures/programverification/06/Lecture06_Pg154_Boostan.png]]


Boostan is a simplified version of Boogie used for defining formal relational semantics.

### 🧠 Deep Dive: The Formal Grammar $G_{Boo}$
A Boostan program $P$ is a sequence of commands $c$:
- **Skip**: `skip` (Does nothing)
- **Assignment**: `x := e` (Update variable $x$ with expression $e$)
- **Sequence**: $c_1; c_2$ (Execute $c_1$, then $c_2$)
- **If-Then-Else**: `if (b) { c_1 } else { c_2 }`
- **While Loop**: `while (b) { c }`
- **Havoc**: `havoc x` (Assign a non-deterministic value to $x$)
- **Assume**: `assume b` (Filter execution paths)
- **Assert**: `assert b` (Verify a condition)

### 💡 The "Small Vocabulary" Approach
Why do we limit Boostan to only a few commands?
1.  **Ease of Formalization**: It's much easier to write mathematical rules for 8 commands than for 800.
2.  **Completeness**: These few commands are actually **Turing-complete**! Any complex program (with `for` loops, `switch` statements, etc.) can be rewritten using just these basic building blocks.
3.  **Orthogonality**: Each command does exactly one thing, making the semantics "clean" and predictable.

---

## Summary

1.  **Intermediate Languages** like Boogie simplify verification by providing clean semantics.
2.  **Boogie** is the industry standard for intermediate verification; **Boostan** is our teaching version.
3.  **Procedures** in Boogie allow us to modularize proofs.
4.  **Assumes** filter states, while **Asserts** check for bugs.
5.  **Boogaloo** helps us debug our Boogie programs before we run a full verifier.

## Self-Check

1. Why do verifiers translate C, Java, or C# into Boogie instead of working on the source directly?

> [!success]- Answer
> Real languages have hundreds of features and ambiguous English-text semantics, which makes them hard to formalize. Boogie is a clean, mathematically defined intermediate language with a small core, so multiple front-ends can target it and a single verifier handles all of them. The translation isolates verification from the messy parts of each source language.

2. What is the operational difference between `assume P` and `assert P` in Boogie?

> [!success]- Answer
> `assume P` filters executions: paths where `P` is false are dropped from consideration, so the verifier proceeds as if `P` were given. `assert P` is a proof obligation: the verifier must show `P` holds along every path that reaches it; if any path falsifies `P`, the verifier reports a bug. Assumes constrain inputs; asserts check outputs.

3. List the commands of Boostan ($G_{Boo}$) and explain why such a small set is enough.

> [!success]- Answer
> Boostan has `skip`, `x := e`, sequencing $c_1; c_2$, `if (b) {c_1} else {c_2}`, `while (b) {c}`, `havoc x`, `assume b`, and `assert b`. These commands are Turing-complete: any richer construct (`for`, `switch`, `return`) can be desugared into them. The small core makes the formal semantics tractable while keeping enough expressive power.

4. What is `havoc x`, and why does verification need it?

> [!success]- Answer
> `havoc x` assigns a non-deterministic value to `x`. It is used to model unknown inputs, the effect of an under-specified call, or to "forget" a variable's value at the top of a loop so the verifier reasons about an arbitrary iteration. It is the basic source of non-determinism in Boostan.

5. What does Boogaloo do and how does it complement a full verifier?

> [!success]- Answer
> Boogaloo is an interpreter and symbolic executor for Boogie. With flags like `-o`, `-n`, `-c=0`, and `-p`, it explores executions of a procedure, including non-deterministic ones, before you invoke a heavy proof tool. This lets you catch obvious bugs and sanity-check the model cheaply; once Boogaloo is happy, you run the verifier for a real correctness proof.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/05-smt-lib|Previous: (y-05) SMT-LIB]] | [[/notes/lectures/programverification/07-relational-semantics|Next: (y-07) Relational Semantics]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
