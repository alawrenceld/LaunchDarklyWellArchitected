# Governance & Artifact Lifecycle — Best Practices

Each best practice is phrased as something you do, with the *why* attached. They are grouped by the focus areas defined in the [pillar definition](./definition.md).

---

## 1. Ownership

### BP-1.1 Make ownership a required field
Every flag, segment, experiment, and AI Config carries an owner — a Team, an alias, or a named engineer — recorded in a structured field (tag, maintainer, or description convention). The team's flag-creation workflow refuses to proceed without one.

**Why:** ownership decays passively. Required-at-creation captures the right answer at the moment it's known.

### BP-1.2 Use Teams as the owner where possible
Owners that survive team transitions are owners that survive at all. Prefer team-level ownership over individual.

**Why:** individuals change roles. Teams change membership but persist.

### BP-1.3 Run an ownership audit quarterly
Identify artifacts whose nominal owner has left the company, changed teams, or no longer maintains the artifact. Reassign or archive. Track the count over time.

**Why:** unowned artifacts accumulate slowly and are most easily fixed in batches.

### BP-1.4 Treat unowned as an exception, not a state
The team's dashboards surface unowned artifacts. The number is something the team feels pressure to reduce.

**Why:** what gets measured gets attention. Visibility is the prerequisite to action.

---

## 2. Naming and tagging

### BP-2.1 Write down the naming convention
A short document specifies how flags, segments, experiments, and AI Configs are named. Common pattern: `<scope>-<purpose>-<descriptor>` in kebab-case. E.g., `checkout-experiment-new-flow`, `auth-kill-mfa-bypass`, `growth-rollout-trial-extension`.

**Why:** consistent names are findable, sortable, and self-documenting. Inconsistent names compound clutter.

### BP-2.2 Define a mandatory tag set
At minimum: `team:<name>`, `system:<name>`, `type:<release|experiment|operational|kill-switch|config>`. Add `sensitivity:<low|medium|high>` for change-management purposes.

**Why:** tags are the bulk-operation enabler. Filtering, dashboards, archival sweeps — none of them work without consistent tags.

### BP-2.3 Enforce conventions in tooling
Lint flag-creation API calls. Refuse new flags missing required tags or violating naming. Surface violations in CI or in the LD UI via integrations.

**Why:** conventions enforced by tooling survive turnover. Conventions enforced by review do not.

### BP-2.4 Periodically audit and clean up
Drift happens. Once a quarter, run a sweep against current conventions; clean up violations.

**Why:** small amounts of drift compound into significant inconsistency over years.

---

## 3. Flag lifecycle

### BP-3.1 Designate flags as temporary or permanent at creation
LaunchDarkly distinguishes between temporary (intended to be removed) and permanent (operational toggle, kill switch, config). Use the designation, and align the team's retirement expectations to it.

**Why:** the distinction tells the cleanup system what to look at. Without it, all flags look the same.

### BP-3.2 Set a retirement hypothesis at creation
For temporary flags, note when the flag is expected to be retired — "after Q3 GA," "after 90 days of stable production," "after the migration completes." It's a hypothesis, not a contract.

**Why:** flags with no retirement plan default to permanent. That's almost always the wrong default.

### BP-3.3 Pair flag archival with code removal
The archival workflow is: confirm no code references via Code References → remove the flag references from code → archive the flag in LaunchDarkly. Code stays clean; flag stays archived.

**Why:** flags removed from LaunchDarkly while still in code cause silent fallback behavior in production. Flags removed from code while still in LaunchDarkly leak into the count of stale flags.

### BP-3.4 Schedule periodic stale-flag sweeps
A monthly or quarterly review: list temporary flags older than N days, triage each, archive the ones that are done. The owner of the flag (or a delegated platform team) runs the sweep.

**Why:** flag debt grows by accretion. Sweeps are the corrective force.

---

## 4. Experiment lifecycle

### BP-4.1 Every experiment has a decision deadline at creation
"We'll decide by 2026-09-15." The deadline is on the experiment description or in an integrated tracker. Past the deadline, the experiment is either decided or escalated.

**Why:** experiments without deadlines run forever, produce no decisions, and burn statistical power against nothing.

### BP-4.2 Document the decision and its rationale
When an experiment ends, write down what was decided and why — in the experiment record, the audit log, or a linked doc. The team can reconstruct the decision later.

**Why:** institutional memory beats individual memory. The decision rationale is what informs the *next* experiment.

### BP-4.3 Clean up the artifact after the decision
After a decision, archive the experiment, remove unused variations from the flag, delete metrics no longer needed, and remove holdout segments that were specific to the experiment.

**Why:** post-decision residue is the bulk of experiment debt.

---

## 5. AI Config lifecycle

### BP-5.1 Version models and prompts explicitly
Each AI Config variation has a clear version identifier — model version, prompt version, parameter set. Changes increment versions; rollbacks reference versions.

**Why:** AI Config debugging frequently asks "which version was running at time T?" Versioning makes the answer trivial.

### BP-5.2 Retire variations that are no longer in use
After a model migration completes, archive or remove the old variation from the AI Config. Don't leave dead variations in active configs.

**Why:** dead variations confuse rollout state and increase the surface area an operator has to reason about.

### BP-5.3 Align AI Config retirement with provider deprecation cycles
LLM providers deprecate models on a cadence. Track which AI Configs reference which model versions. Plan migrations ahead of deprecation; archive the deprecated variations cleanly.

**Why:** unplanned provider deprecations create fire drills. Planned migrations don't.

---

## 6. Code References

### BP-6.1 Deploy Code References across every repository that uses LaunchDarkly
[Code References](https://launchdarkly.com/docs/home/code/code-references) is the canonical source of truth for "does any code still use this flag?" Run it on every repo that touches LD.

**Why:** archival without Code References is guessing. Guessing is how production fallback paths get activated by accident.

### BP-6.2 Surface stale flags (flags with no code references) on a dashboard
The LaunchDarkly UI shows code-reference counts. Build a view (or use the existing one) that highlights flags with zero code references and a non-trivial age.

**Why:** these are the first candidates for archival. The dashboard makes them visible.

### BP-6.3 Surface dangerous flags (no code references but still active)
A flag that is removed from code but still has rules and active evaluations is a flag returning whatever its targeting says — to a code path nobody is running. This is also worth catching.

**Why:** dead flags in the LD account are noise. Live flags with no code path are confusion.

### BP-6.4 Integrate Code References into the archival workflow
The archival decision uses Code References as evidence. Before archiving, the reviewer confirms zero references; after archiving, the reviewer leaves a record.

**Why:** evidence-based archival is repeatable; opinion-based archival is brittle.

---

## 7. Archival discipline

### BP-7.1 Define the archival order of operations
Standard order: confirm via Code References → remove flag references from code → wait one deploy cycle → archive in LaunchDarkly → wait a defined buffer → delete (if your retention policy allows).

**Why:** the order matters. Mistakes are recoverable only when the right step precedes the irreversible one.

### BP-7.2 Use the audit log to capture archival decisions
The archival event in the audit log includes the rationale (in the change description). Future reviewers can answer "why was this archived?"

**Why:** archival decisions occasionally need to be revisited. The rationale is the only way.

### BP-7.3 Treat bulk archival as a privileged operation
Bulk archival is destructive at scale. Restrict who can perform it, require approval, and run a dry-run first.

**Why:** bulk operations are bulk mistakes when they go wrong.

### BP-7.4 Keep a recovery window
Archived flags can typically be restored within a window. The team knows the window and the recovery path.

**Why:** "I archived that by mistake" happens. Recovery should be a known capability.

---

## 8. Project and environment structure

### BP-8.1 Decide project granularity deliberately
The team's projects map to one of: products, business domains, regulatory boundaries, or top-level teams. Pick one and apply it consistently.

**Why:** mixed criteria for project boundaries make role assignment and policies hard to apply uniformly.

### BP-8.2 Mirror environment structure across projects
If most projects have `production` / `staging` / `dev`, the rest should too. Exceptions are documented exceptions.

**Why:** mirrored structure makes role assignment, policies, and IaC portable across projects.

### BP-8.3 Document the project and environment map
A diagram or table somewhere accessible: which projects exist, what they cover, who owns them, which environments they have, what's distinct.

**Why:** new members can navigate. Existing members don't argue from memory.

### BP-8.4 Resist project proliferation
Each project has operational overhead — roles, integrations, ownership. Don't spin up new projects without explicit reason.

**Why:** project sprawl is governance debt. Consolidation is harder than restraint.

---

## 9. Change-management policy

### BP-9.1 Write down what kinds of changes need what kind of governance
A short policy document: production kill switches require an approver, AI Config production changes require two reviewers, experiment launches require a hypothesis, etc.

**Why:** governance that exists only in heads is governance that gets bypassed.

### BP-9.2 Encode the policy in LaunchDarkly's controls
Required approvals (Guardian Edition), scheduled changes, custom roles, release pipelines, and release policies are how the policy becomes enforcement.

**Why:** documents drift. Configuration enforces.

### BP-9.3 Review the policy at least annually
The team's policy that fit last year may not fit this year. Annual review keeps it calibrated.

**Why:** outgrown policies create exceptions. Exceptions create gaps.

---

## 10. Bulk operations and API governance

### BP-10.1 Restrict who can perform bulk operations
The custom-role scope for bulk archival, mass tagging, and programmatic creation is narrow. Most engineers cannot perform these operations.

**Why:** bulk operations done by mistake are big mistakes.

### BP-10.2 Require dry-runs for bulk changes
Bulk archival, mass renames, and similar operations run as a dry-run first — list what would be affected; confirm; then execute.

**Why:** dry-runs catch the off-by-one filters that cause incidents.

### BP-10.3 Govern programmatic flag creation
Pipelines that create flags from external systems (Terraform, custom tools, CI scripts) have their own scope, their own audit, and their own ownership.

**Why:** programmatic creators can flood the account if unconstrained. Govern them like any other powerful actor.

### BP-10.4 Audit bulk-operation history
The audit log shows who did what at scale. Review the bulk-operations history periodically; ensure each operation was intentional.

**Why:** the audit trail catches the operations that intentions don't catch.

---

## 11. LD health metrics

### BP-11.1 Define a health metric set
Examples: % of temporary flags older than 90 days; % of artifacts without owners; mean time-to-archive after a temporary flag's "done" date; % of experiments past decision deadline; % of AI Configs with no recent change. Pick 4–8 metrics; don't over-instrument.

**Why:** the right metrics make health visible. Too many metrics make it invisible.

### BP-11.2 Review metrics monthly
The platform team (or whoever owns the account) reviews health metrics monthly. Adverse trends trigger action.

**Why:** trends are easier to fix early. Monthly is the right cadence to catch them.

### BP-11.3 Set improvement targets
For metrics that are unhealthy, set a target ("reduce % of unowned flags from 18% to <5% by end of next quarter") and track progress.

**Why:** measurement without targets is observation. Targets convert it to action.

### BP-11.4 Share metrics across the team
The health metrics are visible to every team that uses LaunchDarkly. Best: a shared dashboard. Adequate: a monthly write-up.

**Why:** shared visibility is shared accountability. Hidden metrics belong to no one.

---

← [Definition](./definition.md) | Continue to → [Review Questions](./review-questions.md)
