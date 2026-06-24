# Reliability & Resilience — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The "if LD is down we are down" architecture

**Shape:** Every request depends on a fresh LaunchDarkly evaluation. If the SDK can't reach LaunchDarkly within milliseconds, the request fails. There is no fallback path that the application can serve from.

**Why it's an anti-pattern:** LaunchDarkly is highly available but no service is invulnerable. Architecting your product to *require* its availability inherits the union of every dependency LaunchDarkly itself has.

**Symptom:** the team can't articulate what happens during a LD outage; the most honest answer is "we'd be down."

**Remedy:** redesign so the SDK fallback value is sufficient to serve users. Cache aggressively. Default flags to the safe state.

---

## AP-2. The per-request SDK init

**Shape:** A server-side SDK is initialized inside the request handler. Every request spins up a new client, establishes a streaming connection, evaluates, and tears down.

**Why it's an anti-pattern:** the SDK is designed to be a long-lived singleton. Per-request init wastes the streaming infrastructure, slows every request, and creates connection storms that affect the whole fleet.

**Symptom:** SDK connection metrics show counts proportional to request rate, not process count.

**Remedy:** singleton SDK at process start. For serverless, switch to daemon mode or an edge SDK.

---

## AP-3. The unbounded init

**Shape:** The SDK is initialized at process startup with no timeout. On a degraded network or a degraded LD, initialization blocks forever. The application can't start.

**Why it's an anti-pattern:** unbounded waits couple your startup to an external service. The flag system is supposed to be safe; here it's a single point of failure for boot.

**Symptom:** during a transient connection issue, application pods get stuck in a `pending` state.

**Remedy:** bounded init timeout. After the timeout, the application proceeds with fallback values; the SDK continues to attempt connection in the background.

---

## AP-4. The fallback that breaks the app

**Shape:** The SDK call passes a fallback value. Under fallback (LD unreachable), the application takes a code path that nobody has tested. That code path has a bug — a null reference, an unhandled enum case, an off-by-one — and the application crashes.

**Why it's an anti-pattern:** the fallback path is invoked precisely during incidents. Discovering it doesn't work then makes the incident worse.

**Symptom:** during a LD-related event, the application crashes instead of degrading.

**Remedy:** test the fallback path. Use offline mode in CI. Run drills.

---

## AP-5. The single-instance Relay Proxy

**Shape:** A team adopts Relay. They deploy one instance. It runs on a single node, in a single AZ. When it restarts (or its node fails), the whole SDK fleet loses connectivity until it's back.

**Why it's an anti-pattern:** the Relay Proxy was deployed as a reliability layer; a single instance is the opposite of reliability.

**Symptom:** correlated SDK failures every time the Relay container restarts.

**Remedy:** follow the [Relay guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines) floor — minimum three instances, two AZs, load-balanced.

---

## AP-6. The flag that took ten minutes to flip at the edge

**Shape:** A kill switch is flipped during an incident. The team waits. The product surface served by the edge SDK doesn't change. Minutes go by. Eventually it propagates. By then the incident is much worse.

**Why it's an anti-pattern:** edge propagation lag is real. Designing kill switches that rely on instant edge propagation sets up exactly this scenario.

**Symptom:** mid-incident "why isn't the flag taking effect?"

**Remedy:** know the propagation behavior of every SDK path your kill switches traverse. For paths with non-trivial lag, design alternate kill paths (origin-level switch, CDN purge, request blocker).

---

## AP-7. The provider that took the whole feature down

**Shape:** An AI feature depends on a single LLM provider. The provider has a regional outage. The feature has no fallback variation. Users see errors for the duration of the outage.

**Why it's an anti-pattern:** LLM providers are less reliable than core infrastructure. Single-provider dependency for a business-critical AI feature is a known-bad pattern.

**Symptom:** an LLM provider's status page goes red and the team's AI feature follows.

**Remedy:** define fallback variations for every AI Config. For business-critical features, configure multi-provider variations and exercise them in drills.

---

## AP-8. The runaway prompt

**Shape:** An AI Config change introduces a prompt that, due to its structure, causes the model to produce verbose responses. Each call now takes 30 seconds instead of 3, and uses 10× the tokens. Application latency degrades; LLM bill spikes; users wait.

**Why it's an anti-pattern:** prompt changes are user-facing releases with cost and latency consequences. Without guardrails, they ship to 100% and exhaust budgets and patience.

**Symptom:** sudden spike in LLM cost or p95 AI latency that nobody planned for.

**Remedy:** progressive exposure for prompt changes; cost-per-request and p95 latency as guardrails; provider-side timeouts that cap pathological cases.

---

## AP-9. The drill that never happens

**Shape:** The team's resilience claims are theoretical. "If LD goes down, we'd serve fallbacks." Nobody has tested it in production. When LD does have a brief degraded moment, the team discovers their fallback assumptions were wrong.

**Why it's an anti-pattern:** untested resilience is hope, not engineering. Every untested assumption is a future incident.

**Symptom:** post-incident review reveals "we thought the fallback would work, but it didn't because X."

**Remedy:** schedule quarterly drills. Document expected behavior. Update designs when reality diverges.

---

## AP-10. The uniform posture

**Shape:** Every system in the org has the same Relay topology, the same SDK timeouts, the same monitoring, the same drill cadence. The internal admin tool gets the same five-nines treatment as the marketing landing page; the auth service gets the same single-instance treatment as the internal admin tool.

**Why it's an anti-pattern:** uniform controls don't match varied requirements. Critical systems are under-protected and non-critical systems are over-protected.

**Symptom:** the auth service experiences avoidable degradation; the internal admin tool consumes operational effort it doesn't merit.

**Remedy:** articulate dependency posture per system. Calibrate controls to the posture.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
