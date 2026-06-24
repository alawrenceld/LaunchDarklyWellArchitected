# Pillar: Governance & Artifact Lifecycle

> *The teams that ship the most are the ones that delete the most. Complexity is the silent killer of release velocity.*

The Governance pillar covers the lifecycle of every LD-managed artifact — flags, segments, experiments, AI Configs, release pipelines — from creation through retirement. It is the pillar that fights flag debt, abandoned experiments, orphaned AI Configs, and the slow accumulation of complexity that drags down engineering velocity.

It also covers how the team's change-management policy expresses itself in LaunchDarkly: naming, tagging, ownership, project and environment structure, the use of Code References, and the bulk-operations and API governance that keep the account from drifting.

Previously titled "Flag Hygiene," this pillar was renamed because the cleanup discipline applies to every artifact LaunchDarkly manages — not just flags.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md)
2. [Definition](./definition.md)
3. [Best Practices](./best-practices.md)
4. [Review Questions](./review-questions.md)
5. [Anti-Patterns](./anti-patterns.md)

## When this pillar is most relevant

- You have more than ~50 flags in production and the noise is starting to show.
- You're scaling LaunchDarkly across many teams and need shared conventions.
- You've had an incident traceable to a stale flag, an abandoned experiment, or an unowned artifact.
- You're rolling out Code References and want to use them well.
- You're on Guardian Edition and want to use approval workflows effectively.

## Related pillars

- **Safe Release** — covers *how* you release. Governance covers *who can release what, and what happens to it after*.
- **Operational Excellence** — covers day-2 operations. Governance covers the rules those operations enforce.
- **Security & Compliance** — covers access control and audit. Governance covers the change-management policy that uses those controls.
