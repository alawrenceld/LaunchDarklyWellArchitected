# App-Store Cadence & Release

Mobile release works differently from server release. The app stores are the slow path — features land in a binary, which lands in the store, which lands in user devices over weeks. Flags are the fast path — they let the team release behavior independently of binary distribution. This page covers the operating practice for navigating both layers together.

---

## The two release layers

Every mobile feature has two release surfaces:

1. **Binary release.** The code that goes into the app, distributed via the App Store / Google Play. Subject to:
   - **App store review** — days to weeks depending on policy, content, and the store's queue.
   - **User update behavior** — users install updates on their own schedules. Even with auto-update enabled, distribution takes hours-to-days. With auto-update off, it takes weeks-to-months or never.
   - **Version fragmentation** — at any time, a meaningful fleet runs older versions.

2. **Behavior release.** The flag flips inside the binary, distributed via LaunchDarkly. Subject to:
   - **Propagation lag** — seconds-to-minutes for the next SDK refresh; longer if the client is offline or backgrounded.
   - **Targeting rules** — including version targeting that scopes the release to the appropriate binaries.

The architectural move is to **decouple them**: build the code, ship the binary, gate it behind a flag at `off`, then release the behavior independently.

---

## App store staged / phased rollouts

Both major app stores support gradual binary distribution:

- **Google Play staged rollout** — distribute the new APK/AAB to a configurable percentage of users (e.g., 1%, 5%, 20%, 100%). Halt or accelerate based on observation.
- **App Store phased release** — a built-in 7-day distribution curve to a percentage of users. Less flexible than Google Play's staged rollout but works similarly.

**LDWA opinion:** use both store-level staging *and* LaunchDarkly flag rollouts. They protect against different failure modes:

- **Store-level staging** protects against bugs in the binary itself — crashes, ANRs, broken UI on specific device classes.
- **LaunchDarkly rollouts** protect against bugs in the *behavior* — broken metric outcomes, unexpected user response, server-side interactions.

A typical staged rollout for a meaningful mobile feature:

1. Build the feature into the binary, gated by a flag at `off` in production.
2. Submit to app stores. Get review approval.
3. **Phase A — staged binary release.** Release the binary at 5% on Google Play / phased on App Store. Flag still `off` — users get the new binary with the old behavior. Watch crash, ANR, and stability metrics.
4. If binary metrics hold, expand binary rollout to 100% (or continue staged ramp).
5. **Phase B — behavior release.** Independently of the binary ramp, flip the flag on for a controlled audience — internal users, then a small percentage of users on supported app versions, then expand.
6. Monitor product metrics (the metrics that say *the feature is working*). Expand if the metrics support it.

This decoupling is the entire reason LaunchDarkly exists on mobile.

---

## Version-aware targeting

A flag controls behavior across whatever fleet of app versions are in production. Some flags only make sense on certain versions — typically the ones that include the corresponding code.

**The rule:** every flag whose behavior depends on app-version-specific code must target on `app_version`. The targeting rule must include only the versions whose binary supports the behavior.

**Example targeting rule:**

> Serve `true` (new flow) to users where:
> - `device.app_version >= "4.6.0"` (the version that includes the new flow's code)
> - AND `device.os = "ios"`
> - AND `user.country IN ("US", "CA", "UK")`
>
> Otherwise serve `false` (old flow).

**What this prevents:** users on v4.5 (which doesn't have the new-flow code) accidentally getting flagged into the new flow, which they don't have. Without version targeting, this rule sends `true` to v4.5 users who then exhibit undefined behavior — crashes, broken UI, or silent fallback to the old path depending on how the code handles the inconsistency.

**Two ways to fail this:**

- **Forgot the version constraint entirely.** New flow ships to users who don't have it. App crashes or behaves oddly.
- **Constraint scoped too tightly.** Flag targets only v4.6.0 exactly — but v4.6.1 has a quick bug fix and now those users don't get the flag. Use `>=` not `=`.

---

## The long tail of old versions

Some users never update. The team's flag rules need to handle indefinite version skew:

- **Default behavior on every flag** is the version-safe behavior — the behavior that works on the oldest app version still being targeted.
- **Code paths in old versions** must remain functional. Don't write code that assumes a flag will always return `true` — the version-safe default is part of the contract.
- **Feature deprecation requires version awareness.** If you want to remove a feature, you can flag it off — but the code path supporting "feature off" must remain in *every* version in production.

**The minimum-supported-version policy.** Most teams define a minimum supported app version — below that, the app shows an "update required" screen and refuses to function. This shrinks the version skew the flag system must accommodate.

**Best practice:** every quarter, raise the minimum supported version to a recent one. Archive flags that only existed to support versions below the new minimum. This is mobile's analog of [stale flag archival](../../pillars/governance/best-practices.md).

---

## Forced updates and the "kill the old version" pattern

Sometimes a version of the app is broken severely enough that the team needs to force users to update. The standard pattern:

1. **A "version killed" flag** — a flag the app checks at launch. If the user's `app_version` is below the threshold, the app shows the "you must update" screen.
2. **The kill flag's default** is `false` — i.e., don't force update. Flip it `true` for affected versions when needed.
3. The targeting rule scopes to the affected versions: `device.app_version IN ("4.5.0", "4.5.1", "4.5.2")` (or `device.app_version < "4.6.0"` if the issue affects everything older).
4. The "you must update" screen has a clear path to the app store and minimal other functionality.

This is essentially a [kill switch](../../pillars/safe-release/best-practices.md) for entire binary versions. Treat it like one — design carefully, drill rarely, use only when actually needed.

---

## Push and silent updates

Some teams supplement flag-based releases with push notifications or silent updates:

- **Push notifications** can alert the user that a new feature is available, encouraging them to update or open the app to receive new flag values.
- **Silent push** (where supported by the platform) can wake the app to fetch updated flag values without user interaction.

These are augmentations, not replacements. The core release mechanism is still flags. Push gets the message to users; silent push refreshes flag state proactively.

---

## Coordination between mobile and server-side releases

Many features have both a mobile component and a server-side component. The release plan accounts for both:

- **Server-side first.** Deploy the server change. The new server behavior is forward-compatible with both old and new mobile clients.
- **Mobile second.** Ship the new mobile binary. Older binaries still work against the new server (because of server forward-compatibility). New binary's new behavior is gated by a flag.
- **Flag flip last.** Once enough of the mobile fleet has updated to a version that supports the new behavior, flip the flag.

**The contract.** The server is always ahead of the mobile fleet. If the team can't maintain server forward-compatibility, the team has a deployment-order bug that flags can't fix.

**Targeting on app version makes this safer.** Even if the team accidentally flips the flag too early, version-aware targeting limits the blast to the supported versions.

---

## Experimenting under version skew

Experiments on mobile face a problem server-side experiments don't: the *baseline* itself differs across versions. Users on v4.5 see one experience; users on v4.6 see a slightly different one. A naive experiment that randomizes across versions is comparing apples to apples *only if* the version distribution is balanced — which it usually isn't.

**Options:**

- **Scope the experiment to one app version.** The cleanest approach. Wait for enough users to be on the target version, then run the experiment within that population.
- **Stratify by version.** Run the experiment across versions but analyze separately per version. More complex; useful when version-specific differences are themselves interesting.
- **Run a long experiment.** Over weeks, the version mix shifts; the experiment averages over the shifting baseline. Statistically messy but sometimes the practical answer.

**The team's default:** scope to one version unless there's a reason not to.

---

## What goes wrong in mobile release

The common failure modes:

- **Forgotten version targeting.** Flag goes to users who don't have the code; weird behavior surfaces in support tickets.
- **Premature flag flip.** Flag flipped on before enough of the fleet has the supporting binary. Users on old versions see incomplete or broken experiences.
- **Bound-version flag.** Flag targets v4.6.0 exactly. v4.6.1 ships a hotfix; affected users now don't get the flag. Use `>=` not `=`.
- **Forgotten cleanup after min-version bump.** Team raises minimum supported version from v4.0 to v5.0. Flags that only existed to handle v4.x quirks remain in the account, confusing newcomers.
- **Store-level rollout treated as a "behavior release."** Store releases the new binary to 5% of users; team thinks that means "5% see the new feature." Actually all of those 5% see the *old* feature because the flag is still `off` — and any of the 95% on the prior binary will see the *old* feature too. Store rollout != behavior rollout.

See [Mobile Anti-Patterns](./anti-patterns.md) for the full catalogue.

---

## A minimum-viable mobile release checklist

For a significant mobile feature, the team's release checklist:

- [ ] Code is built into the binary, gated by a flag at `off`.
- [ ] Flag has `app_version >= X` in its targeting rule, where X is the binary that introduced the code.
- [ ] Flag has a documented kill behavior (what user sees when flag is `off`).
- [ ] Old version's behavior — the path served when flag is `off` — is tested and known-working in *every* supported app version.
- [ ] The binary is submitted to the app stores and approved.
- [ ] Staged store rollout begins (Google Play 5% → 20% → 100%; App Store phased release).
- [ ] Crash / ANR / stability metrics watched as the binary rolls out.
- [ ] Once the binary is broadly distributed, flag flip begins — internal users, then a small percentage on supported versions, then expansion.
- [ ] Product metrics watched as the behavior rolls out.
- [ ] Once at 100% and stable for the warm window, plan flag retirement (after the minimum-supported version exceeds the flag's lower-bound version).

---

← [SDK & Offline Patterns](./sdk-and-offline-patterns.md) | Continue to → [Review Questions](./review-questions.md)
