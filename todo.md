# LaunchDarkly Well-Architected — Build Plan

A working punch list for everything we need to produce in order to ship a "LaunchDarkly Well-Architected" framework.

We are borrowing AWS Well-Architected's **structure and approach to documentation** because it's the gold-standard example of how to communicate an architectural opinion at scale. We are *not* tying any of the content to AWS.

**Scope rule:** LaunchDarkly Well-Architected (LDWA) is cloud-agnostic and platform-neutral. Guidance must apply equally to customers running on AWS, GCP, Azure, on-prem, hybrid, edge, or any combination. Cloud-specific examples are allowed in labs and reference architectures, but only when paired with equivalents (or written in provider-neutral terms) so no single provider is privileged in the framework itself.

---

## 0. Reference model — what AWS Well-Architected actually is

We're using AWS WA only as a **structural template** for how to package this kind of framework. The content of LDWA is about feature management with LaunchDarkly, independent of where the customer runs.

AWS Well-Architected is made up of:

1. **The Framework whitepaper** — the canonical doc that introduces the program, defines terms, and lists the *general design principles*.
2. **Six Pillars**, each a standalone whitepaper:
   - Operational Excellence
   - Security
   - Reliability
   - Performance Efficiency
   - Cost Optimization
   - Sustainability
3. **Per-pillar structure** (same shape for each pillar):
   - Design Principles (5–7 high-level tenets)
   - Definition (the focus areas / sub-categories inside the pillar)
   - Best Practices (grouped under each focus area)
   - Questions (used by reviewers to assess a workload)
   - Resources (links, labs, deeper reading)
4. **Lenses** — domain-specific extensions (Serverless, SaaS, ML, GenAI, IoT, Financial Services, Data Analytics, HPC, Games, Hybrid Networking, SAP, Streaming Media).
5. **AWS Well-Architected Tool** — in-console workload review tool that walks teams through the questions and tracks improvement items.
6. **AWS Well-Architected Labs** — hands-on tutorials and reference code at wellarchitectedlabs.com.
7. **AWS Well-Architected Partner Program** — trained partners who run reviews for customers.
8. **Reviews & remediation flow** — the prescribed process: identify workload → answer questions → produce improvement plan → re-review.

The LD version below mirrors this shape one-to-one.

---

## 1. Foundational decisions (do these first)

- [ ] **Name and scope** the program. Working title: *LaunchDarkly Well-Architected Framework (LDWA)*. Confirm naming with brand/legal.
- [ ] **Lock the cloud-/platform-neutral positioning.** LDWA is for any LD customer regardless of where they run (AWS, GCP, Azure, on-prem, hybrid, edge). Style guide: no AWS-specific service names in the framework itself; cloud-specific guidance lives only in labs or reference architectures and must be balanced across providers.
- [ ] **Lock the product-coverage positioning.** LDWA is for the **entire LaunchDarkly portfolio**, not just feature flags. The framework is designed so any LD capability — current or future — maps cleanly onto its pillars. Phase 1 ships Feature Flagging + Guardian Edition deeply; subsequent phases extend depth into Experimentation, AI Configs, Release Pipelines, Observability (Session Replay / Errors / Logs), Contexts, and Federal.
- [ ] **Define the audience.** Primary: platform engineers, SREs, release managers, product engineers, EM/Architects at LD customers and prospects — across any infrastructure footprint. Secondary: LD SAs, partners, internal CS.
- [ ] **Define the unit of review.** AWS reviews a "workload." For LD, propose: an *LD-managed system* — a service or product surface whose runtime behavior, releases, experiments, AI configuration, or observability are governed by LaunchDarkly. (Working term — broader than "flag-driven system" so it covers the full portfolio.)
- [ ] **Pick the pillars** (proposed below — confirm with stakeholders before writing).
- [ ] **Pick the lenses** (proposed below — confirm priority order).
- [ ] **Decide artifact format**: web docs site vs. PDF whitepapers vs. both. AWS does both — recommend both.
- [ ] **Decide review delivery vehicle**: standalone web tool, in-app inside LD, or downloadable workbook for v1.
- [ ] **Versioning + publication cadence.** AWS revises annually; commit to a cadence.
- [ ] **Source-of-truth repo layout** for this folder (docs/, pillars/, lenses/, labs/, tool/, assets/).
- [ ] **Style + brand alignment** with the LaunchDarkly 2026 Brand Library (Söhne/Sora, color tokens, gradient system).

---

## 1.5 Scope: LaunchDarkly product surface area covered by LDWA

LDWA must encompass the entire LaunchDarkly portfolio. The table below names what's in scope, which pillar primarily owns it, and which phase first ships meaningful depth for it. Anything not yet shipped still appears so the framework's structure stays honest about what it will eventually cover.

| LD capability | Primary pillar(s) | First phase with depth |
|---|---|---|
| Feature flags (server, client, mobile, edge SDKs) | Safe Release; Reliability; DX | **Phase 1** |
| Contexts & segments (multi-context targeting model) | Safe Release; Security; Performance | **Phase 1** |
| Environments, projects, tagging | Operational Excellence; Governance | **Phase 1** |
| Guardian Edition — approvals, scheduled changes, change-management workflows, advanced audit | Security & Compliance; Governance | **Phase 1** |
| Guarded Releases (metric-based auto-rollback) | Safe Release; Experimentation | **Phase 1** |
| Relay Proxy (incl. autoconfig, offline mode, daemon) | Reliability; Performance | **Phase 1** |
| Code References | Governance; DX | **Phase 1** |
| Audit Log + Member Roles / RBAC / Teams | Security & Compliance; Governance | **Phase 1** |
| Federal / FedRAMP offering | Security & Compliance | **Phase 1** (lens) |
| Experimentation (metrics, holdouts, sequential, multi-arm) | Experimentation & Measurement | **Phase 2** |
| Release Pipelines / Release Automation (stages, gates, workflows) | Safe Release; Operational Excellence | **Phase 2** |
| AI Configs (model/prompt/provider management for AI features) | Safe Release; Experimentation; Security | **Phase 2** (lens) |
| Mobile-specific patterns (offline-first, store cadence) | Reliability; Safe Release | **Phase 2** (lens) |
| Observability — Session Replay, Errors, Logs (from Highlight) | Operational Excellence; Experimentation | **Phase 3** |
| Data Export & integrations (Snowflake, Kafka, observability/APM tools) | Operational Excellence; Performance | **Phase 3** |
| Edge & CDN-tier delivery (Cloudflare/Vercel/Fastly partners) | Performance; Reliability | **Phase 3** |
| Insights / dashboards / metric exploration | Experimentation; Operational Excellence | **Phase 3** |

- [ ] Validate this table with PM owners for each capability.
- [ ] Mark anything ambiguous (e.g., where "Experimentation" overlaps with "Guarded Releases").
- [ ] Keep this table as the **single source of truth** for what LDWA covers — every pillar and lens references it.

---

## 2. The core framework document (the "welcome" whitepaper)

Mirror AWS's framework intro. Need to write:

- [ ] **Introduction** — what LDWA is, who it's for, what problem it solves.
- [ ] **Definitions & terminology** — flag, segment, context, experiment, environment, project, SDK, Relay Proxy, guarded release, holdout, kill switch, default value, fallback, evaluation, etc. One canonical glossary.
- [ ] **On being "Well-Architected" with LaunchDarkly** — what good looks like.
- [ ] **General Design Principles** (LDWA equivalent of AWS's 6 general principles). Draft set to refine:
  - Default to safe — every flag has a safe default and a fallback path.
  - Decouple deploy from release — shipping code is not the same as releasing a feature.
  - Make rollouts reversible — every change can be undone in seconds.
  - Target small, expand deliberately — progressive exposure beats big-bang.
  - Measure what you ship — instrument every meaningful release with metrics.
  - Treat flags as code — name, review, govern, and retire them with the same rigor.
  - Build for graceful degradation — SDK or network failures must never take down the product.
  - Govern access and change — least-privilege, audited, environment-aware.
- [ ] **The review process** — how a team uses LDWA to evaluate a flag-driven system.
- [ ] **How to use this framework** — first-time read vs. reference vs. review.
- [ ] **Contribution and feedback** model.
- [ ] **Document revision history** page.

---

## 3. The Pillars (proposed)

Each pillar gets its own whitepaper. For each, produce: Design Principles, Definition (focus areas), Best Practices, Review Questions, Resources.

### 3.1 Pillar: Safe Release & Progressive Delivery
Covers every artifact LD uses to change runtime behavior: flags, release pipelines, guarded releases, AI configs, scheduled changes.
- [ ] Design principles (e.g., reversible by default, ring-based exposure, automated guardrails).
- [ ] Focus areas: targeting strategy; rollout patterns (percentage, ring, canary, blue/green); Release Pipelines & stages; Guarded Releases (metric-based auto-rollback); AI Config rollouts (model/prompt/provider swaps); kill switches; default & fallback values; SDK offline behavior; scheduled changes; change windows.
- [ ] Best practices per focus area.
- [ ] Review questions (10–15).
- [ ] Anti-patterns gallery (big-bang flips, missing defaults, ungated AI swaps, etc.).

### 3.2 Pillar: Experimentation & Measurement
Covers Experimentation, Guarded Releases' metric layer, AI Config experimentation, and the metrics layer used by Insights/Session Replay.
- [ ] Design principles (every release is a hypothesis, guardrail metrics are mandatory, etc.).
- [ ] Focus areas: hypothesis design; metric design (primary/secondary/guardrail); experiment vs. rollout vs. guarded release distinction; sample-size & power; holdouts; sequential testing; multi-arm patterns; AI Config experimentation (cost, latency, quality metrics); results interpretation; decision review; experiment governance.
- [ ] Best practices.
- [ ] Review questions.
- [ ] Worked examples (good vs. bad experiment setups, incl. an AI Config example).

### 3.3 Pillar: Operational Excellence
Covers day-2 operation of all LD artifacts and the observability surface (Session Replay, Errors, Logs, Data Export).
- [ ] Design principles.
- [ ] Focus areas: artifact lifecycle (flags, segments, experiments, AI configs, pipelines — create → roll out → measure → clean up); naming conventions; ownership and tagging; observability/alerting on LD changes; audit and change history; runbooks for LD-related incidents; integration with on-call & APM tooling; using LD Observability (Session Replay / Errors / Logs) to close the loop on releases; CI/CD integration; Data Export to a data warehouse.
- [ ] Best practices.
- [ ] Review questions.

### 3.4 Pillar: Security & Compliance
Strong home for **Guardian Edition** + **Federal** content.
- [ ] Design principles.
- [ ] Focus areas: SDK key handling; mobile vs. server vs. client-side key model; secrets management; RBAC, Teams, and custom roles; environment isolation; Audit Log; data residency & regional hosting; PII in contexts; compliance frameworks (SOC2, HIPAA, FedRAMP/Federal, EU AI Act, PCI); **Guardian Edition** controls (required approvals, scheduled changes, change-management workflows, separation of duties); AI Config safety (prompt-injection surface, provider key handling, content moderation).
- [ ] Best practices.
- [ ] Review questions.

### 3.5 Pillar: Reliability & Resilience of the LD Layer
Covers reliability of every LD touchpoint: SDKs, Relay Proxy, edge delivery, event ingestion, AI Config evaluation.
- [ ] Design principles.
- [ ] Focus areas: SDK initialization & bootstrap; daemon mode; Relay Proxy topology (incl. autoconfig, offline mode); edge/CDN flag delivery; AI Config provider failover; event-ingestion resilience; multi-region considerations; failover; offline behavior; default values; defensive evaluation patterns; treating LD as a hard vs. soft dependency; chaos drills for the LD layer.
- [ ] Best practices.
- [ ] Review questions.

### 3.6 Pillar: Governance & Artifact Lifecycle
Renamed from "Flag Hygiene" so it covers every LD-managed artifact: flags, segments, experiments, AI configs, release pipelines.
- [ ] Design principles.
- [ ] Focus areas: artifact debt (stale flags, abandoned experiments, orphan AI configs, dead pipelines); archival policy per artifact type; ownership decay; dead-artifact detection; **Code References** as a first-class governance tool; naming + tagging taxonomy; environment promotion; project structure; approvals/workflows (Guardian Edition); change-management policy; bulk operations & API governance.
- [ ] Best practices.
- [ ] Review questions.
- [ ] Metrics for "LD health" (stale flag %, unowned %, time-to-archive, experiments-without-decision %, AI configs without owner %).

### 3.7 Pillar: Performance & Cost Efficiency
- [ ] Design principles.
- [ ] Focus areas: evaluation latency; SDK choice (server vs. client vs. edge); Relay Proxy sizing; event/analytics volume; experiment event volume; AI Config token/cost guardrails; Session Replay & Errors ingestion volume; MAU/MCI cost model; context cardinality; payload size; sampling; project/environment sprawl; Data Export cost considerations.
- [ ] Best practices.
- [ ] Review questions.

### 3.8 Pillar: Developer Experience & Velocity
- [ ] Design principles.
- [ ] Focus areas: SDK integration patterns; local dev with flags / AI configs; unit/integration testing with flags & experiments; ephemeral environments; code review for LD changes; type-safety / codegen for flag and AI Config keys; IDE integrations; Terraform / IaC management of LD resources; AI Config local iteration loop; onboarding ramp.
- [ ] Best practices.
- [ ] Review questions.

> Open question for stakeholders: collapse 3.5 into 3.1, or keep them distinct? AWS keeps Reliability and Operational Excellence separate; recommend we mirror that.

---

## 4. Lenses (domain-specific extensions)

Each lens is a smaller document that re-applies the pillars to a specific context.

Proposed v1 lenses (pick 2–3 to ship first):
- [ ] **AI / GenAI Lens** — built on **LaunchDarkly AI Configs**: flagging models, prompts, providers; AI experimentation (quality, latency, cost); cost & safety guardrails; eval pipelines; provider failover. (High priority — aligned with market.)
- [ ] **Mobile Lens** — client-side SDKs, offline-first, app-store release cadence vs. server-side flips.
- [ ] **Regulated Industries Lens** — FinServ, healthcare, public sector: deep dive on **Guardian Edition** (approvals, scheduled changes, change-management workflows) and **Federal / FedRAMP**; audit, residency, separation of duties.
- [ ] **Platform Engineering / Internal Developer Platform Lens** — flags as a platform capability inside large orgs.
- [ ] **Edge & Performance-Critical Lens** — edge SDKs, latency budgets, Relay Proxy at scale.
- [ ] **Migration / Modernization Lens** — using flags to migrate (strangler-fig, dark launches, database cutover).
- [ ] **Experimentation-Heavy / Growth Lens** — for teams whose primary use is A/B testing and feature optimization.
- [ ] **SaaS / Multi-Tenant Lens** — per-tenant targeting, entitlements via flags, customer-specific rollouts.
- [ ] **Hybrid / Multi-Cloud / On-Prem Lens** — Relay Proxy topologies across providers, air-gapped or restricted-egress deployments, federated identity, residency split across regions/providers, failure modes when one provider or site is unreachable.

For each shipped lens:
- [ ] Definition and scope.
- [ ] How each pillar's questions specialize for this domain.
- [ ] Additional best practices unique to the lens.
- [ ] Reference architectures.

---

## 5. The LDWA Review Tool

AWS ships an in-console Well-Architected Tool. We need an equivalent.

- [ ] **Decide form factor:** in-product feature inside LaunchDarkly, standalone web app, or downloadable workbook (spreadsheet/Notion template) for v1.
- [ ] **Question bank** — extract from each pillar's review questions into a structured format (YAML/JSON).
- [ ] **Scoring model** — per-question risk levels (High / Medium / None), per-pillar score, overall maturity.
- [ ] **Improvement plan output** — prioritized list with links to relevant best practices.
- [ ] **Workload definition flow** — what is being reviewed (which project/env/team).
- [ ] **Lens overlays** — apply selected lenses to a review.
- [ ] **Milestone / re-review tracking** — track improvement over time.
- [ ] **Export** to PDF / share link.
- [ ] **Integrations** — pull live data from a customer's LD account to pre-answer questions where possible (e.g., "Do you have stale flags?" → answer from API).
- [ ] **Telemetry** to learn which questions most often surface risk.

---

## 6. LDWA Labs (hands-on tutorials)

AWS has wellarchitectedlabs.com. We need ld-well-architected-labs.

- [ ] Repo / site scaffolding.
- [ ] **Lab: Safe rollout in 15 minutes** — percentage rollout + guardrail metric + auto-rollback.
- [ ] **Lab: Build a kill switch you can trust** — defaults, fallbacks, offline behavior, drill.
- [ ] **Lab: Run a real experiment** — hypothesis → metrics → decision.
- [ ] **Lab: Flag hygiene at scale** — archival policy, code-reference scanning, dashboards.
- [ ] **Lab: Securing flag operations** — RBAC, approvals, audit walkthrough.
- [ ] **Lab: Relay Proxy deployment** — topology, sizing, observability.
- [ ] **Lab: AI flag patterns** — model swap, prompt versioning, cost guardrail.
- [ ] **Lab: Migration with flags** — strangler-fig walkthrough.
- [ ] Per-lab: prerequisites, runnable code, success criteria, teardown.

---

## 7. Partner Program

- [ ] Define the **LDWA Partner** tier — what training, certification, and review credentials are required.
- [ ] Training curriculum for partners (built on the pillars + labs).
- [ ] Partner-led review playbook.
- [ ] Partner directory / "find a partner" page.
- [ ] Co-marketing assets.

---

## 8. The Review Process (how customers actually use it)

- [ ] Document the **end-to-end review flow**: identify flag-driven system → run questions → score → improvement plan → remediate → re-review.
- [ ] Roles & responsibilities (workload owner, reviewer, executive sponsor).
- [ ] Timing guidance (how long a review takes, cadence — quarterly? per release?).
- [ ] Remediation prioritization model (risk × effort).
- [ ] Template artifacts: review prep doc, findings doc, improvement plan, exec summary.
- [ ] Case-study template so customers can publish their results.

---

## 9. Supporting content & assets

- [ ] **Landing page** — public hub equivalent to aws.amazon.com/architecture/well-architected.
- [ ] **Blog launch series** — one post per pillar + program overview.
- [ ] **Webinar / launch event** content.
- [ ] **Sales / CS enablement deck** (use the LD design system skill).
- [ ] **One-pager PDF** for execs.
- [ ] **Customer-facing FAQ.**
- [ ] **Internal enablement** — SA training, CS training, sales talk track.
- [ ] **Reference architecture diagrams** for common patterns (server SDK + Relay, mobile + bootstrap, edge eval, multi-region) — drawn in provider-neutral terms, with cloud-specific variants (AWS / GCP / Azure / on-prem / hybrid) called out only where the topology meaningfully differs.
- [ ] **Anti-pattern catalog** — visual library of "don't do this."
- [ ] **Metrics & KPIs** — how a customer measures their own LDWA maturity over time.

---

## 10. Governance of the framework itself

- [ ] **Owning team** at LaunchDarkly.
- [ ] **Editorial board / steering committee** (eng, product, CS, partners, customer advisory).
- [ ] **Contribution process** (internal + external).
- [ ] **Revision cadence** and changelog process.
- [ ] **Feedback channels** (form, Slack/Discord, GitHub issues if open).
- [ ] **Public vs. internal** content split.
- [ ] **License** for the public materials (CC-BY? proprietary?).

---

## 11. Sequencing (proposed delivery phases)

Coverage expands by product area, not just by pillar count. The product-coverage table in §1.5 is the source of truth for what each phase ships.

- **Phase 0 — Alignment (weeks 1–2):** lock pillars, lenses, naming, audience, form factor, and the §1.5 product-coverage table. Stakeholder sign-off.
- **Phase 1 — Feature Flagging + Guardian Edition MVP (weeks 3–8):** ship framework intro + all pillars at v1 depth, but examples/best practices/questions focused on **flags, contexts, Relay Proxy, Guarded Releases, Code References, Audit Log/RBAC, and Guardian Edition** (approvals, scheduled changes, workflows). Workbook-form review tool. 2 labs. Landing page. Regulated Industries lens (Guardian + Federal).
- **Phase 2 — Experimentation, Release Pipelines, AI Configs (weeks 9–14):** extend each pillar's focus areas, best practices, and review questions to cover Experimentation, Release Pipelines, and AI Configs. Ship AI/GenAI lens. 2 more labs.
- **Phase 3 — Observability, Edge, Data Export (weeks 15–22):** extend coverage to LD Observability (Session Replay / Errors / Logs), edge SDK patterns, and Data Export. Ship interactive review tool, partner program v1, remaining lenses (Mobile, Hybrid/Multi-Cloud, Migration, SaaS, Growth).
- **Phase 4 — Steady state:** annual revision, new-product coverage as LD ships features, customer case studies, community contributions.

---

## 12. Open questions to resolve before Phase 1

Resolved 2026-06-24 — see [Decisions Log](./framework/decisions.md) for the full record.

- [x] Final pillar list and names → **7 pillars** (DX demoted to lens). See D-1, D-2.
- [x] Is "Experimentation" its own pillar or a focus area? → **Pillar.** See D-3.
- [x] Is "Developer Experience" a pillar or a lens? → **Lens.** See D-2.
- [x] Will the review tool live inside the LaunchDarkly product or as a standalone? → **Standalone interactive web tool** on a dedicated subdomain (v2); v1 workbook is markdown. See D-12.
- [x] How much of this is public vs. gated? → **Fully public**, AWS WA style. See D-4.
- [x] Relationship to existing LD content? → **Complement** docs, Guide, Galaxy. See D-5.
- [x] Hosting → **GitHub-first**, with subdomain for the v2 tool. See D-6.
- [x] License → **CC BY 4.0.** See D-7.
- [x] Name → **LDWA as working title; brand/legal review pending.** See D-8.
- [x] Editorial owner → **Cross-functional team** (SAs + DevRel + PMM). See D-9.
- [x] Contribution model → **Internal-LD-only for v1.** See D-10.
- [x] Versioning → **Continuous + annual major.** See D-11.

Still open:

- [ ] **Product-coverage governance:** what's the process when LD ships a new product or capability mid-cycle? Who decides which pillar(s) absorb it, and when it becomes a review-question subject? Recommend tying LDWA updates to GA milestones; needs steering-group confirmation.
- [ ] **Brand/legal confirmation** of the LDWA name and visual treatment for public launch.
- [ ] **Launch event/timeline** — when does the public launch happen, what's the surrounding campaign?

---

## 13. Optional / nice-to-have (only if we decide to invest)

These aren't part of any committed phase. Captured here so they're not forgotten if priorities shift later.

- [ ] **CI build + publish the v2 container image to GHCR (or equivalent).** A GitHub Actions workflow that, on push to `main`, runs `npm run typecheck` + builds the Docker image + pushes to `ghcr.io/alawrenceld/ldwa-review-tool` (or an org-owned registry). Makes the container available for deployment without anyone running `docker build` locally. Only worth doing once we have a real domain and an actual deployment target.
