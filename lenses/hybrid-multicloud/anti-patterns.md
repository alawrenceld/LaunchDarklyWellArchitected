# Hybrid / Multi-Cloud / On-Prem — Anti-Patterns

A catalogue of common, named failure modes for hybrid, multi-cloud, and restricted-egress workloads.

---

## AP-1. The hub-and-spoke that became a hub-and-pain

**Shape:** The team's first Relay deployment lived in AWS. As GCP workloads came online, the team pointed those at the AWS Relay too — "we'll fix it later." Then Azure was added the same way. Now every flag evaluation in GCP and Azure crosses cloud boundaries to reach Relay, and the egress bill has become material.

**Why it's an anti-pattern:** centralized Relay topology was justified for the first cloud; it stopped being justified the moment a second cloud was added. Inertia preserved it.

**Symptom:** unexpected egress cost from GCP/Azure to AWS; tail latency on flag evaluations correlated with non-AWS workloads.

**Remedy:** deploy Relay per cloud (Pattern 1). The migration is mechanical and pays for itself in egress savings.

---

## AP-2. The corporate proxy that took down LD

**Shape:** The team's restricted-egress environment routes all traffic through a corporate proxy. The proxy is run by a different team. The proxy goes down for routine maintenance one night; nobody notified the LaunchDarkly-using team. The Relay can't reach LaunchDarkly; SDKs lose updates; users see stale flag values for hours.

**Why it's an anti-pattern:** the corporate proxy was a hidden dependency. The team's LD reliability claims didn't account for it.

**Symptom:** an LD outage in the restricted environment correlates with a proxy maintenance event nobody told the team about.

**Remedy:** treat the corporate proxy as a documented dependency. Monitor its availability from the team's side. Subscribe to its maintenance calendar. Document fallback behavior for the duration of a proxy outage.

---

## AP-3. The "let's use one IdP per cloud" identity tangle

**Shape:** Each cloud has its own engineering operating model. The AWS team uses Okta; the GCP team uses Google Workspace; the Azure team uses Entra. LaunchDarkly is configured with SSO to one of them. Engineers from the other clouds can't log in cleanly; they end up with local LaunchDarkly accounts. Audit logs show a mix of email addresses for the same humans. Offboarding is incomplete.

**Why it's an anti-pattern:** distributed identity is the source of most "this person left two years ago and still has access" incidents. Multi-cloud doesn't justify multi-identity.

**Symptom:** discrepancies between LD's member list and the canonical employee directory; local LaunchDarkly accounts for engineers who should be using SSO.

**Remedy:** federate. Pick a single corporate IdP. Configure SAML/SCIM. Migrate local accounts off as soon as feasible. Disable local-account creation.

---

## AP-4. The sync that hasn't run in three weeks

**Shape:** A restricted-egress environment runs daemon mode with a daily sync to refresh the flag dataset. The sync host had a disk-full issue. The cron job started failing silently. Three weeks later, an engineer notices the flag dataset is stale — and finds that several flag changes made in LaunchDarkly never reached production.

**Why it's an anti-pattern:** the sync is an unmonitored production system. Its failure is invisible because no human is in the loop until something downstream breaks.

**Symptom:** stale flag values in restricted environments; an actively-changed flag in LaunchDarkly continues to serve the old value to restricted-environment users.

**Remedy:** monitor the sync. Alert on sync failures, sync staleness (last successful sync timestamp), and sync result discrepancies. Treat it like any other production ETL.

---

## AP-5. The promoted-but-never-validated dataset

**Shape:** The team promotes a flag dataset to an air-gapped environment through their approved manual process. The export was malformed — a serialization bug truncated some flags. The import succeeded (the format was technically valid). Applications start serving fallback values for the missing flags. The team finds out from users.

**Why it's an anti-pattern:** the promotion process didn't validate. The export ↔ import ↔ in-use chain has no check that the dataset is intact.

**Symptom:** an air-gapped environment shows behavior consistent with missing flags, traceable to a recent promotion.

**Remedy:** after promotion, validate. Run a check that the imported dataset matches the export (hash check, record count, spot-check of critical flags). Failed checks block production exposure.

---

## AP-6. The kill switch that took 16 hours to land

**Shape:** A serious bug ships in the air-gapped environment. The team flips the kill switch in LaunchDarkly. The next sync happens at 03:00 UTC, 16 hours later. The kill switch reaches production at the next sync. Users are affected for the duration.

**Why it's an anti-pattern:** the routine sync cycle was the only emergency mechanism. No expedited path existed.

**Symptom:** an incident's mitigation time was bound by the sync cycle, not by the operational response.

**Remedy:** document and rehearse an emergency-promotion procedure for air-gapped environments. Optionally, maintain a parallel in-environment kill mechanism (config file, database row) for the ultra-fast cases. Don't conflate the routine and emergency mechanisms.

---

## AP-7. The residency violation by accident

**Shape:** The team has EU-residency workloads and US-residency workloads. They're in the same LaunchDarkly project, same environment. A US-based engineer makes a flag change targeting EU users; the change is recorded in US-hosted audit logs, propagated through US-hosted infrastructure. The auditor catches it.

**Why it's an anti-pattern:** residency was set at the org level, not the workload level. Mixed-residency data in a single environment violated the policy as soon as someone made a routine change.

**Symptom:** an audit finding that residency-scoped data flowed through non-residency-scoped infrastructure.

**Remedy:** separate residency scopes by project or environment (or, where regulations demand, separate LaunchDarkly accounts entirely). Document the boundary. Train engineers on which environments are residency-scoped.

---

## AP-8. The migration that broke the audit chain

**Shape:** The team is migrating a workload from on-prem to GCP. Mid-migration, the on-prem Relay's sync to LaunchDarkly is decommissioned "because the workload is moving." But part of the workload still runs on-prem for another two months. During those two months, audit events from on-prem don't reach LaunchDarkly's audit log. After the audit finds the gap, the team has to reconstruct two months of changes from local logs.

**Why it's an anti-pattern:** the team decommissioned a dependency before the workload it served was fully migrated.

**Symptom:** audit-log gap correlating with a migration window.

**Remedy:** during migrations, the old and new paths both stay live until the migration completes. Document the cutover criteria. Verify before decommissioning.

---

## AP-9. The unified runbook for very different environments

**Shape:** The team has one "LaunchDarkly Operations" runbook covering AWS, GCP, on-prem, and air-gapped environments. The runbook is generic enough to be useless: it describes monitoring at a high level but doesn't tell the on-call how to actually do anything in the air-gapped environment.

**Why it's an anti-pattern:** different environments need different runbooks. A unified runbook is unified ignorance.

**Symptom:** during an incident in the air-gapped environment, the on-call has the runbook open but can't find the air-gapped-specific procedures.

**Remedy:** per-environment runbooks. A short master document points to the right one based on the environment in scope.

---

## AP-10. The fleet that drifted

**Shape:** Each cloud has its own Relay fleet, deployed at different times by different sub-teams. AWS Relay is on version 8.4; GCP is on 8.0; Azure is on 7.6. Configuration drifts: different timeout settings, different log formats, different alert thresholds. Incident response varies wildly based on which environment is affected.

**Why it's an anti-pattern:** independent deployments don't stay synchronized without explicit alignment.

**Symptom:** divergent Relay behavior across environments; "it works in AWS but not in GCP" investigations that turn out to be configuration differences.

**Remedy:** manage Relay configuration via IaC. Roll updates uniformly across environments. Document the configuration delta when intentional.

---

## AP-11. The cross-cloud failover that didn't fail over

**Shape:** The team's documented multi-cloud disaster-recovery plan says "if AWS is unavailable, traffic fails over to GCP, including Relay traffic." The team has never tested it. AWS has a regional outage. The team triggers failover. GCP-side Relay capacity isn't sized for the doubled load; saturates immediately; flag evaluation degrades in GCP too. The "DR" plan made the outage wider.

**Why it's an anti-pattern:** failover capacity must be sized for the failover scenario, not for steady state. Untested DR isn't DR.

**Symptom:** during a real failover, the failover destination saturates.

**Remedy:** size DR capacity for the failover load (typically peak + the failed-over traffic). Drill the failover at least annually with realistic traffic.

---

## AP-12. The "we don't need this lens" assumption

**Shape:** A team operates two clouds. They use the standard LDWA pillar guidance everywhere. They assume the Hybrid lens is only for very-large or very-regulated organizations. The team's actual cross-cloud egress is significant, identity is uncentralized, residency posture is ambiguous, and runbooks are unified — but no one has questioned the setup.

**Why it's an anti-pattern:** the lens applies to *anyone with a multi-network deployment*, not just enterprise-scale organizations. Skipping it leaves common mistakes uncorrected.

**Symptom:** the team has a multi-cloud workload but has never specifically reviewed it as such.

**Remedy:** run a Hybrid-lens review. If the lens turns up nothing meaningful, great. If it turns up real findings, they were always there.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
