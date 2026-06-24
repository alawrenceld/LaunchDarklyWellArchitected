# Framework Introduction

## What LaunchDarkly Well-Architected is

LaunchDarkly Well-Architected (LDWA) is a framework for assessing and improving the way an engineering organization uses LaunchDarkly. It is a set of design principles, focus areas, best practices, and review questions that together describe what a healthy LaunchDarkly-managed system looks like, regardless of the language, runtime, cloud, or industry the system runs in.

LDWA is opinionated. It does not catalogue every option LaunchDarkly offers. It states what *good* looks like, what *bad* looks like, and how to tell the difference. It is the answer we give when a customer asks "Are we using this right?" — but structured so that customers can answer it for themselves.

## What it isn't

LDWA is not:

- **A replacement for LaunchDarkly's product documentation.** When you need to know how to call a method, configure an SDK, or set up an integration, go to [LaunchDarkly's docs](https://launchdarkly.com/docs). LDWA assumes that knowledge and tells you *what to do with it*.
- **An audit.** A LDWA review is a constructive conversation about architectural decisions. It surfaces risk and opportunity. It does not assign a passing or failing grade.
- **A maturity ladder you must climb in order.** Different systems need different things. A regulated FinServ workload prioritizes Security & Compliance; a growth team prioritizes Experimentation. LDWA gives you a map, not a checklist.
- **Static.** LaunchDarkly's product evolves. LDWA evolves with it. Each pillar and lens is versioned.

## Who it's for

- **Platform engineers, SREs, and release managers** who own the release pipeline.
- **Product engineers and tech leads** who ship behind flags daily.
- **Engineering managers and architects** evaluating new systems or auditing existing ones.
- **Executives** who need a shared language for healthy release practices across many teams.
- **Solutions architects, partners, and consultants** advising customers on LaunchDarkly adoption.

LDWA assumes you already use LaunchDarkly, or are seriously evaluating it. If you are not yet using LaunchDarkly, start with the [Getting Started guide](https://launchdarkly.com/docs/home/getting-started) and the [vocabulary reference](https://launchdarkly.com/docs/home/getting-started/vocabulary), then come back.

## The shape of the framework

LDWA has three layers:

1. **The Framework.** A short whitepaper — what you're reading now, plus the [Design Principles](./design-principles.md), [Definitions](./definitions.md), [Review Process](./review-process.md), and [How to Use This Framework](./how-to-use.md).
2. **The Pillars.** Each pillar is one dimension of a well-architected system: *Safe Release*, *Operational Excellence*, *Security & Compliance*, *Reliability*, *Governance*, *Experimentation*, *Performance & Cost*, *Developer Experience*. Every pillar has the same shape: design principles, focus areas, best practices, review questions, anti-patterns.
3. **The Lenses.** Each lens re-applies the pillars to a domain or deployment context — AI/GenAI, Regulated Industries, Mobile, Hybrid/Multi-Cloud, and so on.

## The unit of review: an LD-managed system

AWS Well-Architected reviews a "workload." LDWA reviews an **LD-managed system**: a service, product surface, or experience whose runtime behavior, releases, experiments, AI configuration, or observability is governed by LaunchDarkly.

An LD-managed system might be:

- A single web or mobile application using flags to release features progressively.
- A platform team's set of services governed by a shared release pipeline.
- A regulated workload whose every change requires approval through Guardian Edition workflows.
- A GenAI feature whose model, prompt, and provider are managed through AI Configs.
- An entire engineering organization treated as one system, reviewed holistically.

The point is that the **unit of review is something you can describe, draw, and improve** — not "your LaunchDarkly account" in the abstract.

## How a system becomes well-architected

Two motions, repeated:

1. **Design for the principles.** When you build or change a system, apply the [General Design Principles](./design-principles.md) and the pillar-specific design principles relevant to your context.
2. **Review against the questions.** Periodically, walk through the pillar review questions for the system. Identify risks. Build a prioritized improvement plan. Re-review.

The [Review Process](./review-process.md) describes how to run that motion end-to-end.

## How to read the rest of this framework

| If you want to... | Read this |
|---|---|
| Understand the vocabulary | [Definitions and Glossary](./definitions.md) |
| Understand the philosophy | [General Design Principles](./design-principles.md) |
| Run a review on a system you own | [The Review Process](./review-process.md) and the [review tool](../tool/) |
| Dig into one dimension | The relevant [pillar](../pillars/) |
| Apply LDWA to a specific domain | The relevant [lens](../lenses/) |
| See worked examples | The [labs](../labs/) |

---

Continue to → [General Design Principles](./design-principles.md)
