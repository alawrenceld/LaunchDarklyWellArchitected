# Evaluation and Measurement

How you measure an AI feature determines whether you ship a good one. This page covers the LDWA discipline around evaluation: pre-production evals, in-rollout measurement, and continuous in-production evaluation.

The principle from the [design principles](./design-principles.md) is **Evaluate before, during, and after** — these are not interchangeable.

---

## The three layers of evaluation

```
┌──────────────────────────────────────────────────────────┐
│  BEFORE production: pre-production eval pipeline          │
│  - Golden dataset + automated graders                     │
│  - Catches regressions before promotion                   │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│  DURING rollout: live metrics gating exposure             │
│  - Cost, latency, satisfaction, custom signals            │
│  - Catches regressions before broad exposure              │
└──────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────┐
│  AFTER: in-production continuous evaluation               │
│  - Drift detection, user feedback loop, periodic re-eval  │
│  - Catches regressions that emerge over time              │
└──────────────────────────────────────────────────────────┘
```

A team that skips any of the three discovers regressions late, expensively, and from users.

---

## Layer 1 — Pre-production evals

### What it is

An automated test pipeline that runs candidate AI Config variations against a curated set of inputs ("golden dataset") and scores the outputs against expected behavior ("graders").

### The minimum viable eval pipeline

1. **A golden dataset.** 50–200 representative inputs that capture the feature's actual use. Hand-curated, with known good responses or known acceptable behavior. Includes edge cases the team has seen in production.
2. **Graders.** Functions that score each output. Some graders are deterministic (does the response include this string? is the JSON valid? does the response use this tool?); others are LLM-as-judge (a separate model rates the response on quality, helpfulness, etc.); some are human-in-the-loop for samples where automated graders are unreliable.
3. **A run mechanism.** A script, a CI job, a workflow, or a managed tool that runs the candidate variation against the dataset and produces a report.
4. **A gate.** A regression in any grader (or above a threshold) blocks promotion to production.

### What "good" looks like

- The eval pipeline runs on every meaningful change to an AI Config variation.
- The golden dataset grows over time. New edge cases discovered in production are added to it.
- Graders include cost and latency, not just quality.
- The report is reviewable by humans, not just a single pass/fail bit.

### What doesn't work

- **No eval pipeline at all.** Teams that ship AI by intuition will eventually ship a regression.
- **Stale golden dataset.** A dataset curated once a year stops representing real use.
- **One grader.** Quality is multi-dimensional; one grader hides trade-offs.

---

## Layer 2 — In-rollout measurement

### What it is

Live metrics attached to the AI Config rollout that gate progression. LaunchDarkly supports attaching metrics to AI Configs the same way it supports them on feature flags; the metrics drive rollout decisions (including automated rollback for guarded rollouts).

### The metrics every AI rollout has

| Metric | Why |
|---|---|
| **Cost per request** | The first dimension to surprise teams in production. A regression on cost can double the LLM bill within hours. |
| **p95 latency** | The second dimension to surprise teams. A slower model degrades user experience even when output quality is fine. |
| **Quality proxy** | A signal that correlates with output quality — satisfaction event, downstream conversion, success metric, completion rate, manual review score sampled from production. |

### The metrics most rollouts also have

| Metric | Why |
|---|---|
| **Error rate** | Provider errors, parse failures, tool-call failures. Any of these mean the user got a bad experience. |
| **Refusal rate** | The rate at which the model refuses to respond (or responds with "I can't help with that"). Spikes here often indicate prompt regression. |
| **Tool-use anomalies** (agent mode) | Tool calls per workflow, tool-call failure rate, runaway-loop indicators. |
| **Token consumption** | Average input + output tokens per request. A proxy for cost in providers without per-call cost reporting. |

### What "good" looks like

- Every AI rollout (model swap, prompt change, provider change) is configured as a guarded rollout with at minimum cost, latency, and a quality proxy.
- Regression thresholds are calibrated — neither too tight (noise rollbacks) nor too loose (real regressions missed).
- The team can describe, before the rollout starts, what would cause it to rollback.

### What doesn't work

- **No live metrics on the rollout.** Pre-production evals are necessary but not sufficient. Live traffic surfaces what evals miss.
- **Quality-only metrics.** Cost regressions are caught by the invoice. By then the damage is done.
- **Generic SRE metrics.** Total error rate doesn't move when a model degrades on a specific class of inputs. Pick AI-relevant metrics.

---

## Layer 3 — Continuous in-production evaluation

### What it is

The discipline of continuing to measure the AI feature after the rollout is complete. Drift happens. Provider models change. User behavior changes. The feature that was good at launch can become less good over months.

### What this looks like in practice

- **Sampled human review.** A small percentage of production responses are sampled and reviewed by humans (the team, ops, contractors) on a weekly or monthly cadence. Patterns surface that automated metrics miss.
- **LLM-as-judge over production.** A separate evaluator model rates a sample of production responses on quality dimensions. The score trend over time surfaces drift.
- **User feedback signals.** Thumbs-up/down, follow-up question rate, abandonment, downstream success metrics — fed back into the eval workflow.
- **Periodic re-eval.** The golden dataset is run against the current production variation every quarter to confirm no regression has crept in.

### What "good" looks like

- A scheduled feedback loop from production back into the eval set. New edge cases discovered in production become test cases for future iterations.
- A monthly review of AI feature metrics that includes cost, latency, quality proxies, and qualitative observations.
- An on-call or owning team that watches the AI feature's health continuously, not just at launch.

### What doesn't work

- **Ship and forget.** The team that doesn't measure post-launch will be surprised by gradual degradation.
- **One-time eval.** A model that scored well in launch evals is not necessarily still scoring well three months later.
- **No feedback loop.** New edge cases discovered in production should improve the eval set; otherwise the same surprise recurs.

---

## Choosing a quality proxy

Quality is the hardest dimension to measure in real time. Most teams settle on a **proxy metric** that correlates with quality and is measurable from product instrumentation:

| Product context | Common proxy |
|---|---|
| Conversational support / customer service | First-response resolution rate, escalation rate, follow-up rate |
| Code generation / assistance | Accepted-suggestion rate, run-and-pass rate |
| Search / retrieval | Click-through rate on AI response, refinement rate |
| Summarization / generation | Engagement on generated content, edit-after-generation rate |
| Classification / extraction | Downstream success rate of whatever consumes the output |
| Agentic workflow | End-to-end task success rate |

Pick the proxy that already exists in the team's instrumentation, or that's cheap to add. A quality proxy that requires a new analytics pipeline is a quality proxy that won't be ready when the rollout starts.

---

## Cost measurement

Cost is the dimension teams most often under-instrument. The baseline:

- **Per-request cost.** Tokens × per-token cost, computed from the provider response. Tracked as a metric attached to the AI Config.
- **Per-feature cost.** Aggregate per-request cost rolled up to the product surface. A dashboard.
- **Per-tenant cost (for SaaS).** Cost attributed to the tenant whose context drove the request. A discoverable view.
- **Provider invoice reconciliation.** The monthly invoice is compared against the team's metrics; large discrepancies are investigated.

The principle: cost surprises are operational failures, not finance failures.

---

## Latency budgets

The user-experience latency budget is fixed by the product context — what users tolerate. The AI call's share of that budget is what the team allocates.

- **End-to-end product latency budget.** What the team has decided is acceptable for the user experience.
- **AI call latency budget.** The portion of that budget allocated to the LLM call. Usually most of it for AI features, but not all.
- **Provider timeout.** Set just inside the latency budget. When it fires, the fallback engages.
- **p95 metric.** What's actually happening. Compared against the budget continuously.

The team that doesn't set a latency budget upfront discovers it through user complaints.

---

## Putting it together: the LDWA AI evaluation checklist

For every meaningful AI feature, the team has:

- [ ] A golden dataset that grows from production observations.
- [ ] Automated graders covering quality, cost, and latency.
- [ ] An eval pipeline that runs on every variation change.
- [ ] Pre-production gate on regressions (block promotion).
- [ ] Live cost, latency, and quality-proxy metrics attached to every rollout.
- [ ] A guarded rollout configuration with calibrated thresholds.
- [ ] A defined fallback variation tested in offline drill.
- [ ] Continuous in-production sampling and review.
- [ ] A feedback loop from production back into the eval set.
- [ ] Periodic re-eval of the current production variation.

The team that has all ten is doing AI well.

---

← [AI Configs Patterns](./ai-configs-patterns.md) | Continue to → [Review Questions](./review-questions.md)
