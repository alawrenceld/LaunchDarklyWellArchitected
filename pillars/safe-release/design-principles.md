# Safe Release — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Safe Release pillar.

---

## SR-1. Every release is reversible without a deploy

A user-facing change must be revertible by changing a flag, not by deploying code. This is the single most important property of a well-architected LD-managed system.

The test: someone at 3 AM, who did not write the code, must be able to disable the change in under two minutes from their phone.

## SR-2. Exposure expands; it doesn't flip

Every meaningful release goes through progressive exposure. Start small (internal users or a named segment), grow deliberately (1% → 10% → 50%), arrive at 100% only after the metrics support it.

Big-bang flips are reserved for true emergencies (e.g., a kill switch).

## SR-3. Every release has a guardrail

A guardrail metric is a metric you commit to *not making worse*. Error rate. Latency. Conversion. Cost per request.

Every customer-facing release should attach at least one guardrail. For high-blast-radius releases, attach guardrails to a [guarded rollout](https://launchdarkly.com/docs/home/releases/guarded-rollouts) so the rollback can be automatic.

## SR-4. Defaults are explicit

Every flag has an *off* variation defined deliberately. Every SDK call passes a fallback value that the application can survive. The fallback is documented and tested — not whatever value the developer felt like at 11 PM.

The application must work correctly when the flag returns the fallback. If it can't, the fallback is wrong.

## SR-5. Kill switches exist and are tested

Every product surface has at least one flag that can disable it. The team has flipped that flag in a drill, in production, in the last quarter.

If you have never flipped it, you do not have a kill switch — you have a flag that you *hope* would work.

## SR-6. Rollouts are governed by policy, not memory

The team's rollout norms — what kind of release uses what kind of strategy — are written down. Better: encoded in a [Release Pipeline](https://launchdarkly.com/docs/home/releases/release-pipelines), a release policy, or a default template, so the right pattern is the easiest path.

If the rollout strategy lives only in someone's head, it will be skipped under pressure.

## SR-7. AI changes are releases, too

Swapping a model, changing a system prompt, switching an LLM provider — these are user-facing changes with measurable consequences. Treat them like any other release: progressive exposure, guardrails (cost, latency, quality), and reversibility.

The AI/GenAI lens elaborates this principle for AI Config-specific patterns.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
