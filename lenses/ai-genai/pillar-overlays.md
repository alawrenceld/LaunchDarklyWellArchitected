# AI / GenAI — Pillar Overlays

How each pillar specializes for AI workloads. Read the relevant pillar first; this page describes the *additional* expectations and shifted thresholds.

---

## Safe Release & Progressive Delivery

**AI overlay:**
- Every AI Config change (model, prompt, provider, parameters) is a release. It uses [progressive exposure](../../pillars/safe-release/best-practices.md): an internal/dogfood variation first, a small percentage of production, then growth.
- Guardrails on AI rollouts include **cost-per-request**, **p95 latency**, and **a quality proxy** (satisfaction event, downstream conversion, success metric). Generic SRE metrics are not enough.
- Provider migrations (OpenAI → Anthropic, or vice versa) are progressive: a variation routes some traffic to the new provider, the metrics are watched, traffic shifts deliberately.
- The fallback variation is part of every AI Config — what the user sees when the model fails, the provider rate-limits, or the response can't be parsed.

**Specific best-practice references (from the Safe Release pillar):**
- BP-5.1 Treat model/prompt/provider changes as releases, not config edits
- BP-5.2 Use AI Config variations for model A/B comparisons
- BP-5.3 Build the AI fallback path explicitly
- BP-5.4 Guard AI rollouts on cost and latency, not just quality

---

## Operational Excellence

**AI overlay:**
- The "flags in motion" dashboard ([OE BP-3.3](../../pillars/operational-excellence/best-practices.md)) includes AI Config variations and rollouts.
- Errors and Session Replay from LaunchDarkly Observability are part of the AI feedback loop. When an AI rollout is mid-flight, the team's first look is the Errors dashboard and (where appropriate) Session Replay for the affected user surface.
- The on-call runbook for AI-related incidents is a separate entry: how to disable the AI feature (kill switch), how to switch to a fallback variation, how to engage the LLM provider.
- Cost monitoring is a first-class operational dashboard — not a quarterly invoice review.

---

## Security & Compliance

**AI overlay:**
- LLM provider API keys are credentials with their own discipline (see Security & Compliance BP-9.x): secret manager storage, narrow scoping, rotation per provider recommendation, immediate revocation on departure.
- Prompts are reviewed for prompt-injection surface as part of the change workflow. "Just a prompt update" is not a category of change that bypasses review.
- Content moderation (provider-native or third-party) is wired into the evaluation path where the product context demands it.
- For regulated AI workloads (EU AI Act high-risk systems, model-risk management in financial services, clinical-decision support in healthcare), the AI Config artifact inventory, change history, and decision rationale form the basis of regulatory evidence.

**Specific best-practice references:**
- BP-9.1 Store provider credentials separately, with their own rotation discipline
- BP-9.2 Treat prompt content as security-relevant
- BP-9.3 Apply content moderation as part of AI Config evaluation

---

## Reliability & Resilience

**AI overlay:**
- Every AI Config has a fallback variation (Reliability BP-7.1) — a simpler model, deterministic response, cached answer, or graceful "we couldn't process that" message.
- Provider timeouts are configured aggressively (Reliability BP-7.2) and the application falls back when they fire. Waiting forever for a model is worse than serving the fallback.
- For business-critical AI features, multi-provider variations are configured (Reliability BP-7.3) and exercised in drills.
- Caching is used wherever the use case allows (Reliability BP-7.4). The LLM call you don't make is the LLM call that can't fail or cost money.
- Quarterly drills include "provider unavailable" — block the provider's API, confirm the fallback engages, confirm the user experience is acceptable (Reliability BP-9.3).

---

## Governance & Artifact Lifecycle

**AI overlay:**
- Every AI Config has a documented owner — typically a team, not an individual. (Governance G-1.)
- AI Config variations are versioned explicitly (Governance BP-5.1) so debugging can answer "which variation was running at time T?"
- Provider deprecation cycles are tracked (Governance BP-5.3); migrations are planned ahead of deprecation deadlines.
- Obsolete variations get retired (Governance BP-5.2) after migrations complete. Dead variations in active configs are noise and confusion.
- Tagging for AI Configs includes a `provider:<openai|anthropic|gemini|...>` tag and a `mode:<completion|agent>` tag to support inventory queries.

---

## Experimentation & Measurement *(Phase 2 — see the [Experimentation pillar](../../pillars/experimentation/))*

**AI overlay:**
- AI experiments compare variations on cost, latency, satisfaction, and task-specific quality — not a single metric.
- Statistical power for AI experiments is harder than for traditional A/B because effects are often subtle and metrics are noisy. Sample-size planning matters more, not less.
- "Quality" in experiments is operationalized: a numeric metric tied to a measurable signal (downstream conversion, manual review score, automated eval score, satisfaction rating). Vague quality goals don't survive contact with reality.
- Holdouts include AI-specific considerations: long-term satisfaction effects, drift in user behavior over time as users adapt to or away from AI features.

---

## Performance & Cost Efficiency *(Phase 2)*

**AI overlay — high-priority preview:**
- Cost-per-request is a first-class metric, tracked per AI Config and per variation.
- Token budgets are governed at the rollout level. A variation that costs 3× the incumbent does not go to 100% without an explicit decision.
- Caching strategies (per-prompt, per-input-hash, per-user-session) are designed deliberately based on the use case.
- p95 latency budgets are tighter for AI than non-AI features in many product contexts — users notice 2-second waits in a way they don't notice 200ms waits.
- Provider-side rate limits and quotas are tracked operationally, not just at the time they're hit.

---

## Developer Experience & Velocity *(Phase 2)*

**AI overlay — preview:**
- Local AI Config iteration: developers can iterate on prompts and variations against a development environment without round-tripping through production. The eval pipeline runs locally.
- Type safety on AI Config keys (the same discipline as flag keys — see Operational Excellence BP-6.2).
- IaC management of AI Configs follows the same principles as flags: foundational variations in IaC, day-to-day iteration in the UI.

---

← [Design Principles](./design-principles.md) | Continue to → [AI Configs Patterns](./ai-configs-patterns.md)
