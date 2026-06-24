# Lens: Hybrid / Multi-Cloud / On-Prem

> *Where your workload runs shouldn't change how well you release.*

**Status: Phase 3 — draft scheduled, not yet written.**

This lens specializes LDWA for teams whose deployment footprint spans multiple cloud providers, hybrid (cloud + on-premises) environments, air-gapped systems, or restricted-egress networks. It is the lens that takes the cloud-neutral design of LDWA and grounds it in the operational realities of multi-target deployment.

## When this lens will apply

- Your workload runs across AWS, GCP, Azure, on-prem, or any combination.
- You operate in restricted-egress environments where outbound LaunchDarkly traffic must be controlled.
- You serve customers under regional residency obligations that span providers.
- You operate air-gapped or partially-air-gapped systems and need flags to work there.

## Phase 3 scope

The lens will cover Relay Proxy topologies for multi-provider deployment, air-gapped and restricted-egress patterns, federated identity across providers, residency split across regions and providers, the failure modes when one provider or site is unreachable, and the operational practice of running a coherent LDWA across very different infrastructures.

In the meantime, see [Reliability — Multi-region and failover](../../pillars/reliability/best-practices.md) and [Reliability — Relay Proxy deployment](../../pillars/reliability/best-practices.md).
