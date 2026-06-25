# Mobile — Pillar Overlays

How each pillar specializes for native mobile workloads. Read the relevant pillar first; this page describes the *additional* expectations and shifted thresholds that apply on mobile.

---

## Safe Release & Progressive Delivery

**Mobile overlay:**
- A progressive rollout on mobile is not progressive over *time alone* — it's also progressive across **app versions**. Every rollout decision considers both *what percent of users* and *which app versions* should see the new variation.
- Phased / staged rollouts at the **app-store level** (Google Play staged rollouts, App Store phased releases) and LaunchDarkly's rollouts are **two different layers**. Both apply. The store controls who has the binary; LaunchDarkly controls which behavior they see inside it.
- Kill switches on mobile have a propagation lag: the SDK fetches the flag value when it can, and an offline user won't see the flip until they reconnect. Critical kill paths need an alternate origin-side block (e.g., feature disablement enforced server-side) for paths that don't tolerate the lag.
- Rollouts use targeting on `app_version` ≥ X to ensure new behavior only reaches versions that include the corresponding code. Skipping this is a common bug source.

**Specific best-practice references:**
- [Safe Release BP-1.2](../../pillars/safe-release/best-practices.md) (target on stable attributes — app version qualifies)
- [Safe Release BP-2.2](../../pillars/safe-release/best-practices.md) (match rollout shape to blast radius)
- [Safe Release BP-6.1](../../pillars/safe-release/best-practices.md) (identify kill switches per product surface — include mobile-specific surfaces)

---

## Operational Excellence

**Mobile overlay:**
- The "flags in motion" dashboard ([OE BP-3.3](../../pillars/operational-excellence/best-practices.md)) includes per-app-version views — different versions may be in different rollout states.
- Crash reporting, ANR (Application Not Responding) telemetry, and session quality metrics flow into the team's release feedback loop. A flag change that increases ANRs is a regression even if no errors are logged.
- The on-call runbook includes the mobile-specific incident playbook: how to disable a mobile feature via flag (with awareness of propagation lag), how to force a binary patch through expedited app review if the flag system can't reach affected users, how to coordinate with the mobile release team.
- Capacity considerations: mobile clients emit events; large user bases on cellular networks produce material event volume that affects both LaunchDarkly costs and the team's analytics pipeline.

---

## Security & Compliance

**Mobile overlay:**
- The **mobile key** embedded in the app is a *public credential* — reverse-engineerable from the binary. Its scope is the mobile flag dataset only; it cannot read server-side flags or write anything. Don't over-protect it; do scope it.
- Sensitive flag evaluations that gate security-relevant behavior (entitlements, feature paywalls, regulatory features) should *not* depend solely on a client-side flag evaluation. The server validates entitlements regardless of what the client decides to render.
- Context attributes passed from mobile have the same minimization discipline as elsewhere. Device identifiers are often more sensitive than they appear; only include what's needed.
- Per-app-region considerations: a user in the EU launching the app must be honored by EU residency posture if the workload claims it. Mobile clients should connect to the EU LaunchDarkly endpoint, not the US one, when that's the residency requirement.

**Specific best-practice references:**
- [Security & Compliance BP-2.4](../../pillars/security-and-compliance/best-practices.md) (know which credentials are secrets and which are public)
- [Security & Compliance BP-6.1](../../pillars/security-and-compliance/best-practices.md) (minimize context attributes)

---

## Reliability & Resilience

**Mobile overlay** — this is the primary pillar for mobile work.
- The SDK's offline mode and persistent cache are first-class reliability features, not edge cases. They are tested in every release.
- Bootstrap is the recommended default for any mobile app that renders content on first paint dependent on flag values.
- The SDK's reconnect behavior — exponential backoff, connection sharing, request batching — matters more on mobile because connectivity is intermittent.
- Cold start performance is part of reliability: the SDK must not block the first-paint render. If it can, initialization timing is broken.
- Cross-region failover (Reliability BP-6.2) is less relevant on mobile than server-side; mobile clients connect to whichever LaunchDarkly endpoint is closest, and a regional outage typically still leaves the client functional from cache.

**Specific best-practice references:**
- [Reliability BP-2.2](../../pillars/reliability/best-practices.md) (bootstrap client-side SDKs)
- [Reliability BP-2.3](../../pillars/reliability/best-practices.md) (use offline mode in tests and drills)
- [Reliability BP-2.4](../../pillars/reliability/best-practices.md) (verify persistent caching is on)
- [Reliability BP-3.x](../../pillars/reliability/best-practices.md) (defaults and fallbacks — same discipline, mobile context)

---

## Governance & Artifact Lifecycle

**Mobile overlay:**
- Mobile-only flags accumulate quickly. Tag them: `platform:mobile`, `platform:ios`, `platform:android`, `platform:cross-platform`.
- **Version-bound flags** — flags that exist to handle a specific app version's quirks — should carry the version in their description and a retirement plan tied to when that version drops below your support window.
- The persistent cache means that flags removed from the LaunchDarkly account may still affect clients running on cached data for some time. Document the cache TTL and plan archival around it.
- Code References for mobile codebases (Swift, Kotlin, React Native, Flutter) ensures the archival workflow has correct signal.

**Specific best-practice references:**
- [Governance BP-2.2](../../pillars/governance/best-practices.md) (tag artifacts with team, system, and purpose — add platform)
- [Governance BP-6.1](../../pillars/governance/best-practices.md) (deploy Code References on every relevant repo, including mobile)

---

## Experimentation & Measurement

**Mobile overlay:**
- Experiments on mobile must account for **version skew** — different users see different baselines because they're on different app versions. The simplest way to manage this is to scope the experiment to a specific app-version range.
- **App-store cadence** complicates short-window experiments: a meaningful experiment might require waiting for adoption of a new app version that includes the experimental code.
- The metric layer for mobile experiments often includes mobile-specific signals: crash rate, ANR rate, app launch time, cold-start time, frame rate, battery use. Generic conversion metrics still apply, but add the mobile ones.
- **Statistical power** matters more on mobile: noisy mobile metrics (session length, engagement on a small device class) often require larger samples than equivalent server-side experiments.

---

## Performance & Cost Efficiency

**Mobile overlay** — high-priority for mobile at scale.
- **Event volume.** A mobile fleet of millions of devices emitting flag evaluations and custom events generates substantial ingestion volume. Configure SDK event buffering, batching, and (where supported) sampling deliberately.
- **MAU/MCI implications.** Every active mobile user contributes to MAU. Multi-context evaluation (user + organization + device) can multiply MCI. Forecast and budget.
- **Battery and data usage.** SDK initialization, polling, and streaming all consume the user's resources. The team that ignores this builds an app users uninstall.
- **Payload size.** The flag dataset transmitted to the mobile client should not include flags the mobile client doesn't need. The client-side / mobile flag dataset is scoped automatically; large datasets indicate the scoping needs attention.

---

## Developer Experience & Velocity (Lens overlay on lens)

**Mobile overlay:**
- Local dev with mobile SDKs uses offline mode + a known fallback set, or a development environment with realistic flag values. The bootstrap pattern is testable locally.
- Type-safe flag access on mobile (generated Swift / Kotlin constants from the flag inventory) prevents the runtime typo bugs that mobile QA rarely catches before release.
- App-version handling logic should be a shared abstraction across iOS and Android — not reimplemented per platform.

This is one of the few cross-lens overlaps in LDWA: the [Developer Experience lens](../developer-experience-velocity/) and the Mobile lens both apply to mobile DX work.

---

← [Design Principles](./design-principles.md) | Continue to → [SDK & Offline Patterns](./sdk-and-offline-patterns.md)
