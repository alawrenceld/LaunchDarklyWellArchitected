# Hybrid / Multi-Cloud / On-Prem — Review Questions

These questions are **additions** to the standard pillar review questions for hybrid, multi-cloud, and restricted-egress workloads. Run the standard pillar reviews first; then walk these.

For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items.

---

## Topology and network domains

### H-Q1. Has the team mapped network domains and their egress postures?
- **High Risk** if the team can't enumerate the network domains the workload spans or what egress each permits.
- **Medium Risk** if the map exists informally.
- **None** if a current map documents each domain and its egress posture.

### H-Q2. Is the Relay topology per-provider (or per-network-domain), not centralized?
- **High Risk** if applications in one provider must reach Relay in another provider on the critical path.
- **Medium Risk** if topology is centralized but the trade-off is documented and accepted.
- **None** if each provider / domain has its own Relay path.

### H-Q3. For multi-region workloads within a provider, is Relay also regional?
- **High Risk** if applications cross regions on every evaluation.
- **Medium Risk** if regional Relay exists in some regions but not all.
- **None** if regional Relay is the default.

### H-Q4. Are cross-cloud links kept off the LD critical path?
- **High Risk** if every flag evaluation crosses cloud boundaries.
- **Medium Risk** if cross-cloud is reserved for failover but failover paths are unproven.
- **None** if normal operation is intra-cloud and cross-cloud paths are explicit, drilled exceptions.

---

## Identity federation

### H-Q5. Is LaunchDarkly access federated through a single corporate IdP?
- **High Risk** if local LaunchDarkly accounts exist for engineers working on multi-cloud workloads.
- **Medium Risk** if federation is partial.
- **None** if every engineer's LaunchDarkly access is IdP-driven.

### H-Q6. Are Teams populated via SCIM from IdP groups?
- **High Risk** if Team membership is maintained manually.
- **Medium Risk** if SCIM is configured but doesn't cover all relevant groups.
- **None** if SCIM provisioning is comprehensive.

### H-Q7. Does an engineer working across providers see one LaunchDarkly identity (not one per provider)?
- **High Risk** if engineers have multiple accounts to log into for multi-provider work.
- **Medium Risk** if account separation exists but isn't justified by audit/scoping needs.
- **None** if identity is unified.

---

## Residency and compliance scope

### H-Q8. Has the team documented which workloads are subject to which residency obligations?
- **High Risk** if residency scope is unclear at the workload level.
- **Medium Risk** if scope is documented at the org level but not per system.
- **None** if every LD-managed workload has a documented residency posture.

### H-Q9. Does the LaunchDarkly account structure (projects, environments, separate accounts) honor the residency boundaries?
- **High Risk** if residency-scoped data and non-residency-scoped data live in the same environment.
- **Medium Risk** if boundaries exist but are enforced socially.
- **None** if boundaries are enforced by configuration and verified.

### H-Q10. Are credentials scoped so a compromise in one environment doesn't expose another?
- **High Risk** if a single credential grants access across residency boundaries.
- **Medium Risk** if scoping exists but is partial.
- **None** if every credential is environment-scoped.

---

## Restricted egress and air-gapped operation

### H-Q11. For restricted-egress environments, is the egress path documented (corporate proxy, allowlist, sync schedule)?
- **High Risk** if egress is ad hoc or undocumented.
- **Medium Risk** if some documentation exists but isn't complete.
- **None** if the egress posture, path, and configuration are documented per environment.

### H-Q12. For sync-only environments, is the sync process operationally treated like a production system?
- **High Risk** if the sync is unmonitored, unowned, or unreliable.
- **Medium Risk** if monitoring exists but reliability is uneven.
- **None** if the sync is monitored, owned, and reliable.

### H-Q13. For air-gapped environments, is the promotion process documented and audited?
- **High Risk** if promotions are ad hoc.
- **Medium Risk** if a procedure exists but isn't consistently followed.
- **None** if the procedure is documented, audited, and includes review and approval.

### H-Q14. For air-gapped environments, is an emergency-promotion procedure defined?
- **High Risk** if an emergency in an air-gapped system would require waiting for the next routine promotion.
- **Medium Risk** if a procedure exists but is untested.
- **None** if the emergency procedure is documented and has been exercised.

---

## Audit and compliance chain

### H-Q15. Do audit events from restricted-egress and air-gapped environments reach the central audit destination?
- **High Risk** if the audit chain has gaps at restricted environments.
- **Medium Risk** if events flow but with significant latency or some loss.
- **None** if the chain is complete and reliable.

### H-Q16. Does the team reconcile audit events from synced/promoted environments against expected volumes?
- **High Risk** if silent event loss is possible.
- **Medium Risk** if reconciliation is informal.
- **None** if reconciliation is automated.

### H-Q17. Are restricted-egress environments included in the same access reviews as cloud environments?
- **High Risk** if access reviews skip restricted environments.
- **Medium Risk** if coverage is partial.
- **None** if reviews cover every environment uniformly.

---

## Operational runbooks per environment

### H-Q18. Does each meaningfully-different environment have its own runbook?
- **High Risk** if a single runbook is used for very different environments.
- **Medium Risk** if runbooks exist but are mostly copies.
- **None** if each environment has a runbook reflecting its actual topology.

### H-Q19. Has the team drilled "LD unavailable" in each environment?
- **High Risk** if drills have only happened in the cloud environment(s).
- **Medium Risk** if drills exist but coverage is partial.
- **None** if every environment is drilled at least quarterly.

### H-Q20. Has the team drilled the sync / promotion process for restricted environments?
- **High Risk** if the sync has never been drilled (failed-sync recovery, corrupted-store recovery).
- **Medium Risk** if drills are informal.
- **None** if the sync process has been drilled, with documented expected behavior.

---

## Cost and operational efficiency

### H-Q21. Is cross-cloud egress cost monitored?
- **High Risk** if cross-cloud egress from LaunchDarkly traffic is unmeasured and may be significant.
- **Medium Risk** if measurement exists but isn't actively reviewed.
- **None** if egress cost is part of the LD operating budget.

### H-Q22. Are Relay fleets sized per environment, not by a single rule?
- **High Risk** if sizing is one-size-fits-all and clearly wrong for some environments.
- **Medium Risk** if sizing is mostly right but not deliberately reviewed.
- **None** if each fleet is sized per its environment's traffic.

### H-Q23. Are MAU/MCI attributed correctly per environment?
- **High Risk** if MAU/MCI is unattributable to environments.
- **Medium Risk** if attribution exists but is imperfect.
- **None** if each environment's contribution to MAU/MCI is visible.

---

## Reliability under failure scenarios

### H-Q24. What happens if one provider has a regional outage?
- **High Risk** if the topology cannot tolerate a single-provider outage.
- **Medium Risk** if failure mode is hypothetical and not drilled.
- **None** if the failure mode is known, drilled, and recovery is documented.

### H-Q25. What happens if the corporate proxy / sync host fails?
- **High Risk** if corporate proxy / sync host failures take down LD access.
- **Medium Risk** if a fallback exists but is unproven.
- **None** if the failure mode has a documented, tested recovery path.

### H-Q26. Can the team safely migrate a workload from one provider to another while preserving LD continuity?
- **High Risk** if a migration would require flag/identity reconfiguration that hasn't been planned.
- **Medium Risk** if migration is theoretically supported but untested.
- **None** if migration paths are documented and ideally tested.

---

## Governance per environment

### H-Q27. Are flags tagged with their environment scope?
- **High Risk** if cross-environment vs. per-environment scope is invisible.
- **Medium Risk** if tagging is partial.
- **None** if every flag carries scope metadata.

### H-Q28. Are flag archival workflows aware of restricted environments (i.e., archival in LD also propagates to restricted stores)?
- **High Risk** if archival in LaunchDarkly leaves archived flags active in restricted-environment local stores.
- **Medium Risk** if the workflow exists but isn't consistent.
- **None** if archival flows through the same sync/promotion channel as creates.

---

← [Air-Gapped & Restricted-Egress Patterns](./air-gapped-and-restricted-egress.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
