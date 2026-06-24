# Regulated Industries — Pillar Overlays

This page captures how each pillar specializes for regulated workloads. Read the relevant pillar first; this page describes the *additional* expectations and shifted thresholds that apply in a regulated context.

---

## Safe Release & Progressive Delivery

**Regulated overlay:**
- Production releases require **required approvals** ([Guardian Edition](./guardian-edition.md)). Ad-hoc rollouts are exception-only and themselves require a documented justification.
- Release Pipelines are the *default*, not the advanced option. Every production-impacting flag flows through a pipeline.
- Guarded Releases attach the metrics the team would actually rollback for — *and* the metrics the auditor cares about (e.g., regulatory error categories, not just generic SRE metrics).
- Scheduled changes outside the release window are blocked. Inside the window, scheduled changes are paired with approvals captured at scheduling time.
- The off variation and fallback value for every customer-facing flag in a regulated workload are documented in the change-management record.

**What auditors typically want to see:**
- A list of every production change in the last quarter, with the approving party, the requesting party, and the rationale.
- Evidence that high-risk rollouts (auth, billing, payments, access decisions) used guarded releases with appropriate guardrails.
- Evidence that no production release bypassed the pipeline.

---

## Operational Excellence

**Regulated overlay:**
- The on-call procedure for LD-related incidents is documented and approved by the change-advisory body (CAB) or equivalent.
- Runbooks include the regulatory notification path for incidents that may be reportable (e.g., DORA incident reporting, breach notification under HIPAA).
- The "flags in motion" dashboard is reviewable by compliance/audit roles, not only engineering.
- Capacity reviews for major launches include a regulatory-risk reading, not only an operational one.
- The audit log is streamed to a long-retention archive that meets the regime's retention requirement (often 7+ years).

**What auditors typically want to see:**
- Evidence of on-call rotation, with named individuals and dates.
- Runbook contents, with revision history and approval.
- Audit-log retention and accessibility for the required period.

---

## Security & Compliance

**Regulated overlay:** — this is the primary pillar for regulated workloads. The standard pillar is mostly already-applicable; the regulated overlay tightens thresholds.
- SSO is mandatory; local credentials are exception-only and time-bounded.
- Custom roles are scoped to the minimum operational unit (project + environment + resource type at minimum).
- The *No access* restricted role is the default for dormant accounts; deletion is preferred over disabled-with-privilege.
- API tokens used by automation are service tokens, owned by a team, with documented purpose. Personal tokens are not permitted for automation.
- Access reviews are quarterly at minimum; for FedRAMP, monthly may be required.
- Required approvals on production changes are mandatory for the in-scope artifacts. Approval workflows align with the team's CAB structure.
- Audit log streams to the SIEM in real time. Sensitive event types page.
- Evidence of all of the above is queryable on demand.

**What auditors typically want to see:**
- The map of roles, members, and Teams; the access-review history; the SSO configuration.
- The list of service tokens with owners and purposes; the rotation evidence.
- The audit-log query that answers the auditor's specific question of the day, within minutes.

---

## Reliability & Resilience

**Regulated overlay:**
- The dependency posture for the workload is documented and aligned with the regulated RPO/RTO requirements (e.g., DORA Article 11 RTO targets, FedRAMP availability requirements).
- Failover paths have been tested with regulator-acceptable evidence (game day records, drill reports).
- For Federal-scoped or residency-bound workloads, the failover region is itself in-scope; cross-boundary failover is not allowed without explicit approval.
- LLM provider failures (where AI Configs are in use) are treated as a regulated-system dependency; resilience plans address provider outage scenarios.

**What auditors typically want to see:**
- Resilience design documents tied to the system's regulated availability obligations.
- Drill records — date, scenario, expected behavior, actual behavior, action items.

---

## Governance & Artifact Lifecycle

**Regulated overlay:**
- Naming and tagging include a `compliance:<regime>` or `regulated:<bool>` tag. Bulk operations and dashboards filter on this tag.
- Every regulated-tagged flag has named ownership at the team level (not individual) and a documented retirement plan.
- Code References coverage is verified for every repository that touches regulated workloads.
- Archival of regulated flags follows a stricter order of operations: archival approval, evidence of zero code references, change-record entry, archive, retention.
- The change-management policy is documented, version-controlled, and reviewed at the regulator-mandated cadence (often annually).

**What auditors typically want to see:**
- The list of regulated-tagged artifacts with their owners.
- Evidence that archival followed the documented process for any artifacts touching regulated data.
- The change-management policy document with revision history.

---

## Experimentation & Measurement *(Phase 2 — preview)*

**Regulated overlay:**
- Experiments in regulated workflows (lending decisions, claims adjudication, clinical-decision support, etc.) are bounded by regulatory constraints on customer treatment.
- The hypothesis, metric set, and decision rule are documented before the experiment starts, and reviewed by a designated body (model-risk management, clinical safety, etc.) where applicable.
- Holdouts and exclusions account for regulatory protected classes (fair-lending, discrimination protections).
- Experiment decisions are captured with rationale and reviewer attribution.

---

## Performance & Cost Efficiency *(Phase 2 — preview)*

**Regulated overlay:**
- Cost allocation by regulated business unit is auditable.
- Event volume and ingestion are monitored against regulator-relevant SLAs.

---

## Developer Experience & Velocity *(Phase 2 — preview)*

**Regulated overlay:**
- IaC management of LD resources (Terraform, etc.) flows through the same change-management process as application code.
- Local dev environments do not use production credentials. The boundary is enforced.

---

← [Design Principles](./design-principles.md) | Continue to → [Guardian Edition Deep Dive](./guardian-edition.md)
