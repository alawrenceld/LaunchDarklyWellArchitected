# Pillar: Safe Release & Progressive Delivery

> *Every change to user-facing behavior should be small, measurable, and reversible in seconds.*

The Safe Release pillar is the pillar most engineers reach for first. It covers everything between "the code is deployed" and "the feature is in every user's hands": targeting, rollout patterns, guarded releases, release pipelines, AI Config rollouts, kill switches, defaults, and scheduled changes.

A well-architected system treats every change to runtime behavior as a *progressive*, *measurable*, *reversible* event. Deploys are routine. Releases are deliberate.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md) — the seven principles specific to Safe Release.
2. [Definition](./definition.md) — focus areas inside the pillar.
3. [Best Practices](./best-practices.md) — what to do, organized by focus area.
4. [Review Questions](./review-questions.md) — diagnostic questions for a LDWA review.
5. [Anti-Patterns](./anti-patterns.md) — common ways this pillar goes wrong.

## When this pillar is most relevant

- You release features to production frequently and want to know that each release is safe.
- You have had an incident that started "we shipped X and it broke for everyone."
- You are introducing LaunchDarkly to a team that has historically used long-lived branches and big-bang releases.
- You are rolling out a sensitive, regulated, or high-blast-radius change.
- You are swapping a model or prompt in an AI feature.

## Related pillars

- **Reliability** — covers what happens when the LD layer itself is impaired. Safe Release covers what you ship; Reliability covers how it stays up.
- **Experimentation** — every release with a hypothesis is also an experiment. The boundary is a judgment call; both pillars are usually relevant for high-impact changes.
- **Governance** — defines who can release what, with whose approval. Safe Release defines *how* you release; Governance defines *who* releases.
