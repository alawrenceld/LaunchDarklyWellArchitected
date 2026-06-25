# Edge & Performance-Critical — Pillar Overlays

How each pillar specializes for edge-deployed and latency-critical workloads.

---

## Safe Release & Progressive Delivery

**Edge overlay:**
- Rollouts at the edge propagate with lag; progressive exposure works, but the team accounts for propagation when scheduling steps.
- Kill switches for edge-evaluated paths pair with origin-side blocks when seconds-of-mitigation matter.
- Guarded releases attach edge-relevant metrics: p95 / p99 latency, error rate at the edge, request volume. Origin-only metrics can miss edge-specific regressions.

---

## Operational Excellence

**Edge overlay:**
- Edge SDK health is monitored separately from origin SDK health. Edge runtimes have different failure modes (KV propagation lag, edge-node-specific issues).
- "Flags in motion" dashboards include edge propagation status — which flags have reached which edge regions.
- Runbooks include edge-specific procedures (CDN purge, edge-region failover, KV consistency check).

---

## Reliability & Resilience

**Edge overlay** — high-priority.
- The edge SDK's local cache and propagation behavior is the primary reliability mechanism. If the edge node loses its propagation link, the cache is what's serving.
- For mixed edge + origin architectures, the origin is the fallback if edge evaluation fails.
- Multi-region considerations apply: edge propagation may complete in some regions before others. Don't assume globally-consistent flag state.

---

## Performance & Cost Efficiency

**Edge overlay** — high-priority.
- Edge SDKs eliminate the network round-trip for the evaluation itself, but they don't eliminate the cost of the underlying data propagation.
- Edge event ingestion: events emitted from edge runtimes have their own cost path. Sample aggressively where appropriate.
- Relay at scale: capacity planning, per-region sizing, network egress cost considerations.

---

## Security & Compliance

**Edge overlay:**
- The client-side ID used by edge SDKs is public — the same considerations as for browser/mobile clients (see [Security & Compliance BP-2.4](../../pillars/security-and-compliance/best-practices.md)).
- Audit logs from edge SDKs flow back to LaunchDarkly via the events API; verify the audit chain is complete.
- For regulated workloads with edge components, residency considerations apply to where the edge nodes are located.

---

## Governance & Artifact Lifecycle

**Edge overlay:**
- Tag edge-evaluated flags: `evaluation:edge` or similar. Bulk operations and dashboards can filter.
- Flag retirements affecting edge-evaluated paths take longer to take full effect (the cache propagation lag works both ways).
- Code References across edge codebases (Workers, Edge Functions, Compute@Edge) ensures the archival workflow is comprehensive.

---

## Experimentation & Measurement

**Edge overlay:**
- Experiments at the edge benefit from low-latency evaluation (no per-evaluation cost) but face propagation lag (experiments take seconds to start at every edge node).
- Event collection from edge runtimes has different timing and reliability than origin events. Validate metric quality before drawing conclusions.

---

## Developer Experience & Velocity (Lens overlap)

**Edge overlay:**
- Local development against edge runtimes requires per-platform tooling (Wrangler for Cloudflare, Vercel CLI for Vercel, etc.). The LaunchDarkly local-dev pattern adapts to each.
- Testing edge code paths needs edge runtime emulation; the LD SDK's offline mode integrates with these emulators.

---

← [Design Principles](./design-principles.md) | Continue to → [Edge SDK Patterns](./edge-sdk-patterns.md)
