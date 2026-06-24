# Reliability & Resilience — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## SDK selection and topology

### R-Q1. Is the right SDK family used for each runtime (server, client, mobile, edge)?
- **High Risk** if SDK choice is mismatched (server SDK in browser, client SDK in serverless).
- **Medium Risk** if some mismatch exists but is being migrated.
- **None** if SDK choice consistently matches runtime.

### R-Q2. Are server SDKs initialized once per process and shared?
- **High Risk** if SDKs are re-initialized per request or per invocation.
- **Medium Risk** if mostly singleton but with exceptions.
- **None** if singleton-init is universal.

### R-Q3. For serverless / short-lived runtimes, are you using daemon mode or edge SDKs?
- **High Risk** if streaming SDKs are used in serverless and the connection fails to establish.
- **Medium Risk** if a workable but suboptimal pattern is in use.
- **None** if the runtime-appropriate pattern is used.

---

## Initialization, bootstrap, and offline behavior

### R-Q4. Is SDK initialization bounded by an explicit timeout?
- **High Risk** if initialization can block application startup indefinitely.
- **Medium Risk** if a timeout exists but is too long.
- **None** if timeouts are calibrated and tested.

### R-Q5. Are client-side SDKs bootstrapped with server-rendered initial values?
- **High Risk** if first-paint behavior depends on a network round-trip and users see "flash of old behavior."
- **Medium Risk** if bootstrap is implemented but inconsistently.
- **None** if bootstrap is the standard pattern.

### R-Q6. Has the SDK's offline-mode behavior been exercised?
- **High Risk** if no one knows what happens in offline mode.
- **Medium Risk** if it works in theory but hasn't been tested.
- **None** if offline mode is tested in CI and used in drills.

### R-Q7. Is local SDK caching enabled and persistent where appropriate?
- **High Risk** if caching is off or improperly configured.
- **Medium Risk** if caching is on but not verified for persistence.
- **None** if caching is verified, persistent on mobile/edge, and tested.

---

## Defaults and fallbacks

### R-Q8. Is the fallback value passed to each SDK call deliberately chosen?
- **High Risk** if fallback values are default placeholders (e.g., always `false`) without thought.
- **Medium Risk** if fallbacks are chosen but not documented.
- **None** if fallbacks are deliberate and documented per flag.

### R-Q9. Are fallback code paths exercised by tests?
- **High Risk** if no tests run with the SDK in offline mode.
- **Medium Risk** if some do but coverage is partial.
- **None** if fallback paths have the same coverage as happy paths.

### R-Q10. Does the application serve a coherent experience under fallback?
Probe: Run the app with the SDK forced offline. What does a user see?
- **High Risk** if errors propagate to users or features break.
- **Medium Risk** if behavior is functional but visibly degraded.
- **None** if fallback experience is designed and graceful.

---

## Relay Proxy

### R-Q11. Is the Relay Proxy decision (deploy or not) deliberate, with a documented reason?
- **High Risk** if Relay is deployed without a clear need and adds operational tail.
- **Medium Risk** if the decision was made informally.
- **None** if the deployment (or non-deployment) reflects a documented requirement.

### R-Q12. If Relay is deployed, does it meet LaunchDarkly's recommended floor (3 instances, 2 AZs, load-balanced)?
- **High Risk** if Relay runs as a single instance or in a single AZ.
- **Medium Risk** if it meets the floor but has not been sized for actual load.
- **None** if sizing is deliberate, monitored, and re-evaluated for major launches.

### R-Q13. Is Relay monitored — connection count, latency, error rate, saturation?
- **High Risk** if Relay is unmonitored.
- **Medium Risk** if monitoring exists but alerts are weak.
- **None** if monitoring covers saturation, latency, and errors with calibrated alerts.

### R-Q14. Do you have a plan for what happens if all Relay instances are unreachable?
- **High Risk** if the answer is "we'd be down."
- **Medium Risk** if a plan exists but hasn't been validated.
- **None** if SDKs fail to a defined alternative (direct LD, cache, fallback) that's been tested.

### R-Q15. For serverless workloads, is daemon mode used appropriately?
- **High Risk** if serverless workloads use streaming SDKs and fail under cold-start.
- **Medium Risk** if migration is in progress.
- **None** if daemon mode (or an edge SDK) is used for the appropriate runtimes.

---

## Edge delivery

### R-Q16. If edge SDKs are used, do contexts propagate to the edge?
- **High Risk** if edge evaluation runs against missing or wrong context.
- **Medium Risk** if context propagation is inconsistent.
- **None** if context is verified at the edge.

### R-Q17. Is the edge propagation lag a known property?
- **High Risk** if the team designs as if edge changes are instantaneous.
- **Medium Risk** if lag is acknowledged but not documented.
- **None** if expected lag is documented and rollout designs accommodate it.

---

## Multi-region and failover

### R-Q18. For multi-region deployments, is Relay topology decided per region deliberately?
- **High Risk** if multi-region deployments share a single central Relay (or no Relay strategy).
- **Medium Risk** if regional Relay exists but isn't validated for failover.
- **None** if regional Relay is sized and tested.

### R-Q19. Has the cross-region failover path been tested with LD evaluation in scope?
- **High Risk** if failover hasn't been tested and is unproven.
- **Medium Risk** if it's been tested but more than a year ago.
- **None** if tested within the last year.

### R-Q20. For regional data, does flag evaluation honor residency?
- **High Risk** if cross-region evaluation moves data across boundaries that policy forbids.
- **Medium Risk** if the boundary is enforced informally.
- **None** if residency-aware evaluation is the documented pattern.

---

## AI Config and provider resilience

### R-Q21. Does every AI Config call have a defined fallback variation?
- **High Risk** if AI calls fail with no defined fallback.
- **Medium Risk** if fallbacks exist but are inconsistent.
- **None** if every AI Config has a documented, tested fallback variation.

### R-Q22. Are provider-side timeouts configured aggressively, with a clear fallback on timeout?
- **High Risk** if timeouts are unset or set so long that users experience indefinite waits.
- **Medium Risk** if timeouts are set but fallback behavior is unclear.
- **None** if timeouts match user-experience budget and fallback engages on timeout.

### R-Q23. For business-critical AI features, do you have multi-provider redundancy planned or in use?
- **High Risk** if a critical feature depends on a single provider with no fallback provider.
- **Medium Risk** if multi-provider is planned but not implemented.
- **None** if multi-provider is in use for the appropriate features.

### R-Q24. Is caching used where the AI use case allows?
- **High Risk** if cacheable workloads aren't cached and pay full LLM cost on every request.
- **Medium Risk** if some caching exists but coverage is partial.
- **None** if caching is applied wherever the use case supports it.

---

## Event ingestion

### R-Q25. Do you know your SDK's event-buffering behavior and configure it for your workload?
- **High Risk** if buffering is at defaults and the workload would lose events at peak load.
- **Medium Risk** if defaults work but haven't been verified.
- **None** if buffering is configured deliberately and tested.

### R-Q26. Is event flow monitored from the application side?
- **High Risk** if silent event loss is possible and undetectable.
- **Medium Risk** if some monitoring exists.
- **None** if event submission is monitored against expected rate.

---

## Chaos and drills

### R-Q27. Has the team drilled "LaunchDarkly unavailable" in the last quarter?
- **High Risk** if no drill has happened, or the most recent drill was over a year ago.
- **Medium Risk** if drills happen but findings aren't tracked.
- **None** if drills are scheduled, executed, and produce improvements.

### R-Q28. Has Relay Proxy degradation been drilled?
- **High Risk** if Relay degradation behavior has never been tested.
- **Medium Risk** if some testing exists.
- **None** if Relay degradation is part of the regular drill cadence.

### R-Q29. Has AI provider failure been drilled?
- **High Risk** if AI features have never been tested under provider failure.
- **Medium Risk** if testing is informal.
- **None** if provider failure is drilled and the fallback behavior is verified.

---

## Dependency posture

### R-Q30. Has the team articulated the dependency posture for each LD-managed system?
- **High Risk** if the team can't say how hard a dependency LD is for each system.
- **Medium Risk** if posture is informal.
- **None** if posture is documented and matches controls.

### R-Q31. Do the controls (Relay sizing, monitoring, caching) match the dependency posture?
- **High Risk** if controls are uniform across systems with very different needs.
- **Medium Risk** if controls roughly match but aren't calibrated.
- **None** if controls are matched to posture per system.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
