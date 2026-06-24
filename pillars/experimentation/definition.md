# Experimentation & Measurement — Definition

This pillar is organized into the following focus areas.

---

## 1. Hypothesis design

The discipline of stating what you expect before you ship. Covers when a change warrants a formal hypothesis, the structure of a useful hypothesis ("we believe X because of Y, measured by Z"), the relationship to product strategy, and the documentation of the hypothesis somewhere durable.

## 2. Metric design

The construction of the experiment's metric set. Covers the choice of primary metric, secondary metrics for context, guardrail metrics that must not regress, counter-metrics for unintended effects, and the operationalization of fuzzy concepts ("quality," "engagement") into concrete measurable signals.

## 3. Experiments vs. rollouts vs. guarded releases

The distinction between three related but different disciplines. Covers when to use each, how to choose, and how to avoid mixing them in ways that produce confusion. Includes the boundary cases — when a "rollout" really should be an "experiment" and vice versa.

## 4. Sample size and statistical power

The planning that makes experiments capable of producing decisions. Covers minimum detectable effect, the relationship between sample size and detection power, the practical implications for low-traffic surfaces, and the use of sequential testing to enable earlier decisions when warranted.

## 5. Holdouts

The discipline of long-run measurement. Covers the design of holdout segments, the duration of holdouts, the relationship between holdouts and the team's experiment portfolio, and the protocols for ending or rotating holdouts.

## 6. Sequential, multi-arm, and adaptive designs

Beyond the simple A/B. Covers when sequential testing is appropriate (and when it makes results harder to interpret), multi-arm bandits and their trade-offs, factorial designs for testing multiple things at once, and the rules of thumb for choosing a design.

## 7. AI Config experimentation

The special considerations for experimenting on AI Configs. Covers the metric set for AI (cost, latency, quality proxies, satisfaction), the higher noise floor of subjective quality signals, and the integration with eval pipelines. (See the [AI/GenAI lens](../../lenses/ai-genai/) for the full treatment.)

## 8. Results interpretation

What the data actually means. Covers the discipline of looking at primary, secondary, and guardrail metrics together, the role of statistical significance vs. practical significance, the treatment of segment-level results, and the recognition of when results are inconclusive.

## 9. Decision review and capture

The point at which an experiment becomes action. Covers the decision deadline, the review process, the capture of the decision and its rationale, the cleanup of artifacts after decisions, and the institutional memory that prior decisions create.

## 10. Experiment governance

The team-level and organization-level practices that keep experimentation healthy. Covers the experimentation portfolio (what's running, by whom, on what), interaction tracking, the experiment-review cadence, the relationship to product strategy and to compliance considerations.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
