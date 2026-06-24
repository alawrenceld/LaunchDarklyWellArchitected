# Lens: SaaS / Multi-Tenant

> *Per-tenant targeting is a superpower. Use it carefully.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for SaaS organizations managing per-tenant targeting, entitlements, customer-specific rollouts, and pilot programs at scale. It is the lens that addresses the unique governance and operational challenges of running thousands of tenants through one LaunchDarkly account.

## When this lens will apply

- You sell a B2B SaaS product with many tenants.
- You use LaunchDarkly for entitlements (which features each customer has) as well as releases.
- You run customer-specific pilots, beta programs, and one-off rollouts at scale.
- You support customer-specific overrides while maintaining a coherent product line.

## Phase 3 scope

The lens will cover the multi-context targeting model for SaaS (`user`, `organization`, `tenant`), entitlement-vs.-release distinctions, segment strategy for tenant cohorts, customer-specific overrides without complexity explosion, the operational rhythm of per-tenant rollouts, and the governance of customer-visible flag changes.

In the meantime, see [Safe Release — Targeting strategy](../../pillars/safe-release/best-practices.md) and [Governance](../../pillars/governance/).
