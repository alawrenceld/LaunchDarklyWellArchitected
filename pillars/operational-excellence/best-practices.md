# Operational Excellence — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Ownership and on-call

### BP-1.1 Name an owner for the LaunchDarkly account
One person (or one team alias) is the account owner. They are accountable for billing, top-level configuration, role administration, integration ownership, and audit cadence. This is not the same as "the person who set it up three years ago."

**Why:** ownership at the top is what keeps the LaunchDarkly account from drifting. Unowned accounts accumulate dead integrations, expired keys, and abandoned projects.

### BP-1.2 Name an owner for each project
Every project has a named owner — a team or a senior engineer. The owner is responsible for the project's environments, integration surface, and overall hygiene.

**Why:** project-level ownership is the right granularity for most operational decisions. The account owner shouldn't have to make decisions about Project Y's flag conventions.

### BP-1.3 Include LD-related runbook items in the on-call rotation
The team's on-call handoff includes LD-specific items: recent flag changes, in-progress rollouts, scheduled changes coming up, recent audit-log anomalies. The on-call doesn't have to discover these.

**Why:** an on-call who doesn't know what's in motion will be slower in an incident. Handoffs surface the moving parts.

### BP-1.4 Document the offboarding path for departing engineers
When someone leaves the team, their LaunchDarkly access is revoked, their personal API tokens are rotated, and their owned resources (flags they created, segments they own) are reassigned. There is a checklist.

**Why:** orphaned access is a slow-leaking security and operational liability.

---

## 2. Artifact lifecycle

### BP-2.1 Every artifact is created with a target retirement date
When you create a flag, segment, experiment, or AI Config, you also write down (in a description, a tag, or an external tracker) when you expect to retire it. The retirement date is a hypothesis, not a contract — but the absence of one is a problem.

**Why:** an artifact without a retirement date will live forever. The best moment to plan retirement is when the artifact is freshly relevant.

### BP-2.2 Tag artifacts with their team, system, and purpose
Use LaunchDarkly tags consistently. A bare minimum: `team:<team-name>`, `system:<system-name>`, `type:<release|experiment|kill-switch|config>`. Add domain-specific tags as needed.

**Why:** tags make bulk operations possible. Filtering flags by team, finding all kill switches, scoping a cleanup — none of these work without tags.

### BP-2.3 Use temporary and permanent flag designations
LaunchDarkly distinguishes between temporary flags (intended to be removed after a rollout) and permanent flags (operational toggles, kill switches, configuration). Use the designation deliberately, and surface "temporary flags older than X" in your operational dashboards.

**Why:** the framework only catches stale flags if the team marks them as stale-able.

### BP-2.4 Treat experiments as artifacts with a decision deadline
Every experiment has a date by which a decision will be made. Past that date, the experiment is either decided (rolled out, rolled back, extended with justification) or escalated.

**Why:** experiments that run forever produce data nobody acts on. Decisions are the point.

---

## 3. Observability of LD changes

### BP-3.1 Stream LD change events to your team's chat
Wire LaunchDarkly to Slack/Teams so flag flips, segment edits, scheduled changes, and pipeline events show up where the team works. Filter by environment and team to keep the volume manageable.

**Why:** "what just changed?" is a question every engineer asks during a strange incident. Having the change feed in the chat is the fastest path to the answer.

### BP-3.2 Wire LD events to your APM/observability stack
Send flag-change events to your APM tool (Datadog, New Relic, Honeycomb, etc.) as deploy markers or annotations. They appear on the same timeline as your service metrics.

**Why:** the moment a flag changes is exactly the moment to look at metrics. Overlaying the events makes the correlation visible.

### BP-3.3 Build a "flags in motion" dashboard
A single dashboard the team can pull up: which flags are mid-rollout, which experiments are running, which pipelines have active phases. Updated continuously.

**Why:** awareness of in-flight changes is the foundation of safe operation. The dashboard turns awareness from a chat-history search into a glance.

### BP-3.4 Alert on sensitive changes, not all changes
Alert when someone changes a production kill switch, modifies a critical segment, or alters a permission. Don't alert on every flag flip — that becomes noise.

**Why:** alerts only work if humans read them. Reserve alerts for changes that warrant attention.

---

## 4. Using LD Observability to close the release loop

### BP-4.1 Wire Session Replay, Errors, and Logs to the same product surfaces flags target
If a flag changes the checkout flow, the checkout flow's Session Replay/Errors/Logs should be the team's first look. The plumbing — context propagation, identifiers, metric tagging — should be set up once and re-used.

**Why:** the connection between "we changed X" and "did X go well" is observability. Sharing identifiers is what makes the connection mechanical.

### BP-4.2 Use Errors as a guardrail signal where appropriate
Error volume on the affected product surface is one of the most useful guardrail metrics for a release. If it spikes during a guarded rollout, the rollout reverts.

**Why:** errors are signal. They're what users notice. Make them part of the safety net.

### BP-4.3 Use Session Replay during incident investigation
When investigating an incident, pull Session Replay for the affected users. Don't reconstruct from logs alone if a session view exists.

**Why:** seeing the user's actual experience is faster and richer than reconstructing it from text.

### BP-4.4 Build the post-release review around observability evidence
A few days after a meaningful release, the team reviews: how did Errors trend? What did Session Replays show? Were there logs that suggested edge cases? Bake this into the release ritual.

**Why:** the close-the-loop discipline is what turns shipping into learning.

---

## 5. Runbooks and incident response

### BP-5.1 Every incident-response runbook references the relevant flags
A runbook that says "if checkout is failing, do X" also says "the kill switch is `kill-checkout-v2`, here is the link, here is who owns it." Same for any other major surface.

**Why:** finding the flag during an incident is one of the slow steps. Pre-naming them in the runbook is free.

### BP-5.2 Have a dedicated "LD-related incident" runbook
A runbook for the case where LaunchDarkly itself is part of the problem: how to fall back to defaults, how to switch SDKs to offline mode, how to engage LD support, how to use Relay Proxy bootstrapping.

**Why:** LD-specific incidents are infrequent enough that the team won't remember the playbook in the moment. A written runbook is the institutional memory.

### BP-5.3 Test runbooks at least quarterly
A runbook that has never been exercised is a hypothesis. Pick one runbook per quarter, run a tabletop or live drill, update the runbook based on what was wrong.

**Why:** runbooks rot. Stale runbooks are worse than no runbook, because they impose false confidence.

### BP-5.4 Include LD-touching incidents in post-mortems
When an incident touches LaunchDarkly (or could have been mitigated by a flag), the post-mortem explicitly addresses that. Action items might include: add a kill switch, add a guardrail metric, fix the runbook, train the on-call.

**Why:** the post-mortem is where operational lessons become operational practices.

---

## 6. CI/CD integration

### BP-6.1 Manage LaunchDarkly resources with IaC where it adds value
For long-lived, environment-shared resources — segments, project-wide settings, key resources that should be reproducible — manage them with Terraform or another IaC tool. For day-to-day flag operations, the LD UI is faster and better.

**Why:** IaC for high-churn flags creates more friction than benefit. IaC for foundational resources prevents drift between environments.

### BP-6.2 Reference flag keys from code, not magic strings
Use a generated constants file (or a typed flag client) so flag keys aren't string literals scattered through the codebase. Code References can scan for them; engineers can find them.

**Why:** typed flag references prevent typo-bugs and make refactors and archivals tractable.

### BP-6.3 Add flag-related checks to CI
Lint for references to archived flags. Fail builds that include code paths gated by a flag that was archived. Surface "this PR adds a flag" to reviewers.

**Why:** automated checks catch the operational mistakes that manual review misses.

### BP-6.4 Use webhooks to integrate flag events with downstream systems
A flag flip can trigger a Slack notification, a deploy marker, an automated test run, a Jira ticket close. Set the integrations up once.

**Why:** webhooks turn LaunchDarkly into a participant in your delivery pipeline instead of an island.

---

## 7. Capacity and scale planning

### BP-7.1 Know your event volume and where the bottlenecks are
Have a rough mental model of how many events your SDK fleet emits, how many context evaluations happen, and where the bottlenecks would appear if traffic doubled. Update it when major systems go live.

**Why:** capacity surprises are the most expensive kind. The model doesn't need to be precise — it needs to exist.

### BP-7.2 Size the Relay Proxy fleet deliberately
The [Relay Proxy guidelines](https://launchdarkly.com/docs/sdk/relay-proxy/guidelines) recommend at least three Relay instances across at least two availability zones per region, fronted by a load balancer. Take that as a floor and size up based on connection count, event volume, and SDK fleet size.

**Why:** Relay Proxy is in your request path. Under-sizing causes mysterious connection failures during launches.

### BP-7.3 Run a launch-readiness review for major releases
Before a major launch, the team reviews: expected traffic, expected event volume, expected SDK connection counts, Relay Proxy headroom, MAU/MCI implications. A 30-minute conversation prevents most launch-day surprises.

**Why:** the alternative is discovering, at peak load, that something you didn't think about is the bottleneck.

### BP-7.4 Monitor MAU/MCI trends
LaunchDarkly's pricing is partly a function of MAU/MCI (monthly active users / contexts). Trend these in the same place you trend other usage metrics. Don't let MAU/MCI growth be a surprise at renewal.

**Why:** cost surprises are operational failures. Trending makes them predictable.

---

## 8. Data Export and downstream integrations

### BP-8.1 Use Data Export to stream events to your data warehouse
For experiment analysis, deep dives, and any analytics the LD UI doesn't surface, export events to Snowflake / BigQuery / Redshift / equivalent. The team's data tooling can then operate on LD events the same way it operates on application events.

**Why:** you can answer questions in your warehouse you can't answer in any UI. Get the data flowing early.

### BP-8.2 Monitor exports the way you monitor any other pipeline
Lag, failure rate, schema drift. Alert on each.

**Why:** silently broken exports are worse than no exports. Decisions get made on data that hasn't updated in a week.

### BP-8.3 Document the schema and the downstream consumers
The team using the warehouse data knows where it came from, what the columns mean, and which downstream dashboards depend on it. When the schema changes, consumers are notified.

**Why:** undocumented data pipelines fall apart at the first refactor.

---

## 9. Audit log operations

### BP-9.1 Stream the audit log to your SIEM
LaunchDarkly's audit log is immutable; export it to your SIEM so security and compliance teams can query it alongside other events.

**Why:** audit logs are only valuable if they're queryable next to your other logs. Streaming makes them queryable.

### BP-9.2 Review the audit log on a cadence
A weekly or biweekly review by the account owner or the security team: any anomalies? Any changes that look out of policy? Any new integrations that nobody approved?

**Why:** the audit log catches things nothing else catches, but only if someone looks.

### BP-9.3 Alert on sensitive audit-log events
Permission changes, deletion of artifacts, changes to production-environment configuration, new API tokens for high-privilege accounts. These should page.

**Why:** these are the events that compromise an account. Don't wait for the weekly review to learn about them.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
