# Migration & Modernization — Review Questions

These questions apply to systems currently undergoing migration. Run them as part of the migration's regular cadence (typically per-phase) in addition to a standard pillar review.

---

## Scope and design

### MIG-Q1. Is the migration scope written down and bounded?
- **High Risk** if "the migration" is described in scope-broadening terms.
- **Medium Risk** if scope is documented but loose.
- **None** if scope is documented, explicit, and bounded.

### MIG-Q2. Is the equivalence rule defined explicitly?
- **High Risk** if "we'll know it's equivalent when we see it."
- **Medium Risk** if the rule is documented but ambiguous.
- **None** if the rule is precise and operationalized (in the shadow comparator, in tests).

### MIG-Q3. Is the rollback plan documented for each phase?
- **High Risk** if rollback exists for early phases but not for cutover/warm period.
- **Medium Risk** if rollback is documented but untested.
- **None** if rollback is documented and tested per phase.

### MIG-Q4. Is the point of no return identified and approved (where applicable)?
- **High Risk** if the migration has a point of no return that isn't recognized.
- **Medium Risk** if recognized but no formal go/no-go.
- **None** if explicitly identified, approved, with criteria.

---

## Routing layer

### MIG-Q5. Is there a routing flag in front of the old/new cutover?
- **High Risk** if cutover happens via code deploy.
- **Medium Risk** if routing exists but is incomplete.
- **None** if all in-scope paths route through the flag.

### MIG-Q6. Is the routing flag multivariate (old / new / shadow at minimum)?
- **High Risk** if boolean is forcing shadow + cutover into the same dimension.
- **Medium Risk** if multivariate but with awkward state representation.
- **None** if the flag captures all the migration states.

### MIG-Q7. Does the fallback value in the SDK call default to the old path?
- **High Risk** if SDK unavailability would route to the unproven new path.
- **Medium Risk** if fallback is inconsistent.
- **None** if fallback is `old` everywhere.

---

## Shadow phase

### MIG-Q8. Did a shadow phase run before any user saw the new path's results?
- **High Risk** if cutover proceeded without shadow.
- **Medium Risk** if shadow was limited.
- **None** if shadow ran on representative traffic.

### MIG-Q9. Was divergence tracked and acted on during shadow?
- **High Risk** if divergence wasn't measured.
- **Medium Risk** if measured but not acted on.
- **None** if divergence was tracked, investigated, and resolved.

### MIG-Q10. Did shadow exit when divergence was at acceptable level for the equivalence rule?
- **High Risk** if shadow ended for time-pressure reasons with elevated divergence.
- **Medium Risk** if exit criteria were informal.
- **None** if exit was criteria-driven.

---

## Progressive cutover

### MIG-Q11. Is cutover progressive (not big-bang)?
- **High Risk** if cutover went from 0% to 100% in a single step.
- **Medium Risk** if some steps were skipped under pressure.
- **None** if cutover followed a documented progression.

### MIG-Q12. Are per-step guardrails configured (error rate, latency, business metric)?
- **High Risk** if no guardrails.
- **Medium Risk** if some configured.
- **None** if all relevant guardrails are configured and watched.

### MIG-Q13. For B2B workloads, was per-tenant cutover used where appropriate?
- **High Risk** if all-customers-at-once cutover for a high-blast-radius migration.
- **Medium Risk** if per-tenant exists but is inconsistent.
- **None** if per-tenant cutover matches risk posture.

---

## Warm period

### MIG-Q14. Is there a defined warm period after 100% cutover?
- **High Risk** if no warm period planned.
- **Medium Risk** if warm period exists but is short.
- **None** if warm period is documented, of appropriate length, and respected.

### MIG-Q15. Is the old path operational during the warm period (not decommissioned early)?
- **High Risk** if dependencies were decommissioned before warm period ends.
- **Medium Risk** if some dependencies are gone but the rest remain.
- **None** if the old path is fully operational throughout warm.

### MIG-Q16. Does the warm period span periodic events (end-of-month, quarter close)?
- **High Risk** if the warm period was shorter than the team's known periodic cycles.
- **Medium Risk** if some cycles spanned but not all.
- **None** if warm spans all relevant cycles.

---

## Retirement

### MIG-Q17. After warm period, was the old path retired (code removed, dependencies decommissioned, flag archived)?
- **High Risk** if the old path persists indefinitely.
- **Medium Risk** if retirement happens late.
- **None** if retirement follows the warm period on a documented schedule.

### MIG-Q18. Was the migration flag archived after retirement?
- **High Risk** if the flag persists in the account.
- **Medium Risk** if the flag is dormant but not archived.
- **None** if archival happened.

### MIG-Q19. Was the migration documented (rationale, plan, outcome, lessons)?
- **High Risk** if no record exists.
- **Medium Risk** if documentation is partial.
- **None** if the migration's full lifecycle is documented for institutional memory.

---

## Data migration specifics

> Apply when the migration involves changes to the underlying data layer.

### MIG-Q20. For data migrations, is the dual-write pattern (or equivalent) in use?
- **High Risk** if the migration involves data changes but no dual-write.
- **Medium Risk** if dual-write is partial.
- **None** if dual-write is established before any read cutover.

### MIG-Q21. Are shadow reads with comparison validating the new store?
- **High Risk** if no shadow reads happen.
- **Medium Risk** if shadow reads exist but don't compare.
- **None** if comparison is happening and divergence is acted on.

### MIG-Q22. Is the point-of-no-return decision explicit and approved?
- **High Risk** if the team can't say when the point of no return was crossed.
- **Medium Risk** if approval was informal.
- **None** if it was a documented decision.

### MIG-Q23. Is the backfill complete and validated?
- **High Risk** if records from before dual-write started aren't confirmed in the new store.
- **Medium Risk** if validation is partial.
- **None** if backfill is verified.

### MIG-Q24. Is the rollback plan for data layer documented (and the cost understood)?
- **High Risk** if no documented data rollback procedure.
- **Medium Risk** if procedure exists but cost (writes lost) is unclear.
- **None** if procedure and cost are both documented.

---

## Org-wide migration

> Apply for migrations spanning many systems / teams.

### MIG-Q25. Is there a migration registry tracking each in-scope system's phase?
- **High Risk** if the program lacks visibility into individual system status.
- **Medium Risk** if a registry exists but isn't current.
- **None** if the registry is maintained and reviewed.

### MIG-Q26. Are migration flag conventions standardized across teams?
- **High Risk** if every team reinvents the routing pattern.
- **Medium Risk** if conventions exist but adoption is inconsistent.
- **None** if all in-scope migrations follow the same conventions.

### MIG-Q27. Is cutover staggered across systems (not all in Phase 5 simultaneously)?
- **High Risk** if the program has many systems mid-cutover at once.
- **Medium Risk** if staggering is informal.
- **None** if staggering is deliberate and managed.

---

← [Data & State Migration](./data-and-state-migration.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
