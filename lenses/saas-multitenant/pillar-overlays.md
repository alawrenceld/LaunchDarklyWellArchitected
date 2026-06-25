# SaaS / Multi-Tenant — Pillar Overlays

How each pillar specializes for B2B SaaS and multi-tenant workloads.

---

## Safe Release & Progressive Delivery

**SaaS overlay:**
- Progressive rollout patterns specialize for tenants: dogfood → design partners → beta cohort → small percentage of paid customers → all customers. The unit of progression is tenants (or tenant cohorts), not users.
- Per-tenant rollback is a useful property: when a rollout causes problems for one customer, the team can roll back just that customer while the rollout continues elsewhere.
- Guarded rollouts on customer-facing features attach **per-customer-impact metrics** — error rate per tenant, customer-success ticket volume — not just aggregate ones.
- Kill switches respect the tenant boundary: a kill for a feature can be scoped per-tenant (disable for one customer) or globally (disable for all). Both patterns exist and are deliberately chosen.

---

## Operational Excellence

**SaaS overlay:**
- "Flags in motion" dashboards include per-tenant views — which rollouts are active for which customer segments.
- Customer-success workflows are tied to flag changes: a ticket logged for "feature X broken at customer Y" is correlated with recent flag changes affecting that tenant.
- Audit logs are queryable by tenant: "show all LD changes affecting Customer Y in the last 30 days."
- Runbooks include the per-tenant rollback procedure.

---

## Security & Compliance

**SaaS overlay:**
- Audit-log queryability by tenant supports customer-specific compliance asks ("show me the changes affecting our account").
- Tenant-scoped data residency: if Customer Y must be EU-resident, the flags affecting Customer Y must be evaluated and audited in the EU LaunchDarkly environment.
- Customer-success access scoped: not every CS engineer should be able to change every tenant's behavior. Custom roles + tenant-scoped permissions.
- For customers under specific compliance regimes (HIPAA-covered tenants, PCI-covered tenants), the flags affecting their data carry compliance tags.

---

## Reliability & Resilience

**SaaS overlay:**
- A single tenant's failure mode should not cascade. A bug isolated to one customer doesn't take down the others.
- Per-tenant degradation: when the LD layer degrades, the application should serve each tenant the appropriate fallback (typically the tenant's plan tier's default behavior).
- Tenant-aware kill switches: in addition to the global kill switch, a per-tenant kill is sometimes the right tool.

---

## Governance & Artifact Lifecycle

**SaaS overlay** — high-priority for this lens.
- The **artifact-per-tenant explosion** is the most common SaaS governance failure. The fix is segments + targeting rules, not flags-per-tenant.
- Customer-specific overrides are documented in the override's description (or a linked tracker) with rationale, owner, and end date.
- Cohort segments (design partners, beta, etc.) have lifecycles: members join, leave, and the segment ends when the cohort retires.
- Tag flags with the entitlement-vs-release distinction: `lifecycle:entitlement`, `lifecycle:release-temporary`, `lifecycle:operational`.
- Code References scans pick up flag usage in the multi-tenant codebase.

---

## Experimentation & Measurement

**SaaS overlay:**
- Experiments scope to tenants or to users-within-tenants depending on the unit of effect. A feature aimed at admin behaviors stratifies by user; a feature affecting tenant economics stratifies by tenant.
- Tenant size matters: a tenant with 10 users contributes 10 data points; a tenant with 10,000 contributes 10,000. Stratified analysis prevents large tenants from dominating results.
- Decisions affect customers visibly. Document the rollout plan including the customer-communication aspect.
- Long-run holdouts in SaaS often align with cohort segments (a "never-treated" cohort for measuring compounding effects).

---

## Performance & Cost Efficiency

**SaaS overlay** — high-priority.
- **MCI math at SaaS scale:** users × tenants × devices = significant. Forecast actively.
- Per-tenant cost attribution: which tenants drive the LD bill? Useful for both contract reviews and product strategy.
- Event volume from large tenants can dominate: a single large customer's event stream might equal the rest of the customer base combined. Sample and attribute accordingly.
- Context-attribute discipline: don't include tenant attributes that targeting doesn't use; high-cardinality tenant attributes inflate MCI.

---

## Developer Experience & Velocity (Lens overlap)

**SaaS overlay:**
- Local dev requires a realistic tenant context. Provide dev/test tenants representing different plan tiers.
- Type-safe access to entitlement flags prevents the common bug "I assumed everyone had this feature."
- Testing patterns: every code path with a per-plan branch needs tests for each plan tier.
- IaC for tenant-cohort segments where applicable.

---

← [Design Principles](./design-principles.md) | Continue to → [Multi-Tenant Targeting Patterns](./multi-tenant-targeting-patterns.md)
