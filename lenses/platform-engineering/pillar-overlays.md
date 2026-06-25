# Platform Engineering — Pillar Overlays

How each pillar specializes when LaunchDarkly is operated as a platform capability serving many application teams.

---

## Safe Release & Progressive Delivery

**Platform overlay:**
- The team's standard rollout patterns (percentage rollouts, ring rollouts, guarded rollouts, release pipelines) are templates the platform team builds and application teams adopt.
- Platform-owned Release Pipelines are the default. Application teams can request modifications; ad-hoc deviation is exception-only.
- Per-application-team rollout configuration is documented in the team's runbook; the platform team's guidance covers when to use which.

---

## Operational Excellence

**Platform overlay:**
- The platform team operates the cross-cutting LaunchDarkly observability: the global "flags in motion" dashboard, the integration with the org's observability stack, the audit-log streaming.
- Application teams have access to their own team's filtered views.
- The platform team's on-call covers cross-cutting LD issues (the SDK fleet, Relay Proxy, integration health). Application teams' on-calls cover their own flag-level issues.
- The platform team runs launch-readiness reviews when application teams are about to do high-load launches.

---

## Security & Compliance

**Platform overlay** — high-priority for this lens.
- Identity and access are platform-team-owned. SSO, Teams, custom roles all flow from platform-team configuration.
- Application teams have **scoped** access to their own project / environment / resource type. They can't accidentally touch other teams' resources.
- Audit-log streaming and SIEM integration are platform-owned.
- Compliance evidence pipelines are platform-team responsibilities. Per-application-team compliance scoping (tags, project boundaries) is application-team responsibility.

---

## Reliability & Resilience

**Platform overlay:**
- The Relay Proxy fleet is platform-team-operated. Application teams use it; they don't operate it.
- The platform team's SDK wrapper library encodes the team's reliability defaults: appropriate timeouts, bootstrap pattern, fallback handling.
- Chaos drills covering the LD layer are platform-team-run; application teams participate as consumers of the test.

---

## Governance & Artifact Lifecycle

**Platform overlay:**
- Naming and tagging conventions are platform-team-defined; application teams follow them.
- The hygiene practice — quarterly archival sweeps, ownership audits, health metrics — is operated by the platform team. Application teams participate in their own scope.
- Code References deployment is platform-team-driven; teams adopting LaunchDarkly automatically get it via service templates.
- Project structure decisions are platform-team-owned (or, for very large orgs, a federated decision with platform-team coordination).

---

## Experimentation & Measurement

**Platform overlay:**
- The platform team provides experimentation infrastructure: metric-instrumentation libraries, eval pipelines for AI Configs, decision-capture templates.
- Application teams design and run their own experiments using the platform's tooling.
- The platform team aggregates experiment metadata into the cross-org experiment portfolio.

---

## Performance & Cost Efficiency

**Platform overlay** — high-priority.
- Per-team MAU/MCI attribution is a platform-team capability. The platform team produces the per-team cost dashboards.
- Capacity planning at the LD-layer level (Relay sizing, event ingestion capacity) is platform-team-owned.
- Application teams optimize within their own scope.
- The platform team identifies and engages teams whose usage is becoming material before it surprises anyone.

---

## Developer Experience & Velocity (Lens overlap)

**Platform overlay** — this lens and the DX lens are tightly related.
- The wrapper library, codegen pipeline, IaC modules, and CI integrations are platform-team-built. They embody the team's DX standards.
- Onboarding patterns (the first-week task, the documentation, the pairing) are platform-team-provided.
- Application teams customize within their scope; the platform team handles the shared layer.

---

← [Design Principles](./design-principles.md) | Continue to → [Platform Team Responsibilities](./platform-team-responsibilities.md)
