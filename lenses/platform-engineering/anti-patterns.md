# Platform Engineering — Anti-Patterns

A catalogue of common, named failure modes when LaunchDarkly is operated as a platform capability.

---

## AP-1. The platform team that became a ticket queue

**Shape:** Application teams can't change their own flags. Every flip requires a ticket to the platform team. The platform team processes the queue. Application teams find workarounds (env vars, config files, hard-coded toggles) because the queue is too slow.

**Why it's an anti-pattern:** the platform model only works if application teams can self-serve. A platform that gates routine work doesn't enable; it slows down.

**Symptom:** the platform team's ticket queue is the team's primary work product.

**Remedy:** scope access so application teams can do routine work themselves. The platform team's role is to enable, not to gatekeep.

---

## AP-2. The abstraction nobody uses

**Shape:** The platform team built a sophisticated wrapper library. It exposes the team's preferred API, encodes defaults, integrates with the observability stack. Application teams use it for new code but ignore it in existing code. The wrapper covers 20% of LD usage in the org.

**Why it's an anti-pattern:** abstractions are valuable only when adopted. Low adoption means the platform team's investment doesn't pay off; the standards the wrapper enforces aren't being applied broadly.

**Symptom:** the platform team has shipped abstractions; reviews show application teams aren't using them.

**Remedy:** investigate. Either the wrapper has UX problems (fix), the wrapper has gaps (extend), or adoption is being blocked by something (address). Don't ship abstractions and wait.

---

## AP-3. The 47-method God wrapper

**Shape:** The wrapper library has accumulated every feature anyone has ever requested. It's 4,000 lines. Engineers can't understand its full surface area. Bugs hide in features nobody uses. The platform team can't safely refactor.

**Why it's an anti-pattern:** abstractions should reveal structure; this one obscures it. The team's investment in the wrapper now costs more than it returns.

**Symptom:** new engineers ask "why does the wrapper do X?" and the platform team can't explain.

**Remedy:** trim the wrapper. Identify the 20% of features used by 80% of consumers; keep those; deprecate or remove the rest. Apply the platform-team-as-product-team discipline: features have lifecycles.

---

## AP-4. The Slack channel that became a platform-team Q&A

**Shape:** The `#team-help-launchdarkly` channel is full of application engineers asking the platform team basic questions. The platform team answers them, repeatedly, often the same questions. The documentation exists but isn't current; the docs say to ask in Slack; the cycle continues.

**Why it's an anti-pattern:** repeated questions are documentation gaps the team isn't closing. The platform team's time is consumed answering questions instead of building.

**Symptom:** the same question appears in Slack multiple times per month.

**Remedy:** every question answered in Slack becomes a documentation update. The platform team's office hours convert questions to docs.

---

## AP-5. The platform that owns nothing

**Shape:** The platform team's responsibility matrix is implicit. When an incident happens, application teams say "that's a platform issue"; the platform team says "that's an application issue." Nobody owns the resolution. Incidents stall.

**Why it's an anti-pattern:** the responsibility boundary's absence makes both sides able to disclaim. Nothing gets done.

**Symptom:** post-incident discussions about whose responsibility the failure was.

**Remedy:** document the responsibility matrix. Make it explicit; refer to it during incidents; update it when the team learns the boundary should move.

---

## AP-6. The platform team that doesn't dogfood

**Shape:** The platform team ships abstractions but doesn't use them itself. The team's own LaunchDarkly account operations don't go through the wrapper. The IaC modules they build for application teams aren't used to manage their own infrastructure. The wrapper has bugs the platform team never hits.

**Why it's an anti-pattern:** the platform team's own use is the highest-fidelity test of their abstractions. Skipping dogfooding means missing the problems first.

**Symptom:** application teams hit bugs in abstractions that the platform team has never noticed.

**Remedy:** the platform team uses its own abstractions for everything plausible. Dogfooding is part of the work, not a separate activity.

---

## AP-7. The "we'll fix it in v2" wrapper

**Shape:** The platform team shipped v1 of the wrapper library. It has known issues. Application teams complain. The platform team says "yes, we know, we'll address it in v2." V2 never gets prioritized. V1 lives on indefinitely.

**Why it's an anti-pattern:** known issues that linger erode application-team trust. Application teams begin to route around the platform team.

**Symptom:** application engineers refer to "the wrapper's quirks" as accepted reality.

**Remedy:** known issues get tracked, prioritized, and addressed on a defined cadence. If v2 isn't going to happen, retire the issue (with rationale) so application teams can plan.

---

## AP-8. The platform team that's exempt from review

**Shape:** The platform team's own LaunchDarkly account operations aren't subject to LDWA reviews. The team's foundational segments have drifted; the IaC modules are inconsistent with reality; the role configuration has accumulated cruft. Application teams notice; the platform team's credibility suffers.

**Why it's an anti-pattern:** the platform team's standards apply to itself. A team that exempts itself ages out of its own discipline.

**Symptom:** application teams discover platform-team resources that don't follow the standards the platform team taught them.

**Remedy:** the platform team runs LDWA reviews on its own work. Findings get addressed. The platform team holds itself to the standard it expects of others.

---

## AP-9. The over-scoped "platform team" doing too many products

**Shape:** The platform team owns LaunchDarkly, CI/CD, observability, internal developer portal, IaC, secrets management, and infrastructure. Each of these is a real product. The team is overwhelmed; quality drops on every front.

**Why it's an anti-pattern:** "platform team" can become a label for "operate everything." Real platforms specialize.

**Symptom:** the platform team's roadmap is broad and shallow; each capability gets minimal attention.

**Remedy:** sub-team or split. LaunchDarkly is one product; the team that owns it can specialize. Cross-cutting work happens via collaboration with other platform sub-teams.

---

## AP-10. The application team that built a parallel platform

**Shape:** One application team decided the platform team's offerings didn't fit. They built their own wrapper, their own IaC modules, their own rollout patterns — parallel to the platform team's. Other teams notice and consider doing the same.

**Why it's an anti-pattern:** parallel platforms fragment the org. Each team's investment is duplicated; cross-team learning doesn't flow.

**Symptom:** an application team's tech-talk reveals they've built their own LaunchDarkly platform layer.

**Remedy:** investigate the why. If the platform's offerings genuinely don't fit, fix them. If the application team had a legitimate gap, that gap is a platform-team product opportunity, not a competitor.

---

## AP-11. The platform team that didn't measure adoption

**Shape:** The platform team has shipped a year's worth of abstractions. They don't know which are being used, by which teams, at what rate. New abstractions are prioritized by intuition. Some popular abstractions are under-invested; some unused ones receive ongoing maintenance.

**Why it's an anti-pattern:** without adoption telemetry, the platform team is investing on faith. The team makes worse priority decisions than they would with data.

**Symptom:** roadmap conversations reach "let's build X" without "X would actually be used by team Y."

**Remedy:** instrument abstractions. Wrapper-library usage, codegen-pipeline usage, IaC-module-version distribution. The data informs the roadmap.

---

## AP-12. The platform team treated as cost center

**Shape:** Org leadership sees the platform team as overhead — operational work that doesn't ship features. The team is under-resourced; technical debt accumulates; application teams suffer; leadership concludes "the platform team is failing" and reduces investment further. Doom spiral.

**Why it's an anti-pattern:** the platform team's value is in application-team velocity. Measuring only the platform team's direct output misses the leverage.

**Symptom:** platform-team headcount is constantly under threat; application teams' velocity is declining; nobody connects the two.

**Remedy:** measure and communicate platform-team impact in terms of application-team outcomes. Adoption metrics, satisfaction surveys, incidents avoided, time-to-first-flag improvements. Make the leverage visible.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
