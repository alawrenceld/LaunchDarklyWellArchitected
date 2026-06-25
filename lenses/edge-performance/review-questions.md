# Edge & Performance-Critical — Review Questions

These questions are **additions** to the standard pillar review questions for edge-deployed and latency-budget-constrained workloads.

---

## Latency budgets

### EP-Q1. Is there a documented end-to-end latency budget for each performance-critical surface?
- **High Risk** if "fast" is the only specification.
- **Medium Risk** if budgets exist informally.
- **None** if budgets are documented per surface with component breakdowns.

### EP-Q2. Is the LaunchDarkly evaluation's share of the budget explicit?
- **High Risk** if LD's latency contribution is implicit.
- **Medium Risk** if it's measured but not against a budget.
- **None** if budget and actual are tracked and reviewed.

### EP-Q3. Are latency regressions treated as correctness bugs (not as accepted drift)?
- **High Risk** if "the new code is just slower" is accepted.
- **Medium Risk** if some regressions are addressed.
- **None** if every regression is triaged and fixed.

---

## Edge SDK selection and operation

### EP-Q4. Is the SDK the platform-native LaunchDarkly SDK for the edge platform in use?
- **High Risk** if a non-native SDK is forced into the edge runtime.
- **Medium Risk** if a community SDK is in use and the team hasn't validated its production readiness.
- **None** if the platform-native SDK is in use.

### EP-Q5. Are all context attributes used in targeting available at the edge without origin round-trip?
- **High Risk** if origin lookups happen on the critical path of edge evaluation.
- **Medium Risk** if some lookups happen but are cached.
- **None** if context is fully available from request data, derived data, or edge KV.

### EP-Q6. Is cache miss behavior at the edge configured deliberately?
- **High Risk** if cache misses cause errors or undefined behavior.
- **Medium Risk** if behavior is defined but unreviewed.
- **None** if cache miss falls back to a deliberate default (or origin) per surface needs.

---

## Propagation lag

### EP-Q7. Is the expected propagation lag for the edge platform documented?
- **High Risk** if the team thinks of edge changes as instant.
- **Medium Risk** if lag is acknowledged but not documented.
- **None** if expected propagation is documented and rollout designs accommodate it.

### EP-Q8. Are rollouts designed to tolerate propagation lag (longer observation windows, region-aware ramps)?
- **High Risk** if rollouts evaluate metrics before propagation has completed globally.
- **Medium Risk** if some rollouts get this right.
- **None** if rollout design consistently accounts for propagation.

### EP-Q9. For ultra-critical kill paths, do origin-side fallbacks complement edge kill switches?
- **High Risk** if a critical kill depends solely on edge propagation.
- **Medium Risk** if some surfaces have complementary kills.
- **None** if all critical surfaces have multi-layer kill capability.

---

## Edge / origin consistency

### EP-Q10. Do edge and origin SDKs evaluate against the same LaunchDarkly project / environment?
- **High Risk** if edge and origin use different projects.
- **Medium Risk** if they use the same project but different environments without good reason.
- **None** if they're consistently aligned.

### EP-Q11. Is the application's contract forward/backward compatible across edge/origin propagation windows?
- **High Risk** if a brief consistency gap can cause data corruption or auth bypass.
- **Medium Risk** if compatibility is informal.
- **None** if compatibility is a design constraint and tested.

---

## Relay at scale

### EP-Q12. Is Relay sized for peak load with documented headroom of at least 2×?
- **High Risk** if Relay saturates at peak.
- **Medium Risk** if sizing is informal.
- **None** if peak sizing is explicit and verified.

### EP-Q13. Are per-instance Relay metrics monitored with distribution visibility (not just aggregates)?
- **High Risk** if only aggregate metrics exist; uneven load goes undetected.
- **Medium Risk** if per-instance metrics exist but aren't reviewed.
- **None** if dashboards surface per-instance distribution.

### EP-Q14. Is pre-saturation alerting configured?
- **High Risk** if alerts fire only at saturation.
- **Medium Risk** if some leading-indicator alerts exist.
- **None** if alerts give meaningful lead time before saturation.

### EP-Q15. Is the Relay fleet drilled at least monthly?
- **High Risk** if drills have never happened.
- **Medium Risk** if drills happen but infrequently.
- **None** if monthly drills are the cadence.

### EP-Q16. Is there a current Relay-incident runbook covering common patterns?
- **High Risk** if no runbook exists.
- **Medium Risk** if a runbook exists but is stale.
- **None** if the runbook is current and exercised.

---

## Multi-region edge

### EP-Q17. For multi-region workloads, is the team's expectation about edge consistency explicit?
- **High Risk** if the team assumes globally consistent flag state at the edge.
- **Medium Risk** if the assumption is partially documented.
- **None** if eventual consistency is the documented assumption and applications are designed for it.

### EP-Q18. Are correctness-critical decisions kept off the edge (or origin-validated)?
- **High Risk** if security or correctness depends on edge-only evaluation.
- **Medium Risk** if some decisions are origin-validated.
- **None** if security/correctness decisions are always origin-side.

---

## Event collection

### EP-Q19. Is event collection from edge runtimes validated to be reaching LaunchDarkly?
- **High Risk** if silent event loss from edge is possible.
- **Medium Risk** if validation is informal.
- **None** if event flow from edge is monitored.

### EP-Q20. Are high-volume edge events sampled appropriately?
- **High Risk** if naive event emission at edge scale produces unnecessary cost.
- **Medium Risk** if sampling exists but is inconsistent.
- **None** if sampling is deliberate.

---

## Daemon mode (if applicable)

### EP-Q21. For daemon-mode workloads, is the persistent store operated like a production system?
- **High Risk** if the store is unmonitored or under-sized.
- **Medium Risk** if monitoring exists but is partial.
- **None** if the store has the same operational discipline as Relay.

### EP-Q22. Is the daemon-mode store sized for the read throughput from SDKs?
- **High Risk** if the store saturates under load.
- **Medium Risk** if sizing is informal.
- **None** if sizing is deliberate and verified.

---

## Local development

### EP-Q23. Can developers run edge code locally with LaunchDarkly integration working?
- **High Risk** if local dev for edge code is broken.
- **Medium Risk** if it works but is fragile.
- **None** if local dev is reliable.

### EP-Q24. Are edge code paths covered by tests for each flag variation?
- **High Risk** if edge code isn't tested per variation.
- **Medium Risk** if testing is partial.
- **None** if every edge code path has variation coverage.

---

← [Relay Proxy at Large Scale](./relay-at-large-scale.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
