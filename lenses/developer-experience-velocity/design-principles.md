# Developer Experience & Velocity — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for the engineering-productivity dimension of LaunchDarkly use.

---

## DX-1. Make the safe path the easy path

The right way to use LaunchDarkly should be the path of least resistance. If the team's standard pattern requires more keystrokes, more configuration, or more thought than the wrong pattern, the wrong pattern will win under pressure.

Invest in abstractions, templates, and tooling that make the safe pattern reflexive.

## DX-2. Typed access beats string literals

A flag key referenced as a string literal is a typo waiting to happen. Generate constants (or use a typed wrapper library) so flag keys are visible in the IDE, refactor-safe, and impossible to mistype.

The cost of typed access is small; the cost of an evaluation against a typo'd key is a silent fallback that nobody notices.

## DX-3. The fallback path runs in CI

Every PR's tests include a run with the SDK in offline mode (or with a fallback-only context). If the application breaks under fallback, the test fails. The fallback path is tested as thoroughly as the happy path.

The team that doesn't exercise the fallback in CI discovers it in production.

## DX-4. Local development is realistic

A developer working locally can run against a representative flag dataset — not just stubs, not just "feature on for me." Local dev is fast, reproducible, and resembles production enough that bugs caught locally are bugs that would have surfaced in staging.

For AI Configs, local dev includes a working eval loop against the same providers used in production.

## DX-5. Tests describe behavior, not configuration

A unit test for a flag-gated path tests both the on and off variations. The test names describe the *behavior* under each variation, not the flag value. Tests survive flag renames; tests survive variation changes.

The test that says `test_with_flag_my-new-feature-v2_true` is bound to the flag's name. The test that says `test_renders_new_dashboard_when_dashboard_v2_enabled` describes behavior.

## DX-6. Foundational LaunchDarkly resources live in IaC

Projects, environments, foundational segments, the team's standard release pipelines, custom roles — these belong in Terraform / Pulumi / OpenTofu / equivalent. Day-to-day flag flips happen in the UI. The platform-shaped foundations are IaC; the operational surface is UI.

This division of labor matches both safety and speed.

## DX-7. The CI/CD pipeline is aware of LaunchDarkly

CI runs lint checks for flag-key references against the current account. Builds fail when code references archived flags. PRs surface "this change adds a new flag" with the flag's owner and tagging. Deploys mark LaunchDarkly events as deploy annotations.

The pipeline knows about LaunchDarkly the same way it knows about its other dependencies.

## DX-8. Onboarding is fast

A new engineer should be productive with LaunchDarkly within their first week — able to create a flag correctly, integrate it in code, test it locally, ship it through the standard rollout pattern. If onboarding takes longer, the team's tooling and documentation are doing less work than they could.

A short, written "how we use LaunchDarkly here" doc is the floor.

## DX-9. The flag-change PR is the same as any other PR

Adding a flag to the codebase isn't a workflow exception. The PR goes through the same review, tests, and merge process as any other code change. Reviewers know what to look for in a flag-add PR.

The team that treats flag PRs differently (lighter review, different tests) is the team that ships flag bugs.

## DX-10. Code References is on, scanning, and acted upon

The dashboard shows stale flags. Someone acts on the dashboard. The information loop is closed. See [Governance pillar BP-6.x](../../pillars/governance/best-practices.md).

If Code References is configured but ignored, the team is paying for a signal they don't use.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
