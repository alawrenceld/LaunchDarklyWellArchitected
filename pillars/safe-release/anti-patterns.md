# Safe Release — Anti-Patterns

A catalogue of common, named failure modes. If you recognize one of these in your system, treat it as a finding in your next review.

---

## AP-1. The big-bang flip

**Shape:** A flag is created. It is flipped from `off` to `on` for 100% of users in a single change. Often justified as "it's a small change" or "we already tested it."

**Why it's an anti-pattern:** the flag's defining value — *progressive*, *reversible* exposure — is bypassed. The change has the same blast radius as a deploy, but without the deploy's review gates.

**Symptom in the audit log:** a flag goes from 0% to 100% with no intermediate steps.

**Remedy:** require progressive exposure (even just 10% → 50% → 100% with brief observation windows) as the default; reserve the big-bang for kill switches.

---

## AP-2. The placebo guardrail

**Shape:** A guarded release is configured with a metric that doesn't actually move when the feature changes. Common placeholders: total request count, total error count without dimensions, generic SRE indicators that aren't sensitive to the specific change.

**Why it's an anti-pattern:** the team has the *appearance* of safety. Confidence is high; actual protection is zero.

**Symptom:** every guarded release "passes." Nobody can name a time the guardrail caught a real regression.

**Remedy:** for each guarded release, pick metrics that *would* have detected the last incident in this area. If you can't name one, the metrics are wrong.

---

## AP-3. The orphan kill switch

**Shape:** A kill switch exists. Nobody on the current team knows it exists. It was created two years ago by someone who has since left.

**Why it's an anti-pattern:** in an incident, the team doesn't reach for the kill switch because they don't know it's there. The five minutes spent finding it is the five minutes of customer impact.

**Symptom:** during incident review, someone says "wait, I think there's a flag for this somewhere."

**Remedy:** document kill switches in a place the on-call sees during an incident (runbook, channel topic, LD UI tag). Re-confirm quarterly that the team can name them.

---

## AP-4. The untested fallback

**Shape:** SDK calls pass a fallback value. The fallback path has never been exercised. Nobody knows whether the application works under it.

**Why it's an anti-pattern:** the fallback is invoked precisely when things are already going wrong. Discovering that it doesn't work, in that moment, compounds the incident.

**Symptom:** an incident where "the LD service was slow, and we discovered our app didn't handle the fallback well."

**Remedy:** automated tests exercise the fallback path. Periodic chaos drills (or planned offline-mode periods) confirm it in production-like conditions.

---

## AP-5. The pipeline nobody uses

**Shape:** The team built a Release Pipeline. It has 11 phases. Engineers find it annoying and bypass it with ad-hoc rollouts.

**Why it's an anti-pattern:** the pipeline is a costless governance artifact that creates the illusion of consistency. The actual releases happen outside it, ungoverned.

**Symptom:** the pipeline's phases haven't advanced in months. The same flags ship via ad-hoc rollouts repeatedly.

**Remedy:** shorten the pipeline until it's the easiest path. If a long pipeline is required by policy, examine whether the policy is calibrated to the actual risk.

---

## AP-6. The "we tested it in staging" rollout

**Shape:** A change is rolled out to 100% in production because it tested cleanly in staging. No progressive exposure, no guardrails — staging said it was fine.

**Why it's an anti-pattern:** staging is not production. The interaction with real traffic, real data, real users, and real load surfaces failures that staging never can.

**Symptom:** post-incident, the team says "but it worked in staging."

**Remedy:** treat staging as one ring in a progressive rollout, not as a substitute for one. Every customer-facing release earns progressive exposure regardless of how clean staging was.

---

## AP-7. The 1% ambush

**Shape:** A change rolls out to 1% of users. Metrics look fine. The team increases to 100%. Surprise: 1% of users was a non-representative slice (internal staff, low-traffic geography, a customer segment that doesn't exercise the feature).

**Why it's an anti-pattern:** progressive exposure works only if the early rings *exercise* the feature. A 1% slice that doesn't hit the new code is no evidence at all.

**Symptom:** rollouts pass the early rings, then fail at high percentages.

**Remedy:** sanity-check the composition of early rings. Confirm that the slice exercises the feature meaningfully. Where it doesn't, use a representative segment instead of a percentage.

---

## AP-8. The model that shipped to everyone

**Shape:** Someone changes the AI Config to point at a new model (or a new system prompt). The change goes live for 100% of users immediately. Quality drops, cost spikes, latency degrades — usually some combination.

**Why it's an anti-pattern:** AI Config changes are user-facing releases with outsized, hard-to-predict blast radius. Treating them as configuration tweaks invites disasters that flag-shaped releases prevent.

**Symptom:** the LLM bill triples overnight; user feedback shifts; the team blames "the new model" without being able to localize the change.

**Remedy:** every AI Config change is a release with progressive exposure, cost/latency/quality guardrails, and a defined rollback path.

---

## AP-9. The schedule with no approver

**Shape:** A scheduled change is configured to promote a flag to 50% on Tuesday. Nobody reviews the schedule. Tuesday arrives. Something else has changed since the schedule was made (a related deploy, a customer-impacting incident, a change of plans). The promotion happens anyway.

**Why it's an anti-pattern:** the scheduled-change mechanism removes the human-in-the-loop without inserting a review checkpoint. The change happens on autopilot in a context that no longer matches the original decision.

**Symptom:** a scheduled change executes during an unrelated incident, compounding it.

**Remedy:** pair sensitive scheduled changes with required approvals (Guardian Edition); use shorter scheduling horizons; review the day-of before scheduled changes execute.

---

## AP-10. The release that nobody decided to make

**Shape:** A flag's targeting rules drift over time. New rules get added; old ones don't get removed. Without anyone making a deliberate decision, the flag is now serving the new variation to 80% of users. No one can describe when or why.

**Why it's an anti-pattern:** the "release" was an accidental side-effect of rule accretion. The team has no narrative for why the change happened.

**Symptom:** during incident review, the team can't reconstruct who decided to take the rule to its current state.

**Remedy:** treat targeting changes as releases. Track them in the audit log. Periodically audit high-traffic flags' rule history; collapse and simplify.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
