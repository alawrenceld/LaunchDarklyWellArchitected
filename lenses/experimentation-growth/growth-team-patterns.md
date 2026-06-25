# Growth-Team Patterns

Operating practices for teams whose primary work is experimentation: the infrastructure they need, the rhythms they follow, and the cultural practices that make high-volume experimentation produce reliable decisions.

---

## The growth experimentation flywheel

The pattern that compounds:

```
Hypothesis → Design → Implement → Run → Decide → Capture → Inform next hypothesis
                                                                ↓
                                                  ←————————————┘
```

Each turn of the flywheel:

- Produces (ideally) a small product improvement.
- Captures a decision.
- Informs the next hypothesis.

The team's job is to keep the flywheel turning at the rate the product can absorb learning, not faster, not slower.

### Slow flywheel symptoms

- Hypotheses are scarce; the team runs whatever someone thought of recently.
- Implementation is bespoke per experiment; lots of engineering per experiment.
- Decisions stall.
- Results aren't captured; the team relitigates the same questions.

### Fast flywheel symptoms (the good kind)

- A backlog of hypotheses prioritized by expected impact.
- A templated experiment-implementation pattern; new experiments are mostly configuration.
- A clear decision cadence; experiments resolve on time.
- Decisions inform the backlog; killed hypotheses don't get re-pitched.

---

## Hypothesis generation

The growth team's input pipeline. Approaches:

### Backlog from product insights

Customer-research findings, support themes, analytics anomalies — each generates hypotheses. The growth team's intake process turns these into testable claims.

### Hypothesis from data exploration

The team's analyst (or data scientist) examines patterns: where does the funnel drop off? Which cohorts show different behaviors? Each interesting pattern is a hypothesis candidate.

### Hypothesis from prior decisions

Killed experiments often suggest the next: "the visual change didn't move conversion; maybe the underlying flow is the issue." Won experiments suggest extensions: "the new layout improved engagement; what else can we tune on this surface?"

### Hypothesis quality

Not every hypothesis is worth testing. Filter for:

- **Expected impact.** Will moving this metric by the predicted amount matter to the business?
- **Testability.** Can the metric move by the predicted amount in a reasonable time?
- **Learning value.** Does the result, regardless of direction, teach the team something?

A hypothesis that's expensive to test for ambiguous learning is a bad hypothesis. A hypothesis that's cheap to test and decisive in either direction is gold.

---

## Experimentation as service to product

The growth team's role within the broader org: provide the experimentation capability and discipline to product teams, while also running independent growth experiments.

Two operating modes:

### Mode A — Growth-team-led experiments

The growth team identifies hypotheses, runs experiments end-to-end, and presents results. Product teams consume the insights.

### Mode B — Product-team-led experiments with growth-team support

A product team has a hypothesis specific to their area. The growth team provides the platform, the instrumentation, the analysis. The product team owns the hypothesis and the decision.

Most organizations need both. The growth team's product is the experimentation capability; the team's services include both running experiments and enabling others to.

---

## Instrumentation as a shared library

The most leveraged infrastructure for a growth team: a shared metric-instrumentation library.

```pseudocode
// Used by every product surface
metrics.track('signup-completed', context, { source: 'organic' })
metrics.track('checkout-step-completed', context, { step: 2 })
metrics.track('feature-used', context, { feature: 'export' })
```

The library:

- Standardizes event names (so analyses across surfaces work consistently).
- Standardizes context attributes (so segmentation works consistently).
- Routes events to LaunchDarkly *and* to the data warehouse / analytics tool.
- Provides typed access to the metric catalog.

The growth team owns this library; product teams use it. The library is the team's biggest velocity multiplier.

---

## The metric catalog

A central registry of every metric the team measures:

- **Name.**
- **Definition.** What event(s) populate it; what's the calculation.
- **Owner.** The team responsible for keeping the metric correct.
- **Direction.** Higher is better, lower is better, depends on context.
- **Used by.** Which experiments / dashboards reference it.

The catalog prevents the failure mode where the same metric is measured slightly differently by different teams. A consistent definition is the foundation of comparable results.

---

## Experiment templates

The growth team builds templates for the common experiment types:

### Template 1 — Simple A/B

Two variations, one primary metric, fixed sample size, decision after N days. Used for most experiments.

### Template 2 — Multi-arm

Three-plus variations. Used for comparing multiple options (different button copies, different layouts).

### Template 3 — Sequential A/B

Statistical method that allows early stopping. Used for high-stakes decisions where the team wants to ship the winner as soon as power supports.

### Template 4 — Bandit

Adaptive traffic allocation. Used when exploitation matters more than learning.

### Template 5 — Factorial

Multiple changes tested simultaneously to isolate independent effects. Used sparingly; complex to interpret.

Each template includes:

- The targeting rule shape.
- The metric set.
- The statistical method.
- The expected duration and sample size.
- The decision-rule structure.

Engineers configuring an experiment pick the template, fill in the specifics, and run. The infrastructure handles the rest.

---

## The eval pipeline for AI experiments

For growth teams that test AI variations:

- **Golden dataset** of representative inputs.
- **Graders** for cost, latency, quality (often LLM-as-judge), and task-specific outcomes.
- **CI integration**: candidate AI Config variations are evaluated against the golden dataset before promotion.
- **Production sampling** continues post-launch.

See the [AI/GenAI lens](../ai-genai/evaluation-and-measurement.md) for the full eval discipline.

---

## Counter-metric discipline at the portfolio level

The dangerous failure mode at high volume: many experiments each move the primary metric slightly upward while degrading a counter-metric slightly. The portfolio aggregate degrades the counter-metric meaningfully.

Patterns to catch this:

- **Portfolio-level counter-metric dashboard.** Track the counter-metric (latency, error rate, customer-satisfaction, support-ticket-rate) at the org level. Trend it over time.
- **Cumulative-effect review.** Quarterly: look at the counter-metric trend; correlate with the experiment portfolio shipped that quarter; identify if cumulative damage is happening.
- **Holdout the long-run counter.** If a counter-metric matters over months (long-term retention, brand perception), a long-run holdout measures the cumulative effect of all changes shipped.

Without these, the team can win at each experiment and lose at the program level.

---

## Decision authority and review

At high volume, not every experiment decision is reviewed by everyone. The patterns:

### Clear-cut decisions

Pre-committed decision rules + clear data = the owner makes the call. No meeting needed.

### Borderline decisions

The data is ambiguous; the decision rule doesn't decide cleanly. The decision goes to the standing review meeting.

### High-stakes decisions

Some experiments have outsized impact (pricing changes, major UX shifts). These get review regardless of data clarity. The team's escalation criteria identify which experiments qualify.

### Veto authority

Some changes — regulated, brand-affecting, security-relevant — require sign-off from a designated reviewer regardless of the data. The veto authority is documented; experiments that fall in scope can't proceed past pre-launch without sign-off.

---

## Calibration and over time

Growth teams over time tend toward over-confident hypotheses and under-rigorous analysis (if not deliberately countered). Practices to calibrate:

### Pre-experiment forecasts

The team predicts the result before the experiment runs. The forecast is recorded. Over time, the team learns its own calibration — are they consistently optimistic? Pessimistic? Accurate? — and adjusts.

### Replication

For high-stakes results, run the experiment again. Replication confirms or denies; non-replicating results were probably noise.

### Sensitivity analysis

For ambiguous results, the team examines whether reasonable variations in the analysis (different segments, different time windows, different statistical methods) change the conclusion. Robust results survive sensitivity testing; brittle ones don't.

---

## The growth-team operating cadence

A typical week or two:

| Cadence | Activity |
|---|---|
| Daily | Owner checks running experiments for anomalies |
| Weekly | Decision review (experiments past decision date) |
| Weekly | Hypothesis prioritization (what's next?) |
| Biweekly or monthly | Portfolio review (what's running, what's planned) |
| Quarterly | Holdout review; cumulative counter-metric review |
| Quarterly | Calibration review (are our predictions matching outcomes?) |
| Annually | Strategy review (is experimentation aligned with the product's direction?) |

This cadence isn't optional for high-volume teams; it's the team's operational rhythm.

---

## A minimum-viable growth-team setup checklist

For a team operating high-volume experimentation:

- [ ] Hypothesis intake process with prioritization.
- [ ] Shared instrumentation library used across product surfaces.
- [ ] Metric catalog with definitions and owners.
- [ ] Experiment templates for common patterns.
- [ ] Portfolio view of running experiments (current).
- [ ] Interaction management policy.
- [ ] Holdout portfolio with current purposes and rotation.
- [ ] Decision review cadence (weekly minimum).
- [ ] Decision-capture process used for every experiment.
- [ ] Null-results digest (monthly or quarterly).
- [ ] Portfolio-level counter-metric tracking.
- [ ] Pre-experiment forecasting practice.
- [ ] Annual calibration review.

---

← [Portfolio Management](./portfolio-management.md) | Continue to → [Review Questions](./review-questions.md)
