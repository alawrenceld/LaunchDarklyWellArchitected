# Lens: Platform Engineering

> *LaunchDarkly is a platform capability. Treat it like one.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for organizations where LaunchDarkly is operated as an internal developer-platform capability — owned by a platform team, consumed by many application teams, governed by shared standards. It is the lens that bridges between the platform team's responsibilities and the application teams' release practice.

## When this lens will apply

- A central platform team owns LaunchDarkly for the organization.
- Multiple application teams consume LaunchDarkly through shared abstractions, libraries, or templates.
- You need consistent practices across teams without imposing a one-size-fits-all model.

## Phase 3 scope

The lens will cover platform-team responsibilities vs. application-team responsibilities; shared abstractions (libraries, IaC modules, codegen) that make the safe path the easy path; templates and Release Pipeline catalogs; cross-team governance via Teams and custom roles; the operational model for a platform-as-a-product approach to LaunchDarkly; and the LDWA review process applied at platform scale (many systems, shared infrastructure).

In the meantime, draw on [Governance](../../pillars/governance/), [Operational Excellence](../../pillars/operational-excellence/), and [Developer Experience](../../pillars/developer-experience/).
