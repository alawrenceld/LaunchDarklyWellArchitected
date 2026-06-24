# Regulated Industries — Anti-Patterns

A catalogue of common, named failure modes specific to regulated workloads.

---

## AP-1. The retrofitted audit

**Shape:** The auditor's first inquiry triggers a three-week scramble. Engineers reconstruct change history from chat logs and individual memory. Compliance leans on engineering to assemble a one-time report. The audit is passed, barely, and the team agrees to do it properly next year.

**Why it's an anti-pattern:** the audit-as-project model is unsustainable. Each cycle costs weeks of engineering. The next regime — or the next regulator — restarts the scramble.

**Symptom:** the months leading up to the audit are dominated by evidence collection.

**Remedy:** invest in the evidence pipeline (audit log streaming, role snapshots, artifact inventory, quarterly packs). Pay the engineering cost once; audits become queries.

---

## AP-2. The self-approval loophole

**Shape:** Required approvals are configured. The approver is the same person who proposed the change. Sometimes it's explicit ("I'll just approve my own"). Sometimes it's structural (the approver pool is one person; that person also proposes changes). Either way, the audit log shows approver = proposer for many changes.

**Why it's an anti-pattern:** separation of duties is the *function* of the approval. Without it, the approval is a stamp.

**Symptom:** during audit prep, "show me changes where approver != proposer" returns a much smaller set than expected.

**Remedy:** enforce same-actor exclusion via configuration. Expand the approver pool. Make the rule a configuration property, not a social norm.

---

## AP-3. The Federal-and-commercial blender

**Shape:** A team has both Federal-scoped and commercial workloads. They share accounts, identities, integrations, even some data flows. The team can't draw the boundary with confidence. The next ATO review uncovers the blending.

**Why it's an anti-pattern:** the Federal boundary is binary in regulatory terms. Once it's blurred, the only path to compliance is to clean it up.

**Symptom:** the 3PAO finds scope ambiguity.

**Remedy:** strict separation — distinct accounts, distinct identities, distinct integrations, distinct service tokens. Documented data-flow boundary. Re-audit after separation.

---

## AP-4. The approval queue that everyone bypasses

**Shape:** Approval workflows were configured with the most conservative possible thresholds — every production change in every project requires two approvals from a senior pool. The pool is small; reviews take days. Under deadline pressure, the team invents "emergency exception" patterns that bypass the policy. After six months, the bypasses outnumber the approvals.

**Why it's an anti-pattern:** the policy doesn't function as policy when it's routinely circumvented. The audit shows a configured control with widespread exception use; the auditor concludes the control isn't reliable.

**Symptom:** "emergency exception" appears as a frequent change category.

**Remedy:** recalibrate. Narrow the in-scope flag set. Adjust the approver pool. Make the standard path passable; reserve emergency exceptions for actual emergencies.

---

## AP-5. The change description that says "fix bug"

**Shape:** Production changes have descriptions like `fix`, `update`, `change`, or are simply empty. The audit log has actors and timestamps but no narrative. When the auditor asks "why was this change made?", the team has no record.

**Why it's an anti-pattern:** the audit log's *what* is captured automatically; the *why* is what humans contribute. Empty descriptions destroy the audit-readiness investment.

**Symptom:** during audit prep, the team spends hours reverse-engineering the rationale for changes that should have had it inline.

**Remedy:** require non-empty, substantive change descriptions for in-scope changes. Validate in tooling. Train on it.

---

## AP-6. The "approved by everyone" service account

**Shape:** Automation uses a service account that has approver privileges. The automation occasionally approves its own changes. The audit log shows the service account as both proposer and approver for many entries.

**Why it's an anti-pattern:** automation should not approve changes that automation also proposed; the loop produces no separation of duties.

**Symptom:** audit-log entries with the service account on both sides of the approval.

**Remedy:** automation accounts are proposers, not approvers. Approvals route to humans (or to a separate, narrowly-scoped automation acting as a gate).

---

## AP-7. The audit log nobody can produce

**Shape:** The audit log exists in LaunchDarkly. The team has never exported it. When the auditor asks for the change history for a specific date range, the team navigates the UI manually, takes screenshots, and pastes them into a document. The process takes a day.

**Why it's an anti-pattern:** screenshots aren't audit evidence in many regimes. The export should be queryable, exportable, and reproducible.

**Symptom:** audit responses involve screenshots.

**Remedy:** stream to SIEM, build queries, produce CSV/JSON exports. Screenshots become a last resort.

---

## AP-8. The change window that's a suggestion

**Shape:** The team has a documented change-freeze window — no production changes during quarter close, for example. Engineering treats it as a suggestion. Production changes happen during the window when "necessary." The audit catches this.

**Why it's an anti-pattern:** the window is the control. Bypassing it routinely undermines the integrity of every change-management claim.

**Symptom:** audit-log queries during freeze windows return non-trivial change counts.

**Remedy:** enforce the window in configuration — tooling refuses non-emergency changes during the window. Emergency changes follow a defined path with explicit approvals and post-event review.

---

## AP-9. The compliance regime that fell off the map

**Shape:** A regulation phases in over multiple years (EU AI Act is a current example). The team is aware in year one. By year three, requirements have evolved. The team's controls are still calibrated to year one. The next audit catches the gap.

**Why it's an anti-pattern:** regulatory drift happens. Failing to track it produces predictable surprises.

**Symptom:** the team's compliance posture is articulated against an out-of-date version of the regime.

**Remedy:** assign ownership for tracking each in-scope regime. Subscribe to regulator updates. Schedule a regulatory-change review at least annually.

---

## AP-10. The risk register without LaunchDarkly

**Shape:** The team's enterprise risk register names many systems but does not name LaunchDarkly. The audit asks "what are the risks associated with your release-management platform?" and the team has nothing rehearsed to say.

**Why it's an anti-pattern:** invisible dependencies are unrecognized risks. The audit notes that the risk register is incomplete.

**Symptom:** the risk register has gaps around release operations.

**Remedy:** add LaunchDarkly to the risk register. Identify the residual risks (availability, access, change management, data handling). Tie each to controls.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
