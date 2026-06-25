# Experimentation / Growth — Anti-Patterns

A catalogue of common, named failure modes for high-volume experimentation teams.

---

## AP-1. The shotgun portfolio

**Shape:** The team runs 40 experiments simultaneously. Nobody can name them all. Some overlap on the same surface. Some affect the same metric in opposite directions. The team's "experimentation throughput" looks high but the signal-to-noise ratio is terrible.

**Why it's an anti-pattern:** volume without coherence produces confusion, not learning. Each individual experiment may be sound, but the portfolio is incoherent.

**Symptom:** the team can't articulate the strategy behind the current experiment set.

**Remedy:** portfolio thinking. Prioritize by hypothesis impact. Stagger to manage interactions. Make portfolio coherence a goal, not just throughput.

---

## AP-2. The forgotten decision

**Shape:** The experiment ran to its decision date. The data is in. Nobody made a call. Two months later, the experiment is still "running" — half the traffic on treatment, half on control — providing no signal and no decision.

**Why it's an anti-pattern:** undecided experiments are residue. Half of users get treatment indefinitely without a deliberate choice to ship.

**Symptom:** experiments with stable splits older than their decision date.

**Remedy:** decision review cadence. Escalation for stalled decisions. Force a decision or document the extension.

---

## AP-3. The post-hoc segment-finder

**Shape:** Experiment shows no effect on the primary metric. The owner slices the data by country, by plan, by tenure, by device. Eventually a segment shows a statistically-significant lift. The team ships for that segment. Six months later, the segment-specific feature doesn't replicate.

**Why it's an anti-pattern:** with enough slices, *some* slice shows a "significant" effect by chance. The team has discovered noise, not signal.

**Symptom:** segment-targeted launches that don't hold up at scale.

**Remedy:** treat segment findings as hypotheses for the next experiment, not conclusions from this one. Apply multiple-comparison corrections.

---

## AP-4. The unowned holdouts

**Shape:** The team has six holdouts running. Nobody can articulate the purpose of three of them. Two were created by an engineer who left. The fourth was for a project that completed two years ago but the holdout persists. The holdouts collectively exclude 8% of users from current product improvements.

**Why it's an anti-pattern:** holdouts are an investment in long-run learning. Unmaintained holdouts are just user-exclusion with no payoff.

**Symptom:** the team can't justify each holdout's existence.

**Remedy:** quarterly holdout review. Documented purposes. Retire holdouts whose work is done.

---

## AP-5. The peek-and-decide trap

**Shape:** The team checks experiment data daily. Day 3, the primary metric is up 5% with p=0.04. They ship. The experiment didn't have a sequential design; the team's repeated peeks inflated the false-positive rate.

**Why it's an anti-pattern:** repeated peeks at fixed-horizon data produce over-confident decisions. The team thinks they have strong evidence; they have noise.

**Symptom:** ship decisions that don't replicate at scale.

**Remedy:** either commit to the planned sample size and don't peek, or use sequential / always-valid statistical methods designed for ongoing peeking.

---

## AP-6. The conflated experiment and rollout

**Shape:** The team uses an "experiment" to run a guarded rollout. Or they use a guarded rollout to make a ship decision based on the lift number. The two disciplines blur. Decisions are made on data not designed for them.

**Why it's an anti-pattern:** experiments measure decision-quality treatment effects; guarded rollouts measure regression-detection. The numbers don't transfer between contexts.

**Symptom:** "experiment results" that are actually guarded-rollout telemetry, or vice versa.

**Remedy:** maintain the discipline. If you need to decide, run an experiment. If you need to ship safely, run a guarded rollout. They're different operations.

---

## AP-7. The portfolio-counter-metric blind spot

**Shape:** The team has shipped 50 small wins this year, each moving the primary metric up by 1-3%. They didn't track counter-metrics at the portfolio level. The customer-satisfaction score is down 8%. The cumulative effect of 50 small UX changes degraded the overall experience.

**Why it's an anti-pattern:** each experiment looked positive in isolation. Together, they had a different effect. Without portfolio-level tracking, the cumulative damage is invisible.

**Symptom:** primary metrics improve while satisfaction / retention / engagement decline.

**Remedy:** portfolio-level counter-metric tracking. Periodic review. Be willing to roll back a successful experiment when portfolio damage is detected.

---

## AP-8. The metric whose definition drifted

**Shape:** "Conversion rate" is measured differently by the growth team and the product team. Two experiments both claim to "increase conversion" but one uses a 30-day window and the other uses 7-day. The team's reports don't reconcile. The data warehouse has three columns named conversion_rate with different calculations.

**Why it's an anti-pattern:** metric drift at high volume produces uninterpretable results. Decisions made on different metrics with the same name are confusing.

**Symptom:** when reports disagree, nobody can quickly explain why.

**Remedy:** metric catalog with single definitions and owners. The catalog is the source of truth.

---

## AP-9. The bandit that broke the experiment

**Shape:** The team configures a multi-armed bandit on a complex decision. The bandit converges quickly to "winning" variation, starving the others of traffic. Months later, the team wants to compare again — they have rich data on the bandit-winner and almost no data on the alternatives. The "winning" choice was based on an early signal that may not have held up.

**Why it's an anti-pattern:** bandits trade learning for exploitation. They're the wrong choice when learning matters more.

**Symptom:** bandit "winners" that aren't characterizable beyond "the bandit picked them."

**Remedy:** choose the statistical method deliberately. Use bandits when exploitation matters; use experiments when learning matters.

---

## AP-10. The fast flywheel that's actually noise

**Shape:** The team ships 30 experiments per quarter. The win rate is 50%. The team feels productive. After two years, the cumulative effect on the primary metric is... ambiguous. Each "win" was small; some didn't replicate; the noise floor was high.

**Why it's an anti-pattern:** velocity without effect size doesn't compound. Many small noise-level "wins" don't produce meaningful business improvement.

**Symptom:** experiment win rate looks good but the business KPI hasn't moved meaningfully.

**Remedy:** focus on hypotheses with larger expected effect, even if they're rarer. Replication for important results. Calibration practice to honestly assess whether the team is moving the needle.

---

## AP-11. The personalization that calcified

**Shape:** The team set up personalization rules a year ago based on what experimentation showed worked. Personalization runs based on those rules indefinitely. The team stopped experimenting on those surfaces — "we already optimized them." User preferences shifted; the product changed; the rules no longer reflect what works.

**Why it's an anti-pattern:** personalization needs ongoing experimentation to stay current. Without it, the personalized experience drifts from optimal.

**Symptom:** personalization rules haven't been validated in over a year.

**Remedy:** continue experimenting on personalized surfaces, even if at lower intensity. Refresh the rules periodically based on new data.

---

## AP-12. The growth team without veto

**Shape:** The growth team is highly autonomous. They run experiments and ship wins without external review. A pricing experiment ships and lifts conversion by 4% — but the change devalues customer relationships and is contractually problematic. The legal / brand / finance teams find out from a customer complaint.

**Why it's an anti-pattern:** experiments on certain surfaces (pricing, brand-relevant, regulated) have implications beyond the metric being optimized. Autonomy without escalation rules is a risk.

**Symptom:** post-launch corrections to experiment results that didn't go through appropriate review.

**Remedy:** documented escalation criteria. Veto authority for the surfaces that need it. The growth team's autonomy is bounded by these.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
