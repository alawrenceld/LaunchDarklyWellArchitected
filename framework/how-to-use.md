# How to Use This Framework

LDWA is meant to be used three different ways. Pick the one that matches what you're doing right now.

---

## 1. As a first read

If you're new to LDWA, read in this order:

1. [Framework Introduction](./introduction.md) — what LDWA is, who it's for, the shape of the framework.
2. [General Design Principles](./design-principles.md) — the philosophy.
3. [Definitions](./definitions.md) — the vocabulary.
4. **One pillar** that maps to your current pain. Don't try to read all eight at once.
5. **One lens**, if a lens fits your domain.

A first read should take an hour or two. You don't need to remember every best practice. You should come away with a feel for the shape of the framework and a clear sense of where you want to dig deeper.

---

## 2. As a reference

Once you know LDWA's shape, the most common use is to look up guidance on a specific question.

| If you have a question about... | Go to |
|---|---|
| How to design a safe rollout | [Safe Release & Progressive Delivery](../pillars/safe-release/) |
| Flag hygiene, ownership, archival | [Governance & Artifact Lifecycle](../pillars/governance/) |
| Roles, audit, approvals, Guardian, Federal | [Security & Compliance](../pillars/security-and-compliance/) |
| Relay Proxy, defaults, offline behavior, SDK resilience | [Reliability & Resilience](../pillars/reliability/) |
| Day-2 operation, observability, incident response, CI/CD | [Operational Excellence](../pillars/operational-excellence/) |
| Designing an experiment | [Experimentation & Measurement](../pillars/experimentation/) |
| Latency budgets, event volume, cost | [Performance & Cost Efficiency](../pillars/performance-and-cost/) |
| Local dev, testing, IDE, IaC | [Developer Experience & Velocity](../pillars/developer-experience/) |
| AI Configs specifically | [AI / GenAI Lens](../lenses/ai-genai/) |
| Regulated workloads | [Regulated Industries Lens](../lenses/regulated-industries/) |

Each pillar's *Best Practices* section is the densest reference content. Each pillar's *Anti-Patterns* section is the fastest way to spot a problem you may already have.

---

## 3. As a review

The most valuable way to use LDWA is to run a structured review against a system you own. A review takes a few hours, surfaces specific risks, and produces a prioritized improvement plan.

The full process is documented in [The Review Process](./review-process.md), but the short version:

1. **Define the system being reviewed.** One sentence: "the [system name], which uses LaunchDarkly to [purpose]."
2. **Pick the pillars and lenses that apply.** Don't review against pillars that don't fit your context. (E.g., Experimentation is irrelevant if you don't run experiments.)
3. **Walk the review questions** for each pillar and lens. For each question, record the answer and assign a risk level (High / Medium / None).
4. **Aggregate into an improvement plan.** Sort by risk × effort. Pick the top three to five items.
5. **Execute the plan.** Re-review in a quarter.

The [review tool](../tool/) provides the workbook, scoring, and improvement-plan template.

---

## How to use LDWA inside an engineering organization

### For an individual team
Run a review once when you adopt LaunchDarkly. Re-review when a major new system goes live. Re-review quarterly thereafter, lightly.

### For a platform team
Use the pillars as the source of truth for your internal "how we use LaunchDarkly" documentation. Use the review questions as the input to platform-wide tooling (linters, dashboards, audits).

### For an engineering leader
Use the pillars as the shared vocabulary across teams. Ask each team to publish their LDWA review and improvement plan. Aggregate to spot organization-wide gaps.

### For a solutions architect or partner
Use the review process as the structure for a customer engagement. Use the lenses to specialize for the customer's industry.

---

## What LDWA is *not* meant to be used for

- **A scorecard for headcount or performance reviews.** Risk levels measure the system, not the team.
- **A blocker for shipping.** A review surfaces risk; the team decides what to do with it. Some risks are accepted intentionally.
- **A static checklist.** LDWA evolves. Treat it as a living standard.

---

← [Definitions](./definitions.md) | Continue to → [The Review Process](./review-process.md)
