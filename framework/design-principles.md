# General Design Principles

The General Design Principles describe what every LaunchDarkly-managed system should look like, regardless of its domain, language, or deployment context. They are the philosophical core of LDWA. Each pillar elaborates on them with pillar-specific principles; the principles below cut across all pillars.

Apply these when you design a new system, when you make a non-trivial change to an existing one, and when you review either.

---

## 1. Default to safe

Every flag has a defined default value. Every SDK call has a fallback that the application can survive. Every AI Config has a fallback model or behavior. Every guarded release has a known-good baseline.

When the network is unreachable, the SDK fails to initialize, the LaunchDarkly service is degraded, or a downstream provider returns garbage, your application still serves a sensible experience. *"Sensible"* is defined explicitly in the code, not implicitly by accident.

**Why this matters:** the LaunchDarkly layer is in the request path of your most important features. Treat it like any other dependency — design for the moment it isn't there.

---

## 2. Decouple deploy from release

Shipping code to a server is not the same as releasing a feature to a user. Flags exist so these can happen at different times, with different mechanisms, and reverted with different blast radii.

A well-architected system ships code on a deployment cadence and releases features on a *product* cadence. Releases happen behind flags, in stages, with measurable signals — not by accident on a Friday afternoon.

**Why this matters:** every incident that started "we deployed and it broke for everyone" could have started "we released to 1%, the metric moved the wrong way, it rolled back."

---

## 3. Make rollouts reversible

Every change to user-facing behavior must be reversible in seconds, without a code deploy, without a re-build, without paging a person who is asleep.

That means flags are the unit of release. That means kill switches exist and are tested. That means guarded releases are configured with metrics that actually move when the feature does. That means the team knows, *before* the incident, how they would roll this back.

**Why this matters:** reversibility is the cheapest insurance policy in software. It is also the thing teams skip when they are in a hurry — which is exactly when they need it.

---

## 4. Target small, expand deliberately

Big-bang releases are an anti-pattern. Progressive exposure is the default: start with internal users, expand to a small percentage of production, watch the metrics, expand again.

The size of each step should reflect the risk of the change. Low-risk: 10% → 50% → 100%. High-risk: a named beta segment, then 1%, then a guarded release. Either way, you decide the steps in advance, and you stick to them unless the data tells you to slow down.

**Why this matters:** small steps make problems small. Anything that limits blast radius — segments, percentages, rings, guarded releases — is in service of this principle.

---

## 5. Measure what you ship

Every meaningful release is also a measurement. Before you ship, you state what you expect to happen. After you ship, you check whether it happened.

For most releases, this means at least one guardrail metric (something that must *not* get worse, e.g., error rate, latency, conversion) and ideally a primary metric (something that should improve). For experiments, it means a full hypothesis with primary, secondary, and guardrail metrics and a pre-committed decision rule.

**Why this matters:** without measurement, you don't know whether your release helped, hurt, or did nothing. The organizations that ship the most also measure the most — that is not a coincidence.

---

## 6. Treat LD artifacts as code

Flags, segments, experiments, AI configs, and release pipelines are configuration that affects production behavior. Treat them with the same rigor you treat code: name them well, review changes to them, version them where possible, and retire them when they are done.

A flag without an owner is the same kind of liability as a database table without an owner. It will still be in production three years from now, and nobody will remember why.

**Why this matters:** flag debt is real. Stale flags hide regressions, complicate code paths, and slow down newcomers. The best time to plan a flag's retirement is when you create it.

---

## 7. Build for graceful degradation

The LaunchDarkly platform is highly available. Your network, your SDKs, your provider, and your code are not always. A well-architected system survives any of those failing.

That means: sensible defaults baked into the application, SDKs configured with appropriate timeouts and offline-mode fallback, Relay Proxy where appropriate, and a clear answer to "what happens if LaunchDarkly is unreachable for ten minutes." (The answer is rarely "the product goes down.")

**Why this matters:** the worst LaunchDarkly-related incidents are not caused by LaunchDarkly. They are caused by systems that treated LaunchDarkly as a hard dependency without realizing it.

---

## 8. Govern access and change

Not everyone needs to change every flag in every environment. The blast radius of a flag change in production is large, and it should be governed accordingly.

That means: role-based access, environment-aware permissions, audit logs that someone actually looks at, approval workflows for sensitive changes (Guardian Edition makes this enforceable), and separation of duties where compliance demands it. It also means new team members do not start with production write access on day one.

**Why this matters:** the system is only as safe as its weakest credential. Governance is what makes "any engineer can ship a feature in seconds" compatible with "we are SOC2 compliant."

---

## 9. Operate the LaunchDarkly layer like production

Your LaunchDarkly account, your Relay Proxy fleet, your SDK fleet, and your integrations are production systems. They deserve monitoring, runbooks, on-call ownership, capacity planning, and incident review.

Most LD-related incidents are operational: a key rotated without coordination, a Relay Proxy fleet under-sized for a launch, an event-ingestion volume spike, a misconfigured webhook. These are preventable, but only if someone is responsible for preventing them.

**Why this matters:** the LaunchDarkly layer rarely fails; it is usually the *operation* of that layer that fails. Designate ownership.

---

## 10. Make the system simpler over time

Every well-architected system should have less debt next quarter than it has this quarter. Stale flags get archived. Dead experiments get decisions. Unused AI Configs get removed. Orphan pipelines get cleaned. Old code paths get deleted.

Build the cleanup into the workflow: every flag created is also a flag scheduled for retirement; every experiment that ships has a decision date; every change has an owner who is responsible for the cleanup, not just the launch.

**Why this matters:** complexity is the silent killer of release velocity. The teams that move fastest are not the ones with the most flags — they are the ones who delete the most.

---

## How the principles relate to the pillars

Each pillar elaborates a subset of these principles with deeper guidance:

| Principle | Primary pillar(s) |
|---|---|
| 1. Default to safe | Reliability; Safe Release |
| 2. Decouple deploy from release | Safe Release; DX |
| 3. Make rollouts reversible | Safe Release; Operational Excellence |
| 4. Target small, expand deliberately | Safe Release; Experimentation |
| 5. Measure what you ship | Experimentation; Operational Excellence |
| 6. Treat LD artifacts as code | Governance; DX |
| 7. Build for graceful degradation | Reliability |
| 8. Govern access and change | Security & Compliance; Governance |
| 9. Operate the LD layer like production | Operational Excellence; Reliability |
| 10. Make the system simpler over time | Governance |

---

← [Framework Introduction](./introduction.md) | Continue to → [Definitions and Glossary](./definitions.md)
