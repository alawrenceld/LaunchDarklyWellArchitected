# Pillar: Experimentation & Measurement

> *Every release with a hypothesis is also an experiment. Every experiment is a decision waiting to happen.*

**Status: Phase 2 — draft scheduled, not yet written.**

This pillar covers hypothesis design, metric design (primary / secondary / guardrail), the distinction between rollouts and experiments and guarded releases, sample size and statistical power, holdouts, sequential and multi-arm testing, AI Config experimentation, results interpretation, and decision discipline. It is the pillar that turns shipping into learning.

## When this pillar will be most relevant

- You run A/B tests on customer-facing surfaces.
- You use LaunchDarkly experiments to make product decisions.
- You're rolling out AI Configs and need to compare variations on cost, latency, and quality.
- You ship behind flags but don't always close the loop on whether the change worked.

## Related Phase 1 pillars

- [Safe Release & Progressive Delivery](../safe-release/) — already covers Guarded Releases (the metric-driven rollout cousin of an experiment).
- [Operational Excellence](../operational-excellence/) — already covers the use of LD Observability to close the release loop.
- [Governance](../governance/) — already covers the experiment lifecycle (decision deadlines, post-experiment cleanup).

Until this pillar is published, draw on those pillars for the underlying practice.

## Phase 2 scope

When drafted, this pillar will include:

- Design principles for experimentation.
- Focus areas covering hypothesis, metric design, experiment vs. rollout distinction, sample size, sequential testing, multi-arm patterns, AI Config experimentation, decision review.
- Best practices.
- Review questions.
- Worked examples (good vs. bad experiment setups, including an AI Config example).
- An anti-pattern catalogue.

See the [build plan](../../todo.md) for sequencing.
