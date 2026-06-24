# LDWA Scoring Model

The LDWA review uses a deliberately simple risk model. The goal is to surface the small number of things that genuinely matter, not to produce a complex score.

---

## Per-question risk levels

For each review question, the reviewer assigns one of three risk levels.

### High Risk

A gap that could plausibly cause an incident, breach, regulatory issue, or major customer impact, and there is no compensating control. The risk is concrete enough that the reviewer can describe the incident the gap would cause in one sentence.

*Examples:*
- "We have no kill switch for the new checkout flow, and the rollout is at 100%."
- "Production API tokens grant admin scope and aren't rotated."
- "FedRAMP-scoped data flows through commercial LaunchDarkly."

### Medium Risk

A gap that creates operational drag, future risk, or quality erosion, but is unlikely to cause acute customer impact in the next quarter. The reviewer can imagine running production at this level for another quarter without it biting.

*Examples:*
- "We have 47 temporary flags older than 90 days with no owner."
- "Approvals exist but coverage is inconsistent across teams."
- "Naming convention exists but isn't enforced in tooling."

### None

No material gap. The system meets or exceeds the best practice.

---

## How to choose

- **If you can describe the incident the gap would cause, in one sentence, in plausible terms — it's High Risk.**
- **If the gap is real but you can imagine running production at this level for another quarter — it's Medium Risk.**
- **If there's no material gap — it's None.** Don't downgrade real risks just to keep the picture clean.

The point of the scoring is to surface risks, not to produce a passing grade.

---

## Per-pillar aggregation

After walking all in-scope questions for a pillar, capture a **pillar summary**: two to three sentences describing the team's overall posture.

Don't compute a numeric pillar score. The information that matters is the *count and nature* of the high-risk and medium-risk findings, plus the prose summary. A "pillar score" obscures more than it reveals.

---

## Overall maturity (optional)

If your context needs a single overall indicator (e.g., for executive reporting), use the **maturity scale** below. It's qualitative, not numeric.

| Maturity | Description |
|---|---|
| **Foundational** | Multiple high-risk findings or large gaps across pillars. The team has core practices to put in place before optimization. |
| **Managed** | A small number of high-risk findings, several medium-risk. The team has the basics; specific gaps are being closed. |
| **Effective** | No high-risk findings; modest medium-risk findings. The team operates well; improvements are incremental. |
| **Exemplary** | No high-risk findings; few medium-risk; multiple notable strengths. The team's practice is reference-worthy. |

The maturity rating is a per-review qualitative judgment by the reviewer, not a computed value.

---

## What the score *isn't*

- It isn't a grade for the team. Reviews surface risks; they don't evaluate individuals.
- It isn't a comparison across teams. Different systems have different contexts; comparing scores across them is misleading.
- It isn't a blocker for shipping. A review identifies risks; the team decides what to do with them, including accepting them.
- It isn't useful with stale data. Risk levels assigned a year ago, against an older framework version, don't carry forward as-is.

---

## Re-review delta

When a re-review happens, compare:

- **High-risk count** vs. last review.
- **Medium-risk count** vs. last review.
- **Improvement items completed** from the last plan.
- **New findings** that emerged since the last review.

A successful improvement cycle:

- High-risk count is lower or zero.
- Improvement items from the prior plan are largely complete or have documented status.
- New findings reflect system evolution, not deferred work.
