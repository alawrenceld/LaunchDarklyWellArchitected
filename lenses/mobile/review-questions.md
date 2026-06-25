# Mobile — Review Questions

These questions are **additions** to the standard pillar review questions for native mobile workloads. Run the standard pillar reviews first; then walk these.

For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items.

---

## SDK setup and initialization

### M-Q1. Is the correct SDK in use for the platform (iOS / Android / cross-platform)?
- **High Risk** if a server-side SDK is initialized in mobile code (uses a secret key from a public binary).
- **Medium Risk** if the cross-platform framework SDK is used where native platform SDKs would be more appropriate (or vice versa) and the choice is causing real friction.
- **None** if the SDK choice matches the application architecture.

### M-Q2. Is SDK initialization bounded by an explicit timeout, so the app's first paint doesn't block?
- **High Risk** if the SDK can block app launch indefinitely under poor network conditions.
- **Medium Risk** if a timeout exists but is too long for mobile latency budgets.
- **None** if init is non-blocking with a sensible timeout.

### M-Q3. Is the mobile key handled as a public credential (not over-protected, but scoped appropriately)?
- **High Risk** if a server-side SDK key is embedded in the mobile binary.
- **Medium Risk** if the credential handling is unclear.
- **None** if the mobile key is correctly scoped and the team understands it's public.

---

## Bootstrap and first-paint behavior

### M-Q4. Does the app's first-paint render correctly without a network round-trip?
Probe: launch the app in airplane mode. Does the first screen render correctly, or does the user see a flash of old behavior?
- **High Risk** if first-paint correctness depends on a network fetch that hasn't completed.
- **Medium Risk** if bootstrap is implemented but doesn't cover all surfaces.
- **None** if bootstrap (from cache, server-rendered, or bundled) makes first-paint correct under all conditions.

### M-Q5. Is bootstrap data sourced from the right place (cache / auth response / bundled defaults)?
- **High Risk** if bootstrap doesn't exist and the SDK starts cold every time.
- **Medium Risk** if only bundled defaults are used (low fidelity).
- **None** if bootstrap uses cached or server-rendered values appropriately.

---

## Persistent cache

### M-Q6. Is the SDK's persistent cache enabled and verified to survive app restarts?
- **High Risk** if the cache is in-memory only.
- **Medium Risk** if persistent caching is configured but never verified.
- **None** if the cache is verified to survive restart, reboot, and app update.

### M-Q7. Does the cache survive app updates (v4.5 → v4.6 transition)?
- **High Risk** if cache is wiped on every app update.
- **Medium Risk** if cache survives most updates but breaks on major version bumps.
- **None** if cache reliably survives across version transitions.

---

## Offline mode

### M-Q8. Does the application function correctly when the SDK is in offline mode (no network calls)?
Probe: run the app with the SDK forced offline. What works? What breaks?
- **High Risk** if any user-facing surface breaks under offline mode.
- **Medium Risk** if functional but visibly degraded in unintended ways.
- **None** if offline behavior is designed and tested.

### M-Q9. Is offline mode used in tests and drills?
- **High Risk** if no automated tests run with the SDK offline.
- **Medium Risk** if some tests but coverage is partial.
- **None** if offline mode is part of CI and quarterly production drills.

---

## Background and lifecycle

### M-Q10. Does the SDK behave correctly across background → foreground transitions?
- **High Risk** if backgrounded SDK fails to reconnect or doesn't refresh values on foreground.
- **Medium Risk** if behavior is uneven across OS versions or platform.
- **None** if behavior is consistent and tested.

### M-Q11. Has SDK behavior been tested across realistic user-pattern scenarios (overnight background, OS kill, etc.)?
- **High Risk** if these scenarios aren't tested before release.
- **Medium Risk** if testing is informal.
- **None** if every release includes lifecycle test scenarios.

---

## Defaults and fallbacks

### M-Q12. Is the fallback value passed to each SDK call chosen deliberately?
- **High Risk** if fallbacks are all set to `false` by default with no thought.
- **Medium Risk** if fallbacks are chosen but not documented.
- **None** if fallbacks are deliberate, documented per flag, and survived by the app.

### M-Q13. Is the off variation for each flag the safe / default state for *every* supported app version?
- **High Risk** if off variation breaks behavior on an older app version.
- **Medium Risk** if compatibility hasn't been verified across versions.
- **None** if every supported version handles the off variation correctly.

---

## Version targeting

### M-Q14. Does every flag whose behavior depends on app-version-specific code target on `app_version`?
- **High Risk** if flags can be served to versions that don't have the supporting code.
- **Medium Risk** if version targeting is inconsistent across flags.
- **None** if version targeting is the standard pattern.

### M-Q15. Are version constraints expressed as `>=` (not `=`), so hotfix versions inherit the targeting correctly?
- **High Risk** if exact-version constraints are common (and hotfix versions silently lose targeting).
- **Medium Risk** if some constraints are exact but most are correct.
- **None** if `>=` is the standard.

### M-Q16. Does the team raise the minimum supported app version on a documented cadence?
- **High Risk** if the team supports indefinitely-old versions and accumulates version-bound flags.
- **Medium Risk** if min-version updates happen but aren't paired with flag cleanup.
- **None** if min-version updates are scheduled and trigger archival of obsolete flags.

---

## Release coordination

### M-Q17. Does the team use both app-store staged rollouts *and* LaunchDarkly flag rollouts deliberately?
- **High Risk** if either is used as a substitute for the other.
- **Medium Risk** if both are used but without a clear policy on when to use which.
- **None** if both are used to protect against the failure modes each addresses.

### M-Q18. Is the order of release (server → binary → flag flip) understood and followed?
- **High Risk** if the team has shipped flag flips before the supporting binary or server change.
- **Medium Risk** if the order is informal.
- **None** if the order is documented and followed.

### M-Q19. Is server-side forward-compatibility maintained for older mobile versions?
- **High Risk** if a recent server change broke older mobile clients.
- **Medium Risk** if compatibility is hoped-for but not tested.
- **None** if compatibility is a deliberate design constraint and tested.

---

## Push and silent updates

### M-Q20. If push or silent push is used to refresh flag state, is the mechanism reliable?
- **High Risk** if reliance on push is critical but the push delivery rate is unknown.
- **Medium Risk** if push is used as a nice-to-have but not depended on.
- **None** if push is supplementary and the flag system works without it.

---

## Experimentation on mobile

### M-Q21. If experiments are run on mobile, do they account for version skew?
- **High Risk** if experiments compare users across versions naively.
- **Medium Risk** if the issue is acknowledged but not addressed.
- **None** if experiments are scoped to specific versions or stratified.

### M-Q22. Are mobile-specific metrics (crash rate, ANR, cold-start time, frame rate) part of the experiment metric set where applicable?
- **High Risk** if experiments only measure conversion-style outcomes and miss platform health.
- **Medium Risk** if mobile metrics exist but aren't gated.
- **None** if relevant mobile health metrics are first-class.

---

## Performance and cost

### M-Q23. Is event volume from mobile clients managed (buffering, batching, sampling)?
- **High Risk** if naive event emission produces material cost and battery drain.
- **Medium Risk** if controls exist but are not tuned.
- **None** if event behavior is configured deliberately.

### M-Q24. Is MAU/MCI from mobile forecast and budgeted?
- **High Risk** if mobile MAU is a surprise at renewal.
- **Medium Risk** if visibility exists but isn't acted on.
- **None** if mobile MAU is part of the team's capacity planning.

### M-Q25. Is battery and data usage of the SDK monitored as part of mobile health?
- **High Risk** if uninstall feedback or app-store reviews indicate battery / data complaints traceable to the SDK.
- **Medium Risk** if usage is high but accepted.
- **None** if SDK resource usage is monitored and tuned.

---

## Governance and lifecycle

### M-Q26. Are mobile flags tagged with platform information (`platform:ios`, `platform:android`, `platform:cross-platform`)?
- **High Risk** if no platform tagging exists; impossible to bulk-filter mobile flags.
- **Medium Risk** if tagging is partial.
- **None** if every mobile flag carries platform metadata.

### M-Q27. Are version-bound flags retired when the minimum supported app version exceeds the flag's lower-bound version?
- **High Risk** if version-bound flags accumulate indefinitely.
- **Medium Risk** if retirement happens but late.
- **None** if retirement is part of the minimum-version-bump workflow.

### M-Q28. Are Code References deployed across the mobile codebase (Swift, Kotlin, React Native, Flutter, etc.)?
- **High Risk** if mobile flags aren't scanned and archival is by guess.
- **Medium Risk** if coverage is partial across platforms.
- **None** if every mobile repo is scanned.

---

← [App-Store Cadence & Release](./app-store-cadence-and-release.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
