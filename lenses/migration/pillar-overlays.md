# Migration & Modernization — Pillar Overlays

How each pillar specializes for migration workloads.

---

## Safe Release & Progressive Delivery

**Migration overlay** — the central pillar for this lens.
- Migration uses **multivariate flags** (old / new / shadow) rather than boolean. Multiple states are needed; boolean is wrong.
- Progressive exposure scales differently than feature rollouts: the steps are smaller, the observation windows longer.
- Guarded releases attach **equivalence-violation rate** as a guardrail in addition to standard error and latency metrics. A divergence between old and new output is a signal as important as an error.
- Per-tenant or per-customer cutover (for B2B workloads) lets the team migrate one customer at a time, with explicit per-customer go-live decisions.

---

## Operational Excellence

**Migration overlay:**
- The "flags in motion" dashboard shows migration-routing flag state alongside other flags — but more prominently, since migration state changes more slowly and is more impactful.
- Runbooks for migrating systems include the migration-rollback procedure: which flag setting reverts to the old path, who needs to know, what to verify after.
- Migration progress is itself a metric. "Percentage on the new path" is trended. Sudden movement in either direction is an event.
- Capacity considerations: during a migration, the team operates *both* the old and new paths. Capacity planning accounts for the union.

---

## Security & Compliance

**Migration overlay:**
- For regulated workloads, the migration plan and the cutover decisions are change-managed: approvals, scheduled changes, documented review. The migration is a release with extra rigor.
- Data migrations may require regulator notification: a change in where regulated data is stored, processed, or accessed is reportable in some regimes.
- The audit chain spans both old and new paths during the migration. Audit logs from both systems flow into the central destination.

---

## Reliability & Resilience

**Migration overlay** — high-priority for this lens.
- Migrations are high-blast-radius operations. The reliability discipline tightens: more aggressive guardrails, longer observation windows, more thorough drills.
- The "old path warm" period is itself a reliability investment — keeping a working alternative path live until the new one has earned permanent trust.
- For multi-region or multi-cloud migrations, the cutover may happen in stages by region. The reliability posture is that all regions are not migrating simultaneously.
- Drill the rollback. The migration's rollback isn't a hypothesis; it's a tested capability that should be exercised at least once before peak cutover.

---

## Governance & Artifact Lifecycle

**Migration overlay:**
- Migration flags follow the standard artifact discipline (owner, retirement plan), with one twist: they retire on a specific event (the migration completes and the warm period ends), not after a generic "we're done."
- Tag migration flags: `migration:<system>` or similar. Bulk operations and dashboards filter on this.
- Code References ensures the cutover removes references to the migration flag from both the old code (removed entirely) and the new code (the routing logic itself can be removed once the migration is done).
- The Governance pillar's archival discipline applies to migration flags too — they retire after retirement, with documented rationale.

---

## Experimentation & Measurement

**Migration overlay:**
- Migrations are not experiments. They have an outcome (the new path), not a decision. Don't conflate them.
- However, migrations *can* be evaluated experimentally: does the new path's latency / cost / quality match or beat the old path? The equivalence question can be framed as an experiment in some cases (especially when "equivalent" is a metric range, not a binary).
- Holdouts during migration: a small set of users (or tenants) kept on the old path for a longer period after cutover, to measure long-term differences and provide a rollback safety reserve.

---

## Performance & Cost Efficiency

**Migration overlay:**
- During the migration, both paths cost. Plan for the doubled cost during shadow phase, the gradually-shifting cost during cutover, and the warm-period cost. Budget accordingly.
- Migration done well saves cost long-term. Migration done badly costs forever (the warm period that never ends, the old path that never retires).
- Performance regressions on the new path are usually caught in shadow, but always confirmed in actual cutover. Latency budgets are tighter during migration than steady-state.

---

## Developer Experience & Velocity (Lens overlap)

**Migration overlay:**
- The migration flag is one of the few flags that should be reflected in code as a deliberate routing decision, not abstracted away. Engineers reading the code should see the migration.
- Tests cover both paths during migration. The CI matrix grows.
- Local dev defaults to the new path (so the team dogfoods what they're shipping), with a switch to test the old path.

---

← [Design Principles](./design-principles.md) | Continue to → [Strangler-Fig at Scale](./strangler-fig-at-scale.md)
