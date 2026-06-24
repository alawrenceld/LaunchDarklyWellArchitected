# AI Configs Patterns

Practical patterns for using [LaunchDarkly AI Configs](https://launchdarkly.com/docs/home/ai-configs) well. This page assumes familiarity with the AI Configs primitives — the canonical reference is the LaunchDarkly docs. The patterns below are the LDWA opinions on *how* to use them in production.

---

## The vocabulary refresher

For LDWA purposes, the AI Configs primitives are:

- **AI Config** — the resource. Conceptually similar to a flag, but for AI behavior.
- **Variation** — a specific combination of model settings and prompt content (messages in completion mode, instructions in agent mode). An AI Config has one or more variations; rollouts and experiments move traffic between them.
- **Mode** — *completion* (single-turn, messages + roles) or *agent* (multi-step workflows with structured instructions).
- **Model configuration** — the specific model, provider, and parameter set inside a variation.
- **Provider** — the LLM vendor (OpenAI, Anthropic, Gemini, etc.). LaunchDarkly is provider-agnostic.
- **Metrics** — cost, latency, satisfaction, and custom metrics attached to AI Configs.

See the [LDWA definitions](../../framework/definitions.md) for the canonical glossary.

---

## Pattern 1 — The model-upgrade rollout

**When to use it.** You want to move from `model-x-2024` to `model-x-2026` (same provider, newer/cheaper/better model).

**Shape.**

1. Create a new variation in the AI Config pointing at the new model. Keep the existing variation as-is.
2. Attach the AI Config's standard guardrails — cost-per-request, p95 latency, the team's quality signal.
3. Run an internal/dogfood rollout first. The team uses the new variation; the team logs anomalies.
4. Move to a small percentage of production (5–10%). Observe metrics for at least a few hours of representative traffic.
5. Expand progressively (25% → 50% → 100%) only if metrics hold.
6. After a stable period at 100%, archive the old variation.

**Why this pattern.** Model upgrades within a provider are usually low-risk, but "usually" is not "always." A new model can change response format, refuse-rate, token consumption, or latency in ways that don't show up in eval pipelines. The progressive rollout catches the surprises.

**What to watch.** Cost is the most common surprise — new models can change token consumption per response. Latency is second. Subtle quality regressions on edge cases are third.

---

## Pattern 2 — The prompt iteration

**When to use it.** You want to refine the system prompt or the user-input template for an existing AI Config.

**Shape.**

1. Create a new variation with the updated prompt, same model, same parameters.
2. Run the new variation through the eval pipeline against the team's golden dataset.
3. If evals pass, run a small-percentage production rollout — start at 5%, watch for ~24 hours.
4. Expand if metrics hold; rollback if they don't.
5. Once at 100% and stable, archive the prior variation.

**Why this pattern.** Prompts are deceptively powerful. A well-meaning rewrite can shift the model into a different behavior regime — more verbose, more cautious, more eager to use tools, more likely to refuse. Eval pipelines catch the obvious; progressive rollout catches the rest.

**What to watch.** Refusal rate. Average response length (a proxy for verbosity and token cost). Tool-use rate, if the AI uses tools. Satisfaction signals on the affected surface.

---

## Pattern 3 — The provider migration

**When to use it.** You want to move from one LLM provider to another (OpenAI → Anthropic, Anthropic → Gemini, etc.), either entirely or partially.

**Shape.**

1. Configure a new variation pointing at the new provider, with equivalent model selection and an adapted prompt (prompts are not always portable; provider differences matter).
2. Run the new variation through the eval pipeline. Iterate on the prompt until the eval delta is acceptable.
3. Run a small-percentage production rollout — start lower than for a same-provider model upgrade (1–5%). Watch closely for a longer window (24–72 hours).
4. Expand progressively. At each step, verify the cost, latency, and quality metrics.
5. Decide the final state: 100% new provider, or a stable split (e.g., 70/30) for resilience.

**Why this pattern.** Cross-provider migrations introduce more variables than same-provider upgrades: different model architectures, different prompt sensitivities, different tool-use semantics, different rate-limit and error behavior. The progressive rollout is essential and the watch window is longer.

**What to watch.** Everything from Patterns 1 and 2, plus: provider error rates, rate-limit hits, response-format compatibility with downstream parsing.

---

## Pattern 4 — The multi-provider resilience posture

**When to use it.** The AI feature is business-critical, and a sustained provider outage is unacceptable.

**Shape.**

1. Configure multiple variations in the AI Config, each pointing at a different provider, with equivalent model selection and adapted prompts.
2. Use targeting and percentage rollout to define the steady-state split — e.g., 80% primary provider, 20% secondary provider for ongoing validation.
3. Configure a kill-switch variation or targeting rule that shifts 100% to the secondary provider in case of a primary outage.
4. Exercise the failover drill at least quarterly — block the primary, confirm traffic shifts, confirm the user experience holds.

**Why this pattern.** Provider outages are real and recurrent. Multi-provider is the only path to provider-outage resilience for features where graceful degradation isn't sufficient.

**What to watch.** Drift between providers' behavior over time. The "20% secondary" traffic is the team's continuous validation that the failover provider still works for them.

---

## Pattern 5 — The agent-mode workflow rollout

**When to use it.** You're rolling out or evolving a multi-step agent workflow defined in agent mode.

**Shape.**

1. Configure the new agent workflow as a new variation.
2. Eval the workflow against representative tasks. Pay attention to tool-use behavior, intermediate-step quality, and the final outcome.
3. Run a small-percentage rollout. Watch tool-call volume, tool-call cost, total tokens per workflow run, total latency per workflow run, and the success rate of the workflow end-to-end.
4. Expand progressively.

**Why this pattern.** Agent workflows have higher blast radius per request than completion-mode calls — more tokens, more tool calls, more chances for things to go sideways. The metrics surface is also richer; treat them all as first-class.

**What to watch.** Total tokens per workflow run (cost). Tool-call patterns (a workflow that makes 30 tool calls when it should make 3 is a budget incident waiting to happen). End-to-end success rate.

---

## Pattern 6 — The fallback variation

**Every** AI Config has a fallback variation. The pattern.

**Shape.**

1. Designate one variation as the fallback (or use the SDK fallback value).
2. The fallback variation is one of:
   - A simpler, cheaper, faster model on a separate provider.
   - A deterministic response — a static message, a cached result, a rule-based answer.
   - A "we couldn't process that" graceful experience that preserves user state.
3. The fallback is exercised by tests and by the quarterly provider-failure drill.

**Why this pattern.** Without a fallback, every provider hiccup is a feature outage. With one, provider hiccups are invisible to most users.

**What to watch.** Fallback invocation rate. It should be near zero in steady state; a spike indicates upstream degradation.

---

## Pattern 7 — The kill switch for an AI feature

**When to use it.** Always.

**Shape.**

1. Pair the AI Config with a regular feature flag that gates the AI feature entirely.
2. When the kill switch is engaged, the application skips the AI call and serves the non-AI experience.
3. The kill switch is documented in the team's runbook (see [Safe Release BP-6.1](../../pillars/safe-release/best-practices.md)).
4. The kill switch is drilled quarterly.

**Why this pattern.** Sometimes the fallback variation isn't enough — the AI feature itself is the source of trouble. The kill switch disables the entire feature, returning to the pre-AI experience. This is the panic button.

---

## Pattern 8 — Tagging AI Configs

Tag every AI Config with at minimum:

- `provider:<openai|anthropic|gemini|...>` — the primary provider.
- `mode:<completion|agent>` — the configuration mode.
- `team:<name>` — the owning team.
- `surface:<feature-area>` — what user-facing surface this powers.
- `criticality:<low|medium|high|critical>` — how important this feature is to the product.

These tags enable inventory queries the team will actually use: "show me all our OpenAI-dependent surfaces," "which agent-mode configs do we run in production," "what's tagged critical."

---

## Anti-patterns to avoid

See [AI/GenAI Anti-Patterns](./anti-patterns.md) for the full catalogue. The three most common:

- **Shipping a model swap to 100% without progressive exposure.**
- **No fallback variation; the application breaks when the provider hiccups.**
- **No cost guardrail; the regression is discovered in the monthly invoice.**

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Evaluation and Measurement](./evaluation-and-measurement.md)
