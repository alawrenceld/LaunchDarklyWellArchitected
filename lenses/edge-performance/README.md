# Lens: Edge & Performance-Critical

> *Microseconds matter. So do propagation guarantees.*

The Edge & Performance-Critical Lens specializes LDWA for two related categories of workload: those that evaluate flags at the CDN edge (Cloudflare Workers, Vercel Edge, Fastly Compute, Akamai EdgeWorkers), and those with latency budgets so tight that even in-region Relay isn't enough. The lens covers edge SDK selection, propagation lag handling, kill-switch design under latency constraints, and Relay Proxy operation at large scale.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true:

- Flag evaluation happens at the **CDN edge** (Cloudflare Workers, Vercel Edge, Fastly Compute, Akamai EdgeWorkers, or equivalent).
- Your latency budget for flag evaluation is **measured in microseconds**, not milliseconds.
- You operate **very large Relay Proxy fleets** (tens or hundreds of instances) and the standard guidance feels insufficient.
- You serve **high-traffic content** where the latency cost of a non-edge evaluation would meaningfully degrade user experience.
- You operate **edge-deployed business logic** (auth gates, content selection, A/B routing at the CDN layer).

If your workload runs entirely on origin servers with normal latency budgets, the standard Reliability and Performance & Cost pillars are sufficient.

## Contents

1. [Design Principles for Edge & Performance-Critical Workloads](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md)
3. [Edge SDK Patterns](./edge-sdk-patterns.md) — selecting and operating edge SDKs; context propagation; the freshness vs. latency trade-off.
4. [Relay Proxy at Large Scale](./relay-at-large-scale.md) — sizing, monitoring, capacity planning, and operating Relay fleets at the upper end of the volume curve.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

1. Run the standard pillar review.
2. Walk this lens's [review questions](./review-questions.md). Pay particular attention to edge propagation lag, context-at-edge correctness, and Relay-fleet observability at scale.
3. Many edge / perf-critical workloads will surface findings around **Reliability** and **Performance & Cost**. Use the standard guidance plus the overlays here.

## The headline principles

- **Edge evaluation buys microseconds at the cost of freshness.** Both are real; both have consequences.
- **The kill switch you can't propagate isn't a kill switch.** Plan for propagation lag.
- **Context-at-edge is the foundation.** No correct evaluation without correct context.
- **Relay at scale is a real production system.** Capacity, observability, drills — full operational discipline.
- **Latency budgets are explicit.** "Fast" isn't a budget; "p95 ≤ 50ms" is.
- **Edge is one tool, not the only one.** Mix edge + origin + Relay deliberately.
