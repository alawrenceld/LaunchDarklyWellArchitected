# Strangler-Fig at Scale

The full migration playbook. This page operationalizes [Lab 08 — Migration with Flags](../../labs/08-migration-with-flags.md) into a complete pattern for migrations of any size, from a single service to an organization-wide modernization program.

The pattern is named after Martin Fowler's "Strangler Fig" — a tree that grows around its host until the host dies, leaving the fig as the dominant structure. The migration starts with the old system; the new system grows alongside it via flag-gated routing; eventually the new system dominates and the old is removed.

---

## The seven phases

A complete migration goes through these phases. Each is a distinct operational state with its own success criteria.

```
┌────────────────────────────────────────────────────────────────────┐
│ 1. Scope and design                                                │
│    Define what's migrating; equivalence rules; rollback plan.      │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 2. Build the routing layer                                         │
│    Flag-gated path between old and new. No new behavior yet.       │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 3. Build the new path                                              │
│    Implement the new system. Test in isolation.                    │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 4. Shadow phase                                                    │
│    Run new path on real traffic; compare outputs; fix divergences. │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 5. Progressive cutover                                             │
│    Move real traffic from old to new in deliberate steps.          │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 6. Warm period                                                     │
│    Stay at 100% on new path; keep old path operational.            │
└────────────────────────────────────────────────────────────────────┘
                              ↓
┌────────────────────────────────────────────────────────────────────┐
│ 7. Retirement                                                      │
│    Remove old path, decommission dependencies, archive the flag.   │
└────────────────────────────────────────────────────────────────────┘
```

Each phase ends with explicit criteria. Phase progression requires the criteria to be met; rollback returns to the previous phase.

---

## Phase 1 — Scope and design

### What to define before any code changes

- **Scope.** What is migrating? Be specific: one endpoint, one service, one data store, one user-facing flow.
- **Equivalence rule.** How does "the new path produces the same result" get defined? Exact match? Same value under a defined normalization? Same downstream effect?
- **Boundary.** What's *not* in scope? Downstream systems consume what gets migrated — confirm they handle the new path correctly.
- **Rollback plan.** What does revert look like? At what phase is revert no longer free (the point of no return)?
- **Success criteria per phase.** What does "ready to move to the next phase" mean?
- **Owners.** Who is accountable for the migration end-to-end?
- **Timeline.** Rough phase-by-phase. Migrations always take longer than estimated — plan accordingly.

This phase produces a migration plan document. For non-trivial migrations, the doc is reviewed by stakeholders before any code is written.

### Sizing the migration

The migration's blast radius determines its size:

- **Small.** Bounded by one service; old and new paths have functional equivalence; no data layout changes; rollback is instant. Run as a normal team activity.
- **Medium.** Cross-team coordination; data migrations involved; rollback has constraints. Needs program-level visibility.
- **Large.** Organization-wide; many systems migrating in concert; vendor or platform changes. Needs dedicated program management; see [Org-wide migration](#org-wide-migration-modernization) below.

---

## Phase 2 — Build the routing layer

### The routing flag

```pseudocode
context = build_context(request, user, tenant)

route = ldclient.stringVariation(
  "migration-<system-name>-routing",
  context,
  "old"  // safe fallback: always route to the old path if LD is unreachable
)

match route:
  case "old":
    return old_path(request)
  case "new":
    return new_path(request)
  case "shadow":
    return shadow_path(request)
  case _:
    log_unexpected_routing_value(route)
    return old_path(request)  // safe default
```

### Configuration

- **Flag key:** `migration-<system-name>-routing`.
- **Description:** the migration's scope from Phase 1.
- **Variations:** `old`, `new`, `shadow` (and optionally `dual-write` if applicable).
- **Default rule:** `old` (until rollout begins, everyone is on the old path).
- **Off variation:** `old`.
- **Tags:** `migration`, `team:<team>`, `system:<system>`, `lifecycle:release-temporary`.

The new path code exists but is never called until the flag routes to it.

---

## Phase 3 — Build the new path

Implement the new system. Test it in isolation: unit tests, integration tests against fakes / test environments, performance tests against expected load.

The new path's output must satisfy the equivalence rule from Phase 1. Tests assert this on representative inputs.

**Exit criteria:** the new path is feature-complete, tested in isolation, and ready to run on real production traffic in shadow mode.

---

## Phase 4 — Shadow phase

The most under-used migration phase. The most valuable.

### The shadow code path

```pseudocode
case "shadow":
  // Run both paths on real production traffic
  old_result = old_path(request)
  try:
    new_result = new_path(request)
    if not equivalent(old_result, new_result):
      log_divergence(request, old_result, new_result, context)
      record_divergence_metric(context.tenant_id)
  except Exception as e:
    log_shadow_path_failure(request, e, context)
  return old_result  // users still see the old path's result
```

### What the shadow phase catches

- Incorrect output on edge cases not covered by tests.
- Performance regressions on real workload shapes.
- Provider-specific or data-specific bugs that staging didn't exercise.
- Race conditions that only appear under real concurrency.
- Subtle data-layer differences (encoding, timezone, precision).

### Operating shadow

Roll out shadow gradually: 1% → 10% → 100%. Watch divergence rate. Investigate every meaningful divergence — fix bugs in the new path, refine the equivalence rule, or document acceptable variances.

**Exit criteria:** divergence rate is at or below acceptable threshold (typically near-zero for hard-equivalence migrations, defined tolerance for soft-equivalence). Team confidence to expose users to the new path.

---

## Phase 5 — Progressive cutover

Move real traffic from old to new in deliberate steps.

### The standard cutover sequence

| Step | Audience | Observation window | Exit criteria |
|---|---|---|---|
| Internal | Engineers using their own accounts | Hours | No issues observed |
| Dogfood | Internal users (employees) | 1-2 days | Error rate ≤ old path; no escalations |
| 1% production | Random 1% of customers | 1-3 days | Same |
| 5% production | Random 5% | 2-5 days | Same |
| 25% production | Random 25% | 3-7 days | Same |
| 50% production | Random 50% | 1 week | Same |
| 100% production | All customers | Continuous | Migration complete; begin warm period |

The steps and timings vary per migration. Higher-risk migrations move slower; lower-risk faster.

### Per-step guardrails

At each step, watch:

- **Error rate** on the migrated surface (old path baseline vs. new path observed).
- **Latency p95** (often higher on the new path; acceptable up to a documented tolerance).
- **Downstream success metrics** (the business-meaningful outcomes the change should not regress).
- **Customer-success ticket rate** (for B2B; for B2C, equivalent customer-feedback signals).
- **Per-tenant or per-cohort variance** — sometimes a migration works for most customers but breaks for some.

Configure a guarded rollout if the migration is high-risk; the rollout reverts automatically on regression.

### Cohort-based cutover (B2B variant)

For B2B SaaS, cutover often happens per-tenant rather than by percentage:

| Step | Audience |
|---|---|
| Internal | Engineer accounts |
| Dogfood | Internal customer account |
| Design-partner cohort | A few customers who agreed to early migration |
| Friendly customers | Customers known to give feedback |
| Free / lower-tier customers | Larger cohort, lower blast risk |
| Mid-tier customers | Larger cohort still |
| Enterprise customers | Most cautious cohort, often migrated last |
| All customers | Migration complete |

### Per-customer go-live decisions

For very-high-stakes migrations (financial systems, regulated workloads), each customer's cutover may require an explicit go-live decision: a meeting, an approval, a notification. The migration flag's targeting changes per-customer based on these decisions.

---

## Phase 6 — Warm period

After 100% on the new path, the migration is *not* complete. The warm period catches what cutover missed.

### What "warm" means

- The old path's code stays in production. The new path's code calls it via the routing flag (which now sends 100% to new).
- The old path's dependencies stay operational: old database, old service endpoints, old credentials. Nothing decommissioned.
- The migration flag stays configurable; flipping it back to `old` returns all traffic to the old path instantly.

### The warm period's length

Typical durations:

- **Low-risk migrations:** 1-2 weeks.
- **Standard migrations:** 2-4 weeks.
- **High-risk migrations:** 4-8 weeks.
- **Critical-path / regulated migrations:** 8+ weeks, often quarter-aligned.

The duration is chosen to span any periodic effects the migration might trigger (end-of-month reporting, quarter close, peak traffic events).

### What to watch during warm period

- The same metrics as during cutover.
- New metrics that wouldn't have been visible at lower exposure (long-tail behaviors, periodic effects).
- Customer feedback (support tickets, surveys, NPS shifts).
- Downstream system health (other systems that depend on the migrated one).

### Exit criteria

- The new path has been at 100% for the warm period's full duration.
- No periodic event has triggered an unexpected behavior.
- The team is confident the migration is sound.
- Stakeholders approve moving to retirement.

---

## Phase 7 — Retirement

The migration's win condition.

### What to remove

- **The old path's code.** Delete it. Don't comment it out; delete it.
- **The routing layer.** Inline the new path's call directly. The migration flag is now serving 100% to a single variation — there's no decision to make.
- **The old path's dependencies.** Decommission the old database, deprecated service endpoints, old credentials. Free the resources.
- **The migration flag.** Archive it after the old path's code is removed.
- **The shadow code path.** It served its purpose; delete it.

### Order of operations

1. Remove old path references from current code. Deploy.
2. Wait one deploy cycle.
3. Decommission old path's dependencies.
4. Archive the migration flag.
5. Document the migration's completion in the team's records.

### What can go wrong during retirement

- An old path dependency turns out to be in use by another team. (Discover this in Phase 1, not Phase 7.)
- Customers reference the old path's endpoints directly. (Same — discover this in Phase 1.)
- Cached references in deployed code. (Wait the right number of deploy cycles.)
- Audit-log or compliance retention obligations on old-path data. (Plan retention separately from operational decommission.)

---

## Org-wide migration / modernization

When the team is migrating many systems at once — a cloud relocation, a framework rewrite, a vendor change — the program needs additional coordination.

### Program-level patterns

- **Migration registry.** A central list of every system in scope, its current phase, its owner, its target date.
- **Shared routing-flag conventions.** All migration flags follow the same naming (`migration-<system>-routing`), the same tagging, the same lifecycle.
- **Shared abstractions.** A wrapper library that hides the routing logic, so application teams adopt the migration without rewriting their LD code.
- **Staggered cutover.** Not all systems migrate simultaneously. The risk posture is "never have all systems in Phase 5 at once."
- **Program-level monitoring.** Dashboards showing migration progress across all in-scope systems.
- **Standardized phase exits.** Each system's phase exit follows the same criteria so the program can apply consistent gating.

### Common org-wide migration types

- **Cloud relocation** (e.g., on-prem to AWS, AWS to GCP). Each service is a migration; the program coordinates them.
- **Monolith decomposition.** Each extracted capability is a migration from monolith to its new service.
- **Vendor change** (e.g., authentication system swap, payment processor change). Often touches many services that integrate with the vendor.
- **Framework / language migration.** Each codebase or service is a migration to the new framework / language.

In all of these, the lens applies system-by-system, with the program-level wrapper providing coordination.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Data & State Migration](./data-and-state-migration.md)
