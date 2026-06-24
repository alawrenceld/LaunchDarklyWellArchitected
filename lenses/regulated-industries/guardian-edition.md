# Guardian Edition — Deep Dive

[LaunchDarkly Guardian Edition](https://launchdarkly.com/) is the plan tier built for organizations that need governed, auditable, change-managed release operations. It is the LaunchDarkly product surface that makes most of this lens enforceable in configuration rather than policy.

This page describes how to use Guardian Edition's capabilities in practice for a regulated workload. It is not a feature list; for the canonical feature surface, see LaunchDarkly's product documentation and account comparisons.

---

## What Guardian Edition gives you for regulated workloads

The capabilities most relevant to regulated workloads are:

- **Required approvals** — block changes from taking effect until a designated approver reviews and ratifies them.
- **Scheduled changes** — defer a change to a specific time, with optional approvals attached at scheduling time.
- **Advanced workflow automation** — multi-step rollout automations that compose approvals, scheduled changes, and pipeline phases.
- **Custom roles** — narrow, precise role definitions at project/environment/resource granularity.
- **Restricted *No access* role** — a member who exists for identity continuity but holds no operational privilege.
- **Enhanced audit log capabilities** — including the long-retention export and SIEM integration practices needed for regulated audit cycles.
- **PagerDuty for guarded rollouts** — the [Guardian Edition integration](https://launchdarkly.com/docs/integrations/pagerduty-guardian-edition) that opens an incident when a guarded release detects a regression and resolves it when the rollback completes.
- **Release Pipelines** — staged, governed rollout workflows.

(Refer to LaunchDarkly's current product comparisons for the authoritative feature inventory.)

---

## Designing the approval policy

The single most important Guardian Edition decision: *which kinds of changes require approval, by whom?* Calibrate carefully — approvals that are too cumbersome get bypassed; approvals that are too lax catch nothing.

A starting framework:

| Change class | Approval required? | Approver pool |
|---|---|---|
| Production change to a flag tagged `regulated:true` | Yes — one approver from a senior pool | Senior engineers + tech leads |
| Production change to a kill switch | Yes — one approver | The team's on-call group or senior pool |
| Production change to a flag tagged `sensitivity:high` (e.g., billing, auth) | Yes — one or two approvers depending on policy | Senior pool |
| Production change to a standard customer-facing flag | Optional — one approver if guarded release | The team |
| Production change to an internal-only flag | Not required | n/a |
| Non-production changes | Not required | n/a |

The pools are configured via Teams and custom roles. The approval requirement is attached via Guardian's approval configuration. The separation-of-duties rule is encoded: an approver cannot approve their own change.

### Calibration over time

- Start with approvals on the smallest reasonable surface.
- Track approval times and bypass attempts.
- Expand the surface when reviews catch real issues; contract it when reviews are pure ceremony.
- Re-tune annually.

---

## Scheduled changes for regulated workloads

Scheduled changes pair naturally with required approvals: the approval is captured at scheduling time; the change executes at the scheduled moment without requiring a second review.

**Typical patterns:**

- **Time-bound rollout step.** "Increase exposure from 25% to 50% on Wednesday at 14:00 UTC, after the certified change window opens." Approved at scheduling.
- **Coordinated cutover.** Multiple flags scheduled to flip simultaneously when a regulatory deadline takes effect.
- **Sunset deadlines.** Old behavior scheduled to be disabled on the date the new regulation requires.

**Discipline:**

- Review scheduled changes the day before execution. Confirm the context is still appropriate; rescind if not.
- For high-risk scheduled changes, require approvals from *two* approvers — one at scheduling, one at execution (manual approval gate).
- Audit scheduled changes that fired during periods that turned out to be incident windows.

---

## Advanced workflows for multi-step rollouts

Guardian Edition's workflow capability composes multiple LaunchDarkly operations into a single automation. Useful patterns for regulated workloads:

- **Staged rollout with mid-stage approvals.** Increase to 10%, wait 24 hours, require approval, increase to 50%, wait 24 hours, require approval, increase to 100%.
- **Compliance-window-aware rollout.** Pause at any phase until the active change window resumes.
- **Cleanup automation.** Archive related artifacts after the workflow completes.

Workflows replace ad-hoc "increase to 25%, then we'll talk Monday" coordination with an encoded, auditable plan.

---

## The PagerDuty integration for guarded rollouts

For regulated workloads using guarded releases, the [PagerDuty Guardian Edition integration](https://launchdarkly.com/docs/integrations/pagerduty-guardian-edition) closes the loop between regression detection and incident management:

- Regression detected → PagerDuty incident opened, tied to the rollout.
- Rollback executes → incident resolved with the rollback record attached.
- The full chain is auditable: regression, response, resolution.

For regulated workloads where any production-impacting event has a notification or reporting obligation, this chain is the evidence trail.

---

## Custom roles for regulated separation of duties

The custom-role system is how separation of duties becomes enforceable. Patterns for regulated workloads:

- **Proposer role.** Can create flags, propose changes, but cannot approve or execute production changes.
- **Approver role.** Can approve changes proposed by others in their scope, but cannot propose changes to flags they themselves later approve (enforced by Guardian's same-actor rule).
- **Auditor role.** Read-only across the account; can export audit logs; cannot make changes. Typically held by compliance/security team members and external auditors during an engagement.
- **Service automation role.** Service tokens with narrowly-scoped permissions, owned by a team, audited periodically.

Use the **restricted No access role** for accounts that should exist for identity continuity (e.g., engineers on extended leave, accounts pending offboarding) but should hold no operational privilege.

---

## What Guardian Edition doesn't solve

- **Cultural buy-in.** If the team treats approvals as ceremony, Guardian becomes ceremony. Calibrate the approval surface and treat reviews as substantive.
- **Bad metrics.** Guardian's PagerDuty integration alerts on the metrics you choose. If your metrics are placebos, the integration alerts on placebo regressions.
- **Cross-system change management.** Guardian governs LaunchDarkly. Your release isn't governed unless the broader pipeline — code deploys, config changes, infrastructure changes — is also governed.
- **Federal-scoped workloads.** Guardian is a feature of the commercial LaunchDarkly offering. Federal-scoped workloads run on [Federal](./federal.md).

---

## Operational checklist for a Guardian Edition rollout

When introducing Guardian Edition to a regulated workload, work through:

1. **Identify the in-scope flags.** Tag them (`regulated:true`, `compliance:<regime>`).
2. **Design the approval policy.** Use the framework above; calibrate.
3. **Configure custom roles** for proposer, approver, auditor, service-automation.
4. **Configure required approvals** on the in-scope flag set.
5. **Stand up the PagerDuty integration** for guarded rollouts.
6. **Document the policy** in the team's change-management documentation.
7. **Train the team** — approvers know how to review; proposers know how to propose.
8. **Brief the auditor** ahead of the next audit cycle. Show the configuration; show example evidence.
9. **Review after 90 days.** Approval times, bypass attempts, incidents caught vs. missed. Recalibrate.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [LaunchDarkly Federal](./federal.md)
