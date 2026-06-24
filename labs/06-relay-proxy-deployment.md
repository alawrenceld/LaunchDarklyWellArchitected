# Lab 06 — Relay Proxy Deployment

**Pillars:** Reliability & Resilience, Operational Excellence
**Time:** ~2–3 hours
**Difficulty:** Intermediate / Advanced

---

## What you'll build

A production-grade [LaunchDarkly Relay Proxy](https://launchdarkly.com/docs/sdk/relay-proxy) deployment: three instances across two availability zones in one region, fronted by a load balancer, monitored like a production service, and exercised with a degradation drill.

By the time you're done you will have:

- A Relay Proxy fleet running per LaunchDarkly's [recommended floor](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines).
- SDK clients configured to talk to Relay (not directly to LaunchDarkly).
- Monitoring covering saturation, latency, and error rate.
- A runbook for Relay-related incidents.
- A completed degradation drill that confirms the failover behavior.

This lab is cloud-agnostic: the Relay can run on AWS, GCP, Azure, on-prem, or hybrid. The steps describe what to deploy; the *how* depends on your environment.

---

## Prerequisites

- A LaunchDarkly account.
- A target environment you can deploy to (Kubernetes cluster, ECS, GKE, AKS, Nomad, plain VMs — any will work).
- Access to a load balancer (cloud LB, NGINX, HAProxy, or service-mesh).
- A monitoring stack (Prometheus + Grafana, Datadog, New Relic, CloudWatch, or equivalent).
- An understanding of when *not* to deploy Relay — see [Reliability BP-4.1](../pillars/reliability/best-practices.md). If you're deploying it because "it sounds safer," reconsider; this lab assumes you have a real reason.

---

## Step 1 — Decide why you're deploying Relay

Before any infrastructure, name the reason. Common reasons:

- **Restricted egress.** Your network forbids direct outbound to LaunchDarkly from application hosts. Relay centralizes the egress.
- **Serverless / daemon-mode workloads.** Short-lived runtimes can't hold streaming SDK connections; Relay in daemon mode populates a shared store the SDKs read from.
- **High SDK density.** Hundreds or thousands of SDK instances per region; Relay reduces total connection count to LaunchDarkly and improves tail latency.
- **In-region evaluation.** Latency-sensitive workloads benefit from a closer evaluation endpoint.

If you can't name a reason, you probably don't need Relay. The Relay Proxy adds operational surface; it pays off when one of these reasons applies.

**Why this matters:** infrastructure you don't need is infrastructure that fails in ways you didn't plan for. See [Reliability BP-4.1](../pillars/reliability/best-practices.md).

---

## Step 2 — Plan capacity

Estimate the load:

- **SDK connection count.** Roughly one streaming connection per server-side SDK instance.
- **Event throughput.** Flag evaluations, custom events, experiment events. Estimate per-second peak.
- **Cache size.** The flag dataset for the projects/environments Relay serves.

Then pick instance size:

- **CPU/memory:** start with what the [Relay Proxy guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines) recommend for your scale tier; size up if your load exceeds the assumptions.
- **Disk:** small (Relay is mostly in-memory). Logs need a destination.

Plan for headroom — at least 2× peak. Relay degrades before it fails; under-sizing produces subtle problems.

**Why this matters:** under-sized Relay creates mysterious connection failures during exactly the moments when you need it most. See [Reliability BP-4.2](../pillars/reliability/best-practices.md).

---

## Step 3 — Deploy three instances across two AZs

The recommended floor:

- **At least three instances.** Three lets you take one down for maintenance and still have redundancy.
- **At least two availability zones.** Same-region multi-AZ; survives a single-AZ failure.
- **Fronted by a load balancer.** The LB owns the SDK-facing endpoint; SDKs are stable across Relay instance changes.

Deployment options:

- **Kubernetes.** LaunchDarkly's [Helm chart](https://launchdarkly.com/docs/sdk/relay-proxy/deploying) is the easiest path. Configure three replicas, anti-affinity rules to spread across AZs.
- **ECS / Cloud Run / Container Apps.** Run as a managed container service with a managed LB.
- **VMs.** Run the [Relay binary](https://launchdarkly.com/docs/sdk/relay-proxy/deploying) on three VMs across two AZs, behind a cloud LB or NGINX.

Configure each instance with a server-side SDK key (or use [Relay autoconfig](https://launchdarkly.com/docs/sdk/relay-proxy)) so it knows which projects/environments to serve.

**Why this matters:** single-instance Relay is the opposite of a reliability layer. See [Reliability AP-5](../pillars/reliability/anti-patterns.md).

---

## Step 4 — Point your SDKs at Relay

For each application using LaunchDarkly, configure the SDK to talk to Relay instead of directly to LaunchDarkly.

```pseudocode
config = {
  base_uri: "https://relay.internal.your-org.com",
  stream_uri: "https://relay.internal.your-org.com",
  events_uri: "https://relay.internal.your-org.com",
  # other config...
}
ldclient = LDClient(sdk_key, config)
```

The exact field names vary by SDK; consult the [SDK configuration for Relay docs](https://launchdarkly.com/docs/sdk/relay-proxy/sdk-config).

Roll the configuration out progressively:

1. Update one canary application; verify Relay traffic and SDK behavior.
2. Expand to a small percentage of your fleet.
3. Expand to the rest.

**Why this matters:** Relay-in-place is only useful if the SDKs actually use it. The cutover is itself a rollout — treat it like one.

---

## Step 5 — Set up monitoring

Deploy dashboards and alerts for Relay. The metrics to watch:

| Metric | Why |
|---|---|
| **Active SDK connection count** | Saturation indicator. Compare against capacity planning. |
| **Request rate** | Throughput. Trend over time; alert on anomalies. |
| **Request latency (p50, p95, p99)** | User-facing latency for flag evaluation. |
| **Connection establishment errors** | A new SDK can't connect — symptom of capacity or networking issues. |
| **Streaming connection lifetime distribution** | Healthy connections last hours; flapping connections indicate a problem. |
| **Memory / CPU / heap (per instance)** | Standard infra metrics; saturation precedes failure. |
| **Latency to LaunchDarkly upstream** | Relay's own dependency. |
| **Backend errors from LaunchDarkly** | Upstream issues; matters even if your Relay is healthy. |

Alert on:

- Saturation (connection count approaching configured limits).
- Sustained latency above your SLO.
- Instance count below the floor.
- Sustained backend errors from LaunchDarkly.

**Why this matters:** Relay degrades before it fails. Catching degradation in monitoring is what prevents the failure. See [Reliability BP-4.3](../pillars/reliability/best-practices.md).

---

## Step 6 — Document the runbook

Write a short Relay runbook covering:

- **Architecture diagram.** Where the instances run, which projects they serve, who owns the deployment.
- **SDK configuration.** What URI the SDKs use; how to switch SDKs back to direct-to-LaunchDarkly if needed.
- **Common failure modes.** Saturation, single-instance failure, all-instances unreachable, upstream LaunchDarkly degradation.
- **Recovery procedures.** Scale up, restart instances, drain a failing AZ, emergency fallback to direct-to-LaunchDarkly.
- **Capacity scaling triggers.** When to add capacity.
- **Maintenance procedures.** Rolling restarts, version upgrades, configuration changes.

Link the runbook from your on-call page.

**Why this matters:** Relay-specific incidents are infrequent enough that the team won't remember the playbook in the moment. See [Operational Excellence BP-5.2](../pillars/operational-excellence/best-practices.md).

---

## Step 7 — Drill: take down one Relay instance

In a controlled window:

1. Notify the team.
2. Have monitoring open.
3. Drain (or kill) one Relay instance.
4. Observe:
   - Do SDK connections rebalance across remaining instances within seconds?
   - Does request latency stay within SLO?
   - Are there any spurious errors during the rebalance?
5. Bring the instance back. Confirm normal operation.

Document what you saw. Update the runbook if anything was unexpected.

**Why this matters:** the failover claim is hypothetical until you've tested it. See [Reliability BP-9.2](../pillars/reliability/best-practices.md).

---

## Step 8 — Drill: simulate all-Relay-unavailable

This is the more aggressive drill. Plan it carefully.

In a controlled window:

1. Either: scale all Relay instances to zero, or block network access from a canary application's environment to Relay.
2. Observe the canary application:
   - Does the SDK fail back to direct-to-LaunchDarkly (if configured), to the local cache, or to fallback values?
   - Does the user experience hold?
3. Restore Relay (or unblock network access).
4. Confirm normal operation resumes within the SDK's reconnect window.

For a workload where direct-to-LaunchDarkly fallback isn't viable (restricted egress), the drill becomes: does the application gracefully degrade to fallback values for the duration?

**Why this matters:** unplanned-for Relay outages take down the SDK fleet. Planned-for ones don't. See [Reliability BP-4.4](../pillars/reliability/best-practices.md).

---

## Step 9 — For serverless workloads, set up daemon mode

If you deployed Relay primarily for serverless workloads, configure [daemon mode](https://launchdarkly.com/docs/sdk/relay-proxy/use-cases):

1. Deploy a persistent store (Redis, DynamoDB, Memcached, or other supported backend).
2. Configure Relay in daemon mode to write the flag dataset to the store.
3. Configure your serverless SDKs in daemon mode to read from the same store.
4. Verify: a serverless function can evaluate flags within milliseconds of cold-start, with no SDK initialization wait.

**Why this matters:** daemon mode is the right pattern for ephemeral workloads. Streaming SDKs in serverless are the wrong pattern. See [Reliability BP-4.5](../pillars/reliability/best-practices.md).

---

## Success criteria

You have completed the lab when:

- [ ] You can articulate the reason your team deployed Relay.
- [ ] Three Relay instances are running across two availability zones, fronted by a load balancer.
- [ ] SDKs are configured to use Relay.
- [ ] Monitoring covers saturation, latency, errors, and instance count, with calibrated alerts.
- [ ] A Relay runbook exists and is linked from the on-call page.
- [ ] You've drilled single-instance failure and all-Relay-unavailable, and the runbook reflects what you learned.
- [ ] If applicable, daemon mode is configured for serverless workloads.

---

## What to do next

- Read the [Reliability pillar](../pillars/reliability/) end-to-end.
- For multi-region deployments, repeat this lab per region.
- For the [Hybrid / Multi-Cloud / On-Prem Lens](../lenses/hybrid-multicloud/) (Phase 3), the Relay topology decisions get richer.

---

## Teardown

If you ran the lab as a learning exercise on a test environment, you can scale Relay back down. If you ran it on a real production environment, **don't tear it down** — keep the deployment, keep the runbook, schedule the next drill.
