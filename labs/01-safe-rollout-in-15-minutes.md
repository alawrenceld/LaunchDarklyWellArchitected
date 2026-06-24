# Lab 01 — Safe Rollout in 15 Minutes

**Pillars:** Safe Release & Progressive Delivery, Operational Excellence
**Time:** ~15 minutes
**Difficulty:** Beginner

---

## What you'll build

A working progressive rollout of a feature behind a flag, with a guardrail metric attached and automated rollback wired up. By the end of the lab, you'll have:

- A boolean flag configured for progressive rollout.
- A metric tracking the user behavior that gates the rollout.
- A guarded release that monitors the metric and rolls back automatically if it regresses.
- A clear understanding of the full *ship → measure → decide* loop in fifteen minutes.

This pattern is the foundation of every safe release with LaunchDarkly. You will use it daily once it's wired up.

---

## Prerequisites

- A LaunchDarkly account with permissions to create flags and metrics. A free trial works.
- A test application (any language) that uses a LaunchDarkly SDK. If you don't have one handy, the LaunchDarkly [SDK quickstart](https://launchdarkly.com/docs/sdk) takes ~5 minutes to set up.
- The ability to generate traffic against the app (curl loop, locust, or a simple browser refresh).

**Time check:** if your application isn't already wired up to LaunchDarkly, allow an extra 10–15 minutes for that setup.

---

## Step 1 — Create the flag

In the LaunchDarkly UI, create a new boolean flag.

- **Key:** `lab-safe-rollout-demo`
- **Description:** "Lab 01 — Safe Rollout demo. Delete after lab."
- **Tag:** `lab`
- **Variations:** the default boolean `true`/`false` are fine.
- **Default rule (fallthrough):** serve `false` to everyone.
- **Off variation:** `false`.

Save the flag.

**Why this matters:** the off variation is set deliberately. When the flag is off (or when the SDK can't reach LaunchDarkly), the application serves the *current, stable* behavior — `false` here. This is the panic-button resting position from principle SR-4 in the [Safe Release pillar](../pillars/safe-release/design-principles.md).

---

## Step 2 — Wire the flag into the application

In your application code, gate the new behavior on the flag.

```pseudocode
context = {
  kind: "user",
  key: current_user.id,
  email: current_user.email
}

show_new_thing = ldclient.boolVariation("lab-safe-rollout-demo", context, false)

if show_new_thing:
  render_new_behavior()
else:
  render_existing_behavior()
```

For the lab, "render_new_behavior" can be as simple as logging a different string or returning a different response shape. The point is to have *something measurable* that differs between the two variations.

**Why this matters:** the fallback value (`false` here) is what the application returns if the SDK can't reach LaunchDarkly. It must match the off variation in the flag — and it must be a value the application can survive. See best practice BP-7.1 in [Safe Release](../pillars/safe-release/best-practices.md).

---

## Step 3 — Pick a guardrail metric

A guardrail is something that must not get worse during the rollout. For this lab, choose a metric that:

- The application already emits (an HTTP error rate, a latency percentile, a domain success/failure event), or
- You can fake by emitting a custom event from the lab code.

The simplest lab metric: emit a custom event when the user encounters the new behavior.

```pseudocode
if show_new_thing:
  render_new_behavior()
  ldclient.track("lab-new-behavior-success", context)
else:
  render_existing_behavior()
  ldclient.track("lab-existing-behavior-success", context)
```

In the LaunchDarkly UI, create a metric:

- **Key:** `lab-success-rate`
- **Description:** "Lab 01 — proxy for user success."
- **Type:** Conversion (count-based).
- **Event:** `lab-new-behavior-success` for the new behavior; `lab-existing-behavior-success` for the existing behavior.
- **Goal:** higher is better. (For the lab, we'll deliberately introduce a regression in step 5.)

**Why this matters:** a guardrail metric is only useful if it moves when the feature moves. For real systems, choose metrics that *would* have caught the last incident in this area. See BP-3.2.

---

## Step 4 — Set up a guarded release

In the LaunchDarkly UI, on your flag's rollout configuration:

- Choose **Guarded release** (or your edition's equivalent metric-driven rollout).
- Attach `lab-success-rate` as the guardrail metric.
- Configure the rollout:
  - Start at **10%**.
  - Step to **50%** after a brief observation window.
  - Step to **100%** after another window.
- Configure regression detection: rollback if `lab-success-rate` drops more than 10% from baseline.

Start the rollout.

**Why this matters:** the guarded release does two things at once. It progressively expands exposure (BP-2.2) *and* monitors a guardrail that would catch a regression (BP-3.1). Both protections in one workflow.

---

## Step 5 — Generate traffic and induce a regression

Generate traffic against the application. A simple loop:

```bash
while true; do
  curl -s http://localhost:8080/your-endpoint > /dev/null
  sleep 0.1
done
```

Make sure each request includes a varying user context so LaunchDarkly distributes the traffic. You should see roughly 10% of requests hit `render_new_behavior()`.

Now **simulate a regression** by editing the new behavior to fail more often:

```pseudocode
if show_new_thing:
  if random() < 0.5:
    render_new_behavior()
    ldclient.track("lab-new-behavior-success", context)
  else:
    # simulate a regression: don't fire the success event
    pass
else:
  render_existing_behavior()
  ldclient.track("lab-existing-behavior-success", context)
```

Continue running traffic.

**Why this matters:** in a real rollout, the regression would be an unintentional bug. Inducing it deliberately lets you observe the *guarded release detecting and responding*.

---

## Step 6 — Watch the guarded release roll back

Within minutes (depending on your traffic volume and the guarded release's sample size), LaunchDarkly should detect that the new variation's success rate has dropped well below the existing variation's. The guarded release should:

- Stop expanding the rollout.
- Roll back to the prior (safe) state.
- Generate an event in the audit log.

If you have the [PagerDuty Guardian Edition integration](https://launchdarkly.com/docs/integrations/pagerduty-guardian-edition) configured, an incident will open and resolve automatically.

---

## Success criteria

You have completed the lab when:

- [ ] The flag exists with deliberate variations and off-state.
- [ ] The application code reads the flag with a safe fallback.
- [ ] A guardrail metric is attached and emits when traffic flows.
- [ ] A guarded release was started successfully.
- [ ] After inducing the regression, the guarded release rolled back automatically.
- [ ] You can articulate, from the audit log, the timeline: rollout started → metric regressed → rollback executed.

---

## What to do next

- Read the [Safe Release pillar](../pillars/safe-release/) end-to-end.
- Apply this pattern to a real (low-risk) flag in your team.
- Run [Lab 02 — Build a Kill Switch You Can Trust](./02-build-a-kill-switch-you-can-trust.md) to layer reliability on top of safe release.

---

## Teardown

Remove the lab artifacts to keep your account clean.

1. **Archive the flag.** `lab-safe-rollout-demo` → Archive.
2. **Archive the metric.** `lab-success-rate` → Archive.
3. **Remove the lab code** from your test application or revert the branch.
4. **Stop the traffic loop.**

If you set up the PagerDuty integration for the lab, leave it — it's worth keeping. Otherwise, remove the lab incident from PagerDuty.
