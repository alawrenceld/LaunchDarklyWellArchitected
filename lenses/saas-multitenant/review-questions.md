# SaaS / Multi-Tenant — Review Questions

These questions are **additions** to the standard pillar review questions for B2B SaaS and multi-tenant workloads.

---

## Context model

### S-Q1. Is the tenant a first-class context kind (not a user attribute)?
- **High Risk** if tenant data is flattened into `user.organization_id` and similar.
- **Medium Risk** if multi-context is used inconsistently.
- **None** if `tenant` (or equivalent) is a context kind used in evaluations.

### S-Q2. Does the application include the relevant tenant attributes in evaluation contexts?
- **High Risk** if essential targeting attributes (plan, region) are missing from contexts.
- **Medium Risk** if attribute coverage is partial.
- **None** if the context model is complete and consistent.

### S-Q3. Are tenant attributes sourced from systems of record?
- **High Risk** if plan tier, region, or contract terms are maintained by hand somewhere in the LD account.
- **Medium Risk** if sourcing is partial.
- **None** if the canonical sources flow to context attributes automatically.

---

## Entitlement vs. release distinction

### S-Q4. Does the team distinguish entitlement flags from release flags?
- **High Risk** if all flags are treated the same and entitlement targeting accumulates in the same artifacts as rollout targeting.
- **Medium Risk** if the distinction is informal.
- **None** if entitlement vs. release is explicit (by tag, by description, by location).

### S-Q5. Are entitlement flags tied to plan/contract attributes (not to hand-curated segments)?
- **High Risk** if "customers on Pro plan" is a hand-maintained segment.
- **Medium Risk** if entitlement targeting is mixed.
- **None** if entitlements derive from authoritative tenant attributes.

### S-Q6. Do release flags graduate to entitlement flags (or retire) after rollout?
- **High Risk** if release flags persist forever with rules that now express entitlement.
- **Medium Risk** if graduation happens but late.
- **None** if graduation/retirement is part of the standard release lifecycle.

---

## Segments and cohorts

### S-Q7. Does the team use segments instead of per-customer flags?
- **High Risk** if a customer's name appears in many flag descriptions.
- **Medium Risk** if segment use is partial.
- **None** if segments are the primary expression of customer cohorts.

### S-Q8. Do cohort segments (design partners, beta, EAP) have documented purpose, owner, and lifecycle?
- **High Risk** if cohorts exist but their meaning has decayed.
- **Medium Risk** if documentation is partial.
- **None** if each segment is documented and reviewed quarterly.

### S-Q9. Is segment membership reviewed periodically?
- **High Risk** if no review cadence exists.
- **Medium Risk** if reviews happen but are inconsistent.
- **None** if quarterly reviews catch stale memberships.

---

## Per-customer overrides

### S-Q10. Are customer-specific overrides expressed via exception segments, not direct individual targets?
- **High Risk** if many flags have hand-coded individual targets for specific customers.
- **Medium Risk** if usage is mixed.
- **None** if exception segments are the standard pattern.

### S-Q11. Does each override have documented rationale and expected end date?
- **High Risk** if overrides accumulate without context.
- **Medium Risk** if documentation is partial.
- **None** if every override is documented and reviewed.

### S-Q12. Are overrides reviewed quarterly to check if still needed?
- **High Risk** if overrides last indefinitely.
- **Medium Risk** if reviews happen reactively.
- **None** if quarterly reviews retire resolved overrides.

---

## Per-tenant rollouts

### S-Q13. Are SaaS-specific rollout patterns (cohort progression, tenant-level bucketing) used appropriately?
- **High Risk** if rollouts target users without considering tenant cohesion (one user in a tenant sees X, another sees Y).
- **Medium Risk** if patterns are inconsistent.
- **None** if the team deliberately chooses tenant-level vs. user-level rollout per change.

### S-Q14. When percentage rollouts are used, is bucketing on tenant (not user) for tenant-cohesive features?
- **High Risk** if users within the same tenant see different variations of a feature that should be tenant-cohesive.
- **Medium Risk** if some flags get this right and others don't.
- **None** if bucketing matches the feature's nature.

### S-Q15. Are per-tenant rollback paths available where needed?
- **High Risk** if a customer-affecting bug requires global rollback even when only one customer is affected.
- **Medium Risk** if per-tenant rollback exists but is ad hoc.
- **None** if per-tenant rollback is a defined capability.

---

## Customer-success power

### S-Q16. Are customer-success workflows for flag changes governed by custom roles?
- **High Risk** if CS engineers have broad flag-change access.
- **Medium Risk** if scoping exists but is partial.
- **None** if CS roles are scoped to specific flags or override segments.

### S-Q17. Are CS-driven flag changes documented with ticket / customer / rationale?
- **High Risk** if changes go unlabeled.
- **Medium Risk** if documentation is informal.
- **None** if every CS change captures context.

### S-Q18. Are time-bounded CS overrides tracked for expiration?
- **High Risk** if temporary overrides become permanent without anyone noticing.
- **Medium Risk** if expiration tracking is partial.
- **None** if monthly reviews surface overdue overrides.

---

## Tenant isolation

### S-Q19. Are flag changes for one tenant verified not to affect other tenants?
- **High Risk** if the team has had cross-tenant incidents from poorly-scoped flag changes.
- **Medium Risk** if isolation is assumed but not tested.
- **None** if testing covers tenant-isolation scenarios.

### S-Q20. Are audit logs queryable per-tenant for compliance and incident response?
- **High Risk** if "show all changes affecting Customer Y" is hours of work.
- **Medium Risk** if queries are possible but slow.
- **None** if pre-built queries support per-tenant audit.

---

## Performance & cost at SaaS scale

### S-Q21. Is MCI forecast accounting for tenant × user × device multiplication?
- **High Risk** if MCI growth is a surprise.
- **Medium Risk** if forecasting is informal.
- **None** if quarterly forecasts inform capacity planning.

### S-Q22. Is per-tenant cost attribution available?
- **High Risk** if the team can't say which tenants drive their LD bill.
- **Medium Risk** if attribution is partial.
- **None** if per-tenant cost is visible.

### S-Q23. Is event volume from large tenants managed (sampling, aggregation)?
- **High Risk** if a single large tenant generates event volume that dominates the bill.
- **Medium Risk** if visibility exists but no action taken.
- **None** if event volume is managed per-tenant where it matters.

---

## Plan changes and entitlement transitions

### S-Q24. When a customer's plan changes, do entitlements update promptly in the application?
- **High Risk** if plan changes don't reflect in flag behavior until session expiry or worse.
- **Medium Risk** if propagation is inconsistent.
- **None** if plan changes propagate within seconds or minutes.

### S-Q25. Is the customer-communication aspect of customer-visible changes coordinated?
- **High Risk** if customer-visible changes flip with no communication plan.
- **Medium Risk** if communication is informal.
- **None** if the release plan includes the customer-comm aspect.

---

## Compliance and residency

### S-Q26. For tenants under specific compliance regimes (HIPAA, PCI, FedRAMP), are flag changes for those tenants subject to appropriate controls?
- **High Risk** if no differentiation by compliance scope.
- **Medium Risk** if controls exist but are partial.
- **None** if compliance-scoped tenants have stricter controls.

### S-Q27. Are residency-scoped tenants evaluated in the correct LaunchDarkly environment?
- **High Risk** if EU-residency tenants flow through US LaunchDarkly.
- **Medium Risk** if posture is mostly right but with exceptions.
- **None** if residency matches per tenant.

---

← [Entitlements & Per-Customer Rollouts](./entitlements-and-rollouts.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
