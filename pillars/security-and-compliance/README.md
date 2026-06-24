# Pillar: Security & Compliance

> *Power to change production behavior is power that must be governed.*

The Security & Compliance pillar covers how access to LaunchDarkly is granted, audited, restricted, and recovered. It is the home for **Guardian Edition** capabilities — required approvals, scheduled changes, advanced workflows, the PagerDuty integration for guarded rollouts, restricted *No access* role, and custom roles — and for **Federal** / FedRAMP considerations. It also covers context-data handling, residency, secrets management, and how LaunchDarkly fits into your broader compliance posture (SOC2, HIPAA, PCI, EU AI Act, etc.).

The unifying principle: a flag change in production is a production change. It needs the same access control, audit trail, and approval discipline as a database migration.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md) — the principles specific to Security & Compliance.
2. [Definition](./definition.md) — focus areas inside the pillar.
3. [Best Practices](./best-practices.md) — what to do, organized by focus area.
4. [Review Questions](./review-questions.md) — diagnostic questions for a LDWA review.
5. [Anti-Patterns](./anti-patterns.md) — common ways this pillar goes wrong.

## When this pillar is most relevant

- You're in a regulated industry (FinServ, healthcare, public sector, defense).
- You're preparing for or operating under a compliance regime (SOC2, HIPAA, PCI, FedRAMP, EU AI Act).
- You're on Guardian Edition and want to use it well.
- You're scaling LaunchDarkly across multiple teams and need to keep access manageable.
- You've had — or want to avoid — an incident involving a flag change made by someone who shouldn't have had access.

## Related pillars

- **Governance & Artifact Lifecycle** — defines who owns what, the policy for changes. Security & Compliance is the technical enforcement of those policies.
- **Operational Excellence** — covers how the audit log is *used* operationally. Security & Compliance covers what the audit log must capture.
- **Reliability** — covers what happens when LD is unavailable. Security & Compliance covers what happens when LD is *used by the wrong person*.
