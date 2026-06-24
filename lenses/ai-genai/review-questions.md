# AI / GenAI — Review Questions

These questions are **additions** to the standard pillar review questions for AI workloads. Run the standard pillar reviews first; then walk these.

For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items.

---

## Scope and ownership

### AI-Q1. Does the team have a current inventory of every AI Config in production, with owners and providers?
- **High Risk** if the team can't enumerate its AI Configs or doesn't know who owns each one.
- **Medium Risk** if an inventory exists but is incomplete or stale.
- **None** if the inventory is current, tagged, and queryable (via tags and the LD API).

### AI-Q2. Is each AI Config tagged with provider, mode, owning team, surface, and criticality?
- **High Risk** if AI Configs are untagged or tagged inconsistently.
- **Medium Risk** if some tags are present but coverage is partial.
- **None** if the standard tag set is applied to every AI Config.

### AI-Q3. Has the team identified which AI features are business-critical vs. nice-to-have?
- **High Risk** if criticality has not been classified and all features get the same operational posture.
- **Medium Risk** if classification exists informally.
- **None** if criticality is documented per AI Config and drives differentiated operational controls.

---

## Releases and rollouts

### AI-Q4. Are model swaps, prompt changes, and provider changes rolled out progressively?
- **High Risk** if AI Config changes go to 100% of users in a single edit.
- **Medium Risk** if progressive exposure happens but inconsistently.
- **None** if every meaningful AI Config change follows the team's progressive-rollout pattern.

### AI-Q5. Do AI rollouts use cost, latency, and a quality proxy as guardrails?
- **High Risk** if no live guardrails are attached to AI rollouts.
- **Medium Risk** if some guardrails exist (e.g., only latency) but not the full set.
- **None** if cost, latency, and a deliberately-chosen quality proxy are attached to every meaningful rollout.

### AI-Q6. Are AI rollout guardrails calibrated — neither too tight nor too loose?
- **High Risk** if guardrails are placeholders or set to defaults that don't catch real regressions.
- **Medium Risk** if calibration is uncertain.
- **None** if thresholds have been tuned based on production experience and are reviewed periodically.

### AI-Q7. Is there a kill switch for the entire AI feature (separate from variation switching)?
- **High Risk** if no kill switch exists for major AI features.
- **Medium Risk** if a kill switch exists but hasn't been drilled.
- **None** if the kill switch exists, is documented in the runbook, and is drilled quarterly.

---

## Evaluation discipline

### AI-Q8. Is there an eval pipeline that runs before promotion to production?
- **High Risk** if no eval pipeline exists and changes are promoted on judgment alone.
- **Medium Risk** if an eval pipeline exists but is run inconsistently.
- **None** if every variation change runs through the pipeline before promotion.

### AI-Q9. Does the golden dataset include edge cases discovered in production?
- **High Risk** if the dataset is curated once and never updated.
- **Medium Risk** if updates happen reactively but not systematically.
- **None** if production observations feed the eval set on a regular cadence.

### AI-Q10. Do graders cover quality, cost, and latency — not just quality?
- **High Risk** if evals only measure quality and cost/latency regressions are caught post-launch.
- **Medium Risk** if cost/latency are tracked but not gated.
- **None** if all three dimensions are part of the eval gate.

### AI-Q11. Is there a continuous in-production evaluation mechanism (sampling, LLM-as-judge, periodic re-eval)?
- **High Risk** if no post-launch evaluation happens; drift is undetected.
- **Medium Risk** if some monitoring exists but isn't systematic.
- **None** if continuous evaluation is scheduled and produces actionable signals.

---

## Fallback and resilience

### AI-Q12. Does every AI Config have a defined fallback variation or SDK fallback?
- **High Risk** if AI calls fail with no defined fallback and users see errors.
- **Medium Risk** if fallbacks exist but are inconsistent or untested.
- **None** if every AI Config has a tested fallback path.

### AI-Q13. Is the fallback exercised by tests and by drills?
- **High Risk** if the fallback has never been exercised in production.
- **Medium Risk** if it's been tested in CI but never in production.
- **None** if quarterly drills exercise the fallback and confirm the user experience.

### AI-Q14. Are provider timeouts set inside the user-experience latency budget?
- **High Risk** if timeouts are at defaults or so long that users experience indefinite waits.
- **Medium Risk** if timeouts are reasonable but not aligned to a documented budget.
- **None** if the latency budget is explicit and timeouts are set inside it.

### AI-Q15. For business-critical AI features, is multi-provider resilience configured?
- **High Risk** if a critical feature depends on a single provider with no fallback provider.
- **Medium Risk** if multi-provider is planned but not implemented.
- **None** if multi-provider variations are configured and exercised in drills.

---

## Cost discipline

### AI-Q16. Is cost-per-request tracked as a first-class metric per AI Config?
- **High Risk** if cost is not measured at the request level and is only discovered via the invoice.
- **Medium Risk** if cost is tracked but not visible on rollout dashboards.
- **None** if cost-per-request is a first-class metric.

### AI-Q17. Is there a per-feature cost dashboard?
- **High Risk** if cost cannot be attributed to features or surfaces.
- **Medium Risk** if attribution exists but is partial.
- **None** if every AI feature has a current cost attribution.

### AI-Q18. Are token budgets enforced at the rollout level?
- **High Risk** if a 3× cost variation can go to 100% without an explicit decision.
- **Medium Risk** if cost increases are noticed but not gated.
- **None** if cost regressions roll back the rollout.

### AI-Q19. Are LLM provider invoices reconciled against internal cost metrics?
- **High Risk** if invoices arrive as surprises.
- **Medium Risk** if reconciliation happens but only quarterly.
- **None** if reconciliation is monthly and discrepancies are investigated.

---

## Security and content safety

### AI-Q20. Are LLM provider credentials managed in a secret manager with rotation and scoping?
- **High Risk** if provider keys are in code, config, or chat history.
- **Medium Risk** if storage is in env vars but rotation is ad hoc.
- **None** if provider keys are in a secret manager, scoped, and rotated.

### AI-Q21. Are prompts reviewed for prompt-injection risk before promotion?
- **High Risk** if prompt changes ship without security review.
- **Medium Risk** if review happens but isn't specifically for injection.
- **None** if prompt review is a required step.

### AI-Q22. Is content moderation applied where the product context requires it?
- **High Risk** if no moderation exists for user-facing AI output in regulated or sensitive contexts.
- **Medium Risk** if moderation exists but coverage is partial.
- **None** if moderation is wired into the evaluation path.

### AI-Q23. Is the model output's security treated as application output (not "model behavior")?
- **High Risk** if the team treats LLM output as inherently safe and doesn't validate downstream consumption.
- **Medium Risk** if some validation exists.
- **None** if LLM output passes through the same validation, escaping, and filtering as other user-affecting output.

---

## Governance and lifecycle

### AI-Q24. Are AI Config variations versioned explicitly?
- **High Risk** if variation versioning is implicit or absent.
- **Medium Risk** if versioning is informal.
- **None** if variations carry explicit version identifiers referenced in rollouts and rollbacks.

### AI-Q25. Are obsolete AI Config variations retired?
- **High Risk** if dead variations accumulate in active configs.
- **Medium Risk** if retirement happens late.
- **None** if retirement is part of the migration workflow.

### AI-Q26. Are provider deprecation cycles tracked?
- **High Risk** if deprecation surprises the team.
- **Medium Risk** if tracking exists but migrations are reactive.
- **None** if deprecations are tracked and migrations planned in advance.

---

## Regulatory and compliance

### AI-Q27. If the feature is subject to the EU AI Act, model-risk-management requirements, or sector-specific AI regulation, are the controls in place?
- **High Risk** if regulatory scope is unclear or controls are missing.
- **Medium Risk** if scope is identified but controls are partial.
- **None** if regulatory scope is documented, controls are in place, and evidence is collected continuously.

### AI-Q28. Is the AI Config artifact inventory and change history positioned for regulatory evidence collection?
- **High Risk** if evidence requires reconstruction.
- **Medium Risk** if some evidence is queryable.
- **None** if pre-built queries produce the evidence regulators want.

---

← [Evaluation and Measurement](./evaluation-and-measurement.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
