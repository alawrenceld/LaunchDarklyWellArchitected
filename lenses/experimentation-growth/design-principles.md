# Experimentation / Growth — Design Principles

These principles extend the LDWA [Experimentation pillar's design principles](../../pillars/experimentation/design-principles.md) for teams operating at high experimentation velocity.

---

## EG-1. Experiments are a portfolio

The team's running experiments are a portfolio to be managed — not a list of independent activities. The portfolio has shape, has interactions, has carrying cost, has a desired throughput. Portfolio thinking changes how individual experiments are scoped and timed.

Without portfolio thinking, the team's experiment count grows, individual experiments interfere with each other, and decisions about which experiments to run become reactive instead of strategic.

## EG-2. Concurrency is honest

When experiments overlap — same surface, overlapping audiences, potentially-interacting effects — the team knows. Either stratify (each user is in at most one experiment), accept the interaction (and document the trade-off), or sequence the experiments. Hidden concurrency confounds results; declared concurrency informs interpretation.

## EG-3. Holdouts are deliberate and bounded

Each holdout has a documented purpose, an expected duration, and a defined exit. The team's holdout portfolio is itself reviewed quarterly: which holdouts are still earning their keep? Which can retire? Which should be added?

Holdouts that exist forever, with forgotten purpose, are just lost users from the experiment population.

## EG-4. Every experiment has a decision date

A decision date is set at experiment creation. Past the date, the experiment is decided (ship, kill, extend with rationale) or escalated. Experiments that drift past their decision dates without action are debt.

The team that runs 100 experiments per quarter with no decision discipline accumulates 100 unowned residues per quarter.

## EG-5. Null results are findings

Most experiments don't move the primary metric. That's information: the hypothesis didn't hold, or the effect was smaller than detectable, or the implementation was wrong. Treating null results as failures (and dismissing them, or re-running indefinitely) discards the learning.

The team that publishes a "null results" digest is the team that learns systematically.

## EG-6. Speed comes from infrastructure

The team's experimentation velocity is limited by the slowest step in the experiment lifecycle. For high-velocity teams, that step is usually instrumentation, eval-pipeline configuration, or decision review. Each is solvable by infrastructure: shared metric libraries, templated experiment configurations, decision-capture tooling.

Velocity isn't earned by working harder; it's earned by building the platform.

## EG-7. Personalization is downstream of experimentation

Personalization — serving different experiences to different users based on what works for them — is a separate discipline from experimentation. The two are related: experimentation discovers what works; personalization deploys it. But personalization doesn't replace experimentation, and experimentation doesn't substitute for personalization.

Be clear which discipline applies to a given decision.

## EG-8. Counter-metrics matter more at scale

When the team runs many experiments, the cumulative effect of small individual moves matters. Each experiment that improves the primary metric slightly might degrade a counter-metric slightly. Across the portfolio, the counter-metric trends downward. The team that doesn't track counter-metrics at the portfolio level discovers the cumulative damage too late.

## EG-9. The team's decisions inform the next experiment

A good experiment program builds on itself. Past decisions inform which experiments to run next; null results inform where to stop investing; positive results inform where to invest more. The team that runs experiments without referencing prior ones is solving the same problems repeatedly.

A simple practice: every new experiment writeup references the relevant prior experiments.

## EG-10. Statistical rigor is non-negotiable at volume

At low experimentation volume, occasional rigor lapses (peeking, low-power tests, fishing for segment effects) produce occasional wrong decisions — usually noticeable, often correctable. At high volume, those same lapses produce a steady stream of wrong decisions that shape the product over time. The team's rigor needs to be tighter at higher volume, not looser.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
