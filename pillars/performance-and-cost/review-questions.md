# Performance & Cost Efficiency — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Evaluation latency

### PC-Q1. Does each customer-facing surface have an explicit flag-evaluation latency budget?
- **High Risk** if no budgets exist and flag-eval latency is "whatever it is."
- **Medium Risk** if budgets exist informally.
- **None** if every meaningful surface has a documented budget and measurement against it.

### PC-Q2. Is the SDK kept off the critical path of cold start?
- **High Risk** if app startup waits on a successful SDK initialization.
- **Medium Risk** if startup waits but with a short timeout.
- **None** if startup proceeds with bootstrap or fallback values and SDK init happens in the background.

### PC-Q3. Is flag-evaluation latency measured end-to-end (application call → evaluation → return)?
- **High Risk** if no measurement exists.
- **Medium Risk** if SDK-internal metrics exist but application-side latency isn't captured.
- **None** if end-to-end measurement is in place and reviewed.

### PC-Q4. Are expensive contexts constructed once and reused?
- **High Risk** if context construction is in the hot path of every evaluation.
- **Medium Risk** if reuse is partial.
- **None** if context reuse is the default.

---

## SDK and topology choice

### PC-Q5. Is the SDK family matched to runtime and latency budget?
- **High Risk** if a server-side SDK is used in serverless without daemon mode (cold-start failures).
- **Medium Risk** if SDK choice is workable but suboptimal.
- **None** if SDK choice deliberately matches runtime.

### PC-Q6. If Relay is deployed, is there a documented reason that pays for the operational cost?
- **High Risk** if Relay is deployed without a clear need.
- **Medium Risk** if the reason is implicit.
- **None** if the reason is explicit and current.

### PC-Q7. For latency-critical paths, is edge SDK / edge evaluation in use where appropriate?
- **High Risk** if edge evaluation would help materially and isn't being used.
- **Medium Risk** if edge is in use but inconsistently.
- **None** if edge is deployed where it matters.

### PC-Q8. For serverless workloads, is daemon mode used?
- **High Risk** if streaming SDKs are used in serverless and fail cold-start.
- **Medium Risk** if migration is in progress.
- **None** if daemon mode is the default for serverless.

---

## Relay Proxy sizing

### PC-Q9. Is Relay sized for peak load with documented headroom?
- **High Risk** if Relay saturates at peak.
- **Medium Risk** if sizing is informal or based on average load.
- **None** if peak sizing is explicit and reviewed.

### PC-Q10. Are Relay saturation indicators monitored with leading-indicator alerts?
- **High Risk** if no saturation monitoring exists.
- **Medium Risk** if monitoring exists but alerts fire only at saturation, not before.
- **None** if leading-indicator alerts fire ahead of saturation.

### PC-Q11. For multi-region workloads, is Relay topology regional?
- **High Risk** if applications cross regions to reach a centralized Relay fleet.
- **Medium Risk** if regional topology is partial.
- **None** if regional Relay is the default for multi-region.

### PC-Q12. Are major launches preceded by a launch-readiness review covering Relay capacity?
- **High Risk** if launches go live without a capacity check.
- **Medium Risk** if checks are informal.
- **None** if launch-readiness reviews are routine.

---

## Event volume and ingestion

### PC-Q13. Does the team know its event-per-active-user rate?
- **High Risk** if no one can answer.
- **Medium Risk** if a rough estimate exists.
- **None** if the rate is trended monthly.

### PC-Q14. Is SDK event buffering / flush configured for the workload?
- **High Risk** if defaults produce excess cost or loss.
- **Medium Risk** if defaults are used unreviewed.
- **None** if configuration is deliberate.

### PC-Q15. Are high-volume custom events sampled?
- **High Risk** if all events are emitted uniformly at scale, causing unnecessary cost.
- **Medium Risk** if sampling exists but is inconsistent.
- **None** if sampling is applied where appropriate and documented.

### PC-Q16. Are events scoped to surfaces where decisions are made?
- **High Risk** if "instrument everything" is the team's pattern.
- **Medium Risk** if scoping is partial.
- **None** if event instrumentation matches decision needs.

### PC-Q17. Are ingestion-rate trends monitored?
- **High Risk** if no trending exists; cost growth is invisible.
- **Medium Risk** if trending exists but isn't reviewed.
- **None** if monthly trending is reviewed and anomalies investigated.

---

## MAU / MCI

### PC-Q18. Is MAU/MCI tracked monthly on a shared dashboard?
- **High Risk** if MAU/MCI is invisible to engineering or finance.
- **Medium Risk** if visibility is partial.
- **None** if a shared dashboard is maintained and reviewed.

### PC-Q19. Is MAU/MCI forecast at least quarterly?
- **High Risk** if no forecast exists.
- **Medium Risk** if forecasts exist but aren't compared to contract.
- **None** if forecasts inform contract planning.

### PC-Q20. Does the team understand how multi-context affects MCI?
- **High Risk** if multi-context was adopted without modeling MCI growth.
- **Medium Risk** if understanding is partial.
- **None** if MCI implications are part of multi-context decisions.

### PC-Q21. Is MAU growth treated as part of the operating cost trajectory?
- **High Risk** if MAU growth is a renewal surprise.
- **Medium Risk** if visibility exists but isn't planned for.
- **None** if MAU is budgeted alongside other infrastructure costs.

---

## AI Config token and cost

> Skip if AI Configs are not in scope.

### PC-Q22. Is cost-per-request tracked per AI Config and per variation?
- **High Risk** if cost is only discovered via invoice.
- **Medium Risk** if tracked but not on operational dashboards.
- **None** if cost is a first-class metric.

### PC-Q23. Is cost-per-request used as a guardrail on AI rollouts?
- **High Risk** if cost regressions can ship to 100% without intervention.
- **Medium Risk** if cost is monitored but not gated.
- **None** if cost guardrails are configured on every meaningful AI rollout.

### PC-Q24. Is there a per-feature AI cost dashboard?
- **High Risk** if cost cannot be attributed to AI features.
- **Medium Risk** if attribution is partial.
- **None** if every AI feature has current cost attribution.

### PC-Q25. Are LLM provider invoices reconciled against internal metrics?
- **High Risk** if invoices are surprises.
- **Medium Risk** if reconciliation happens only quarterly.
- **None** if monthly reconciliation is the practice.

### PC-Q26. Is caching used where the AI use case allows?
- **High Risk** if cacheable workloads are not cached and pay full cost.
- **Medium Risk** if caching is partial.
- **None** if caching is applied wherever the use case supports it.

---

## Observability ingestion

### PC-Q27. Is session-replay sample rate set deliberately, matched to use cases?
- **High Risk** if 100% session capture is the default and producing unnecessary cost.
- **Medium Risk** if rates are set but not reviewed.
- **None** if rates are matched to use cases.

### PC-Q28. Is error reporting scoped to surfaces where it's actionable?
- **High Risk** if all errors are captured uniformly with high cost.
- **Medium Risk** if scoping is partial.
- **None** if error capture is differentiated by surface.

### PC-Q29. Are log retention windows set by category (compliance / operational / debug)?
- **High Risk** if uniform long retention is applied with high cost.
- **Medium Risk** if retention is informal.
- **None** if retention is policy-driven.

### PC-Q30. Is observability cost budgeted and reviewed?
- **High Risk** if observability cost is a surprise.
- **Medium Risk** if visibility exists but isn't planned.
- **None** if observability is part of the operating budget.

---

## Context cardinality and payload

### PC-Q31. Can the team name a targeting rule that uses each context attribute?
- **High Risk** if many attributes are passed that no rule uses.
- **Medium Risk** if some dead attributes exist.
- **None** if every attribute is justified by use.

### PC-Q32. Does the team distinguish high-cardinality from low-cardinality attributes?
- **High Risk** if the distinction isn't understood and high-cardinality attributes inflate MCI unexpectedly.
- **Medium Risk** if the distinction is informal.
- **None** if cardinality is deliberately managed.

### PC-Q33. Is payload size on mobile and client SDKs minimized?
- **High Risk** if mobile payload includes unnecessary attributes affecting data use and battery.
- **Medium Risk** if minimization is informal.
- **None** if mobile payloads are kept tight.

### PC-Q34. Is multi-context adoption a deliberate decision with MCI implications considered?
- **High Risk** if multi-context was adopted casually with surprising MCI growth.
- **Medium Risk** if the decision was informal.
- **None** if the decision was modeled.

---

## Sampling and aggregation

### PC-Q35. Are sampling rates documented per metric?
- **High Risk** if sampling exists but isn't documented; downstream decisions use uncorrected estimates.
- **Medium Risk** if documentation is partial.
- **None** if every sampled metric has its rate documented.

### PC-Q36. Is experiment power validated against sampled metrics?
- **High Risk** if experiments routinely produce inconclusive results due to under-sampled metrics.
- **Medium Risk** if the issue is acknowledged but not addressed.
- **None** if sample sizes account for sampling rates.

---

## Sprawl

### PC-Q37. Are projects, environments, and segments audited quarterly?
- **High Risk** if no audit cadence exists.
- **Medium Risk** if audits are reactive.
- **None** if quarterly audits produce concrete archival.

### PC-Q38. Are integrations that don't serve a current purpose retired?
- **High Risk** if dead integrations accumulate.
- **Medium Risk** if retirement happens but late.
- **None** if integration review is part of the quarterly cadence.

---

## Data Export and downstream

### PC-Q39. Is Data Export volume scoped to what downstream consumers use?
- **High Risk** if exports include events nobody queries.
- **Medium Risk** if scoping is partial.
- **None** if export volume matches downstream demand.

### PC-Q40. Is the downstream pipeline cost monitored?
- **High Risk** if downstream cost (warehouse compute on LD-derived tables) is invisible.
- **Medium Risk** if monitoring exists but isn't reviewed.
- **None** if downstream cost is part of the operating budget.

### PC-Q41. Are schema changes coordinated with downstream consumers?
- **High Risk** if schema changes silently break downstream pipelines.
- **Medium Risk** if coordination is informal.
- **None** if schema changes follow a notify-and-verify process.

---

## Observability of the operating layer

### PC-Q42. Does the team have a shared cost dashboard reviewed monthly?
- **High Risk** if cost is invisible to engineering and finance both.
- **Medium Risk** if a dashboard exists but isn't reviewed.
- **None** if the dashboard is current and reviewed.

### PC-Q43. Are alerts configured for usage anomalies?
- **High Risk** if large usage anomalies surface only at quarterly review.
- **Medium Risk** if alerts exist but tuning is imperfect.
- **None** if alerts catch anomalies in days, not months.

### PC-Q44. Are performance regressions treated as correctness bugs?
- **High Risk** if latency regressions are accepted as "the new normal."
- **Medium Risk** if some regressions are addressed but inconsistently.
- **None** if regressions are triaged and fixed like any other bug.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
