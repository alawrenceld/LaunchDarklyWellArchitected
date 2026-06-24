# Governance & Artifact Lifecycle — Definition

This pillar is organized into the following focus areas.

---

## 1. Ownership

Every LD artifact has a documented owner. Covers ownership assignment at creation, ownership transfer when teams change, ownership review on a cadence, and the operational treatment of unowned artifacts (a tag, a dashboard, an active triage queue).

## 2. Naming and tagging taxonomy

The conventions for how artifacts are named and tagged. Covers flag naming patterns (kebab-case, scoped by product, prefixed by purpose); segment naming; experiment naming; AI Config naming; the mandatory and optional tag dimensions (team, system, type, purpose, sensitivity); and the enforcement of conventions in tooling.

## 3. Flag lifecycle

The end-to-end path a flag travels. Covers creation (with retirement date), rollout (covered in depth in Safe Release), steady state (operational toggles, permanent flags), and archival (the disciplined removal of the flag from both LaunchDarkly and the code).

## 4. Experiment lifecycle

The lifecycle of an experiment from hypothesis through decision. Covers experiment design (covered in depth in Experimentation), running, decision-making, and what happens after the decision — including the cleanup of variations, segments, and metrics no longer needed.

## 5. AI Config lifecycle

The lifecycle of an AI Config from creation through retirement. Covers model and prompt versioning, the disciplined retirement of variations that are no longer in use, and the alignment with the broader provider and model migration story.

## 6. Code References as a governance tool

How [Code References](https://launchdarkly.com/docs/home/code/code-references) are deployed and operated. Covers configuration across repositories, the surfacing of stale flags (flags with no code references), the surfacing of dangerous flags (flags removed from code but still active in LaunchDarkly), and the integration with the archival workflow.

## 7. Archival discipline

The mechanics of retiring an artifact. Covers the decision to archive, the order of operations (remove from code → confirm no references → archive in LaunchDarkly → delete after a buffer period), the bulk-archival paths, and the audit trail for archival decisions.

## 8. Project and environment structure

How projects and environments are organized. Covers the project granularity decision (per product? per team? per data-residency boundary?), the environment structure (`production`, `staging`, `dev`, plus any specialized environments), and the mirroring of structure across projects.

## 9. Change-management policy

The codified rules for who can do what. Covers role assignment, approval requirements per artifact type, change windows, audit expectations, and the explicit decisions about which kinds of changes need lightweight vs. heavyweight governance.

## 10. Bulk operations and API governance

How the account is changed at scale. Covers bulk archival, programmatic flag creation, mass tagging, API-driven imports, and the controls around these (service-token scope, approvals, dry-run patterns, audit trail).

## 11. LD health metrics

The measurements that tell the team whether the account is getting healthier or unhealthier. Covers the definition of the metrics (stale-flag percentage, time-to-archive, ownership coverage, experiments-without-decisions, etc.), how they are gathered (audit log, Code References, the LaunchDarkly API), and how they are reviewed.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
