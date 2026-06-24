# Security & Compliance — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Identity and access

### BP-1.1 Authenticate members via your corporate SSO
Configure SAML/SSO so LaunchDarkly access tracks your identity provider. Off-board users by disabling their IdP account, not by remembering to remove them from LaunchDarkly.

**Why:** identity sprawl is the source of most "the person left two years ago and still had access" incidents. SSO ties access to the canonical identity.

### BP-1.2 Use Teams as the unit of access assignment
Assign roles to Teams, not individuals, wherever possible. Onboarding becomes "add the member to the team," not "set up a custom assignment."

**Why:** the team is the unit that turns over. Tying access to teams makes changes survive team membership changes.

### BP-1.3 Use custom roles to scope access narrowly
For Enterprise and Guardian plans, use [custom roles](https://launchdarkly.com/docs/home/account/manage-members) to give members precise access — for example, "can write flags in the `growth` project's staging environment, read-only in production." Don't grant broader-than-needed built-in roles because custom roles seem like more work.

**Why:** broad access is broad blast radius. Custom roles are the difference between "an engineer can change a flag they shouldn't" and "an engineer can't."

### BP-1.4 Use the restricted *No access* role for accounts that should exist but not act
Service accounts, audit-only members, or members on extended leave should hold the [restricted No access](https://launchdarkly.com/docs/home/account/manage-members) role (Enterprise / Guardian Edition). They keep their identity; they have no privilege.

**Why:** disabling and re-enabling an account loses history. *No access* preserves continuity while removing privilege.

### BP-1.5 Review access at a defined cadence
Quarterly access reviews: who has what role, is it still appropriate, and what should be revoked? The review produces a record that doubles as compliance evidence.

**Why:** privilege accretes silently. The review is the corrective force.

### BP-1.6 No production write access on day one
New engineers ramp in non-production environments. Production write access is granted explicitly, after they have demonstrated familiarity with the team's release practices.

**Why:** day-one mistakes are concentrated. Production gates them out.

---

## 2. Credentials and tokens

### BP-2.1 Treat SDK keys as secrets
Server-side SDK keys grant read access to the flag dataset. Store them in your secret manager, inject at runtime, never commit to a repo, never paste into chat.

**Why:** a leaked SDK key is a leaked credential. Treat it accordingly.

### BP-2.2 Scope API tokens to the minimum required permissions and environments
Personal access tokens default to a member's full privilege. For automation and CI, use service tokens with narrowly-scoped custom roles instead.

**Why:** automation runs with whatever credentials it has. Narrow scopes contain the blast radius if the automation or its credential is compromised.

### BP-2.3 Rotate tokens on a schedule and after departures
Service tokens rotate at least annually. Personal tokens rotate when a member leaves the team that uses them. Old tokens are revoked, not abandoned.

**Why:** rotation limits the value of leaked credentials. Departures are the highest-risk moment.

### BP-2.4 Know which credentials are secrets and which are public
[SDK keys](https://launchdarkly.com/docs/home/getting-started) (server-side) are secrets. [Mobile keys](https://launchdarkly.com/docs/home/getting-started) and [client-side IDs](https://launchdarkly.com/docs/home/getting-started) are not — they're public credentials scoped to specific datasets, resettable when needed, but not requiring secret-manager protection. Don't over-protect the public ones (it creates friction) and don't under-protect the secret ones.

**Why:** treating every credential the same misallocates effort. Treat them according to their actual sensitivity.

### BP-2.5 Inventory and own every API token
Each service token has a documented owner, a documented purpose, and a documented expected lifetime. Tokens without all three get revoked.

**Why:** the worst tokens are the ones nobody can explain.

---

## 3. Audit log and compliance evidence

### BP-3.1 Stream the audit log to your SIEM and your warehouse
Use LaunchDarkly's audit-log export / API to push events to your SIEM (for security monitoring) and your data warehouse (for compliance reporting and ad-hoc analysis).

**Why:** the audit log is most valuable when joined with other event sources. Keep it where joins happen.

### BP-3.2 Build automated compliance evidence
For each compliance control your auditors care about — "production changes require approval," "credentials rotated within X days," "access reviewed quarterly" — build a query against the audit log (and the LD API) that produces the evidence on demand.

**Why:** automated evidence makes audits a routine export, not a quarterly project.

### BP-3.3 Map LaunchDarkly's attestations to your compliance requirements
LaunchDarkly's [trust center](https://launchdarkly.com/trust/) publishes the platform's compliance attestations (SOC2, etc.). Know which of your controls are satisfied by LaunchDarkly's attestations and which require customer-side controls.

**Why:** you don't have to re-prove what LaunchDarkly has already proved. Knowing the split is what makes the audit efficient.

### BP-3.4 Use change descriptions and comments to embed context in the audit log
Every meaningful change should include a description: why was it made, what ticket/PR does it relate to. The audit log captures the description; future reviewers can reconstruct intent.

**Why:** "what" without "why" is what makes audits hard. The description is the difference between "someone changed it" and "engineer X changed it for ticket Y."

---

## 4. Required approvals and Guardian Edition workflows

### BP-4.1 Require approvals on production changes to sensitive flags
On Guardian Edition, configure [required approvals](https://launchdarkly.com/docs/home/releases) on flags that gate authentication, billing, payments, regulated workflows, or anything else where the policy demands a second pair of eyes. Without Guardian, equivalent gates can be built via pipeline approvals or external workflow tools.

**Why:** the approval is the explicit "yes, this should ship" that compliance regimes (and many incident reviews) demand.

### BP-4.2 Define who can approve, and enforce it
Approvers are not the same people as proposers. The team explicitly designates who can approve sensitive changes; the system enforces it.

**Why:** the value of an approval is destroyed if anyone can rubber-stamp anyone.

### BP-4.3 Use scheduled changes with approvals for time-bound rollouts
Combine scheduled changes (delay the change until time T) with required approvals (gate the change behind a review). The schedule plans the rollout; the approval ratifies it.

**Why:** schedule + approval is the combined mechanism that makes "this will roll out next Tuesday, here's who signed off" auditable.

### BP-4.4 Tune approval workflows to avoid bypass
Approvals that are too cumbersome get worked around. Approvals that are too lax don't catch anything. Periodically review which changes triggered approvals and which were bypassed (or never required); calibrate.

**Why:** the rule that everyone bypasses is no rule at all.

---

## 5. Environment isolation

### BP-5.1 Treat each environment as a security boundary
Production credentials don't appear in non-production code, and vice versa. Production-environment write access is granted separately from non-production access.

**Why:** the cost of mixing environments is real. Most "I thought I was in staging" incidents start with credential reuse.

### BP-5.2 Use environment-specific role assignments
A member's role in `production` is configured separately from their role in `staging`. Customs roles let you scope by environment.

**Why:** the goal is least privilege, and the environment dimension is one of the most useful axes to scope on.

### BP-5.3 Mirror environment structure across projects intentionally
If your projects all have `production` / `staging` / `dev` environments, that's deliberate, not coincidental. The mirroring makes role assignments and policies portable.

**Why:** inconsistency creates exceptions; exceptions create gaps.

### BP-5.4 Don't promote configuration ad hoc; use environment promotion patterns
When a flag config needs to move from `staging` to `production`, use a documented promotion flow (a pipeline phase, a scheduled change, a Terraform apply). Avoid "I'll manually configure production to match."

**Why:** manual cross-environment changes drift and skip audit. Documented flows capture the change.

---

## 6. Context data handling and residency

### BP-6.1 Minimize the attributes you send
Send only what you need for targeting decisions. Don't add attributes "just in case" — every attribute is a future audit question.

**Why:** data you don't send can't leak, can't drift, and can't surprise an auditor.

### BP-6.2 Hash or omit PII you don't need for targeting
If the targeting decision only needs to know whether two contexts are the same — not who they are — pass a hash. If it doesn't need the attribute at all, omit it.

**Why:** the cheapest PII to manage is the PII you don't have.

### BP-6.3 Use private attributes for fields that LaunchDarkly should not retain
LaunchDarkly's SDKs support [private context attributes](https://launchdarkly.com/docs/home/observability/contexts) that are used for evaluation but not sent to LaunchDarkly. Use them for fields that the team needs for targeting logic but does not want stored.

**Why:** private attributes give the team the power of richer targeting without the residency obligation.

### BP-6.4 Align with your residency policy
If your data-handling policy requires EU residency, use LaunchDarkly's EU offering. Document which projects/environments are EU vs. US.

**Why:** residency is binary in most legal contexts. "Mostly EU" doesn't pass an audit.

### BP-6.5 Don't put credentials, secrets, or tokens in context attributes
Context attributes are not a place to stash auth tokens, API keys, or other secrets. They're targeting data.

**Why:** the audit log captures attribute changes. Secrets in attributes leak into audit history.

---

## 7. Compliance regimes

### BP-7.1 Know which compliance frameworks the workload is under
For each LD-managed system, document the compliance regimes that apply: SOC2, HIPAA, PCI, ISO 27001, EU AI Act, internal policies. Map them to LaunchDarkly controls.

**Why:** compliance posture per system, not per company, is the right granularity. Some systems are under HIPAA; others aren't.

### BP-7.2 Build compliance evidence into the audit log review
The weekly/monthly audit log review explicitly checks the controls the team is on the hook for: were approvals collected? Were access reviews completed? Are credentials within their rotation window?

**Why:** evidence collected continuously is evidence available on demand.

### BP-7.3 Use the appropriate offering for your regime
Standard LaunchDarkly is sufficient for most commercial compliance regimes. For FedRAMP, ITAR, and other high-assurance regimes, use the Federal offering. Don't bend one into the other.

**Why:** the offerings are designed for different threat models. Bending the wrong one fails the audit you're trying to pass.

---

## 8. Federal and high-assurance deployments

### BP-8.1 Use LaunchDarkly Federal for FedRAMP-scoped workloads
If your workload is subject to FedRAMP, deploy on LaunchDarkly Federal. Document the boundary between Federal-scoped and commercial-scoped systems.

**Why:** trying to retrofit FedRAMP compliance on commercial LaunchDarkly is expensive and fragile.

### BP-8.2 Separate Federal and commercial identity and access
Federal-scoped systems use distinct authentication, distinct roles, distinct members. Don't share credentials across the boundary.

**Why:** FedRAMP and commercial environments have different threat models and different audit expectations.

### BP-8.3 Document the data flow boundary
Where Federal-scoped data flows, document it. Confirm that LD evaluation, event ingestion, exports, and integrations stay on the Federal side.

**Why:** the boundary only holds if everyone touching it knows where it is.

---

## 9. AI security and safety

> The [AI/GenAI lens](../../lenses/ai-genai/) covers AI Configs in depth. This pillar covers the security baseline.

### BP-9.1 Store provider credentials separately, with their own rotation discipline
The provider API keys (OpenAI, Anthropic, Gemini, etc.) used by AI Configs are credentials in their own right. Store them in your secret manager; rotate per the provider's recommendation; revoke immediately on departure.

**Why:** provider keys grant access to billable, capable APIs. Compromise is expensive in both money and risk.

### BP-9.2 Treat prompt content as security-relevant
System prompts and user-input handling can be vectors for prompt injection. Review prompt changes the way you review other user-input handling.

**Why:** "it's just a prompt" is how injection vulnerabilities ship.

### BP-9.3 Apply content moderation as part of AI Config evaluation
Where appropriate, wire content moderation (provider-native or third-party) into the evaluation path. The output, not just the input, is in scope.

**Why:** the safety guarantee a feature gives users should not depend on the model behaving.

---

## 10. Incident response and access recovery

### BP-10.1 Have a credential-compromise playbook
Documented steps for: leaked SDK key, leaked API token, suspected account takeover, suspected role misconfiguration. Each step has an owner.

**Why:** in a credential incident, every minute matters. The playbook is what removes the "who do I call?" minute.

### BP-10.2 Periodically drill the credential-compromise playbook
At least annually, simulate a leaked credential and walk through the response. Update the playbook.

**Why:** untested playbooks don't survive contact with a real incident.

### BP-10.3 Maintain a recovery path that doesn't depend on the compromised account
The account owner is not the only person who can recover the account. There is at least one alternate, and the alternate's access is verified periodically.

**Why:** account-takeover incidents lock out the obvious responder. Recovery depends on the alternates being current.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
