# Developer Experience & Velocity — Pillar Overlays

How each pillar specializes for the developer-experience dimension.

---

## Safe Release & Progressive Delivery

**DX overlay:**
- The team's standard rollout pattern is a reusable artifact — a Release Pipeline template, a wrapper library function, an IDE snippet. Engineers reach for it; they don't reconstruct the pattern each time.
- The PR template includes flag-related fields: "what flag does this PR add or change?" "what's the fallback behavior?" "have tests been added for both variations?"
- Linting and CI catch common rollout mistakes (no flag at all, ad-hoc bool literals instead of typed access, missing fallback values).

---

## Operational Excellence

**DX overlay:**
- IDE integrations show flag state inline (the LaunchDarkly extensions for VS Code, JetBrains, etc., are part of the standard developer tool kit).
- The team's CI/CD pipeline annotates LaunchDarkly events into the observability stack (deploy markers, change annotations).
- LD-related metrics — flag-eval latency, fallback rate, error rate per variation — appear on the team's day-2 dashboards alongside other application metrics.

---

## Security & Compliance

**DX overlay:**
- Engineer access to LaunchDarkly follows the principle of least privilege from day one. The role granted on hiring matches the engineer's responsibilities and ramps up as they demonstrate familiarity.
- Personal API tokens are not used for automation — service tokens belong to services / pipelines, not individuals.
- Pre-commit hooks scan for accidental commits of SDK keys.

---

## Reliability & Resilience

**DX overlay:**
- The SDK wrapper library encodes the team's defaults: appropriate timeouts, bootstrap from cache where applicable, sensible fallback handling.
- Tests against the SDK in offline mode are part of every PR's CI run.
- The team's fault-injection / chaos drills include LaunchDarkly degradation scenarios — the same drills the on-call has rehearsed for production.

---

## Governance & Artifact Lifecycle

**DX overlay:**
- Flag creation flows through a template (a CLI helper, a UI form with required fields, an IaC module). Required fields — owner, system, type, retirement plan — are enforced at creation.
- Code References is configured for every repo. New repos automatically pick up Code References via a template.
- The archival workflow is a documented engineering practice, not just a platform-team activity.

---

## Experimentation & Measurement

**DX overlay:**
- Experiments are configurable via IaC where the team wants reproducibility (test environments, dev cohorts).
- The team's metric instrumentation is a shared library, so events for the same metric are emitted consistently across services.
- Decision-recording lives in a place engineers naturally update — the experiment's description, a linked engineering doc, the team's wiki.

---

## Performance & Cost Efficiency

**DX overlay:**
- The team's SDK wrapper handles context-construction reuse, event-buffering configuration, and sampling — so individual engineers get good performance defaults without thinking about them.
- Local dev avoids burning MAU / MCI on test contexts (use test-environment LD project, or offline mode).

---

← [Design Principles](./design-principles.md) | Continue to → [SDK Integration & Testing](./sdk-integration-and-testing.md)
