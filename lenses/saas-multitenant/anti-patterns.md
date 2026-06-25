# SaaS / Multi-Tenant — Anti-Patterns

A catalogue of common, named failure modes for B2B SaaS and multi-tenant workloads.

---

## AP-1. The flag-per-customer explosion

**Shape:** Every time a customer needs a special behavior, the team creates a customer-named flag: `customer-acme-feature-x-disabled`, `customer-globex-special-billing`, `customer-initech-legacy-api`. After two years, the account has hundreds of customer-named flags. Nobody can search for "all flags affecting Acme."

**Why it's an anti-pattern:** the artifact explosion is governance debt that grows linearly with customer count. Bulk operations are impossible; the targeting graph is unsearchable.

**Symptom:** flag search returns dozens of customer-name matches; nobody can give a confident "yes, that's all of them."

**Remedy:** consolidate via exception segments and customer-attribute targeting. One feature flag with an `exceptions-feature-x` segment beats N customer-named flags every time.

---

## AP-2. The hand-curated plan-tier segment

**Shape:** A `customers-on-pro-plan` segment is maintained by hand — someone adds new Pro-plan customers when they sign up; someone (sometimes) removes them when they downgrade. The segment drifts from reality. Some customers are misclassified.

**Why it's an anti-pattern:** plan tier is a derived attribute; maintaining it by hand duplicates the work that the billing system already does and introduces lag.

**Symptom:** customer-success tickets where the customer's plan and their actual feature access don't match.

**Remedy:** target on `tenant.plan` directly. Source the attribute from the billing system. Segments are for groupings that *aren't* derivable from data.

---

## AP-3. The release flag that became an entitlement (silently)

**Shape:** Two years ago, the team launched feature X as a release flag, rolled it to all customers. The release flag was never retired. Today, the flag is still in the codebase, and somebody quietly turned it into an entitlement: "only Pro+ customers get this now." The flag's name still reflects the rollout from years ago.

**Why it's an anti-pattern:** the flag's identity is wrong. Engineers see the rollout-era name and assume the flag's purpose is rollout-related. The actual entitlement logic is buried.

**Symptom:** flags whose name implies one thing but whose targeting implies another.

**Remedy:** rename or replace. The right pattern is: when a release graduates to entitlement, create a new entitlement flag with appropriate name, migrate code references, archive the release flag.

---

## AP-4. The override that became permanent

**Shape:** A customer needed feature X off "temporarily, while they migrate their data." Eighteen months later, the override is still in place. The migration never completed (or completed long ago and nobody noticed). The customer is missing out on improvements; the team has accumulated a permanent customer-specific behavior nobody understands.

**Why it's an anti-pattern:** overrides without end dates become permanent customer-specific behavior. Each one is a fragment of complexity.

**Symptom:** overrides whose original ticket is years old and whose context has been lost.

**Remedy:** every override has a documented end date or review cadence. Quarterly review removes overrides whose justification has lapsed.

---

## AP-5. The per-user bucketing that broke a B2B feature

**Shape:** The team rolls out a feature with a 25% percentage rollout, bucketed on user. Some users in Customer Y's tenant see the new feature; others don't. Customer Y's admin contacts support: "why does Alice see the new dashboard but Bob doesn't?"

**Why it's an anti-pattern:** in B2B, users within a tenant typically expect a coherent experience. Per-user bucketing of tenant-cohesive features breaks that expectation.

**Symptom:** customer-success tickets about within-tenant inconsistency.

**Remedy:** bucket by tenant for tenant-cohesive features. The unit of bucketing should match the unit of customer perception.

---

## AP-6. The customer-success engineer with admin rights

**Shape:** Customer success engineers have full LaunchDarkly admin access "because they need to help customers quickly." A CS engineer accidentally modifies a flag's default rule (intending to change a single customer's behavior). Hundreds of customers are affected.

**Why it's an anti-pattern:** the CS team's operational needs are real but limited. Granting them full admin rights is over-provisioning. The blast radius isn't bounded by intent.

**Symptom:** an incident traceable to a CS engineer's intended-scope-of-one action that affected many tenants.

**Remedy:** scoped CS role that can modify exception segments but not flag targeting logic. Test the boundary by trying to break it.

---

## AP-7. The MCI surprise from multi-context adoption

**Shape:** The team adopted multi-context evaluation a year ago — `user` + `tenant` + `device`. They didn't model how MCI would grow. The next contract renewal shows MCI 4× higher than expected. Account-level pricing tier needs to change.

**Why it's an anti-pattern:** multi-context is powerful; it also multiplies. Adopting it without forecasting is the recipe for a cost surprise.

**Symptom:** "we adopted multi-context and our MCI went up unexpectedly."

**Remedy:** model MCI before adopting multi-context broadly. Trend it monthly afterwards. Right-size context attributes (don't include `device` if your flags never target on device).

---

## AP-8. The plan-change-doesn't-stick bug

**Shape:** A customer upgrades from Free to Pro. They expect to see Pro features immediately. They don't — because the application caches plan tier per session and the customer doesn't see the upgrade until they log out and back in. CS gets the ticket; the engineering team has to explain that "this is by design."

**Why it's an anti-pattern:** entitlements should follow the customer's actual plan. Caching plan in long-lived sessions is a UX bug, not a feature.

**Symptom:** "plan upgrade didn't take effect" support tickets.

**Remedy:** refresh tenant attributes on every request (or, for performance, on a tight cache window that respects plan changes). For mobile/client SDKs, re-identify the context after a plan change.

---

## AP-9. The cross-tenant audit gap

**Shape:** A customer asks: "show me all the changes affecting our account in the last 90 days." The team can produce a list — but it's incomplete, because tenant-attributed audit queries are hard. The legal/contractual ask escalates.

**Why it's an anti-pattern:** B2B contracts often include audit obligations. The team's inability to produce per-tenant audit data is a contractual risk.

**Symptom:** customer audit asks that take days to fulfill.

**Remedy:** audit-log streaming with per-tenant tagging; pre-built queries for the common asks; the team can run them in minutes.

---

## AP-10. The design-partner program that never ended

**Shape:** Two years ago, the team ran a design-partner program for feature X. The `design-partners` segment was created. Feature X has long since gone GA. The segment still exists, with the original five customers in it. Some flag still targets the segment, giving those five customers something different from the rest. Nobody remembers why.

**Why it's an anti-pattern:** programs end; segments outlive their purpose if not retired. The leftover targeting creates inexplicable customer-specific behavior.

**Symptom:** "why does this one customer see something different?" investigations that lead back to dormant segments.

**Remedy:** when a program ends, retire the segment. Migrate any persistent special-treatment into a documented entitlement or contract term.

---

## AP-11. The tenant attribute that drifted

**Shape:** The application reads `tenant.contract_terms.custom_rate_limit` from a contract-management system on app startup. The contract changes mid-session for one customer; the application keeps the old value cached. Targeting evaluations use the stale value for the rest of the session.

**Why it's an anti-pattern:** contract changes flow slowly; that's normal. But the flag system shouldn't surprise the customer-success team with "the change you made yesterday isn't taking effect because the application cached the old value indefinitely."

**Symptom:** tenant attribute changes that don't propagate predictably.

**Remedy:** define the freshness expectation per attribute. Plan tier may tolerate minutes of staleness; rate limits may not. Refresh the SDK context when the underlying data changes (via webhook, message, or scheduled refresh).

---

## AP-12. The compliance-scoped tenant in the wrong environment

**Shape:** A customer signs a contract requiring their data to be EU-resident. The team adds them to the product as a tenant in the US LaunchDarkly environment, because that's where everything else is. Audit catches it.

**Why it's an anti-pattern:** residency scope is per-tenant; not honoring it is a contractual / regulatory breach.

**Symptom:** an audit finding that residency-scoped tenants are in non-residency-scoped environments.

**Remedy:** residency-scoped tenants flow into residency-scoped LD environments. Track the boundary; verify on tenant onboarding; review periodically.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
