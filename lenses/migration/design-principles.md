# Migration & Modernization — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for migration workloads.

---

## MIG-1. Every migration has a flag-routing layer

Without a flag in front of the old/new switch, every cutover is a code deploy. With a flag, the cutover is reversible in seconds. The cost of adding the routing layer is small; the value during the migration's lifetime is large.

The team that does a migration without a routing flag has reinvented the big-bang cutover.

## MIG-2. The unit of migration is bounded

Don't migrate too much at once. A migration that touches "the entire checkout flow" is too coarse — break it into the smaller, independently-cuttable pieces. A migration scoped at the right granularity is one whose blast radius is bounded if it fails.

## MIG-3. Shadow before exposing

Before any user sees the new path's output, run the new path on real production traffic for a sample of requests. Compare its output to the old path's. Discrepancies surface in logs; users still see the old path's results. The shadow phase catches bugs the eval set didn't.

For migrations whose blast radius is significant, shadow is mandatory.

## MIG-4. Equivalence is defined explicitly

What does "the new path produces the same result" actually mean for this migration?

- Exact byte-for-byte match (rare; usually impossible for non-trivial migrations).
- Same value under defined equivalence rules (most common).
- Same downstream effect even if intermediate output differs.
- Acceptable variance within a documented tolerance.

Pick one. Document it. Use it to design the shadow-phase comparator.

## MIG-5. Progressive cutover, not big bang

Internal users → 1% → 5% → 25% → 50% → 100%. Each step is a deliberate move with metrics watched and a known rollback. The migration that goes to 100% in one step has all the risk of a deploy with none of the protection of incremental exposure.

Take longer steps than you think you need to. Migrations are not where you optimize for speed.

## MIG-6. The warm period is part of the plan

After 100% on the new path, the old path stays operational for a defined warm period — typically 2 to 8 weeks depending on the migration's criticality. The warm period catches slow-burning issues (regressions that only surface at end-of-month, edge cases that only certain customers hit, downstream systems that took a week to notice).

Removing the old path immediately after 100% means losing the safety net at the moment of highest attention shift.

## MIG-7. Retirement is the win condition

A migration that lives forever in "transitional state" is a permanent fork in the codebase. After the warm period, retire the old path: remove its code, decommission its dependencies, archive its flag. The migration is complete only when the old path is gone.

Half-finished migrations accumulate. Each one was meant to be temporary.

## MIG-8. Data migrations are harder than code migrations

Migrating *code paths* with no underlying data change is the easy case. Migrating *data layouts* — schema changes, storage changes, data layer swaps — introduces irreversibility risk and demands additional patterns (dual-write, dual-read, validation, point-of-no-return decisions). Don't treat data migrations as just bigger code migrations.

## MIG-9. The migration plan survives team turnover

Migrations span months. The team that starts the migration may not be the team that finishes it. The migration plan is documented in a place that survives turnover: the rationale, the scope, the cutover sequence, the rollback procedure, the retirement criteria.

The plan that lives only in someone's head doesn't survive their next role change.

## MIG-10. Org-wide modernization is a portfolio

When the team isn't migrating one system but many — a cloud relocation, a framework rewrite at scale — the migration is a portfolio of smaller migrations. Each migration follows the principles individually; the portfolio adds program-level coordination, shared abstractions, and risk staggering.

The org-wide rule: never have all systems mid-migration simultaneously. Stagger.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
