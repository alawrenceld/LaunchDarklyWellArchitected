# Mobile — Anti-Patterns

A catalogue of common, named failure modes specific to native mobile workloads.

---

## AP-1. The first-paint flash

**Shape:** The app launches. The user sees the first screen rendered with the old / default behavior. A moment later, the SDK fetches flag values and the screen re-renders with the new behavior. The flash is visible, ugly, and signals to the user that something is loading or broken.

**Why it's an anti-pattern:** the user's first impression is uncertainty. For polished mobile UX, the first paint must be correct.

**Symptom:** users report seeing a brief "old version" before the "new version" appears on every cold start.

**Remedy:** bootstrap the SDK from persistent cache (or from server-rendered values, for hybrid apps). The first paint uses cached values; fresh values arrive in the background.

---

## AP-2. The cache that doesn't persist

**Shape:** The SDK is configured with persistent caching "enabled," but in fact every cold start makes a fresh network request. The team didn't notice because, in development, the network is fast and the bug is invisible.

**Why it's an anti-pattern:** persistent caching is the offline-resilience foundation. Without it, every cold start fails in airplane mode.

**Symptom:** the app shows the "default" experience whenever launched without a network, even after dozens of prior sessions.

**Remedy:** verify the cache is configured to persist to disk and verified to survive restarts. Add an airplane-mode-launch test to every release.

---

## AP-3. The flag that shipped to versions that didn't have the code

**Shape:** A new feature flag is created. The targeting rule serves `true` to "all users in the US." The flag is turned on. Users in the US on v4.5 (which doesn't contain the new feature's code) start crashing or seeing broken UI because their app is being told to render something it can't.

**Why it's an anti-pattern:** targeting must account for the binary distribution. A flag served to users without supporting code is undefined behavior.

**Symptom:** spike in crashes or support tickets immediately after a flag flip, concentrated in users on older app versions.

**Remedy:** every flag targets on `device.app_version >= X` where X is the version that introduced the code. Use `>=`, not `=`.

---

## AP-4. The forever-supported old version

**Shape:** The team has supported all app versions back to v1.0, three years ago. Production has hundreds of flags whose targeting rules include workarounds for ancient OS versions, broken device classes, and bugs that have long since been fixed. Newcomers can't understand the targeting graph.

**Why it's an anti-pattern:** infinite version support creates an exponential governance burden. Most users updated years ago; supporting their old binaries indefinitely costs more than it earns.

**Symptom:** flag targeting includes branches for app versions that almost no one runs.

**Remedy:** define a minimum supported app version. Update it quarterly. Archive flags whose entire purpose was supporting versions below the new minimum.

---

## AP-5. The store rollout mistaken for a behavior rollout

**Shape:** Google Play is rolling out the new binary at 5% staged release. The team's release tracker says "feature X is at 5%." In fact, all of those 5% are still seeing the *old* feature because the flag is `off` — and any of the 95% on the prior binary will also see the *old* feature. "Feature X" is at 0%.

**Why it's an anti-pattern:** the team has conflated binary distribution with behavior release. They have no actual signal on feature uptake.

**Symptom:** the team can't articulate the difference between "users with the new binary" and "users seeing the new feature."

**Remedy:** training and documentation. Store-level staging is for *binary safety*; flag rollout is for *behavior release*. Both apply; neither substitutes.

---

## AP-6. The flag flip that preceded the binary

**Shape:** The team is excited about a new feature. The binary is in app-store review. The team turns the flag `true` in production "to get a head start." Users on the old binary, where the feature doesn't exist, get flagged into the new behavior. Crashes, broken UI, or silent fallback to old behavior depending on how the app handles the inconsistency.

**Why it's an anti-pattern:** premature flag flips bypass version targeting and break the binary-distribution invariant.

**Symptom:** crashes spike before the new binary is broadly distributed.

**Remedy:** flag flips happen after the supporting binary is broadly distributed. Version-aware targeting protects against accidents; discipline prevents intentional ones.

---

## AP-7. The fallback that's wrong on old versions

**Shape:** The flag's off variation is `true` because the team designed the off variation around the new code's expectations. Users on the old binary, who haven't updated, hit the off variation in the SDK because their binary returns the fallback — and the fallback happens to make the old binary crash.

**Why it's an anti-pattern:** the off variation has to be safe on *every* version still supported, not just the newest. Designing only for the newest version breaks compatibility.

**Symptom:** correlation between flag changes and crashes on old app versions.

**Remedy:** the off variation and the SDK fallback represent the *version-safe* behavior. Test every supported version with the fallback path.

---

## AP-8. The runaway event volume

**Shape:** The team adds event tracking to every screen, every tap, every flag evaluation. The mobile fleet is two million daily active users. LaunchDarkly's monthly bill triples; the team's analytics warehouse charges go up by an order of magnitude; users start complaining about battery drain.

**Why it's an anti-pattern:** mobile event volume scales by user count × session events × event size. Without controls, it's a finance and reliability problem at the same time.

**Symptom:** cost spike, battery complaints, or analytics-pipeline saturation traceable to mobile event emission.

**Remedy:** event sampling, client-side aggregation, deliberate buffering and flush behavior. Forecast event volume before shipping changes that emit a lot of events.

---

## AP-9. The experiment that compared apples to oranges across versions

**Shape:** The team runs an experiment on mobile. Users in the experiment include those on v4.5, v4.6, and v4.7. The "control" group includes more v4.5 users by chance; the "treatment" group has more v4.7 users. The treatment "wins" — but the win is really because v4.7 has better baseline performance, not because of the experimental change.

**Why it's an anti-pattern:** experiments require comparable baselines. Random assignment across versions doesn't ensure comparable baselines because version distribution is non-random.

**Symptom:** experiment results that don't replicate after the binary rollout completes.

**Remedy:** scope mobile experiments to a single app version when possible. When that's not possible, stratify by version and analyze separately.

---

## AP-10. The kill switch that didn't reach offline users

**Shape:** A serious bug ships in v4.7. The team flips the kill switch. Most users get the new behavior within minutes — but users who are currently offline (in airplane mode, on a plane, in transit) don't see the kill switch until they reconnect, which might be hours.

**Why it's an anti-pattern:** mobile kill switches have propagation lag. For paths where the lag is unacceptable, the kill switch alone isn't enough.

**Symptom:** a flag flip didn't reduce incident severity as fast as the team expected because offline users continued to exhibit the bad behavior.

**Remedy:** for critical-blast paths, pair the mobile kill switch with a server-side enforcement (the server refuses to serve the relevant endpoint, so the broken client code can't act on its cached flag value). The mobile kill switch handles 95% of users; the server-side block handles the rest.

---

## AP-11. The auto-update that lost the cache

**Shape:** A user updates the app from v4.5 to v4.6. The cache from v4.5 is wiped during the update — either because the new version uses a different cache key, the SDK upgrade reformats the storage, or the upgrade pipeline clears the app's data. The user's first launch of v4.6 is effectively a cold install: factory defaults, then a network fetch, then potentially a flash.

**Why it's an anti-pattern:** the cache should survive routine app updates. Users shouldn't lose their flag state for choosing to update.

**Symptom:** a spike of first-paint flashes correlating with app-update rollouts.

**Remedy:** verify cache compatibility across versions. Use the SDK's standard persistent cache, not a custom one. Test the v(N) → v(N+1) transition for every release.

---

## AP-12. The platform-specific bug nobody saw

**Shape:** A flag flip works correctly on iOS but causes a crash on Android (or vice versa). The team's testing focused on one platform; the bug exists on the other. Production users on the affected platform start crashing.

**Why it's an anti-pattern:** mobile features ship to both platforms, but bugs are platform-specific. Single-platform testing doesn't cover the failure surface.

**Symptom:** post-rollout crash report is concentrated on one platform.

**Remedy:** test every flag flip on every supported platform. Tag flags with the platforms they affect. For platform-specific bugs that need a hotfix, use platform-specific kill switches.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
