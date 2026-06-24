# Lab 04 — Flag Hygiene at Scale

**Pillars:** Governance & Artifact Lifecycle, Operational Excellence
**Time:** ~60 minutes setup; ~quarterly cadence ongoing
**Difficulty:** Intermediate

---

## What you'll build

A running hygiene practice for the team's LaunchDarkly account: Code References deployed across every repo, a dashboard of stale flags, named ownership for every artifact, and a quarterly archival sweep that actually happens.

By the time you're done you will have:

- Code References scanning every repository that uses LaunchDarkly.
- A current map of who owns what.
- A "stale flag candidates" dashboard you (or someone) reviews.
- Your first archival sweep completed, with a documented order of operations.

This is the lab that pays continuous dividends. Teams that adopt it stop accumulating flag debt; teams that don't will reread the [Governance pillar anti-patterns](../pillars/governance/anti-patterns.md) in two years and feel called out.

---

## Prerequisites

- A LaunchDarkly account with permissions to configure integrations and tags.
- Source-code repository access (GitHub, GitLab, Bitbucket — whatever the team uses).
- A platform owner or team-aligned engineer who will own the archival sweep on a recurring basis.

---

## Step 1 — Inventory what you have

Before you fix anything, you need to know the surface area.

Run the following queries (via the LaunchDarkly API or the UI):

- **Total flag count** across all projects.
- **Flag count by project** — which projects hold most of the surface area.
- **Flag count by age** — created in the last 30 days, 30–90, 90–180, 180–365, 365+.
- **Flag count by `temporary` vs. `permanent` designation** (if your team uses this).
- **Flag count by tag** — `team:*`, `system:*`, or whatever conventions you have.

Write this down. This is the baseline.

**Why this matters:** every hygiene improvement is measured against this baseline. You can't improve what you don't measure.

---

## Step 2 — Deploy Code References to every relevant repository

[LaunchDarkly Code References](https://launchdarkly.com/docs/home/code/code-references) scans your repositories for flag-key usage and surfaces the references in the LaunchDarkly UI. It is the canonical source of truth for "is this flag still in code?"

- Install the `ld-find-code-refs` action / integration in every repo that uses LaunchDarkly.
- Configure it to run on every push to default branches.
- Verify that flag-reference counts appear in the LaunchDarkly UI within ~24 hours.

**Why this matters:** archival without Code References is guessing. See [Governance BP-6.1](../pillars/governance/best-practices.md). If you skip this step, the rest of the lab is much harder.

---

## Step 3 — Tag and assign ownership

This step is tedious the first time. After that it pays for itself.

For every flag, ensure:

- **Owner tag** (`team:<name>`) is set.
- **System tag** (`system:<name>`) identifies which product or service the flag belongs to.
- **Type tag** (`type:<release|experiment|kill-switch|operational|config>`) identifies what kind of flag it is.
- **Temporary / permanent** designation is set.

For unowned flags, you have three options:

1. **Reassign** to a current team based on context.
2. **Adopt** them as the platform team if no owner can be identified.
3. **Archive** them if they're clearly dead.

Use the LaunchDarkly API or bulk operations to apply tags. Don't try to do this all by hand for 500 flags.

**Why this matters:** ownership is the foundation of every other hygiene practice. See [Governance BP-1.1](../pillars/governance/best-practices.md).

---

## Step 4 — Build the stale-flag dashboard

The dashboard answers: which flags are candidates for archival?

A useful filter:

- `temporary` flags older than **90 days** (or your team's threshold).
- Code reference count = 0 (per Code References).
- Currently at 100% serving a single variation (no active rollout).
- No recent audit-log activity.

Build this in:

- **LaunchDarkly UI** — the built-in code-references view + filters.
- **Or your own dashboard** — pull data via the LaunchDarkly API, render in whatever your team uses for ops dashboards.

Surface the dashboard in a place the team sees it — a Slack channel pin, the platform team's wiki, the ops review template.

**Why this matters:** stale flags are easy to fix in batches. The dashboard makes them visible. See [Governance BP-6.2](../pillars/governance/best-practices.md).

---

## Step 5 — Document the archival order of operations

Write down the team's archival process. A standard order:

1. **Identify candidate** — from the stale-flag dashboard.
2. **Confirm zero code references** in current code (Code References + a manual sanity check on critical-path flags).
3. **Notify owner** if there's any doubt.
4. **Remove flag references from code** if any remain — open a PR, get it merged, deployed.
5. **Wait one deploy cycle.**
6. **Archive the flag** in LaunchDarkly with a descriptive rationale in the change description.
7. **Wait a buffer period** (typically 30 days) before deleting (if your retention policy allows deletion).

Capture this in a runbook or team doc. Reference it during sweeps.

**Why this matters:** the order matters. Mistakes are recoverable only when the right step precedes the irreversible one. See [Governance BP-7.1](../pillars/governance/best-practices.md).

---

## Step 6 — Run your first archival sweep

Schedule a 90-minute block. Invite the platform owner and one or two team members who can speak to the older flags.

- Pull up the stale-flag dashboard.
- For each candidate, apply the order of operations from Step 5.
- For ambiguous candidates, ping the nominal owner; if no response in a week, archive with a note.
- Archive in batches where possible.

Capture metrics from the sweep:

- Flags reviewed.
- Flags archived.
- Flags that required investigation.
- Flags reassigned (still relevant but unowned).

**Why this matters:** the first sweep clears the worst of the backlog. Subsequent sweeps are smaller. See [Governance BP-3.4](../pillars/governance/best-practices.md).

---

## Step 7 — Schedule the next sweep

Put the next sweep on someone's calendar — quarterly is a good default, monthly for high-velocity teams.

Make the recurring meeting include:

- The stale-flag dashboard review.
- Health-metric trend review (stale-flag %, ownership %, time-to-archive).
- Any new tag conventions or policy changes.

**Why this matters:** without a recurring time, hygiene work doesn't happen. See [Governance BP-11.2](../pillars/governance/best-practices.md).

---

## Step 8 — Define the health metrics you'll track

Pick 4–6 metrics that tell the team whether things are getting better:

- **% of temporary flags older than 90 days** with no code references.
- **% of artifacts without owners.**
- **Mean time-to-archive** after a temporary flag's "done" date.
- **% of experiments past decision deadline.**
- **% of AI Configs with no recent change** (if applicable).

Track them monthly. The trend over a few sweeps is what tells you whether the practice is working.

**Why this matters:** measurement keeps the practice honest. See [Governance BP-11.1](../pillars/governance/best-practices.md).

---

## Success criteria

You have completed the lab when:

- [ ] Code References is deployed to every relevant repository.
- [ ] Every flag has an owner tag, system tag, and type tag.
- [ ] A stale-flag dashboard exists and is visible to the team.
- [ ] An archival order of operations is documented.
- [ ] At least one archival sweep has been completed and produced measurable cleanup.
- [ ] The next sweep is scheduled.
- [ ] Health metrics are defined and tracked.

---

## What to do next

- Read the [Governance pillar](../pillars/governance/) end-to-end.
- Apply the same hygiene discipline to **segments**, **experiments**, and **AI Configs** — they accumulate debt too.
- Run [Lab 05 — Securing Flag Operations](./05-securing-flag-operations.md) to add governance controls on top of hygiene.

---

## Teardown

This lab doesn't tear down — it sets up a running practice. The "teardown" is continuing the practice indefinitely.

If you ran the lab against a test account, archive the lab artifacts.
