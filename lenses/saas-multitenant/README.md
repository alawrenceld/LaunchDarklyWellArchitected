# Lens: SaaS / Multi-Tenant

> *Per-tenant targeting is a superpower. Use it carefully.*

The SaaS / Multi-Tenant Lens specializes LDWA for B2B SaaS organizations operating across many tenants — design partners, beta cohorts, plan tiers, customer-specific pilots, and the long tail of customer-specific overrides. It is the lens that addresses the governance and operational challenges of running hundreds or thousands of tenants through one LaunchDarkly account without turning the targeting graph into spaghetti.

SaaS workloads use LaunchDarkly differently than single-product workloads. The flag is not just "is feature X on?" — it's "is feature X on, for this customer, under this plan, in this region, given that this account is in onboarding mode?" The lens describes how to keep that complexity bounded.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true:

- Your product is **B2B SaaS** with multiple customer tenants sharing a single deployment.
- You use LaunchDarkly for **entitlements** — feature gating tied to plan tier or contract.
- You run **customer-specific pilots** or beta programs at scale.
- You support **customer-specific overrides** (one customer needs a feature off that everyone else has on, or vice versa).
- You have a **multi-context model** that includes `user` + `organization` (or `account`, `tenant`, `workspace`) and need targeting to flow across both.
- Your customer success or support team needs to **toggle behaviors for individual customers**.

If you have a single-tenant or consumer product, the standard pillars are sufficient.

## Contents

1. [Design Principles for SaaS / Multi-Tenant Workloads](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md)
3. [Multi-Tenant Targeting Patterns](./multi-tenant-targeting-patterns.md) — the context model, segment strategy, and the rules that keep targeting tractable at scale.
4. [Entitlements & Per-Customer Rollouts](./entitlements-and-rollouts.md) — feature gating tied to plan tier, customer-specific overrides, design-partner programs.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

1. Run the standard pillar review.
2. Walk this lens's [review questions](./review-questions.md), paying particular attention to the targeting model, segment strategy, and the per-customer override discipline.
3. Many SaaS workloads will surface findings around **Safe Release** (rollout patterns), **Governance** (artifact lifecycle as tenant count grows), and **Performance & Cost** (MCI implications of multi-context). Use the standard pillar guidance plus the overlays here.

## The headline principles

- **Tenants are first-class contexts, not user attributes.** Model them as their own context kind.
- **Entitlements and releases are different concepts.** Treat them differently.
- **Use segments, not per-customer flags.** Segments scale; per-customer flags don't.
- **The override is a documented decision, not a quick edit.** Especially the temporary one.
- **MCI scales with tenants × users × devices.** Plan for the multiplier.
- **Customer-success power is governed power.** Who can flip which flags for which customers is a policy question.
- **Tenant isolation is a security property.** A flag for tenant A must not leak into tenant B's experience.
