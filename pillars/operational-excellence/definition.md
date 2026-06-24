# Operational Excellence — Definition

This pillar is organized into the following focus areas. Best practices and review questions are grouped under these.

---

## 1. Ownership and on-call

Who owns the LaunchDarkly account and the components around it. Covers identifying owners for the account, projects, environments, the Relay Proxy fleet, integrations, and the LD-related on-call rotation. Includes onboarding/offboarding paths and the handoff between teams.

## 2. Artifact lifecycle

The day-to-day operation of LD artifacts — flags, segments, experiments, AI Configs, pipelines. Covers the standard lifecycle (create → roll out → measure → clean up) and the operational discipline around each step. Detailed cleanup discipline lives in the Governance pillar; this focus area covers the operational rhythm.

## 3. Observability of LD changes

The mechanisms by which the team sees what's happening in LaunchDarkly. Covers Slack/Teams notifications, webhook integrations, audit-log streaming, dashboard surfaces, and the integration with APM tools (Datadog, New Relic, Splunk, Honeycomb, etc.).

## 4. Using LD Observability to close the release loop

How Session Replay, Errors, and Logs (the observability surface added through Highlight) get used to validate releases. Covers the workflow of "ship → observe → decide" and the integration between an LD release and the corresponding observability data.

## 5. Runbooks and incident response

How the team responds when something goes wrong in or near the LaunchDarkly layer. Covers runbook structure, kill-switch documentation, escalation paths, the LD-specific portions of the incident-response playbook, and post-incident review for LD-related events.

## 6. CI/CD integration

How LaunchDarkly is integrated with the team's delivery pipeline. Covers webhook integrations, the use of Terraform or other IaC for LD resources, automated checks (flag-key references in code, archival enforcement), and the relationship between deploys and flag changes.

## 7. Capacity and scale planning

How the team plans for and operates at scale. Covers event volume, SDK fleet patterns, Relay Proxy sizing and topology, ingestion budgets, MAU/MCI projections, and the rituals for reviewing capacity before launches.

## 8. Data Export and downstream integrations

How LaunchDarkly data flows to external systems — data warehouse, BI tools, observability platforms. Covers the operational surface of those integrations, monitoring them, and using exported data for analysis the LD UI doesn't surface.

## 9. Audit log operations

How the team uses the [LaunchDarkly audit log](https://launchdarkly.com/docs/home/account/manage-members) operationally. Covers streaming to a SIEM, periodic review, alerting on sensitive changes, and the operational integration with compliance workflows.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
