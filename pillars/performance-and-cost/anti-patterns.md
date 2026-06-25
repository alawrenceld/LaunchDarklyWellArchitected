# Performance & Cost Efficiency — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The invoice surprise

**Shape:** Renewal season arrives. The LaunchDarkly bill (or AWS bill, or OpenAI bill) is materially higher than the team expected. Engineering and finance scramble to explain it. The team learns about MAU growth, event volume, or AI cost trajectory from the invoice itself.

**Why it's an anti-pattern:** cost is observability. A bill that surprises the team means the team isn't monitoring the underlying volume. Renewal becomes adversarial because no one was prepared.

**Symptom:** finance asks "why is this so much higher than last quarter?" and engineering doesn't have a ready answer.

**Remedy:** trend MAU, MCI, event volume, AI cost, and observability ingestion monthly. Forecast quarterly. Review with finance as part of the operating cadence.

---

## AP-2. The blocking init

**Shape:** Application startup awaits SDK initialization. Under healthy conditions, this adds 200ms — annoying but invisible. Under a network blip, it adds 30 seconds, then the app crashes the launch path. Users complain about slow starts; some never get to the app at all.

**Why it's an anti-pattern:** the team has coupled cold-start performance to a network call. The flag system is supposed to enable safety; here it's a single point of failure.

**Symptom:** correlation between LaunchDarkly availability metrics and the team's app-start latency. Or: cold-start latency p99 wildly diverges from p50.

**Remedy:** bounded init timeout. Bootstrap from cache or fallback values. SDK initialization happens in the background; application proceeds without waiting.

---

## AP-3. The per-request SDK initialization

**Shape:** The team's serverless functions initialize the SDK at the start of each invocation. The SDK opens a streaming connection, waits for the initial flag dataset, evaluates, then tears down. Each request pays the full setup cost. Tail latency is catastrophic.

**Why it's an anti-pattern:** the SDK is designed as a long-lived singleton. Per-request initialization is the opposite shape. The bill is higher and the latency is worse than necessary.

**Symptom:** SDK initialization counts approximately equal request counts.

**Remedy:** for long-lived runtimes, singleton SDK. For serverless, switch to daemon mode with a persistent store or use an edge SDK designed for the runtime.

---

## AP-4. The placebo guardrail (cost edition)

**Shape:** A new AI Config variation rolls out. The guardrail metric is "request error rate." It doesn't change. The cost-per-request quadruples. The rollout completes. The team learns about the cost change weeks later from the invoice.

**Why it's an anti-pattern:** the guardrail didn't include cost. The guardrails that did exist measured something the change didn't affect.

**Symptom:** monthly LLM bill jumps after a rollout that "passed all guardrails."

**Remedy:** cost-per-request is a first-class guardrail on every AI rollout. Latency too. Both alongside quality.

---

## AP-5. The cardinality explosion

**Shape:** The team adds a high-cardinality attribute (session ID, request ID, device ID) to context for "better targeting precision." Targeting rules don't actually use it. MCI grows unexpectedly. The next month's invoice is 60% higher; the team blames LaunchDarkly's pricing model.

**Why it's an anti-pattern:** context attributes have cost. High-cardinality ones multiply that cost. Adding them without a targeting use case is paying for nothing.

**Symptom:** MCI grows faster than MAU.

**Remedy:** audit context attributes. Remove attributes that no targeting rule uses. Use private attributes for things that must be evaluated against but not retained.

---

## AP-6. The "instrument everything" event firehose

**Shape:** The team instruments every click, every page view, every state transition, every flag evaluation. Each user produces hundreds of events per session. At 2M users, this is hundreds of millions of events per day. The cost is material; most of the events are never queried.

**Why it's an anti-pattern:** instrumentation has cost. Without scoping or sampling, the team is paying for data that doesn't inform decisions.

**Symptom:** event ingestion volume that's an order of magnitude higher than the queries the team actually runs.

**Remedy:** scope instrumentation to decision-supporting events. Sample high-volume events. Aggregate client-side where possible.

---

## AP-7. The single-region Relay serving a multi-region fleet

**Shape:** The team's Relay Proxy lives in `us-east-1`. Applications in `us-west-2`, `eu-west-1`, and `ap-southeast-1` all cross regions to reach it. Each cross-region call is ~70-200ms. The team is mystified by tail latency on the European traffic.

**Why it's an anti-pattern:** centralized Relay topology costs latency the regional users pay. It also creates a cross-region dependency for what should be regional infrastructure.

**Symptom:** tail latency on flag evaluation correlates with user region.

**Remedy:** deploy a Relay fleet per region. Applications connect to the in-region fleet. Cross-region only on explicit failover.

---

## AP-8. The session replay record-everything default

**Shape:** Session replay is enabled at 100% sample rate "to make sure we capture everything." The team queries Session Replay maybe twice a month. The storage bill is large. The team would happily accept a 5% sample rate but never reviewed the setting.

**Why it's an anti-pattern:** observability fidelity has cost. Recording sessions the team never queries is paying for storage with no return.

**Symptom:** the team can't remember the last time they queried a session that wasn't a known incident — yet they're paying for 100% capture.

**Remedy:** sample rate matched to use case. Higher for incident investigation (might need every session for affected users); lower for product research (a representative sample is enough).

---

## AP-9. The forgotten Data Export

**Shape:** Two years ago, the team stood up a Data Export to Snowflake. The downstream dashboard it fed has been deprecated. The export still runs, daily, depositing gigabytes into a warehouse table nobody queries. Storage and compute costs accumulate.

**Why it's an anti-pattern:** sprawl. The integration's purpose is gone but the integration persists.

**Symptom:** the team can't articulate who depends on a given export.

**Remedy:** quarterly integration audit. Exports without current consumers get retired (after a cooling-off period to confirm no one objects).

---

## AP-10. The forecast that never happened

**Shape:** The team's MAU grew 40% over the year. Nobody forecast it. At renewal, LaunchDarkly's account executive presents the actual usage against the contracted tier. The team needs to upgrade. The upgrade conversation happens over a single quarter and feels rushed.

**Why it's an anti-pattern:** renewal-time surprises are forecasting failures. The growth was visible monthly; no one looked or planned.

**Symptom:** "we suddenly need a bigger plan" conversations.

**Remedy:** monthly MAU/MCI trending. Quarterly forecasts against the contract tier. Engage account management ahead of the gap, not after.

---

## AP-11. The latency regression that became normal

**Shape:** A flag-evaluation refactor adds 30ms to the p95 latency of a customer-facing endpoint. The team notices. "It's still fast enough." Six months later, another change adds another 30ms. "It's still fast enough." A year later the endpoint is 200ms slower than the baseline; conversions are down; nobody can pinpoint where it came from.

**Why it's an anti-pattern:** unaddressed regressions normalize. The team that doesn't treat a 30ms regression as a bug ships a half-second slower app over time.

**Symptom:** the team's customer-surface latency drifts upward year-over-year with no clear root cause.

**Remedy:** every latency regression is a bug. Triage and fix at the time of the regression. Track p95 over time so drift is visible.

---

## AP-12. The prompt that 5×'d the bill

**Shape:** A "small" prompt update is shipped to an AI Config. The new prompt instructs the model to "think step by step and provide a detailed response." Token output per call jumps 5×. Cost-per-request jumps 5×. The team finds out from the next invoice.

**Why it's an anti-pattern:** prompts have cost dimensions. A change that makes the model more verbose, more thorough, or more chatty multiplies tokens. Without cost guardrails, this ships invisibly.

**Symptom:** monthly LLM bill jumps with no obvious feature change to explain it.

**Remedy:** treat prompt changes as releases with cost guardrails. Track tokens-per-request and cost-per-request per AI Config. Roll back if the metric regresses.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
