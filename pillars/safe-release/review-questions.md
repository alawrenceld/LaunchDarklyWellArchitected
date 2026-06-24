# Safe Release — Review Questions

Use these during a [LDWA review](../../framework/review-process.md). For each question:

1. Get a specific answer with evidence.
2. Assign a risk level: **High Risk**, **Medium Risk**, or **None**.
3. Capture any improvement items in the workbook.

---

## Targeting strategy

### SR-Q1. Have you modeled your audience using LaunchDarkly contexts, and are the context kinds in use defensible?
Probe: Are you using a single `user` context, or do you use multi-context evaluation (e.g., `user` + `organization` + `device`)? Why? Where does the data come from?
- **High Risk** if the team is targeting on ad-hoc string attributes with no schema, or stuffing organization-level data into user attributes.
- **Medium Risk** if the context model is consistent but flat (single `user` context only) where a richer model would help.
- **None** if context kinds are defined, used consistently, and source data is reliable.

### SR-Q2. Are reusable audiences defined as segments, or duplicated in flag rules?
Probe: How many flags reference your "EU customers" or "beta tier" audience? Is the audience defined once or in each flag?
- **High Risk** if a critical audience is duplicated across many flags with drift between them.
- **Medium Risk** if some duplication exists but is tracked.
- **None** if reusable audiences are segments and segments are the source of truth.

### SR-Q3. Are you targeting only on attributes that are stable and meaningful?
Probe: Show me your most-used targeting rules. Where do the attributes come from? What happens if the upstream system changes them?
- **High Risk** if rules depend on unstable strings (substring matches on user-agents, undocumented vendor headers, etc.).
- **Medium Risk** if rules are mostly stable but a few are fragile.
- **None** if all targeting attributes are stable, documented, and owned.

---

## Rollout patterns

### SR-Q4. For your last five customer-facing releases, was a rollout sequence defined in advance?
Probe: Where? In a doc, a pipeline, a comment in the flag? What happens if it's not?
- **High Risk** if rollout sequences are decided ad hoc, in chat, during the release.
- **Medium Risk** if sequences exist in docs but aren't consistently followed.
- **None** if every meaningful release follows a pre-committed sequence, ideally a pipeline.

### SR-Q5. Does the rollout shape match the blast radius of the change?
Probe: How do you decide whether a change gets a percentage rollout vs. a ring rollout vs. a guarded release vs. a pipeline?
- **High Risk** if high-blast-radius changes (auth, billing, checkout, data migrations) ship without guarded releases or pipelines.
- **Medium Risk** if the decision is made by individual engineers without a shared framework.
- **None** if rollout shape is dictated by a written policy and applied consistently.

### SR-Q6. For infrastructure cutovers (DB migrations, service rewrites, dependency swaps), do you route via flag?
- **High Risk** if a major infra cutover is planned without a flag-based switch and a kept-warm rollback path.
- **Medium Risk** if flag-based cutovers happen but rollback paths aren't kept warm.
- **None** if every cutover uses a flag-based switch with a tested rollback path.

---

## Guarded Releases

### SR-Q7. Do customer-facing, high-blast-radius releases use Guarded Releases?
- **High Risk** if no customer-facing release uses Guarded Releases or an equivalent metric-driven progressive rollout.
- **Medium Risk** if some releases use them but coverage is inconsistent.
- **None** if Guarded Releases are the default for the blast-radius tier that warrants them.

### SR-Q8. Do your guardrail metrics actually move when the feature changes user experience?
Probe: Look at the last three guarded releases. Did the guardrail metric move at all? In which direction?
- **High Risk** if guardrails are placeholders that never move (no signal).
- **Medium Risk** if guardrails move but the team can't articulate why those particular metrics were chosen.
- **None** if guardrails are deliberately chosen, validated, and reviewed periodically.

### SR-Q9. Are regression thresholds calibrated — neither too tight nor too loose?
Probe: How were the thresholds set? Have you ever had a "false positive" rollback? A "false negative" non-rollback?
- **High Risk** if thresholds are default-tight (constant noise rollbacks) or default-loose (real regressions missed).
- **Medium Risk** if thresholds are unreviewed since initial setup.
- **None** if thresholds are deliberately set, reviewed quarterly, and tuned based on incident history.

### SR-Q10. Are guarded releases wired to on-call alerting?
Probe: Who finds out when a guarded release detects a regression? How? In how many seconds/minutes?
- **High Risk** if rollbacks happen silently and the on-call has to discover them after the fact.
- **Medium Risk** if alerting exists but only via email or a low-priority channel.
- **None** if Guardian Edition's PagerDuty integration (or equivalent) opens a tracked incident in real time.

---

## Release Pipelines

### SR-Q11. Is your standard rollout pattern encoded as a Release Pipeline?
- **High Risk** (for Enterprise/Guardian plans) if no pipelines exist and every team reinvents the rollout strategy per flag.
- **Medium Risk** if pipelines exist but cover a minority of releases.
- **None** if pipelines cover the meaningful release surface, with policy-driven defaults.

### SR-Q12. Are approvals in the pipeline at the right boundaries for your governance posture?
- **High Risk** if production exposure begins with no approval gate, in a regulated context.
- **Medium Risk** if approvals exist but are placed where they don't constrain real risk.
- **None** if approval placement matches the governance policy and is reviewed periodically.

### SR-Q13. Are your pipelines short and used, or long and bypassed?
- **High Risk** if pipelines exist but >50% of releases bypass them.
- **Medium Risk** if pipelines have grown long and complex enough that bypass is normal.
- **None** if pipelines are short, used consistently, and revised when bypass patterns emerge.

---

## AI Config rollouts

> Skip this section if AI Configs are not in scope for this system. Revisit during the AI/GenAI lens review.

### SR-Q14. Are AI Config changes treated as releases, with progressive exposure and guardrails?
- **High Risk** if model/prompt swaps go to 100% of users in a single change.
- **Medium Risk** if progressive exposure happens but without guardrail metrics.
- **None** if AI Config changes follow the same progressive-exposure, guardrails, reversibility discipline as flags.

### SR-Q15. Do you have an explicit fallback for AI Config evaluation failures?
- **High Risk** if no fallback exists and the application breaks when the provider errors or times out.
- **Medium Risk** if a fallback exists but is untested.
- **None** if the fallback is defined, tested, and includes a sensible user-facing behavior.

### SR-Q16. Are cost and latency guardrails attached to AI rollouts?
- **High Risk** if cost regressions are discovered via the monthly invoice.
- **Medium Risk** if latency is monitored but cost is not.
- **None** if cost-per-request and p95 latency are first-class guardrails on every AI rollout.

---

## Kill switches and fallbacks

### SR-Q17. For each customer-facing product surface, can you name the kill switch?
- **High Risk** if any major surface has no defined kill switch, or the team can't name it from memory.
- **Medium Risk** if kill switches exist but are not documented for the on-call.
- **None** if every major surface has a named, documented kill switch.

### SR-Q18. When was the last time a kill switch was flipped in production (drill or real)?
- **High Risk** if "never" or ">12 months."
- **Medium Risk** if "in the last 6–12 months."
- **None** if "in the last quarter," as a deliberate drill.

### SR-Q19. Is the degraded experience under a kill switch deliberately designed?
- **High Risk** if flipping the kill switch causes the application to break or display errors.
- **Medium Risk** if the degraded state is functional but not branded/messaged.
- **None** if the degraded state is a designed product experience.

---

## Defaults and fallbacks

### SR-Q20. Does every flag have a deliberately chosen off variation and SDK fallback value?
- **High Risk** if off variations are accidentally configured (or randomly chosen at flag creation).
- **Medium Risk** if defaults are picked at flag creation but never reviewed.
- **None** if defaults are part of the flag-creation checklist, documented, and survived by the application.

### SR-Q21. Does the application function correctly when the flag returns its fallback value?
Probe: Run the application offline or with a malformed flag config. Does it work?
- **High Risk** if the application breaks under fallback.
- **Medium Risk** if it works but in a way the team hasn't recently verified.
- **None** if fallback paths are covered by automated tests.

---

## Scheduled changes and windows

### SR-Q22. Do time-bound rollout steps use scheduled changes rather than human reminders?
- **High Risk** if rollout progression depends on a human remembering on a specific day.
- **Medium Risk** if some steps are scheduled and some are human.
- **None** if scheduled changes are the default for time-bound rollouts.

### SR-Q23. Do you observe release freezes and window restrictions?
- **High Risk** if no freezes exist for high-risk periods, or freezes are routinely bypassed.
- **Medium Risk** if freezes are policy but not tooled.
- **None** if freezes are policy and the tooling refuses non-emergency changes during them.

---

## Release policies and team norms

### SR-Q24. Has your team written down how it releases?
- **High Risk** if release norms exist only in individual heads.
- **Medium Risk** if norms exist in scattered docs.
- **None** if a single, current document describes release patterns and is referenced during onboarding.

### SR-Q25. Are your release norms reviewed at least quarterly?
- **High Risk** if norms have not been reviewed in a year and are visibly out of date.
- **Medium Risk** if reviews happen reactively (after incidents).
- **None** if reviews are scheduled and improvements are tracked.

---

← [Best Practices](./best-practices.md) | Continue to → [Anti-Patterns](./anti-patterns.md)
