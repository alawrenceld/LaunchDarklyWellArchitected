# SDK & Offline Patterns

Practical patterns for using LaunchDarkly mobile SDKs well. This page covers the technical practices that make mobile apps resilient to intermittent networks, fast on cold start, and correct under offline conditions.

For the canonical SDK reference, see [LaunchDarkly's mobile SDK documentation](https://launchdarkly.com/docs/sdk). The patterns below are the LDWA opinions on how to use them in production.

---

## SDK selection

LaunchDarkly publishes mobile SDKs for the major platforms:

- **iOS** — Swift / Objective-C.
- **Android** — Kotlin / Java.
- **Cross-platform frameworks** — React Native, Flutter, Xamarin, Cordova, and others.

For cross-platform apps, you have two architectural options:

1. **Use the framework's native SDK** (React Native LD SDK, Flutter LD SDK). The framework abstracts platform differences; the SDK gives you a unified API.
2. **Use the platform-native SDKs via bridge code.** Direct access to iOS / Android primitives; more code; better for apps with deep native integration on each platform.

The right choice depends on how much of the app is in the framework layer vs. in native code. Most cross-platform apps should use the framework SDK; teams with substantial native code per platform may benefit from the platform-native SDKs.

---

## Pattern 1 — Bootstrap on cold start

**The problem.** A mobile app launches. The user sees the first screen within milliseconds. The SDK takes 200-2000ms to fetch flag values from LaunchDarkly. During that window, the SDK returns fallback values; once it fetches, it returns "real" values. The user sees a flash: old behavior, brief pause, new behavior. It's ugly and signals to the user that something is loading.

**The pattern.** Initialize the SDK with a **bootstrap object** — a pre-evaluated set of flag values that the SDK uses immediately, with no network round-trip.

Three sources for bootstrap data:

1. **Server-rendered** (best, for hybrid apps). When the user authenticates, the server uses its server-side SDK to evaluate all relevant flags for the user's context. The evaluated values are returned with the auth response and passed to the client SDK at initialization.

2. **Cached from previous session** (best for pure mobile). The SDK's persistent cache stores the most recent flag values. On cold start, the SDK reads from cache and returns those values until a fresh fetch completes.

3. **Bundled in the app binary**. A fallback set of "factory default" flag values shipped in the app. Lower fidelity (the values are stale by definition), but guarantees a known starting state.

**Pseudocode (iOS / Swift):**

```swift
// Read bootstrap values from cache or auth response
let bootstrapValues = readCachedFlagValues() ?? loadDefaultFlagValues()

let config = LDConfig(
    mobileKey: mobileKey,
    autoEnvAttributes: .enabled,
    persistDataAsPrimaryStore: true  // persistent cache enabled
)

LDClient.start(config: config, context: context) { _ in
    // SDK has finished initialization
}

// Application can read flags immediately, before the start callback fires
let showNewFlow = LDClient.get()?.boolVariation(forKey: "show-new-flow", defaultValue: false) ?? false
```

The exact field names vary by SDK; consult [the LaunchDarkly mobile SDK docs](https://launchdarkly.com/docs/sdk) for your platform.

---

## Pattern 2 — Persistent cache across launches

**The principle.** A cache that gets wiped on every cold start provides no value. The SDK's persistent cache must survive app restarts, system reboots, and app updates.

**The configuration.** All major LaunchDarkly mobile SDKs support a persistent-cache mode. Verify in your SDK's documentation that:

- Persistent caching is **enabled** in your initialization config.
- The cache is written to **persistent storage** (UserDefaults / SharedPreferences / equivalent), not just in-memory.
- The cache survives the **app-update process** — meaning the new version of the app reads the previous version's cache and uses those values until a fresh fetch.

**Drilling the cache.** Periodically run a launch scenario in airplane mode (or with network blocked at the OS level) and verify that the app starts correctly with cached values. This is a five-minute test that catches the most common cache-related bugs.

---

## Pattern 3 — Offline mode and graceful degradation

**The principle.** The SDK's offline mode lets the application explicitly run without any LaunchDarkly network calls. The SDK returns the fallback values supplied to each call.

**Use offline mode in:**

- **Unit tests.** Fast, deterministic, network-free.
- **Integration tests** that need to exercise the fallback path.
- **Air-gapped or restricted-egress builds** of the app for specific deployment contexts.
- **Production drills** — occasionally force the SDK into offline mode for a controlled period to validate the fallback experience.

**Code path:** every flag-gated decision in the app must run correctly when offline mode returns the fallback. This means the fallback path is tested as thoroughly as the happy path.

**Drilling offline mode:** see [Lab 02 — Build a Kill Switch You Can Trust](../../labs/02-build-a-kill-switch-you-can-trust.md) and [Reliability BP-9.1](../../pillars/reliability/best-practices.md).

---

## Pattern 4 — Background-mode and lifecycle handling

**The challenge.** Mobile apps don't run continuously. They go to background, get suspended, get killed by the OS, and resume sometimes hours or days later. Each transition is an opportunity for the SDK to drop a connection, miss flag updates, or get into an inconsistent state.

**The behavior.** Modern LaunchDarkly mobile SDKs handle this automatically:

- **Foreground:** SDK maintains a streaming connection (or polls on a regular interval) for flag updates.
- **Background:** SDK reduces or pauses updates to conserve battery and respect OS background policies.
- **Re-foreground:** SDK reconnects, fetches any missed flag updates, and applies them.

**The team's job:** verify the behavior in test scenarios that match real user patterns:

- App launched, used, backgrounded for 30 minutes, reopened.
- App launched, used, killed by OS (low memory pressure), relaunched.
- App launched, used, device locked overnight, reopened next morning.
- App backgrounded during a flag flip; foregrounded; does the new value appear?

Common bugs:

- **Stale values after background.** SDK didn't reconnect on foreground. Often a config issue.
- **Cache mismatch.** SDK uses cached values from before the background; doesn't refresh fast enough.
- **Battery drain.** SDK polls too frequently in background. Configure backoff appropriately.

---

## Pattern 5 — Persistent cache across app updates

**The challenge.** A user on v4.5 of the app updates to v4.6. The persistent cache from v4.5 may or may not survive — depending on how the cache is keyed, where it's stored, and what the SDK upgrade does to it.

**The principle.** A user upgrading the app should not lose their flag state. They especially should not see the "factory default" experience after upgrading. This breaks targeting (e.g., "this user has seen the welcome flow") and confuses targeted users.

**The configuration:**

- Use the SDK's standard persistent-cache mechanism. Don't roll your own.
- Verify that the cache key is stable across app versions (the same user / context produces the same cache key in v4.5 and v4.6).
- After an app update, the SDK reads the existing cache, returns those values immediately, and fetches fresh values from LaunchDarkly in the background. The user never sees factory defaults.

**Test it.** Build a manual test scenario: install v4.5, use the app, install v4.6 over the top, verify the cache survived.

---

## Pattern 6 — Multi-context targeting on mobile

Mobile apps often need multi-context targeting: a user is logged in (`user` context), using a specific app version on a specific device (`device` context), and belongs to an organization (`organization` context). LaunchDarkly's multi-context evaluation supports this natively.

**Pseudocode (cross-platform):**

```pseudocode
context = LDContext.builder()
    .addKind("user", currentUser.id)
        .with("plan", currentUser.plan)
    .addKind("device", device.uniqueId)
        .with("os", device.osName)            // "ios" or "android"
        .with("os_version", device.osMajor)   // "17", "14", etc.
        .with("app_version", appVersion)      // "4.6.2"
        .with("device_class", device.modelClass)  // "phone", "tablet"
    .addKind("organization", currentUser.orgId)
        .with("tier", currentOrg.tier)
    .build()
```

**Why this matters:**

- Targeting on `device.app_version` enables [version-aware rollouts](./app-store-cadence-and-release.md).
- Targeting on `device.os` lets you ship platform-specific behavior cleanly.
- Targeting on `organization.tier` works for SaaS apps where the customer's plan is on the organization, not the user.

**The discipline:** include only attributes you actually use for targeting. Every attribute is a privacy and cost consideration.

---

## Pattern 7 — Event sampling and batching

**The principle.** Mobile clients emit events on cellular networks; battery and data both matter. Configure the SDK's event behavior deliberately.

**Configuration knobs (vary by SDK):**

- **Flush interval.** How often the SDK sends buffered events. Longer = fewer round-trips but more event loss on app kill. Default values are usually reasonable.
- **Buffer size.** How many events the SDK holds before forced flush. Sized for your average session.
- **Behavior on background.** Most mobile SDKs flush on background to prevent event loss when the app is killed.

**Sampling:** for very high-volume events, consider client-side sampling — emit one event in N rather than every event. The metric layer in LaunchDarkly should account for the sampling rate.

**Aggregation:** for events that can be summed client-side (e.g., "user performed action X — count it"), aggregate locally and emit one summary event per session rather than per action.

---

## Pattern 8 — Testing mobile flag behavior

**Unit tests.** Use the SDK in offline mode with a known set of fallback values. Each test validates one flag-gated code path.

**UI snapshot tests.** Snapshot the screen with each variation of a flag. Catches visual regressions.

**Integration tests.** Run against a test LaunchDarkly environment with a known flag dataset. Validates the full SDK → flag-evaluation → UI render path.

**End-to-end tests.** Use a real LaunchDarkly environment with a stable test context. Validates the full system, including network behavior.

**Manual scenarios** (every release):

- App launched in airplane mode (cache-only).
- App launched, network lost mid-session.
- Flag flipped server-side while app is foreground.
- Flag flipped server-side while app is background; verified on foreground.
- App updated from previous version; verified flag state survived.

---

## Anti-patterns to avoid

See [Mobile Anti-Patterns](./anti-patterns.md) for the full catalogue. The three most common SDK / offline mistakes:

- **No bootstrap; first-paint flash is the user's first impression.**
- **Persistent cache disabled or misconfigured; every cold start is from network.**
- **Fallback values chosen carelessly; "false" everywhere even when "true" is safer.**

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [App-Store Cadence & Release](./app-store-cadence-and-release.md)
