# Definitions and Glossary

This glossary defines the LaunchDarkly and LDWA vocabulary used throughout the framework. Where LaunchDarkly's product documentation is authoritative, links are provided.

For LaunchDarkly's full vocabulary reference, see the [official vocabulary page](https://launchdarkly.com/docs/home/getting-started/vocabulary).

---

## Core LaunchDarkly primitives

**Feature flag.** A configurable switch whose value is evaluated at runtime against a context and a set of targeting rules. The foundational unit of LaunchDarkly. Flags may be boolean (`on`/`off`) or multivariate (string, number, JSON). A flag's *variations* are the possible values it can return.

**Variation.** One possible value a flag can return. A boolean flag has two variations; a multivariate flag has two or more.

**Context.** Data describing the entity a flag is being evaluated for — a user, a device, an organization, a tenant, a request. Contexts have a *kind* (e.g., `user`, `organization`, `device`) and a set of attributes (e.g., `email`, `plan`, `region`). LaunchDarkly supports multi-context evaluation, so a single evaluation can include several context kinds at once.

**Segment.** A reusable group of contexts defined by rules or by explicit list. Segments let you target the same audience from many flags without duplicating logic.

**Project.** The top-level organizational unit in LaunchDarkly. A project contains environments, flags, segments, contexts, and other artifacts. Most customers use projects to separate distinct products or domains.

**Environment.** A deployment stage within a project — for example, `production`, `staging`, `test`. Each environment has its own SDK credentials and its own targeting rules for every flag.

**SDK Key.** A server-side credential authorizing a server SDK or the Relay Proxy to connect to LaunchDarkly. SDK keys are *secrets*; they grant read access to the flag dataset and must be stored as environment variables or in a secret manager.

**Client-side ID.** A public credential used by client-side and edge SDKs. Not secret, but scoped to the client-side flag dataset.

**Mobile key.** A public credential used by mobile SDKs. Not secret, but resettable. (See [Getting Started](https://launchdarkly.com/docs/home/getting-started) for the distinctions.)

**Targeting rule.** A condition that maps a context (or a segment) to a specific variation of a flag. Rules are evaluated in order; the first match wins. Defaults apply when no rule matches.

**Default rule (fallthrough).** The variation served when no targeting rule matches the context.

**Default value (off variation / fallback value).** The variation served when the flag is *off*, or — in the SDK call — the value the application uses if the SDK cannot reach LaunchDarkly and has no cached value. The *off variation* is a LaunchDarkly setting; the *fallback value* is the value passed to the SDK's evaluation method as a safety net.

---

## Releases, experiments, and pipelines

**Release.** Any deliberate change to runtime behavior driven by a flag, segment, AI Config, or pipeline.

**Progressive release.** A release that gradually increases exposure — by percentage, by segment, by ring — instead of flipping everyone at once.

**Guarded release / guarded rollout.** A progressive release with attached metrics. As exposure increases, LaunchDarkly monitors those metrics for regressions and can automatically roll back if a regression is detected. (See [LaunchDarkly Guarded Releases](https://launchdarkly.com/blog/launch-week-2024-introducing-guarded-releases/).)

**Release pipeline.** An automated, multi-phase rollout workflow that moves a flag through defined stages, environments, and audiences with configurable strategies and approvals. Available to Enterprise and Guardian plans. (See [Release Pipelines docs](https://launchdarkly.com/docs/home/releases/release-pipelines).)

**Release strategy.** The rules governing how a single pipeline phase rolls out — which environment, which audience, what approvals, immediate vs. gradual.

**Release Assistant.** The combined Release Pipelines plus automation system in LaunchDarkly.

**Release policy.** A reusable definition of preferred release methods for an environment — for example, "all production releases of customer-facing flags must use a guarded release with this default configuration."

**Kill switch.** A flag whose sole purpose is to disable a feature in production immediately. By convention, a kill switch defaults to *enabled* (feature on) and is flipped *off* during an incident.

**Experiment.** A controlled comparison of two or more variations of a flag against a set of metrics. Experiments are governed by a hypothesis, primary/secondary/guardrail metrics, and a pre-committed decision rule.

**Holdout.** A segment of contexts deliberately excluded from experiments and rollouts for a defined period, to measure long-run effects.

**Guardrail metric.** A metric that must *not* get worse during a release or experiment. If it does, the release is rolled back or the experiment is stopped.

**Primary metric.** The metric the release or experiment is trying to move in a specific direction.

---

## AI Configs

**AI Config.** A LaunchDarkly resource that controls how an application uses a large language model. AI Configs let you manage model selection, prompts, providers, and parameters outside the application, and roll out or experiment with changes the same way you would with a flag. (See [AI Configs docs](https://launchdarkly.com/docs/home/ai-configs).)

**Completion mode.** An AI Config mode for single-turn model responses configured by messages and roles.

**Agent mode.** An AI Config mode for multi-step workflows configured by structured instructions.

**Model variation.** One possible model configuration an AI Config can return — provider, model, prompt, parameters. Equivalent to a flag's variation, for AI use cases.

---

## Governance and access

**Member.** A user in your LaunchDarkly account.

**Member role.** A predefined permission set assigned to a member.

**Custom role.** A user-defined permission set assigned to one or more members or teams. Available on Enterprise and Guardian plans.

**Team.** A named group of members. Teams can own resources and inherit roles.

**Audit log.** The immutable record of every change made to a LaunchDarkly account — flags, segments, members, roles, integrations.

**Code References.** A LaunchDarkly capability that scans your source repositories for flag-key usage and surfaces, in the LaunchDarkly UI, where each flag is referenced in code. The authoritative input to a flag-archival decision.

---

## Guardian Edition

**Guardian Edition.** A LaunchDarkly plan tier built around governed, auditable change. Guardian Edition includes — at minimum — required approvals, scheduled changes, advanced workflows, the PagerDuty integration for guarded rollouts, restricted *No access* role, and custom roles. (See [Manage account member roles](https://launchdarkly.com/docs/home/account/manage-members) and the [PagerDuty Guardian Edition integration](https://launchdarkly.com/docs/integrations/pagerduty-guardian-edition).) Guardian is designed for regulated industries and enterprises with strong change-management requirements.

**Required approval.** A workflow rule that prevents a change to a flag (or other resource) from taking effect until the configured approvers have reviewed and approved it.

**Scheduled change.** A change configured in advance to take effect at a specific time or under a specific condition.

**Workflow.** A multi-step automation that executes a series of LaunchDarkly changes — for example, "increase rollout to 25%, wait 24 hours, increase to 50%."

---

## Reliability and delivery

**Relay Proxy.** A self-hosted service that fronts LaunchDarkly's APIs. Used to centralize SDK connections, reduce egress, cache flag rules, and support daemon-mode and offline scenarios. (See [Relay Proxy docs](https://launchdarkly.com/docs/sdk/relay-proxy).)

**Proxy mode.** Relay Proxy mode in which the Relay sits between SDKs and LaunchDarkly's APIs. SDKs talk to Relay; Relay talks to LaunchDarkly.

**Daemon mode.** Relay Proxy mode in which the Relay writes flag data to a persistent store (Redis, DynamoDB, etc.), and SDKs read flag data directly from that store. Used when the SDK process cannot reach Relay over a long-lived streaming connection.

**Edge SDK / edge delivery.** A LaunchDarkly SDK or integration that evaluates flags at a CDN/edge node (Cloudflare Workers, Vercel Edge, Fastly Compute, Akamai). Optimized for low latency.

**Offline mode.** SDK behavior in which no calls to LaunchDarkly are made; the SDK returns the fallback value supplied by the caller. Used for testing, air-gapped environments, and graceful degradation.

**Bootstrap.** A pattern in which a client-side SDK is initialized with a pre-evaluated set of flag values rendered by the server, so the client never has to wait for an initial network round-trip.

---

## LDWA-specific terms

**LD-managed system.** The unit of review in LDWA. A service, product surface, or experience whose runtime behavior, releases, experiments, AI configuration, or observability is governed by LaunchDarkly.

**Pillar.** A dimension of a well-architected system. Each pillar has design principles, focus areas, best practices, and review questions.

**Lens.** A domain- or context-specific overlay on the framework. A lens specializes the pillar guidance for a particular use case (e.g., AI/GenAI, Regulated Industries, Mobile).

**Focus area.** A sub-category within a pillar that groups related best practices.

**Best practice.** A specific, actionable recommendation. Phrased as something you do, with the *why* attached.

**Review question.** A diagnostic question used during a LDWA review. Each question is associated with one or more best practices.

**Risk level.** The severity of a gap surfaced by a review question. LDWA uses three levels: **High Risk** (a gap that could plausibly cause an incident, breach, or major customer impact), **Medium Risk** (a gap that creates operational drag or future risk), **None** (no material gap).

**Improvement item.** A specific change identified during a review, scoped, owned, and tracked.

**Improvement plan.** The prioritized list of improvement items produced by a review.

**Anti-pattern.** A common, named failure mode. Each pillar has a catalogue.

---

← [Framework Introduction](./introduction.md) | Continue to → [How to Use This Framework](./how-to-use.md)
