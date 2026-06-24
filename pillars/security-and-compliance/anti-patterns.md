# Security & Compliance — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The shared admin account

**Shape:** A single LaunchDarkly account is the de-facto admin for the team. Multiple engineers share its credentials, log in as it, and make changes as it. The audit log shows "admin" for every change.

**Why it's an anti-pattern:** the audit log becomes useless. There is no way to attribute a change to a person. Onboarding and offboarding revolve around sharing the password.

**Symptom:** "I'll log in as the team account and fix it."

**Remedy:** delete the shared account. Every member uses their own SSO-backed identity.

---

## AP-2. The custom role nobody scoped

**Shape:** Custom roles exist (per the audit policy). They all grant `*` on `*`. The role-based access *appears* fine in the configuration but provides zero actual scope.

**Why it's an anti-pattern:** the team has the compliance illusion without the security substance. The audit checks the role; the role checks nothing.

**Symptom:** an engineer accidentally changes a production flag they had no business changing, and discovers they "had access."

**Remedy:** scope custom roles narrowly. The minimum useful role is "this project, this environment, these resources."

---

## AP-3. The personal token in production CI

**Shape:** A long-running CI pipeline authenticates to the LaunchDarkly API using a personal access token belonging to an engineer. The engineer's token has admin scope. The engineer leaves. The token keeps working until someone notices.

**Why it's an anti-pattern:** personal tokens are tied to people. Pipelines are not people. The lifetime, scope, and ownership are misaligned.

**Symptom:** an `audit_log.actor = <ex-employee>` event months after their departure.

**Remedy:** replace personal tokens used by automation with service tokens, scoped to the minimum needed permissions, owned by a team.

---

## AP-4. The SDK key in the repo

**Shape:** A server-side SDK key is committed to a public or semi-public repository. It might be in a sample config, a developer's notes, or a forgotten test fixture. It's been there for two years.

**Why it's an anti-pattern:** any reader of the repo can read your flag dataset. Worse, depending on the credential and the integration, they may be able to do more.

**Symptom:** discovered during a security scan, often years after the leak.

**Remedy:** secret-scanning in CI; immediate rotation; document the incident; review what else the leaked credential could have touched.

---

## AP-5. The approval that everyone rubber-stamps

**Shape:** Required approvals are configured. The approvers see the request in chat, type `approve`, and continue with their day. They didn't read the change. They were busy. The approval was always going to be granted.

**Why it's an anti-pattern:** the *form* of the control exists; the *function* does not. The auditor sees an approval; the system gained no actual review.

**Symptom:** approval times measured in seconds. Approvers can't recall what they approved last week.

**Remedy:** calibrate which changes require approvals (fewer is often better); require a one-line rationale in the approval; treat skipped reviews as policy violations.

---

## AP-6. The PII fire hose

**Shape:** The application passes the entire user object to LaunchDarkly as a context — name, email, phone, address, payment-related identifiers, demographic information, behavioral attributes. Most of those attributes never participate in any targeting rule.

**Why it's an anti-pattern:** every extra attribute is a future audit question, a future residency question, a future breach surface. The team is paying ongoing privacy cost for value they never collect.

**Symptom:** GDPR/DSAR responses are complicated because LaunchDarkly is one of N systems holding personal data the team didn't realize it had sent.

**Remedy:** audit context attributes. Send only what's needed for targeting. Use private attributes for fields the team needs locally but should not retain.

---

## AP-7. The "we'll add SSO later" account

**Shape:** The team set up LaunchDarkly in a hurry. SSO setup was deferred. Two years later, accounts still use local credentials. Adding SSO now would be disruptive, so it keeps not happening.

**Why it's an anti-pattern:** local credentials are an identity sprawl source. Offboarding is manual. Compromised credentials don't follow IdP revocation.

**Symptom:** an offboarded engineer's account remains active months after departure.

**Remedy:** make the SSO migration a quarterly OKR. The cost of the migration is paid once; the cost of avoiding it is continuous.

---

## AP-8. The federal-and-commercial blender

**Shape:** A team has both Federal-scoped and commercial workloads. They share identity, share roles, share data, share automation. The audit lives in a fog about what's actually FedRAMP-scoped.

**Why it's an anti-pattern:** the FedRAMP boundary is binary. Once it's blurry, the only way to pass the audit is to clean it up.

**Symptom:** a 3PAO finding that scope is unclear.

**Remedy:** segregate Federal-scoped identity, access, data, and automation. Use the Federal offering for Federal-scoped systems. Document the boundary in the same place as the network diagram.

---

## AP-9. The provider key with one job and infinite scope

**Shape:** The OpenAI / Anthropic / Gemini API key used by an AI Config has account-admin scope. Anyone who reads it can spin up arbitrary workloads on the team's bill.

**Why it's an anti-pattern:** the principle of least privilege does not stop at LaunchDarkly's boundary. Provider keys also need scoping.

**Symptom:** an unexpected $30,000 month from a provider, with no clear attribution.

**Remedy:** create scoped provider keys (per-project, per-environment, with rate limits and budget caps where supported); rotate; revoke on departure.

---

## AP-10. The credential-compromise playbook nobody has read

**Shape:** A credential is compromised. The team scrambles. The playbook exists in a wiki page nobody has opened in a year. By the time someone finds it, half the steps are out of date.

**Why it's an anti-pattern:** the playbook is the emergency tool. An emergency tool you can't find or trust isn't a tool.

**Symptom:** during the incident, more time is spent locating the playbook than executing it.

**Remedy:** link the playbook from the on-call page and the incident-response template. Drill annually. Update on every drill.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
