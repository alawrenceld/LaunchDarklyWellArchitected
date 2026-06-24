# Governance & Artifact Lifecycle — Anti-Patterns

A catalogue of common, named failure modes.

---

## AP-1. The flag graveyard

**Shape:** The account has 2,400 flags. The team uses 90 of them. The rest were created for rollouts that completed years ago. Nobody knows who owns them. Archiving them feels risky because nobody knows what they were for.

**Why it's an anti-pattern:** the graveyard is a productivity tax — every new engineer wades through the noise to find the signal — and a risk surface. Any of those 2,310 unused flags could still be evaluated by some forgotten code path.

**Symptom:** searching for a flag in the UI returns dozens of plausible-looking matches.

**Remedy:** deploy Code References. Surface flags with zero references. Run a quarterly archival sweep. Track the count down.

---

## AP-2. The orphan ownership

**Shape:** The flag's owner field says "Alex S." Alex left the company eighteen months ago. The flag remains active. There's no current owner.

**Why it's an anti-pattern:** the flag is now an artifact nobody is responsible for. When it causes a problem, the team has to reconstruct context from the audit log.

**Symptom:** the question "who owns this?" has the answer "good question."

**Remedy:** quarterly ownership audit; reassign or archive. Prefer Team-level ownership over individual.

---

## AP-3. The freestyle naming

**Shape:** Flag names include `new-checkout-v2`, `checkout-rollout-2024`, `NEW_FLOW`, `featureCheckoutVariant`, `kill-old-checkout`, and `temp-do-not-use`. No two follow the same pattern. Searching is unreliable.

**Why it's an anti-pattern:** the account's most basic findability is broken. Bulk operations are impossible. Conventions can't be enforced.

**Symptom:** the team can't filter by name pattern to do anything useful.

**Remedy:** establish a naming convention. Apply it to all new flags. Run a rename pass over the most-active flags.

---

## AP-4. The flag that's also a feature

**Shape:** A flag was created three years ago to roll out a feature. The feature is now permanent. The flag was never archived. Half the codebase calls `client.boolVariation("new-feature-rollout", context, false)` even though the feature is universal.

**Why it's an anti-pattern:** the flag is dead weight in the code and in the account. Every evaluation is a wasted call. The code is harder to read because every flag check looks like it might matter.

**Symptom:** the flag has been at 100% for years and nobody has questioned it.

**Remedy:** flags at 100% for over N days, with no plan to ever go below 100%, are archival candidates. Remove the flag references from code; archive the flag.

---

## AP-5. The experiment with no decision

**Shape:** The experiment ran four months ago. Results are in the LD UI. The team never made a formal decision. The flag is at 50% — half of users see the treatment, half see the control — indefinitely. Eighteen months pass.

**Why it's an anti-pattern:** the experiment is now a permanent split. Half of users get the treatment forever; the team never decided that was right.

**Symptom:** the flag's rollout state has been stable for many months with no associated decision in the experiment record.

**Remedy:** every experiment has a decision deadline. Past the deadline, force a decision (rollout, rollback, or extension with rationale). Audit experiments without decisions monthly.

---

## AP-6. The Code References that nobody acts on

**Shape:** Code References are deployed. They surface dozens of stale flags. The dashboard sits in the LD UI. Nobody is responsible for triaging it. Months pass. The dashboard grows.

**Why it's an anti-pattern:** observability without accountability is theater. The team has paid for a signal they don't act on.

**Symptom:** the stale-flag count grows monotonically; nobody has the calendar invite to do anything about it.

**Remedy:** assign the archival sweep to a named owner (or rotate it). Add it to operational reviews. Track the count over time.

---

## AP-7. The bulk archive that took out production

**Shape:** A platform engineer, trying to clean up the account, ran a bulk archive against "all flags older than 365 days." A handful of those flags were permanent operational toggles still actively used. The next morning, several services started failing because the flag system returned the fallback for flags the code expected to be active.

**Why it's an anti-pattern:** bulk operations are powerful and unforgiving. The single sweep was destructive at scale.

**Symptom:** production incident where multiple services fail because flags they depended on are suddenly archived.

**Remedy:** restrict bulk archival to a narrow role. Require dry-run. Exclude flags tagged as permanent operational. Cross-check against Code References before executing.

---

## AP-8. The project that became a junk drawer

**Shape:** The team created `playground` as a place for prototypes. Three years later, `playground` holds 300 flags, has integrations, has external dependencies, and is mentioned in production runbooks. Nobody can clean it because nobody knows what's still real.

**Why it's an anti-pattern:** project boundaries blurred. Production-relevant artifacts mixed with throwaways. The project's permissions and audit posture no longer match its content.

**Symptom:** a "play" project shows up in production logs.

**Remedy:** enforce project granularity at creation; resist the urge to use existing projects as junk drawers; periodically audit and re-home content that has graduated from throwaway to real.

---

## AP-9. The policy that lives in someone's head

**Shape:** "We only allow approvals from senior engineers" is the policy. It's never been written down. The team operates by tribal knowledge. New members violate the policy because nobody told them. Senior members violate it because they forget.

**Why it's an anti-pattern:** unwritten policy doesn't survive turnover or pressure. The "policy" is essentially randomness.

**Symptom:** different parts of the team have different ideas of what the policy is.

**Remedy:** write the policy down. Encode it in LaunchDarkly controls where possible. Reference it in onboarding.

---

## AP-10. The metric that nobody owns

**Shape:** The team tracks "% of unowned flags." It was 18% a year ago. It's 23% today. Nobody is named as the owner of the metric. Nobody is on the hook for moving it.

**Why it's an anti-pattern:** metrics without owners are wallpaper. They produce a number; they don't produce action.

**Symptom:** the team can name the metric but can't name a target or a person responsible for it.

**Remedy:** every health metric has a named owner and a target. Reviews include "progress toward the target." Owners are publicly accountable.

---

← [Review Questions](./review-questions.md) | Back to → [Pillar Index](./README.md)
