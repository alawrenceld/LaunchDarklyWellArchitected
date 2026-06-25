# Lens: Platform Engineering

> *LaunchDarkly is a platform capability. Treat it like one.*

The Platform Engineering Lens specializes LDWA for organizations where LaunchDarkly is operated as an **internal developer-platform capability** — owned by a platform or shared-services team, consumed by many application teams, governed by shared standards. It is the lens that bridges between the platform team's responsibilities and the application teams' day-to-day work.

The pattern is familiar from cloud, observability, and CI/CD: a central team operates the capability; application teams consume it through well-designed abstractions. LaunchDarkly fits this shape naturally, and the patterns from platform engineering apply directly.

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 3 |
| Last updated | 2026-06-24 |

## When this lens applies

Apply this lens if any of the following is true:

- A central platform team (Developer Platform, Internal Developer Platform, Shared Services) **owns LaunchDarkly** at the organization level.
- Multiple application teams **consume LaunchDarkly** through shared libraries, templates, or service scaffolds.
- The organization has a **platform-as-a-product** orientation: the platform team treats application teams as customers.
- You need **consistent practices** across teams without writing every team's release strategy individually.
- LaunchDarkly is part of a **broader internal developer platform** alongside CI/CD, observability, and infrastructure-as-code.

If LaunchDarkly is owned and operated team-by-team without central coordination, this lens probably doesn't apply yet — but it might soon.

## Contents

1. [Design Principles for Platform Engineering with LaunchDarkly](./design-principles.md)
2. [Pillar Overlays](./pillar-overlays.md)
3. [Platform Team Responsibilities](./platform-team-responsibilities.md) — what the platform team owns, what application teams own, the boundary between them.
4. [Shared Abstractions & Templates](./shared-abstractions-and-templates.md) — wrapper libraries, IaC modules, codegen, Release Pipeline catalogs, golden paths.
5. [Review Questions](./review-questions.md)
6. [Anti-Patterns](./anti-patterns.md)

## How to use this lens during a review

1. Run the standard pillar review on the platform team's LaunchDarkly operation *and* on representative application teams' use.
2. Walk this lens's [review questions](./review-questions.md). The platform-vs-application split is the central question.
3. Many platform-context findings will surface in **Governance**, **Operational Excellence**, and **Developer Experience**. Use the standard guidance plus the overlays here.

## The headline principles

- **The platform team operates LaunchDarkly; application teams use it.** The boundary is documented and respected.
- **Shared abstractions make the safe path the easy path.** Wrapper libraries, IaC modules, templates.
- **The golden path is opinionated, but escape hatches exist.** Most teams use the standard; some have justified exceptions.
- **Self-service is the goal, not gatekeeping.** Application teams shouldn't have to ask the platform team to do routine work.
- **The platform team is a product team.** Roadmap, feedback loops, success metrics.
- **Cross-team governance is encoded.** Teams and custom roles encode the team boundaries.
- **The platform is reviewed too.** The platform team runs LDWA reviews on themselves.
