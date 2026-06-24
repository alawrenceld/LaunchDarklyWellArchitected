# Safe Release — Definition

This pillar is organized into the following focus areas. Best practices and review questions are grouped under these.

---

## 1. Targeting strategy

Who should receive each variation, and how that targeting is expressed. Covers context modeling, segment design, the relationship between contexts and your identity systems, multi-context evaluation, and the discipline of *only* targeting attributes that are stable and meaningful.

## 2. Rollout patterns

The shape of progressive exposure. Includes percentage rollouts, ring-based rollouts (internal → beta → GA), canary releases, blue/green via flags, scheduled changes, and named-segment promotions. Each pattern has appropriate uses; the team should know which to reach for and when.

## 3. Guarded Releases

Progressive rollouts with attached metrics and automated rollback. Covers guarded-release configuration, metric selection, regression thresholds, the duration and step size of the rollout, and the integration with on-call alerting (PagerDuty for guarded rollouts is a Guardian Edition capability).

## 4. Release Pipelines

Multi-phase, governed rollout workflows that move a flag through stages, environments, and audiences with consistent strategies and approvals. Available to Enterprise and Guardian plans. Covers pipeline design, phase composition, approval placement, and the relationship between pipelines and release policies.

## 5. AI Config rollouts

Model swaps, prompt changes, provider changes, and parameter changes treated as releases. Covers the same progressive-exposure and guardrail principles applied to LLM-driven features, with additional considerations for cost, latency, and quality measurement.

## 6. Kill switches and fallback paths

Flags whose explicit purpose is incident response. Covers identifying which product surfaces need kill switches, naming and documenting them so the on-call can find them, drilling them, and pairing each one with a defined fallback experience.

## 7. Default values and SDK fallbacks

The variation served when no rule matches, and the value passed to the SDK as a safety net. Covers the discipline of treating defaults as a deliberate design choice, ensuring application code survives the fallback path, and using *off* variations to mean something useful.

## 8. Scheduled changes and change windows

Changes timed to take effect at a specific moment (or after a specific delay), and the organizational discipline of release windows. Covers the use of LaunchDarkly's scheduled-change capability (a Guardian Edition strength), coordination with deployment freezes, and the trade-off between flexibility and predictability.

## 9. Release policies and team norms

The written record of how this team releases. Covers release policies (per-environment defaults), naming and templating conventions, the relationship between pipelines and ad-hoc rollouts, and the discipline of making the safe path the default path.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
