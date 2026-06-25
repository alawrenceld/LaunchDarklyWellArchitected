# Platform Engineering — Design Principles

These principles extend the LDWA [General Design Principles](../../framework/design-principles.md) for organizations using LaunchDarkly as an internal developer-platform capability.

---

## PE-1. The platform team operates; application teams use

The platform team's job is to operate LaunchDarkly well at the organization level. Application teams' job is to ship features using it. The boundary is documented and respected. Neither side does the other's work routinely.

When the platform team starts doing application-team work, the platform doesn't scale. When application teams start doing platform-team work, consistency erodes.

## PE-2. Shared abstractions make the safe path the easy path

The platform team builds the abstractions that turn the team's standards into the path of least resistance: wrapper libraries, IaC modules, service templates, Release Pipeline catalogs. Application teams adopt these because they're easier, not because they're mandated.

If the standard pattern requires more work than the wrong pattern, the team has built the abstractions wrong.

## PE-3. The golden path is opinionated, but escape hatches exist

The platform's golden path covers ~80% of use cases. The other 20% — teams with unusual requirements, regulated workloads, special compliance scopes — are explicit exceptions. Exceptions are documented and reviewed; they aren't open invitations to deviate.

The team that has no opinion and no path is the team where every application reinvents the wheel.

## PE-4. Self-service is the goal

Application teams should be able to do their routine LaunchDarkly work — create flags, configure rollouts, run experiments — without asking the platform team. The platform team's role is to enable, not to gatekeep.

If routine application-team work requires platform-team approval, the platform is a bottleneck.

## PE-5. The platform team is a product team

The platform team has users (application teams), a product (the LaunchDarkly capability and its surrounding abstractions), a roadmap, and feedback loops. The team meets with application teams, learns what's painful, ships improvements, measures adoption.

The team that operates without these is doing infrastructure, not product. The difference matters.

## PE-6. Cross-team governance is encoded

The team's governance posture — who can do what, with whose approval, in which environments — is expressed in LaunchDarkly's Teams and custom-role configuration. Engineering managers don't have to police it; the platform does.

The encoded policy is the only policy that survives turnover.

## PE-7. Application teams have ownership within their scope

Each application team owns its flags, segments, experiments, and AI Configs within the project boundary the platform has assigned them. The platform team doesn't reach into individual team's projects to make routine changes. Boundaries are respected.

The platform team that touches application teams' resources is the platform team that gets blamed for incidents it didn't cause.

## PE-8. The platform team runs LDWA on itself

The platform team's own LaunchDarkly operation is reviewed. The shared resources (foundational segments, custom roles, integrations, IaC) follow the same governance discipline expected of application teams. Best practices apply to the platform too.

The platform team that's exempt from review is the platform team that drifts.

## PE-9. Measurement informs the platform's evolution

The platform team measures what application teams actually do: which patterns are used, which are bypassed, where friction surfaces. The metrics inform the roadmap; new abstractions are introduced where they pay off.

The platform team that doesn't measure ships abstractions that don't get adopted.

## PE-10. The platform's success is application-team velocity

The metric of platform success isn't "the platform exists" — it's "application teams ship better and faster because of the platform." Adoption rate, time-to-first-flag, incident reduction, satisfaction. These are platform metrics.

The platform that doesn't move application metrics isn't yet a successful platform.

---

← [Lens Index](./README.md) | Continue to → [Pillar Overlays](./pillar-overlays.md)
