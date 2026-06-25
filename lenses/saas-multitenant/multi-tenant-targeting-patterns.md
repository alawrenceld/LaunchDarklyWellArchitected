# Multi-Tenant Targeting Patterns

How to structure context, segments, and targeting rules for SaaS workloads so the targeting graph stays tractable as the customer count grows.

---

## The context model

The recommended starting point: a multi-context evaluation that combines at least `user` and `tenant`.

```pseudocode
context = LDContext.builder()
    .addKind("user", currentUser.id)
        .with("email", currentUser.email)
        .with("role", currentUser.role)              // admin, member, viewer
        .with("locale", currentUser.locale)
    .addKind("organization", currentTenant.id)
        .with("plan", currentTenant.plan)             // free, pro, enterprise
        .with("region", currentTenant.region)         // us, eu, ap
        .with("created_at", currentTenant.createdAt)
        .with("size", currentTenant.userCount)
        .with("contract_type", currentTenant.contractType)
    .build()
```

**Why this shape:**

- Targeting on **user-level attributes** (role, locale) selects individual users for features.
- Targeting on **tenant-level attributes** (plan, region, size) selects whole customer accounts.
- Multi-context evaluation combines both: "show this to admins in Enterprise-plan EU tenants."

**Optional additions:**

- **`workspace`** if your product has sub-tenant workspaces.
- **`device`** for mobile/desktop apps.
- **`session`** for short-lived experiment cohorts — use sparingly given MCI cost.

---

## Segments as the scaling tool

Three categories of segments most SaaS teams need:

### 1. Cohort segments (deliberate groupings)

- `design-partners` — explicitly opted-in customers for early access.
- `beta-program-q3-2026` — time-bounded beta cohort.
- `eap-customers` — early-access program participants.
- `sunset-cohort` — customers being migrated off a deprecated feature.

Cohorts are explicit lists or rule-defined sets. They have lifecycles: customers join, leave, and the cohort itself retires.

### 2. Plan-tier segments (derivable from data)

- `plan-free`, `plan-pro`, `plan-enterprise`, etc.

Plan-tier segments derive from `tenant.plan`. They're useful as named labels for entitlement rules: "this flag serves `true` for `plan-pro` and `plan-enterprise`."

(For very simple plan-tier targeting, the rule can use the attribute directly without a segment. Segments help when many flags share the same plan-tier rule — they centralize the definition.)

### 3. Operational segments (problem-set groupings)

- `migrating-to-new-billing` — customers being moved between billing systems.
- `paused-onboarding` — customers temporarily paused.
- `requires-manual-review` — customers under additional review.

These are operational groupings that affect product behavior. They map to ongoing operational states the support and ops teams maintain.

---

## Targeting rule patterns

### Pattern 1 — Plan-tier entitlement

```
Default rule (fallthrough): false
Targeting:
  if tenant.plan IN ("pro", "enterprise"): serve true
  else: serve false
```

The cleanest form of entitlement targeting. The flag is a stable expression of "this feature is available on these plans."

### Pattern 2 — Cohort-based rollout

```
Default rule (fallthrough): false
Targeting:
  if tenant IN segment("design-partners"): serve true
  else if tenant IN segment("beta-program-q3-2026"): serve true
  else: serve false
```

Used for time-bounded rollouts. As confidence grows, additional segments (or a percentage rollout) are added.

### Pattern 3 — Per-tenant override

```
Default rule (fallthrough): [based on plan and cohort, as above]
Targeting:
  individual targets: ["customer-tenant-id-12345" -> serve false]
  [other rules as above]
```

The individual-target list is the override. Each entry is documented (description, owner, end date). The list is reviewed quarterly.

### Pattern 4 — Multi-criteria entitlement + rollout

```
Default rule: false
Targeting:
  if tenant.plan = "enterprise" AND tenant.region = "eu" AND tenant IN segment("ai-features-eap"):
    serve true
  if tenant.plan = "pro" AND tenant IN segment("ai-features-eap"):
    serve true
  else: serve false
```

Real entitlement + rollout combinations are rule sets. Document the intent; keep the rules readable.

### Pattern 5 — User-level within tenant

```
Default rule: false
Targeting:
  if tenant.plan IN ("pro", "enterprise") AND user.role = "admin":
    serve true
  else: serve false
```

For features that only certain user roles within a tenant should see (admin-only features, for example). User-and-tenant targeting together.

---

## The "one customer needs it different" pattern

Customer Y has a problem with feature X — needs it disabled while everyone else has it on. The patterns:

**Right pattern:** add Customer Y to an `exceptions-feature-x` segment. The flag's targeting includes a rule that serves `false` to the exceptions segment.

**Why:** the exception is named, documented, and easily removable. The segment can grow to include other customers with the same need; the exception's lifecycle is visible.

**Wrong pattern:** hardcoded individual target for Customer Y on every flag affecting the feature.

**Why this is wrong:** the override is invisible (lives inside each flag's targeting rules); when the feature touches multiple flags, the override must be maintained in multiple places; removing it requires editing every flag.

---

## Customer-specific behavior that's *intentional* (not an exception)

Some customers contract for specific behavior: Customer Z gets the white-label theme; Customer Q has a higher rate limit; Customer W has the legacy API enabled. These aren't exceptions — they're contractual.

The pattern: store this in `tenant.contract_terms` (or equivalent), target on it directly.

```
if tenant.contract_terms.white_label = true: serve [white-label variation]
```

The flag is the binding from contract terms to runtime behavior. Sales and CS know that adding the term to the contract translates to changing the tenant attribute, which propagates to flag behavior.

---

## Segment hygiene at scale

As tenant count grows, segments accumulate. The hygiene rules:

- **Named owner per segment.** Like flags, segments need ownership.
- **Documented purpose.** What is this segment for? What does inclusion mean?
- **Membership review.** Quarterly: is everyone still appropriately a member? Is anyone missing who should be in it?
- **Lifecycle.** Most segments have an end date or a graduation criterion. Time-bounded segments retire at the end. Plan-tier segments retire when the plan is sunset.

---

## When *not* to use segments

Segments are powerful but not free. Each segment is configuration to maintain. Use them when:

- The rule appears in multiple flags.
- The membership is non-trivial to express in a single targeting rule.
- The cohort has a name the team will refer to repeatedly.

Skip segments when:

- The rule appears in exactly one flag, with a stable, simple expression.
- The membership is just "all tenants in this plan" — target on the attribute directly.

---

## Tenant data sourcing

The targeting rules above assume `tenant.plan`, `tenant.region`, `tenant.contract_terms` are correct in the context object the application passes to the SDK. Where does that data come from?

The principle: tenant attributes flow from the **system of record** for that data. Plan tier comes from billing; region from the account-management system; contract terms from CRM or a contract-management tool.

The application reads these from the data tier (cache, database, service-to-service call) and includes them in the context at evaluation time. Stale data here means wrong targeting; treat the freshness of these attributes as part of the targeting correctness.

For tenant attributes that change infrequently (plan, region), per-request lookup may be wasteful — read once per session, cache in memory.

For tenant attributes that change often (contract changes, operational states), per-request is correct.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Entitlements & Per-Customer Rollouts](./entitlements-and-rollouts.md)
