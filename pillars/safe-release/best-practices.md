# Safe Release — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Targeting strategy

### BP-1.1 Model the audience explicitly with contexts
Use [LaunchDarkly contexts](https://launchdarkly.com/docs/home/getting-started) to describe the entity you're targeting — user, organization, device, tenant, request. Multi-context evaluation lets a single decision combine several of these. Don't smuggle organization data through a `user.organization_id` attribute when an `organization` context kind would be more honest.

**Why:** the right context model makes targeting rules readable, segments reusable, and experiments correct. The wrong one accumulates `if/else` logic inside flag rules that nobody can maintain.

### BP-1.2 Target only on attributes that are stable and well-defined
Targeting on `email`, `customerId`, `organizationId`, `plan`, `country`, `appVersion` is fine. Targeting on `userAgent` substring matches or undocumented vendor headers is a foot-gun.

**Why:** rules built on unstable attributes silently break when the upstream system changes. Symptoms appear long after the rule was written.

### BP-1.3 Use segments for any audience referenced by more than one flag
If the same group of customers needs to be addressed by multiple flags ("beta tier customers," "EU-only," "enterprise plan"), define it once as a segment. Reference the segment from each flag.

**Why:** duplicated targeting rules drift. The segment is the source of truth; the rules become a single edit instead of N.

### BP-1.4 Keep PII out of context attributes you don't need
Targeting works on attributes you provide; you control what you provide. Pass only what is needed for targeting decisions. Hash or omit identifiers that don't affect targeting.

**Why:** every attribute is a future audit, residency, or breach question. (See the Security & Compliance pillar for the full treatment.)

---

## 2. Rollout patterns

### BP-2.1 Define the rollout sequence *before* you start
For each non-trivial release, write down the sequence: "internal users → 5% prod → 25% → 50% → 100%, each step at least 4 hours and only if guardrails hold." A pipeline or template is even better than a doc.

**Why:** the rollout decision under pressure is biased toward going faster. Pre-committing the sequence makes the safe path the default.

### BP-2.2 Match the rollout shape to the blast radius
- Low-risk, internal-only: a single percentage rollout.
- Customer-visible, recoverable: ring-based (dogfood → beta segment → percentage GA).
- High-blast-radius (checkout, auth, billing, infra cutover): guarded release with metrics.
- Regulated, change-managed: release pipeline with required approvals.

**Why:** matching shape to risk avoids both over-engineering small changes and under-engineering large ones.

### BP-2.3 Use blue/green via flags for infrastructure cutovers
For database migrations, service rewrites, and dependency swaps, route traffic through a multivariate flag whose variations point at the old and new path. Cut over progressively, with a guardrail metric, and keep the rollback path warm until you decommission the old path.

**Why:** infra cutovers are the highest-blast-radius changes you do. The flag is your safety net.

### BP-2.4 Use scheduled changes for predictable promotions
When a rollout step is "increase to 50% on Tuesday at 10 AM," use scheduled changes rather than asking a human to remember to do it. (Pair with required approvals on the schedule for sensitive changes.)

**Why:** humans forget. Schedules don't. Schedules also leave an audit trail.

---

## 3. Guarded Releases

### BP-3.1 Use Guarded Releases for any customer-facing, high-blast-radius change
A [guarded rollout](https://launchdarkly.com/docs/home/releases/guarded-rollouts) increases exposure while monitoring metrics for regressions. If a guardrail moves the wrong way past a threshold, the rollout reverts automatically.

**Why:** automatic rollback is faster than human rollback by an order of magnitude. The metric notices before the on-call's pager does.

### BP-3.2 Pick guardrail metrics that move when the feature moves
A guardrail is only useful if it changes when the user experience changes. Latency, error rate, and conversion are common defaults. Pick metrics that are *signal* for your feature, not just generic SRE indicators.

**Why:** a guardrail metric that never moves is a placebo. It will not catch real regressions, and the team will lose faith in guarded releases.

### BP-3.3 Set regression thresholds you would actually rollback for
Don't set a threshold so tight you rollback constantly on noise, or so loose you tolerate real regressions. A useful starting point: define what *materially worse* means for the metric, then set the threshold one statistically-meaningful step inside that.

**Why:** thresholds calibrate the system. Wrong thresholds either erode confidence (too tight) or hide problems (too loose).

### BP-3.4 Integrate guarded releases with on-call
On Guardian Edition, the [PagerDuty for guarded rollouts integration](https://launchdarkly.com/docs/integrations/pagerduty-guardian-edition) opens an incident when a regression is detected and resolves it when the rollout is rolled back. Without that integration, configure equivalent alerting via webhooks or your APM tool.

**Why:** an automatic rollback that nobody knows about is a near-miss the team never learns from. The pager is how the team learns.

---

## 4. Release Pipelines

### BP-4.1 Encode your standard rollout pattern as a pipeline
For Enterprise or Guardian plans, build the team's standard rollout pattern as a [Release Pipeline](https://launchdarkly.com/docs/home/releases/release-pipelines) — staged environments, default audiences, approvals, guarded-rollout strategies. Make the pipeline the easiest path.

**Why:** consistency. Every flag that uses the pipeline gets the team's vetted rollout strategy for free. Engineers don't reinvent it per flag.

### BP-4.2 Place approvals at the boundaries that match your governance
Approvals at the *first production phase* of a pipeline cover the cases where production exposure begins. For regulated workloads, additional approvals at high-exposure thresholds (e.g., 50%, 100%) are common.

**Why:** approval placement is a policy choice. The pipeline lets you encode the policy once and apply it to every flag.

### BP-4.3 Keep pipelines short
A pipeline with 12 phases will be skipped. Aim for 3–6 phases that map to meaningful steps: internal, canary, broad, GA.

**Why:** complexity in the pipeline doesn't make releases safer; it makes them more annoying. Annoying processes get bypassed.

### BP-4.4 Reserve ad-hoc rollouts for genuine exceptions
Not every flag belongs in a pipeline (a true kill switch, for example, should *not* be pipelined). But ad-hoc rollouts for routine customer-facing releases are a smell.

**Why:** if everyone bypasses the pipeline, the pipeline is wrong. Fix the pipeline; don't normalize the bypass.

---

## 5. AI Config rollouts

### BP-5.1 Treat model/prompt/provider changes as releases, not config edits
A change to an [AI Config](https://launchdarkly.com/docs/home/ai-configs) — new model, new prompt, new provider — is a change to runtime behavior. It deserves the same progressive-exposure, guardrails, and reversibility as any other release.

**Why:** AI changes have outsized blast radius and unpredictable failure modes. Treating them as "just a config" is how teams ship a 10% quality regression to 100% of users.

### BP-5.2 Use AI Config variations for model A/B comparisons
LaunchDarkly AI Configs support multiple model variations under one resource. Compare a candidate against the incumbent on cost, latency, quality, and any task-specific metrics before promoting.

**Why:** model picks are easy to get wrong. The right answer is data, not intuition.

### BP-5.3 Build the AI fallback path explicitly
Define what your application does when the model returns an error, times out, or returns garbage. Pair every AI Config with a fallback (cached response, simpler model, deterministic answer, graceful "we couldn't do that") that the application can serve.

**Why:** LLM providers fail. Providers degrade silently. A user-facing AI feature that has no fallback is one outage away from being broken.

### BP-5.4 Guard AI rollouts on cost and latency, not just quality
LLM quality is hard to measure in real time; cost and latency are easy. Use cost-per-request and p95 latency as fast-feedback guardrails so a runaway prompt or an unexpectedly chatty model gets caught quickly.

**Why:** quality regressions are caught in eval pipelines and customer feedback. Cost regressions are caught in the AWS bill — by which time you have spent $40,000.

---

## 6. Kill switches and fallback paths

### BP-6.1 Identify the kill switches for every product surface
For each customer-facing surface, name the one or two flags that disable it. Document them where the on-call can find them in 30 seconds (runbook, incident channel topic, or the LD UI itself with a tag).

**Why:** in an incident, the team's slowest moment is identifying which flag is the kill switch. Pre-naming them eliminates that moment.

### BP-6.2 Drill kill switches in production at least quarterly
Pick a non-business-hour window, flip the kill switch, observe the system, flip it back. Confirm the user experience degrades gracefully. Confirm the team's runbook works.

**Why:** an untested kill switch is a hypothesis. The first time you flip it is usually the worst possible moment.

### BP-6.3 Build the degraded experience deliberately
A kill switch should put the user in a *defined* state, not a broken one. Static fallback page, queued action, "we're temporarily reduced functionality" banner — whatever the right behavior is for the product, design it.

**Why:** "the feature is just gone" looks like an outage. "The feature is temporarily reduced and we know" looks like a product.

---

## 7. Default values and SDK fallbacks

### BP-7.1 Pick the fallback value the application can survive
The fallback value passed to the SDK call (e.g., `client.boolVariation("new-checkout", context, false)`) is what the application uses if LaunchDarkly is unreachable. Pick the value that lets the application serve a sensible experience.

**Why:** the fallback is invoked in the worst moments — startup, transient network failure, partial degradation. Make sure it's the value you'd want in those moments.

### BP-7.2 Default flags to the *current, stable* behavior
For a new feature, default to "feature off, old behavior on." For a sunset, default to "old path on" until you're ready to switch the default. The default value should represent the state you'd revert to in a panic.

**Why:** the default is your panic button's resting position. Set it to safety.

### BP-7.3 Document and test the off variation
The off variation is what's served when the flag is *off*, not when the SDK is offline. Set it explicitly, document what it means in product terms, and include the off path in tests.

**Why:** off is a code path. Untested code paths fail.

---

## 8. Scheduled changes and change windows

### BP-8.1 Use scheduled changes for time-bound promotions
Increase to 50% on Tuesday at 10 AM. Disable the legacy code path on the first of next month. End the beta segment on Friday. All of these are scheduled changes, not human reminders.

**Why:** humans forget. Schedules don't.

### BP-8.2 Respect your team's release windows
If you have a deploy/release freeze (end of quarter, holiday season, mobile app review window), encode it. Schedule changes outside the freeze; refuse manual changes inside it (with explicit override for true emergencies).

**Why:** freezes exist for reasons. Bypassing them is how the incident on December 24th starts.

### BP-8.3 Pair sensitive scheduled changes with approvals
On Guardian Edition, require approvals on scheduled changes that affect production. The schedule is the *what*; the approval is the *who said this was OK*.

**Why:** scheduled changes are easy to forget about. Approvals are how the change-management story stays intact between scheduling and execution.

---

## 9. Release policies and team norms

### BP-9.1 Write down how your team releases
A short README in the team's space: "Customer-facing flags use Release Pipeline X. Backend flags use a ring rollout with this default sequence. AI Configs require a guarded release with these guardrails. Kill switches are listed here."

**Why:** new team members onboard faster. Old team members don't argue from memory.

### BP-9.2 Use release policies to make the policy the default
Where the platform supports it, use [release policies](https://launchdarkly.com/docs/home/releases/release-pipelines) to set per-environment defaults for progressive and guarded releases. The right pattern becomes the default; the wrong pattern requires explicit deviation.

**Why:** norms enforced by tooling survive turnover. Norms enforced by hallway conversations don't.

### BP-9.3 Review release norms quarterly
At least once a quarter, the team reviews its standard rollout patterns: are they still right? Are new patterns emerging that should be encoded? Are old patterns being bypassed?

**Why:** the system that ships in 2026 is not the system that shipped in 2024. Release norms should keep up.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
