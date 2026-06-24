# Experimentation & Measurement — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The hypothesis written after the data

**Shape:** An experiment runs. Results come in. The team writes the "hypothesis" to match whatever pattern the data shows. The "result" confirms the "hypothesis."

**Why it's an anti-pattern:** post-hoc hypothesis writing produces zero information. The team has not learned anything; they have rationalized.

**Symptom:** experiment write-ups where the hypothesis and the result agree with suspicious consistency.

**Remedy:** lock the hypothesis before the experiment starts. Treat it as the falsifiable claim the data will test.

---

## AP-2. The multi-primary confusion

**Shape:** An experiment is configured with three "primary" metrics. One moves up. One moves down. One is flat. The team picks whichever moves up as the result.

**Why it's an anti-pattern:** experiments with multiple primaries have no single decision criterion. The team will always find a metric that supports the preferred decision.

**Symptom:** the experiment's "result" tends to match the proposer's pre-experiment preference.

**Remedy:** pick one primary. Other relevant metrics are secondaries or guardrails. Trade-off rules are pre-committed.

---

## AP-3. The peek-and-decide trap

**Shape:** The team checks experiment data daily. On day 4, primary is up 3% with p=0.04. The team ships. They don't realize their repeated peeks have inflated the false-positive rate well above the nominal 5%.

**Why it's an anti-pattern:** repeated peeks at fixed-horizon data produce statistically over-confident decisions. The team believes they have stronger evidence than they actually do.

**Symptom:** ship decisions that don't replicate or hold up at scale.

**Remedy:** either use sequential / always-valid tests designed for ongoing peeking, or pre-commit to a sample size and don't decide until you hit it.

---

## AP-4. The unpowered experiment

**Shape:** The team runs an experiment on a low-traffic surface for two weeks. The primary metric appears flat. The team concludes "no effect." In reality, the experiment had only a 20% chance of detecting the effect size the team would have shipped for.

**Why it's an anti-pattern:** absence of evidence isn't evidence of absence. The team has concluded a null result from data that couldn't have shown a positive one.

**Symptom:** "we tested it and it didn't work" for changes that go on to succeed elsewhere or after redesign.

**Remedy:** estimate power before launching. If the experiment can't be adequately powered, either extend, accept the limitation, or use a different evaluation method.

---

## AP-5. The 30-day-retention experiment that ran for 7 days

**Shape:** The team launches an experiment on a feature whose effect is expected to compound over weeks. They run it for one week, see a small lift, ship. The lift doesn't sustain.

**Why it's an anti-pattern:** the experiment measured something other than what the team thought. Short observation can't measure long-window effects.

**Symptom:** ship decisions based on early metrics that diverge from long-term outcomes.

**Remedy:** match experiment duration to metric behavior. For long-window metrics, accept long durations or use surrogate metrics with caution.

---

## AP-6. The metric whose definition shifted

**Shape:** The experiment is set up with a "conversion rate" metric. Mid-experiment, someone notices that "conversion" is counting users twice in some edge case. The metric is "corrected." The conversion rate jumps. The team interprets the jump as a treatment effect.

**Why it's an anti-pattern:** mid-experiment metric changes confound the result with the metric-definition change.

**Symptom:** mid-experiment "improvements" to metrics produce unexpected, hard-to-replicate effects.

**Remedy:** pre-define metric calculations. Treat metric-definition changes as a separate event from the experiment; either re-baseline or restart.

---

## AP-7. The segment fishing expedition

**Shape:** The experiment shows no overall effect. The team slices the data: by country, by device, by tenure, by plan, by traffic source. Eventually, a segment shows a "significant" lift. The team ships for that segment.

**Why it's an anti-pattern:** with enough slices, *some* segment will show a significant result by chance alone. The team has discovered a statistical artifact, not a real effect.

**Symptom:** segment-targeted launches that don't hold up when measured directly.

**Remedy:** treat segment findings as hypotheses for the next experiment, not conclusions from this one. Apply multiple-comparisons corrections when slicing.

---

## AP-8. The experiment with no decision

**Shape:** The experiment ran four months ago. Results are in. The team never made a formal decision. The flag is at 50% — half of users see the treatment, half see the control — indefinitely.

**Why it's an anti-pattern:** the experiment is now a permanent split. Half of users get the treatment forever; the team never decided that was right.

**Symptom:** the flag's rollout state has been stable for many months with no associated decision in the record.

**Remedy:** every experiment has a decision deadline. Past the deadline, force a decision or escalate.

---

## AP-9. The forever holdout

**Shape:** A holdout was created two years ago to measure a feature's long-term impact. The original team has moved on. The holdout still exists; nobody remembers why; the users in it are missing the last 18 months of product improvements.

**Why it's an anti-pattern:** unowned holdouts produce data nobody acts on while denying users improvements.

**Symptom:** the team can't articulate the purpose of an active holdout.

**Remedy:** every holdout has a documented purpose, owner, and end date. Reviews catch the abandoned ones.

---

## AP-10. The successful guarded release reported as a "+5% lift"

**Shape:** A guarded release completes without rolling back. Someone summarizes the rollout as "the new variation drove a 5% lift." The 5% is whatever number the guardrail tracking showed during the rollout. It isn't an experiment result.

**Why it's an anti-pattern:** guarded releases measure *whether the variation degraded* — not *how much it improved*. Numbers from guarded rollouts shouldn't be reported as treatment effects.

**Symptom:** "experiment results" that are actually guarded-release telemetry.

**Remedy:** if the team needs to know the magnitude of improvement, run an experiment (or a guarded release with experiment-grade statistical design). Don't conflate.

---

## AP-11. The concurrent experiments that interacted

**Shape:** Two teams run experiments on the same product surface in the same week. Both ship their treatments. Neither effect replicates when applied alone. The original experiments captured an interaction effect, not the standalone effect of either change.

**Why it's an anti-pattern:** concurrent experiments on overlapping surfaces confound each other when not stratified. The team makes ship decisions on data that doesn't measure what they think it measures.

**Symptom:** experiment results that don't hold up after the ship.

**Remedy:** stratify (each user in only one experiment) or sequence (don't run them concurrently). At minimum, document the overlap.

---

## AP-12. The AI experiment that ignored cost

**Shape:** The team runs an experiment comparing two AI variations. The new variation shows a 4% lift in satisfaction. The team ships. The new variation also costs 3× more per call. The LLM bill triples; nobody planned for it.

**Why it's an anti-pattern:** single-dimensional AI experiments hide trade-offs that matter to the business.

**Symptom:** post-launch finance surprises.

**Remedy:** AI experiments measure cost, latency, and quality together, with pre-committed trade-off rules. See the [AI/GenAI lens](../../lenses/ai-genai/evaluation-and-measurement.md).

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
