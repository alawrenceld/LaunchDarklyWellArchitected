# Security & Compliance — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Identity and access

### SC-Q1. Is LaunchDarkly access tied to your corporate SSO/SAML?
- **High Risk** if accounts use local LaunchDarkly credentials instead of SSO.
- **Medium Risk** if most accounts use SSO but exceptions exist.
- **None** if SSO is enforced for all members.

### SC-Q2. Are roles assigned via Teams, or per-member?
- **High Risk** if assignments are per-member and inconsistent.
- **Medium Risk** if Teams exist but coverage is partial.
- **None** if Teams are the dominant unit of assignment.

### SC-Q3. Are custom roles used to scope access narrowly (Enterprise/Guardian)?
- **High Risk** if everyone has broad built-in roles where custom roles would be appropriate.
- **Medium Risk** if custom roles exist but are not consistently applied.
- **None** if custom roles deliver least-privilege at the project/environment/resource level.

### SC-Q4. Is the restricted *No access* role used for accounts that should exist but not act?
- **High Risk** if no equivalent exists and dormant accounts retain their original privilege.
- **Medium Risk** if *No access* is used but inconsistently.
- **None** if *No access* (or an equivalent custom role) is the default for dormant/audit-only accounts.

### SC-Q5. Are access reviews conducted at a defined cadence?
- **High Risk** if no scheduled review exists.
- **Medium Risk** if reviews happen but are ad hoc.
- **None** if reviews are quarterly (or more frequent for regulated workloads) and produce a record.

### SC-Q6. Do new engineers start without production write access?
- **High Risk** if day-one access includes production write.
- **Medium Risk** if production access is granted quickly without a defined criterion.
- **None** if production access is granted only after demonstrated familiarity.

---

## Credentials and tokens

### SC-Q7. Are server-side SDK keys stored in a secret manager?
- **High Risk** if SDK keys appear in source code, config files, or chat history.
- **Medium Risk** if storage is via environment variables but not a secret manager.
- **None** if SDK keys are pulled from a secret manager at runtime.

### SC-Q8. Are API tokens scoped to the minimum required permissions and environments?
- **High Risk** if automation uses unscoped personal tokens.
- **Medium Risk** if service tokens are used but with overly broad scopes.
- **None** if every token is a service token with narrowly-scoped custom roles.

### SC-Q9. Is there a documented token rotation policy?
- **High Risk** if no rotation policy exists.
- **Medium Risk** if policy exists but rotation is ad hoc in practice.
- **None** if rotation is scheduled, automated where possible, and verified.

### SC-Q10. Do you have an inventory of all service tokens with owners and purposes?
- **High Risk** if tokens exist that nobody can explain.
- **Medium Risk** if inventory exists but is incomplete or stale.
- **None** if every active token has a current owner and purpose.

---

## Audit log and compliance evidence

### SC-Q11. Is the audit log streamed to your SIEM?
- **High Risk** if the audit log is only readable in the LaunchDarkly UI.
- **Medium Risk** if export is configured but inconsistently consumed.
- **None** if the audit log is available in your SIEM and queried regularly.

### SC-Q12. Can you produce evidence of compliance controls on demand?
Probe: "Show me, in five minutes, who changed flag X in the last 90 days, and which of those changes had documented approval." If they can: **None**. If they need to dig: **Medium**. If they can't at all: **High**.

### SC-Q13. Do change descriptions and comments capture the *why* of meaningful changes?
- **High Risk** if descriptions are empty or boilerplate.
- **Medium Risk** if descriptions exist for some changes.
- **None** if change descriptions are routinely meaningful.

### SC-Q14. Have you mapped LaunchDarkly's attestations to your compliance requirements?
- **High Risk** if the team can't articulate which of their compliance controls LaunchDarkly satisfies vs. which they own.
- **Medium Risk** if mapping exists but is out of date.
- **None** if mapping is current and referenced during audits.

---

## Required approvals and Guardian Edition workflows

### SC-Q15. Are approvals required on production changes to sensitive flags?
- **High Risk** if no approvals are required for production changes to auth/billing/regulated flags.
- **Medium Risk** if some approvals exist but coverage is partial.
- **None** if approvals are required on the sensitive surface and enforced.

### SC-Q16. Are approvers a different set of people from proposers?
- **High Risk** if the same engineer can propose and approve.
- **Medium Risk** if separation exists but is enforced socially, not by policy.
- **None** if separation is enforced by configuration.

### SC-Q17. Are scheduled changes paired with required approvals for production?
- **High Risk** if scheduled changes can execute without prior approval.
- **Medium Risk** if pairing is partial.
- **None** if scheduled + approval is the standard pattern for production rollouts.

### SC-Q18. Are approval workflows reviewed for friction and bypass?
- **High Risk** if approvals are routinely bypassed (or quietly skipped) under pressure.
- **Medium Risk** if bypass exists but is rare.
- **None** if approval workflows are calibrated and bypass is exceptional.

---

## Environment isolation

### SC-Q19. Are production and non-production credentials kept separate?
- **High Risk** if any non-production system holds production credentials.
- **Medium Risk** if separation exists but enforcement is weak.
- **None** if separation is strict and verified.

### SC-Q20. Are role assignments scoped per-environment?
- **High Risk** if a single role assignment grants access to all environments equally.
- **Medium Risk** if scoping is partial.
- **None** if role assignments are environment-specific by default.

### SC-Q21. Is environment configuration promoted via documented flows (pipelines, IaC, scheduled changes) rather than ad hoc?
- **High Risk** if cross-environment changes are typically made manually.
- **Medium Risk** if some promotion is automated.
- **None** if promotion is consistently via documented flows.

---

## Context data handling and residency

### SC-Q22. Does your context model minimize the attributes sent to LaunchDarkly?
- **High Risk** if contexts include attributes the team can't justify for targeting.
- **Medium Risk** if context attributes are reasonable but unreviewed.
- **None** if context attributes are deliberately minimized and reviewed.

### SC-Q23. Is PII handled appropriately — hashed, omitted, or marked private?
- **High Risk** if raw PII (email, payment info, health data) is in context attributes without justification.
- **Medium Risk** if PII handling is informal.
- **None** if PII is handled per a documented policy.

### SC-Q24. Are private attributes used for fields that shouldn't be retained?
- **High Risk** if no use of private attributes despite a residency or retention policy that calls for them.
- **Medium Risk** if private attributes are used inconsistently.
- **None** if private attributes are used per policy.

### SC-Q25. Does your residency posture match your policy (EU offering for EU residency, etc.)?
- **High Risk** if the policy says EU and the deployment is US (or vice versa).
- **Medium Risk** if posture matches policy at the org level but not per project.
- **None** if posture matches policy per system.

---

## Compliance regimes

### SC-Q26. Have you documented which compliance frameworks apply to each LD-managed system?
- **High Risk** if compliance regimes are not mapped per system.
- **Medium Risk** if mapping is partial or out of date.
- **None** if mapping is current and used during planning.

### SC-Q27. Is compliance evidence generated continuously rather than retrofitted?
- **High Risk** if evidence is reconstructed before each audit.
- **Medium Risk** if some evidence is automated.
- **None** if evidence is produced from running systems and queryable on demand.

---

## Federal and high-assurance

### SC-Q28. If your workload is FedRAMP-scoped, are you running on LaunchDarkly Federal?
- **High Risk** if FedRAMP-scoped data flows through commercial LaunchDarkly.
- **Medium Risk** if the Federal/commercial boundary is unclear.
- **None** if Federal-scoped systems run on Federal and the boundary is documented.

### SC-Q29. Are Federal and commercial identity, access, and credentials separated?
- **High Risk** if credentials or accounts cross the boundary.
- **Medium Risk** if separation exists but is informal.
- **None** if separation is enforced and audited.

---

## AI security and safety

### SC-Q30. Are AI provider credentials managed with the same discipline as other credentials?
- **High Risk** if provider keys are in source, config files, or chat history.
- **Medium Risk** if storage is in env vars but not a secret manager.
- **None** if provider keys are in a secret manager, scoped, and rotated.

### SC-Q31. Are prompts reviewed as security-relevant content?
- **High Risk** if prompt changes ship without review.
- **Medium Risk** if prompts are reviewed but not specifically for injection risk.
- **None** if prompt review is part of the change workflow.

### SC-Q32. Is content moderation applied to AI-generated output where appropriate?
- **High Risk** if no moderation exists for user-facing AI output in regulated or sensitive use cases.
- **Medium Risk** if moderation exists but coverage is partial.
- **None** if moderation is wired into the evaluation path.

---

## Incident response and access recovery

### SC-Q33. Do you have a credential-compromise playbook?
- **High Risk** if no playbook exists.
- **Medium Risk** if one exists but is incomplete or untested.
- **None** if a current, exercised playbook exists.

### SC-Q34. Have you drilled the playbook in the last year?
- **High Risk** if no drill has happened.
- **Medium Risk** if a drill happened but findings weren't actioned.
- **None** if drills are scheduled and produce improvements.

### SC-Q35. Is there an account-recovery path that doesn't depend on the compromised account?
- **High Risk** if account recovery depends on a single person.
- **Medium Risk** if alternates exist but their access isn't verified.
- **None** if alternates are documented and their access is verified periodically.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
