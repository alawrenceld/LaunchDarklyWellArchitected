# Pillar: Performance & Cost Efficiency

> *Speed and cost are properties you design for, not properties you discover at the bill.*

**Status: Phase 2 — draft scheduled, not yet written.**

This pillar covers evaluation latency, SDK choice for performance, Relay Proxy sizing and topology, event and analytics volume, experiment event volume, AI Config token and cost guardrails, Session Replay and Errors ingestion volume, the MAU/MCI cost model, context cardinality, payload size, sampling, project/environment sprawl, and Data Export cost considerations.

## When this pillar will be most relevant

- You're operating LaunchDarkly at scale and want to know where your bottlenecks are.
- You're optimizing latency on a customer-facing surface that depends on flag evaluation.
- You're managing AI Config costs and want a framework for it.
- You're approaching a contract renewal and want to project MAU/MCI accurately.

## Related Phase 1 pillars

- [Operational Excellence](../operational-excellence/) — already covers capacity planning, MAU/MCI monitoring, and launch-readiness reviews.
- [Reliability](../reliability/) — already covers Relay Proxy sizing per [LaunchDarkly's guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines), edge SDK trade-offs, and event ingestion resilience.

Until this pillar is published, draw on those pillars for the underlying practice.

## Phase 2 scope

See the [build plan](../../todo.md) for sequencing.
