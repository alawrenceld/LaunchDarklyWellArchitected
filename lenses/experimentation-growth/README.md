# Lens: Experimentation / Growth

> *When experimentation is the workload, not the side dish.*

The Experimentation / Growth Lens specializes LDWA for teams whose primary use of LaunchDarkly is **experimentation at scale**: growth teams, product-led-growth orgs, conversion-optimization teams, and any team running so many experiments that the experimentation program itself is a system to be operated.

For most teams, experimentation is one thing they do. For growth-oriented teams, it's the thing they do — sometimes hundreds of experiments per quarter, sometimes with overlapping audiences, sometimes with sophisticated interaction patterns. The patterns that work for a few experiments per quarter don't scale to that volume; this lens documents what does.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true:

- You run **many experiments concurrently** — dozens per quarter or more.
- Your team's **primary KPI is conversion, engagement, retention, or growth** of some kind.
- You use **holdouts at scale** — multiple holdouts running, each measuring different long-run effects.
- You run **multi-armed bandits** or other adaptive designs.
- You operate **personalization on top of experimentation** — features tuned per cohort, learned from experimentation history.
- Your team has a dedicated **experimentation function** (growth engineering, growth product, experimentation platform).

If experimentation is something you do occasionally, the [Experimentation pillar](../../pillars/experimentation/) is the right primary reference. This lens is for teams operating at higher experimentation velocity.

## Contents

1. [Design Principles for High-Volume Experimentation](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md)
3. [Portfolio Management](./portfolio-management.md) — running many concurrent experiments without confounds; interaction tracking; decision cadence.
4. [Growth-Team Patterns](./growth-team-patterns.md) — the operating model for experimentation-heavy organizations; the relationship between experimentation and personalization.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

1. Run the standard [Experimentation pillar review](../../pillars/experimentation/review-questions.md).
2. Walk this lens's [review questions](./review-questions.md). Focus on portfolio-level concerns: interaction management, holdout governance, decision velocity.
3. Many growth-team findings will surface around **Governance** (experiment lifecycle at high volume) and **Performance & Cost** (event volume from many experiments).

## The headline principles

- **Experiments are a portfolio, not a list.** Manage them as one.
- **Concurrency is honest.** Track which experiments overlap; stratify or accept and document.
- **Every experiment has a decision date.** Past the date, the experiment is decided or escalated.
- **Holdouts measure compounding effects.** Run them deliberately, document their purpose, retire them when their job is done.
- **The team learns from null results.** Most experiments don't move the needle; that's information.
- **Speed comes from infrastructure.** Eval pipelines, metric libraries, experiment templates — the platform team builds; the growth team runs.
- **Personalization is not the same as experimentation.** Be clear which discipline applies to a given decision.
