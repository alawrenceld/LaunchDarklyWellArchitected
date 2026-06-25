# Hybrid / Multi-Cloud / On-Prem — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for hybrid, multi-cloud, and restricted-egress workloads.

---

## H-1. Topology follows network domains, not org charts

The right Relay deployment per workload is determined by which network domains the application sits in — not by which BU or team owns it. A workload that lives in three networks (AWS VPC, Azure VNet, on-prem datacenter) is a workload that needs three local Relay paths or one carefully-justified centralized one.

Don't deploy Relay topology to match the organizational structure when the network structure differs.

## H-2. Each network domain owns its egress decision

A network with permissive egress can let SDKs talk to LaunchDarkly directly. A network with restricted egress can route through Relay. An air-gapped network can't talk to LaunchDarkly at all and needs daemon-mode-with-pre-synced-data.

The egress posture per network is the input to the topology design — not a constraint to work around.

## H-3. Identity is federated, not duplicated

Members of the engineering organization authenticate through one IdP. LaunchDarkly access flows from that IdP via SAML/SCIM. The same engineer working on AWS workloads and on-prem workloads has one identity, not one per provider.

Per-provider local accounts in LaunchDarkly are an audit failure waiting to happen.

## H-4. Residency posture is per system, not per company

A team can have some workloads on EU-only data residency, others on US-residency, and others on Federal scoping. The team's LaunchDarkly account structure honors each — typically by project or environment boundary, sometimes by separate accounts entirely.

Mixing residency scopes inside a single environment is how the boundary gets fuzzy.

## H-5. Cross-cloud connectivity is a known liability

Inter-cloud network links — VPN tunnels, direct interconnects, SD-WAN, the public internet between clouds — are slower, less reliable, and more expensive than intra-cloud links. A Relay topology that crosses clouds on the critical path inherits all of that.

Design to keep the LD path local to the network where the application lives.

## H-6. The single point of failure is whatever you can't fail over from

A single Relay fleet shared across three clouds is fast operationally but is a single point of failure for every cloud. A Relay fleet per cloud is more operationally expensive but isolates the failure surfaces. Choose with the failure mode in mind.

For hybrid systems where one cloud failing is acceptable but all clouds failing is not, regional/per-cloud Relay is the answer.

## H-7. Air-gapped is a deliberate posture

If a workload genuinely has no outbound internet, the team has chosen that — usually for security, compliance, or industrial-control reasons. The LD pattern for air-gapped is well-defined: daemon-mode SDKs reading from a local store that's populated by a periodic, audited sync from the outside. Don't try to make a streaming SDK work; don't pretend the air gap doesn't exist.

## H-8. The local store is the source of truth in restricted environments

For air-gapped and restricted-egress deployments, the local persistent store (Redis, DynamoDB, etcd, a database — whatever the environment provides) is what the SDKs evaluate against. The contents of that store are an artifact of the team's release process: deliberately curated, audited, and version-controlled.

If the store gets corrupted, every application reading from it serves the wrong values. Treat it accordingly.

## H-9. The migration is the test

Cloud migrations are a stress test for the hybrid posture. If the LD topology survives a workload moving from AWS to GCP — applications keep evaluating flags, the audit log keeps recording changes, residency stays honored — the architecture is genuinely portable. If it doesn't, the team learns where the assumptions were buried.

Plan for migrations even if you're not currently in one. The hybrid architecture should pass the migration test on paper before the migration happens.

## H-10. The operating model is documented per environment

A single runbook can't cover every environment in a hybrid deployment. Each environment with materially different LD topology gets its own runbook: how the Relay is sized there, what the failure modes are, how identity flows, what's residency-scoped.

A team that uses one runbook for very different environments is a team whose on-call won't know what to do at 3 AM.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
