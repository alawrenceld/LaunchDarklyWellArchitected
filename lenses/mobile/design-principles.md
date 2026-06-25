# Mobile — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for native mobile workloads.

---

## M-1. Default to safe on cold start

When the application launches, the SDK may have no network, no cached data, and no time. The application's first-paint behavior must be correct regardless. Either:

- The SDK is bootstrapped with values rendered into the app shell (the recommended path), or
- The fallback values passed to each SDK call represent a working app.

The first thing a user sees is the binary's default behavior. Make it the behavior you'd be comfortable shipping to 100% of users forever.

## M-2. Treat offline as a normal state, not an exception

Users open the app in planes, tunnels, transit, rural networks, and during carrier outages. A mobile app that breaks when LaunchDarkly is unreachable is a mobile app that breaks frequently. The SDK's local cache and offline mode are the runtime guarantee that the app keeps working.

Test offline behavior in every release. Drill it in production by occasionally putting the SDK in offline mode.

## M-3. Plan for version skew indefinitely

The newest version of the app is in the hands of a small percentage of users for weeks. Old versions persist for months — sometimes years — even after the team has moved on. Every flag decision is also a decision about *which versions of the app the flag should affect.*

Target on app version. Never assume the fleet has updated. Build code paths that handle the case where a feature was removed in v5.0 but the user is still on v4.6.

## M-4. Decouple feature release from app release

The app-store review cycle is days; user adoption of new versions is weeks-to-months; some users never update. Building features into a specific binary version means living with the slowest customer's update behavior.

Build the feature into a recent binary version, ship it gated by a flag at `off`, and release it via flag flip independently. This is the entire reason LaunchDarkly exists on mobile.

## M-5. Bootstrap to eliminate the first-paint flash

If the app makes a network round-trip to fetch flag values before rendering the first screen, the user briefly sees the "off" state, then a flicker, then the "on" state. Bootstrap fixes this: the initial values are baked into the launch payload (or rendered server-side for hybrid apps), and the SDK starts with them in memory.

Without bootstrap, first-paint correctness depends on network luck.

## M-6. The persistent cache survives app restarts

A cold start from cache is faster than a cold start from the network and works offline. The SDK's persistent cache must be enabled, configured to persist across launches, and verified during testing. A cache that gets wiped on every cold start provides no value.

The cache should also survive app updates — the user on v4.5 updating to v4.6 shouldn't lose flag state on the way.

## M-7. Mobile credentials are not secrets — but they are scoped

The mobile key embedded in the app binary is reverse-engineerable; treat it as public. That's fine — it grants access only to the mobile flag dataset, not to your server-side flags. But it's still a scoped credential: rotate it when needed, and don't reuse it across environments.

## M-8. Sample events deliberately

Every flag evaluation, custom event, and metric emission costs cellular data, battery, and (potentially) MAU. At mobile scale, naive event volume becomes a meaningful cost. Sample events to a rate that supports your metrics without burning the budget.

For event-heavy products, consider client-side aggregation before sending.

## M-9. Target on stable attributes

App version, OS major version, country, plan tier, customer ID — these are stable, meaningful, and survive across sessions. Device model strings, user-agent fragments, OS minor version, network type — these shift in ways that break targeting rules silently.

A rule that targets "iPhone 15 Pro" fails the moment Apple releases a new model with the same family designation.

## M-10. Test the rollback path

A mobile rollback is the team's *last* line of defense — not the first. If a flag flip rolls back behavior to the previous state, the team's confidence depends on knowing the previous-state code path still works in the current binary.

This means: every feature that's flagged on is also tested with the flag off, on every active app version. The fallback isn't a hypothesis; it's tested code.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
