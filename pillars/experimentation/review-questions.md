# Experimentation & Measurement — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Hypothesis design

### E-Q1. For the last five meaningful releases, was a hypothesis stated before the change shipped?
- **High Risk** if hypotheses are absent or post-hoc.
- **Medium Risk** if some changes have hypotheses but practice is inconsistent.
- **None** if every meaningful change has a recorded pre-ship hypothesis.

### E-Q2. Do hypotheses state expected direction and magnitude?
- **High Risk** if hypotheses are vague ("we expect this to be better").
- **Medium Risk** if direction is stated but magnitude is not.
- **None** if direction and magnitude are pre-committed.

### E-Q3. Do hypotheses note what would change the team's mind?
- **High Risk** if no falsification criteria exist.
- **Medium Risk** if criteria are implicit.
- **None** if pre-committed stop-and-ship conditions are documented.

---

## Metric design

### E-Q4. Does each experiment have a single, designated primary metric?
- **High Risk** if experiments have multiple competing primary metrics.
- **Medium Risk** if the primary is named but the team weights secondaries as if they were primary.
- **None** if a single primary is committed to.

### E-Q5. Does each experiment include guardrail metrics that must not regress?
- **High Risk** if no guardrails are configured.
- **Medium Risk** if guardrails exist but are not deliberately chosen.
- **None** if guardrails reflect the unintended consequences the team actually worries about.

### E-Q6. Are fuzzy concepts (engagement, quality, satisfaction) operationalized into specific measurable signals?
- **High Risk** if metric definitions are vague.
- **Medium Risk** if operationalization is informal.
- **None** if metric definitions are explicit and consistent across experiments.

### E-Q7. Are metric calculations pre-defined (denominators, time windows, outlier handling)?
- **High Risk** if metric definitions can shift after the data arrives.
- **Medium Risk** if definitions are set per experiment without standardization.
- **None** if standard calculations are defined at the team or platform level.

### E-Q8. Are counter-metrics included for likely side effects?
- **High Risk** if experiments only measure intended improvements.
- **Medium Risk** if some experiments include counter-metrics.
- **None** if counter-metrics are a standard part of experiment design.

---

## Discipline distinction

### E-Q9. Is the discipline (experiment vs. rollout vs. guarded release) chosen deliberately for each change?
- **High Risk** if the distinction is blurry and the team conflates the three.
- **Medium Risk** if the distinction exists informally.
- **None** if the team explicitly chooses and documents the discipline per change.

### E-Q10. Are guarded releases distinguished from experiment results?
- **High Risk** if successful guarded releases are claimed as "positive experiment results."
- **Medium Risk** if the distinction is sometimes blurred.
- **None** if the team consistently separates the two.

---

## Sample size and power

### E-Q11. Are sample-size estimates made before experiments start?
- **High Risk** if experiments launch without a power calculation.
- **Medium Risk** if calculations happen but are informal.
- **None** if rough power analysis is part of experiment design.

### E-Q12. Do experiment durations match the behavior of the metric being measured?
- **High Risk** if short-window experiments are used to evaluate long-window metrics (e.g., 30-day retention measured over 7 days).
- **Medium Risk** if some misalignment exists.
- **None** if duration is matched to metric.

### E-Q13. Does the team avoid ad-hoc peeking and early decisions on fixed-horizon experiments?
- **High Risk** if "let's check the data and decide" is routine.
- **Medium Risk** if peeking happens but the team is aware of the risk.
- **None** if sequential designs are used where early stopping is desired, and fixed-horizon experiments run to their planned conclusion.

### E-Q14. For low-traffic surfaces, does the team use appropriate experimentation alternatives?
- **High Risk** if underpowered experiments routinely produce inconclusive results.
- **Medium Risk** if the team is aware of the constraint but hasn't adopted alternatives.
- **None** if low-traffic surfaces use alternative methods (qualitative studies, longer durations, guardrail rollouts) deliberately.

---

## Holdouts

### E-Q15. Does the team maintain holdouts for features whose value compounds over time?
- **High Risk** if no holdouts exist for retention, habit-formation, or long-term-revenue-affecting features.
- **Medium Risk** if holdouts exist for some features but coverage is inconsistent.
- **None** if holdouts are systematic for the appropriate feature categories.

### E-Q16. Are holdout purposes and durations documented?
- **High Risk** if holdouts exist but their purpose is folklore.
- **Medium Risk** if documentation is partial.
- **None** if every active holdout has a current rationale and end date.

### E-Q17. Are holdouts reviewed periodically (extend, rotate, end)?
- **High Risk** if holdouts persist indefinitely without review.
- **Medium Risk** if reviews happen ad hoc.
- **None** if reviews are scheduled.

---

## Sequential and multi-arm designs

### E-Q18. Is sequential testing used appropriately (and not as a way to peek)?
- **High Risk** if "sequential" is used as cover for ad-hoc peeking.
- **Medium Risk** if sequential is used but team understanding is uneven.
- **None** if sequential designs are used deliberately where early stopping matters, with valid statistical methods.

### E-Q19. Are concurrent experiments on the same surface tracked, with interactions managed?
- **High Risk** if concurrent experiments overlap silently and confound each other.
- **Medium Risk** if concurrency is acknowledged but not managed.
- **None** if concurrency is tracked and either stratified or documented.

---

## AI Config experimentation

> Skip this section if AI Configs are not in scope. Use the [AI/GenAI lens](../../lenses/ai-genai/) for the deeper review.

### E-Q20. Do AI experiments measure cost, latency, and quality together?
- **High Risk** if quality is the only metric.
- **Medium Risk** if some dimensions are tracked but not gated.
- **None** if all three are first-class.

### E-Q21. Is the quality proxy operationalized, trusted, and measured in production (not just from evals)?
- **High Risk** if quality is unmeasured in production, or measured only via evals.
- **Medium Risk** if production quality measurement is partial.
- **None** if a production-sampled quality proxy is tracked.

### E-Q22. Are trade-off rules between cost, latency, and quality pre-committed?
- **High Risk** if trade-offs are interpreted post-hoc and tend to favor pre-existing preferences.
- **Medium Risk** if rules are stated but loosely.
- **None** if rules are explicit and applied.

---

## Results interpretation

### E-Q23. Does the team examine primary, secondary, and guardrails together?
- **High Risk** if decisions are made on the primary alone.
- **Medium Risk** if the full set is examined but inconsistently.
- **None** if review of the full metric set is standard practice.

### E-Q24. Does the team distinguish statistical from practical significance?
- **High Risk** if any statistically significant result is treated as ship-worthy regardless of magnitude.
- **Medium Risk** if the distinction is informal.
- **None** if practical-significance thresholds are pre-defined.

### E-Q25. Are segment-level results treated as hypotheses to test, not conclusions to act on?
- **High Risk** if segment slicing routinely produces "wins" that aren't replicated.
- **Medium Risk** if the team understands the risk but doesn't have a formal practice.
- **None** if segment findings drive new experiments rather than immediate decisions.

### E-Q26. Are null results accepted as findings?
- **High Risk** if null results trigger reflexive "let's run it longer."
- **Medium Risk** if some null results are accepted.
- **None** if null is treated as evidence and shapes future decisions.

---

## Decision review

### E-Q27. Does every experiment have a decision deadline at creation?
- **High Risk** if deadlines are absent.
- **Medium Risk** if they exist informally.
- **None** if mandatory and tracked.

### E-Q28. Are decisions captured with rationale?
- **High Risk** if decisions are made and forgotten.
- **Medium Risk** if rationale is captured inconsistently.
- **None** if decision capture is routine.

### E-Q29. Are post-decision artifacts cleaned up?
- **High Risk** if old experiments and variations accumulate.
- **Medium Risk** if cleanup is reactive.
- **None** if cleanup is a standard step at decision time.

### E-Q30. Are decisions shared across the team?
- **High Risk** if experiment learnings are private to the proposer.
- **Medium Risk** if sharing is inconsistent.
- **None** if write-ups are routine and reviewed.

---

## Experiment governance

### E-Q31. Does the team maintain a portfolio view of active experiments?
- **High Risk** if no one can name the running experiments.
- **Medium Risk** if a list exists but isn't current.
- **None** if the portfolio is visible and used.

### E-Q32. Is the experiment portfolio reviewed on a cadence?
- **High Risk** if no review happens.
- **Medium Risk** if reviews are reactive.
- **None** if quarterly reviews are scheduled.

### E-Q33. For regulated experiments, is the appropriate review body involved before launch?
- **High Risk** if regulated experiments launch without the required review.
- **Medium Risk** if review is informal.
- **None** if the review is required and recorded.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
