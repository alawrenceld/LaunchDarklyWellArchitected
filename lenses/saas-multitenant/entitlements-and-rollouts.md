# Entitlements & Per-Customer Rollouts

The two SaaS patterns that most often blur: **entitlement** (what a customer is allowed to use, tied to plan or contract) and **release** (a feature being rolled out, temporarily, across some subset of customers). This page covers both, the distinction between them, and how to design each.

---

## What's an entitlement?

An entitlement is a *permanent* expression of "this customer has access to this feature." Entitlements:

- Are tied to the customer's plan, contract, or purchase.
- Are stable — they change when the customer's plan changes, not because of a rollout.
- Are visible to the customer (pricing pages, plan comparisons).
- Have a long lifecycle — many years for a successful product.
- Are not experiments; the outcome is contractually fixed.

Examples: "Pro plan customers can use the API." "Enterprise plan customers have SSO." "Customers with the AI add-on can access AI features."

## What's a release?

A release is a *temporary* expression of "this feature is being rolled out, starting with these customers and expanding over time." Releases:

- Are tied to product launches, beta programs, or change-management cycles.
- Are progressive — exposure grows over time.
- Are typically invisible to most customers (or invisible until they're widely enough rolled out to matter).
- Have a defined lifecycle — they end with full rollout, a kill, or a graduation to entitlement.

Examples: "We're rolling out the new dashboard, starting with design partners." "Beta program participants get early access to the bulk-import feature."

## Why the distinction matters

A flag controlling an entitlement has fundamentally different needs from a flag controlling a release:

| Property | Entitlement flag | Release flag |
|---|---|---|
| Lifecycle | Multi-year, permanent | Weeks-to-months |
| Targeting | Based on plan / contract | Based on rollout strategy |
| Owner | Product or product-marketing | Engineering team shipping the feature |
| Audit visibility | Visible to customer-facing teams | Mostly internal |
| Change frequency | Low — changes when plans change | High during rollout, zero after |
| Documentation | Pricing pages, sales material | Engineering doc + audit log |

Conflating them — using one flag to mean both — is the source of most "this flag has 15 different rules and no one knows what it does" SaaS LD problems.

---

## Designing entitlement flags

### Pattern A — One flag per entitlement

The default for entitlement.

```
Flag: feature-api-access
Variations: true / false
Off variation: false
Targeting:
  if tenant.plan IN ("pro", "enterprise"): true
  else: false
```

Properties:

- The flag's identity matches the entitlement. Naming reflects the entitlement, not the implementation.
- Targeting is stable: it changes only when the entitlement definition changes (a new plan tier, a contract type, a regional pricing variation).
- The off variation is the "no entitlement" state — typically the absence of the feature.

### Pattern B — Multivariate entitlement (limit-based)

For entitlements with a numeric or tiered limit (rate limits, seat counts, storage quotas):

```
Flag: api-rate-limit
Variations:
  free: 100 requests/min
  pro: 1000 requests/min
  enterprise: 10000 requests/min
  custom: <number from tenant.contract_terms>
Targeting:
  if tenant.plan = "free": serve free
  if tenant.plan = "pro": serve pro
  if tenant.plan = "enterprise" AND tenant.contract_terms.custom_rate_limit IS NULL: serve enterprise
  if tenant.plan = "enterprise" AND tenant.contract_terms.custom_rate_limit IS NOT NULL: serve custom
```

The flag returns the configured limit. The application enforces it.

### Pattern C — Entitlement bundle

Some plans grant a *bundle* of capabilities. The cleanest approach: one entitlement flag per capability, each targeting on `tenant.plan`. Sales material describes the bundle; the flag system stores each capability independently.

Avoid one flag per plan tier that returns a list of capabilities — this creates a giant flag whose change radius affects every feature in the product.

---

## Designing release flags

Release flags follow the standard [Safe Release pillar](../../pillars/safe-release/) patterns, with SaaS-specific shape adjustments.

### Pattern D — Progressive cohort rollout

```
Flag: new-dashboard-rollout
Variations: true / false
Off variation: false
Targeting (over time):
  Week 1: if tenant IN segment("design-partners"): true
  Week 3: if tenant IN segment("design-partners") OR segment("beta-volunteers"): true
  Week 5: if tenant IN segment("design-partners") OR segment("beta-volunteers") OR tenant.plan = "free": true
  Week 8: serve true to all
```

Each step is a deliberate change. The audit log records the progression.

### Pattern E — Percentage-by-tenant rollout

When the rollout strategy is "X% of tenants" rather than named cohorts:

```
Targeting:
  Bucket by tenant (not by user!): 5% true, 95% false
```

The bucketing is on tenant kind, not user. This means a tenant's users all see the same variation — important for B2B where inconsistent experiences within a single customer cause support tickets.

Increase the percentage over time.

### Pattern F — Guarded rollout with per-tenant metrics

Standard guarded rollout, with metrics scoped per-tenant:

- Aggregate error rate per tenant.
- Per-tenant conversion or success metric.
- Customer-success ticket rate.

If any tenant's metrics regress past threshold, the rollout reverts (or excludes that tenant via an `exceptions` segment) and the team investigates.

---

## The entitlement → release relationship

A common workflow:

1. **Early** — feature exists as a release flag. Design partners and beta customers get it via cohort segments.
2. **GA** — feature graduates to an entitlement flag. The cohort segments are retired; the entitlement is established (e.g., "available on Pro+").
3. **Steady-state** — entitlement flag persists indefinitely. New customers get the feature based on their plan tier.

Two flags exist during the transition. The release flag retires when the feature is broadly available; the entitlement flag remains.

**Anti-pattern:** keeping the release flag forever, with targeting rules that now express entitlement. The flag's name and history reflect a release that's long over; new engineers can't understand it.

---

## Per-customer overrides

A customer needs a feature off that everyone else has on, or vice versa. The patterns:

### Pattern G — Exception segment

```
Segment: feature-x-disabled-exceptions
  Members: [customer-tenant-12345, customer-tenant-67890]
  Description: "Customers who have explicitly requested feature X be disabled.
                Each member documented in the segment description with reason
                and review date."

Flag targeting (adds a rule):
  if tenant IN segment("feature-x-disabled-exceptions"): false
  [other rules below]
```

**Properties:**

- One named segment per exception category, not per customer.
- Each member is documented (in the segment description, a linked tracker, or a custom field).
- Quarterly review: is this exception still needed? Has the underlying issue been resolved?

### Pattern H — Customer-attribute-driven overrides

If the override is tied to a customer attribute (e.g., regulated customers always have feature X off):

```
Targeting (rule):
  if tenant.regulated = true: false
  [other rules below]
```

This is cleaner than maintaining a segment when the membership is derivable from data the team already maintains.

### Anti-pattern — direct individual targets per customer

```
Flag: feature-x
Targeting:
  individual targets (across many flags):
    customer-tenant-12345: false
    customer-tenant-67890: false
    customer-tenant-11111: false
    customer-tenant-22222: false
    [50 more direct targets]
```

The override is invisible — buried in each flag's targeting. To find all of Customer Y's overrides, the team has to search every flag. To remove one, every flag must be edited individually.

The fix: replace the direct targets with segment membership. The segment is the source of truth.

---

## Customer-success / support workflows

Customer-success engineers often need the ability to flip flags for individual customers. The principles:

- **Scoped role.** A "CS engineer" custom role can modify the exception segments (add/remove customers) but not the underlying flags' targeting logic.
- **Documented changes.** Every CS-driven change includes a description (the ticket ID, the customer, the reason).
- **Bounded scope.** Some flags are off-limits to CS modifications (security flags, compliance flags). The role's permissions reflect this.
- **Time-bounded changes.** Many CS-driven overrides are temporary ("disable feature X for Customer Y until they upgrade"). The expected end date is documented. A monthly review surfaces overrides past their expected end date.

---

## Design-partner and EAP programs

Design partners — customers who agree to early access in exchange for feedback — are a SaaS staple. The LD pattern:

- A `design-partners` segment with the participating tenants.
- Pre-release flags target the segment.
- The segment has a defined exit: when a customer's design-partner agreement ends, they're removed from the segment; their experience may revert to the standard.
- The communication around design-partner participation is owned by product (or PMM); the flag system is the enforcement layer.

For EAP (Early Access Program) and beta programs, the pattern is the same with a different segment name. The lifecycle of the segment matches the lifecycle of the program.

---

## When entitlements change

A customer upgrades from Free to Pro. Or downgrades. Or churns. The flag system handles this via `tenant.plan` — but the application must:

1. Notice the plan change (typically via billing webhook or sync from the system-of-record).
2. Refresh the tenant context the SDK evaluates against.
3. Re-evaluate flags using the new context.

For mobile and client-side SDKs, this often means *re-identifying* the context. For server-side, it's automatic on the next request.

**Anti-pattern:** caching plan tier per-session indefinitely. A customer who upgrades mid-session shouldn't have to log out and back in to see the entitled features.

---

## A minimum-viable SaaS LD checklist

For a meaningful SaaS LD deployment, the team has:

- [ ] Multi-context evaluation with `user` + `tenant` (at minimum).
- [ ] Plan tier in `tenant.plan`, sourced from the billing system-of-record.
- [ ] One flag per entitlement; targeting based on plan.
- [ ] Separate flags for releases; targeting based on cohort segments.
- [ ] Cohort segments with documented purpose, owner, and lifecycle.
- [ ] Exception segments instead of direct per-customer individual targets.
- [ ] Custom roles scoping CS team's ability to modify exceptions.
- [ ] Audit log queryable by tenant.
- [ ] Quarterly review of exceptions and cohort segments.
- [ ] MCI forecast accounting for tenant × user × device multiplication.

---

← [Multi-Tenant Targeting Patterns](./multi-tenant-targeting-patterns.md) | Continue to → [Review Questions](./review-questions.md)
