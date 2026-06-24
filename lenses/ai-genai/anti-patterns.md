# AI / GenAI — Anti-Patterns

A catalogue of common, named failure modes specific to AI workloads.

---

## AP-1. The model that shipped to everyone

**Shape:** Someone changes the AI Config to point at a new model (or a new system prompt). The change goes live for 100% of users immediately. Quality drops, cost spikes, latency degrades — usually some combination.

**Why it's an anti-pattern:** AI Config changes are user-facing releases with outsized, hard-to-predict blast radius. Treating them as configuration tweaks invites disasters that flag-shaped releases prevent.

**Symptom:** the LLM bill triples overnight; user feedback shifts; the team blames "the new model" without being able to localize the change.

**Remedy:** every AI Config change is a release with progressive exposure, cost/latency/quality guardrails, and a defined rollback path.

---

## AP-2. The runaway prompt

**Shape:** An AI Config change introduces a prompt that, due to its structure, causes the model to produce verbose responses. Each call now takes 30 seconds instead of 3, and uses 10× the tokens. Application latency degrades; LLM bill spikes; users wait.

**Why it's an anti-pattern:** prompt changes are user-facing releases with cost and latency consequences. Without guardrails, they ship to 100% and exhaust budgets and patience.

**Symptom:** sudden spike in LLM cost or p95 AI latency that nobody planned for.

**Remedy:** progressive exposure for prompt changes; cost-per-request and p95 latency as guardrails; provider-side timeouts that cap pathological cases.

---

## AP-3. The provider that took the whole feature down

**Shape:** An AI feature depends on a single LLM provider. The provider has a regional outage. The feature has no fallback variation. Users see errors for the duration of the outage.

**Why it's an anti-pattern:** LLM providers are less reliable than core infrastructure. Single-provider dependency for a business-critical AI feature is a known-bad pattern.

**Symptom:** an LLM provider's status page goes red and the team's AI feature follows.

**Remedy:** define fallback variations for every AI Config. For business-critical features, configure multi-provider variations and exercise them in drills.

---

## AP-4. The invoice-based cost discovery

**Shape:** The team ships an AI feature. Cost-per-request is not measured. A month later, the LLM provider invoice arrives. The team discovers that one variation costs 4× the incumbent. The decision to roll out was made without cost visibility.

**Why it's an anti-pattern:** cost is the dimension teams most often under-instrument. Invoice-based discovery means weeks of regression before correction.

**Symptom:** the finance team is mad on the first of the month.

**Remedy:** cost-per-request as a first-class metric on every AI Config. Per-feature cost dashboards. Cost as a guardrail on rollouts.

---

## AP-5. The placebo eval

**Shape:** The team has an eval pipeline. It tests fifteen handpicked inputs that demonstrate the AI feature works. Every variation passes. Production users find edge cases the eval never anticipated.

**Why it's an anti-pattern:** the eval pipeline catches the cases the team thought of; it misses the cases users find. A dataset that doesn't grow from production observations is a dataset that gradually represents less of reality.

**Symptom:** evals always pass; production has surprises.

**Remedy:** the golden dataset grows from production. Every edge case caught in production becomes a test case for future iterations.

---

## AP-6. The "we'll add a fallback later"

**Shape:** The team ships the AI feature without a fallback. They plan to add one once the feature is stable. Stability never comes; the team moves to the next thing. Six months later, a provider outage causes a high-visibility incident, and the team adds a fallback in a hurry.

**Why it's an anti-pattern:** the fallback is most needed precisely when the team is busiest with other things. "Later" is when the outage happens.

**Symptom:** the AI feature has no fallback in production months after launch.

**Remedy:** the fallback is part of the initial launch, not a follow-up. Even a crude fallback ("we couldn't process that" graceful message) is better than no fallback.

---

## AP-7. The prompt that bypassed review

**Shape:** A prompt change is "just text." It bypasses the team's normal change-review process. The prompt removes a guardrail instruction, opens a prompt-injection vector, or shifts the model into a more permissive mode. The change goes to production unreviewed.

**Why it's an anti-pattern:** prompts are powerful and security-relevant. Treating them as "just text" misses their actual blast radius.

**Symptom:** prompt-injection vulnerabilities reach production; safety-relevant prompt changes are made without review.

**Remedy:** prompt changes are reviewed at the same level as code changes. The change-management policy includes "prompt edits to production AI Configs."

---

## AP-8. The eval that's irrelevant to the user

**Shape:** The eval pipeline measures answer length, valid JSON output, and provider error rate. The user-facing quality (helpfulness, accuracy, usefulness) is not measured. Evals pass; users complain.

**Why it's an anti-pattern:** evaluating what's easy to measure rather than what matters. The team's evidence of quality is divorced from the user experience.

**Symptom:** product feedback misaligned with eval results.

**Remedy:** every eval set includes graders for the actual user-relevant quality dimension — even if it's LLM-as-judge, human review samples, or downstream proxy metrics.

---

## AP-9. The agent that calls 47 tools

**Shape:** An agent-mode workflow is rolled out. The agent occasionally enters a loop where it calls a tool, sees an unhelpful result, calls a different tool, sees another unhelpful result, and continues until either the model's context fills or the request times out. Each workflow run costs orders of magnitude more than expected.

**Why it's an anti-pattern:** agent workflows are higher-blast-radius per request than completion-mode calls. Without per-workflow guardrails, runaway loops are an existential cost risk.

**Symptom:** a small percentage of agent-mode workflow runs cost 50× the median.

**Remedy:** per-workflow tool-call limits, per-workflow token budgets, p99 latency guardrails on workflows, alerting on runaway behavior. Eval pipelines include adversarial cases that probe for loops.

---

## AP-10. The model upgrade that quietly broke parsing

**Shape:** The team upgrades to a new model version from the same provider. The new model is slightly more conversational by default; it occasionally wraps JSON output in markdown code fences. The downstream parser doesn't handle the markdown. Errors propagate. The model upgrade ships before this is caught.

**Why it's an anti-pattern:** model upgrades within a provider feel like minor changes but can subtly shift output format. Without a progressive rollout and a parsing-success metric, the shift goes undetected.

**Symptom:** error rate ticks up in the downstream system after a model upgrade, with no clear root cause.

**Remedy:** every model upgrade is a progressive rollout. Parsing-success rate is a guardrail. The eval set includes format-validation graders.

---

## AP-11. The "model said it" defense

**Shape:** The AI feature produces an output that's wrong, harmful, off-topic, or leaks information. The team's first response: "well, the model said it." The output reached production unfiltered.

**Why it's an anti-pattern:** the model's output is *application* output. Application output is the application's responsibility. "The model said it" is not a defense in security review, in compliance review, or in customer trust.

**Symptom:** an incident response that explains rather than fixes.

**Remedy:** content moderation, output filtering, validation against known-bad outputs, and a clear product treatment of "the model output is part of the security model."

---

## AP-12. The ship-and-forget AI feature

**Shape:** An AI feature launched eighteen months ago. It works. Nobody has measured it since. Model providers have updated their offerings; user behavior has shifted; the original eval is unrun. The feature might be quietly worse than it was at launch.

**Why it's an anti-pattern:** AI features drift in ways that traditional features don't. Provider model changes, prompt-context-window expansions, user adaptation — all change the feature's effective behavior over time.

**Symptom:** the team can't articulate the current quality of an AI feature that's been in production for over a year.

**Remedy:** scheduled re-evaluation against the current production variation. Continuous in-production sampling. A feedback loop from production observations to the eval set.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
