# Shared Abstractions & Templates

The platform team's deliverables. Each abstraction or template is a concrete artifact that turns the team's standards into the path of least resistance for application teams.

This page describes the abstractions that consistently pay off, with guidance on building and operating each.

---

## Abstraction 1 — The SDK wrapper library

The single most leveraged platform-team artifact. A small library that wraps LaunchDarkly's SDK and exposes the team's preferred interface.

### What it provides

- **Encoded defaults.** Sensible timeouts, bootstrap pattern, fallback handling — all configured the team's way.
- **Typed flag access.** Either via generated constants or via method-per-flag interfaces.
- **Metrics emission.** Every flag evaluation emits standardized metrics — evaluation latency, fallback rate, errors.
- **Logging.** Standardized log lines for evaluations, errors, and fallbacks.
- **Test support.** Easy to mock in tests; offline-mode helpers.

### What it doesn't do

- **Hide the underlying SDK entirely.** Engineers should be able to drop down when they need to.
- **Lock in opinions that should be per-team.** The wrapper enforces the platform's defaults; application-team-specific behavior lives outside.

### Sizing

A useful wrapper is small — a few hundred lines per language. The smaller it is, the more likely application teams adopt it.

A wrapper that has grown to thousands of lines is a wrapper that's accumulated too much opinion. Split it into a minimal core and optional add-ons.

### Per-language

Each language used in the org needs a wrapper (or an explicit decision to use the raw SDK in that language). The platform team prioritizes by adoption — start with the most-used languages, expand as needed.

---

## Abstraction 2 — The codegen pipeline

A pipeline that generates typed flag-key constants (and optionally, typed wrapper methods) from the LaunchDarkly account's current state.

### Structure

- **Source:** the LaunchDarkly REST API. Reads the current flag inventory.
- **Generator:** a tool (often a script or small program in the team's primary language) that transforms the inventory into the team's typed access format.
- **Output:** committed code or generated-at-build-time files in each application repo.
- **Schedule:** runs on every PR open, on a daily schedule, and on-demand.

### Per-language considerations

Different languages benefit from different shapes:

- **Static-typed languages (TypeScript, Kotlin, Go, Rust):** generate an enum / class with constants for keys, plus typed methods.
- **Dynamic languages (Python, Ruby, JavaScript-the-dynamic-parts):** generate a constants module; pair with lint to require its use.

---

## Abstraction 3 — IaC modules

Reusable Terraform / Pulumi / OpenTofu modules that encode the team's standard structures.

### Common modules

- **`launchdarkly-project`:** creates a project with the standard environments, tags, and team assignments.
- **`launchdarkly-team`:** creates a Team with the standard custom roles and configurations.
- **`launchdarkly-environment`:** creates an environment with the standard policies, default rules, and integrations.
- **`launchdarkly-release-pipeline`:** creates a Release Pipeline from a template.
- **`launchdarkly-segment`:** creates a rule-driven segment with the team's tagging.

### Adoption

Application teams reference the modules in their own IaC (the application team owns the IaC for their resources; the platform team owns the modules they reference).

### Versioning

Modules are versioned. Application teams pin to a version; the platform team publishes updates with changelogs.

---

## Abstraction 4 — Service templates / scaffolds

For organizations with service templates (Backstage, custom scaffold tools), the LaunchDarkly integration is baked into the template:

- New service: standard wrapper library imported, Code References configured, environment variables for SDK key set up via secret manager, dev / staging / production environment hooks in place.

This is the highest-leverage onboarding pattern: a new service is LDWA-aligned from day one because the template put it there.

---

## Abstraction 5 — Release Pipeline catalog

A library of vetted Release Pipelines that application teams choose from.

### Common templates

- **`standard-customer-facing-rollout`:** the team's default for low-to-medium-risk customer-facing changes.
- **`high-blast-radius-rollout`:** for changes affecting auth, billing, checkout, etc. — more steps, more approvals, longer observation windows.
- **`internal-tool-rollout`:** lighter pattern for internal-only changes.
- **`ai-config-rollout`:** for AI Config-specific releases with cost / latency / quality guardrails.
- **`migration-rollout`:** for strangler-fig migrations (per the [Migration lens](../migration/)).
- **`regulated-rollout`:** for changes affecting compliance-scoped workloads (per the [Regulated Industries lens](../regulated-industries/)).

### Usage

Application teams pick the pipeline matching their change's risk. The pipeline's structure is fixed; the application team configures the per-flag specifics.

---

## Abstraction 6 — Approval workflow templates

For Guardian Edition (or equivalent in-house workflow), the platform team builds approval-workflow templates:

- **`production-change-approval`:** standard production-change approval flow.
- **`regulated-change-approval`:** approval flow for compliance-scoped resources.
- **`bulk-operation-approval`:** approval for bulk archival or mass tagging operations.

Application teams reference these in their own setup.

---

## Abstraction 7 — Dashboards and observability

The platform team operates the cross-cutting LaunchDarkly observability:

- **The "flags in motion" dashboard** at org level.
- **Health-metric dashboards** at org level.
- **MAU/MCI trending and forecasts** at org level.
- **Audit-log streaming and querying** at org level.

Application teams get filtered views (their team's flags, their team's rollouts) without each team building their own dashboards.

---

## Abstraction 8 — Documentation as a product

The platform team's documentation is a product:

- **Onboarding doc:** "how to start using LaunchDarkly at this company."
- **Cookbook:** patterns for common scenarios with copy-pasteable examples.
- **Reference:** the wrapper library's API; the IaC modules' inputs; the pipeline templates' usage.
- **FAQs:** the questions that arise during office hours, captured.
- **Decision log:** the platform team's decisions and their rationale (so future engineers don't reverse choices that had reasons).

The doc is alive: updated when patterns change, when questions surface, when feedback arrives.

---

## Abstraction 9 — Office hours and a Slack channel

The lightest-weight abstractions, but among the most valuable:

- **Slack channel:** team-help-launchdarkly (or similar). Quick questions; quick answers; the answers often surface gaps in docs.
- **Office hours:** scheduled time when the platform team is available for deeper conversations. Application teams come with questions; the platform team listens for roadmap signals.

These are the feedback loops that keep the platform team's product oriented to actual needs.

---

## Abstraction 10 — The "Golden Path" definition

A short, written document defining the platform team's recommended path for the most common use cases:

> **The Golden Path for a feature release at [Company]:**
> 
> 1. Use the `@company/launchdarkly` wrapper library (latest version).
> 2. Define the flag in LaunchDarkly with the standard tags (`team:X`, `system:Y`, `type:release`, `lifecycle:release-temporary`).
> 3. Use the `standard-customer-facing-rollout` pipeline.
> 4. Attach cost, latency, and a quality metric as guardrails.
> 5. Roll out via the pipeline's phases.
> 6. After warm period, archive the flag (PR + Code References confirmation).
>
> Deviation from this path is fine when justified. Open an issue or come to office hours.

This document is the answer to "how do we do things here?" for the majority of application-team work.

---

## How to roll out a new abstraction

When the platform team builds a new abstraction:

1. **Test with one application team.** A friendly customer adopts the abstraction; the platform team gets feedback.
2. **Iterate based on feedback.** Adjust the abstraction's API, defaults, documentation.
3. **Stabilize.** Version 1.0 with documented behavior.
4. **Broadcast.** Announce to all application teams; document; share examples.
5. **Drive adoption.** Track adoption rate; help laggard teams; understand why adoption is slow if it is.
6. **Refine.** Continue updating based on usage.

The platform team's biggest mistake is shipping an abstraction and assuming adoption. Adoption requires marketing the abstraction to its users.

---

## What's *not* a shared abstraction

Some things look like shared abstractions but shouldn't be:

- **One-off application-team flags.** These belong in the application team's project. Centralizing them defeats the platform model.
- **Application-team-specific business logic embedded in shared code.** Anything specific to one application team belongs in that team's code.
- **Compliance interpretation.** The platform team provides tooling for compliance evidence; it doesn't interpret specific compliance requirements for application teams.
- **Product decisions.** The platform team doesn't decide whether a feature ships; application teams do.

The platform team's value is in the cross-cutting concerns; application-team specifics stay in application teams.

---

← [Platform Team Responsibilities](./platform-team-responsibilities.md) | Continue to → [Review Questions](./review-questions.md)
