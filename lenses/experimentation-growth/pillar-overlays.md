# Experimentation / Growth — Pillar Overlays

How each pillar specializes for high-velocity experimentation teams.

---

## Safe Release & Progressive Delivery

**Growth overlay:**
- Experiments are progressive exposure by design (control vs. treatment). The team uses the standard pillar guidance for rollouts; experiments are a specialized variant.
- Guarded rollouts are the right tool for "we're shipping this and want to be safe" — distinct from experiments, which are "we don't know if we should ship this."
- For complex experiments (multi-armed, factorial), the rollout configuration is more involved; lean on the [Experimentation pillar](../../pillars/experimentation/) for the discipline.

---

## Operational Excellence

**Growth overlay:**
- "Experiments in motion" dashboard at high volume — the team's portfolio view of every running experiment. Reviewable in 30 seconds.
- Decision-cadence operational ritual: regularly scheduled review where experiments past their decision dates get triaged.
- Audit-log tracking by experiment helps reconstruct what was tried and when.

---

## Reliability & Resilience

**Growth overlay:**
- The application's behavior under any experiment's fallback must be acceptable. With many experiments running, the cumulative fallback experience is non-trivial.
- The team's metric pipeline reliability is critical — wrong metrics produce wrong decisions at scale.

---

## Security & Compliance

**Growth overlay:**
- For experiments touching protected classes (fair-lending decisions, clinical safety, accessibility), the regulatory review process applies before launch.
- High-volume experimentation produces audit trails that can be queried for "what was the customer experience at time T?" — useful for support and legal.

---

## Governance & Artifact Lifecycle

**Growth overlay** — high-priority.
- The cleanup discipline applies harder at volume. Hundreds of experiments per quarter means hundreds of post-decision artifact retirements per quarter.
- The team's hygiene metrics include experimentation-specific ones: experiments-without-decisions count, average time-to-decision, expired holdouts.
- Tag experiments aggressively for portfolio queries: by team, by surface, by metric type, by hypothesis category.

---

## Experimentation & Measurement

**Growth overlay** — this lens *is* the high-volume extension of the Experimentation pillar.
- Sample-size planning is non-negotiable; underpowered experiments at volume produce a steady stream of noise.
- Statistical methods rigor matters more, not less, at volume. Sequential testing where appropriate; multiple-comparison corrections where applicable.
- Decision-rule pre-commitment is the practice that survives the volume of decisions.

---

## Performance & Cost Efficiency

**Growth overlay** — high-priority.
- Event volume from many experiments compounds. Sample where the metric supports it.
- MCI implications: experimentation contexts often include attributes (treatment assignment, cohort) that affect MCI. Model the cost.
- Event Pipeline reliability: a metric pipeline that loses events produces incorrect decisions at scale.

---

## Developer Experience & Velocity (Lens overlap)

**Growth overlay:**
- The team's experimentation tooling — instrumentation libraries, eval pipelines, decision-capture templates — is platform-team product work.
- New growth engineers should be productive on their first experiment within days, not weeks. This is the platform team's velocity metric.
- Code-side patterns for experiment-gated logic should be consistent; the team's standard experiment-code pattern is documented.

---

← [Design Principles](./design-principles.md) | Continue to → [Portfolio Management](./portfolio-management.md)
