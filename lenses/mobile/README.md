# Lens: Mobile

> *App stores are a 24-hour deploy pipeline. Flags are how you ship anyway.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for native mobile applications (iOS, Android, cross-platform) — the workloads where app-store review cycles dominate code delivery and where flags are the only way to release on a product cadence rather than a deploy cadence.

## When this lens will apply

- You ship native mobile applications and use LaunchDarkly to release features inside them.
- Your release cadence is constrained by app-store review and customer update behavior.
- You need offline-first SDK behavior because users open the app on planes, in tunnels, in coffee shops with bad wifi.

## Phase 3 scope

The lens will cover client-side SDKs in mobile contexts, offline-first patterns, the bootstrap pattern adapted to mobile, app-store cadence vs. server-side flips, OS-version targeting via contexts, mobile-specific cost considerations (event ingestion from mobile networks), and the integration with mobile observability tools.

In the meantime, draw on [Reliability — Initialization, bootstrap, and offline behavior](../../pillars/reliability/best-practices.md), and [Safe Release — Rollout patterns](../../pillars/safe-release/best-practices.md).
