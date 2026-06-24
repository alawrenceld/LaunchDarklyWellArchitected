# Pillar: Experimentation & Measurement

> *Every release with a hypothesis is also an experiment. Every experiment is a decision waiting to happen.*

The Experimentation pillar covers how the team designs experiments, picks metrics, runs them with statistical rigor, and converts results into decisions. It is the pillar that turns shipping into learning — and the pillar that distinguishes teams that *know* a feature worked from teams that *hope* it did.

This pillar overlaps with Safe Release (which covers Guarded Releases — the metric-driven rollout cousin of an experiment) and with Operational Excellence (which covers post-release feedback loops via observability). Experimentation is where the rigorous treatment of metrics, hypotheses, and decisions lives.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 2 |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md) — the principles specific to Experimentation.
2. [Definition](./definition.md) — focus areas inside the pillar.
3. [Best Practices](./best-practices.md) — what to do, organized by focus area.
4. [Review Questions](./review-questions.md) — diagnostic questions for a LDWA review.
5. [Anti-Patterns](./anti-patterns.md) — common ways this pillar goes wrong.

## When this pillar is most relevant

- You run A/B tests on customer-facing surfaces.
- You're using LaunchDarkly experiments to make product decisions.
- You're rolling out AI Configs and need to compare variations on cost, latency, and quality.
- You ship behind flags but don't always close the loop on whether the change worked.
- You've had — or want to avoid — decisions made on noisy or misleading data.

## Related pillars

- **Safe Release** — covers Guarded Releases, the metric-driven rollout cousin of an experiment. The boundary is a judgment call; both pillars are usually relevant for high-impact changes.
- **Operational Excellence** — covers the *operational* feedback loop on releases (LD Observability, post-release review). Experimentation covers the *statistical* feedback loop.
- **Governance** — covers the experiment lifecycle (decision deadlines, cleanup after decisions).
- **AI/GenAI Lens** — covers experimentation specific to AI Configs.

## The headline principles

- **Every meaningful change has a hypothesis.** Before you ship, state what you expect to happen.
- **Metrics are designed, not chosen reflexively.** A guardrail you don't believe in is no guardrail at all.
- **Power matters.** An underpowered experiment is a misleading experiment.
- **Decisions are pre-committed.** What would make you keep this? What would make you kill it? Decide before you see the data.
- **Holdouts exist for a reason.** Long-term effects only show up in long-term measurements.
- **Every experiment ends with a decision.** Experiments that run forever are debt, not data.
