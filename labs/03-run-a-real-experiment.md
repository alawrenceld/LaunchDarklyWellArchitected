# Lab 03 — Run a Real Experiment

**Pillars:** Experimentation & Measurement, Safe Release
**Time:** ~45 minutes setup; ~1–4 weeks runtime
**Difficulty:** Intermediate

---

## What you'll build

A complete LaunchDarkly experiment from hypothesis to decision: a flag with at least two variations, a primary metric, guardrail metrics, a pre-committed decision rule, and a structured decision capture at the end.

By the time you're done you will have:

- Written a falsifiable hypothesis before any code shipped.
- Configured an experiment with primary, secondary, and guardrail metrics.
- Run the experiment to a planned sample size.
- Recorded a decision with rationale.
- Archived the experiment artifacts.

The goal is not to discover something earth-shaking; it's to internalize the *discipline* of experimentation that the [Experimentation pillar](../pillars/experimentation/) describes.

---

## Prerequisites

- A LaunchDarkly account with Experimentation enabled. A trial works for the setup; running to a meaningful sample size needs real traffic.
- A test application that uses an SDK and serves enough traffic to power a small experiment in a reasonable window (~1,000 user-visits per variation is a useful floor for lab purposes).
- A team member or stakeholder to act as the experiment's "decision approver" — even if it's just you.

---

## Step 1 — Write the hypothesis (before anything else)

In a doc, an issue, or the experiment description field, write the hypothesis. The shape:

> **We believe that** `[change]` **will cause** `[expected effect]` **because** `[mechanism]`**, measured by** `[primary metric]` **with a target lift of** `[magnitude]`**.**
>
> **Guardrails:** `[what must not get worse]`
>
> **We will keep the new variation if:** `[condition]`
> **We will kill the new variation if:** `[condition]`
> **Otherwise:** `[extend / pivot / revise]`

Concrete example for the lab:

> We believe that **showing a progress bar during the wait state** will cause **users to wait longer instead of bouncing** because **the bar reduces uncertainty**, measured by **wait-completion rate** with a target lift of **5–10%**.
>
> Guardrails: page latency must not increase by more than 50ms; error rate must not increase at all.
>
> We keep the variation if wait-completion rate improves by ≥3% with no guardrail regressions.
> We kill the variation if wait-completion rate is flat or worse, or any guardrail regresses meaningfully.
> Otherwise we extend by 7 days, then decide.

**Lock it.** No changes after this point without an explicit "we're revising the hypothesis" decision.

**Why this matters:** the hypothesis is the experiment's commitment to a falsifiable claim. Without it, the team will rationalize whatever the data shows. See [Experimentation BP-1.1](../pillars/experimentation/best-practices.md).

---

## Step 2 — Estimate sample size

Use any sample-size calculator (LaunchDarkly has one built in; many free ones online). Inputs:

- Baseline rate for the primary metric (e.g., current wait-completion rate is 40%).
- Minimum detectable effect (e.g., 3% absolute lift).
- Statistical power (default to 80%).
- Significance threshold (default to 0.05).

Compute the required users per variation. Estimate the runtime based on your traffic.

Example: at 1,000 user-visits per day, 40% baseline, 3% MDE, 80% power → roughly 4,500 users per variation → ~9 days for a 50/50 split.

If the runtime is too long for the lab, scale up your MDE or accept lower power and document the constraint.

**Why this matters:** sample-size planning sets expectations. An underpowered experiment that ends "no clear effect" was always going to end that way. See [Experimentation BP-4.1](../pillars/experimentation/best-practices.md).

---

## Step 3 — Configure the flag and metrics

In LaunchDarkly:

1. **Create a multivariate or boolean flag.**
   - Key: `lab-experiment-progress-bar` (or whatever your lab uses).
   - Description: include the hypothesis (or a link).
   - Tags: `lab`, `experiment`, `team:<your team>`.

2. **Define metrics.**
   - **Primary:** the metric your hypothesis predicts will move (e.g., `wait-completion-rate`).
   - **Secondary:** related metrics that provide context (e.g., `bounce-rate`, `time-to-complete`).
   - **Guardrails:** what must not regress (e.g., `page-load-latency-p95`, `client-error-rate`).
   - Optionally a **counter-metric:** something that might get worse as a side effect.

3. **Wire the application to emit the metric events.**

```pseudocode
context = { kind: "user", key: current_user.id }
show_progress_bar = ldclient.boolVariation("lab-experiment-progress-bar", context, false)

if show_progress_bar:
  render_with_progress_bar()
else:
  render_without_progress_bar()

# track the metric events
on_wait_completed:
  ldclient.track("wait-completion-rate", context)
on_page_loaded:
  ldclient.track("page-load-latency-p95", context, latency_ms)
```

**Why this matters:** pre-defined, pre-instrumented metrics prevent the "we'll add the metric after we see the data" anti-pattern. See [Experimentation BP-2.4](../pillars/experimentation/best-practices.md).

---

## Step 4 — Configure the experiment

In LaunchDarkly's experimentation UI:

- Create an experiment on the flag.
- Assign the primary, secondary, and guardrail metrics.
- Configure the audience: a 50/50 split is a fine default for the lab. Stratify if needed (e.g., exclude internal users, exclude already-treated segments).
- Set the experiment to run until the pre-committed sample size is reached. Resist the temptation to set "run until significant."

**Why this matters:** committing to a planned duration or sample size avoids the peek-and-decide trap. See [Experimentation AP-3](../pillars/experimentation/anti-patterns.md).

---

## Step 5 — Launch and don't peek

Start the experiment. Walk away.

If you must check progress: look at sample sizes (have we reached our target?) and any guardrail alerts. Resist the temptation to look at the primary until you've hit the planned sample size.

If you're using a sequential / always-valid testing method (LaunchDarkly supports this), monitoring is statistically valid. If you're not, peeking inflates your false-positive rate.

**Why this matters:** disciplined waiting is the experimentation skill most teams lack. See [Experimentation BP-4.3](../pillars/experimentation/best-practices.md).

---

## Step 6 — Read the results, full set

Once the planned sample size is reached:

1. Look at the **primary** metric. Did it move? In which direction? By how much? With what confidence?
2. Look at the **guardrails**. Did any regress? By how much?
3. Look at the **secondaries**. What do they tell you about *why*?
4. Note the **practical significance**: is the effect size big enough to ship for?

Apply the pre-committed decision rule. Do not change the rule now.

**Why this matters:** the team that decides post-hoc is the team that ships whatever they were going to ship anyway. Pre-commitment is the discipline. See [Experimentation BP-1.3](../pillars/experimentation/best-practices.md).

---

## Step 7 — Capture the decision

Write down, in the experiment record or a linked doc:

- **The decision:** ship / kill / extend / pivot.
- **The data:** the metric values, with confidence.
- **The rationale:** why this decision, given the data.
- **What we learned:** beyond the immediate ship/kill, what does this tell the team?
- **Next steps:** if shipping, when does the rollout complete? If killing, what's next? If extending, when does the deadline move to?

The decision-approver signs off.

**Why this matters:** captured decisions create institutional memory. Future experiments build on them. See [Experimentation BP-9.2](../pillars/experimentation/best-practices.md).

---

## Step 8 — Clean up

After the decision:

1. **If shipping:** complete the rollout to 100% via a normal rollout pattern. Archive the losing variation. Update code if applicable.
2. **If killing:** roll the flag back to control. Remove the variation from the flag (or archive). Remove the code path for the killed variation.
3. **Archive the experiment** in LaunchDarkly. The artifact-cleanup discipline from [Governance BP-4.3](../pillars/governance/best-practices.md) applies.
4. **Update the team's experiment log** (or wiki, or whatever you use). Share what you learned.

---

## Success criteria

You have completed the lab when:

- [ ] You wrote a falsifiable hypothesis before any code shipped.
- [ ] You estimated sample size before launching.
- [ ] Primary, secondary, and guardrail metrics were instrumented and configured before launch.
- [ ] The experiment ran to its planned sample size without you peeking-and-deciding.
- [ ] You read the full result set (primary + secondaries + guardrails) before deciding.
- [ ] You captured a decision with rationale.
- [ ] You cleaned up the artifacts.

---

## What to do next

- Read the [Experimentation pillar](../pillars/experimentation/) end-to-end.
- Run a real experiment on a real product surface in your team. Apply the same discipline.
- If you're doing AI experimentation, layer in the [AI/GenAI Lens](../lenses/ai-genai/evaluation-and-measurement.md) — the cost/latency/quality trade-off discipline matters.

---

## Teardown

If you ran the lab on a throwaway feature, archive the flag and metrics. If you ran it on a real product surface, the cleanup in Step 8 is the teardown.
