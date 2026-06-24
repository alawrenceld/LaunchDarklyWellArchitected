# Operational Excellence — Design Principles

These principles specialize the [General Design Principles](../../framework/design-principles.md) for the Operational Excellence pillar.

---

## OE-1. The LD layer has owners, runbooks, and an on-call

Someone is responsible for the LaunchDarkly account, the Relay Proxy fleet, the SDK fleet, and the integrations. The runbook for "LD-related incident" exists. The on-call knows it exists.

For a small org, this might be one person. For a large org, it might be a platform team. Either way, ownership is named, not assumed.

## OE-2. Every LD change is observable

Flag flips, segment edits, experiment starts, AI Config changes, pipeline advancements, role changes — all of these are events. They should flow into the same observability stack you use for code deploys (metrics, dashboards, alerts, change feeds).

You should be able to answer "what changed in LaunchDarkly in the last hour?" the same way you answer "what deployed in the last hour?"

## OE-3. Releases close the feedback loop

Every meaningful release is paired with a measurement. Where appropriate, that measurement uses LaunchDarkly's own observability layer — Session Replay to see what users actually experienced, Errors to catch what broke, Logs to investigate why — and the team reviews the result.

A release without a feedback loop is hope. A release with one is engineering.

## OE-4. Runbooks reference flags, not just services

When an incident playbook says "if checkout fails, run X," it should also say "the kill switch is `kill-checkout-v2`, here's the link." Runbooks that don't name the relevant flags slow down the response by the time it takes the on-call to find them.

## OE-5. LD is a step in the delivery pipeline, not a side door

Flag changes are part of the same delivery story as code changes. They flow through the same pipelines, the same approvals, the same audit. Integration with your CI/CD system (webhooks, Terraform, IaC) is set up deliberately, not as an afterthought.

## OE-6. The audit log is read, not just retained

LaunchDarkly retains an immutable audit log of every change. That log is only useful if someone — a human or a tool — looks at it. Streaming the audit log to your SIEM, your data warehouse, or a routine review feed is the practice that turns retention into value.

## OE-7. Capacity is planned, not discovered

Event volume, SDK fleet size, Relay Proxy capacity, ingestion rate, and Data Export throughput should be reasoned about *before* the launch that exercises them. The team has a rough mental model of where their bottlenecks are.

The alternative is discovering bottlenecks at 8 PM on a launch day.

---

← [Pillar Index](./README.md) | Continue to → [Definition](./definition.md)
