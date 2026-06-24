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

| # | Lab | Pillar(s) / Lens | Time |
|---|---|---|---|
| 01 | [Safe Rollout in 15 Minutes](./01-safe-rollout-in-15-minutes.md) | Safe Release, Operational Excellence | ~15 min |
| 02 | [Build a Kill Switch You Can Trust](./02-build-a-kill-switch-you-can-trust.md) | Safe Release, Reliability | ~30 min |
| 03 | [Run a Real Experiment](./03-run-a-real-experiment.md) | Experimentation, Safe Release | ~45 min setup + 1–4 weeks runtime |
| 04 | [Flag Hygiene at Scale](./04-flag-hygiene-at-scale.md) | Governance, Operational Excellence | ~60 min + quarterly cadence |
| 05 | [Securing Flag Operations](./05-securing-flag-operations.md) | Security & Compliance, Governance | ~90 min |
| 06 | [Relay Proxy Deployment](./06-relay-proxy-deployment.md) | Reliability, Operational Excellence | ~2–3 hours |
| 07 | [AI Flag Patterns](./07-ai-flag-patterns.md) | Safe Release, Reliability, Experimentation, AI/GenAI lens | ~90 min |
| 08 | [Migration with Flags](./08-migration-with-flags.md) | Safe Release, Reliability, Operational Excellence | varies by migration |

Future phases may add labs for specific lenses (Mobile, Hybrid/Multi-Cloud, Platform Engineering, Edge, SaaS) and for the Performance & Cost and Developer Experience pillars as they ship.

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
