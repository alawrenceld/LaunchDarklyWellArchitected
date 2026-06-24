# Lens: AI / GenAI

> *AI features are user-facing releases with outsized blast radius. Treat them accordingly.*

**Status: Phase 2 — draft scheduled, not yet written.**

This lens specializes LDWA for teams using [LaunchDarkly AI Configs](https://launchdarkly.com/docs/home/ai-configs) to manage models, prompts, and providers for generative AI features. It is the lens that turns the principle of *AI changes are releases* into concrete practice.

## When this lens will apply

- You use AI Configs to manage LLM-driven features in production.
- You're swapping models, evolving prompts, or switching providers.
- You're experimenting on cost, latency, or quality across AI variations.
- You operate AI features under regulatory scrutiny (EU AI Act, sectoral AI rules).

## Related Phase 1 content

In the meantime, every pillar already includes AI-relevant coverage:

- **Safe Release** — AI Config rollouts as releases ([best practices BP-5.x](../../pillars/safe-release/best-practices.md), review questions SR-Q14 through SR-Q16).
- **Security & Compliance** — AI security baseline ([best practices BP-9.x](../../pillars/security-and-compliance/best-practices.md)).
- **Reliability** — AI Config and LLM provider resilience ([best practices BP-7.x](../../pillars/reliability/best-practices.md)).
- **Governance** — AI Config lifecycle ([best practices BP-5.x](../../pillars/governance/best-practices.md)).

The lens will build on these with AI-specific design principles, deeper provider-failover patterns, eval-pipeline integration, prompt-engineering safety, multi-provider orchestration, and AI-specific review questions.

## Phase 2 scope

See the [build plan](../../todo.md) for sequencing.
