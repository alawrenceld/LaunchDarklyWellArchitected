# LDWA Labs

Hands-on tutorials that turn the LDWA pillars into runnable practice. Each lab is short, self-contained, and produces a working pattern your team can adopt.

The labs do not replace the [pillars](../pillars/). They illustrate them. Run the labs to *internalize* a pattern; consult the pillars to *understand* it.

---

## Status

| | |
|---|---|
| Version | 0.1 (draft) |
| Phase | 1 (Feature Flagging + Guardian Edition) |
| Last updated | 2026-06-24 |

## Phase 1 labs

| # | Lab | Pillar(s) | Time |
|---|---|---|---|
| 01 | [Safe Rollout in 15 Minutes](./01-safe-rollout-in-15-minutes.md) | Safe Release, Operational Excellence | ~15 min |
| 02 | [Build a Kill Switch You Can Trust](./02-build-a-kill-switch-you-can-trust.md) | Safe Release, Reliability | ~30 min |

Future phases will add:

- Run a Real Experiment (hypothesis → metrics → decision)
- Flag Hygiene at Scale (archival policy, Code References, dashboards)
- Securing Flag Operations (RBAC, approvals, audit walkthrough)
- Relay Proxy Deployment (topology, sizing, observability)
- AI Flag Patterns (model swap, prompt versioning, cost guardrail)
- Migration with Flags (strangler-fig walkthrough)

---

## How to use the labs

Each lab follows the same structure:

1. **What you'll build / learn** — the outcome.
2. **Prerequisites** — what you need before starting.
3. **Steps** — a numbered sequence with code and configuration.
4. **Success criteria** — how you know you got it right.
5. **What to do next** — links to the pillars and adjacent labs.
6. **Teardown** — how to clean up.

Labs are cloud-agnostic. Examples use language- and runtime-neutral pseudocode and link to LaunchDarkly's SDK reference for the specific language you're using.

---

## Conventions

- **Code in labs is illustrative, not production-ready.** Lab examples skip secret management, observability, and error handling that real systems need.
- **Use a `lab-` prefix for any flag, segment, or AI Config you create.** This makes cleanup trivial.
- **Run in a non-production environment.** Most labs require a free-tier or test LaunchDarkly project.
