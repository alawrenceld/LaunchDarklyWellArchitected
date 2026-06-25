# Platform Engineering — Review Questions

These questions are **additions** to the standard pillar review questions for organizations operating LaunchDarkly as a platform capability.

---

## Platform team identity and orientation

### PE-Q1. Is there a named platform team or owner for LaunchDarkly?
- **High Risk** if no one owns LaunchDarkly at the org level.
- **Medium Risk** if ownership exists but is informal.
- **None** if the owning team is documented and accountable.

### PE-Q2. Does the platform team operate with a product orientation (users, roadmap, feedback)?
- **High Risk** if the team treats application teams as a workload, not as customers.
- **Medium Risk** if some product practices exist.
- **None** if the platform team operates as a product team.

### PE-Q3. Are platform-team success metrics defined and tracked?
- **High Risk** if "the platform exists" is the success criterion.
- **Medium Risk** if metrics exist but aren't reviewed.
- **None** if adoption rate, satisfaction, and application-team velocity are measured.

---

## Responsibility boundary

### PE-Q4. Is the boundary between platform-team and application-team responsibilities documented?
- **High Risk** if responsibilities are implicit and disputed.
- **Medium Risk** if documented but inconsistent in practice.
- **None** if the responsibility matrix is documented and respected.

### PE-Q5. Do application teams have the access and tooling to do routine LD work without platform-team involvement?
- **High Risk** if routine work requires platform-team tickets.
- **Medium Risk** if some self-service exists.
- **None** if application teams operate independently for routine work.

### PE-Q6. Does the platform team avoid doing application-team work routinely?
- **High Risk** if the platform team is the team's flag-flipper.
- **Medium Risk** if some application-team work creeps in.
- **None** if the boundary holds.

---

## Shared abstractions

### PE-Q7. Is there a shared SDK wrapper library used across the org?
- **High Risk** if every team uses the raw SDK with different defaults.
- **Medium Risk** if a wrapper exists but adoption is partial.
- **None** if the wrapper is widely adopted.

### PE-Q8. Is there a codegen pipeline producing typed flag-key constants?
- **High Risk** if every team handles flag keys differently.
- **Medium Risk** if codegen exists for some languages but not all.
- **None** if codegen covers all relevant languages.

### PE-Q9. Are IaC modules available for foundational LaunchDarkly resources?
- **High Risk** if every team writes its own Terraform.
- **Medium Risk** if modules exist but adoption is partial.
- **None** if modules are widely used.

### PE-Q10. Are Release Pipeline templates available, and are they used as the default?
- **High Risk** if every team designs their own pipelines.
- **Medium Risk** if templates exist but ad-hoc pipelines are common.
- **None** if templates are the default and ad-hoc is exception.

### PE-Q11. Are service scaffolds / templates pre-wired with LaunchDarkly?
- **High Risk** if new services start without LaunchDarkly integration.
- **Medium Risk** if integration exists but is inconsistent.
- **None** if new services get LaunchDarkly integration from the template automatically.

---

## Golden path

### PE-Q12. Is there a documented golden path covering the most common use cases?
- **High Risk** if no canonical path is documented.
- **Medium Risk** if a path exists but is not referenced.
- **None** if the golden path is documented, referenced, and broadly followed.

### PE-Q13. Are deviations from the golden path tracked and reviewed?
- **High Risk** if deviations accumulate without review.
- **Medium Risk** if reviews are informal.
- **None** if deviations are surfaced and addressed.

---

## Cross-team governance

### PE-Q14. Are Teams and custom roles configured to enforce cross-team boundaries?
- **High Risk** if all members have broad cross-team access.
- **Medium Risk** if some boundaries exist.
- **None** if boundaries are encoded and reviewed.

### PE-Q15. Are foundational segments and their structure platform-team-owned?
- **High Risk** if foundational segments drift across application-team changes.
- **Medium Risk** if some segments are platform-owned.
- **None** if the foundational layer is clearly platform-owned.

---

## Self-service

### PE-Q16. Can a new application team onboard to LaunchDarkly in days, not weeks?
- **High Risk** if onboarding requires extensive platform-team handholding.
- **Medium Risk** if onboarding is feasible but slow.
- **None** if new teams onboard quickly using documentation and tooling.

### PE-Q17. Can application teams create flags, run experiments, and manage rollouts without filing tickets?
- **High Risk** if routine application-team work is platform-team-queued.
- **Medium Risk** if some work is self-service.
- **None** if routine work is fully self-service.

### PE-Q18. Is the platform team's documentation usable for self-service?
- **High Risk** if engineers reach office hours for routine questions.
- **Medium Risk** if documentation is partial.
- **None** if most questions are answered by documentation.

---

## Feedback loops

### PE-Q19. Does the platform team have regular feedback channels with application teams (office hours, surveys, telemetry)?
- **High Risk** if the platform team is invisible to application teams.
- **Medium Risk** if channels exist but are underused.
- **None** if feedback loops are active and inform the roadmap.

### PE-Q20. Does the platform team track adoption of its abstractions?
- **High Risk** if adoption isn't measured.
- **Medium Risk** if adoption is tracked but not acted on.
- **None** if low-adoption abstractions are investigated and either improved or retired.

---

## Platform self-review

### PE-Q21. Does the platform team run LDWA reviews on its own work?
- **High Risk** if the platform is exempt from review.
- **Medium Risk** if reviews happen ad hoc.
- **None** if platform-team reviews are scheduled.

### PE-Q22. Are platform-team-owned resources (foundational segments, custom roles, IaC) maintained with the same discipline expected of application teams?
- **High Risk** if platform-team resources drift while application teams are held to standard.
- **Medium Risk** if some drift exists.
- **None** if the platform team holds itself to its own standards.

---

## Platform-team sizing and capacity

### PE-Q23. Is the platform team sized appropriately for the LaunchDarkly footprint?
- **High Risk** if the platform team is a bottleneck or chronically overloaded.
- **Medium Risk** if capacity is tight.
- **None** if capacity matches need.

### PE-Q24. Does the platform team have time for product work (abstractions, improvements, documentation), not just operational work?
- **High Risk** if the platform team is 100% reactive.
- **Medium Risk** if product work is squeezed.
- **None** if the team has reserved capacity for product work.

---

← [Shared Abstractions & Templates](./shared-abstractions-and-templates.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
