# Lens: Regulated Industries

> *Build a release system that compliance can sign off on without slowing engineering down.*

The Regulated Industries Lens specializes LDWA for organizations operating under strong change-management, audit, and compliance regimes — financial services, healthcare, public sector / government, defense, insurance, payments, and high-assurance industrial. It is the lens that turns Guardian Edition and Federal into concrete operating practice.

This lens does not replace any pillar. It re-applies the pillars — particularly Security & Compliance, Governance, and Safe Release — to the constraints and obligations of regulated workloads, and overlays additional best practices that are only relevant in regulated contexts.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true for the LD-managed system being reviewed:

- It is subject to a published compliance regime: **SOC2 Type II**, **HIPAA**, **PCI-DSS**, **FedRAMP** (Low / Moderate / High), **ITAR**, **ISO 27001**, **EU AI Act**, **DORA**, **GDPR for sensitive personal data**, or comparable.
- It is operated under a regulator-supervised industry: banking, payments, securities, insurance, healthcare providers/payers, utilities, telecom, public sector / federal civilian, defense, intelligence community.
- It is subject to a contractual change-management obligation that names specific controls (separation of duties, required approvals, audit retention, residency).
- It serves a customer for whom *audit* is a normal operating condition, not an event.

If none of these is true, the standard pillars are sufficient.

## Contents

1. [Design Principles for Regulated Workloads](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md) — how each pillar specializes for regulated contexts.
3. [Guardian Edition Deep Dive](./guardian-edition.md) — using approvals, scheduled changes, and workflows in practice.
4. [LaunchDarkly Federal](./federal.md) — when and how to deploy on the Federal offering.
5. [Compliance Evidence Patterns](./compliance-evidence.md) — packaging LD into audit-ready evidence.
6. [Review Questions for Regulated Workloads](./review-questions.md)
7. [Anti-Patterns specific to regulated contexts](./anti-patterns.md)

## How to use this lens during a review

When you run a [LDWA review](../../framework/review-process.md) on a regulated workload:

1. Run the full standard review against the in-scope pillars.
2. **Then** walk through the additional [review questions](./review-questions.md) in this lens.
3. Pay particular attention to evidence collection — the regulated lens emphasizes "could you prove this to an auditor?" over "did you do this?"
4. Many regulated workloads will surface findings around the **Security & Compliance** and **Governance** pillars; treat those as starting points and consult this lens for the regulated-specific elaboration.

## The headline principles

- **Separation of duties is not optional.** The engineer who builds is not the engineer who approves to production.
- **Every change is auditable, attributable, and rationale-bearing.** Empty change descriptions are policy violations.
- **Federal-scoped systems run on Federal.** Don't try to retrofit FedRAMP compliance onto the commercial offering.
- **Compliance evidence is generated, not retrofitted.** The audit is a query, not a project.
- **Required approvals enforce the policy.** Don't socialize what you can encode.
