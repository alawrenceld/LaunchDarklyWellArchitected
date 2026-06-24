# Lens: Edge & Performance-Critical

> *Microseconds matter. So do propagation guarantees.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for teams running flag evaluation at the edge (Cloudflare Workers, Vercel Edge, Fastly Compute, Akamai) and for workloads with hard latency budgets. It is the lens that addresses the freshness/latency trade-off, edge-specific resilience, and the operational practice of running Relay Proxy fleets at scale.

## When this lens will apply

- You evaluate flags inside an edge runtime.
- Your latency budget is measured in milliseconds (or microseconds) and even Relay-Proxy-in-region adds too much.
- You run high-traffic Relay Proxy fleets and need a deeper operational playbook than the default.

## Phase 3 scope

The lens will cover edge SDK selection and topology, context propagation to the edge, the latency vs. freshness trade-off in detail, edge-specific kill switch design (acknowledging propagation lag), Relay Proxy at large scale (autoconfig, monitoring, capacity planning), and the integration of edge evaluation with origin-level evaluation.

In the meantime, see [Reliability — Edge delivery](../../pillars/reliability/best-practices.md) and [Reliability — Relay Proxy](../../pillars/reliability/best-practices.md).
