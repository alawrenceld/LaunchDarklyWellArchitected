# Migration & Modernization — Anti-Patterns

A catalogue of common, named failure modes for migrations.

---

## AP-1. The big-bang cutover

**Shape:** The team builds the new system, runs it through QA, and on Cutover Day flips DNS / config / a deploy to switch traffic. Issues that QA didn't catch surface immediately in production. Rollback is "redeploy the old system," which takes hours.

**Why it's an anti-pattern:** big-bang cutovers concentrate all the risk in a single moment with no graceful recovery. Every migration has surprises; big-bang lets them all land at once on real users.

**Symptom:** "Cutover Day" appears on a calendar; rollback procedure involves redeploying.

**Remedy:** routing flag, shadow phase, progressive cutover, warm period. The full strangler-fig pattern.

---

## AP-2. The skipped shadow phase

**Shape:** "We don't need shadow — we tested it thoroughly in staging." Cutover proceeds directly from 0% to a percentage. The first wave of real users hits the new path, which has a bug staging didn't trigger. Customer impact is immediate.

**Why it's an anti-pattern:** staging is not production. Real traffic, real data, real concurrency surface bugs that QA can't.

**Symptom:** post-cutover issues that "the staging tests didn't catch."

**Remedy:** run shadow on real production traffic before any user sees the new path's results. Even a few hours of shadow can catch the big classes of bugs.

---

## AP-3. The hand-wavy equivalence rule

**Shape:** "The new system should behave the same as the old system." Shadow runs; divergences appear; the team can't agree on which divergences are real bugs vs. acceptable variances. Cutover proceeds without resolving the question; the team is later surprised by customer complaints about specific behaviors.

**Why it's an anti-pattern:** without an explicit equivalence rule, the shadow phase produces ambiguous results. The team can't tell whether the new path is ready.

**Symptom:** ongoing arguments during shadow about whether divergence X is a bug or expected.

**Remedy:** before shadow starts, define equivalence precisely. Document the rules; encode them in the comparator. Disagreements happen in design, not in shadow.

---

## AP-4. The unmonitored warm period

**Shape:** Cutover completes to 100%. The team moves on to the next priority. Two weeks later, an incident traces back to a behavior of the new path that wasn't observed because nobody was watching. The old path's dependencies have already been decommissioned.

**Why it's an anti-pattern:** the warm period is a safety reserve, but only if someone is using the reserve. Cutting attention immediately after cutover defeats the purpose.

**Symptom:** an incident in the warm period that should have been caught by warm-period observation.

**Remedy:** the warm period is part of the migration. Dashboards, alerts, and operational attention continue. Decommission only after the warm period passes its criteria.

---

## AP-5. The dual-write that lost writes

**Shape:** Dual-write is implemented. Under load, the new store occasionally fails to receive a write — but the application's error handling silently swallows it. Reads from the new store later find missing records; the team can't reconstruct what happened.

**Why it's an anti-pattern:** dual-write is a strong pattern only if both writes are reliable. Silent failures in either side undermine the entire migration.

**Symptom:** the new store has fewer records than the old store at any given time.

**Remedy:** dual-write is an "at least one fails → log and alert" operation, not silent. Monitor write success per store. Reconcile counts continuously during dual-write.

---

## AP-6. The backfill that wasn't validated

**Shape:** A backfill job runs to copy historical data from old store to new. The team assumes it worked. Months later, a customer reports their old data is missing — the backfill skipped some records due to a bug nobody noticed.

**Why it's an anti-pattern:** backfill is its own migration with its own correctness concerns. Assuming it worked is the same bet as assuming any production change worked without verification.

**Symptom:** historical data missing from the new store that the team assumed had been migrated.

**Remedy:** validate the backfill. Count records before and after; spot-check; for high-stakes migrations, full-comparison. The validation is the migration's exit criterion.

---

## AP-7. The half-migration that lives forever

**Shape:** The migration progressed to "dual-write, read-new" and stopped. The team had other priorities; cutover to write-new-only never happened. Years later, both stores are still operational, both receiving writes, both being read for different purposes. Nobody can articulate the steady state because there isn't one.

**Why it's an anti-pattern:** migrations have a lifecycle that ends. Stalling mid-migration creates permanent complexity, doubled operating cost, and team confusion.

**Symptom:** the team supports both the old and new systems indefinitely; new engineers can't tell which is canonical.

**Remedy:** every migration has an explicit end. Track migration progress at the program level; stalled migrations are escalated. If a migration can't finish, decide whether to revert or commit; don't leave it half-done.

---

## AP-8. The point-of-no-return crossed without notice

**Shape:** The team turns off dual-write to consolidate operations. Two days later, a critical issue with the new store is discovered. Rollback would lose two days of writes. The team chose to cross the point of no return without realizing they had.

**Why it's an anti-pattern:** the point of no return is the most important phase boundary in the migration. Crossing it accidentally trades the migration's safety net for operational convenience without the team's awareness.

**Symptom:** "we can't roll back" surprise after dual-write was disabled.

**Remedy:** identify the point of no return in the migration plan. Treat the crossing as a distinct decision with explicit approval and a "are we ready" review.

---

## AP-9. The migration that became permanent

**Shape:** The team built the routing layer for a migration five years ago. The migration completed; the old path was retired. But the routing layer code is still in the codebase, with the flag still in the LaunchDarkly account. Future engineers read the migration code and assume there's still a migration in progress.

**Why it's an anti-pattern:** failed retirement leaves migration scaffolding in the codebase permanently. The complexity persists with no value.

**Symptom:** routing-layer code with no decision (one variation routes to dead code).

**Remedy:** complete the retirement phase. Remove the routing layer; inline the new path's call; archive the flag.

---

## AP-10. The mass simultaneous migration

**Shape:** The organization is migrating to a new cloud. The program directive: "All systems migrate this quarter." Twenty teams begin cutover the same week. Several encounter issues simultaneously. The teams competing for ops attention, vendor support, and rollback bandwidth all suffer.

**Why it's an anti-pattern:** simultaneous high-risk operations across the organization compound risk and overwhelm shared resources.

**Symptom:** a critical week where many teams need help at once.

**Remedy:** stagger. The program-level rule: never have more than N systems in cutover phase simultaneously. Cohort systems by risk and resource needs; stagger the cohorts.

---

## AP-11. The downstream consumer who didn't know

**Shape:** The team migrates an API to a new implementation. The migration goes smoothly internally. But a downstream consumer (another team, an external partner) was relying on a specific quirk of the old implementation — undocumented but real. The migration breaks the consumer; they discover it before the migration team does.

**Why it's an anti-pattern:** migrations of shared interfaces affect their consumers. Not coordinating with consumers is forgetting one of the stakeholders.

**Symptom:** post-cutover, an external party complains about behavior changes the migration team didn't anticipate.

**Remedy:** identify consumers during Phase 1. Communicate the migration to them. Where consumers depend on undocumented behaviors, either preserve those behaviors or coordinate the consumer's adaptation.

---

## AP-12. The rollback drill that never happened

**Shape:** The migration plan includes a rollback procedure. The team writes it down. They don't test it. Mid-cutover, a critical issue surfaces; the team tries to roll back; the procedure has bugs (a flag value the new code doesn't handle, a sequence of steps that doesn't work, a permission that's missing). The rollback takes hours, during which the impact compounds.

**Why it's an anti-pattern:** rollback procedures rot. The first time they're tested under pressure is exactly when their bugs cost most.

**Symptom:** rollback during an incident takes longer than expected and surfaces unexpected issues.

**Remedy:** drill the rollback in a non-emergency before peak cutover. Update the procedure based on what was wrong. Treat rollback drilling as a phase exit criterion.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
