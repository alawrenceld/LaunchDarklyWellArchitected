# Reference Architecture Diagrams

Cloud-neutral reference architectures for the most common LaunchDarkly deployment patterns. Each diagram is authored in [Mermaid](https://mermaid.js.org/), renders natively on GitHub, and is intended to be copied and adapted by readers.

The diagrams are deliberately provider-neutral — the same shapes apply on AWS, GCP, Azure, on-premises, or any combination. Provider-specific variants are called out where the topology meaningfully differs.

## Index

| # | Diagram | Pattern | Pillar(s) |
|---|---|---|---|
| 01 | [Server SDK + Relay Proxy topology](./01-server-sdk-relay-topology.md) | The canonical production deployment: server SDKs talk to a high-availability Relay fleet that fronts LaunchDarkly. | Reliability, OpEx |
| 02 | [Mobile + client + bootstrap](./02-mobile-client-bootstrap.md) | Offline-first client SDKs with server-rendered initial flag values; mobile-specific patterns. | Reliability, Safe Release |
| 03 | [Multi-region + daemon mode](./03-multi-region-daemon-serverless.md) | Regional Relay Proxy fleets with daemon mode populating a persistent store for serverless and ephemeral workloads. | Reliability, Performance & Cost |
| 04 | [Edge evaluation](./04-edge-evaluation.md) | Flag evaluation at the CDN edge (Cloudflare Workers / Vercel Edge / Fastly Compute) with propagation considerations. | Reliability, Performance & Cost |

## How to use these diagrams

- **Read** them alongside the relevant pillar to understand *why* the topology looks the way it does.
- **Copy** the Mermaid source into your own design docs as a starting point.
- **Adapt** them to your environment. Add your cloud-specific service names, network zones, and observability stack.
- **Submit improvements** — if you have a clearer way to render a pattern, file an issue or (LD employees) open a PR.

## A note on Mermaid

Mermaid renders natively on GitHub. If you're reading this in another tool that doesn't render Mermaid, copy the source block into the [Mermaid Live Editor](https://mermaid.live/) to see the diagram.

The choice of Mermaid over designed illustrations was deliberate (see [Decisions Log D-14](../../framework/decisions.md)): text-based, version-controllable, contributor-friendly.
