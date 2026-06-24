# Operational Excellence — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Ownership and on-call

### OE-Q1. Who owns the LaunchDarkly account, and who owns each project?
- **High Risk** if no one can name the owner, or the named owner has left the company.
- **Medium Risk** if ownership exists but is informal.
- **None** if owners are documented and current.

### OE-Q2. Does the on-call rotation include LD-related items in its handoff?
- **High Risk** if on-call handoff doesn't surface in-flight LD changes.
- **Medium Risk** if some changes are surfaced but not consistently.
- **None** if handoff has a defined LD section.

### OE-Q3. When an engineer leaves the team, is their LD access reliably revoked?
- **High Risk** if the offboarding checklist doesn't include LD.
- **Medium Risk** if it does but is sometimes skipped.
- **None** if revocation is automated or rigorously checklisted.

---

## Artifact lifecycle

### OE-Q4. Does every artifact (flag, segment, experiment, AI Config) have a documented owner?
- **High Risk** if a meaningful fraction of artifacts are orphans.
- **Medium Risk** if ownership exists but isn't enforced for new artifacts.
- **None** if ownership is required at creation and reviewed periodically.

### OE-Q5. Are temporary flags consistently marked as such, and tracked for retirement?
- **High Risk** if temporary/permanent designation is not used.
- **Medium Risk** if used inconsistently.
- **None** if used at creation and surfaced in operational dashboards.

### OE-Q6. Do experiments have decision deadlines?
- **High Risk** if experiments run indefinitely with no decision date.
- **Medium Risk** if deadlines exist informally but aren't enforced.
- **None** if every experiment has a deadline and an owner accountable for the decision.

---

## Observability of LD changes

### OE-Q7. Can the team see, in their day-to-day chat, the LD changes happening in production?
- **High Risk** if no chat notifications exist for production LD changes.
- **Medium Risk** if notifications exist but are too noisy or scoped wrongly.
- **None** if a filtered, scoped channel surfaces meaningful changes.

### OE-Q8. Are LD events visible in your APM / observability stack?
- **High Risk** if LD events are not represented anywhere alongside service metrics.
- **Medium Risk** if they are but only via manual annotation.
- **None** if LD events flow automatically into your APM as deploy markers or annotations.

### OE-Q9. Does the team have a "flags in motion" dashboard?
- **High Risk** if visibility into in-flight rollouts requires a chat-history search or LD UI exploration.
- **Medium Risk** if a dashboard exists but is partial or stale.
- **None** if a current dashboard is maintained and referenced.

### OE-Q10. Are sensitive LD changes (e.g., production permission changes) alerted on?
- **High Risk** if no alerts exist for high-impact changes.
- **Medium Risk** if alerts exist but are noisy or poorly routed.
- **None** if alerts are scoped, reviewed, and acted on.

---

## Using LD Observability to close the release loop

### OE-Q11. Is LaunchDarkly's Observability surface (Session Replay / Errors / Logs) wired to the product surfaces flags target?
- **High Risk** if Session Replay/Errors/Logs are deployed but not actively connected to the release feedback loop.
- **Medium Risk** if observability exists but the team rarely uses it post-release.
- **None** if every meaningful release includes a post-release look at Errors and (where appropriate) Session Replay.

### OE-Q12. Is Errors used as a guardrail signal where appropriate?
- **High Risk** if customer-facing error volume is not part of any release safety net.
- **Medium Risk** if it is, but only for some surfaces.
- **None** if Errors is a first-class guardrail for customer-facing rollouts.

### OE-Q13. Does the team have a post-release review ritual?
- **High Risk** if releases ship and the team rarely revisits them.
- **Medium Risk** if reviews happen ad hoc.
- **None** if a post-release review (using LD Observability) is part of the standard release cadence.

---

## Runbooks and incident response

### OE-Q14. Do incident-response runbooks name the relevant flags and kill switches?
- **High Risk** if runbooks describe a system without naming the flag that disables it.
- **Medium Risk** if some do and some don't.
- **None** if every runbook for a flag-gated surface names the kill switch and links to it.

### OE-Q15. Is there a runbook for "LD-related incident"?
- **High Risk** if no such runbook exists.
- **Medium Risk** if one exists but has not been updated or tested recently.
- **None** if a current runbook exists and has been exercised.

### OE-Q16. Are LD-touching incidents addressed in post-mortems?
- **High Risk** if LD-related incidents are not analyzed.
- **Medium Risk** if they are, but lessons rarely translate into action items.
- **None** if LD-related events drive concrete operational improvements.

---

## CI/CD integration

### OE-Q17. Are foundational LD resources managed with IaC (Terraform, etc.) where it adds value?
- **High Risk** if no IaC exists and drift between environments is common.
- **Medium Risk** if IaC exists but is partial or out of date.
- **None** if foundational resources are IaC-managed and drift is monitored.

### OE-Q18. Are flag keys referenced from code via constants/types, not magic strings?
- **High Risk** if flag keys are scattered as string literals throughout the codebase.
- **Medium Risk** if a constants file exists but isn't enforced.
- **None** if typed flag access is the norm.

### OE-Q19. Does CI include flag-related checks (archived-flag references, missing-flag warnings, "this PR adds a flag" surfacing)?
- **High Risk** if no automated checks exist.
- **Medium Risk** if some checks exist but are not enforced.
- **None** if checks are enforced and tuned.

### OE-Q20. Are webhooks used to integrate flag events with downstream systems?
- **High Risk** if no integrations exist and the team works around it manually.
- **Medium Risk** if integrations exist but are partial.
- **None** if the integration surface is set up deliberately and maintained.

---

## Capacity and scale planning

### OE-Q21. Do you know your event volume and where the bottlenecks would be at 2× traffic?
- **High Risk** if no one can answer this.
- **Medium Risk** if a partial mental model exists.
- **None** if the team has a documented capacity model that's updated when systems change.

### OE-Q22. Is the Relay Proxy fleet sized per LaunchDarkly's recommended floor (3 instances, 2 AZs, per region) or above?
- **High Risk** if Relay is run as a single instance or in a single AZ.
- **Medium Risk** if it meets the floor but has not been sized up for actual load.
- **None** if sizing is deliberate, monitored, and re-evaluated for major launches.

### OE-Q23. Do you run launch-readiness reviews for major releases?
- **High Risk** if major launches go live without a capacity / readiness conversation.
- **Medium Risk** if reviews happen but are informal.
- **None** if a documented review precedes every major launch.

### OE-Q24. Are MAU/MCI trends monitored on the same cadence as other usage metrics?
- **High Risk** if MAU/MCI is a surprise at renewal.
- **Medium Risk** if trends exist but aren't reviewed.
- **None** if trends are reviewed monthly and projections inform planning.

---

## Data Export and downstream integrations

### OE-Q25. Is Data Export configured to stream events to your data warehouse?
- **High Risk** if no export exists and the team cannot answer cross-cutting questions about LD usage.
- **Medium Risk** if export exists but is partial.
- **None** if export is comprehensive, monitored, and used.

### OE-Q26. Are exports monitored (lag, failure rate, schema drift)?
- **High Risk** if exports are silently broken.
- **Medium Risk** if monitoring exists but alerting is weak.
- **None** if exports are monitored like any other production pipeline.

---

## Audit log operations

### OE-Q27. Is the audit log streamed to your SIEM or equivalent?
- **High Risk** if the audit log lives only in LaunchDarkly and is not queryable alongside other logs.
- **Medium Risk** if it is streamed but not actively consumed.
- **None** if security and compliance teams query it routinely.

### OE-Q28. Is the audit log reviewed on a cadence?
- **High Risk** if no one reviews it.
- **Medium Risk** if reviews happen reactively after incidents.
- **None** if a scheduled review exists and produces action items.

### OE-Q29. Do sensitive audit-log events (permission changes, token creation, production-environment changes) page?
- **High Risk** if these events don't surface anywhere in real time.
- **Medium Risk** if they surface but only in logs.
- **None** if they page or open tracked tickets.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
