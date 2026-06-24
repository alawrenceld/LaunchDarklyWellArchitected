# AI / GenAI — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for AI workloads. They are the philosophical core of doing AI well with LaunchDarkly.

---

## AI-1. A model swap is a user-facing release

Changing the model, the prompt, the parameters, or the provider behind an AI Config is the same kind of event as flipping a feature flag for the new checkout flow. Every dimension of safe release applies: progressive exposure, guardrails, reversibility, and reviewability.

The team that treats AI changes as "just config" ships behavior changes to 100% of users by mistake. The team that treats them as releases doesn't.

## AI-2. Quality, cost, and latency are equal citizens

When evaluating a model change, the team measures all three. A 5% quality improvement that doubles cost is not "better" — it's a trade-off with named winners and losers. The decision is explicit, not implicit.

Cost is the first dimension to surprise teams in production. Latency is the second. Quality is the third. Plan for all three before they bite.

## AI-3. Every AI call has a fallback

LLM providers fail. They rate-limit. They time out. They return responses that don't parse. They return outputs the application can't use. Every AI call in the system has a defined fallback path — a simpler model, a cached response, a deterministic answer, a graceful "we couldn't process that" message.

The fallback is part of the product, not an afterthought.

## AI-4. Evaluate before, during, and after

- **Before** production: an eval pipeline runs candidate variations against test cases that represent real use. Regressions block promotion.
- **During** rollout: live metrics (cost, latency, satisfaction, custom signals) gate the rollout. A regression rolls back.
- **After**: scheduled in-production evaluation continues to compare variations on real traffic, surfacing drift over time.

A team that skips any of the three discovers regressions late, expensively, and from users.

## AI-5. Treat the prompt as code

System prompts, user-input templates, and structured instructions are configuration that changes runtime behavior. They get the same treatment as code:

- Versioned in an audit-traceable way (LaunchDarkly's audit log + the variation history is the source of truth).
- Reviewed before changes go to production.
- Tested against an eval set.
- Documented with intent (what the prompt is trying to do, what the variation explored).

Prompts that drift without review are a debt and a security surface.

## AI-6. The output is part of the security model

A user-facing LLM response is application output. It is subject to the same security expectations as any other output:

- It does not leak system instructions, secrets, training data, or other users' data.
- It does not propagate prompt-injection attacks into downstream systems.
- It is moderated for safety where the product context demands it.
- It is observed and logged with the same discipline as other user-facing output.

"The model said it" is not a security defense.

## AI-7. Multi-provider is a posture, not a project

For business-critical AI features, the team's resilience posture includes the case where a provider has a regional outage, a global outage, or a long-term degradation. The plan exists *before* the outage. Whether that plan is "we route to a secondary provider via AI Config variations" or "we serve a graceful fallback for the duration" is a deliberate choice — not a moment of improvisation.

## AI-8. Cost is governed at the rollout level, not the invoice level

Cost guardrails attach to AI rollouts the same way error-rate guardrails do. A 50% rollout that doubles cost-per-request gets caught at 50%, not at the next invoice. Cost monitoring runs continuously; cost regressions trigger rollbacks.

## AI-9. The AI feature has explicit boundaries

For every AI feature, the team can name what the model is allowed to do and what it isn't. Tool-use scope. Data-access scope. Output domains. Topics that fall outside the feature's purpose are handled, not improvised.

The boundary is encoded — in system prompts, in tool definitions, in input validation, in output filtering — not assumed.

## AI-10. The team learns from production

Every meaningful AI feature has a feedback loop from production back into the eval set. User feedback, downstream signals, manual review of edge cases — these feed the next iteration. The team that ships and forgets is the team that compounds drift.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
