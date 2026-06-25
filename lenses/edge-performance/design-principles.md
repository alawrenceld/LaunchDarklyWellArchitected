# Edge & Performance-Critical — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for edge-deployed and latency-budget-constrained workloads.

---

## EP-1. The latency budget is explicit

For every performance-critical surface, the team has documented its latency budget: the total time budget for the user-facing operation, broken down by component, with the LD evaluation contribution explicit. "Sub-millisecond" or "as fast as possible" are not budgets.

The team that doesn't set a budget can't tell when it's been exceeded.

## EP-2. Edge buys microseconds; you pay in freshness

Edge evaluation removes the network round-trip from the critical path. In exchange, flag updates propagate to edge nodes with lag — typically seconds, occasionally longer under degradation. Every edge-evaluated flag inherits this lag.

The team that adopts edge without acknowledging the freshness cost will be surprised when a flag flip takes minutes to land everywhere.

## EP-3. The kill switch you can't propagate isn't a kill switch

For critical surfaces deployed at the edge, a single LaunchDarkly kill switch is not the only safety mechanism. Edge propagation lag means the kill switch might not reach all edge nodes for seconds — and during those seconds, the broken behavior continues. For surfaces where seconds matter, pair the LD kill switch with an origin-side block, a CDN purge, or a separate edge-native mechanism.

Don't depend on a single propagation path for ultra-critical kill paths.

## EP-4. Context-at-edge is the foundation

Edge evaluation only works correctly if the context — user identity, organization, region, plan, whatever the targeting rules need — is available at the edge. Context that requires an origin round-trip to materialize defeats the edge's latency benefit (and often makes the evaluation just plain wrong if the trip is skipped).

Plan the context pipeline before adopting edge SDKs.

## EP-5. Relay at scale is a production system in its own right

A Relay Proxy fleet serving millions of SDK instances is a real production system with its own capacity, observability, and incident-response needs. The standard guidance (3 instances, 2 AZs) is a floor; high-scale operations need much more, with active capacity planning and dedicated operational attention.

The team that operates Relay casually at scale will be surprised by an incident.

## EP-6. Edge SDK choice is per-platform

Cloudflare, Vercel, Fastly, and Akamai each have different edge runtimes and different LaunchDarkly SDK shapes. The right SDK is the one designed for the platform; cross-platform abstraction layers usually leak performance or correctness.

Pick the edge SDK that matches your edge platform; don't fight the platform.

## EP-7. Sample where data fidelity tolerates it

At very large scale, full event capture is expensive. Sampling — at the application layer, the SDK layer, or both — reduces cost without meaningfully reducing decision quality for many metrics. The team that captures every event of every kind at scale is paying for analytical value they don't extract.

See [Performance & Cost BP-9.x](../../pillars/performance-and-cost/best-practices.md) for sampling discipline.

## EP-8. Edge and origin must agree

For workloads that combine edge evaluation (read paths) with origin evaluation (write paths, auth), both paths must use the same flag dataset and produce consistent results. A read at the edge that returns one variation and a write at the origin that assumes another variation is a hard-to-debug class of incident.

Design the edge/origin handoff before shipping.

## EP-9. Drill propagation, drill saturation

Edge propagation behavior under degradation is not the same as under healthy conditions. Same for Relay saturation. Both should be drilled, with documented expected behavior, on a defined cadence.

The team that assumes "the edge will be fine" or "Relay handles whatever we throw at it" is the team whose incidents teach them otherwise.

## EP-10. Performance regressions are correctness bugs

A 30ms regression in p95 latency on a customer-facing surface is a bug. Not "a tradeoff," not "the new normal" — a bug. Triage and fix. The team that accepts gradual regression trains itself to expect it.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
