# Pillar: Reliability & Resilience

> *Your product should survive any one of: the network, the SDK, or LaunchDarkly itself being impaired.*

The Reliability pillar covers how your LD-managed system behaves when the LaunchDarkly layer — SDKs, Relay Proxy, edge delivery, event ingestion, AI Config evaluation, the LD service itself — is impaired. The principle is uncomplicated: LaunchDarkly is highly available, but no system is invulnerable. Your application should degrade gracefully when *any* part of the LD path is unavailable, and it should never be brought down by an LD outage.

This pillar overlaps with Safe Release (which covers safety of the *changes* you ship) and with Operational Excellence (which covers day-2 operation). Reliability covers the dependency posture: how much you depend on LD being there, and what happens when it briefly isn't.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Contents

1. [Design Principles](./design-principles.md)
2. [Definition](./definition.md)
3. [Best Practices](./best-practices.md)
4. [Review Questions](./review-questions.md)
5. [Anti-Patterns](./anti-patterns.md)

## When this pillar is most relevant

- You're integrating LaunchDarkly into a system whose availability is business-critical.
- You've had — or want to avoid — an incident where LD-related failures took down user experience.
- You're designing the SDK and Relay Proxy topology for a new system.
- You're operating in restricted-egress, air-gapped, or hybrid environments where the LD path is non-trivial.
- You're adopting AI Configs and need to plan for LLM provider failures.

## Related pillars

- **Safe Release** — covers reversibility of *changes you intend to make*. Reliability covers what happens when *something fails unintentionally*.
- **Operational Excellence** — covers how you monitor, alert, and respond. Reliability covers what you build to depend on.
- **Performance & Cost** — overlaps where Relay Proxy sizing, edge delivery, and SDK choice are involved.
