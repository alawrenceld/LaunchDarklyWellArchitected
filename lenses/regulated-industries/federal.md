# LaunchDarkly Federal — When and How

LaunchDarkly Federal is the offering designed for U.S. Federal workloads and workloads subject to comparable high-assurance regimes. This page describes when to use it, how to deploy on it well, and how it differs operationally from the commercial offering.

This is an LDWA architectural overview. For the canonical product details — current authorizations, supported regions, FedRAMP impact level — refer to LaunchDarkly's product documentation and the LaunchDarkly trust portal.

---

## When to deploy on Federal

Use Federal if any of the following is true:

- The workload is **subject to FedRAMP** (Low / Moderate / High) and the system boundary includes LaunchDarkly.
- The workload is **subject to ITAR or export-controlled technology** requirements.
- The workload supports a **U.S. Federal civilian or defense customer** under contract terms that require Federal-scoped systems.
- The workload supports a **state or local government customer** under StateRAMP, TX-RAMP, or comparable.
- The workload supports a **U.S. critical infrastructure** customer under CISA-relevant regimes.

If none of these apply, the standard commercial LaunchDarkly offering is the right choice.

---

## What's different about Federal

At an architectural level, Federal differs from commercial LaunchDarkly along several axes. Confirm specifics in LaunchDarkly's current Federal documentation; the dimensions to plan around are:

- **Hosting environment.** Federal-designated infrastructure with separate compliance boundaries.
- **Identity and access.** Federal-scoped authentication, often with separate IdPs from commercial workloads.
- **Personnel and operational support.** Different operational staffing model to meet citizenship and clearance requirements.
- **Audit and evidence.** Audit log retention, evidence formats, and reporting cadences calibrated to Federal expectations.
- **Feature scope.** A subset of commercial features may be supported on Federal; new features arrive on Federal after commercial when applicable.

The boundary between Federal and commercial is binary in regulatory terms. A workload is either on Federal or it isn't; partial Federal-ness is not a thing that exists for audit purposes.

---

## Designing the Federal boundary

If your organization has both Federal-scoped and commercial workloads, the boundary needs to be unambiguous. Design considerations:

### Identity

Federal-scoped members authenticate via a Federal-scoped IdP. They do not share credentials with commercial members. Where individuals have a foot in both worlds, they have two distinct accounts with deliberate identity separation.

### Projects and accounts

Federal-scoped LaunchDarkly accounts are separate from commercial accounts. Federal-scoped projects do not appear inside commercial accounts. Cross-account references and integrations are designed deliberately and audited.

### Data flow

Context data, event data, and exports for Federal-scoped workloads stay within the Federal-scoped LaunchDarkly environment. The team's data-flow diagram makes this visible.

### Automation

Service tokens for Federal-scoped automation are scoped to Federal-scoped resources. CI/CD systems serving Federal workloads use Federal-scoped credentials.

### Operational practice

Runbooks, on-call rotations, and incident response for Federal-scoped workloads operate under Federal-scoped procedures. Where the commercial team and Federal team overlap in personnel, the procedures are explicit about which mode they're operating in.

---

## What the LDWA pillars look like on Federal

The pillars apply unchanged in principle. The specifics tighten:

- **Safe Release.** Required approvals are universal for production changes. Release Pipelines are the only sanctioned rollout path; ad-hoc rollouts to production require an exception process. Change windows align with the Federal customer's authorization-to-operate (ATO) terms.
- **Operational Excellence.** Audit log retention meets the longest applicable retention requirement (often 7+ years). On-call procedures are documented and approved. Operational changes are themselves change-managed.
- **Security & Compliance.** SSO is mandatory. Custom roles are scoped tightly. Personal API tokens are not permitted; only service tokens with narrow scope. Access reviews are at the Federal-required cadence.
- **Reliability.** RTO/RPO targets are documented and tied to the customer's ATO. Cross-region failover does not cross the Federal boundary.
- **Governance.** Every Federal-scoped artifact is tagged as such. Bulk operations require approvals. Code References coverage is verified.

---

## Common Federal anti-patterns to avoid

- **Federal-and-commercial blended account.** A single LaunchDarkly account holding both. The Federal boundary becomes a fiction; the audit fails.
- **Personal tokens for Federal automation.** Personal credentials drift with personnel; Federal automation needs auditable service tokens.
- **Borrowed commercial integrations.** Reusing a commercial Slack/PagerDuty integration for Federal workloads pulls Federal data across the boundary.
- **Cross-boundary failover by default.** Failing a Federal-scoped workload into a commercial region violates the boundary; the failover plan must keep the failover destination in-scope.

---

## Coordinating with LaunchDarkly Federal during a review

When running an LDWA review against a Federal-scoped workload:

- Use the [Regulated Industries review questions](./review-questions.md), which include Federal-specific questions.
- Engage LaunchDarkly's Federal solutions team for review participation; they bring context the commercial team may not.
- Plan the review with the customer's compliance/ATO timeline in mind — review findings often feed into ATO maintenance.

---

## The decision tree

If you're not sure whether you need Federal, work through the following:

1. **Is the workload subject to FedRAMP, ITAR, or comparable?** If yes → Federal. If no, continue.
2. **Is the customer a U.S. Federal civilian, defense, or intelligence-community entity?** If yes → Federal. If no, continue.
3. **Is the customer a state/local government with a RAMP-style program?** If yes → likely Federal (check with LaunchDarkly). If no, continue.
4. **Does the customer's contract specify Federal-scoped systems?** If yes → Federal. If no → commercial is correct.

When in doubt, ask LaunchDarkly. The wrong answer is more expensive than the question.

---

← [Guardian Edition](./guardian-edition.md) | Continue to → [Compliance Evidence Patterns](./compliance-evidence.md)
