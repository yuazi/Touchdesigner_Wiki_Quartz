---
title: The Lorenz Attractor
tags:
  - math
  - chaos
  - simulation
  - visual
date: 2026-03-04
---

The Lorenz attractor is one of those rare mathematical objects that stops you mid-thought. It's simple enough to write on a napkin — three coupled differential equations — yet complex enough that no two trajectories ever quite repeat themselves.

$$
\dot{x} = \sigma(y - x)
$$

$$
\dot{y} = x(\rho - z) - y
$$

$$
\dot{z} = xy - \beta z
$$

With $\sigma = 10$, $\rho = 28$, $\beta = \frac{8}{3}$, the system never settles. It orbits one lobe, then flips to the other, endlessly — deterministic in theory, unpredictable in practice.

## Why I find it fascinating

The thing that really gets me is how a tiny difference in starting position — something almost too small to measure — sends the system on a completely different path. It's fully deterministic. No randomness, no dice rolls. And yet you can't predict where it ends up without running the whole simulation. That gap between _deterministic_ and _predictable_ hits different when you see it actually playing out on screen.

It's a good reminder that "having rules" doesn't mean "being in control." A lot of things in life work like that.

The other reason is honestly just that it looks great. There's something about the way the trail keeps folding back on itself — always tracing the same winged shape, never landing on the same point twice — that feels almost alive. It looks like it has intention. That's rare for something that's just three equations running in a loop.

I ended up putting it on the background of this site for that reason — it's a constant reminder that the most interesting things sit right at the edge between structure and unpredictability.

## The Halvorsen attractor

The side attractors on this site use the **Halvorsen system**, a cousin of the Lorenz system with three-fold rotational symmetry:

$$
\dot{x} = -ax - 4y - 4z - y^2
$$

$$
\dot{y} = -ay - 4z - 4x - z^2
$$

$$
\dot{z} = -az - 4x - 4y - x^2
$$

The single parameter $a$ controls the overall shape. Around $a = 1.4$ it settles into a tight, coiling knot — more compact than the Lorenz butterfly but equally restless.

## Tuning it

There's a gear button in the bottom-right corner of this site that lets you adjust both attractors in real time — σ, ρ, β for Lorenz and $a$ for Halvorsen, along with trail length, speed, and particle count. Try dragging ρ below 24 and the system collapses to a fixed point. Bring it back above 24.74 and the chaos returns. That threshold is called the **Hopf bifurcation** — the exact moment order tips into chaos.

[[notes/index|Return to Notes]]
