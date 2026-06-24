# Governance & Artifact Lifecycle — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Ownership

### G-Q1. Does every artifact (flag, segment, experiment, AI Config) have a documented owner?
- **High Risk** if a meaningful fraction of artifacts are unowned.
- **Medium Risk** if most have owners but enforcement is informal.
- **None** if ownership is required at creation and audited.

### G-Q2. Are owners reviewed when teams or membership change?
- **High Risk** if reassignment happens only by accident.
- **Medium Risk** if reassignment happens but reactively.
- **None** if ownership review is part of team transitions and there is a periodic audit.

### G-Q3. Are Teams used as the primary unit of ownership, rather than individuals?
- **High Risk** if ownership is overwhelmingly individual and decays with personnel changes.
- **Medium Risk** if Teams are used but inconsistently.
- **None** if Teams are the dominant ownership unit.

---

## Naming and tagging

### G-Q4. Is there a documented naming convention for flags, segments, experiments, and AI Configs?
- **High Risk** if no convention exists and naming is freeform.
- **Medium Risk** if a convention exists but isn't followed consistently.
- **None** if the convention is documented, followed, and enforced.

### G-Q5. Is there a mandatory tag set, and is it applied consistently?
- **High Risk** if tags are absent or arbitrary.
- **Medium Risk** if tags exist for some artifacts but not others.
- **None** if the mandatory set is applied to every artifact and enforced.

### G-Q6. Are conventions enforced by tooling, not just by review?
- **High Risk** if no tooling exists and conventions decay.
- **Medium Risk** if some tooling exists (a linter, a CI check).
- **None** if tooling refuses non-compliant artifacts at creation.

---

## Flag lifecycle

### G-Q7. Are flags designated as temporary or permanent at creation?
- **High Risk** if the designation isn't used and all flags look the same.
- **Medium Risk** if usage is partial.
- **None** if designation is required at creation.

### G-Q8. Do temporary flags have a documented retirement hypothesis?
- **High Risk** if no temporary flag has a retirement plan.
- **Medium Risk** if some do.
- **None** if every temporary flag has an expected retirement.

### G-Q9. Is flag archival paired with code removal in a defined order?
- **High Risk** if archival happens without confirming code references, or code removal happens without archiving.
- **Medium Risk** if a process exists but isn't consistently followed.
- **None** if the order is documented and followed.

### G-Q10. Are stale flags swept periodically?
- **High Risk** if no sweep cadence exists and old flags accumulate indefinitely.
- **Medium Risk** if sweeps happen but ad hoc.
- **None** if sweeps are scheduled and produce action.

---

## Experiment lifecycle

### G-Q11. Does every experiment have a decision deadline?
- **High Risk** if experiments can run indefinitely with no decision date.
- **Medium Risk** if deadlines exist informally.
- **None** if deadlines are mandatory and tracked.

### G-Q12. Is the post-experiment cleanup (variations, segments, metrics) done?
- **High Risk** if old experiment artifacts accumulate in the account.
- **Medium Risk** if cleanup happens but inconsistently.
- **None** if cleanup is a standard step at decision time.

---

## AI Config lifecycle

### G-Q13. Are AI Config variations versioned explicitly?
- **High Risk** if no versioning convention exists.
- **Medium Risk** if versioning is partial.
- **None** if versions are explicit and referenced in rollouts and rollbacks.

### G-Q14. Are obsolete AI Config variations retired?
- **High Risk** if dead variations accumulate.
- **Medium Risk** if cleanup happens but late.
- **None** if retirement is part of the migration workflow.

### G-Q15. Are AI Config migrations aligned with provider deprecation cycles?
- **High Risk** if deprecation surprises the team.
- **Medium Risk** if migrations happen but reactively.
- **None** if deprecation cycles are tracked and migrations planned in advance.

---

## Code References

### G-Q16. Are Code References deployed across every repository that uses LaunchDarkly?
- **High Risk** if no Code References exist and archival is by guess.
- **Medium Risk** if coverage is partial.
- **None** if every relevant repo is scanned.

### G-Q17. Is there a workflow or dashboard for stale flags (no code references)?
- **High Risk** if stale flags aren't surfaced and don't trigger triage.
- **Medium Risk** if surfacing exists but isn't actioned.
- **None** if stale flags drive scheduled archival.

### G-Q18. Are dangerous flags (no code references but still active) surfaced and addressed?
- **High Risk** if these flags exist and aren't being addressed.
- **Medium Risk** if some addressed but not systematically.
- **None** if the dashboard exists and is triaged.

---

## Archival discipline

### G-Q19. Is the archival order of operations documented and followed?
- **High Risk** if archival is ad hoc.
- **Medium Risk** if the order exists but isn't consistently followed.
- **None** if the order is documented, followed, and reviewed.

### G-Q20. Are archival decisions captured in audit-log descriptions or linked rationale?
- **High Risk** if archives are made silently.
- **Medium Risk** if rationale is partial.
- **None** if every archive has rationale captured.

### G-Q21. Is bulk archival a privileged, dry-run-first operation?
- **High Risk** if any engineer can run bulk archival without approval or dry-run.
- **Medium Risk** if controls are partial.
- **None** if bulk archival is restricted, approval-gated, and dry-run-first.

---

## Project and environment structure

### G-Q22. Is project granularity decided by a documented principle (per product, per domain, etc.)?
- **High Risk** if projects are spun up ad hoc.
- **Medium Risk** if the principle exists informally.
- **None** if the principle is documented and applied.

### G-Q23. Do projects mirror a consistent environment structure?
- **High Risk** if environment structure varies per project without reason.
- **Medium Risk** if mostly consistent but with exceptions.
- **None** if structure is consistent and exceptions are documented.

### G-Q24. Is there a current map of projects and environments?
- **High Risk** if no map exists.
- **Medium Risk** if a map exists but is out of date.
- **None** if a current map is maintained.

---

## Change-management policy

### G-Q25. Is there a documented change-management policy for LaunchDarkly?
- **High Risk** if policy is informal or absent.
- **Medium Risk** if policy exists but isn't enforced.
- **None** if policy is documented and encoded in LaunchDarkly's controls.

### G-Q26. Are sensitive changes governed by approvals (Guardian Edition or equivalent)?
- **High Risk** if sensitive changes can be made without approval.
- **Medium Risk** if approval coverage is partial.
- **None** if approvals cover the sensitive surface.

### G-Q27. Is the change-management policy reviewed annually?
- **High Risk** if no review cadence exists.
- **Medium Risk** if reviews are ad hoc.
- **None** if reviews are scheduled and produce updates.

---

## Bulk operations and API governance

### G-Q28. Is bulk-operation access restricted to a small set of members?
- **High Risk** if bulk operations are available to everyone with write access.
- **Medium Risk** if some restriction exists but is informal.
- **None** if bulk operations are restricted by custom role.

### G-Q29. Are programmatic flag creators (Terraform, scripts, CI tools) governed with their own service tokens and scope?
- **High Risk** if programmatic creators use over-broad credentials.
- **Medium Risk** if scoping is partial.
- **None** if each programmatic creator has narrowly-scoped, owned credentials.

---

## LD health metrics

### G-Q30. Has the team defined a small set of LD health metrics?
- **High Risk** if no health metrics exist.
- **Medium Risk** if metrics exist but aren't reviewed.
- **None** if a curated set is defined, gathered, and reviewed.

### G-Q31. Are health metrics reviewed at least monthly?
- **High Risk** if no review cadence exists.
- **Medium Risk** if reviews are reactive.
- **None** if reviews are scheduled and produce action.

### G-Q32. Are improvement targets set for unhealthy metrics?
- **High Risk** if metrics are observed without targets.
- **Medium Risk** if targets exist for some but not others.
- **None** if every unhealthy metric has a target and an owner.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
