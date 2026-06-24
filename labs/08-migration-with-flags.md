# Lab 08 — Migration with Flags

**Pillars:** Safe Release, Reliability, Operational Excellence
**Time:** depends on the migration; the lab pattern is reusable indefinitely
**Difficulty:** Intermediate / Advanced

---

## What you'll build

A safe, reversible migration from an old code path to a new one — using flags as the routing mechanism. The pattern applies whether you're migrating a service, a database, a framework, a third-party dependency, or an API client.

By the time you're done you will have:

- A multivariate flag routing traffic between the old and new path.
- Equivalent-output verification while both paths are alive.
- A progressive cutover with metrics that gate each step.
- A "keep the old path warm" period after the new path is at 100%.
- A disciplined retirement of the old path when the migration is done.

This is the **strangler-fig** pattern from Safe Release BP-2.3 (and the broader [Migration & Modernization Lens](../lenses/migration/) when that ships in Phase 3). Migrations are the highest-blast-radius changes most engineering teams do; this lab is the safety net.

---

## Prerequisites

- A real (or realistic) migration in scope. The lab is most useful applied to an actual migration; the pattern generalizes.
- A test application or service you can modify to add the routing layer.
- The ability to observe metrics on both paths (latency, errors, correctness signals).
- An understanding of the migration's blast radius — what's the worst case if the new path is wrong?

---

## Step 1 — Define what you're migrating

Be specific:

- **Old path:** the current code, service, database, or dependency.
- **New path:** the target.
- **Boundary:** what slice of behavior is in scope. (A migration that tries to do too much at once is a migration that fails halfway.)
- **Equivalence definition:** what does "the new path produces the same result as the old path" mean? For some migrations it's exact-match. For others (e.g., service rewrites), it's "produces correct output even if internals differ."
- **Rollback condition:** what would make the team revert?

Write this down. Keep it visible during the migration.

**Why this matters:** migrations succeed in proportion to how clearly the team can articulate them. Vague migration scope produces drift and confusion.

---

## Step 2 — Create the routing flag

In LaunchDarkly, create a multivariate flag (or boolean if there are only two paths):

- **Key:** `migration-<what>-routing` (e.g., `migration-checkout-routing`, `migration-userdb-routing`).
- **Description:** the migration's scope from Step 1.
- **Variations:**
  - `old` — route to the old path.
  - `new` — route to the new path.
  - (Optional) `dual-write` or `shadow` — write to both, return the old result, for validation.
- **Default rule (fallthrough):** `old`. Until the rollout begins, all traffic stays on the existing path.
- **Off variation:** `old`. The off state is the safe state.
- **Tags:** `migration`, `team:<your team>`, `system:<system>`, `type:operational`.

---

## Step 3 — Wire the routing into the application

```pseudocode
context = build_context(request, user)

route = ldclient.stringVariation("migration-checkout-routing", context, "old")

match route:
  case "old":
    return old_path(request)
  case "new":
    return new_path(request)
  case "shadow":
    old_result = old_path(request)
    try:
      new_result = new_path(request)
      compare_and_log(old_result, new_result, context)
    except Exception as e:
      log_shadow_failure(e, context)
    return old_result  # users still see the old path during shadow
```

The shadow variation is optional but valuable for high-blast-radius migrations: you run the new path for real traffic, compare its output to the old path, and log discrepancies — all without exposing users to the new path's results until you're confident.

**Why this matters:** the routing layer is what makes the migration reversible per-request, in seconds, without code deploys. See [Safe Release BP-2.3](../pillars/safe-release/best-practices.md).

---

## Step 4 — Validate equivalence (the shadow phase)

Before exposing users to the new path:

1. Roll out the `shadow` variation to a portion of traffic (start at 1%, expand to whatever sample size gives you statistical confidence).
2. The shadow code runs the new path and compares outputs against the old path.
3. Discrepancies are logged with enough context to investigate (input, old output, new output).
4. The team reviews the discrepancy log and resolves each:
   - Bug in the new path → fix.
   - Expected behavior difference → document and decide whether it's acceptable.
   - Edge case the old path handles incorrectly → migration is also an opportunity to fix it.

Continue shadow mode until discrepancies are near-zero or all known.

**Why this matters:** shadow is the cheapest way to find bugs in the new path. Bugs found here are bugs that don't reach users. For migrations with subtle correctness implications (data migrations, financial calculations, search results), skip this phase at your peril.

---

## Step 5 — Define the guardrails

For the actual cutover, attach metrics:

- **Latency** on the surface being migrated. The new path should not be meaningfully slower.
- **Error rate** on the surface. Provider errors, dependency failures, anything that propagates to users.
- **Business signal** for the affected feature. Conversion, completion rate, success metric. The new path should not regress this.
- **Cost** if applicable (e.g., a migration that changes resource consumption).

Set thresholds that would justify a rollback. Configure a guarded rollout if the migration warrants it.

**Why this matters:** equivalent output is necessary but not sufficient. Latency and error-rate regressions happen even when output is correct. See [Safe Release BP-3.2](../pillars/safe-release/best-practices.md).

---

## Step 6 — Run the progressive cutover

Move traffic from `old` to `new` deliberately:

1. **Internal / dogfood.** Target only internal users via a segment.
2. **1% of production.** Watch metrics for a full traffic cycle (often 24 hours).
3. **5%.** Watch.
4. **25%.** Watch.
5. **50%.** Watch.
6. **100%.** Hold here for a defined warm period before retiring the old path.

At each step, the guardrails gate progression. A regression stops the rollout and (in a guarded rollout) reverts traffic to `old`.

Take longer steps than you think you need to. Migrations are not the place to optimize for speed.

**Why this matters:** migrations are the highest-blast-radius routine changes. Rush them and the blast lands on users. See [Safe Release BP-2.2](../pillars/safe-release/best-practices.md).

---

## Step 7 — Keep the old path warm

After 100% on the new path:

- **Don't immediately delete the old path.** Hold it in place, kept warm, for a defined period — typically 2–6 weeks depending on the migration.
- **Don't decommission the old path's dependencies** during this period (old database, old service, old credentials).
- **Maintain the ability to flip the flag back to `old`** if a delayed problem surfaces.

The warm period catches the slow-burning issues: a regression that only shows up at end-of-month, a corner case that only certain customers hit, a downstream system that took a week to notice the change.

**Why this matters:** ten minutes after the migration completes, the team's attention shifts. Two weeks later, the issue surfaces. The warm period is the safety net for that. See [Safe Release BP-2.3](../pillars/safe-release/best-practices.md).

---

## Step 8 — Retire the old path

When the warm period passes and the team is confident:

1. **Remove the routing logic from code.** The application now calls only the new path directly.
2. **Deploy** the simplified code.
3. **Wait one deploy cycle** for the change to propagate.
4. **Archive the migration flag** in LaunchDarkly.
5. **Decommission the old path's dependencies** — old database, old service endpoint, old credentials. Use the [Governance pillar's archival discipline](../pillars/governance/best-practices.md).
6. **Document the migration** — what was done, what was learned, what changed. Useful for the next person who attempts a similar migration.

**Why this matters:** retirement is the part teams skip. Skipping it leaves dead code, dead dependencies, dead flags, and the appearance of complexity that isn't actually doing anything. See [Governance pillar AP-4](../pillars/governance/anti-patterns.md).

---

## Step 9 — Reflect

After the migration completes, the team holds a short retro:

- What went well?
- What went poorly?
- Where did shadow mode catch something?
- Where did a guardrail prevent a problem?
- What would we do differently next time?

Capture the learnings somewhere durable (team wiki, postmortem index, runbook update). The next migration will be easier.

**Why this matters:** migrations are infrequent enough that institutional memory matters. The team that documents wins.

---

## Success criteria

You have completed the lab when:

- [ ] The migration scope, equivalence definition, and rollback condition are written down.
- [ ] A routing flag exists with `old` / `new` variations (and `shadow` if applicable).
- [ ] The application's routing layer respects the flag.
- [ ] A shadow phase has been run (where applicable) and discrepancies resolved.
- [ ] Guardrail metrics are configured.
- [ ] The progressive cutover has been executed deliberately.
- [ ] A warm period was observed after 100% before retiring the old path.
- [ ] The old path is retired, the flag archived, and the migration documented.

---

## What to do next

- The full [Migration & Modernization Lens](../lenses/migration/) (Phase 3) will go deeper on this pattern, including data migrations, dual-write/dual-read patterns, and large-scale strangler-fig sequences.
- For database migrations specifically, the shadow phase is critical — design it carefully.
- Run [Lab 06 — Relay Proxy Deployment](./06-relay-proxy-deployment.md) if your migration involves changes to the LD path itself.

---

## Teardown

The lab teardown is Step 8 (retire the old path). Migrations don't tear down — they end.
