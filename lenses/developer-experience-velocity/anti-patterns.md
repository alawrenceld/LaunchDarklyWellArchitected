# Developer Experience & Velocity — Anti-Patterns

A catalogue of common, named DX failure modes.

---

## AP-1. The magic-string flag key

**Shape:** Flag keys are scattered through the codebase as string literals: `client.boolVariation("checkout-v2-redirect", ...)`. A typo (`"checkut-v2-redirect"`) compiles fine and silently returns the fallback. The team learns about the bug months later from a customer.

**Why it's an anti-pattern:** type-system support is the cheapest correctness tool available. Forgoing it produces silent bugs.

**Symptom:** investigations that trace bugs back to a flag-key typo from a year ago.

**Remedy:** generate constants or use a typed wrapper. Lint to reject string literals.

---

## AP-2. The init that blocks the world

**Shape:** Application startup waits for the SDK to fully initialize before serving the first request. Under healthy conditions this adds 300ms. During a LaunchDarkly hiccup, it blocks for 30 seconds or never returns. The application doesn't start; users see nothing.

**Why it's an anti-pattern:** the application's cold-start is now coupled to a network call. The flag system is supposed to enable safety; here it's a single point of failure for boot.

**Symptom:** startup-time anomalies correlated with LD network issues.

**Remedy:** bounded init timeout. Application proceeds with fallback values after the timeout.

---

## AP-3. The tests that never exercised the fallback

**Shape:** Every unit test for flag-gated code sets the flag to `true`. The fallback path (`false`) is never tested. When LD is unreachable in production, the application exercises the untested fallback for the first time — and it has a bug.

**Why it's an anti-pattern:** the fallback path runs in exactly the moments when bugs hurt most. Discovering them under degradation compounds the incident.

**Symptom:** post-incident, "the fallback path has a bug we didn't know about."

**Remedy:** every flag-gated path has tests for every variation including fallback. Offline-mode CI exercises the fallback end-to-end.

---

## AP-4. The dev environment that's just production

**Shape:** Local development uses the production LaunchDarkly environment. Developers see production flag values. Their local changes occasionally affect production flags ("oops, I was on prod"). The team has had close-call incidents.

**Why it's an anti-pattern:** local dev should be isolated from production. Mixing them is a permission-and-blast-radius failure waiting to happen.

**Symptom:** the team's chat has stories of engineers narrowly avoiding production changes from local dev.

**Remedy:** distinct dev environment with its own SDK key and looser permissions. Production credentials never appear on engineer laptops.

---

## AP-5. The orphan codegen

**Shape:** Codegen for flag-key constants was set up two years ago. It's not part of CI; it's run manually. The constants file is stale — references to flags that were archived months ago still exist. New flags are missing from the file. Engineers add string literals because the constants file isn't trustworthy.

**Why it's an anti-pattern:** codegen that isn't automated atrophies. Atrophied codegen is worse than no codegen — it provides false confidence.

**Symptom:** flag references in code don't match the constants file; constants for archived flags still appear.

**Remedy:** codegen runs on every PR; CI verifies the output. Stale constants files fail the build.

---

## AP-6. The IaC that nobody uses

**Shape:** A platform engineer set up Terraform for LaunchDarkly six months ago. The application teams ignore it — they create projects, segments, and roles through the UI because it's faster. The IaC drifts further from reality every week.

**Why it's an anti-pattern:** IaC without adoption is shelfware. The structure of LaunchDarkly is in the UI; the structure in IaC is fiction.

**Symptom:** a `terraform plan` shows hundreds of differences from reality.

**Remedy:** define which resources are IaC-managed; refuse UI creation of those (via custom-role restriction). The teams who need new managed resources go through IaC. Drift-detection runs continuously.

---

## AP-7. The first-week LaunchDarkly task that nobody designed

**Shape:** A new engineer asks how to add a flag. The team says "look at how others have done it." The engineer reads ten different patterns across the codebase, picks one (mostly at random), and ships something that doesn't match the team's intended pattern.

**Why it's an anti-pattern:** onboarding is the most leveraged training the team does. Leaving it to ad-hoc learning produces variance.

**Symptom:** new engineers' first few flag-related PRs need significant correction.

**Remedy:** a documented "how we use LaunchDarkly here" doc; a first-week hands-on task; pairing with an experienced engineer for the first non-trivial flag.

---

## AP-8. The wrapper library that hides too much

**Shape:** The team's SDK wrapper is so abstracted that engineers can't see what's happening. Debugging requires reading the wrapper. Custom configurations are impossible without forking the wrapper. The "DX improvement" became a usability tax.

**Why it's an anti-pattern:** abstractions should reveal structure, not hide it. An impenetrable wrapper trades one set of friction for another.

**Symptom:** engineers consult the wrapper code more often than the LaunchDarkly docs.

**Remedy:** wrappers expose what they configure; let engineers see (and override) the underlying behavior; document the wrapper's design as well as its API.

---

## AP-9. The PR template that doesn't mention flags

**Shape:** The team has a PR template covering tests, screenshots, and review checks. It doesn't mention flags. A PR adds a flag-gated change; the reviewer doesn't notice; the PR ships without flag-related review.

**Why it's an anti-pattern:** what's not on the template doesn't get reviewed. Flag changes get reviewed less rigorously than they deserve.

**Symptom:** flag-related issues that should have been caught in review.

**Remedy:** PR template includes flag fields (owner, type, retirement plan). Reviewers check them.

---

## AP-10. The "we'll add tests later" flag

**Shape:** A PR adds a flag-gated change. Tests cover only the enabled path; the disabled path is "trivial, doesn't need a test." Months later, the flag is flipped off; the disabled path turns out to have a bug.

**Why it's an anti-pattern:** "trivial" code paths are routinely the source of bugs because nobody scrutinizes them. The disabled path is real code.

**Symptom:** the disabled path causes problems when invoked.

**Remedy:** both paths get tests as a matter of policy. No exceptions for "trivial."

---

## AP-11. The deploys that aren't visible to LaunchDarkly

**Shape:** The team deploys multiple times a day. None of those deploys are recorded in LaunchDarkly. During an incident investigation, the team tries to correlate "what changed in LD?" with "what was deployed?" — the answer requires cross-referencing two separate timelines.

**Why it's an anti-pattern:** the integration is cheap; the cost of not having it is real friction during incidents.

**Symptom:** incident timelines that have to be reconstructed from multiple sources.

**Remedy:** deploys emit events to LaunchDarkly (via webhook or audit-log integration). The integration is part of the deploy pipeline.

---

## AP-12. The slow flag-create workflow

**Shape:** Creating a new flag requires logging into LaunchDarkly, navigating menus, filling fields, tagging, setting variations, configuring defaults — five minutes of clicks. Engineers avoid creating flags because of the friction. They use environment variables or hard-coded toggles instead.

**Why it's an anti-pattern:** the safe path (flags) has become the slow path. Engineers route around it.

**Symptom:** "we should have used a flag for this" appears in post-mortems.

**Remedy:** make flag creation fast via a CLI, a UI form with sensible defaults, or templates. The safe path should be the easy path.

---

← [Review Questions](./review-questions.md) | Back to → [Lens Index](./README.md)
