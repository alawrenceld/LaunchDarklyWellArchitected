# Reliability & Resilience — Definition

This pillar is organized into the following focus areas.

---

## 1. SDK selection and topology

The right SDK for the right workload. Covers the choice between server-side, client-side, mobile, and edge SDKs; the implications of each for caching, streaming, evaluation locality, and credential handling; and the topology decisions (one SDK instance per process? one shared? one per request?).

## 2. SDK initialization, bootstrap, and offline behavior

How the SDK comes up, what it does when it can't connect, and what data it has when initialization fails. Covers init timeouts, the bootstrap pattern for client-side SDKs (server-rendered initial flag values), offline mode, and the SDK's own caching behavior.

## 3. Default values and fallback paths

The value the SDK returns when LaunchDarkly is unreachable, and the application code that survives that value. Covers fallback selection, the discipline of treating fallback as a code path, and the relationship between off variations and fallback values.

## 4. Relay Proxy deployment and resilience

The [Relay Proxy](https://launchdarkly.com/docs/sdk/relay-proxy) as a high-availability deployment. Covers when to use proxy mode vs. daemon mode, sizing per [LaunchDarkly's guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines) (minimum three instances across two AZs per region, fronted by a load balancer), monitoring, capacity headroom, and the procedures for Relay-related incidents.

## 5. Edge delivery and low-latency evaluation

When and how to evaluate flags at the edge (Cloudflare Workers, Vercel Edge, Fastly Compute, Akamai). Covers the latency / freshness tradeoff, the implications for context propagation, and the resilience properties of edge-evaluated flags.

## 6. Multi-region and failover

For systems with multi-region deployment, how LaunchDarkly is integrated across regions. Covers Relay Proxy deployment per region, the choice between regional and global flag evaluation, and the failover posture.

## 7. AI Config and LLM provider resilience

The failure modes specific to AI Configs and the LLM providers they depend on. Covers provider timeouts, error handling, fallback variations, multi-provider patterns, and the use of AI Config variations for graceful degradation.

## 8. Event ingestion resilience

What happens to the event stream (flag evaluations, experiment events, custom events) when conditions degrade. Covers SDK-side buffering, batched ingestion behavior, the implications for experiment accuracy under load, and the recovery path after an ingestion interruption.

## 9. Chaos and failure-mode drills

How the team validates the system's resilience claims. Covers production drills (offline SDK, degraded Relay, dropped provider), failure-injection in pre-production, game days, and the documentation of expected behavior under each failure mode.

## 10. Dependency posture per system

The deliberate choice of how hard a dependency LaunchDarkly is for each LD-managed system. Covers the spectrum from "we serve the fallback and tell the user" to "we rely on LD for fresh evaluation" and the resilience controls that match each posture.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
