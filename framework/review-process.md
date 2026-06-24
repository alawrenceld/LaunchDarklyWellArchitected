# The Review Process

A LDWA review is a structured conversation about an LD-managed system. The goal is not to assign a score; it is to surface risk, prioritize improvements, and align the team on what to do next.

A typical review takes between two hours (for a focused review of one pillar) and a full day (for a comprehensive review of a complex system across many pillars). The format below is the recommended default.

---

## Roles

Every review has at least these roles:

- **System owner.** The engineering lead or architect accountable for the system being reviewed. Answers the review questions. Owns the resulting improvement plan.
- **Reviewer(s).** One or two people who facilitate the review. Read the relevant pillars in advance. Ask the questions, probe answers, and assign risk levels. Could be a peer architect, a platform engineer, a LaunchDarkly Solutions Architect, or a LDWA-trained partner.
- **Scribe.** Captures answers, risks, and improvement items. Often the system owner or a delegate. (The [review tool](../tool/) workbook is designed to be filled in live.)
- **Executive sponsor (optional but recommended).** A senior engineering leader who blesses the review, reviews the output, and unblocks resourcing for the improvement plan.

For a partner-led or LaunchDarkly-led review, the **reviewer** is the partner/LD SA; the customer provides the system owner, scribe, and executive sponsor.

---

## Inputs

Before the review, the system owner should prepare:

1. **A one-paragraph description** of the system being reviewed: what it does, who uses it, and how LaunchDarkly is involved.
2. **An architecture sketch.** A simple diagram showing where LaunchDarkly's SDKs live, where Relay Proxies (if any) sit, where contexts are sourced, and where data flows out.
3. **A list of the LaunchDarkly capabilities in scope** for the system (flags, experiments, AI Configs, release pipelines, observability, etc.). The [product-coverage table in the LDWA build plan](../todo.md#15-scope-launchdarkly-product-surface-area-covered-by-ldwa) is the menu.
4. **A list of pillars and lenses** that apply. Skip the ones that don't fit. A review that pretends every pillar applies is a review that gets nothing done.
5. **Any prior LDWA reviews** of this system, with their improvement plans, so the new review can measure progress.

---

## The five steps

### Step 1 — Frame the system (15 minutes)

The system owner walks through the description and sketch. The reviewers ask clarifying questions until they could draw the system themselves.

The output of this step is a shared mental model. If reviewers and the owner disagree on what the system *is*, the rest of the review will be confused.

### Step 2 — Walk the review questions (60 minutes per pillar)

For each in-scope pillar, the reviewer walks through the pillar's review questions. For each question:

- The system owner answers, with evidence (a screenshot, a config, a link to an SDK init, a paragraph of explanation).
- The reviewer probes: "and what happens if X?" "Show me where that's configured." "How would you know?"
- Together, they assign a risk level: **High Risk**, **Medium Risk**, or **None**.
- The scribe records the answer, risk level, and any improvement ideas that surfaced.

Avoid the temptation to *solve* during this step. Capture risks and ideas; defer design.

### Step 3 — Aggregate into an improvement plan (30 minutes)

Once all in-scope pillars are walked, review the captured risks together. Group related ones. Drop duplicates. For each remaining risk, capture:

- **Improvement item.** A specific change. "Add a guardrail metric to the `checkout-v2` flag" is specific; "improve experimentation" is not.
- **Owner.** A named person.
- **Effort.** Rough t-shirt size — S / M / L / XL.
- **Risk.** Inherited from the question that surfaced it.
- **Target date.** When the team intends to complete it.

Sort the list by **risk × inverse effort**: high-risk, low-effort items go to the top.

Pick the top **three to five** for immediate action. Park the rest in a backlog. Do not pretend you will fix everything.

### Step 4 — Brief the sponsor (15 minutes)

If you have an executive sponsor, brief them on:

- The overall picture (e.g., "the system is in good shape on Safe Release, weak on Governance, has one high-risk gap in Reliability").
- The top three improvement items.
- Any resourcing or political support you need.

Sponsors should review the full output asynchronously and respond within a week.

### Step 5 — Schedule the re-review

Default cadence:

- **Quarterly** for active, high-change systems.
- **Semi-annually** for stable systems.
- **Immediately** after any incident traceable to a gap surfaced in the prior review.

A re-review measures progress on the prior improvement plan, surfaces new risks since the last review, and updates the plan.

---

## Risk levels

LDWA uses three levels. Be ruthless about reserving *High Risk* for things that genuinely belong there.

| Level | Definition | Example |
|---|---|---|
| **High Risk** | A gap that could plausibly cause an incident, breach, regulatory issue, or major customer impact, and there is no compensating control. | "We have no kill switch for the new checkout flow, and the rollout is at 100%." |
| **Medium Risk** | A gap that creates operational drag, future risk, or quality erosion, but is unlikely to cause acute customer impact in the next quarter. | "We have 47 flags older than 90 days with no owner, and our archival process is ad hoc." |
| **None** | No material gap. The system meets or exceeds the best practice. | "Every customer-facing flag uses a guarded release with a guardrail metric and PagerDuty integration." |

Rules of thumb:

- If you can describe the incident the gap would cause, in one sentence, in plausible terms — it's High Risk.
- If the gap is real but you can imagine running production at this level for another quarter without it biting — it's Medium Risk.
- Don't downgrade a risk to make the review look cleaner. The point is to surface them.

---

## A note on tone

LDWA reviews are most useful when they're a collaborative conversation, not an interrogation. The reviewer's job is to help the team see their system clearly, not to score it.

If a review feels like an audit, something has gone wrong. Pause, reset, and remember the goal: surface risk, plan improvements, ship better software.

---

## Artifacts

A complete review produces:

- A **filled review workbook** (see [the review tool](../tool/)).
- An **improvement plan** with named owners and target dates.
- A **one-page executive summary**.
- A **scheduled re-review date**.

Both the workbook and the summary should be checked in alongside the system's other architecture documentation. Reviews compound — the next one is much faster when the prior one is on hand.

---

← [How to Use This Framework](./how-to-use.md) | Continue to → [Document Revisions](./revisions.md)
