# Edge SDK Patterns

Selecting and operating LaunchDarkly's edge SDKs well. This page covers SDK choice per edge platform, context propagation to the edge, the freshness vs. latency trade-off, and mixed edge + origin patterns.

For the base edge evaluation diagram, see [Reference Diagram 04](../../assets/diagrams/04-edge-evaluation.md).

---

## Choosing the edge SDK

LaunchDarkly publishes (or integrates with) SDKs for each major edge platform:

| Platform | LaunchDarkly integration |
|---|---|
| **Cloudflare Workers** | Edge SDK with Cloudflare KV as the propagation backbone |
| **Vercel Edge Functions / Edge Config** | Edge SDK with Vercel Edge Config integration |
| **Fastly Compute@Edge** | Edge SDK with Fastly Dictionaries / Config Stores |
| **Akamai EdgeWorkers** | Edge SDK with Akamai EdgeKV |

The right SDK is the one for the platform you're on. Cross-platform abstraction layers usually trade performance or correctness for portability — usually not worth it.

For platforms not directly supported, the patterns generally are:

1. The flag dataset lives in a platform-native KV / config store.
2. A populator process (often LaunchDarkly's, sometimes built by the team) writes the dataset to the store.
3. Edge runtime reads from the store via a thin client.

If you're considering an edge platform without direct support, consult LaunchDarkly's docs to see if a community-supported or first-party integration exists.

---

## How edge evaluation actually works

The high-level flow:

1. **LaunchDarkly's control plane** holds the canonical flag dataset.
2. **A propagation mechanism** (vendor-specific) writes the dataset to the edge platform's KV / config store. The propagation is asynchronous; flag updates arrive at edge nodes seconds (typically) or longer (occasionally) after the change.
3. **At request time**, the edge runtime reads from the local KV / config store. This is sub-millisecond.
4. **The SDK evaluates** the flag using the local dataset and the request's context. This is also sub-millisecond.
5. **Events** (evaluations, custom events) flow asynchronously from the edge node back to LaunchDarkly via the events API.

The team's job is to:

- Configure the propagation mechanism (usually one-time setup).
- Pass correct context to the SDK at request time.
- Handle the case where the local dataset is missing or stale.
- Plan for propagation lag in rollouts and kill switches.

---

## Pattern 1 — Context propagation to the edge

The most common source of edge-evaluation incorrectness: the context doesn't reach the edge correctly.

### Identifying context sources

Context attributes used in flag targeting must be available at the edge. Sources of context:

- **In the request itself.** Cookies, headers, JWT claims, URL parameters. Available directly to the edge runtime.
- **Derived from request.** IP-based geolocation, user-agent parsing. The edge platform usually provides these as standard.
- **Looked up from the edge platform's KV.** User → tenant mapping cached at the edge after origin lookup.
- **From origin.** Anything else requires an origin round-trip — which defeats the edge's latency benefit.

The architectural rule: every context attribute used in edge targeting must come from one of the first three sources. If origin lookup is needed, either denormalize the attribute to the edge KV ahead of time or accept the latency cost.

### Example: user identity at the edge

```pseudocode
// Cloudflare Workers example
const userId = request.cookies.get('user_id')
const tenantId = request.cookies.get('tenant_id')

if (!userId) {
  // Unauthenticated; serve anonymous experience
  return handleAnonymous(request)
}

// Look up additional attributes from edge KV (already populated by an
// origin-side process that runs on login)
const tenantInfo = await env.TENANT_KV.get(tenantId)

const context = LDContext.builder()
  .addKind('user', userId)
  .addKind('organization', tenantId)
    .with('plan', tenantInfo.plan)
    .with('region', tenantInfo.region)
  .build()

const flagValue = await ldClient.boolVariation('feature-x', context, false)
```

The cookie reads are sub-millisecond. The edge KV lookup is also sub-millisecond. The total evaluation cost stays in microseconds.

### Anti-pattern: origin lookup for context

```pseudocode
// AVOID: defeats the edge latency benefit
const userInfo = await fetch('https://api.origin.example/user?id=' + userId)
const tenantInfo = await userInfo.tenant  // 200ms round-trip to origin

const context = buildContext(userInfo, tenantInfo)
const flagValue = await ldClient.boolVariation('feature-x', context, false)
```

The 200ms origin round-trip dominates the request budget. The edge SDK's microsecond evaluation is irrelevant against that cost.

---

## Pattern 2 — Handling propagation lag

Edge propagation is not instant. The patterns:

### Designing for known lag

For each flag rolled out at the edge, document the expected propagation behavior:

- **Cloudflare KV**: typical seconds, occasionally longer.
- **Vercel Edge Config**: typical seconds.
- **Fastly Dictionaries**: typical seconds.
- **Akamai EdgeKV**: typical seconds.

Specific guarantees vary; consult vendor docs. For LDWA purposes, treat edge propagation as "eventually consistent within seconds, occasionally longer under load or regional issues."

### Designing rollouts that tolerate lag

A guarded rollout that expects metrics within seconds of the flag flip doesn't work well at the edge — the metric measurement spans a period when some edge nodes are still serving the old value. Patterns:

- **Longer observation windows.** Each rollout step lasts long enough for propagation to complete globally before metrics are evaluated.
- **Region-aware ramp.** Roll out per region (or per edge POP) so propagation in one region completes before another starts.
- **Origin-side fallback for kill paths.** If a critical kill needs to take effect fast, pair the edge flag with an origin-side block.

### Designing kill switches that don't depend on propagation

For surfaces where "everyone stops doing X within 10 seconds" matters more than the flag's elegance:

- Origin server inspects a separate kill flag (server-side SDK) and refuses to serve the affected endpoint.
- The edge layer falls through to a generic error response when origin refuses.
- Net effect: 10-second kill via origin-side enforcement, regardless of edge propagation lag.

This is a complementary mechanism, not a replacement for the edge kill. Both layers can be used.

---

## Pattern 3 — Mixed edge + origin evaluation

Most realistic workloads use the edge for read-heavy paths and the origin for write paths, complex auth, and operations needing server-side context.

### The handoff

The edge handles:

- Routing decisions (which variation of a landing page).
- Caching decisions (which cache key to use based on flag-determined behavior).
- Lightweight transforms (response shape based on plan tier).

The origin handles:

- Write operations (purchases, settings changes, content creation).
- Auth that needs server-side validation.
- Operations needing data the edge can't access.

### Consistency between edge and origin

The edge and origin must agree on flag state. If the edge has propagated the new value but the origin's server-side SDK hasn't, a write operation might execute under different rules than the read that preceded it.

Patterns to ensure consistency:

- **Both layers use the same LaunchDarkly project / environment.** Same flag dataset.
- **Origin SDK refreshes promptly.** Server-side streaming connection picks up flag updates within milliseconds.
- **The application's contract is forward/backward compatible across the brief windows of divergence.** New behavior should be writeable by old origin code; old behavior should not break new origin code.

### Anti-pattern: edge and origin in different LaunchDarkly projects

If the edge and origin SDKs evaluate against different LaunchDarkly projects, they have different flag datasets. Targeting rules can be inconsistent; rollouts proceed at different paces; debugging is exponentially harder. Use the same project for both layers.

---

## Pattern 4 — Edge flag cache configuration

Most edge SDKs maintain a local cache of the flag dataset. Configuration choices:

- **Cache duration.** Often vendor-controlled (the KV's eventual-consistency window). Sometimes configurable in the SDK.
- **Cache miss behavior.** What does the SDK return when the local cache is missing the flag? Fallback to the SDK call's default, fall through to origin, etc. Configure deliberately.
- **Cache invalidation.** Triggered by KV updates from the propagation mechanism. The team usually doesn't operate this directly.

### Cache miss handling

```pseudocode
try:
  flag_value = await edge_ld_client.boolVariation('feature-x', context, false)
catch SDKNotInitialized:
  // Edge KV hasn't propagated; SDK can't initialize.
  // Decide: fail open (serve default) or fail to origin?
  flag_value = false
```

The team's policy on cache miss behavior depends on the surface. For latency-sensitive read paths, serve the fallback. For correctness-sensitive paths, fall back to origin.

---

## Pattern 5 — Multi-region edge consistency

Edge platforms operate globally; flag propagation reaches different POPs at different times. The team's assumptions about consistency:

- **Within a few seconds:** typical propagation across all POPs.
- **Under a regional issue:** some POPs may lag for minutes.
- **During a global propagation issue:** the entire edge layer may serve stale values until recovery.

Workloads that need strong consistency across POPs should:

- Avoid relying on cross-POP coordination of flag state.
- Use origin-side enforcement for correctness-critical decisions.
- Accept the edge as eventually-consistent and design accordingly.

---

## Pattern 6 — Event collection from edge

Events emitted from edge SDKs (flag evaluations, custom events) flow back to LaunchDarkly via the events API. Considerations:

- **Async batching.** Edge SDKs batch events and flush asynchronously. The team's event volume estimate should account for this batching pattern.
- **Loss on edge node restart.** Brief windows where events buffered locally might be lost. For most use cases, acceptable; for high-stakes metrics, build a redundant collection path.
- **Cost per event.** At very high edge traffic, event volume can dominate. Sample.

---

## Pattern 7 — Local edge development

Edge platforms each have their own local-dev pattern:

- **Cloudflare Workers**: `wrangler dev` runs locally.
- **Vercel**: `vercel dev`.
- **Fastly**: Compute@Edge local development with the Fastly CLI.
- **Akamai**: EdgeWorkers sandbox.

The LaunchDarkly SDK works the same way locally — connects to the same dev environment in LaunchDarkly, evaluates against the same flag dataset. The development experience is on par with origin-side development.

### Local-dev fallback

For local-dev when no network access is available (or when offline behavior is being tested):

```pseudocode
// Edge SDK in offline mode (or with file-data-source)
const ldClient = createEdgeClient({
  clientSideID: env.LD_CLIENT_SIDE_ID,
  offline: env.NODE_ENV === 'test',
})
```

Tests run against offline mode; CI exercises the fallback path.

---

## A minimum-viable edge LD checklist

For a workload adopting edge evaluation:

- [ ] Edge SDK is the platform-native LaunchDarkly SDK for the chosen edge platform.
- [ ] All context attributes used in targeting are available at the edge without origin round-trip.
- [ ] Cache miss behavior is configured deliberately.
- [ ] Propagation lag is documented; rollouts and kill switches account for it.
- [ ] Edge and origin use the same LaunchDarkly project / environment.
- [ ] For critical kill paths, an origin-side fallback complements the edge kill.
- [ ] Edge-emitted events are validated to be reaching LaunchDarkly.
- [ ] Local development supports running against the edge platform with LaunchDarkly integration.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Relay Proxy at Large Scale](./relay-at-large-scale.md)
