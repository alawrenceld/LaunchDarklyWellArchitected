# Lens: AI / GenAI

> *AI features are user-facing releases with outsized blast radius, unpredictable failure modes, and a cost meter that ticks every second. Treat them accordingly.*

The AI/GenAI Lens specializes LDWA for engineering teams building generative-AI features with [LaunchDarkly AI Configs](https://launchdarkly.com/docs/home/ai-configs). It is the lens that takes the principle of "AI changes are releases" and turns it into an operating practice — model selection, prompt iteration, provider strategy, evaluation, cost and quality measurement, and the safety controls around LLM-driven product surfaces.

This lens does not replace the pillars. It re-applies the pillars to the unique constraints of AI workloads, and adds AI-specific best practices that don't fit anywhere else.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 2 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true for the LD-managed system being reviewed:

- You use **LaunchDarkly AI Configs** to manage models, prompts, providers, or AI agent configurations.
- You ship features that depend on large language models (LLMs) in production.
- You're running experiments comparing model variations on cost, latency, quality, or satisfaction.
- You're approaching a provider migration, model upgrade, or prompt evolution.
- You operate AI features under regulatory scrutiny (EU AI Act, sectoral AI rules, internal model-risk-management policies).
- You're scaling AI features and the LLM bill is becoming material.

If none of these is true, the standard pillars are sufficient.

## Contents

1. [Design Principles for AI Workloads](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md) — how each pillar specializes for AI workloads.
3. [AI Configs Patterns](./ai-configs-patterns.md) — using AI Configs well: variations, modes, providers, multi-provider strategy.
4. [Evaluation and Measurement](./evaluation-and-measurement.md) — how to measure quality, cost, latency, and satisfaction; eval pipelines; in-production evaluation.
5. [Review Questions for AI Workloads](./review-questions.md)
6. [Anti-Patterns specific to AI workloads](./anti-patterns.md)

## How to use this lens during a review

When you run a [LDWA review](../../framework/review-process.md) on a system that uses AI Configs:

1. Run the full standard review against the in-scope pillars.
2. **Then** walk through the additional [review questions](./review-questions.md) in this lens.
3. Pay particular attention to evaluation discipline, provider strategy, and cost guardrails — these are where AI workloads most often diverge from non-AI ones.
4. Many AI workloads will surface findings around **Safe Release**, **Reliability**, and **Experimentation**; treat those as starting points and consult this lens for the AI-specific elaboration.

## The headline principles

- **A model swap is a user-facing release.** Same progressive exposure, same guardrails, same reversibility as any other release.
- **Quality, cost, and latency are equal citizens.** A model that's 5% better but 10× the cost is not "better."
- **Every AI call has a fallback.** Providers fail; rate-limits hit; outputs are sometimes garbage. Plan for it.
- **Evaluate before, during, and after.** Pre-production evals catch the obvious; in-production measurement catches what evals miss.
- **Treat the prompt as code.** Versioned, reviewed, archived, tested.
- **The output is part of the security model.** Prompt injection, hallucination, leakage — these are not "model behavior," they are application behavior.

## Phase 2 scope vs. future

This lens covers the AI Configs surface that's GA today: variations, completion/agent modes, multi-provider rollouts, runtime control of prompts and models, and the metrics integration. As LaunchDarkly extends the AI / AgentControl surface (deeper agent workflows, tool-use governance, RAG controls), this lens will expand.
