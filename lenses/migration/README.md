# Lens: Migration & Modernization

> *Strangler-fig, not big bang. Flags are how you migrate without an outage.*

The Migration & Modernization Lens specializes LDWA for the most blast-radius-rich category of changes engineering organizations do: replacing systems. Service rewrites, database cutovers, framework migrations, dependency swaps, vendor changes, monolith decompositions, cloud relocations — every meaningful migration risks data loss, downtime, or correctness failures that flags exist to prevent.

This lens operationalizes [Lab 08 — Migration with Flags](../../labs/08-migration-with-flags.md) and the [Safe Release pillar's blue/green via flags pattern](../../pillars/safe-release/best-practices.md) into a complete playbook. The lens covers migrations at every scale — from one service to many, from one team to an org-wide modernization program.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true:

- You're migrating one or more systems from a current implementation to a new one — service rewrites, framework upgrades, database moves, vendor swaps.
- You're decomposing a monolith into services (or recomposing services into a different shape).
- You're cutting over data layers, message buses, or other foundational infrastructure.
- You're sunsetting a system and need an incremental, reversible removal.
- You're running an organization-wide modernization program affecting many systems at once.
- You need a rollback plan that doesn't depend on a code revert or deploy.

If you're not doing a migration, this lens doesn't apply right now — but it will apply someday. Most engineering organizations do a major migration every few years.

## Contents

1. [Design Principles for Migrations](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md)
3. [Strangler-Fig at Scale](./strangler-fig-at-scale.md) — the full migration playbook: scoping, routing flags, shadow phase, progressive cutover, warm period, retirement.
4. [Data & State Migration](./data-and-state-migration.md) — the harder case: migrations that change data layout, not just code paths. Dual-write, dual-read, validation, the cutover decision.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

1. Run the standard pillar review on the system being migrated.
2. Walk this lens's [review questions](./review-questions.md). Pay particular attention to the equivalence validation, warm-period plan, and rollback path.
3. For data-layer migrations, the [Data & State](./data-and-state-migration.md) page is mandatory reading. The pattern there is different from pure code-path migrations.

## The headline principles

- **Every migration has a flag-routing layer.** No exceptions.
- **Shadow before exposing.** The new path runs on real traffic, comparing outputs to the old path, before any user sees its results.
- **Equivalence is defined explicitly.** What does "the new path produces the same answer" actually mean for this migration?
- **Progressive cutover beats big-bang every time.** The blast radius of progressive cutover is bounded; big-bang isn't.
- **The warm period is non-optional.** Keep the old path alive after cutover until the new path has earned permanent trust.
- **Retirement is the win condition.** A migration that never retires the old path didn't complete; it just paused.
- **Data migrations are harder than code migrations.** They demand separate patterns and more care.
