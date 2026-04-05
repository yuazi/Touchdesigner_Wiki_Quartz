---
title: "L09 — Ultimate Referee"
tags:
  - program-verification
  - hoare-logic
  - ultimate-referee
  - tools
date: 2025-05-20
---

[[index|Back to Program Verification Index]] | [[08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[10-array-theory-and-arrays-in-boostan|Next: (y-10) Array Theory and Arrays in Boostan]]

## Mental Model for Ultimate Referee
<!-- Review Needed: close slide match for 'Mental Model for Ultimate Referee' (p240: 0.451, p241: 0.446) -->
![[pictures/programverification/09/Lecture09_Pg240_Mental_Model_For_Ultimate_Referee.png]]
![[pictures/programverification/09/Lecture09_Pg241_Mental_Model_For_Ultimate_Referee.png]]


- **Double-Checking Proofs**: Deriving Hoare triples and loop invariants is hard and error-prone. **Ultimate Referee** is a tool that takes your code and candidate invariants and checks if they actually form a valid proof.
- **Verification of Verifiers**: It's not just for students. If a powerful verifier says code is correct, Ultimate Referee can check its "witness" (the invariants it found) to ensure the verifier didn't make a mistake.
- **Focus on the Hard Part**: By using the tool, you can focus on the "guesswork" (finding the invariant) while the tool handles the "mechanical" part (checking the Hoare rules).

## Guide for Finding a Derivation
![[pictures/programverification/09/Lecture09_Pg238_Guide_For_Finding_A_Derivation.png]]


Finding a derivation in the Hoare proof system follows a systematic path:

1.  **Guess** "good" loop invariants for all loops.
2.  **Process sequential composition** from right to left (backwards).
3.  **Use Consequence rules** (strepre/weakpos) only when needed for logic or loops.
4.  **Strengthen preconditions** strictly before loop invariants.

---

## What is Ultimate Referee?
<!-- Review Needed: close slide match for 'What is Ultimate Referee?' (p241: 0.528, p240: 0.484) -->
![[pictures/programverification/09/Lecture09_Pg241_What_Is_Ultimate_Referee.png]]
![[pictures/programverification/09/Lecture09_Pg240_What_Is_Ultimate_Referee.png]]


Ultimate Referee is a tool implemented in the **Ultimate Framework**.
- **Input**: A Boogie program with `invariant` annotations and a correctness specification (pre/post-conditions).
- **Function**: It checks if there is a valid Hoare derivation for the provided invariants.
- **Output**: Either confirms the invariants are correct or provides a **Counterexample** explaining where the logic fails.

### 💡 Example: Too Strong Invariant
![[pictures/programverification/09/Lecture09_Pg242_Example_Too_Strong_Invariant.png]]

If you provide an invariant like `y == 0` for a loop that actually has `y == 1`, the tool might say:
> "Annotation is not valid for all loop-free paths from entry... to loop head."

This tells you exactly which part of the Hoare proof failed (Initial Entry, Inductivity, or Exit).

---

## Concrete Boogie Example

Here is a simple Boogie procedure that calculates a sum. Note the use of `invariant` inside the `while` loop.

```boogie
procedure Sum(n: int) returns (sum: int)
  requires n >= 0;
  ensures sum == n * (n + 1) / 2;
{
  var i: int;
  i := 0;
  sum := 0;

  while (i < n)
    invariant 0 <= i && i <= n;
    invariant sum == i * (i + 1) / 2;
  {
    i := i + 1;
    sum := sum + i;
  }
}
```

### Analyzing Tool Output (Counterexamples)

Ultimate Referee helps you debug your proof by pointing out where the Hoare logic fails:

1.  **Too Weak Invariant**: If you omit `invariant sum == i * (i + 1) / 2;`:
    - **Tool Output**: `Postcondition might not hold.`
    - **Reason**: Without the relation between `sum` and `i`, the verifier "forgets" how `sum` was calculated when the loop exits. It only knows `i == n`, which isn't enough to prove the postcondition.

2.  **Too Strong Invariant**: If you add `invariant sum == 0;`:
    - **Tool Output**: `Inductivity check failed: invariant is not preserved by the loop body.`
    - **Reason**: While `sum == 0` is true at the very start (if `n > 0`), it becomes false after the first iteration where `sum` becomes `1`.

3.  **Invalid Initial Entry**: If you had `invariant i > 0;`:
    - **Tool Output**: `Initial entry failed: invariant does not hold upon entering the loop.`
    - **Reason**: Before the loop, `i` is initialized to `0`, so `i > 0` is false.

---

## Why use it?

1.  **Educational**: Helps students learn what makes a "good" invariant.
2.  **Reliability**: Allows us to check the results of complex, non-transparent verifiers.
3.  **Efficiency**: Reduces the time spent on manual proof checking.

---
[[index|Back to Program Verification Index]] | [[08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[10-array-theory-and-arrays-in-boostan|Next: (y-10) Array Theory and Arrays in Boostan]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
