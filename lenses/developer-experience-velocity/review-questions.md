# Developer Experience & Velocity — Review Questions

These questions are **additions** to the standard pillar review questions for the developer-experience dimension.

---

## SDK integration

### DX-Q1. Is the SDK initialized once per process and shared?
- **High Risk** if per-request init exists.
- **Medium Risk** if mostly singleton with exceptions.
- **None** if singleton is universal.

### DX-Q2. Is there an SDK wrapper or typed access layer reflecting the team's defaults?
- **High Risk** if every consumer initializes the SDK with raw config and there are inconsistencies.
- **Medium Risk** if a wrapper exists but coverage is partial.
- **None** if the wrapper is universal.

### DX-Q3. Is SDK initialization bounded by an explicit timeout?
- **High Risk** if startup can block on LD.
- **Medium Risk** if timeout exists but is long.
- **None** if init proceeds in the background with the application continuing.

---

## Type safety

### DX-Q4. Are flag keys referenced via typed constants or codegen (not string literals)?
- **High Risk** if string literals are scattered through the codebase.
- **Medium Risk** if some typed access exists but isn't enforced.
- **None** if typed access is the standard and enforced by lint.

### DX-Q5. Does the codegen pipeline keep constants current?
- **High Risk** if the constants file is hand-maintained and drifts.
- **Medium Risk** if codegen runs but isn't gated in CI.
- **None** if codegen runs on every PR and CI verifies the output.

### DX-Q6. Are references to archived flags caught at build time?
- **High Risk** if archived flags can be referenced silently and return fallback in production.
- **Medium Risk** if checks exist but are weak.
- **None** if archived-flag references fail the build.

---

## Local development

### DX-Q7. Is there a usable LaunchDarkly dev environment for local development?
- **High Risk** if developers run against production credentials locally.
- **Medium Risk** if a dev environment exists but is incomplete.
- **None** if dev is fully set up and engineers use it routinely.

### DX-Q8. Can developers run their application locally without network access to LaunchDarkly?
- **High Risk** if local dev breaks without LD network access.
- **Medium Risk** if offline mode is supported but not commonly used.
- **None** if offline mode (or file-data-source) is a first-class local-dev option.

---

## Testing

### DX-Q9. Are flag-gated code paths covered by tests for each variation?
- **High Risk** if tests only cover the on-path (or only the off-path).
- **Medium Risk** if coverage is partial.
- **None** if every flag-gated path has tests for every variation.

### DX-Q10. Does CI run tests in offline mode to exercise the fallback path?
- **High Risk** if the fallback path is never exercised.
- **Medium Risk** if offline-mode tests exist but only for some surfaces.
- **None** if offline-mode tests are standard.

### DX-Q11. Are tests resistant to flag-key renames (testing behavior, not flag keys)?
- **High Risk** if tests reference flag values literally and break on rename.
- **Medium Risk** if some tests are name-tied.
- **None** if test naming describes behavior.

---

## IaC

### DX-Q12. Are foundational LaunchDarkly resources (projects, environments, custom roles, foundational segments) managed in IaC?
- **High Risk** if no IaC exists and resource creation is ad hoc.
- **Medium Risk** if IaC covers some resources but with inconsistency.
- **None** if foundational resources are IaC-managed.

### DX-Q13. Is the IaC vs. UI boundary documented?
- **High Risk** if the boundary is implicit and engineers don't know which to use.
- **Medium Risk** if the boundary exists informally.
- **None** if the boundary is documented and current.

### DX-Q14. Does CI for the IaC repo run plan on PRs and apply on merge?
- **High Risk** if IaC apply happens manually or inconsistently.
- **Medium Risk** if pipeline exists but is partial.
- **None** if the IaC pipeline is consistent with other deployment pipelines.

### DX-Q15. Is drift between IaC and actual state monitored?
- **High Risk** if drift goes unobserved indefinitely.
- **Medium Risk** if monitoring exists but isn't reviewed.
- **None** if drift detection produces actionable signals.

---

## CI/CD integration

### DX-Q16. Does CI run Code References on every relevant repo?
- **High Risk** if Code References is partially deployed or stale.
- **Medium Risk** if coverage is partial.
- **None** if every relevant repo is scanned.

### DX-Q17. Are new-flag PRs surfaced for review (the PR adds a flag, the reviewer sees it)?
- **High Risk** if new flags slip into the codebase silently.
- **Medium Risk** if surfacing is partial.
- **None** if every new flag is visible in its PR.

### DX-Q18. Do deploys annotate LaunchDarkly with deploy markers?
- **High Risk** if deploys are invisible to LD-side investigation.
- **Medium Risk** if integration exists but is partial.
- **None** if every deploy emits an annotation.

---

## Onboarding

### DX-Q19. Does a new engineer have a defined first-week LaunchDarkly task?
- **High Risk** if new engineers learn the tooling ad-hoc.
- **Medium Risk** if a task exists but is informal.
- **None** if onboarding includes a documented hands-on task.

### DX-Q20. Is there a current "how we use LaunchDarkly here" doc?
- **High Risk** if no such doc exists or it's stale.
- **Medium Risk** if it exists but is incomplete.
- **None** if it's current, comprehensive, and referenced during onboarding.

### DX-Q21. Are new engineers paired with experienced ones for their first non-trivial flag?
- **High Risk** if onboarding is solo and engineers learn from mistakes.
- **Medium Risk** if pairing happens but inconsistently.
- **None** if pair-based onboarding is the norm for first flag work.

---

## Engineering velocity

### DX-Q22. How long does a new engineer take to ship their first flag-gated change?
- **High Risk** if it takes weeks because of unclear tooling or process.
- **Medium Risk** if it takes a week and requires multiple help asks.
- **None** if a new engineer ships within their first week or two.

### DX-Q23. Are flag-related operations (create, update, archive) fast and low-friction for engineers?
- **High Risk** if engineers avoid using flags because the process is heavy.
- **Medium Risk** if friction is real but tolerable.
- **None** if the safe path is the easy path.

### DX-Q24. Is the team's standard rollout pattern the default path (template, wrapper, snippet)?
- **High Risk** if engineers reinvent the rollout pattern per flag.
- **Medium Risk** if templates exist but adoption is inconsistent.
- **None** if the template is the default and engineers use it automatically.

---

← [Type Safety & IaC](./type-safety-and-iac.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
