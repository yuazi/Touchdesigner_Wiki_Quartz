---
title: "The Lorenz Attractor"
tags:
  - math
  - chaos
  - simulation
  - visual
date: 2026-03-04
---

![Lorenz Attractor](/pictures/lorenz_8k_textured.png)

The Lorenz attractor is one of those rare mathematical objects that stops you in the middle of a thought. It is simple enough to write on a napkin, three coupled differential equations, yet complex enough that no two trajectories ever quite repeat themselves.

$$
\dot{x} = \sigma(y - x)
$$

$$
\dot{y} = x(\rho - z) - y
$$

$$
\dot{z} = xy - \beta z
$$

With $\sigma = 10$, $\rho = 28$, $\beta = \frac{8}{3}$, the system never settles. It orbits one lobe, then flips to the other, endlessly. It is deterministic in theory but unpredictable in practice.

## Why I find it fascinating

The thing that really gets me is how a tiny difference in starting position, something almost too small to measure, sends the system on a completely different path. It is fully deterministic. No randomness, no dice rolls. And yet you cannot predict where it ends up without running the whole simulation. That gap between _deterministic_ and _predictable_ hits different when you see it actually playing out on screen.

It is a good reminder that "having rules" does not mean "being in control." A lot of things in life work like that.

The other reason is honestly just that it looks great. There is something about the way the trail keeps folding back on itself, always tracing the same winged shape and never landing on the same point twice, that feels almost alive. It looks like it has intention. That is rare for something that is just three equations running in a loop.

I ended up putting it on the background of this site for that reason. It is a constant reminder that the most interesting things sit right at the edge between structure and unpredictability.

> **Hands-on Interaction**: I built **[[work/attractormediapipe|AttractorMediaPipe]]**, a gestural instrument that lets you "touch" and rotate these mathematical attractors using real-time hand tracking.

## The Halvorsen attractor

The side attractors on this site use the **Halvorsen system**, a cousin of the Lorenz system with three fold rotational symmetry:

$$
\dot{x} = -ax - 4y - 4z - y^2
$$

$$
\dot{y} = -ay - 4z - 4x - z^2
$$

$$
\dot{z} = -az - 4x - 4y - x^2
$$

The single parameter $a$ controls the overall shape. Around $a = 1.4$ it settles into a tight, coiling knot. It is more compact than the Lorenz butterfly but equally restless.

## Tuning it

There is a gear button in the bottom right corner of this site that lets you adjust both attractors in real time for σ, ρ, β for Lorenz and $a$ for Halvorsen, along with trail length, speed, and particle count. Try dragging ρ below 24 and the system collapses to a fixed point. Bring it back above 24.74 and the chaos returns. That threshold is called the **Hopf bifurcation**, the exact moment order tips into chaos.

<button class="chaos-trigger" onclick="document.dispatchEvent(new CustomEvent('lorenz-chaos'))">Trigger Chaos Mode 🌀</button>

<style>
.chaos-trigger {
  background: var(--secondary);
  color: var(--light);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;
  margin-top: 1rem;
  transition: transform 0.1s ease;
}
.chaos-trigger:active {
  transform: scale(0.95);
}
</style>

---
[[notes/index|(y) Return to Notes]] | [[notes/random/index|(y) Return to Random Hub]] | [[/index|(y) Return to Home]]
