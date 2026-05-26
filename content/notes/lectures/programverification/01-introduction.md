---
title: "L01  -  Introduction to Program Verification"
tags:
  - program-verification
  - software-correctness
  - formal-methods
  - introduction
date: 2026-04-03
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/02-propositional-logic|Next: (y-02) Propositional Logic]]

## Mental Model for Program Verification

- **Program Verification** is the process of using mathematical proof to show that a program always behaves according to its **specification**.
- A **Program Verifier** is like a compiler for correctness: it takes your code and your "promises" (assertions), then either confirms they match or gives you a **counterexample**.
- Testing can only prove the **presence** of bugs, never their **absence**. Verification aims for the latter.
- If one question guides your reading, let it be this: **How do we turn a piece of code into a mathematical object that we can reason about?**

## Introduction

**Program Verification** is a formal system used to reason about the correctness of computer programs. Instead of just running the program with some inputs (testing), we use logic to prove it works for *all* possible inputs.

We use the [[work/slidelink|SlideLink]] tool to automatically align these notes with the original lecture slides.

---

## What is a Program Verifier?


A program verifier is a tool that takes two inputs:
1.  **The Program**: The code you want to check (e.g., in C, Java, or Boogie).
2.  **The Specification**: What the program is *supposed* to do (e.g., "no division by zero", "array always in bounds").

The verifier output is either:
- **✓ yes**: The program satisfies the specification.
- **× no**: The program violates the specification (often with a counterexample).

### Typical Specifications
![[pictures/programverification/01/Lecture01_Pg012_Program_Verifier.png]]

- No division by zero.
- Array only accessed within its bounds.
- **Termination**: The program doesn't run forever.
- **Memory safety**: No null pointer dereferences or leaks.
- No `assert` statement is ever violated.

---

## Motivation: Why do we care?
![[pictures/programverification/01/Lecture01_Pg018_Motivation.png]]


Software is everywhere, from your phone to the brakes in your car. 
- **Bugs are expensive**: A bug in a medical device or a spacecraft can be fatal.
- **Complexity is rising**: As software gets more complex, the number of bugs grows exponentially.
- **Testing is limited**: As the slides show, a simple function like `y / (myHash(x) - 23)` might only crash for *one* specific value of `x`. You might never find it by random testing.

### 💡 Intuition: Testing vs. Verification
Imagine you are checking if a floor is safe to walk on.
- **Testing**: You jump on a few spots. If they don't break, you *hope* the rest is fine.
- **Verification**: You check the architectural blueprints and the strength of every single beam. If the math says it holds, it holds everywhere.

---

## Challenges in Verification

Verification isn't easy. There are three main "boss fights" we have to deal with:

### Challenge 1: Undecidability in Program Verification
![[pictures/programverification/01/Lecture01_Pg022_Challenge_1_Undecidability.png]]

The **Halting Problem** tells us we can't write a perfect verifier that works for *every* possible program. 
- **Strategy**: We don't try to solve it for everything. We build tools that are helpful for *most* programs we care about.

### Challenge 2: Semantic Ambiguities in Programming Languages
![[pictures/programverification/01/Lecture01_Pg023_Challenge_2_Ambiguities.png]]

What does `x := -7 / 5` actually do?
- In **C/C++**, it might be `-1`.
- In **Python**, it's `-2`.
- In **Javascript**, it's `-1.4`.

To verify a program, we first need a **precise mathematical semantics** for the language. We can't prove things if the rules keep changing!

### 3. Proofs are Hard to Find
![[pictures/programverification/01/Lecture01_Pg024_Challenge_3_Proofs_Hard_To_Find.png]]

Consider a loop that modifies `x` and `y`. Even if we know the program is correct, finding the **reason** (the "invariant") is hard. 
- **Example**: "The values of x and y are always odd." This simple observation might be the key to the whole proof, but a computer has to "discover" it.

---

## Content of this Course
![[pictures/programverification/01/Lecture01_Pg026_Content_Of_This_Course.png]]


We will cover:
- **Mathematical Logic**: Propositional logic, First-order logic, and **SMT-LIB** (the language used to talk to solvers like Z3).
- **Boostan**: A tiny programming language with perfectly defined rules.
- **Hoare Logic**: A system of rules for "moving" logic through code.
- **Verification Algorithms**: How tools like **Ultimate Automizer** actually work under the hood.

---

## Summary

1. **Program Verification** = Math + Code to prove correctness.
2. **Verifier** takes code and spec, returns Yes or No.
3. **Testing** is not enough for critical systems.
4. **Challenges**: Undecidability, Ambiguity, and the difficulty of finding proofs.
5. We will use **Z3** and **SMT-LIB** to automate our reasoning.

## Self-Check

1. Why is testing fundamentally insufficient for safety-critical systems?

> [!success]- Answer
> Testing only exercises a finite set of inputs, so it can prove the presence of bugs but never their absence. A function like `y / (myHash(x) - 23)` might crash only for one rare input that random testing never hits. Verification reasons about all inputs symbolically through proof, which is what safety-critical software actually needs.

2. What are the two inputs to a program verifier, and what are the two possible outputs?

> [!success]- Answer
> The inputs are the program (in C, Java, Boogie, etc.) and the specification (a logical statement of what should hold, such as no division by zero, in-bounds array access, or no assertion violations). The output is either "yes, the program satisfies the specification" or "no, with a counterexample showing a violating execution".

3. How does the Halting Problem constrain what a program verifier can do?

> [!success]- Answer
> Halting is undecidable, so no verifier can be sound, complete, and always terminating for every program. The lecture's strategy is to give up on universal coverage and instead build tools that are useful for the programs we actually care about, accepting incompleteness or false alarms as a trade-off.

4. Why is precise mathematical semantics a prerequisite for verification?

> [!success]- Answer
> Different languages give different answers for the same expression. The lecture notes that `x := -7 / 5` is `-1` in C, `-2` in Python, and `-1.4` in JavaScript. Without a fixed mathematical meaning for each construct, you cannot prove anything about the program, because the proof would depend on which interpretation you assumed.

5. Why is finding loop invariants considered one of the central challenges of verification?

> [!success]- Answer
> A correct program may rely on a subtle invariant (for example, "x and y are always odd") that the proof system can use mechanically, but that a human or tool has to discover in the first place. The mechanical checking part is straightforward once the invariant is given; the creative step of inventing the right invariant is what makes proofs hard to find.

---
[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/02-propositional-logic|Next: (y-02) Propositional Logic]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
