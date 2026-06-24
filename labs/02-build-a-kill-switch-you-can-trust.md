# Lab 02 — Build a Kill Switch You Can Trust

**Pillars:** Safe Release & Progressive Delivery, Reliability & Resilience
**Time:** ~30 minutes
**Difficulty:** Beginner / Intermediate

---

## What you'll build

A kill switch — a flag whose explicit purpose is to disable a feature in production immediately — and the discipline around it: the documented degraded experience, the runbook entry, and the production drill that confirms it works.

Most kill switches in the wild are untested hypotheses. This lab walks you through making one that is real.

---

## Prerequisites

- A LaunchDarkly account with permissions to create flags. A free trial works.
- A test application that uses a LaunchDarkly SDK and serves user-facing behavior.
- Permission to make changes in your application's non-production environment.
- ~30 minutes during a quiet operating window (or in a sandbox).

---

## Step 1 — Identify what you're disabling

Before you create the flag, name what the kill switch *kills*.

For this lab, pick one of:

- A specific feature in your test application (a new search algorithm, a recommendation widget, a payment-method option).
- An entire product surface (a page, a section, a flow).
- A dependency on a third-party service (an LLM call, an analytics widget).

Write down: **"The kill switch disables `<feature>`. When the switch is flipped, users see `<degraded behavior>`."**

This sentence is the kill switch's contract. It has to be explicit before the switch is useful.

---

## Step 2 — Design the degraded experience

The kill switch's job is to give the user a *defined* experience, not a broken one. Think through:

- What does the page/flow look like with the feature off?
- Is there a message ("This feature is temporarily unavailable")?
- Does any state need to be preserved (a cart, an in-progress action)?
- Is there a fallback (an older algorithm, a static response, a queued action)?

For the lab, the simplest degraded experience is: "feature is hidden; user sees the prior version of the surface." Anything more sophisticated is real product work and worth doing.

**Why this matters:** "the feature is just gone" looks like an outage. "The feature is temporarily reduced and we know" looks like a product. See BP-6.3 in [Safe Release best practices](../pillars/safe-release/best-practices.md).

---

## Step 3 — Create the kill switch flag

In the LaunchDarkly UI:

- **Key:** `kill-<feature-name>` (e.g., `kill-recommendations`, `kill-new-search`). Prefix `kill-` is a strong convention.
- **Description:** "Kill switch for `<feature>`. Flip ON to disable the feature; the user sees `<degraded experience>`." Inline the contract from Step 1.
- **Tags:** `kill-switch`, `team:<your team>`, `type:operational`.
- **Permanent:** mark as a permanent flag (it's not for retirement — it's operational forever).
- **Variations:** boolean.
- **Default rule (fallthrough):** serve `false` (i.e., feature ENABLED — the kill switch is off in normal operation).
- **Off variation:** `false` (feature ENABLED). This is the *safe* state — the kill switch is off → feature on → users see the feature.

> **Note on the polarity convention.** This lab uses `false = feature on / kill switch off / normal operation` and `true = kill switch engaged / feature disabled`. The flag *name* (`kill-<feature>`) reads naturally with this polarity: "kill recommendations? false." Choose whichever polarity your team prefers, and document it. The important thing is consistency.

Save the flag.

---

## Step 4 — Wire it into the application

```pseudocode
context = {
  kind: "user",
  key: current_user.id
}

kill_switch_engaged = ldclient.boolVariation("kill-<feature>", context, false)

if kill_switch_engaged:
  render_degraded_experience()
else:
  render_normal_experience()
```

Note the fallback value: `false`. If the SDK can't reach LaunchDarkly, the kill switch is treated as *not engaged* — i.e., the feature stays on. This matches BP-7.1: the fallback value should be a value the application can survive, and for a kill switch the safer fallback is "stay on" (else a transient LD outage takes down your feature unnecessarily).

For some kill switches — particularly safety-critical ones — the safer fallback is the opposite. Choose deliberately based on the contract.

---

## Step 5 — Test the kill switch in non-production

Deploy the change to a non-production environment. Confirm:

- With the flag at default (kill switch off), the feature works normally.
- With the flag flipped on, the degraded experience renders correctly.
- The user can navigate the surface without errors or broken states.
- Any state preservation (carts, sessions, etc.) survives the flip.

Flip it back. Confirm normal operation resumes.

**This is the most important step.** A kill switch you haven't flipped in non-production is a kill switch you don't trust.

---

## Step 6 — Document the kill switch where the on-call can find it

Add the kill switch to the team's runbook for the affected surface. The runbook entry should include:

- The flag key.
- A direct link to the flag in LaunchDarkly.
- The contract sentence from Step 1.
- The expected degraded experience.
- The pre-checks before flipping (e.g., "if cart functionality is failing, confirm carts persist").
- The post-flip verification ("confirm users see the degraded state; confirm no error spike").
- The criteria for un-flipping ("when X is restored").

The runbook entry should be **findable in under 30 seconds** during an incident. Link it from the incident-response template, the on-call dashboard, or wherever the on-call looks first.

**Why this matters:** see BP-6.1. Finding the kill switch during an incident is the slow step; pre-naming and pre-linking eliminate it.

---

## Step 7 — Run the production drill

This is the lab's hardest step. Pick a low-traffic window in your production environment. (If your test application is genuinely test-only, skip this step; the principle is what matters.)

**Pre-drill:**

- Notify the team that a kill-switch drill is happening, in the window.
- Have the runbook open.
- Have observability open: error rate, latency, conversion or domain-specific metrics for the affected surface.

**Drill:**

1. Flip the kill switch ON.
2. Observe for 5 minutes:
   - Does the degraded experience render correctly?
   - Are error rates as expected (i.e., no spike)?
   - Are any side effects visible (state corruption, dependent system errors)?
3. Flip the kill switch OFF.
4. Confirm normal operation resumes within the SDK's propagation window (typically seconds).

**Post-drill:**

- Document what happened: expected vs. actual.
- Update the runbook based on anything you learned.
- Repeat quarterly.

**Why this matters:** see BP-6.2. An untested kill switch is a hypothesis. The first flip is usually the worst possible moment.

---

## Success criteria

You have completed the lab when:

- [ ] The kill switch flag exists, named clearly, with deliberate variations and fallback.
- [ ] The application code respects the kill switch and serves a defined degraded experience.
- [ ] The kill switch has been tested in non-production.
- [ ] The kill switch is documented in the team's runbook, findable in under 30 seconds.
- [ ] The kill switch has been drilled in production (or in a true production-like environment), and the drill is scheduled to repeat quarterly.
- [ ] You can articulate, in one sentence, what the kill switch does and what the user sees when it's engaged.

---

## What to do next

- Identify other product surfaces that need kill switches. Repeat the lab.
- Inventory the team's kill switches. Tag them all with `kill-switch`. Build a dashboard.
- Read the [Reliability pillar](../pillars/reliability/) for the broader context on fallbacks and graceful degradation.
- Schedule the next quarterly drill on the team's calendar before you forget.

---

## Teardown

If this was a learning exercise on a test application, archive the lab artifacts:

1. **Archive the flag.** `kill-<feature>` → Archive (only if this was a throwaway feature; if it's a real product surface, keep it).
2. **Remove the lab code** or revert the branch.

If you built this for a real product surface, **don't tear it down.** Keep the kill switch. Schedule the drill. This is the pattern you want in your system.
