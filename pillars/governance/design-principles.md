# Governance & Artifact Lifecycle — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Governance pillar.

---

## G-1. Every artifact has an owner

Every flag, segment, experiment, AI Config, and pipeline has a current, contactable owner — a team or a named engineer. Unowned artifacts are debt. The team treats "no owner" as a problem to be fixed, not a state to be tolerated.

## G-2. Every artifact has a lifecycle

Created → rolled out → measured → retired. Each step has rough timing. The retirement step is the most important one and the most often skipped. The best time to plan the retirement is when the artifact is created.

## G-3. Naming and tagging are policy, not preference

The team has documented conventions for naming flags, segments, experiments, and AI Configs, and for tagging them with team / system / type / purpose. The conventions are enforced (by automation where possible, by review otherwise). New artifacts that violate them get fixed at creation, not "eventually."

## G-4. Code References are the source of truth for "is this flag actually used?"

LaunchDarkly's [Code References](https://launchdarkly.com/docs/home/code/code-references) scan source repositories and surface which flags are referenced from code. They are how the team answers "can we archive this?" without guessing.

A team that doesn't have Code References running is a team archiving on hope.

## G-5. Stale artifacts get archived on a schedule

The team has a defined cadence for archival reviews. Stale flags older than N days, abandoned experiments older than M days, AI Configs without owners — these get triaged on the schedule, not at random.

The cleanup work is owned, scheduled, and visible.

## G-6. Change management is encoded, not socialized

The team's policies — who can change what, who approves what, what kinds of changes need review — are expressed in LaunchDarkly's configuration (custom roles, required approvals, pipeline gates, scheduled changes). Policies that live only in documents get bypassed under pressure.

## G-7. Project and environment structure reflects how the team works

Projects map to products or domains. Environments map to deployment stages. The structure is deliberate, documented, and mirrored across projects where it makes sense. Ad-hoc projects and one-off environments are exceptions, not the norm.

## G-8. The team measures its own LD health

The team tracks a small set of health metrics: percentage of flags older than N days, percentage of artifacts without owners, time-to-archive, experiments-without-decisions, and so on. The metrics are reviewed in operational reviews and improvement targets are set.

## G-9. Bulk and API operations are governed

Bulk archival, programmatic flag creation, mass tag changes, API-driven imports — these are operations that can change the account quickly. They have their own governance: who can do them, who approves them, what audit they leave.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
