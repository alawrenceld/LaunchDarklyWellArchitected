# Operational Excellence — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The account that nobody owns

**Shape:** The LaunchDarkly account was set up four years ago by a person who has since left. Nobody currently in the org is named as the owner. Billing emails go to a defunct mailing list. Top-level configuration drifts.

**Why it's an anti-pattern:** decisions that need to happen at the account level — role changes, integration approvals, plan upgrades — bounce between teams. Drift accumulates.

**Symptom:** when the renewal email comes, three people forward it to each other.

**Remedy:** name a current owner today. Document it. Re-confirm every six months.

---

## AP-2. The chat channel that nobody reads

**Shape:** A `#launchdarkly-events` channel exists. It posts every flag change in every environment. After two weeks, nobody looks at it. It might as well not exist.

**Why it's an anti-pattern:** the signal is buried in noise. The channel creates the *appearance* of observability without the substance.

**Symptom:** during an incident, no one thinks to check the channel — and when they do, the relevant event is 47 messages back.

**Remedy:** scope notifications to high-signal events (production changes, sensitive surfaces, pipeline events). Keep the channel readable.

---

## AP-3. The audit log that's never queried

**Shape:** The audit log exists. It's retained. Nobody ever looks at it.

**Why it's an anti-pattern:** the audit log catches things nothing else catches — but only if someone looks. Untouched audit logs are storage costs, not security.

**Symptom:** the team can't answer "did anyone change this flag last week" without spending an hour.

**Remedy:** stream to SIEM, alert on sensitive events, build a weekly review into someone's calendar.

---

## AP-4. The runbook that doesn't mention flags

**Shape:** The incident-response runbook for the checkout service has 30 steps. None of them mention the flag that disables the new checkout flow.

**Why it's an anti-pattern:** the on-call has to discover the kill switch in the moment. Every minute of discovery is a minute of customer impact.

**Symptom:** post-incident review: "we could have rolled back in two minutes if anyone had remembered the flag."

**Remedy:** runbook audit — every page-able surface gets a "relevant flags / kill switches" section.

---

## AP-5. The CI pipeline that ignores LaunchDarkly

**Shape:** The team's CI pipeline does extensive testing, type-checking, linting, and security scanning of application code. It has zero awareness of LaunchDarkly. Flag keys are magic strings. Archived flags are still referenced in code, silently.

**Why it's an anti-pattern:** the operational discipline applied to code does not extend to the flags that gate the code. Bugs slip through.

**Symptom:** a deploy includes a `client.boolVariation("checkout-v2-redirect", ...)` where `checkout-v2-redirect` was archived three months ago. The flag returns the fallback. The team finds out from users.

**Remedy:** add flag-key linting, archived-flag warnings, and code-reference checks to CI.

---

## AP-6. The launch that surprised the Relay Proxy

**Shape:** A major launch happens. Traffic spikes 5×. The Relay Proxy fleet — sized for steady-state — saturates. SDKs reconnect repeatedly. Mysterious connection failures begin. The launch team blames the application.

**Why it's an anti-pattern:** the operational layer was an afterthought. No one thought about Relay Proxy capacity until it became the bottleneck.

**Symptom:** during the launch, "everything looks fine on the application side, but the SDK is unhappy."

**Remedy:** launch-readiness reviews include the Relay Proxy fleet. Size deliberately, not optimistically.

---

## AP-7. The Data Export that's silently broken

**Shape:** Data Export was set up. A schema change happened. The export now silently drops rows. The team's experiment dashboards continue to show numbers — wrong numbers. Decisions get made on the wrong numbers.

**Why it's an anti-pattern:** wrong data is worse than no data, because no data is loud and wrong data is quiet.

**Symptom:** a downstream consumer notices a discrepancy weeks after the schema change.

**Remedy:** monitor the export like a production pipeline. Schema-drift alerts. Row-count sanity checks against LD's own counters.

---

## AP-8. The offboarding that left tokens behind

**Shape:** A senior engineer leaves. Their account is disabled. Their personal API tokens are not revoked. The tokens continue to work. Six months later, an audit asks where the script that's still running came from.

**Why it's an anti-pattern:** the residue of access is a slow leak. Personal API tokens outlive the people who created them.

**Symptom:** unowned API token activity in the audit log.

**Remedy:** offboarding checklist includes token revocation. Service tokens replace personal tokens for anything long-lived. Periodic token review.

---

## AP-9. The MAU surprise

**Shape:** Renewal time. The account exec sends through usage figures. The team's MAU has 3×'d since last year. Nobody saw it coming. The renewal conversation becomes a budget emergency.

**Why it's an anti-pattern:** MAU is a function of the team's product decisions. Surprises are operational failures.

**Symptom:** the finance team is mad on a Tuesday in October.

**Remedy:** trend MAU monthly. Forecast quarterly. Surface in the same place as other usage metrics.

---

## AP-10. The integration nobody owns

**Shape:** Three years ago, someone wired up a webhook to fire on every flag change. It pushes to a Slack channel that no longer exists. The webhook keeps firing into the void. When it starts erroring, the integration disables itself silently.

**Why it's an anti-pattern:** integrations accumulate. Each one is a small operational tail. Unowned tails wag the dog at the worst times.

**Symptom:** the integrations list contains entries the team can't explain.

**Remedy:** quarterly integration review. Each integration has an owner; integrations without owners are deleted.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
