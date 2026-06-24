# Security & Compliance — Definition

This pillar is organized into the following focus areas. Best practices and review questions are grouped under these.

---

## 1. Identity and access (RBAC, Teams, custom roles)

How members are authenticated and authorized. Covers SSO/SAML integration, member roles, custom roles, the *No access* restricted role (Guardian/Enterprise), Teams as the unit of access assignment, and the relationship between LaunchDarkly access and the team's broader IAM system.

## 2. SDK keys, mobile keys, client-side IDs, and API tokens

Credential hygiene for every kind of LaunchDarkly credential. Covers storage, rotation, scoping, the differences between key types, the appropriate uses of personal tokens vs. service tokens, and the relationship to your secret manager.

## 3. Audit log and compliance evidence

How LaunchDarkly's audit log feeds your security and compliance pipeline. Covers retention, SIEM streaming, evidence packaging for auditors, and the relationship between the audit log and the compliance regimes you operate under.

## 4. Required approvals and Guardian Edition workflows

The enforcement layer for sensitive change. Covers when approvals are required, who can approve, how approvals fit into release pipelines and scheduled changes, and the operational model around the approval queue.

## 5. Environment isolation

The separation between production, staging, and development environments. Covers per-environment credentials, per-environment role assignment, environment promotion practices, and the safeguards against cross-environment accidents.

## 6. Context data handling, PII, and residency

The data the application sends to LaunchDarkly via context attributes. Covers minimization, hashing/obfuscation where appropriate, residency considerations (EU, regional hosting), and the alignment with the broader data-handling policy.

## 7. Compliance regimes

How LaunchDarkly fits into specific compliance frameworks: SOC2, HIPAA, PCI, ISO 27001, EU AI Act, and others. Covers the LaunchDarkly attestations the team relies on, the customer-side controls layered on top, and the touchpoints during an audit.

## 8. Federal and high-assurance deployments

The dedicated [Federal offering](https://launchdarkly.com/docs/home/infrastructure/federal) for workloads subject to FedRAMP and similar regimes. Covers when to use it, what's different about it, and how it integrates with the team's broader Federal posture.

## 9. AI security and safety

The security surface introduced by AI Configs: provider keys, prompt-injection considerations, content moderation, and the safety controls around LLM-powered features. Detailed treatment lives in the [AI/GenAI lens](../../lenses/ai-genai/); this pillar covers the security baseline.

## 10. Incident response and access recovery

What happens when a credential is compromised, an account is taken over, or a role is misconfigured. Covers detection, containment, recovery, and the LaunchDarkly-specific playbooks for security incidents.

---

← [Design Principles](./design-principles.md) | Continue to → [Best Practices](./best-practices.md)
