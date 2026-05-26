---
title: "L09  -  Ultimate Referee"
tags:
  - program-verification
  - hoare-logic
  - ultimate-referee
  - tools
date: 2026-05-22
---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[/notes/lectures/programverification/10-array-theory-and-arrays-in-boostan|Next: (y-10) Array Theory and Arrays in Boostan]]

## Mental Model for Ultimate Referee

- **Double-Checking Proofs**: Deriving Hoare triples and loop invariants is hard and error-prone. **Ultimate Referee** is a tool that takes your code and candidate invariants and checks if they actually form a valid proof.
- **Verification of Verifiers**: It is not just for students. If a powerful verifier says code is correct, Ultimate Referee can check its "witness" (the invariants it found) to ensure the verifier did not make a mistake.
- **Focus on the Hard Part**: By using the tool, you can focus on the "guesswork" (finding the invariant) while the tool handles the "mechanical" part (checking the Hoare rules).

## Guide for Finding a Derivation in the Hoare Proof System

![[pictures/programverification/09/Lecture09_Pg238_Guide_For_Finding_A_Derivation.png]]

Finding a derivation in the Hoare proof system follows a systematic path. The slide lays out the Hoare rules (assignment, composition, strepre, weakpos, conditional, while) on the left and the procedure on the right:

1. **Guess** "good" loop invariants for all loops.
2. **Use (weakpos)** only for equivalence transformations.
3. **Process sequential composition** from right to left (backwards).
4. **Strengthen preconditions** strictly only before loop invariants.
5. Apart from that, use the (strepre) and (weakpos) rules only for equivalence transformations.

Finding a derivation usually involves a lot of backtracking, and you often discover late that your loop invariants were not sufficient. The motivation for the next subsection is to automate the mechanical parts so the human can focus on the guesswork.

## Ultimate Referee

![[pictures/programverification/09/Lecture09_Pg241_Ultimate_Referee.png]]

Ultimate Referee is a tool for checking loop invariants. It takes as input:

- a Boogie program where each loop is annotated with a formula (the potential loop invariant), and
- a correctness specification (for example, a precondition-postcondition pair).

It checks if there is some derivation in the Hoare proof system where the formulas are loop invariants of the respective while rules.

- Implemented in the **Ultimate framework**.
- Source code available on GitHub.
- Available via a web interface.

### Ultimate Referee and Boogie

![[pictures/programverification/09/Lecture09_Pg242_Ultimate_Referee_And_Boogie.png]]

The Boogie input uses the `invariant` keyword inside each while loop to state candidate invariants. The slide's small example:

```boogie
procedure main(i, j: int) returns (x, y: int)
  requires true;
  ensures (i == j) ==> (y == 0);
{
  x := i;
  y := j;
  while (x != 0)
    invariant y == 0;
  {
    x := x - 1;
    y := y - 1;
  }
}
```

The candidate invariant `y == 0` is too strong (after the loop runs once it becomes false), so the tool replies:

> Annotation is not valid for all loop-free paths from entry of procedure main to loop head at line 7. One counterexample starts in i=1, j=2 and ends in i=1, j=2, x=1, y=2.

The counterexample tells you exactly which part of the Hoare proof failed (initial entry, inductivity, or exit).

### Ultimate Referee: Outlook

![[pictures/programverification/09/Lecture09_Pg243_Ultimate_Referee_Outlook.png]]

Ultimate Referee was not built only to help students construct derivations:

- It can check the results of other verification tools.
- If verification tool XYZ claims your code is correct, ask XYZ to output the loop invariants it found, then double-check that witness with Ultimate Referee.
- This is slightly different from the witness validation implemented in Ultimate itself: the standard witness validator is more lenient and tries to complete proofs that are incomplete, whereas Ultimate Referee insists on a strict Hoare derivation for the provided invariants.

## Concrete Boogie Example

A slightly larger Boogie procedure that calculates a sum. Note the use of `invariant` inside the `while` loop.

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

1. **Too Weak Invariant**: If you omit `invariant sum == i * (i + 1) / 2;`:
   - **Tool Output**: `Postcondition might not hold.`
   - **Reason**: Without the relation between `sum` and `i`, the verifier "forgets" how `sum` was calculated when the loop exits. It only knows `i == n`, which is not enough to prove the postcondition.

2. **Too Strong Invariant**: If you add `invariant sum == 0;`:
   - **Tool Output**: `Inductivity check failed: invariant is not preserved by the loop body.`
   - **Reason**: While `sum == 0` is true at the very start (if `n > 0`), it becomes false after the first iteration where `sum` becomes `1`.

3. **Invalid Initial Entry**: If you had `invariant i > 0;`:
   - **Tool Output**: `Initial entry failed: invariant does not hold upon entering the loop.`
   - **Reason**: Before the loop, `i` is initialized to `0`, so `i > 0` is false.

## Why use it?

1. **Educational**: Helps students learn what makes a "good" invariant.
2. **Reliability**: Allows us to check the results of complex, non-transparent verifiers.
3. **Efficiency**: Reduces the time spent on manual proof checking.

## Self-Check

1. What two inputs does Ultimate Referee take, and what does it check?

> [!success]- Answer
> A Boogie program whose loops are annotated with candidate invariants using the `invariant` keyword, and a correctness specification (typically a `requires`/`ensures` pair). It checks whether there is some Hoare derivation that uses the given formulas as loop invariants of the respective while rules.

2. According to the "Guide for Finding a Derivation," in which direction should sequential composition be processed, and why?

> [!success]- Answer
> Right to left, i.e., backwards. The assignment axiom is a backward rule (substitute into the postcondition), so chaining assignments naturally proceeds from the end of the program toward the start. Each step turns a postcondition into the precondition that must hold just before that statement.

3. For the `Sum(n)` example, the invariant `invariant sum == 0;` is rejected with "inductivity check failed". Why?

> [!success]- Answer
> Inductivity asks: assuming the invariant holds before an arbitrary iteration, does it still hold after one iteration of the body? After the first iteration the body executes `i := i + 1; sum := sum + i`, so `sum` becomes 1. The invariant `sum == 0` no longer holds, so the body fails to preserve it.

4. How does Ultimate Referee's strictness differ from the witness validator built into Ultimate?

> [!success]- Answer
> Ultimate Referee insists on a strict Hoare derivation using exactly the given invariants. The standard witness validator is more lenient: it tries to complete partial proofs by filling in missing pieces. Referee is therefore useful when you want to confirm that the invariants alone are enough, not just that some proof exists.

5. Match each Referee error message to the part of the Hoare while rule it points at: "Initial entry failed", "Inductivity check failed", "Postcondition might not hold".

> [!success]- Answer
> "Initial entry failed" means the invariant does not hold when the loop is reached: the precondition does not imply $\varphi$. "Inductivity check failed" means $\{\varphi \wedge expr\}\ st\ \{\varphi\}$ is not derivable. "Postcondition might not hold" means $\varphi \wedge \neg expr$ on exit is not strong enough to imply the desired postcondition.

---

[[/notes/lectures/programverification/index|Back to Program Verification Index]] | [[/notes/lectures/programverification/08-hoare-proof-system|Previous: (y-08) Hoare Proof System]] | [[/notes/lectures/programverification/10-array-theory-and-arrays-in-boostan|Next: (y-10) Array Theory and Arrays in Boostan]] | [[notes/index|(y) Return to Notes]] | [[/index|(y) Return to Home]]
