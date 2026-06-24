# Experimentation & Measurement — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Experimentation pillar.

---

## E-1. Every meaningful release is a hypothesis

Before the change is built, the team can state: "we believe X will happen because of Y, measured by Z." A change without a hypothesis is a change you can't learn from.

Not every change needs a *full experiment*. But every change with non-trivial blast radius has a stated expectation that turns into a measurement.

## E-2. Metrics are designed, not chosen reflexively

A team's metric set is a deliberate construction:

- **Primary metric** — what you're trying to move, and in which direction.
- **Secondary metrics** — what might also move, useful for context.
- **Guardrail metrics** — what must *not* get worse.
- **Counter-metrics** — what might get worse as a side effect.

Picking metrics by reflex ("conversion goes up, right?") produces shallow experiments. Picking them deliberately produces decisions.

## E-3. Power and sample size are planned, not discovered

Before the experiment starts, the team has a rough sample-size calculation: how big does the effect have to be to detect it, given the noise in the metric and the available traffic? An experiment that ends inconclusive because it didn't have enough power was always going to end that way.

This applies most strictly to small-effect, high-noise metrics (conversion changes of a few percent on traffic measured in hundreds of users per day). It applies less strictly to large-effect, low-noise metrics — but power is always worth checking.

## E-4. The decision rule is pre-committed

Before the experiment starts, the team commits to what the data will mean: "if primary moves more than X and no guardrail moves more than Y, we ship. If a guardrail moves more than Z, we kill. Otherwise we extend or revise."

Pre-committing prevents the worst experimentation failure mode: deciding what the data means *after* you see it.

## E-5. Experiments and rollouts and guarded releases are distinct disciplines

- A **rollout** ships a change progressively, with no formal hypothesis.
- A **guarded release** ships a change progressively, with metrics that drive automatic rollback on regression.
- An **experiment** compares two or more variations to make a *decision* between them.

Mixing them produces confusion. A guarded release is not an experiment; the rollback isn't a "result." An experiment without progressive exposure is not safe; a rollout without a hypothesis is not learning. Be clear which discipline applies.

## E-6. Holdouts capture long-run effects

A holdout segment — a portion of users deliberately excluded from a feature for an extended period — is how the team measures effects that only show up after the novelty fades, after habits form, after long-tail use cases happen. Critical for revenue, retention, and any metric where short-term moves don't predict long-term ones.

## E-7. Every experiment ends with a decision

Decisions are the point. An experiment that ran, produced results, and never had a decision is wasted statistical power and accumulated artifact debt. The decision is captured in writing, with rationale, by a deadline.

## E-8. Concurrency is honest

If multiple experiments run on the same surface at the same time, the team knows. Interactions can confound results; sometimes they're worth tolerating, sometimes they're not. Pretending experiments are independent when they're not is how decisions go subtly wrong.

## E-9. Quality and cost and latency are equal citizens for AI experiments

For AI Config experimentation, the team measures all three. A model that's 5% better on quality but doubles cost is not "better" without a deliberate decision that the trade-off is worth it. See the [AI/GenAI lens](../../lenses/ai-genai/) for AI-specific elaboration.

## E-10. The team learns from null results

A well-designed experiment that produces a null result is a real finding: "this change did not move the metric." Treating null results as failures (or as evidence to keep trying) compounds bias. Treating them as evidence shapes future bets.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
