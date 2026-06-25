# SaaS / Multi-Tenant — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for B2B SaaS and multi-tenant workloads.

---

## S-1. Tenant is a first-class context kind

In a multi-tenant product, the tenant (organization / account / workspace) is at least as important as the user. Model it as its own context kind — `organization`, `account`, `tenant`, `workspace`, whatever your domain calls it — not as a `user.organization_id` attribute. Multi-context evaluation combines `user` and `tenant` for targeting decisions that depend on both.

The wrong move is to flatten organization data into user attributes. The right one is to use the multi-context model for what it was built for.

## S-2. Entitlements and releases are distinct concepts

**Entitlements** are about *what a customer is allowed to use* — typically tied to plan tier, contract terms, or product line. They are stable, intentional, and customer-visible (e.g., listed in pricing pages).

**Releases** are about *what's currently being rolled out* — temporary, ramping, internally-visible. Today's release is tomorrow's entitlement (or tomorrow's archived experiment).

Don't conflate them. A flag controlling entitlement should have a different lifecycle and review process than a flag controlling a rollout.

## S-3. Segments scale; per-customer flags don't

If you find yourself creating one flag per customer, stop. The right pattern is one flag controlling the feature, plus a segment defining which customers it applies to. Customers move between segments; flags don't multiply.

A team with 200 customer-named flags has accumulated debt. A team with 10 flags and a clean segment structure scales to 2,000 customers.

## S-4. The override is a documented decision

Customer-specific overrides happen — design partners get early access, problem customers need a feature off, support needs to disable something for one tenant. Every override is documented: which customer, what change, by whom, with rationale, and the expected end date.

An override without an end date is a permanent customer-specific behavior. Sometimes that's right; usually it's just nobody decided.

## S-5. Customer-support power is governed power

The ability to flip flags for individual customers is operationally valuable and dangerous. Define roles: who can do it, for which flags, with which approvals. The default is *not* "anyone in customer support can change anything for any customer."

For regulated workloads, this is non-negotiable.

## S-6. Tenant isolation is a security property

A flag change for tenant A must not affect tenant B's experience — not at evaluation time (targeting correctly), not at observation time (audit logs correctly attributed), not at recovery time (rollback affects only the intended tenant). Test the isolation; don't assume it.

The worst SaaS LD incidents are cross-tenant: a poorly-scoped flag flip affects customers it shouldn't. Design to make this hard.

## S-7. The MCI math is real

Multi-context with `user` + `tenant` + `device` means each evaluation can contribute multiple MCI counts. At scale, this multiplies fast. Plan for it; forecast it; size it.

The team that adopts multi-context without modeling MCI discovers the math on the invoice.

## S-8. Plan-tier targeting flows from the plan, not from the flag

The plan a customer is on is upstream of the flag system — it's in the billing system, the CRM, or the account-management database. The flag system reads it (via the `tenant.plan` context attribute) and targets accordingly. Plan changes flow naturally to flag behavior.

Don't try to maintain "customers on the Premium plan" as a hand-curated segment. Source it from the truth.

## S-9. Cohorts are deliberate, not accidental

Design-partner cohort. Beta cohort. EAP (Early Access Program). Sunset cohort. Each is a deliberate grouping of tenants with a defined purpose and lifecycle. Document the cohort: who's in it, what they get, when they exit.

Cohorts without lifecycle become permanent labels nobody understands.

## S-10. Customer-visible behavior is communicated

A flag flip that changes what customers see is a customer communication event, not just an engineering change. Some changes are routine (silent rollout); others need notice (new feature in a plan tier, deprecation, customer-specific changes the customer should know about).

The communication plan is part of the release plan for customer-visible changes.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
