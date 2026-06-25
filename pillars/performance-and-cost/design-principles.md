# Performance & Cost Efficiency — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Performance & Cost pillar.

---

## PC-1. Latency is a property of the SDK choice

Flag evaluation happens in process or via a network call, depending on the SDK family. Server-side SDKs evaluate locally against a cached dataset — sub-millisecond latency. Edge SDKs evaluate at the CDN edge — also sub-millisecond, with a propagation lag in exchange. Client / mobile SDKs evaluate locally after a bootstrap or after the initial fetch — sub-millisecond after that.

The latency cost is in the *fetch*, not the *evaluation*. Design the SDK topology so the fetch happens off the critical path.

## PC-2. Cost scales with events, not with flags

Adding a flag is nearly free. Adding a million flag evaluations per second is not. The cost driver in LaunchDarkly is the *event stream* — flag evaluations, custom events, experiment events, observability ingestion — multiplied by the user count.

A team that has 50 flags and modest traffic pays less than a team with 10 flags and high traffic. Plan accordingly.

## PC-3. MAU and MCI are the price of growth — make them visible

MAU (monthly active users) and MCI (monthly context instances, for multi-context evaluation) directly drive the LaunchDarkly invoice. They scale with the product's success. The team that doesn't trend them is the team that gets blindsided at renewal.

Monthly trending, quarterly forecasting, and an explicit annual budget are the minimum.

## PC-4. AI cost is a release decision

LLM provider cost is a function of variation choices — model, prompt length, token output. A swap to a more expensive model is a release that quintuples cost-per-request. A prompt change that makes the model more verbose is a release that doubles token output.

These decisions are gated by cost guardrails on rollouts, not discovered on the invoice.

## PC-5. Cardinality multiplies

Context attributes with high cardinality (user ID, session ID, request ID, customer ID) multiply the number of contexts the system evaluates against. Each unique context can also contribute to MCI. Low-cardinality attributes (country, plan, tier) are bounded and predictable.

Pass high-cardinality attributes only when they're actually used in targeting. Don't include them "for completeness."

## PC-6. Sampling is free; uniform tracking is expensive

For very-high-volume signals (every click, every page view, every action), sampling reduces cost without meaningfully reducing decision quality. A 1-in-10 sample of a metric at 10 million events per day is still 1 million data points — more than enough for statistical significance.

The team that emits every event uniformly is paying for data they don't use.

## PC-7. Sprawl has carrying cost

Projects, environments, segments, and integrations that nobody actively uses still consume operational attention, complicate the role-and-permission graph, and (for some) contribute to ingestion or evaluation cost. Treat sprawl the way you treat stale flags — with archival discipline.

## PC-8. Performance budgets are explicit

Every customer-facing surface has a latency budget — what the team has decided is acceptable for the user experience. The flag-evaluation contribution to that budget is a known, agreed number. When the contribution exceeds it, the team has a defect to fix, not a fact to live with.

## PC-9. The bill is observability

The LaunchDarkly invoice is, for many organizations, the first place a usage anomaly surfaces. That is an operational failure. Cost telemetry should arrive at the team's dashboards on the same cadence as everything else they monitor.

## PC-10. Trade-offs are stated explicitly, not assumed

A faster, more expensive model is a trade-off. A higher-cardinality context model that supports better targeting is a trade-off. Lower-fidelity sampling that saves cost is a trade-off. State the trade-off. Decide it.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
