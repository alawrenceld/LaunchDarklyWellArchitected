# Performance & Cost Efficiency — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Evaluation latency

### BP-1.1 Set an explicit flag-evaluation budget per surface
For every customer-facing surface, the team has a documented latency budget. The flag-evaluation contribution to that budget is a known, agreed number — for most surfaces, sub-millisecond at the call site. If the actual measured latency exceeds the budget, it's a defect to fix.

**Why:** budgets make implicit assumptions explicit. "Flag eval should be fast" is not a budget; "≤1ms p95 on the auth check" is.

### BP-1.2 Keep the SDK off the critical path of cold start
Initialization and the first flag fetch happen in the background; the application proceeds with bootstrap or fallback values. The critical path of cold start does not wait on LaunchDarkly.

**Why:** the team that blocks startup on a network call ships an app that breaks under poor network conditions. Bootstrap (per [Reliability BP-2.2](../reliability/best-practices.md)) is the cure.

### BP-1.3 Measure evaluation latency end-to-end, not just at the SDK layer
The latency the user feels is application → SDK call → SDK evaluation → application continues. Measure the whole span. SDK-internal metrics are necessary but not sufficient.

**Why:** the team that measures only at the SDK boundary misses application-side waits (lock contention, context construction overhead, async boundary crossings).

### BP-1.4 Pre-construct contexts when the construction itself is expensive
If building the context object requires database lookups, network calls, or expensive serialization, do it once per request (or once per session) and reuse — not on every evaluation.

**Why:** context construction can become the dominant cost. Reuse beats reconstruction.

---

## 2. SDK and topology choice

### BP-2.1 Match SDK family to runtime — and to the latency budget
Server-side SDKs for backends with long-lived processes. Client / mobile SDKs for user devices. Edge SDKs for CDN runtimes. Daemon-mode SDKs for serverless. Each has different latency and cost characteristics.

**Why:** SDK / runtime mismatch is the single most common source of latency and reliability surprises. The right SDK is the one designed for your runtime.

### BP-2.2 Deploy Relay only when it pays for itself
Relay Proxy adds operational overhead and (usually) a small latency cost vs. direct evaluation. Deploy it when the latency it removes from a centralized path, the egress it controls, or the connection-count reduction it provides outweighs the operational cost. Not because "it sounds safer."

**Why:** Relay is a tool. Tools that don't solve a problem create problems.

### BP-2.3 Use edge SDKs for tight latency budgets where freshness can be eventually consistent
For paths where even 50ms is too much (high-traffic content selection, region-aware response shaping), edge SDKs evaluate at the CDN node in microseconds. Accept the propagation lag.

**Why:** edge evaluation is the only path that makes flag evaluation a near-zero-latency operation.

### BP-2.4 Use daemon mode for serverless workloads
For runtimes where the process lives for milliseconds (Lambda, Cloud Functions, Cloud Run), use daemon mode: Relay writes the flag dataset to a persistent store, and SDKs read from that store. No streaming connection to establish per invocation.

**Why:** streaming SDKs in serverless either fail or cost you re-establishing the connection on every cold start. Daemon mode is the right shape.

---

## 3. Relay Proxy sizing for performance

### BP-3.1 Size Relay for peak load, not average
The Relay's job at peak is the only job that matters. Sizing for average produces saturation at peak; saturation produces latency spikes. Estimate peak (typically 2-5× average for most workloads) and size to that with headroom.

**Why:** under-sizing Relay is invisible at average load and catastrophic at peak. The bill for over-sizing is small; the cost of saturation is large.

### BP-3.2 Monitor saturation as a leading indicator
Connection count, request rate, and CPU utilization on Relay instances. Alert before saturation, not at it. The lead time is what gives the team room to scale.

**Why:** Relay's failure mode is connection rejection, not graceful degradation. Catching saturation early is the only way to scale before it bites.

### BP-3.3 Use regional Relay topology for multi-region workloads
Each region runs its own Relay fleet, fronted by a regional load balancer, serving in-region applications. Cross-region Relay calls cost latency and create cross-region dependencies that hurt at every level.

**Why:** the cost of regional Relay is operational overhead. The cost of cross-region Relay is user-visible latency and a worse failure surface.

### BP-3.4 Run a launch-readiness review for traffic spikes
Before a major launch — feature launch, marketing campaign, seasonal peak — the team confirms Relay capacity, monitors during the event, and scales preemptively if needed.

**Why:** launch days are when Relay saturation is most likely. The 30-minute review prevents most launch-day incidents.

---

## 4. Event volume and ingestion cost

### BP-4.1 Know your event-per-user rate
A trended number, updated monthly: events emitted per active user per session. This is the lever that converts user growth into LaunchDarkly cost.

**Why:** event volume is the cost driver. The team that doesn't know the rate can't forecast cost growth.

### BP-4.2 Configure SDK buffering and flush deliberately
The SDK buffers events locally and flushes to LaunchDarkly on a configured interval. Match the configuration to the workload: longer intervals for mobile (battery-conscious), shorter for server-side (loss-conscious). Defaults are reasonable but not optimal for every workload.

**Why:** default buffering is fine for most teams. The teams running into ingestion-cost issues at scale benefit from tuned buffering.

### BP-4.3 Sample high-volume custom events
For custom events that fire frequently (every page view, every action, every click), sample at the application layer before the SDK sees them. A 1-in-10 sample of a 10M-events-per-day stream still produces 1M data points — more than enough for most decisions.

**Why:** uniform tracking at high volume is expensive without proportional analytical value.

### BP-4.4 Scope events to the surfaces that need them
Not every flag needs custom events. Not every surface needs full instrumentation. Decide which surfaces' events power decisions; instrument those well. Skip the rest.

**Why:** the team that "instruments everything" pays for data that nobody uses.

### BP-4.5 Monitor ingestion-rate trends
Daily/weekly trending of total events ingested, broken down by category (evaluation events, custom events, experiment events). A 2× increase deserves an investigation; a 10× increase needs one yesterday.

**Why:** invisible volume growth is invisible cost growth.

---

## 5. MAU and MCI economics

### BP-5.1 Track MAU and MCI monthly
The team's operational dashboard includes monthly MAU and MCI counts, trended over at least the last twelve months. Visible to engineering, product, and finance.

**Why:** shared visibility is shared accountability. The teams that surprise their finance teams at renewal aren't trending.

### BP-5.2 Forecast MAU/MCI before contract renewal
At least quarterly, project MAU and MCI for the next twelve months. Use the trend, the product roadmap, and known growth drivers. Compare against the contract tier; flag the gap; engage account management with time to plan.

**Why:** renewal-time surprises are operational failures. The forecast is the antidote.

### BP-5.3 Understand what counts toward MCI
[Multi-context evaluation](https://launchdarkly.com/docs/home/observability/contexts) means each evaluation can include multiple context kinds. Each unique context contributes to MCI; high-cardinality contexts (device IDs, session IDs) inflate MCI faster than low-cardinality ones (organization IDs).

**Why:** teams that adopt multi-context without modeling MCI growth find their MCI numbers don't match expectations.

### BP-5.4 Treat MAU growth like infrastructure growth
The MAU your product accumulates over the year is part of the cost trajectory just like the cloud bill, the observability bill, and the database bill. Budget for it. Review it. Discuss it.

**Why:** MAU normalization into the operating budget makes growth predictable and contract negotiation rational.

---

## 6. AI Config token and cost guardrails

### BP-6.1 Track cost-per-request per AI Config and per variation
Every AI Config evaluation produces a cost — model tokens, provider markups, request overhead. Track this at the SDK / application layer as a first-class metric.

**Why:** AI cost is the dimension that surprises most teams. First-class tracking turns surprises into trends.

### BP-6.2 Use cost as a guardrail on every AI rollout
Every AI Config variation rollout has a cost-per-request guardrail. If cost regresses by more than X% (10-25% is a sensible band), the rollout reverts. (See [AI/GenAI Lens — Evaluation and Measurement](../../lenses/ai-genai/evaluation-and-measurement.md).)

**Why:** cost regressions ship to 100% the same way feature regressions do, but they're invisible until the invoice. Guardrails catch them at 5%.

### BP-6.3 Build a per-feature AI cost dashboard
Cost attribution by AI feature / surface / variation. Reviewable monthly. Drives prompt-engineering and model-selection decisions.

**Why:** the team that can't attribute cost can't optimize it.

### BP-6.4 Reconcile provider invoices against internal cost metrics
The LLM provider's invoice should match (within a small variance) the team's internal cost-per-request metrics. Reconcile monthly; investigate large discrepancies.

**Why:** divergence indicates either a measurement bug or unmonitored usage. Both matter.

### BP-6.5 Cache where the use case allows
Deterministic-ish AI calls (translations of static content, classifications of stable inputs, summaries of unchanging documents) cache well. The cached call costs zero LLM tokens.

**Why:** the LLM call you don't make costs nothing. Caching is the cheapest cost reduction.

---

## 7. Observability ingestion cost

### BP-7.1 Set a session-replay sample rate appropriate to the use case
Recording every session is expensive and rarely necessary. Sample at a rate that produces enough sessions for incident investigation and product research without paying for storage you never query.

**Why:** session replay's value is in the queryable sessions, not in the unqueried ones.

### BP-7.2 Scope error reporting to surfaces where it's actionable
Not every error needs to be captured forever. Critical-path errors get full capture; debug-noise errors get aggregated or sampled.

**Why:** undifferentiated error capture creates noise and cost without informing decisions.

### BP-7.3 Set log retention windows by category
Operational logs may need 30 days; compliance-relevant logs may need 7 years; debug logs may need 7 days. Retention windows are policy, not default.

**Why:** uniform long retention is uniformly expensive. Differentiated retention matches the actual value of the data.

### BP-7.4 Budget observability the same way you budget LaunchDarkly
Observability is a line item with its own forecast and review. The team that doesn't track it discovers it via the bill the same way they discover MAU.

**Why:** observability cost can rival LaunchDarkly cost at scale. Both deserve the operating discipline.

---

## 8. Context cardinality and payload size

### BP-8.1 Pass only context attributes that targeting actually uses
For each context attribute, the team can name at least one targeting rule that uses it. Attributes that no rule uses are dead payload — they cost transmission, storage, and MCI without contributing to decisions.

**Why:** dead payload is silent overhead. Audit attributes at the same cadence as flag hygiene.

### BP-8.2 Distinguish high-cardinality from low-cardinality attributes
Low-cardinality (country: ~200 values, plan tier: ~5, device class: ~3) are bounded and predictable. High-cardinality (user ID, request ID, device ID) is unbounded and multiplies cost.

Use high-cardinality attributes for targeting precision where needed; use low-cardinality for bulk decisions.

**Why:** treating all attributes equivalently hides where the cost is.

### BP-8.3 Minimize payload size on mobile and client SDKs
Mobile clients pay for context in cellular data and battery. Client-side SDKs pay in download size and parse time. Keep payloads tight for these SDKs.

**Why:** mobile users notice the difference. The team that bloats the mobile context payload writes a bug users feel.

### BP-8.4 Treat multi-context as a deliberate decision, not a default
Multi-context evaluation is powerful, but each context kind in an evaluation multiplies the work. Use it when targeting requires it; not because more is better.

**Why:** the team that adopts multi-context casually finds their MCI tripling unexpectedly.

---

## 9. Sampling and aggregation

### BP-9.1 Use per-event sampling for high-volume metrics
For metrics that fire many times per session, sample uniformly (1 in N). The metric layer accounts for the sampling rate to produce correct estimates.

**Why:** statistical estimation from sampled data is well-understood. The cost reduction is dramatic.

### BP-9.2 Aggregate client-side where the math works
If the application can aggregate locally (count actions per session, sum durations per request), emit one summary event instead of one event per action.

**Why:** aggregation reduces the event count by an order of magnitude or more for some patterns.

### BP-9.3 Document sampling rates with the metric
Every metric's documentation includes the sampling rate. Decisions made on the metric account for it. Changes to the rate are explicit changes, not silent updates.

**Why:** undocumented sampling produces incorrect math downstream.

### BP-9.4 Validate experiment power against sampled metrics
If a metric is sampled, the effective sample size for an experiment is reduced. Account for this in sample-size planning. ([Experimentation BP-4.1](../experimentation/best-practices.md).)

**Why:** under-sampling produces under-powered experiments without warning.

---

## 10. Sprawl management

### BP-10.1 Audit projects, environments, and segments quarterly
Unused projects, environments, and segments accumulate. The quarterly archival pass for flags also covers these.

**Why:** sprawl carries operational and (sometimes) usage cost. Quarterly is the right cadence.

### BP-10.2 Decide project granularity deliberately
A new project is rarely the right answer to a small need. Reuse existing projects where it makes sense; create new ones only when the scope genuinely demands it. ([Governance BP-8.1](../governance/best-practices.md).)

**Why:** project sprawl is governance debt with cost implications.

### BP-10.3 Retire integrations that no longer serve a purpose
Integrations that fire into channels nobody reads, webhooks pointing at decommissioned services, exports nobody queries — these accumulate. Quarterly review; archive the unused.

**Why:** dead integrations consume operational attention and (for some) data egress cost.

---

## 11. Data Export and downstream cost

### BP-11.1 Right-size the Data Export volume
Export the events that downstream systems actually use. If the warehouse is consuming a stream where 80% of events are never queried, scope the export.

**Why:** Data Export volume drives warehouse compute cost. Right-sizing is leverage.

### BP-11.2 Monitor the downstream pipeline cost like a first-class metric
Snowflake / BigQuery / Redshift compute cost from LaunchDarkly-derived tables. Monthly trending. Investigate spikes.

**Why:** downstream cost from LaunchDarkly events can exceed the LaunchDarkly invoice itself for some workloads.

### BP-11.3 Coordinate schema changes with downstream consumers
A schema change in the LaunchDarkly export affects downstream pipelines. Notify consumers ahead of the change; check that no pipeline silently breaks.

**Why:** broken pipelines produce wrong data; wrong data produces wrong decisions.

---

## 12. Performance and cost observability

### BP-12.1 Build a cost dashboard that's reviewable monthly
A single view showing LaunchDarkly cost trends: MAU, MCI, AI cost (if applicable), observability ingestion, Data Export. Reviewed by engineering and finance together.

**Why:** shared dashboards are shared accountability. The team that hides cost from itself doesn't optimize it.

### BP-12.2 Alert on usage anomalies
A 2× increase in events per day, a 50% jump in MAU month-over-month, a step-change in AI cost — these get a ticket, not a quarterly retrospective.

**Why:** anomalies caught early are usually small. Anomalies caught at quarterly review are usually large.

### BP-12.3 Run a cost review at least quarterly
The team's quarterly operational review includes performance and cost. Findings drive concrete improvements: reduce sample rate here, retire that integration, scope this export, swap that AI variation.

**Why:** cost discipline is a cadence. Without one, the bill grows monotonically.

### BP-12.4 Treat performance regressions like correctness bugs
A 200ms increase in p95 latency on a customer surface is a bug. Triage it. Fix it. Don't let "we shipped a slower thing" become normalized.

**Why:** the team that accepts performance regressions trains itself to expect them.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
