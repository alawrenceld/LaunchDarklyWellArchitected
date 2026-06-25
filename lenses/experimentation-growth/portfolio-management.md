# Portfolio Management

Running many concurrent experiments without confounding them, capturing decisions efficiently, and learning across the program. This page covers the operating practices that distinguish a healthy high-volume experimentation program from a chaotic one.

---

## The portfolio view

A team running 30+ concurrent experiments needs a portfolio-level view. The minimum viable shape:

| Column | Content |
|---|---|
| Experiment name | Short, descriptive |
| Owner | Engineer or product manager accountable |
| Surface | Which product surface is affected |
| Audience scope | Who's in the experiment (segment, percentage, geography) |
| Primary metric | The one metric the experiment will be decided on |
| Status | Designing / Running / Decided / Archived |
| Phase | Within Running: ramp, full-power, decision-pending |
| Decision date | When the team has committed to making a call |
| Notes | Anything reviewers should know |

This is a spreadsheet, a Notion database, an internal tool — whatever the team can pull up in 30 seconds. The format matters less than the content being current.

### Why the portfolio view matters

- **Interaction detection.** "Are we running two experiments on checkout simultaneously?" can be answered at a glance.
- **Decision triage.** "What experiments are due for decision this week?" surfaces the work.
- **Capacity check.** "Do we have bandwidth for another experiment on this surface?"
- **Strategy alignment.** Leadership can see what the team is investing experimentation effort in.

---

## Interaction management

When two experiments touch the same surface or overlapping audiences, their effects can interact. Three approaches:

### Approach 1 — Stratify

Each user is enrolled in at most one experiment per "surface stratum." A user assigned to Experiment A on the checkout flow is excluded from Experiment B on the checkout flow.

**Pros:**
- Clean results; no interaction confounds.
- Standard statistical analysis applies directly.

**Cons:**
- Lower experimental throughput; the same user-pool serves multiple experiments serially.
- Coordination overhead — the team must know which experiments are on which strata.

Stratification is the right choice when experiments are likely to interact and clean results matter.

### Approach 2 — Accept and document

Two experiments run concurrently on overlapping users. The team accepts that effects may interact and documents the trade-off: "this experiment's result is the marginal effect given Experiment B is also running."

**Pros:**
- Maximum throughput.
- For experiments where interaction is unlikely (independent product surfaces, distant funnel positions), the trade-off is minimal.

**Cons:**
- Result interpretation is more careful.
- If interactions turn out to matter, the experiment may need re-run in isolation.

### Approach 3 — Sequence

Two experiments that would interact run one after the other. The first decides; then the second runs against the new baseline.

**Pros:**
- Clean results; no interaction.

**Cons:**
- Slower; throughput limited.
- The second experiment runs against a changed baseline, complicating year-over-year comparisons.

### Choosing

For most growth teams: a mix. Mainline experiments stratify; lower-risk experiments accept-and-document; high-stakes experiments sequence.

The team's choice for each new experiment is captured in the portfolio view.

---

## Holdouts at scale

A growth team typically maintains multiple holdouts:

| Holdout | Purpose | Duration |
|---|---|---|
| Quarterly cumulative holdout | Measure the cumulative effect of all changes shipped this quarter | One quarter |
| Long-run holdout | Measure compounding effects of growth changes on retention | Two-plus quarters |
| Sub-feature holdouts | Specific to a major feature launch | Aligned with the feature's evaluation period |
| Bandit-exclusion holdouts | A small population excluded from bandit-driven personalization | Ongoing |

### Holdout discipline at volume

- **Total holdout fraction.** The sum of users across holdouts comes from a finite population. The team's policy on the maximum percentage of users in holdouts matters.
- **Documented purpose.** Every holdout has a "why does this exist?" answer.
- **Rotation.** Holdouts that have been running too long become stale (users in them are now meaningfully different from the broader population). Rotate periodically.
- **Exit criteria.** "We retire this holdout when X" is part of its definition.

### Holdout review

Quarterly: review the holdout portfolio. Which are still earning their keep? Which can retire? Which new holdouts should be added?

---

## Decision velocity

A high-volume program needs decision discipline at matching velocity. Patterns:

### Pattern 1 — Pre-committed decision rules

Every experiment, at launch, has a written decision rule: "we ship if X moves by Y% with no guardrail regression more than Z%." When the data comes in, the decision is mechanical.

### Pattern 2 — Decision review cadence

A standing meeting (weekly or biweekly) where the team reviews experiments past their decision date. Decisions are made in the meeting; documented in the portfolio view.

### Pattern 3 — Asynchronous decision capture

For experiments with clear-cut outcomes, the decision can be captured asynchronously: the owner posts the result, the team reviews, the decision is logged. The standing meeting handles the borderline cases.

### Pattern 4 — Auto-decision for certain experiment types

For low-stakes experiments (UI text variations, color choices), a guarded rollout's automatic decision may be sufficient — the rollout ships the winner without a human decision step.

For high-stakes experiments, manual decisions remain.

### Pattern 5 — Escalation for stalled decisions

An experiment past its decision date by N days (typical: 14 days) gets escalated. The owner is asked to either make a decision or extend the experiment with rationale. Without escalation, stalled experiments accumulate.

---

## Capturing decisions for the long run

Each decision becomes the team's institutional memory. The capture:

- **The hypothesis.** What did we expect?
- **The data.** What did we observe?
- **The decision.** What did we decide?
- **The rationale.** Why?
- **The follow-up.** What's next based on this learning?

Captured in a place the team can search later. The future experiment that builds on this one references it directly.

### The "null-results digest"

A monthly or quarterly summary of experiments that didn't move the needle. Useful for:

- Avoiding re-running ideas that have already been tested.
- Identifying patterns in what doesn't work.
- Calibrating the team's intuition.

The team that publishes a null-results digest gets better at picking experiments over time.

---

## Multi-armed bandits and adaptive designs

For some decisions (content optimization, layout choices), multi-armed bandits optimize during the experiment by directing more traffic to better-performing variations. Trade-offs:

**Pros:**
- More users see the winning variation during the experiment.
- Total regret (lost performance from showing inferior variations) is minimized.

**Cons:**
- Learning *about* the variations is sometimes worse — sub-optimal variations get less traffic and become harder to characterize.
- Statistical analysis is more involved.
- Interpretation of "the winner" is bandit-specific.

For growth teams, bandits work well when:

- The metric being optimized is short-horizon (the bandit can adapt within the relevant window).
- The team prioritizes exploitation over learning.
- The variations are commensurable (you're not comparing apples to oranges).

For each new bandit experiment, the team makes the choice deliberately: "we use a bandit here because [reason]." The default isn't bandit; it's the simpler A/B.

---

## Personalization

Personalization — different users get different experiences based on what's worked for them — is enabled by experimentation but distinct from it.

The relationship:

- **Experimentation discovers** what works on average and for which segments.
- **Personalization deploys** the discovered patterns at the per-user level.

A team that does personalization well typically:

- Maintains a "what we know" database of segment-tested results.
- Has infrastructure that applies these learnings dynamically.
- Continues to run experiments to keep the knowledge fresh (preferences drift; product changes; the world changes).
- Has a holdout that's excluded from personalization, providing a baseline.

Personalization without ongoing experimentation calcifies. Experimentation without personalization deployment misses the operational upside.

---

## The growth-team operating model

High-volume experimentation usually requires a dedicated operating model:

- **Growth product manager(s)** — own the experiment pipeline, prioritization, decisions.
- **Growth engineer(s)** — implement the experiments, manage the instrumentation.
- **Growth analyst(s)** or data scientists — design experiments, interpret results, build the analysis pipeline.
- **Platform team** — provides the infrastructure (experimentation platform, metric libraries).

For very small organizations, these roles may collapse into one or two people; for large ones, multiple growth teams may operate in parallel.

---

## A minimum-viable growth portfolio setup

For a team operating high-volume experimentation:

- [ ] Portfolio view (spreadsheet, database, tool) maintained current.
- [ ] Interaction management policy (stratify / accept / sequence per experiment).
- [ ] Holdout policy and current holdout list, with documented purposes and rotation.
- [ ] Decision review cadence (weekly or biweekly).
- [ ] Decision-capture template used for every experiment outcome.
- [ ] Null-results digest published periodically.
- [ ] Statistical method choice documented per experiment (frequentist, sequential, bandit).
- [ ] Pre-committed decision rules in every experiment record.
- [ ] Escalation procedure for stalled decisions.
- [ ] Cumulative-counter-metric tracking at the portfolio level.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Growth-Team Patterns](./growth-team-patterns.md)
