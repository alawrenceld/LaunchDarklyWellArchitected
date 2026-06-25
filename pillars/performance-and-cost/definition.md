# Performance & Cost Efficiency — Definition

This pillar is organized into the following focus areas.

---

## 1. Evaluation latency

The user-facing latency cost of flag evaluation. Covers the latency characteristics of each SDK family (server, client, mobile, edge), the role of bootstrap and caching, the design of evaluation calls so they don't sit on the critical path, and the practice of setting an explicit flag-evaluation budget per surface.

## 2. SDK and topology choice for performance

The architectural choices that shape evaluation performance. Covers SDK selection per runtime, the Relay Proxy decision (when it helps vs. hurts), edge SDK deployment for latency-critical paths, daemon mode for serverless, and the relationship between SDK topology and the latency budget.

## 3. Relay Proxy sizing and topology

The Relay Proxy as a performance lever. Covers sizing for peak load (not just average), instance density across availability zones, the connection-count vs. instance-count trade-off, monitoring saturation as a leading indicator, and the implications of regional Relay topologies for tail latency.

## 4. Event volume and ingestion cost

The cost driver in most LaunchDarkly accounts. Covers flag-evaluation events, custom events, experiment events, the SDK's buffering and flush behavior, the cost trajectory as MAU grows, and the strategies (sampling, aggregation, scoping) for managing volume without losing signal.

## 5. MAU and MCI economics

The monthly-active-user and monthly-context-instance dimensions that drive the LaunchDarkly subscription cost. Covers what counts as a context instance, the multiplier effect of multi-context evaluation, the trending and forecasting cadence, and the practice of treating MAU/MCI as a first-class operational metric.

## 6. AI Config token and cost guardrails

The cost layer of AI features. Covers per-request token cost, p95 cost-per-request, cost regression detection on AI rollouts, the relationship between prompt length / model choice / cost, and the integration of cost guardrails into the rollout workflow. (See the [AI/GenAI lens](../../lenses/ai-genai/) for the deeper AI-specific treatment.)

## 7. Observability ingestion cost

The ingestion volume from LaunchDarkly Observability (Session Replay, Errors, Logs). Covers session sample rate, error volume per surface, log retention windows, the trade-off between observability fidelity and ingestion cost, and the integration with the team's broader observability budget.

## 8. Context cardinality and payload size

The dimensions of context data that affect both cost and performance. Covers high-cardinality vs. low-cardinality attributes, the discipline of passing only attributes that are used in targeting, payload-size considerations for client and mobile SDKs, and the multiplier effect of multi-context evaluation.

## 9. Sampling and aggregation strategies

Techniques for reducing event volume without losing decision quality. Covers per-event sampling, per-context sampling, client-side aggregation, the statistical implications of sampling for experimentation, and the cost-vs-fidelity trade-off in practice.

## 10. Project, environment, and integration sprawl

The accumulated overhead of unused or under-used LaunchDarkly resources. Covers project granularity decisions, environment proliferation, segment debt, the operational cost of stale integrations, and the archival practice that contains sprawl.

## 11. Data Export and downstream pipeline cost

The cost of moving LaunchDarkly data into the data warehouse and downstream systems. Covers Data Export volume, schema design, the cost of the downstream analytics pipeline (Snowflake/BigQuery/Redshift compute), and the relationship between LaunchDarkly events and the team's broader data-platform budget.

## 12. Performance and cost observability

The dashboards, alerts, and reviews that make performance and cost visible. Covers the metrics that should be on the team's day-2 dashboards, the alerting strategy for usage anomalies, the cadence of cost reviews, and the integration with the finance team's reporting.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
