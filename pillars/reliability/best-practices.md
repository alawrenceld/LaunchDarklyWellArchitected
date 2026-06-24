# Reliability & Resilience — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. SDK selection and topology

### BP-1.1 Choose the SDK that matches the runtime
Server-side SDKs for backends (full flag dataset, streaming connection, lower-trust environment OK). Client-side / JavaScript SDKs for browsers (public credentials, restricted dataset, browser-context API). Mobile SDKs for native apps (offline-first, app-lifecycle aware). Edge SDKs for CDN runtimes.

Mixing the wrong SDK with the wrong runtime — for example, a server-side SDK initialized in a browser — is a security and reliability anti-pattern.

**Why:** the SDKs are tuned to their runtime. Mismatch is the source of strange initialization, caching, and credential problems.

### BP-1.2 Initialize the SDK once per process and share it
Server-side SDKs are designed to be long-lived singletons. Don't initialize them per request. Don't initialize them in a hot path.

**Why:** repeated initialization creates connection storms, wastes the streaming infrastructure, and increases latency. The singleton model is what the SDK is designed for.

### BP-1.3 For serverless and short-lived runtimes, use daemon mode or edge SDKs
In environments where a process lives for milliseconds — AWS Lambda, Cloud Functions, edge runtimes — a streaming SDK can't establish its connection in time. Use [daemon mode](https://launchdarkly.com/docs/sdk/relay-proxy/use-cases) (read from a shared store populated by Relay) or an [edge SDK](https://launchdarkly.com/docs/sdk) designed for the runtime.

**Why:** matching the SDK pattern to the runtime is the only way to get correct, fast evaluations in serverless.

---

## 2. Initialization, bootstrap, and offline behavior

### BP-2.1 Set an explicit, bounded SDK initialization timeout
Configure the SDK with a sensible init timeout. If the connection isn't ready in N seconds, the application should proceed with fallback values — not block on initialization indefinitely.

**Why:** unbounded init blocks application startup. A flag system that prevents your app from booting is a flag system that has failed at its core promise.

### BP-2.2 Bootstrap client-side SDKs with server-rendered initial values
For browsers and mobile, render the initial set of flag evaluations server-side and pass them to the client SDK at initialization. The client never waits for the first network roundtrip.

**Why:** bootstrapping eliminates the "first paint shows old behavior" flash and makes the client tolerant of initial-load delays.

### BP-2.3 Use offline mode in tests, restricted environments, and chaos drills
[Offline mode](https://launchdarkly.com/docs/sdk) instructs the SDK to never call LaunchDarkly and always return the fallback. Use it in unit tests, in air-gapped environments, and as a drill mode in production.

**Why:** offline mode is your fast-feedback test of "does the application work without LaunchDarkly?" If the answer is no, you have an architecture bug.

### BP-2.4 Verify the SDK's local caching behavior is on, configured, and persistent where appropriate
Most SDKs cache the most recent flag dataset locally so that a brief LD outage doesn't immediately fall through to fallbacks. Verify caching is enabled and, for mobile/edge, that the cache persists across restarts.

**Why:** the SDK cache is the first line of defense. Many "outages" never reach the application because the cached values are still valid.

---

## 3. Default values and fallback paths

### BP-3.1 Treat the fallback value passed to the SDK call as a deliberate decision
Every `client.boolVariation("flag-key", context, fallback)` chooses what the application does when LaunchDarkly is unreachable. Pick the value with intent.

**Why:** the fallback is the panic-button resting position. Set it to safety.

### BP-3.2 Exercise the fallback path in tests
Unit tests run with the SDK in offline mode. Integration tests include scenarios where the SDK is unreachable. The fallback code path has the same test coverage as the happy path.

**Why:** untested code paths break. The fallback path runs at exactly the moments when "break" is unacceptable.

### BP-3.3 The application should serve a coherent experience under fallback
"Coherent" means: no errors propagate to the user, no incomplete states, no security degradation. The user might see a slightly older feature set; they should not see a broken one.

**Why:** the value of the fallback is the user experience under fallback. Hand-waving "it'll be fine" is not a design.

### BP-3.4 Use the off variation to mean something useful
The off variation isn't just "false." It's the explicitly-defined state served when the flag is toggled off. Make it a value that means *the safe, conservative, sensible default* for the feature.

**Why:** the off variation is part of the panic toolkit. Set it to a value you'd want during a panic.

---

## 4. Relay Proxy deployment and resilience

### BP-4.1 Deploy Relay Proxy when it solves a real problem
The Relay Proxy adds operational surface. Adopt it when you have a real requirement: restricted egress, daemon-mode serverless, a need to centralize and cache flag traffic from many SDK instances, or an SLO that benefits from in-region evaluation. Don't adopt it because it sounds safer.

**Why:** infrastructure you don't need is infrastructure that fails in ways you didn't plan for.

### BP-4.2 Run Relay at LaunchDarkly's recommended floor or above
At least three instances across at least two availability zones per region, fronted by a load balancer ([Relay Proxy guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines)). Treat this as a floor, not a target.

**Why:** under-sizing Relay creates mysterious connection failures during exactly the moments when you need it most.

### BP-4.3 Monitor Relay like a production service
SDK connection count, request rate, error rate, memory, CPU, latency to LaunchDarkly. Alert on saturation and latency, not just on hard failures.

**Why:** Relay degrades before it fails. Catching degradation in monitoring is what prevents the failure.

### BP-4.4 Have a defined plan for Relay outages
What happens if all Relay instances are unreachable? The SDKs should fail back to a defined behavior — direct LaunchDarkly connection, local cache, fallback values. Document and test the path.

**Why:** unplanned-for Relay outages take down the SDK fleet. Planned-for ones don't.

### BP-4.5 Use daemon mode where streaming connections aren't viable
For workloads that can't hold streaming connections (serverless functions, very short-lived processes), use [daemon mode](https://launchdarkly.com/docs/sdk/relay-proxy/use-cases): Relay writes flag data to a persistent store (Redis, DynamoDB), and SDKs read from that store.

**Why:** daemon mode is the right pattern for ephemeral workloads. Trying to make streaming work in serverless is the wrong pattern.

---

## 5. Edge delivery and low-latency evaluation

### BP-5.1 Use edge SDKs where latency matters and freshness can be eventually consistent
Cloudflare Workers, Vercel Edge, Fastly Compute, and Akamai SDKs evaluate flags at the edge with sub-millisecond local-latency. The flag data syncs from LaunchDarkly; there's a propagation lag (typically seconds, occasionally longer under degradation).

**Why:** edge evaluation removes the network call from the critical path. The tradeoff is freshness; understand it before adopting.

### BP-5.2 Confirm contexts propagate to the edge
The context the edge SDK evaluates against must be available at the edge. Verify that user identity, organization, region, and any other targeting attribute is available where the evaluation happens.

**Why:** edge evaluation against missing or stale context returns the wrong variation. The evaluation is fast and wrong.

### BP-5.3 Treat edge propagation lag as a known property
Document the expected lag for flag changes to reach the edge. Design rollouts that tolerate it (i.e., don't expect a kill switch to take effect in 100ms at every edge node).

**Why:** the speed of light is real. Plans that ignore it produce confusing incidents.

---

## 6. Multi-region and failover

### BP-6.1 Decide whether each region has its own Relay Proxy fleet
For multi-region deployments, deploying Relay regionally reduces cross-region traffic and improves tail latency. It also raises the operational surface. Choose deliberately.

**Why:** centralized Relay is simpler operationally but worse for latency and regional isolation; regional Relay is the opposite. Pick the right one.

### BP-6.2 Test the cross-region failover path
If your application can run from a secondary region during an incident, confirm that LaunchDarkly evaluation works from that region — Relay topology, network routing, credential availability.

**Why:** the secondary region is the failover path. A failover path that doesn't work is a single point of failure.

### BP-6.3 For regulated data, keep regional flag evaluation regional
If a region's data must not leave the region, ensure flag evaluation involving that data happens within the region. Use regional Relay; understand which context attributes leave the boundary.

**Why:** residency obligations don't yield to architectural convenience.

---

## 7. AI Config and LLM provider resilience

### BP-7.1 Every AI Config call has a fallback variation
[AI Configs](https://launchdarkly.com/docs/home/ai-configs) support multiple variations. One of them is the fallback: a simpler model, a deterministic response, a cached answer, or a "we couldn't process that" graceful message. Define it; test it.

**Why:** LLM providers fail more often than core infrastructure. Without a fallback, every provider hiccup is a feature outage.

### BP-7.2 Configure provider-side timeouts aggressively
Long LLM latencies starve other parts of the application. Set provider timeouts that match the user-experience budget — usually shorter than the provider's own default. Fall back when the timeout fires.

**Why:** waiting forever for a model is worse than serving a fallback. Users don't notice the fallback as quickly as they notice the wait.

### BP-7.3 Plan for multi-provider where the risk justifies it
For business-critical AI features, configure variations that route to multiple providers (OpenAI + Anthropic, Anthropic + Gemini, etc.). Promote across providers with the same progressive-exposure discipline as any rollout.

**Why:** provider-specific outages are real and recurrent. A multi-provider posture is the only path to provider-outage resilience.

### BP-7.4 Cache where the use case allows
For deterministic-ish AI calls (translations, summaries of static content, classification of stable inputs), cache aggressively. The cache is a free reliability layer.

**Why:** the LLM you don't call is the LLM that can't fail.

---

## 8. Event ingestion resilience

### BP-8.1 Know your SDK's event buffering behavior
SDKs buffer events locally and flush to LaunchDarkly on a cadence. Know the buffer size, the flush interval, and what happens when the buffer is full (default: drop oldest, but verify per-SDK).

**Why:** during incidents, ingestion may slow. The SDK's buffering behavior is what determines whether events are preserved or lost.

### BP-8.2 Expect minor event loss during severe degradation; design experiments accordingly
Under heavy degradation, some events are lost. Critical experiments should account for this — by running long enough, with large enough samples, that small percentages of event loss don't change the decision.

**Why:** statistical robustness covers small data losses. Tightly-powered experiments don't.

### BP-8.3 Monitor event flow as a production pipeline
Track event submission rate from your application side; compare to expected rate; alert on divergence.

**Why:** silent event loss is invisible in the UI. The check has to be application-side.

---

## 9. Chaos and failure-mode drills

### BP-9.1 Run an "LaunchDarkly unavailable" drill at least quarterly
Plan it. Pick a window. Put the SDK in offline mode (or block egress to LaunchDarkly at the network layer in a controlled environment). Observe what happens. Confirm the fallback behavior matches expectation.

**Why:** drills are how you confirm the resilience hypothesis. Without them, you don't know.

### BP-9.2 Drill Relay Proxy degradation
Plan it. Reduce Relay capacity by half (or remove an instance). Observe what happens. Confirm load balancing, retries, and circuit breakers behave as designed.

**Why:** Relay is operational infrastructure. The behavior under degraded Relay should be a known, drilled property.

### BP-9.3 Drill AI provider failure
Block the LLM provider's API or inject error responses in a controlled environment. Confirm fallback variations engage. Confirm the user experience is acceptable.

**Why:** LLM provider failures are the most likely production-impacting failure mode for AI features.

### BP-9.4 Document the expected behavior under each drill
For each drill, write down the expected behavior *before* the drill. Compare with actual behavior. Update the runbook based on the gap.

**Why:** an undocumented drill is impossible to disagree with. Documentation forces specificity.

---

## 10. Dependency posture per system

### BP-10.1 Articulate the dependency posture for each LD-managed system
For each system, write down the dependency posture: "this system can serve fallback values indefinitely" vs. "this system requires fresh evaluation within X seconds" vs. "this system cannot tolerate LD being unavailable for more than Y minutes."

**Why:** the posture is what determines the right Relay topology, the right caching, the right drill cadence. Different postures need different controls.

### BP-10.2 Match controls to the posture
A loose-dependency system needs less Relay redundancy than a tight-dependency one. A fresh-evaluation system needs more aggressive monitoring than a fallback-tolerant one. Resources should match requirements.

**Why:** spending the same on every system over-protects the loose ones and under-protects the tight ones.

### BP-10.3 Review dependency postures annually
The posture that was right at adoption may not be right today. Annual review keeps the controls calibrated to the current product reality.

**Why:** systems migrate over time. Reviews are how you catch the migration.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
