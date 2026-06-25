# Platform Team Responsibilities

The dividing line between platform-team work and application-team work. This page describes the responsibility matrix that makes the platform model function — what the platform team owns, what application teams own, and how the two work together.

The goal isn't a rigid wall; it's a clear default that both sides can refer to. Most questions have an obvious side; the boundary cases are documented.

---

## The responsibility matrix

| Domain | Platform team | Application teams |
|---|---|---|
| **LaunchDarkly account** (organization-level config) | Owns | Has access via Teams |
| **SSO / SCIM / identity federation** | Owns | Authenticates through it |
| **Custom roles / Teams structure** | Owns; defines roles | Members assigned to roles |
| **Project structure** | Owns; creates new projects | Operates within assigned projects |
| **Environment structure (per project)** | Owns the template; provisions environments | Uses the environments |
| **Foundational segments** (e.g., `enterprise-customers`, `eu-tenants`) | Owns the structure | Uses in targeting rules |
| **Team-specific segments** | Reviews periodically | Owns within team scope |
| **Flag-naming and tagging conventions** | Defines | Follows |
| **Application-team flags** | Reviews via Code References + audit | Owns end-to-end |
| **SDK wrapper library** | Owns | Adopts |
| **IaC modules (LaunchDarkly Terraform / Pulumi)** | Owns the modules | Uses in their own IaC |
| **Codegen pipeline** | Owns | Consumes the output |
| **Release Pipeline templates** | Owns the catalog | Uses templates; adopts the default |
| **Custom team-specific Release Pipelines** | Reviews | Owns within team |
| **Relay Proxy fleet** | Owns; sizes; operates; monitors | Connects to it |
| **Daemon-mode persistent store(s)** | Owns | Reads via SDK |
| **Audit log integration (SIEM streaming)** | Owns | Has read access |
| **Per-team audit and compliance evidence** | Provides tooling | Produces evidence as needed |
| **Account-level alerts** (account anomalies, sensitive-change alerts) | Owns | Receives team-relevant alerts |
| **Flag-level alerts** (specific team flags, releases) | Provides framework | Owns team-specific alerts |
| **Cost: account-level (MAU/MCI forecasting)** | Owns | Provides usage data |
| **Cost: team-level attribution and optimization** | Provides dashboards | Owns within team |
| **Onboarding new application teams** | Leads the onboarding | Participates |
| **Onboarding new engineers within an application team** | Provides materials | Runs the onboarding |
| **Documentation: "how LDWA works here"** | Owns the cross-team docs | Owns team-specific docs |
| **LDWA reviews on team workloads** | Provides framework, may facilitate | Owns reviewing their workload |
| **LDWA review on the platform itself** | Owns | n/a |

---

## What the platform team typically does

A platform team that owns LaunchDarkly might do these things in a typical month:

- **Onboard a new application team** to LaunchDarkly: provision their project, set up their Teams and roles, walk them through the wrapper library and standard patterns.
- **Update the SDK wrapper library** based on lessons from last quarter's incidents.
- **Run a quarterly cross-team review** of LDWA health: stale-flag percentage org-wide, ownership gaps, anomalies.
- **Engage a team about their usage trajectory** — their MAU is growing fast; let's get ahead of the next renewal.
- **Update foundational segments** when business definitions change (new pricing tier, new compliance scope).
- **Add a new Release Pipeline template** to the catalog for a pattern that's emerging across teams.
- **Investigate a Relay-fleet anomaly** that's affecting multiple teams.
- **Update Code References** rollout to a new repository the application team has stood up.
- **Run an LDWA review on their own platform team's work** to keep themselves honest.

---

## What the platform team doesn't do

The platform team's success depends on *not* doing certain things:

- **Reviewing every flag change in every application team's project.** That's not platform-team work; the application teams own their own flags.
- **Making routine flag flips on behalf of application teams.** If a team needs the platform team to flip their flag, the access model is wrong.
- **Designing application-team experiments.** Application teams design their experiments; the platform provides the infrastructure.
- **Hand-holding application teams through their LDWA reviews.** The platform provides the framework and review tools; teams run their own reviews.
- **Approving every release pipeline change.** Pipelines have templates; deviations are reviewed in the platform team's office hours, not as required-approval gates.

---

## How application teams interact with the platform team

Application teams interact with the platform team via these channels:

### Self-service via documentation and tooling

For ~80% of cases, the application team's question is answered by the platform team's documentation, the wrapper library's behavior, the IaC module's structure, the Release Pipeline template, or the team's own LaunchDarkly UI access.

This is the goal: most application-team questions don't reach the platform team because they're already answered.

### Office hours / Slack channel

For the cases where self-service doesn't suffice, the platform team has:

- A team Slack channel for quick questions.
- Office hours (weekly or bi-weekly) for deeper questions.
- Documented escalation path for urgent or cross-cutting issues.

The Slack channel is the most common interaction. Quick question → quick answer; the answer may also become a documentation update.

### Cross-team review participation

The platform team participates in LDWA reviews of application teams when:

- The team is new to LaunchDarkly and benefits from facilitation.
- The team is doing something at the edge of the standard patterns.
- The review surfaces cross-team or platform-team concerns.

Routine LDWA reviews are run by application teams themselves.

### Roadmap input

Application teams provide input into the platform team's roadmap:

- "We're hitting friction in pattern X" — informs which abstractions get built next.
- "We need capability Y" — informs platform-team priorities.
- "This deviation from standard works better for us" — informs whether the standard should change.

The platform team treats this as product input. They prioritize based on impact and feasibility.

---

## What goes wrong without clear boundaries

Without an explicit responsibility matrix:

- **Application teams build their own SDK wrappers.** Each one slightly different. Lessons learned in one team don't propagate to others.
- **The platform team becomes a bottleneck.** Routine application-team work gets queued behind platform-team review.
- **Inconsistency proliferates.** Each application team's release pattern is different. Onboarding a new engineer who rotates between teams is a re-onboarding each time.
- **Incidents are unattributable.** When something goes wrong, neither side owns it; it's the other team's job.

The boundary doesn't have to be perfect, but it has to exist.

---

## Sizing the platform team

The platform team's size scales with the org's LaunchDarkly footprint:

| Org size | LaunchDarkly footprint | Platform team size |
|---|---|---|
| Small (1-5 engineering teams) | Single project, light use | 0 dedicated; one engineer with platform context |
| Medium (5-20 teams) | Multiple projects, moderate use | 1-2 engineers part-time |
| Large (20-100 teams) | Many projects, heavy use, multiple lenses applying | 2-4 full-time engineers |
| Enterprise (100+ teams) | Many regions, environments, compliance scopes | 4+ engineers, often with split sub-team responsibilities |

For the small case, "platform-team work" is concentrated in one or two engineers who do it part-time alongside other responsibilities. The principles still apply; the team size is just one or two.

---

## The platform-as-a-product orientation

The most successful platform teams treat their work as a product:

- **Users**: application teams.
- **Product**: the LaunchDarkly capability and its surrounding abstractions.
- **Roadmap**: planned improvements, priorities.
- **Metrics**: adoption rate, satisfaction, application-team velocity.
- **Feedback loops**: office hours, surveys, usage telemetry.

The team that operates LaunchDarkly without this orientation tends toward an infrastructure mindset: "we operate the thing; consumption is the consumers' problem." The product orientation produces better outcomes.

---

← [Pillar Overlays](./pillar-overlays.md) | Continue to → [Shared Abstractions & Templates](./shared-abstractions-and-templates.md)
