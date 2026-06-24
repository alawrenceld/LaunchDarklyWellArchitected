# Lab 07 — AI Flag Patterns

**Pillars:** Safe Release, Reliability, Experimentation
**Lens:** AI / GenAI
**Time:** ~90 minutes
**Difficulty:** Intermediate

---

## What you'll build

A production-ready AI feature pattern with [LaunchDarkly AI Configs](https://launchdarkly.com/docs/home/ai-configs): a model variation rollout, a fallback path that actually works, cost-per-request and p95 latency as guardrails, and a kill switch.

By the time you're done you will have:

- An AI Config with multiple variations (different models or different prompts).
- An application that calls the AI Config with a real fallback path.
- Cost and latency tracked as first-class metrics.
- A progressive rollout of a new variation with guardrails.
- A drill confirming the fallback engages when the provider fails.

This lab is the practical complement to the [AI/GenAI Lens](../lenses/ai-genai/). The lens describes the practice; the lab makes it concrete.

---

## Prerequisites

- A LaunchDarkly account with AI Configs available.
- A test application that calls an LLM (any provider — OpenAI, Anthropic, Gemini, etc.).
- API credentials for at least one LLM provider, stored in your secret manager.
- The ability to generate test traffic against the AI feature.

---

## Step 1 — Define the AI feature

Before the AI Config, name what the AI feature *does*. Be specific:

- **Surface:** where in the product the AI lives (chat box? summarization endpoint? recommendation widget?).
- **Input:** what the user (or upstream system) provides.
- **Output:** what the feature produces and what consumes it.
- **Failure mode:** what the user sees when the AI call fails. (You'll define this in Step 5.)
- **Quality signal:** what the team uses to know it's working.

Write this down. The AI Config will reference it.

**Why this matters:** every AI feature has explicit boundaries. Without them, "AI quality" becomes hand-waving. See [AI/GenAI Lens AI-9](../lenses/ai-genai/design-principles.md).

---

## Step 2 — Create the AI Config

In LaunchDarkly, create an AI Config:

- **Key:** `lab-ai-summarize` (or whatever fits your lab feature).
- **Description:** the feature description from Step 1.
- **Mode:** completion mode for single-turn responses; agent mode for multi-step workflows. Pick the one that matches your feature.
- **Tags:** `lab`, `provider:<openai|anthropic|...>`, `mode:<completion|agent>`, `surface:<feature-area>`, `criticality:medium`.

---

## Step 3 — Define two variations

Create at least two variations:

**Variation A — the baseline.**
- Model: a stable, current model from your primary provider.
- Prompt / instructions: the current production prompt (or your starting point).
- Parameters: temperature, max tokens, etc. as appropriate.

**Variation B — the candidate.**
- Same provider but a newer model version, *or*
- Same model but an updated prompt, *or*
- A different provider with an adapted prompt.

The choice of B depends on what you want to demonstrate. For the lab, a same-provider model upgrade is the easiest path.

Set the default rule to serve **Variation A** to 100% of contexts.

**Why this matters:** the variation is the unit of comparison. Two well-defined variations let you A/B them cleanly.

---

## Step 4 — Wire the application

```pseudocode
context = {
  kind: "user",
  key: current_user.id,
  region: current_user.region
}

config = ldclient.ai_config_variation("lab-ai-summarize", context, fallback_config)

# config contains the model spec, prompt/messages, parameters

try:
  response = call_llm(
    provider=config.provider,
    model=config.model,
    messages=config.messages,
    timeout=config.timeout_ms
  )

  # track metrics
  ldclient.track("ai-call-success", context)
  ldclient.track_numeric("ai-cost-cents", context, response.cost_cents)
  ldclient.track_numeric("ai-latency-ms", context, response.latency_ms)

  return process(response)

except (TimeoutError, ProviderError, ParseError) as e:
  ldclient.track("ai-call-fallback", context)
  return fallback_response()
```

Notes:

- The `fallback_config` passed to `ai_config_variation` is the safety net used if the SDK can't reach LaunchDarkly. Make it equivalent to Variation A so behavior is consistent.
- The `try/except` around the LLM call is the runtime fallback. It catches provider errors and engages your fallback path.
- The `track` calls feed the metrics LaunchDarkly uses for rollouts and experiments.

**Why this matters:** the fallback isn't a nice-to-have — it's part of the feature. See [AI/GenAI Lens AI-3](../lenses/ai-genai/design-principles.md).

---

## Step 5 — Build the fallback experience

Decide what happens when the AI call fails. For a lab, the simplest viable fallback:

- **Static response:** "We couldn't process that — please try again in a moment."
- **Cached response:** the most recent successful response for this input pattern, if you have one.
- **Simpler logic:** a rule-based or deterministic answer that's close enough for the use case.
- **A cheaper, faster model:** sometimes a small local model can hold the line during a primary outage.

The fallback path is tested. Run the application in a state where the LLM call deterministically fails (block the provider's hostname, set the API key to an invalid value, or short-circuit `call_llm` in dev mode). Confirm the user experience holds.

**Why this matters:** untested fallbacks are hypotheses. They fail when you need them most. See [AI/GenAI Lens AP-6](../lenses/ai-genai/anti-patterns.md).

---

## Step 6 — Define the guardrails

In LaunchDarkly, create or attach metrics to the AI Config:

- **`ai-cost-cents`** — average cost per request. Lower is better.
- **`ai-latency-ms`** — p95 latency per request. Lower is better.
- **`ai-call-success`** — success rate. Higher is better.
- **`ai-quality-proxy`** — a metric that correlates with quality for your feature (e.g., follow-up question rate, thumbs-up rate, downstream conversion). Direction depends on the metric.

Decide thresholds:

- Cost: **rollback if cost-per-request increases by more than 25%** (your number).
- Latency: **rollback if p95 latency increases by more than 30%**.
- Quality proxy: **rollback if it regresses by more than 10%**.

**Why this matters:** AI rollouts surprise teams in cost, latency, and quality — sometimes all at once. Guardrails on all three are the only safety net. See [AI/GenAI Lens AI-2](../lenses/ai-genai/design-principles.md).

---

## Step 7 — Run the progressive rollout

Configure the rollout for Variation B:

1. Start at **5%**.
2. Observe metrics for at least a few hours (depending on traffic).
3. Expand to **25%** if all guardrails hold.
4. Observe.
5. Expand to **50%**.
6. Observe.
7. Expand to **100%** only if the metrics support it.

Use a guarded rollout configuration so a regression triggers automatic rollback.

Watch:

- **Cost-per-request.** A new model with the same prompt can use different token counts.
- **p95 latency.** Some models are slower than others on equivalent prompts.
- **Success rate.** Format compatibility issues show up as parse errors.
- **Quality proxy.** Sometimes the new variation just isn't as good.

**Why this matters:** ship-to-100% AI changes are how teams discover regressions from users. Progressive exposure catches them at 5%. See [AI/GenAI Lens AI-1](../lenses/ai-genai/design-principles.md).

---

## Step 8 — Drill: provider failure

In a controlled window:

1. Block the LLM provider's API from your application (firewall rule, hosts file, or short-circuit in app config).
2. Generate traffic against the AI feature.
3. Observe:
   - Does the `try/except` engage?
   - Does the fallback response render?
   - Does the user experience hold (no crashes, no broken state, no spinning forever)?
   - Is the fallback rate visible in your metrics?
4. Restore provider access. Confirm normal operation resumes within seconds.

Document what you saw. Update the runbook (and the fallback design) if anything was unexpected.

**Why this matters:** the fallback is the most important AI infrastructure decision. Drilling is how you know it works. See [AI/GenAI Lens AI-3](../lenses/ai-genai/design-principles.md).

---

## Step 9 — Build the AI kill switch

Create a separate boolean flag — `kill-lab-ai-summarize` — that disables the entire AI feature.

```pseudocode
ai_enabled = ldclient.boolVariation("kill-lab-ai-summarize", context, true)

if not ai_enabled:
  return non_ai_experience()

# ... AI Config path from Step 4
```

When `kill-lab-ai-summarize` is flipped to `false`, the application skips the AI call entirely and serves whatever the pre-AI experience was (or a "feature temporarily unavailable" state).

Document the kill switch in the runbook. Drill it (per [Lab 02](./02-build-a-kill-switch-you-can-trust.md)).

**Why this matters:** the fallback variation handles provider failure; the kill switch handles the case where the AI feature *itself* is misbehaving. Both exist. See [AI/GenAI Lens AI Configs Patterns — Pattern 7](../lenses/ai-genai/ai-configs-patterns.md).

---

## Step 10 — Stand up minimal evaluation

For the lab, evaluation can be lightweight: a small golden dataset (10–20 representative inputs) and a manual grader. Before promoting any new variation, the candidate is run against the dataset and a human eyeballs the output for regressions.

This is the floor. For real production AI features, see [AI/GenAI Lens — Evaluation and Measurement](../lenses/ai-genai/evaluation-and-measurement.md) for the full three-layer model.

**Why this matters:** evals before production catch the obvious issues. Live rollouts catch the rest. Continuous in-production evaluation catches drift. All three exist for good AI features.

---

## Success criteria

You have completed the lab when:

- [ ] An AI Config exists with at least two well-defined variations.
- [ ] The application calls the AI Config with a fallback config and a runtime fallback path.
- [ ] Cost-per-request, p95 latency, success rate, and a quality proxy are tracked.
- [ ] A progressive rollout of Variation B was run with guardrails configured.
- [ ] A drill confirmed the fallback engages when the provider fails.
- [ ] A kill switch exists for the entire AI feature and has been drilled.
- [ ] A minimal evaluation step exists before promotion.

---

## What to do next

- Read the [AI/GenAI Lens](../lenses/ai-genai/) end-to-end, particularly [AI Configs Patterns](../lenses/ai-genai/ai-configs-patterns.md) and [Evaluation and Measurement](../lenses/ai-genai/evaluation-and-measurement.md).
- Layer a proper evaluation pipeline on top of this lab.
- For business-critical AI features, design the multi-provider posture (AI Configs Patterns — Pattern 4).
- Run [Lab 03 — Run a Real Experiment](./03-run-a-real-experiment.md) on AI variations using cost / latency / quality as a multi-metric experiment.

---

## Teardown

If you ran the lab against a throwaway feature, archive the lab artifacts:

1. **Archive the AI Config** `lab-ai-summarize`.
2. **Archive the metrics** (`ai-cost-cents`, `ai-latency-ms`, `ai-call-success`, `ai-quality-proxy`).
3. **Archive the kill switch** `kill-lab-ai-summarize`.
4. **Remove the lab code** from your test application.
5. **Revoke** any test API keys for the LLM provider.

If you ran it for a real AI feature, **don't tear it down** — this is the pattern you want.
