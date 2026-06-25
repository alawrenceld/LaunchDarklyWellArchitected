# Lens: Hybrid / Multi-Cloud / On-Prem

> *Where your workload runs shouldn't change how well you release.*

The Hybrid / Multi-Cloud / On-Prem Lens specializes LDWA for teams whose deployment footprint spans multiple cloud providers, hybrid environments (cloud plus on-premises), air-gapped or partially-air-gapped systems, or networks with restricted egress. It is the lens that takes the cloud-neutral design of LDWA and grounds it in the operational realities of running a coherent release practice across infrastructures that don't all look alike.

Most LDWA content is provider-neutral by design. This lens addresses the parts where the provider mix or the network posture changes the answers — Relay topology, identity federation, residency, and the operating model for environments where you can't assume the SDK can reach `app.launchdarkly.com` at all.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true for the LD-managed system being reviewed:

- Your workload runs across **more than one cloud provider** (AWS + GCP, AWS + Azure, hybrid, etc.) and you need a coherent flag system across them.
- You operate **on-premises** workloads — bare-metal, private VMware, Nutanix, OpenShift, internal Kubernetes — that need to evaluate flags alongside cloud workloads.
- You operate in **restricted-egress** environments where direct outbound from application hosts to LaunchDarkly is not permitted or is undesirable.
- You operate **air-gapped** systems — manufacturing networks, defense workloads, lab equipment, regulated industrial control — that have no internet access at all.
- You serve customers under **residency obligations** that require regional or per-provider data handling.
- You have a **federated identity** posture across providers and need LaunchDarkly access to fit it.
- You're planning a **cloud migration** and need flag continuity across the transition.

If your workload runs in a single cloud with normal egress, the standard pillars are sufficient.

## Contents

1. [Design Principles for Hybrid Workloads](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md) — how each pillar specializes for multi-provider and restricted-egress contexts.
3. [Relay Topology Patterns](./relay-topology-patterns.md) — the canonical hybrid/multi-cloud Relay deployments: per-provider, hub-and-spoke, regional + provider, daemon-mode across providers.
4. [Air-Gapped & Restricted-Egress Patterns](./air-gapped-and-restricted-egress.md) — operating LaunchDarkly when outbound internet is partially or fully unavailable.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

When you run a [LDWA review](../../framework/review-process.md) on a hybrid or multi-cloud workload:

1. Run the standard review against the in-scope pillars.
2. **Then** walk the additional [review questions](./review-questions.md) in this lens.
3. Pay particular attention to **Relay topology**, **identity federation**, and **residency posture** — these are where hybrid workloads most often diverge from single-cloud practice.
4. Many hybrid workloads will surface findings around **Reliability**, **Security & Compliance**, and **Operational Excellence**; treat those as starting points and consult this lens for the elaboration.

## The headline principles

- **Topology is per-network-domain, not per-cloud.** What matters is which networks have outbound, which don't, and where failure isolation lines run.
- **Identity is federated, not duplicated.** A single source of identity feeds LaunchDarkly access across providers.
- **Residency is per system, not per company.** Different workloads may live under different residency rules; the architecture has to honor each.
- **Air-gapped is a posture, not an edge case.** Plan for it deliberately or it will plan for itself badly.
- **Cross-cloud network is the LD path's weakest link.** A multi-cloud Relay topology that depends on inter-cloud links inherits every inter-cloud failure.
- **The migration is the test.** A hybrid posture that doesn't survive a cloud migration was never actually hybrid.

These principles inform every pattern in this lens.
