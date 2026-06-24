# Lab 05 — Securing Flag Operations

**Pillars:** Security & Compliance, Governance & Artifact Lifecycle
**Time:** ~90 minutes
**Difficulty:** Intermediate

---

## What you'll build

The access, audit, and approval foundation for a production LaunchDarkly account: SSO-backed identity, narrowly-scoped custom roles assigned via Teams, an audit log streaming to your security tooling, and required approvals on the sensitive flag surface.

By the time you're done you will have:

- SSO enforced for member authentication.
- Teams configured as the unit of role assignment.
- At least two custom roles scoped to your team's reality.
- The audit log streaming to your SIEM (or to a queryable archive).
- Required approvals (Guardian Edition) — or pipeline-gate equivalents — on the sensitive surface.
- A working credential-compromise playbook.

This lab is the security foundation. Run it before adding many teams or before any compliance work begins in earnest.

---

## Prerequisites

- A LaunchDarkly account on a plan that supports custom roles (Enterprise or Guardian Edition).
- Admin access to the LaunchDarkly account.
- Admin access to your corporate IdP (Okta, Entra ID, JumpCloud, Google Workspace, etc.).
- A SIEM or log-aggregation destination (Splunk, Datadog, Elastic, an S3/GCS bucket with retention lock, etc.).

---

## Step 1 — Enforce SSO

In your IdP:

1. Create or claim the LaunchDarkly SAML/SCIM integration.
2. Configure attribute mapping: at minimum email, name, and group memberships (groups will map to LaunchDarkly Teams).

In LaunchDarkly:

3. Configure SSO/SAML per LaunchDarkly's setup documentation.
4. Enable **SCIM provisioning** so user lifecycle (joiners/movers/leavers) flows from the IdP to LaunchDarkly automatically.
5. Once SSO is working, **disable password authentication** for the domain (or enforce SSO for all members).

**Why this matters:** identity sprawl is the source of most "the person left two years ago and still had access" incidents. SSO ties LaunchDarkly access to your canonical identity. See [Security & Compliance BP-1.1](../pillars/security-and-compliance/best-practices.md).

---

## Step 2 — Configure Teams

In LaunchDarkly, create Teams that mirror your real organizational structure. Common patterns:

- **Per product team:** `team-checkout`, `team-search`, `team-platform`.
- **Per function:** `platform-engineering`, `data-platform`, `security`, `qa`.
- **Special-purpose:** `auditors-readonly`, `service-automation`, `external-partners`.

Map IdP groups to LaunchDarkly Teams (via SCIM). Team membership becomes IdP-driven.

**Why this matters:** assigning roles to Teams instead of individuals means onboarding becomes "add the user to the IdP group" and offboarding becomes "remove them from the group." Team-based access survives personnel turnover. See [Security & Compliance BP-1.2](../pillars/security-and-compliance/best-practices.md).

---

## Step 3 — Build custom roles

In LaunchDarkly, create custom roles that match your operational reality. A starter set:

| Role | Scope |
|---|---|
| `proposer-prod` | Read/write on flags in production environment, but **cannot approve** changes |
| `approver-prod` | Read on flags in production, can approve changes proposed by others |
| `proposer-nonprod` | Read/write on flags in non-production environments |
| `service-automation-ci` | Narrowly scoped write to the flags CI needs to update |
| `auditor-readonly` | Read across the account, can export audit logs, cannot make changes |
| `no-access-restricted` | Identity exists; no operational privilege |

For each role, define precise resource scopes (project + environment + resource type + action). Avoid `*` on `*`.

Assign each Team the appropriate role(s) via Team-level role assignment.

**Why this matters:** scope is the difference between "an engineer could accidentally change a flag they shouldn't" and "an engineer can't." See [Security & Compliance BP-1.3](../pillars/security-and-compliance/best-practices.md).

---

## Step 4 — Inventory and rotate API tokens

Pull the list of all active API tokens from the LaunchDarkly API.

For each token:

- **Personal access tokens for individuals:** if used by CI or automation, replace with service tokens. Document the owner for any that remain.
- **Service tokens:** confirm the scope is narrow. Document the owner team and purpose. Set or confirm a rotation cadence.
- **Tokens belonging to departed members:** revoke immediately.
- **Tokens with no clear purpose:** investigate; revoke if no current owner.

Build a token inventory — a doc, a spreadsheet, or a structured file — that lists every active token with its owner and purpose.

**Why this matters:** personal tokens are tied to people; pipelines are not people. Misaligned tokens are credential-residue waiting to happen. See [Security & Compliance BP-2.2](../pillars/security-and-compliance/best-practices.md).

---

## Step 5 — Stream the audit log to your SIEM

LaunchDarkly's audit log captures every change to the account. For compliance and security operations, that log needs to live where the team's other logs do.

Options:

- **Built-in integrations** — wire the audit log to Splunk, Datadog, or another SIEM via LaunchDarkly's integration surface.
- **API-based ingestion** — poll the audit-log API on a schedule, normalize, ship to your SIEM.
- **Webhook-based** — for low-volume environments, audit-log webhooks can feed a downstream consumer.

Verify the stream:

- Make a test change (a tag edit, a flag description update) in LaunchDarkly.
- Confirm the event appears in your SIEM within minutes.
- Confirm the captured actor matches the person who made the change.

Configure long-retention archive (S3/GCS with retention lock) for the audit log if your compliance regime requires multi-year retention.

**Why this matters:** the audit log is only valuable if it's queryable next to your other logs. Streaming makes it queryable. See [Operational Excellence BP-9.1](../pillars/operational-excellence/best-practices.md).

---

## Step 6 — Configure required approvals on the sensitive surface

Identify your sensitive flag surface:

- Flags gating authentication, billing, payments.
- Flags tagged `regulated:true` or `compliance:<regime>`.
- Kill switches.
- Any flag with `sensitivity:high`.

For each, configure required approvals (Guardian Edition):

- Approval is required before changes to **production** take effect.
- The **approver pool** is a Team of senior engineers or tech leads (not the proposer).
- The **same-actor exclusion** is enforced: the proposer cannot approve their own change.

For changes outside the sensitive surface, leave approvals off (or require single approval from any teammate). Calibrate: too cumbersome → bypass; too lax → catches nothing.

**Why this matters:** approvals are the explicit "yes, this should ship" that compliance regimes demand. See [Security & Compliance BP-4.1](../pillars/security-and-compliance/best-practices.md) and the [Regulated Industries Lens deep dive](../lenses/regulated-industries/guardian-edition.md).

---

## Step 7 — Set up sensitive-change alerts

In your SIEM (or via LaunchDarkly's notification surface), configure alerts for sensitive audit-log events:

| Event | Severity |
|---|---|
| Permission change (custom role edit, Team membership change in `approver-prod`) | Page |
| New API token created with broad scope | Page |
| Audit log access by a non-routine actor | Ticket |
| Production change to a kill-switch flag | Notification |
| Change that bypassed approval policy (if your config allows) | Page |
| Self-approval attempted (approver == proposer) | Page |

Route to the on-call or security pager appropriately.

**Why this matters:** the audit log catches things nothing else catches, but only if alerts are configured. See [Operational Excellence BP-3.4](../pillars/operational-excellence/best-practices.md).

---

## Step 8 — Write the credential-compromise playbook

A short, current document with the steps for:

- **Leaked SDK key** — rotate, identify what could have been touched, investigate audit log for exfil-like activity.
- **Leaked API token** — revoke, identify all activity by that token in the last N days, assess blast radius.
- **Suspected account takeover** — disable the account, force re-authentication for all members, sweep the audit log.
- **Suspected role misconfiguration** — diff role config vs. previous snapshot, identify gap, repair, audit changes since.

Each step names an owner (a role, not a person).

Schedule a drill against the playbook within the next 90 days.

**Why this matters:** in a credential incident, every minute matters. The playbook is what removes the "who do I call?" minute. See [Security & Compliance BP-10.1](../pillars/security-and-compliance/best-practices.md).

---

## Step 9 — Conduct your first access review

Pull the current role-and-Team configuration:

- Who is in which Team?
- Which Teams hold which roles?
- Which custom roles grant what?

For each Team and role assignment:

- Is the membership still appropriate?
- Is the role scope still appropriate?
- Are there ex-members who slipped through SCIM?

Capture the review as evidence — a CSV, a PDF, a ticket. This is the artifact your auditor will ask for.

Schedule the next access review on a cadence (quarterly minimum; monthly for FedRAMP-style regimes).

**Why this matters:** privilege accretes silently. Access reviews are the corrective force. See [Security & Compliance BP-1.5](../pillars/security-and-compliance/best-practices.md).

---

## Success criteria

You have completed the lab when:

- [ ] SSO is enforced; local credentials are exception-only.
- [ ] Teams are configured and mapped from IdP groups.
- [ ] At least two custom roles with narrow scope are defined and assigned.
- [ ] All API tokens are inventoried, owned, and scoped; ex-member tokens are revoked.
- [ ] The audit log is streaming to your SIEM and you can query it from there.
- [ ] Required approvals are configured on the sensitive flag surface (Guardian Edition) or via pipeline-gate equivalents.
- [ ] Sensitive-change alerts are configured.
- [ ] A credential-compromise playbook exists and a drill is scheduled.
- [ ] An access review has been completed and the next one is scheduled.

---

## What to do next

- Read the [Security & Compliance pillar](../pillars/security-and-compliance/) end-to-end.
- For regulated workloads, work through the [Regulated Industries Lens](../lenses/regulated-industries/).
- Run [Lab 04 — Flag Hygiene at Scale](./04-flag-hygiene-at-scale.md) to layer governance on top of security.

---

## Teardown

This lab doesn't tear down — it sets up the security baseline that the rest of your LaunchDarkly use depends on.

If you ran the lab against a test account, archive the lab artifacts and restore the test account's defaults.
