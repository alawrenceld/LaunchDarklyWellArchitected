# Regulated Industries — Review Questions

These questions are **additions** to the standard pillar review questions for regulated workloads. Run the standard pillar reviews first; then walk these. Many will reference or sharpen existing pillar questions.

For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items.

---

## Compliance scope and identification

### RI-Q1. For this LD-managed system, can the team name every compliance regime that applies?
- **High Risk** if compliance scope is fuzzy or unknown.
- **Medium Risk** if regimes are named but the per-regime control mapping isn't current.
- **None** if scope is documented per system and the mapping is current.

### RI-Q2. Are in-scope artifacts tagged with the applicable compliance regime?
- **High Risk** if no compliance tagging exists.
- **Medium Risk** if tagging is partial.
- **None** if every in-scope artifact carries the appropriate tag and bulk operations can filter on it.

### RI-Q3. Is LaunchDarkly on the team's enterprise risk register, with named residual risks and controls?
- **High Risk** if LaunchDarkly is invisible to the risk register.
- **Medium Risk** if listed but without current residual-risk analysis.
- **None** if listed with current analysis and tied controls.

---

## Federal-specific scope

### RI-Q4. If the workload is FedRAMP-scoped or comparably high-assurance, is it on LaunchDarkly Federal?
- **High Risk** if FedRAMP-scoped data flows through commercial LaunchDarkly.
- **Medium Risk** if the Federal boundary is unclear or under migration.
- **None** if Federal-scoped systems run on Federal and the boundary is documented.

### RI-Q5. If the team operates both Federal and commercial workloads, is the boundary unambiguous?
- **High Risk** if identity, projects, integrations, or data flow cross the boundary informally.
- **Medium Risk** if the boundary exists but is enforced socially.
- **None** if the boundary is enforced by configuration and audited.

---

## Separation of duties and approvals

### RI-Q6. Are required approvals enforced on production changes to in-scope flags?
- **High Risk** if production changes to in-scope flags can occur without approval.
- **Medium Risk** if approvals exist but coverage is partial.
- **None** if required approvals cover the in-scope surface.

### RI-Q7. Is the proposer/approver separation enforced by configuration, not by policy alone?
- **High Risk** if a single person can both propose and approve.
- **Medium Risk** if separation exists by convention.
- **None** if separation is enforced by configuration and verified.

### RI-Q8. Is the approval policy calibrated — neither pure ceremony nor a real bottleneck?
- **High Risk** if approvals are routinely rubber-stamped, or routinely block legitimate changes.
- **Medium Risk** if the calibration is unreviewed.
- **None** if the policy has been calibrated and is reviewed periodically.

---

## Audit log, retention, and SIEM integration

### RI-Q9. Is the LaunchDarkly audit log streamed to the team's SIEM in real time?
- **High Risk** if the audit log lives only in the LaunchDarkly UI.
- **Medium Risk** if streaming exists but is partial.
- **None** if streaming is comprehensive, monitored, and consumed.

### RI-Q10. Does audit-log retention meet the longest applicable regulatory requirement?
- **High Risk** if retention is shorter than the regulatory minimum.
- **Medium Risk** if retention meets the minimum but isn't tested for restoration.
- **None** if retention meets requirements and restoration has been tested.

### RI-Q11. Is access to the retained audit log itself audited?
- **High Risk** if anyone can access the archived audit log without trace.
- **Medium Risk** if access is logged but not reviewed.
- **None** if access is logged and reviewed.

---

## Change-management policy

### RI-Q12. Is the LaunchDarkly change-management policy documented, version-controlled, and reviewed at the regulator-mandated cadence?
- **High Risk** if no policy exists or it's stale.
- **Medium Risk** if the policy exists but reviews are ad hoc.
- **None** if the policy is current, version-controlled, and reviewed on schedule.

### RI-Q13. Are change windows enforced by tooling?
- **High Risk** if change windows exist on paper but production changes happen outside them.
- **Medium Risk** if enforcement is partial.
- **None** if tooling refuses non-emergency changes outside the window, and emergencies have a defined approval path.

### RI-Q14. Are emergency-change procedures documented, with a post-event review requirement?
- **High Risk** if no procedure exists.
- **Medium Risk** if a procedure exists but reviews are not done.
- **None** if procedure exists, reviews are mandatory, and the team can show examples.

---

## Evidence and audit-readiness

### RI-Q15. Can the team produce, in under an hour, the production-change history for a specified flag with actor and rationale?
- **High Risk** if reconstruction is required.
- **Medium Risk** if a query is possible but slow.
- **None** if a pre-built query exists.

### RI-Q16. Does the team maintain a recurring evidence pack for in-scope compliance regimes?
- **High Risk** if no recurring evidence is produced.
- **Medium Risk** if evidence is produced but inconsistently.
- **None** if a quarterly (or applicable cadence) pack is produced automatically and reviewed before audits.

### RI-Q17. Are change descriptions and rationale captured on every meaningful change?
- **High Risk** if descriptions are empty or boilerplate.
- **Medium Risk** if descriptions are present but uneven.
- **None** if descriptions are routinely substantive.

---

## Access reviews

### RI-Q18. Are access reviews conducted at the regime-required cadence (quarterly for SOC2, monthly for FedRAMP, etc.)?
- **High Risk** if no scheduled reviews.
- **Medium Risk** if reviews happen but not at the required cadence.
- **None** if reviews happen at the right cadence and produce records.

### RI-Q19. Are access-review records retained and producible to auditors?
- **High Risk** if records exist informally or not at all.
- **Medium Risk** if records exist but aren't easily produced.
- **None** if records are stored in the GRC tool and producible on demand.

---

## Data handling

### RI-Q20. Has the team minimized context attributes to what is required for targeting, with a documented rationale?
- **High Risk** if context attributes include unjustified PII/PHI/payment data.
- **Medium Risk** if the team minimizes but hasn't documented the rationale.
- **None** if attributes are minimized and the rationale is documented.

### RI-Q21. Are private attributes used for fields that the policy requires to be excluded from LaunchDarkly retention?
- **High Risk** if private attributes are not used despite the requirement.
- **Medium Risk** if usage is inconsistent.
- **None** if usage matches the policy.

### RI-Q22. Does the residency posture (US / EU / Federal) match the regulatory and contractual requirements?
- **High Risk** if posture doesn't match policy.
- **Medium Risk** if posture matches at org level but not per system.
- **None** if posture matches per system.

---

## Incident and reporting

### RI-Q23. Are LD-related incidents identified, triaged, and reported per the applicable regime (e.g., DORA, breach notification)?
- **High Risk** if LD-related incidents are not surfaced in the team's incident process.
- **Medium Risk** if surfacing is partial.
- **None** if LD-related incidents flow through the regulator-aware incident process.

### RI-Q24. Is the PagerDuty Guardian Edition integration (or equivalent) opening incidents on regulated-system regressions?
- **High Risk** if no real-time incident chain exists for guarded rollback events.
- **Medium Risk** if integration exists but is partial.
- **None** if integration is comprehensive and incident records are retained.

---

## Bulk operations and API governance

### RI-Q25. Are bulk operations restricted, dry-runned, and audited for regulated workloads?
- **High Risk** if bulk operations can be performed without restriction.
- **Medium Risk** if some controls exist.
- **None** if bulk operations require approval, run dry-run first, and leave an audit trail.

### RI-Q26. Are service tokens for regulated workloads scoped, owned, and rotated per a documented policy?
- **High Risk** if tokens are broad, ownerless, or unrotated.
- **Medium Risk** if controls are partial.
- **None** if every token has narrow scope, named ownership, and a rotation record.

---

## Regulatory change

### RI-Q27. Does the team track regulatory change cycles affecting the system (PCI revisions, FedRAMP control updates, EU AI Act phases)?
- **High Risk** if tracking is ad hoc.
- **Medium Risk** if tracking exists but doesn't drive LDWA updates.
- **None** if tracking is owned and produces concrete LDWA improvements.

---

← [Compliance Evidence Patterns](./compliance-evidence.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
