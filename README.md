# LaunchDarkly Well-Architected

**A practitioner's framework for building systems that release safely, measure honestly, and scale calmly with LaunchDarkly.**

LaunchDarkly Well-Architected (LDWA) is an opinionated set of principles, practices, and review questions for engineering organizations that use — or are evaluating — LaunchDarkly. It is modeled after the documentation approach of the AWS Well-Architected Framework, but its content is independent of any cloud, runtime, or language. If you use LaunchDarkly, LDWA is for you, regardless of whether you run on AWS, GCP, Azure, on-premises, hybrid, or at the edge.

---

## Why this exists

Software organizations have spent the last decade decoupling deploy from release, instrumenting their products, and pushing change at increasing velocity. LaunchDarkly is now the connective tissue underneath much of that motion — feature flags, contexts, experiments, AI configurations, release pipelines, guarded releases, and the observability that closes the loop on each change.

But the surface area is large, and the difference between using LaunchDarkly *correctly* and using it *well* is the difference between shipping confidently and shipping carefully. We have seen the same patterns succeed across thousands of engineering teams, and we have seen the same anti-patterns cause incidents, drift, and wasted effort.

LDWA captures that learning in one place. It is the answer to the questions:

- "How do I know my use of LaunchDarkly is healthy?"
- "What does *good* look like for safe releases, experimentation, AI governance, or flag hygiene?"
- "What should I review before I bring a new system online?"
- "Where am I taking on hidden risk?"

---

## What's in the framework

LDWA is organized into three layers:

### 1. The Framework
A short whitepaper that defines what LDWA is, the vocabulary it uses, and the **general design principles** that apply to every LaunchDarkly-managed system. Start here:

- [Framework Introduction](./framework/introduction.md)
- [Definitions and Glossary](./framework/definitions.md)
- [General Design Principles](./framework/design-principles.md)
- [How to Use This Framework](./framework/how-to-use.md)
- [The Review Process](./framework/review-process.md)

### 2. The Pillars
Each pillar is a deep dive into one dimension of a well-architected LaunchDarkly system. Every pillar has the same shape: design principles, focus areas, best practices, and review questions.

| Pillar | Focus | Status |
|---|---|---|
| [Safe Release & Progressive Delivery](./pillars/safe-release/) | Targeting, rollouts, guarded releases, AI Config swaps, kill switches | Phase 1 |
| [Operational Excellence](./pillars/operational-excellence/) | Day-2 operation, observability, audit, runbooks, CI/CD | Phase 1 |
| [Security & Compliance](./pillars/security-and-compliance/) | RBAC, audit log, residency, Guardian Edition, Federal | Phase 1 |
| [Reliability & Resilience](./pillars/reliability/) | SDK resilience, Relay Proxy, edge, defaults, chaos drills | Phase 1 |
| [Governance & Artifact Lifecycle](./pillars/governance/) | Flag hygiene, Code References, ownership, change management | Phase 1 |
| [Experimentation & Measurement](./pillars/experimentation/) | Hypotheses, metrics, holdouts, decision review | Phase 2 ✓ |
| [Performance & Cost Efficiency](./pillars/performance-and-cost/) | Latency, events, sizing, cost guardrails | Phase 2 ✓ |

### 3. The Lenses
Lenses re-apply the pillars to a specific domain or deployment context.

| Lens | When to use it | Status |
|---|---|---|
| [Regulated Industries Lens](./lenses/regulated-industries/) | FinServ, healthcare, public sector; Guardian Edition + Federal | Phase 1 |
| [AI / GenAI Lens](./lenses/ai-genai/) | Teams using LaunchDarkly AI Configs | Phase 2 ✓ |
| [Developer Experience & Velocity Lens](./lenses/developer-experience-velocity/) | SDK patterns, IaC, testing, type-safety, onboarding | Phase 2 |
| [Mobile Lens](./lenses/mobile/) | Client-side, offline-first, app-store cadence | Phase 3 ✓ |
| [Hybrid / Multi-Cloud / On-Prem Lens](./lenses/hybrid-multicloud/) | Multiple providers, air-gapped, restricted-egress | Phase 3 ✓ |
| [Platform Engineering Lens](./lenses/platform-engineering/) | LD as an internal platform capability | Phase 3 |
| [Edge & Performance-Critical Lens](./lenses/edge-performance/) | Edge SDKs, latency budgets, Relay Proxy at scale | Phase 3 |
| [Migration & Modernization Lens](./lenses/migration/) | Strangler-fig, dark launches, cutovers | Phase 3 |
| [Experimentation / Growth Lens](./lenses/experimentation-growth/) | Teams whose primary use is A/B testing | Phase 3 |
| [SaaS / Multi-Tenant Lens](./lenses/saas-multitenant/) | Per-tenant targeting, entitlements, customer rollouts | Phase 3 ✓ |

---

## What LDWA covers

LDWA is designed to grow with the LaunchDarkly product portfolio. Today it covers — or is structured to cover — every capability LaunchDarkly brings to market:

- **Feature flags** — server-side, client-side, mobile, edge
- **Contexts and segments** — multi-context targeting, segment rules
- **Guardian Edition** — required approvals, scheduled changes, change-management workflows, advanced audit
- **Guarded Releases** — metric-based progressive delivery with automated rollback
- **Release Pipelines** — staged, governed rollout workflows
- **AI Configs** — model, prompt, and provider management for AI-powered features
- **Experimentation** — hypothesis-driven testing with statistical rigor
- **Observability** — Session Replay, Errors, Logs (post-Highlight)
- **Code References** — source-of-truth scanning for flag usage
- **Audit Log, Member Roles, Teams** — governance and access control
- **Relay Proxy** — self-hosted flag delivery, autoconfig, daemon mode
- **Federal / FedRAMP** — public-sector deployments
- **Data Export** — streaming events to data warehouses and observability tools

See the [product-coverage matrix in the build plan](./todo.md#15-scope-launchdarkly-product-surface-area-covered-by-ldwa) for which pillar primarily owns each capability.

---

## Who LDWA is for

- **Platform engineers, SREs, and release managers** who own the release pipeline and want to know they are doing it right.
- **Product engineers and tech leads** who ship behind flags every day.
- **Engineering managers and architects** who need to evaluate a system before it goes live or audit one that already has.
- **CTOs and engineering executives** who want a shared language for healthy release practices across many teams.
- **Solutions architects, partners, and consultants** who advise customers on LaunchDarkly adoption.

---

## How to use it

Three common entry points:

1. **First-time read.** Start with the [Framework Introduction](./framework/introduction.md), skim the [General Design Principles](./framework/design-principles.md), then pick the pillar that maps to your current pain.
2. **Targeted reference.** Have a specific question? Jump directly to the relevant pillar's *Best Practices* section.
3. **Workload review.** Use the [Review Process](./framework/review-process.md) and the [review tool](./tool/) to assess an LD-managed system end to end, surface risks, and produce an improvement plan.

---

## What "well-architected" means here

A LaunchDarkly-managed system is well-architected when:

- Every release is **reversible in seconds** without a code deploy.
- Every meaningful change is **measurable** — you know whether it helped or hurt.
- Every flag, experiment, and AI config has an **owner** and a **lifecycle**.
- The **LaunchDarkly layer itself** is not a single point of failure — your system degrades gracefully when SDKs, the network, or the LD service are impaired.
- **Access and change** are governed: who can change what, in which environment, with whose approval.
- The system **gets simpler over time**, not more cluttered. Stale artifacts are retired on a schedule, not accidentally rediscovered during an incident.

LDWA exists to make those properties explicit, measurable, and reviewable.

---

## Project status

LDWA is a **living framework**. Phase 1 + Phase 2 (Experimentation + AI/GenAI lens) content is shipped; remaining Phase 2 and Phase 3 content is in the queue. See [`todo.md`](./todo.md) for the full build plan and [`framework/decisions.md`](./framework/decisions.md) for the foundational decisions that have been made.

## License & contribution

LDWA is published under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](./LICENSE). You may use, share, and adapt the material — including for commercial purposes — with attribution.

Contribution model (v1): pull requests are accepted only from LaunchDarkly employees; external community members are welcome to file issues. See [`framework/decisions.md`](./framework/decisions.md) D-10.
