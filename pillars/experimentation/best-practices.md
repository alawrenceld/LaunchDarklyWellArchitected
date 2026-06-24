# Experimentation & Measurement — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Hypothesis design

### BP-1.1 Write the hypothesis down before the change is built
A useful hypothesis names the change, the expected effect, the mechanism (why you believe it), and the metric. "Adding a progress bar will increase conversion by 2–5% because users will feel less anxious about wait times; measured by checkout completion rate."

**Why:** the hypothesis is the team's commitment to a falsifiable belief. Writing it down forces precision and prevents post-hoc rationalization.

### BP-1.2 State the expected direction and magnitude
"Conversion will go up" is weaker than "conversion will go up by 2–5%." The magnitude is what makes the result interpretable: a 0.5% lift on a hypothesis that expected 2–5% is not a win, it's roughly a null result.

**Why:** magnitude expectations expose the team's actual model. They also calibrate over time — teams that habitually over-predict learn to predict more carefully.

### BP-1.3 Note what would make you change your mind
Before the data arrives: what would falsify the hypothesis? What would make you ship the change anyway, even if the primary metric didn't move? What would make you reverse course, even if it did?

**Why:** pre-committing to interpretation rules makes the post-experiment conversation about the *change*, not about the *data*.

### BP-1.4 Reserve formal hypotheses for changes that warrant them
Not every change is an experiment. Bug fixes, refactors, and low-impact UX tweaks don't need hypotheses. High-impact changes — anything customer-facing with material blast radius — do.

**Why:** treating every change as an experiment dilutes the rigor around the changes that need it.

---

## 2. Metric design

### BP-2.1 Pick a single primary metric and commit to it
The primary metric is what the experiment is fundamentally trying to move. One metric, in one direction, with a stated magnitude. If you find yourself wanting three primary metrics, you're really running three experiments.

**Why:** experiments with multiple primary metrics are experiments with multiple decision criteria, and the team will inevitably weight them differently after the fact.

### BP-2.2 Designate guardrail metrics that must not regress
A guardrail is something you commit to *not making worse*. Latency, error rate, accessibility, fairness metrics, cost. If the primary moves the right direction but a guardrail regresses meaningfully, the team should be reluctant to ship.

**Why:** guardrails are how the team protects against unintended consequences. They turn "we improved X, but we broke Y" from a discovery into a stop condition.

### BP-2.3 Operationalize fuzzy concepts
"Engagement," "quality," "satisfaction" are not metrics — they're concepts. Pick a measurable signal that the team agrees represents the concept ("engagement = sessions per week with at least 3 actions"; "satisfaction = thumbs-up rate on AI responses").

**Why:** vague metrics produce vague conclusions. Operationalization forces the team to commit.

### BP-2.4 Pre-define metric calculations
"Conversion" can mean a dozen different things depending on the denominator. Pre-define the calculation: which users count, what time window, how repeat events are handled, how outliers are treated.

**Why:** post-hoc metric redefinition is the most common form of experiment bias.

### BP-2.5 Include counter-metrics for likely side effects
If you're optimizing conversion, what might get worse? Customer service ticket volume? Refund rate? Long-term retention? Name the candidates and track them.

**Why:** the team that only measures what it hopes to improve will miss what it hurts.

---

## 3. Experiments vs. rollouts vs. guarded releases

### BP-3.1 Decide upfront which discipline applies
For each meaningful change: are we *experimenting* (comparing variations to make a decision), *rolling out* (shipping a known-good change progressively), or *guarding a release* (rolling out with automatic rollback on metric regression)? The choice shapes everything else.

**Why:** mixing the disciplines produces confused outcomes. A "rollout" that becomes a half-hearted experiment produces neither safe rollout nor decision-quality data.

### BP-3.2 Use experiments when the decision is uncertain
If the team genuinely doesn't know which variation is better — and the answer matters — that's an experiment.

### BP-3.3 Use guarded releases when the team is confident but wants safety
If the team thinks the change is good but wants automated protection against being wrong, that's a guarded release. See the [Safe Release pillar](../safe-release/best-practices.md).

### BP-3.4 Use rollouts for everything else
Low-risk progressive exposure, no hypothesis, no regression-driven rollback. Most changes look like this.

### BP-3.5 Don't confuse a successful guarded release with a positive experiment result
A guarded release that completes without rolling back means the guardrails didn't trigger. It doesn't mean the change improved anything. Treating it as evidence of improvement is a category error.

**Why:** the two disciplines measure different things. Confusing them produces overclaiming.

---

## 4. Sample size and statistical power

### BP-4.1 Estimate sample size before starting
The sample-size estimate doesn't need to be precise. It needs to exist. "To detect a 2% lift on a 5% baseline conversion rate with 80% power, we need ~X users per variation." Compute this with a calculator before launching.

**Why:** experiments are committed to running until they have enough power. Knowing the rough sample size sets expectations: "this will take three weeks at our current traffic."

### BP-4.2 Match the experiment's duration to the metric's behavior
Conversion measured per session can be evaluated in days. Retention measured at 30 days requires at least 30 days. Habit formation requires months. Match the duration to what you're measuring.

**Why:** running a 30-day-retention experiment for two weeks doesn't measure 30-day retention. It measures something else.

### BP-4.3 Don't peek and decide
Sequential testing is appropriate when the team has set it up deliberately; ad-hoc "let's look at the data and decide" repeatedly inflates false-positive rates. Either pre-commit to a stopping rule or commit to the full sample size.

**Why:** repeated peeks at fixed-horizon data produce statistically over-confident decisions. This is a real, well-documented failure mode.

### BP-4.4 For low-traffic surfaces, consider alternatives
If the surface gets so little traffic that a meaningful experiment would take months, the team's options are: extend the duration, accept lower statistical power, run a qualitative study instead, or skip the formal experiment and use judgment with a guardrail rollout.

**Why:** an underpowered experiment that takes a month and produces noise is worse than no experiment at all.

---

## 5. Holdouts

### BP-5.1 Maintain a long-run holdout for features whose value compounds
Features that affect retention, habit formation, or long-term revenue benefit from holdouts that run for months, not weeks. A small percentage of users (typically 1–5%) is held out across many releases.

**Why:** short-term experiments measure the immediate response. Holdouts measure the accumulated effect of a series of changes.

### BP-5.2 Document the holdout's purpose and duration
A holdout that no one understands gets canceled in a cleanup pass. Write down what it's for and when it ends.

**Why:** institutional memory loses holdouts; documentation preserves them.

### BP-5.3 Rotate holdouts deliberately
At the end of a holdout's lifecycle, decide: extend it, rotate to a new sample, or end it. The decision is captured.

**Why:** holdouts that get extended forever stop being meaningful. Rotation maintains statistical validity.

### BP-5.4 Mind the cumulative cost of holdouts
Each holdout removes some of your sample from current experiments. If you have many holdouts, current experiments lose power. The team's portfolio of holdouts is reviewed periodically.

**Why:** holdouts are an investment in long-run learning. They have a cost; budget them.

---

## 6. Sequential, multi-arm, and adaptive designs

### BP-6.1 Use sequential testing when you'd benefit from early stopping
Sequential designs (or "always-valid" tests, like those used by LaunchDarkly Experimentation for guarded rollouts) let the team monitor results continuously without inflating false-positive rates. Useful when a clearly-bad change should be stopped early, or a clearly-great change should be promoted early.

**Why:** fixed-horizon experiments are conservative — they don't let you stop early without bias correction. Sequential designs make peeking valid.

### BP-6.2 Be cautious with multi-arm bandits in product contexts
Bandits optimize for the metric being measured during the experiment. They can be the wrong tool when long-term effects diverge from short-term ones, when learning *about* variations matters more than maximizing immediate value, or when interpretability is important.

**Why:** bandits trade learning for exploitation. Use them when exploitation is what you want.

### BP-6.3 Avoid concurrent experiments on the same surface unless you understand the interactions
Two experiments on the same surface may interact in ways that confound either's result. If you must run concurrent experiments, either stratify (each user is exposed to only one experiment) or accept and document the interaction risk.

**Why:** independence is an experimental assumption. Violating it without acknowledgment produces decisions made on confounded data.

---

## 7. AI Config experimentation

### BP-7.1 Measure cost, latency, and quality together
For AI Config experiments, no single metric tells the story. A 5% quality improvement that doubles cost is not "better" without a deliberate decision. Track all three dimensions; pre-decide the trade-off rules.

**Why:** AI has multidimensional trade-offs. Single-metric experiments hide them.

### BP-7.2 Use a quality proxy you trust
"Quality" requires operationalization. Pick a proxy — satisfaction rating, downstream conversion, manual review score, an LLM-as-judge score — that the team has reason to trust. Sample it from production, not just from evals.

**Why:** quality proxies are the part of AI experimentation most prone to handwaving. The team that doesn't trust its quality metric also doesn't trust its decisions.

### BP-7.3 Pre-commit to the trade-off rules
Before the experiment: "we'll ship the new variation if quality improves and cost increases less than 20%, OR if cost decreases and quality drops less than 5%, OR ..." Make the trade-off explicit.

**Why:** post-hoc trade-off interpretation favors whatever variation the team had already preferred.

### BP-7.4 Plan for higher noise floors
AI quality metrics are noisier than traditional product metrics. Plan for larger sample sizes, longer durations, and more conservative significance thresholds.

**Why:** noise turns small effects into illusions. Power matters even more here than elsewhere.

See the [AI/GenAI lens](../../lenses/ai-genai/evaluation-and-measurement.md) for the full elaboration.

---

## 8. Results interpretation

### BP-8.1 Look at primary, secondary, and guardrails together
The team's first look at results includes the full metric set. A primary that moved with no guardrail regressions is the clear-cut case; the harder cases (mixed signals, segment-level divergence) require careful reading.

**Why:** ship/kill decisions made on the primary alone miss the side effects that define the change's full impact.

### BP-8.2 Distinguish statistical significance from practical significance
A 0.3% lift can be statistically significant on a large sample. Whether it's worth shipping depends on the operational cost of the change, the risk it introduces, and the team's bar for "meaningful improvement." Pre-decide the bar.

**Why:** significance ≠ importance. The two get conflated in experiment reviews and produce decisions made on irrelevant lift.

### BP-8.3 Be cautious with segment-level results
"It worked for power users but not new users" is a common shape. Sometimes real, sometimes a multiple-comparisons artifact. Treat segment-level findings as hypotheses for the next experiment, not as conclusions from this one.

**Why:** segment slicing inflates false-positive rates. Replication is what turns a segment finding into a real one.

### BP-8.4 Accept null results
A well-designed, well-powered experiment that produces a null result is a real finding. The team's response is to update their model, not to keep slicing until a positive result emerges.

**Why:** treating null as "we need more data" indefinitely is how teams accumulate phantom evidence.

---

## 9. Decision review and capture

### BP-9.1 Every experiment has a decision deadline at creation
Set in the experiment record, the team's tracker, or the audit log. Past the deadline, the experiment is decided or escalated.

**Why:** experiments without deadlines run forever and produce no decisions. Decisions are the point.

### BP-9.2 Capture the decision and its rationale
When an experiment ends: ship, kill, extend, or pivot. The decision is recorded with the rationale. The team can reconstruct *why* the decision was made, not just *what* was decided.

**Why:** the rationale is what informs the next experiment. Without it, the team relearns the same lessons.

### BP-9.3 Clean up after the decision
After a decision: archive the experiment, remove unused variations from the flag, delete metrics no longer needed, retire holdout segments specific to the experiment. (See the [Governance pillar BP-4.3](../governance/best-practices.md).)

**Why:** post-decision residue is the bulk of experiment debt.

### BP-9.4 Share decisions across the team
Successful and unsuccessful experiments alike are shared in writing — what was tried, what was learned, what the team will do differently. Future experiments build on this knowledge.

**Why:** institutional memory is what makes experimentation programs improve. Shared writeups create that memory.

---

## 10. Experiment governance

### BP-10.1 Maintain a portfolio view of active experiments
The team (or platform) maintains a current view of what experiments are running, by whom, on what surfaces. Reviewable at a glance.

**Why:** experimentation that no one sees doesn't get coordinated. The portfolio view is the foundation of interaction tracking and governance.

### BP-10.2 Track experiment interactions deliberately
For experiments on overlapping surfaces, decide: stratify (one experiment per user), accept and document the interaction, or sequence them. The choice is recorded.

**Why:** unmanaged concurrency confounds results. Honest concurrency management produces interpretable findings.

### BP-10.3 Review the experimentation portfolio quarterly
The team reviews: which experiments are running, which are stalled, which need decisions, which are producing learning. The review surfaces stuck experiments and reinforces decision discipline.

**Why:** experiment governance is a cadence. Without one, individual experiments drift.

### BP-10.4 For regulated experiments, involve the relevant review body
Experiments touching protected classes (fair-lending), clinical decisions, or other regulated areas involve the appropriate review body (model-risk management, clinical safety, etc.) before launch. The review is captured.

**Why:** regulatory exposure on experimentation is real and growing. The review is the control.

### BP-10.5 Build the eval pipeline (especially for AI) as a shared platform capability
For organizations running many AI experiments, the eval pipeline is platform-team work. A consistent pipeline used by many teams beats per-team improvisation.

**Why:** the alternative is each team rebuilding evals incompletely.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
