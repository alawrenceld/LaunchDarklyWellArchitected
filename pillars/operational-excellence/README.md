# Pillar: Operational Excellence

> *Treat the LaunchDarkly layer like the production system it is.*

The Operational Excellence pillar covers everything about day-2 operation of your LaunchDarkly-managed system: how you monitor it, alert on it, audit it, integrate it with your delivery pipeline, and respond when something goes wrong. It also covers how you use LaunchDarkly's observability surface (Session Replay, Errors, Logs) to close the loop on the changes you ship.

Most LD-related incidents aren't outages of LaunchDarkly itself. They're operational failures of how the LaunchDarkly layer is run — a rotated key with no coordination, an under-sized Relay Proxy fleet at launch time, an event-ingestion spike that nobody saw coming, a misconfigured webhook that fires at 3 AM. This pillar is about preventing those.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md) — the principles specific to Operational Excellence.
2. [Definition](./definition.md) — focus areas inside the pillar.
3. [Best Practices](./best-practices.md) — what to do, organized by focus area.
4. [Review Questions](./review-questions.md) — diagnostic questions for a LDWA review.
5. [Anti-Patterns](./anti-patterns.md) — common ways this pillar goes wrong.

## When this pillar is most relevant

- You're scaling LaunchDarkly across many teams and the operational seams are starting to show.
- You've had a non-trivial incident traceable to LD operations (key rotation, ingestion spike, webhook failure, misconfiguration).
- You're integrating LaunchDarkly into a mature CI/CD pipeline and want to do it well.
- You've adopted LaunchDarkly's observability features (Session Replay, Errors, Logs) and want to use them effectively.
- You're preparing for an audit or compliance review and need operational evidence.

## Related pillars

- **Reliability** — covers what happens when LD's *availability* is impaired. Operational Excellence covers how the team *runs* the system day-to-day. The two overlap; together they make the LD layer trustworthy.
- **Governance** — defines who owns what and how change is managed. Operational Excellence defines how the team operates within those rules.
- **Security & Compliance** — audit logs and approvals live there; how you *use* them lives here.
