# Compliance Evidence Patterns

The goal of this page: when an auditor asks a question, the team produces evidence in minutes, not weeks. The evidence already exists, in queryable form, in systems that are running anyway.

This page describes the patterns for producing LaunchDarkly-related compliance evidence on demand.

---

## The principle: evidence is generated, not retrofitted

Compliance is what the team's running systems already produce. The audit log, the role configuration, the approval records, the integration history — these are the evidence. The team's job is to:

1. **Configure** the systems so they produce the right data continuously.
2. **Export** the data to a place where it can be queried.
3. **Build queries** that answer the questions auditors actually ask.

Once those are in place, an audit is a query, not a project.

---

## What auditors typically ask about LaunchDarkly

The questions vary by regime; the categories are consistent. Have an answer ready for each.

### Access

- "Who has production write access in <project>?"
- "Show me the access reviews for the last year."
- "Who approved the access grant for <member>?"
- "What is the off-boarding history for <list of departed employees>?"

### Change

- "Show me all production changes to <flag> in the last 90 days, with actor and rationale."
- "Show me changes to flags tagged `compliance:<regime>` that did not have approval."
- "Show me all bulk operations executed in the last quarter."
- "Show me changes made outside the certified change window."

### Approval

- "Show the approval record for <change>."
- "Show me changes that were approved by the same person who proposed them" (should be empty).
- "Show me approval throughput by week."

### Audit and retention

- "Confirm the audit log retention period and the destination of the archive."
- "Show me audit-log access by the security team in the last 90 days."

### Incident

- "Show me LD-related incidents in the last year."
- "Show me the post-mortem records for those incidents."

### Data handling

- "What context attributes does the workload pass to LaunchDarkly?"
- "Are any of those attributes considered PII / PHI / payment data?"
- "Where is the data hosted?"

---

## The evidence pipeline

A working compliance-evidence pipeline for LaunchDarkly has these components.

### 1. The audit log, streamed and retained

- LaunchDarkly's audit log is the source of truth for change evidence.
- Stream the audit log to your SIEM (Splunk, Datadog, Elastic) and to your long-retention archive (S3 / GCS / equivalent with retention lock).
- The retention period matches the longest applicable regulatory requirement (often 7 years).
- Access to the retained log is itself audited.

### 2. The access-state snapshot, captured periodically

- The role-and-member configuration is captured as a snapshot — daily or weekly — via the LaunchDarkly API.
- Snapshots are stored alongside the audit log.
- Diffs between snapshots produce the access-change history.

### 3. The artifact inventory, captured periodically

- The list of flags, segments, experiments, AI Configs, and pipelines is exported via the API regularly.
- Each artifact's tags (especially `compliance:<regime>`) are included.
- The inventory supports questions like "show me all flags tagged for PCI scope."

### 4. The approval record, captured at source

- Required approvals (Guardian Edition) live in the audit log automatically.
- For approvals captured in external systems (e.g., a CAB ticketing system), the linkage between the LaunchDarkly change and the external ticket is recorded in the change description.

### 5. The integration with the broader compliance system

- The evidence pipeline feeds your GRC tool (Drata, Vanta, OneTrust, ServiceNow GRC, or equivalent) or your manual compliance evidence library.
- The auditor's queries are pre-built in the GRC tool or as ad-hoc queries against the SIEM / archive.

---

## Pattern: tagging for compliance scope

The simplest, most valuable practice: tag every artifact with the compliance regime that applies to it.

| Tag | Meaning |
|---|---|
| `compliance:soc2` | Artifact contributes to SOC2 controls |
| `compliance:hipaa` | Artifact touches PHI or HIPAA-scoped workflows |
| `compliance:pci` | Artifact touches PCI-scoped workflows |
| `compliance:fedramp` | Federal-scoped (run on LaunchDarkly Federal, not commercial) |
| `compliance:eu-ai-act` | Subject to the EU AI Act |
| `compliance:gdpr-special` | Touches GDPR special-category data |
| `regulated:true` | Generic "this is regulated, treat it carefully" |

Tagging lets you filter the audit log, the artifact inventory, and the approval records to the compliance scope at hand. "Show me all production changes to PCI-tagged flags in the last 90 days" becomes a one-query operation.

---

## Pattern: the quarterly evidence pack

For regimes with quarterly or annual evidence requirements, build a recurring evidence pack — a set of pre-built reports that runs automatically and produces the auditor-ready output.

A typical pack:

1. **Access state.** Current role/member configuration, plus diff vs. last quarter.
2. **Access reviews.** The records of the access reviews conducted this quarter.
3. **Production change history.** Filtered to flags tagged with the compliance regime in scope.
4. **Approval coverage.** Percentage of in-scope production changes that had approval; the list of any without approval (should be empty or fully justified).
5. **Incident summary.** LD-related incidents this quarter, with the post-mortem and remediation status.
6. **Health metrics.** Stale-flag percentage, ownership coverage, time-to-archive, all for the in-scope set.
7. **Integration inventory.** Active integrations, their owners, their last-reviewed date.

The pack is generated automatically. The team reviews it before the audit. The auditor receives it.

---

## Pattern: pre-built queries

A small set of queries that every auditor asks. Build them once; run them as needed.

### "Who has production write access?"

A query against the role-and-member snapshot, filtered to roles that include write permissions on production environments.

### "Show me all production changes to flag X in the last 90 days."

A SIEM query against the audit log, filtered to `audit_action == 'updateFlag'` AND `resource == 'flag-x'` AND `environment == 'production'` AND `timestamp > now-90d`.

### "Show me changes made outside the certified change window."

A SIEM query that joins audit-log timestamps against the change-window calendar.

### "Show me self-approved changes."

A SIEM query against the audit log where the approval-actor equals the change-actor. Should be empty.

### "Show me bulk operations."

A SIEM query against the audit log filtered to bulk-operation event types.

### "Show me artifacts without an owner."

A query against the artifact inventory where the owner field is empty or references a non-existent member.

### "Show me PII-bearing context attributes."

A query against the application code (via Code References) for context attributes that should not appear, cross-referenced with the application's data-handling documentation.

---

## Mapping common regimes to LDWA controls

The table below maps the most common regimes to the LDWA controls that satisfy them. It is illustrative, not exhaustive — each customer's specific control mappings depend on their auditor and their broader system.

| Regime | Primary LDWA control |
|---|---|
| **SOC2 — Change Management (CC8.1)** | Required approvals (Guardian); audit log retention; release pipelines |
| **SOC2 — Logical Access (CC6.1)** | SSO; custom roles; access reviews; *No access* restricted role |
| **SOC2 — System Operations (CC7.x)** | Operational Excellence pillar; on-call; runbooks; incident review |
| **HIPAA — Access Control (164.312(a))** | SSO; custom roles; audit-log retention 6+ years |
| **HIPAA — Audit Controls (164.312(b))** | Audit log; SIEM streaming; review cadence |
| **PCI-DSS — Track and Monitor (Req. 10)** | Audit log retention 1+ year (online), 3+ years (archive) |
| **PCI-DSS — Restrict Access (Req. 7)** | Custom roles; least privilege; role review |
| **FedRAMP — AC family** | Federal offering; custom roles; access reviews monthly |
| **FedRAMP — AU family** | Audit log retention 3+ years; SIEM streaming; review |
| **FedRAMP — CM family** | Required approvals; release pipelines; change windows |
| **ISO 27001 — A.5/A.6 controls** | Documented change-management policy; access reviews |
| **EU AI Act — high-risk system requirements** | AI Config artifact inventory; change history; rationale capture |
| **DORA — ICT change management** | Required approvals; release pipelines; incident reporting integration |

For your specific compliance posture, work with your audit team to develop the precise mapping.

---

## A note on tooling

This page describes patterns, not products. The right tooling depends on your existing GRC stack:

- **For startups and early enterprises:** Drata, Vanta, Secureframe, or comparable can ingest LaunchDarkly audit-log data via APIs and produce auditor-ready exports.
- **For larger enterprises:** ServiceNow GRC, OneTrust, OpenPages, or comparable, with LaunchDarkly data fed in via your SIEM.
- **For Federal-scoped workloads:** Federal-authorized GRC tooling; LaunchDarkly Federal data stays inside the Federal boundary.

Whatever the tooling, the LDWA principle holds: evidence is continuous, queryable, and tied to artifacts (not retrofitted to documents).

---

← [LaunchDarkly Federal](./federal.md) | Continue to → [Review Questions](./review-questions.md)
