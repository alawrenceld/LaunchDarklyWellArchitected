# Hybrid / Multi-Cloud / On-Prem — Pillar Overlays

How each pillar specializes for hybrid, multi-cloud, and restricted-egress workloads. Read the relevant pillar first; this page describes the *additional* expectations and shifted thresholds.

---

## Safe Release & Progressive Delivery

**Hybrid overlay:**
- A rollout across heterogeneous environments has to consider *which environments have the new binary* and *which environments can reach the flag updates*. A flag flip propagates fast to cloud SDKs and slowly (or not at all, until a manual sync) to air-gapped SDKs.
- For mixed-environment workloads, target rollouts on `environment.kind` (`cloud`, `on-prem`, `air-gapped`, etc.) so the rollout shape can be different per environment.
- Kill switches in air-gapped environments have an *operational* propagation lag, not just a technical one. Plan for a manual emergency-sync procedure when the flag must reach an air-gapped fleet faster than the next scheduled sync.

**Specific best-practice references:**
- [Safe Release BP-1.2](../../pillars/safe-release/best-practices.md) (target on stable attributes — environment kind qualifies)
- [Safe Release BP-6.2](../../pillars/safe-release/best-practices.md) (drill kill switches — must include air-gapped paths if any)

---

## Operational Excellence

**Hybrid overlay:**
- The "flags in motion" dashboard shows which environment is currently mid-rollout — meaningful even when the application is fully rolled out everywhere else, because environments diverge.
- The on-call runbook is **per environment**, not unified. The cloud runbook differs from the on-prem runbook differs from the air-gapped runbook.
- Audit-log streaming across environments: cloud Relay forwards audit events to the team's SIEM; on-prem and air-gapped need explicit forwarding pipelines (or scheduled sync), or the audit story is incomplete.
- Capacity planning is per environment. A unified review doesn't work when one environment runs serverless on AWS and another runs Kubernetes on-prem.

---

## Security & Compliance

**Hybrid overlay** — high-priority for this lens.
- SSO is *federated* and works across all environments equally. Local accounts in any LaunchDarkly project are exception-only.
- Custom roles scope by **project** + **environment** + **resource type**. For multi-residency teams, the residency-scoped projects/environments have their own role assignments distinct from non-residency-scoped ones.
- The Federal/commercial boundary (if applicable) is enforced per environment. See [Regulated Industries Lens — Federal](../regulated-industries/federal.md).
- Air-gapped systems may have stricter audit-log retention than cloud systems. The sync pipeline must preserve audit-log integrity to the air-gapped audit destination.
- Credential management: SDK keys, mobile keys, service tokens — each scoped to the environment they serve. A leaked credential should not allow lateral movement across environments.

**Specific best-practice references:**
- [Security & Compliance BP-1.x](../../pillars/security-and-compliance/best-practices.md) (SSO, Teams, custom roles)
- [Security & Compliance BP-5.x](../../pillars/security-and-compliance/best-practices.md) (environment isolation)

---

## Reliability & Resilience

**Hybrid overlay** — the primary pillar for hybrid work.
- Each network domain has its own LD-path resilience posture. Cloud-resident applications can default to direct connection or to in-region Relay; on-prem applications use local Relay; air-gapped applications use daemon-mode reading from a local store.
- Cross-cloud links are *not* on the LD critical path. A Relay topology that requires inter-cloud connectivity inherits inter-cloud failure modes.
- The drill cadence covers *each environment*. An "LD unavailable" drill in AWS doesn't validate the same behavior in the on-prem environment.
- For air-gapped systems, drill the sync pipeline: what happens if the sync misses a day? A week? Does the cached dataset stay valid? When does it become a problem?

**Specific best-practice references:**
- [Reliability BP-4.x](../../pillars/reliability/best-practices.md) (Relay Proxy deployment)
- [Reliability BP-6.x](../../pillars/reliability/best-practices.md) (multi-region; same principles apply to multi-provider)
- [Reliability BP-9.x](../../pillars/reliability/best-practices.md) (drills — must cover each environment)

---

## Governance & Artifact Lifecycle

**Hybrid overlay:**
- Tag flags with `environment-scope` so cross-environment artifacts vs. per-environment ones are distinguishable. Tags: `scope:cloud`, `scope:on-prem`, `scope:air-gapped`, or `scope:cross-environment`.
- Per-environment artifact inventory: which flags are active in which environments. Air-gapped environments diverge from cloud environments and require explicit tracking.
- The archival workflow needs an additional step in air-gapped environments: after archival in LaunchDarkly, the next sync removes the flag from the local store. Until then, applications still see the archived flag.
- Code References coverage spans repositories used in each environment, including those used to build on-prem and air-gapped binaries.

---

## Experimentation & Measurement

**Hybrid overlay:**
- Experiments rarely span environments — different environments have different user populations, different baselines, and different event-collection paths. Scope experiments per environment when possible.
- Event-collection in restricted-egress environments uses the sync pipeline that delivers flag updates in reverse. Events accumulate locally, then sync. Latency on experiment results is correspondingly longer.
- For air-gapped experiments, decision latency is in days, not hours. Plan around it.

---

## Performance & Cost Efficiency

**Hybrid overlay:**
- Network egress cost across providers can dominate the LD cost equation. Multi-cloud teams with poor topology pay for cross-cloud Relay traffic on every evaluation. Per-cloud Relay keeps the cost local.
- Relay capacity per environment scales with local traffic; don't share capacity assumptions across environments that have very different load shapes.
- Air-gapped environments often have predictable, low-volume usage. Sizing Relay or daemon-store for these is the small problem, but it's its own problem.
- MAU/MCI accounting: ensure each environment's contexts are correctly tagged so the team can attribute usage by environment.

---

## Developer Experience & Velocity (Lens overlap)

**Hybrid overlay:**
- Local development against cloud LD works the same as elsewhere. Local development against air-gapped LD requires offline-mode SDK use or a local mock.
- The CI/CD pipeline that builds binaries for multiple targets needs the right SDK credentials for each — and credentials must be scoped so a CI compromise in one environment doesn't expose all.
- Testing patterns differ: cloud workloads can use a test LaunchDarkly environment; air-gapped workloads test against the local daemon store with a synthetic dataset.

---

← [Design Principles](./design-principles.md) | Continue to → [Relay Topology Patterns](./relay-topology-patterns.md)
