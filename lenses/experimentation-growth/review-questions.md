# Experimentation / Growth — Review Questions

These questions are **additions** to the standard [Experimentation pillar review questions](../../pillars/experimentation/review-questions.md) for high-volume experimentation teams.

---

## Portfolio management

### EG-Q1. Does the team maintain a current portfolio view of running experiments?
- **High Risk** if there's no shared view; nobody can name what's running.
- **Medium Risk** if a list exists but is stale.
- **None** if the view is current and pulled up frequently.

### EG-Q2. Are experiment interactions tracked (stratified, accepted-and-documented, or sequenced)?
- **High Risk** if concurrency happens silently with unmanaged interactions.
- **Medium Risk** if some experiments are managed but not all.
- **None** if every overlap is deliberately handled.

### EG-Q3. Is portfolio-level counter-metric tracking in place?
- **High Risk** if the team only tracks individual-experiment metrics and not portfolio-cumulative effects.
- **Medium Risk** if tracking exists but isn't reviewed.
- **None** if cumulative-counter-metric review is on the team's cadence.

---

## Decision velocity

### EG-Q4. Is the team's decision cadence keeping pace with experiment throughput?
- **High Risk** if many experiments are past their decision date and stalling.
- **Medium Risk** if backlogs build up periodically.
- **None** if decisions resolve on schedule.

### EG-Q5. Are pre-committed decision rules used for every experiment?
- **High Risk** if decisions are made entirely post-hoc.
- **Medium Risk** if some experiments use them.
- **None** if pre-commitment is standard.

### EG-Q6. Is there an escalation process for stalled decisions?
- **High Risk** if stalled experiments accumulate without intervention.
- **Medium Risk** if escalation is informal.
- **None** if a documented escalation process exists.

---

## Holdouts at scale

### EG-Q7. Are holdouts maintained with documented purpose, duration, and rotation?
- **High Risk** if holdouts exist but their purposes have decayed.
- **Medium Risk** if documentation is partial.
- **None** if every holdout has current documentation.

### EG-Q8. Is the team's total holdout fraction monitored against a policy?
- **High Risk** if total holdout percentage is unknown or unbounded.
- **Medium Risk** if visibility exists but no policy.
- **None** if policy + tracking + review are in place.

### EG-Q9. Are holdouts reviewed quarterly?
- **High Risk** if holdouts persist indefinitely without review.
- **Medium Risk** if reviews happen reactively.
- **None** if quarterly review is the cadence.

---

## Statistical rigor

### EG-Q10. Are statistical methods chosen deliberately per experiment (frequentist, sequential, bandit, factorial)?
- **High Risk** if "we always do A/B" with no consideration of when other methods would be better.
- **Medium Risk** if choice is informal.
- **None** if method is explicit and reasoned per experiment.

### EG-Q11. Is sample-size planning done before launch?
- **High Risk** if experiments launch without power analysis.
- **Medium Risk** if planning is informal.
- **None** if power analysis is standard.

### EG-Q12. Are segment-level findings treated as hypotheses to test rather than conclusions?
- **High Risk** if segment slicing routinely produces "wins" that don't replicate.
- **Medium Risk** if the risk is acknowledged but not addressed.
- **None** if segment findings drive new experiments, not immediate decisions.

---

## Infrastructure and tooling

### EG-Q13. Is there a shared instrumentation library used across product surfaces?
- **High Risk** if each surface instruments differently.
- **Medium Risk** if a library exists with partial adoption.
- **None** if the library is universally used.

### EG-Q14. Is there a metric catalog with definitions and owners?
- **High Risk** if metrics are defined ad hoc and definitions diverge.
- **Medium Risk** if a catalog exists but is partial.
- **None** if the catalog is the source of truth.

### EG-Q15. Are experiment templates used for common patterns?
- **High Risk** if every experiment is configured from scratch.
- **Medium Risk** if templates exist but adoption is inconsistent.
- **None** if templates are the default and adoption is broad.

---

## Hypothesis generation and prioritization

### EG-Q16. Is there a hypothesis backlog with prioritization?
- **High Risk** if experiments come from whoever shouts loudest.
- **Medium Risk** if a backlog exists but isn't prioritized.
- **None** if hypotheses are prioritized by expected impact.

### EG-Q17. Does the team learn from killed experiments (null results, negative results)?
- **High Risk** if killed experiments are forgotten.
- **Medium Risk** if some learnings are captured.
- **None** if a null-results practice (digest, doc, review) is established.

### EG-Q18. Are pre-experiment forecasts captured and reviewed for calibration?
- **High Risk** if the team doesn't predict outcomes.
- **Medium Risk** if predictions happen but aren't reviewed.
- **None** if forecast / outcome calibration is reviewed periodically.

---

## Personalization

> Apply if the team layers personalization on top of experimentation.

### EG-Q19. Does the team distinguish experimentation from personalization explicitly?
- **High Risk** if the two are conflated.
- **Medium Risk** if the distinction is understood but inconsistent.
- **None** if each decision is clear about which discipline applies.

### EG-Q20. Is there a holdout excluded from personalization to maintain a baseline?
- **High Risk** if personalization affects everyone with no baseline to compare against.
- **Medium Risk** if a baseline exists but is small or unmaintained.
- **None** if a meaningful personalization holdout is maintained.

### EG-Q21. Is personalization knowledge refreshed by ongoing experimentation?
- **High Risk** if personalization rules calcify and aren't validated.
- **Medium Risk** if refresh happens reactively.
- **None** if experimentation continues to validate personalization assumptions.

---

## Counter-metrics and quality

### EG-Q22. Are counter-metrics included in every experiment's metric set?
- **High Risk** if experiments only measure intended improvements.
- **Medium Risk** if counter-metrics are inconsistent.
- **None** if every experiment includes them.

### EG-Q23. Does the team review whether cumulative damage to counter-metrics is happening across the portfolio?
- **High Risk** if cumulative damage goes unreviewed.
- **Medium Risk** if reviews are reactive.
- **None** if cumulative review is scheduled.

---

## Authority and review

### EG-Q24. Is decision authority clear for each experiment?
- **High Risk** if it's unclear who decides.
- **Medium Risk** if authority is informal.
- **None** if authority is documented per experiment.

### EG-Q25. Are high-stakes experiments routed through veto-authority review?
- **High Risk** if pricing / regulated / brand-affecting changes ship without escalated review.
- **Medium Risk** if review is informal.
- **None** if escalation is documented and followed.

---

## Operating cadence

### EG-Q26. Does the team's operating cadence include daily / weekly / quarterly experimentation rituals?
- **High Risk** if no cadence exists.
- **Medium Risk** if some rituals exist but are inconsistent.
- **None** if the full cadence is established.

### EG-Q27. Is the growth team's headcount and infrastructure investment matched to the experimentation throughput goal?
- **High Risk** if the team is under-resourced relative to volume; quality suffers.
- **Medium Risk** if resourcing is tight.
- **None** if resourcing matches velocity expectations.

---

## Cost at experimentation scale

### EG-Q28. Is event volume from many experiments managed (sampling, scoping)?
- **High Risk** if naive event emission across many experiments produces material cost.
- **Medium Risk** if some sampling exists.
- **None** if sampling and scoping are deliberate.

### EG-Q29. Is MCI impact of experimentation tracked?
- **High Risk** if experimentation contexts inflate MCI unexpectedly.
- **Medium Risk** if visibility exists but isn't acted on.
- **None** if MCI from experimentation is forecast and managed.

---

← [Growth-Team Patterns](./growth-team-patterns.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
