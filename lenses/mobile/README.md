# Lens: Mobile

> *App stores are a 24-hour deploy pipeline. Flags are how you ship anyway.*

The Mobile Lens specializes LDWA for native mobile applications — iOS, Android, and cross-platform frameworks like React Native, Flutter, and Kotlin Multiplatform. It is the lens for the workloads where app-store review cycles, version fragmentation, and customer update behavior reshape every assumption about release cadence.

Mobile applications break several assumptions that the rest of LDWA quietly relies on. On the server, a deploy goes live for everyone within minutes; on mobile, a "release" lands on user devices over weeks or months as users update — and some never do. On the server, flag changes propagate within seconds; on mobile, the SDK may be offline, backgrounded, or running on a version the team no longer supports. The patterns in this lens exist because mobile demands them.

This lens does not replace the pillars. It re-applies them to the constraints and obligations of native mobile workloads, and adds mobile-specific best practices.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true for the LD-managed system being reviewed:

- You ship native iOS, Android, or cross-platform mobile applications using LaunchDarkly mobile SDKs.
- Your release cadence is constrained by app-store review and customer update behavior.
- Users open the app in conditions where the network is slow, intermittent, or absent — planes, transit, rural areas, coffee shops with bad wifi.
- You support a long tail of app versions in production at once.
- You run experiments or rollouts that need to respect app version, OS version, or device characteristics.
- Your event ingestion cost is non-trivial because mobile clients emit on cellular networks.

If your workload is purely server-side or browser-based, the standard pillars are sufficient.

## Contents

1. [Design Principles for Mobile](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md) — how each pillar specializes for mobile workloads.
3. [SDK & Offline Patterns](./sdk-and-offline-patterns.md) — mobile SDK selection, bootstrap, offline-first behavior, persistent caching across app updates, background-mode handling.
4. [App-Store Cadence & Release](./app-store-cadence-and-release.md) — app review cycles, version fragmentation, version-aware targeting, the integration with phased / staged rollouts on iOS and Google Play.
5. [Review Questions for Mobile Workloads](./review-questions.md)
6. [Anti-Patterns specific to mobile](./anti-patterns.md)

## How to use this lens during a review

When you run a [LDWA review](../../framework/review-process.md) on a mobile workload:

1. Run the standard review against the in-scope pillars.
2. **Then** walk the additional [review questions](./review-questions.md) in this lens.
3. Pay particular attention to **offline behavior**, **app-version targeting**, and **rollout patterns under update lag** — these are the dimensions where mobile most often diverges from server-side practice.
4. Many mobile workloads will surface findings around **Safe Release**, **Reliability**, and **Performance & Cost**; treat those as starting points and consult this lens for mobile-specific elaboration.

## The headline principles

- **The user's device is not always online.** Default-to-safe behavior must include offline.
- **An "old" client never disappears.** Plan for version skew indefinitely.
- **The app store is the slow path; flags are the fast path.** Decouple feature release from app release.
- **Bootstrap or you'll flash.** Every cold start either has a sensible default in the binary or a pre-evaluated set of values rendered into the app shell.
- **Mobile events are expensive.** Cellular data, battery, and MAU all add up. Sample deliberately.
- **Target on what's stable.** App version, OS major version, region, plan — not user-agent strings or model identifiers that shift.

These principles inform every pattern in this lens.
