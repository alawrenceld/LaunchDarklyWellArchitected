# Edge & Performance-Critical — Anti-Patterns

A catalogue of common, named failure modes for edge-deployed and latency-critical workloads.

---

## AP-1. The instant kill switch that wasn't

**Shape:** A serious bug ships at the edge. The team flips the kill switch in LaunchDarkly. Most edge nodes pick up the change within seconds. Some POPs take minutes. During those minutes, users on the lagging POPs continue to hit the bug. The team's "instant kill" assumption wasn't true.

**Why it's an anti-pattern:** edge propagation has lag. Critical kill paths cannot depend solely on this propagation completing in seconds.

**Symptom:** an incident's mitigation time was longer than the team expected because some POPs lagged.

**Remedy:** for critical kill paths, pair the edge flag with an origin-side enforcement that takes effect immediately regardless of edge propagation.

---

## AP-2. The origin lookup that defeated the edge

**Shape:** The team adopts edge SDK to remove network latency. The edge code, for every request, fetches the user's tenant data from the origin API to build the context. The origin round-trip is 150ms. The total latency benefit of edge evaluation is essentially zero.

**Why it's an anti-pattern:** edge's value is in eliminating the round-trip. An origin lookup on the critical path of every edge evaluation throws that away.

**Symptom:** the team adopted edge evaluation but the latency profile didn't improve.

**Remedy:** denormalize context to the edge (KV pre-population on login, derived attributes from the request itself). Origin lookups are off the critical path.

---

## AP-3. The propagation-assumes-instant rollout

**Shape:** The team configures a guarded rollout at 5%, with metrics evaluated every minute. Metrics get evaluated before propagation has reached all POPs. The metric values reflect a mix of users on the old and new variations. The "5% rollout" data is meaningless.

**Why it's an anti-pattern:** evaluating metrics during the propagation window measures the propagation, not the variation.

**Symptom:** rollout metrics during the early minutes are noisy and uninterpretable.

**Remedy:** observation windows that span propagation. Per-region ramps that allow each region to complete before the next.

---

## AP-4. The edge and origin in different projects

**Shape:** The team's edge code uses one LaunchDarkly client-side ID; the origin uses an SDK key from a different project (or different environment). The two projects' flag datasets diverge over time. The edge serves one variation; the origin assumes another.

**Why it's an anti-pattern:** the edge and origin must agree on flag state. Different projects guarantee they won't.

**Symptom:** customer-facing inconsistencies that trace to mismatched edge/origin flag values.

**Remedy:** edge and origin use the same project and environment. Validate at setup; periodically verify they still match.

---

## AP-5. The Relay fleet running on a wing and a prayer

**Shape:** The team operates Relay at significant scale. Three instances per region, sized at adoption time, never re-sized. Traffic has grown 3× since. Saturation is happening at peak. The team doesn't have monitoring to surface it; users see flag-eval latency spikes.

**Why it's an anti-pattern:** Relay at scale needs active capacity management. Set-and-forget doesn't work at scale.

**Symptom:** unexplained latency spikes at peak times.

**Remedy:** capacity monitoring, leading-indicator alerts, regular re-sizing reviews. Scale ahead of saturation.

---

## AP-6. The cache miss that produced wrong behavior

**Shape:** The edge SDK starts before KV has propagated. The cache is empty. The SDK call returns the configured fallback value. The application's fallback assumes "off" — but the actual variation should be "on." The application serves the wrong experience for the first minute after a new edge node spins up.

**Why it's an anti-pattern:** the cache miss path returns fallback; the fallback wasn't the value the team wanted under that condition.

**Symptom:** new edge node deploys correlate with brief incorrect-behavior windows.

**Remedy:** fallback values are chosen for the specific situation. If "off" isn't the right initial state, configure the SDK to fail closed (or fall through to origin) instead of returning the default.

---

## AP-7. The event volume that crushed the bill

**Shape:** Every edge request emits flag-evaluation and custom events. At 100,000 RPS globally, that's billions of events per day. The team's LaunchDarkly bill jumps 10×. Investigation reveals 95% of the events are evaluations of a single flag that's at a steady 100% rollout — no decision is being informed by the data.

**Why it's an anti-pattern:** event emission at edge scale, without sampling, dominates cost without analytical value.

**Symptom:** event ingestion cost dwarfs other LD-related costs.

**Remedy:** sample high-volume events. Especially for evaluation events on steady-state flags, sampling at 1-in-100 or lower keeps the cost manageable while preserving enough signal for analysis.

---

## AP-8. The Relay drill that never happened

**Shape:** The team has a documented Relay-incident runbook. They've never exercised it. During a real incident, the runbook turns out to be wrong: a procedure references a tool no longer in use; an escalation path goes to a defunct group; the recovery steps assume a topology that's since changed.

**Why it's an anti-pattern:** untested runbooks rot. When they're needed, the bugs in them compound the incident.

**Symptom:** during an incident, the runbook's steps don't match reality.

**Remedy:** monthly Relay drills. Update the runbook on every drill. Drilled runbooks are reliable runbooks.

---

## AP-9. The security-critical path on the edge

**Shape:** The team puts the auth-decision path on the edge for latency. Auth uses LD flag evaluation to decide which gate to apply. An edge node lags propagation; an auth-policy update doesn't reach it; users are evaluated against the old policy. Some users gain access they shouldn't have.

**Why it's an anti-pattern:** security decisions require strong consistency. Edge evaluation provides eventual consistency. Mismatch.

**Symptom:** an audit reveals brief windows of incorrect auth decisions traceable to edge propagation lag.

**Remedy:** auth decisions are origin-side. The edge can do non-security operations; security stays on the origin path with the server-side SDK.

---

## AP-10. The single-instance Relay at high scale

**Shape:** The team's Relay fleet started small. Scale grew. The Relay deployment never grew — still one instance, no AZ separation. When the instance gets restarted (for routine patching, for an autoscaler decision), the entire SDK fleet briefly loses connectivity. Brief, but disruptive at scale.

**Why it's an anti-pattern:** the Relay floor (3 instances, 2 AZs) is a floor for a reason. Operating below it at any scale is risky; operating below it at high scale is reckless.

**Symptom:** correlated SDK errors every time Relay restarts.

**Remedy:** at minimum, meet the floor: 3 instances, 2 AZs. At scale, exceed it.

---

## AP-11. The "edge will handle it" assumption

**Shape:** A new feature is at the edge. The team assumes it will be fast (it's at the edge!) and consistent (it's at the edge!) and resilient (it's at the edge!). They don't load-test, don't validate propagation behavior, don't drill failure modes. Production exposes all the assumptions.

**Why it's an anti-pattern:** "at the edge" isn't a property; it's a deployment location with specific trade-offs. Treating it as a panacea hides the trade-offs.

**Symptom:** post-incident, "we thought the edge would handle it."

**Remedy:** apply the same operational discipline to edge code as to origin code. Performance test, validate, drill.

---

## AP-12. The latency budget that nobody owns

**Shape:** The team has a stated latency budget of "p95 ≤ 100ms" for the customer-facing surface. Two years later, the actual p95 is 280ms. Nobody can pinpoint where the regression came from. The budget exists on paper but doesn't influence engineering decisions.

**Why it's an anti-pattern:** budgets without enforcement become aspirations. Aspirations don't constrain behavior.

**Symptom:** the budget and reality diverge over time without consequence.

**Remedy:** the budget is an SLO. Regressions trigger investigation. Periodic reviews compare actual to budget; deviations are owned and addressed.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
