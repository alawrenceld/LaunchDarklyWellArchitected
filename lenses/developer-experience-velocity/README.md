# Lens: Developer Experience & Velocity

> *Make the safe path the easy path.*

**Status: Phase 2 — draft scheduled, not yet written.**

The Developer Experience & Velocity Lens specializes LDWA for the engineering-productivity dimension of using LaunchDarkly. It re-applies the pillars to the question: *how does the daily experience of working with LD shape the team's velocity, correctness, and ability to maintain the system over time?*

This material was originally proposed as a pillar; the editorial decision was to make it a lens because DX cuts across every pillar rather than standing alone (see [Decisions Log D-2](../../framework/decisions.md)).

## When this lens will apply

- You're integrating LaunchDarkly into a new codebase and want to do it well.
- Your team has friction around LD: testing, local development, refactoring, finding flag references.
- You're standardizing LD practices across many teams or services.
- You're building or operating an internal platform that exposes LD as a capability to product teams.

## Related Phase 1 content

Until this lens is published, draw on the existing pillar coverage:

- **Operational Excellence** already covers [CI/CD integration, IaC management, typed flag access, and Code References checks](../../pillars/operational-excellence/best-practices.md) (BP-6.x).
- **Governance & Artifact Lifecycle** already covers [Code References as governance tooling](../../pillars/governance/best-practices.md) and the naming/tagging conventions that make finding and refactoring flags tractable.
- **Safe Release** covers [fallback values and the discipline of treating fallbacks as code paths](../../pillars/safe-release/best-practices.md).
- **AI/GenAI Lens** covers [the developer iteration loop for AI Configs](../../lenses/ai-genai/) (prompt iteration, local eval pipelines).

## Phase 2 scope

When drafted, this lens will cover:

- **Design principles for DX with LaunchDarkly** — making the safe path the easy path.
- **Pillar overlays** — how each pillar's best practices specialize for the developer experience dimension.
- **SDK integration patterns** — server-side, client-side, mobile, edge. The discipline that makes integration repeatable across services.
- **Local development with flags and AI Configs** — running with offline mode, bootstrap, dev-environment configurations.
- **Testing patterns** — unit, integration, and end-to-end testing with flags. Coverage of fallback paths. Test doubles for the SDK.
- **Type safety and codegen** — typed flag clients, generated key constants, IDE integration, refactor-safety.
- **Infrastructure as Code for LaunchDarkly** — Terraform / Pulumi / equivalent, with guidance on what belongs in IaC and what belongs in the UI.
- **Onboarding ramp** — how a new engineer becomes productive with LaunchDarkly.
- **Review questions** — DX-specific diagnostic questions.
- **Anti-patterns** — common DX failure modes.

See the [build plan](../../todo.md) for sequencing.
