# Lens: Migration & Modernization

> *Strangler-fig, not big bang. Flags are how you migrate without an outage.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for teams using flags to perform migrations — service rewrites, database cutovers, dependency swaps, framework migrations, infrastructure moves. It is the lens that turns the [Safe Release — blue/green via flags best practice](../../pillars/safe-release/best-practices.md) into a full migration playbook.

## When this lens will apply

- You are migrating from one service, database, framework, or vendor to another.
- You are sunsetting a system and need to do it safely.
- You are running a strangler-fig pattern at scale.
- You need a rollback plan that doesn't depend on a code revert.

## Phase 3 scope

The lens will cover the design of migration flags (multivariate routing between old and new), the discipline of progressive cutover with guardrails, dual-write patterns and their flag controls, the "keep the old path warm" period, validation of equivalence between old and new paths, and the disciplined retirement of the old path after the migration completes.

In the meantime, see [Safe Release — Rollout patterns](../../pillars/safe-release/best-practices.md) (specifically BP-2.3 on blue/green via flags).
