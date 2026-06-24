# Security & Compliance — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Security & Compliance pillar.

---

## SC-1. Least privilege is the default

No one starts with production write access. Access is granted explicitly, scoped narrowly, reviewed periodically, and revoked when no longer needed. New engineers ramp up in non-production environments first.

LaunchDarkly's [custom roles](https://launchdarkly.com/docs/home/account/manage-members) (available on Enterprise and Guardian) make this enforceable; without them, the team has to be deliberate about which built-in role each member gets.

## SC-2. Separation of duties for sensitive changes

The engineer who proposes a change is not the engineer who approves it. The engineer who configures a production rollout is not the only person who can advance it. The engineer who has read access to context PII is not necessarily the engineer who can change targeting rules.

For regulated workloads, this separation is mandatory; Guardian Edition's required-approval and scheduled-change workflows are the mechanism.

## SC-3. Every change is auditable and the audit is queryable

LaunchDarkly retains an immutable audit log of every change. That is necessary but not sufficient: the log must be reachable from the team's security tooling (SIEM, ticketing, compliance evidence systems) and queryable on the dimensions the team's compliance regime cares about.

## SC-4. Sensitive changes require approvals

Production-impacting changes — kill switches, flags that gate auth or billing, anything tagged "sensitive" by policy — require a human reviewer before they take effect. This is what Guardian Edition's **required approvals** enforce. Without Guardian, equivalent guardrails come from pipeline gates, IaC review, or external workflow tools.

## SC-5. Context attributes are deliberate, not accidental

Every attribute passed to LaunchDarkly is a data-handling decision. PII, payment data, health data, location data — each has a legal and ethical surface. The team passes only the attributes it needs for targeting, and knows which categories of data it is and isn't sending.

## SC-6. Secrets are managed like other secrets

SDK keys and API tokens are credentials. They live in your secret manager, are scoped to the minimum required environment and role, are rotated on a schedule, and are revoked the moment a person leaves or a system retires.

Mobile keys and client-side IDs are not secrets but are still scoped resources — resettable, environment-bound, and not blindly committed to public repos.

## SC-7. The compliance evidence is generated, not retrofitted

When the auditor arrives, the team produces compliance evidence from already-running systems — audit logs, approval records, role assignments, change history — not from a frantic reconstruction. Compliance is a property of how the team runs, not a quarterly project.

## SC-8. Federal and high-assurance workloads use the offering designed for them

If the workload is subject to FedRAMP, ITAR, or comparable assurance, run it on LaunchDarkly's **Federal** offering. Don't try to wrestle the commercial offering into compliance.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
