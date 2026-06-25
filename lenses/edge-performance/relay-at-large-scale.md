# Relay Proxy at Large Scale

Operating LaunchDarkly Relay Proxy when scale exceeds the standard guidance. This page covers sizing, monitoring, capacity planning, and incident response for Relay fleets at the upper end of the volume curve — workloads that have outgrown "3 instances, 2 AZs" and need a more deliberate operating model.

For the base Relay deployment pattern, see [Reference Diagram 01](../../assets/diagrams/01-server-sdk-relay-topology.md) and [Reliability BP-4.x](../../pillars/reliability/best-practices.md).

---

## When this material applies

The standard Relay guidance (3 instances across 2 AZs per region, fronted by a load balancer) is sufficient for most workloads. Scale beyond it when:

- **SDK connection count exceeds tens of thousands per Relay instance.** A single instance can handle a lot, but past a point, more instances are needed.
- **Event throughput exceeds tens of thousands of events per second per instance.** The event ingestion path becomes the bottleneck before the connection count.
- **Peak traffic is many multiples of average.** A workload with 2× peak/average might be fine at 3 instances; a workload with 10× peak needs more headroom.
- **Multi-region with high traffic per region.** Each region's fleet sizes independently.
- **Many environments or projects served per Relay.** Autoconfig serving 20+ environments per Relay introduces its own scaling considerations.

---

## Sizing at scale

### Inputs to sizing

Estimate from the application side:

- **SDK instances per Relay instance.** What's the peak count?
- **Evaluation rate per SDK instance.** How many flag evaluations per second per SDK?
- **Event rate per SDK instance.** How many custom events per second per SDK?
- **Streaming connection count.** Same as SDK instance count for the streaming SDK pattern.

Aggregate these into Relay-fleet load:

- **Total SDK connections.** Total instances across all applications that connect to Relay.
- **Total evaluation rate.** Sum across the fleet.
- **Total event ingestion rate.** Sum across the fleet.

### Instance sizing

Each Relay instance can handle some maximum of each dimension. The actual limit depends on instance size (CPU, memory, network), but as guidance:

- Plan for **~10,000-20,000 streaming connections per instance** on modest hardware. More with larger instances.
- Plan for **~10,000-50,000 events ingested per second per instance**. Beyond this, multiple instances scale linearly.
- Plan for **at least 2× headroom from peak**. A fleet running near saturation degrades unpredictably.

These are rough guidelines. The team that operates Relay at scale should measure their own workload and size based on observed behavior, not on numbers from a document.

### Distribution across AZs

For a fleet of N instances, distribute across at least 2 AZs (3 if regulatory or business requirements demand). Anti-affinity rules in the orchestrator ensure no single AZ holds all instances.

For very high traffic, consider 3 AZs even where 2 suffice for reliability — it gives more elbow room for instance churn (deployments, scaling events).

### Per-region sizing

For multi-region workloads, each region's fleet sizes for that region's traffic. Don't size centrally and split — the sizing assumptions differ per region (peak hours, traffic mix, network characteristics).

---

## Monitoring at scale

The standard Relay metrics still apply (see [Operational Excellence BP-7.x](../../pillars/operational-excellence/best-practices.md)). At scale, the team operates them more rigorously:

### Always-on dashboards

A dashboard the team can pull up in under 30 seconds, covering:

- **Per-instance connection count.** Distribution across the fleet — even or skewed?
- **Per-instance request rate.** Same.
- **Per-instance latency.** p50, p95, p99 per instance.
- **Per-instance error rate.** Both connection errors and request errors.
- **Per-instance memory and CPU.** Saturation indicators.
- **Aggregate fleet-level totals.** For capacity planning.
- **Upstream latency to LaunchDarkly.** Relay's own dependency health.

### Alerting

Pre-saturation alerts. Configure based on:

- **Connection count approaching configured limit per instance.** Page before saturation, not at.
- **Sustained latency above SLO.** A 1-minute spike is fine; a 5-minute trend isn't.
- **Sustained upstream errors.** Brief errors are normal; sustained errors mean LaunchDarkly is having an issue or the team's connection is degraded.
- **Instance count below floor.** Auto-scaling didn't keep up; pages.
- **Memory or CPU saturation.** Same.

### Telemetry at SDK side

Beyond Relay's own metrics, the SDK fleet's view of Relay matters. Track:

- **SDK initialization success rate.** Drops here mean the SDK fleet is having trouble connecting.
- **SDK reconnect rate.** A spike means Relay instances are restarting or being churned.
- **SDK evaluation latency** (application-side).

These are the metrics that catch problems Relay's own metrics don't surface.

---

## Capacity planning at scale

### Launch-readiness reviews

For any traffic event that materially changes the load on Relay — a major launch, a marketing campaign, a seasonal peak — run a launch-readiness review:

- What's the expected traffic peak?
- Does the current fleet have headroom for it?
- If not, scale ahead of the event.
- Document the expected behavior; document the fallback if expected behavior doesn't materialize.

For very large launches, the team may pre-scale the Relay fleet a day or two in advance to allow the warm-up to complete.

### Trended planning

A monthly review of Relay-fleet usage:

- Trend total connection count over time.
- Trend total event volume.
- Project the next 6-12 months.
- Identify when current sizing becomes insufficient.

Relay scaling typically isn't urgent if trended — there's time to size up before saturation.

### Cost considerations

At scale, Relay fleet cost becomes meaningful. Optimization opportunities:

- **Right-sizing.** Are instances over-provisioned? Smaller instances at higher count vs. larger instances at lower count have different cost characteristics.
- **Spot instances for some fraction.** Some teams run a portion of the fleet on spot instances to reduce cost; mix with on-demand for stability.
- **Regional placement.** Avoid expensive regions where possible; place Relay close to application traffic.

---

## Incident response at scale

### Common incident patterns

**Capacity saturation.** Sudden traffic spike outruns the fleet. Symptoms: latency climbs, SDK connection errors appear.
- **Response:** scale out (manually if autoscaling isn't fast enough); investigate the traffic source; the team's expected-load model may need updating.

**Single-instance failure.** One instance crashes or becomes unhealthy.
- **Response:** the load balancer should evict it automatically. If autoscaling replaces it, no further action. If autoscaling fails, investigate.

**Sustained upstream errors.** LaunchDarkly's APIs are returning errors or slow.
- **Response:** check LaunchDarkly status. The fleet may continue serving from cache, but if the streaming connection fails, flag updates won't propagate.

**Regional issue.** One region's fleet has a problem.
- **Response:** failover to another region's fleet if the architecture supports it. Or accept the region's degradation and respond per the runbook.

### Runbook expectations

The Relay runbook covers each common incident pattern:

- Symptoms (what does the team see?).
- Initial response (immediate actions).
- Investigation steps.
- Recovery steps.
- Communication (who needs to know?).

For a high-traffic Relay fleet, the runbook is referenced often. Keep it current.

### Drills

The drill cadence for high-scale Relay:

- **Monthly drills** of single-instance failure. Verify the fleet handles it gracefully.
- **Quarterly drills** of full-AZ failure. The remaining AZ takes the load.
- **Annually** of more aggressive failure scenarios (entire region, sustained upstream degradation).

The team that operates Relay at scale runs drills routinely — they're part of the operational rhythm, not a special event.

---

## Autoconfig at scale

LaunchDarkly's Relay Proxy supports autoconfig — Relay subscribes to a LaunchDarkly autoconfig key and learns which projects / environments to serve dynamically. This is valuable at scale:

- **Many environments served per Relay.** Adding an environment is a one-touch change, not a fleet config update.
- **Operational simplicity.** The team doesn't manually configure each Relay's environment list.
- **Account-level visibility.** Which environments are being served is centrally visible.

Considerations at scale:

- **Memory and connection growth.** Each environment served adds load. Many environments per Relay means each instance is doing more.
- **Per-environment metric overhead.** Monitor aggregate fleet metrics, but also per-environment breakdowns for the heaviest environments.

---

## Multi-region Relay at scale

For organizations with traffic in many regions, Relay topology becomes:

- **Per-region fleets** as the default (see [Hybrid lens — Per-provider Relay fleets](../hybrid-multicloud/relay-topology-patterns.md)).
- **Each region sized for its own peak.**
- **Per-region runbooks** since failure modes differ.
- **Cross-region monitoring at the aggregate level** for the platform team.

The team that runs Relay in 10 regions runs each region with the same operational discipline as a single-region deployment, with an aggregate dashboard on top.

---

## Daemon mode at scale

For high-throughput serverless workloads, daemon mode (with a persistent store like Redis or DynamoDB) replaces or supplements streaming. At scale:

- **Persistent store sizing.** The store sees writes from Relay and reads from many SDKs. Size for the read throughput.
- **Store availability is now in the LD path.** The persistent store needs the same availability discipline as Relay.
- **Per-region stores.** Each region's daemon-mode workloads use the region's store.

The pattern is documented in [Reference Diagram 03](../../assets/diagrams/03-multi-region-daemon-serverless.md).

---

## A minimum-viable large-scale Relay checklist

For a Relay fleet operating at meaningful scale:

- [ ] Fleet sized for peak load with documented headroom (2×+).
- [ ] At least 3 instances per region; at least 2 AZs per region; 3 AZs preferred at higher scale.
- [ ] Always-on dashboard with per-instance and fleet-aggregate metrics.
- [ ] Pre-saturation alerting; instance-count-floor alerting; sustained-error alerting.
- [ ] Monthly capacity review.
- [ ] Launch-readiness review for major traffic events.
- [ ] Documented incident-response runbook covering common patterns.
- [ ] Monthly drill of single-instance failure; quarterly drill of AZ failure.
- [ ] Per-region operational model documented.
- [ ] (If using daemon mode) persistent store sized, monitored, and drilled.

---

← [Edge SDK Patterns](./edge-sdk-patterns.md) | Continue to → [Review Questions](./review-questions.md)
