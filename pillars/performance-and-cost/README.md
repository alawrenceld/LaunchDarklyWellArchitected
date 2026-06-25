# Pillar: Performance & Cost Efficiency

> *Speed and cost are properties you design for, not properties you discover at the bill.*

The Performance & Cost pillar covers how the LaunchDarkly layer affects user-facing latency, infrastructure load, and the team's actual spend. It is the pillar that prevents the "we shipped it and the next month's invoice was 3× larger" surprise — and the "we shipped it and our p95 latency doubled" surprise that sometimes accompanies it.

The principles here apply at every scale. A small team's cost surprises are small; a large team's are large; both deserve the same operational discipline. The team that ignores performance and cost finds out about both at the worst possible moments: launch days, renewal conversations, and incident retrospectives.

This pillar overlaps with Reliability (which covers Relay Proxy sizing for *availability* — here we cover it for *performance*) and with Operational Excellence (which covers capacity-planning practice — here we cover the underlying economic and latency reality).

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 2 |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md) — the principles specific to Performance & Cost.
2. [Definition](./definition.md) — focus areas inside the pillar.
3. [Best Practices](./best-practices.md) — what to do, organized by focus area.
4. [Review Questions](./review-questions.md) — diagnostic questions for a LDWA review.
5. [Anti-Patterns](./anti-patterns.md) — common ways this pillar goes wrong.

## When this pillar is most relevant

- You're operating LaunchDarkly at scale and want to know where your bottlenecks are.
- You're optimizing latency on a customer-facing surface that depends on flag evaluation.
- You're managing AI Config costs and want a framework for the trade-offs.
- You're approaching a contract renewal and want to project MAU/MCI accurately.
- You're explaining the LaunchDarkly bill to finance and want concrete answers about what's driving it.
- You've adopted LaunchDarkly Observability (Session Replay, Errors, Logs) and the ingestion volume needs managing.

## Related pillars

- **Reliability** — covers Relay Proxy sizing for availability. Performance & Cost covers sizing for latency and throughput.
- **Operational Excellence** — covers the practice of capacity planning. Performance & Cost covers the underlying decisions that the planning is about.
- **Safe Release** — covers guardrail metrics including cost-per-request for AI rollouts. Performance & Cost defines the cost layer those guardrails measure.
- **AI/GenAI Lens** — covers cost-and-latency discipline specifically for AI Configs.

## The headline principles

- **Latency is in the SDK choice.** Server, client, mobile, edge — each has different latency characteristics. Pick deliberately.
- **Cost is in the events.** Flag evaluations, custom events, experiment events, Session Replay frames — each multiplies by user count.
- **MAU/MCI is the price of growth.** Forecast it before renewal, not after.
- **AI cost is a release decision.** Token regressions ship to 100% the same way feature regressions do.
- **Cardinality is a silent killer.** A context attribute with high cardinality multiplies everything.
- **Sprawl is debt.** Unused projects, environments, and segments cost compute, attention, and money over time.
