# Decisions Log

This log captures the foundational decisions about LDWA's structure, positioning, operating model, and build queue. It is the source of truth for "what's settled, what's still open." Entries are append-only; changes are recorded as superseding entries rather than edits.

For the open questions still to be resolved, see [`todo.md` §12](../todo.md#12-open-questions-to-resolve-before-phase-1).

---

## Decisions captured 2026-06-24

### Framework shape

**D-1. Pillar count: seven pillars (DX moved to a lens).**
The framework keeps the substantive coverage of the originally-proposed eight areas, but Developer Experience & Velocity becomes a lens rather than a pillar. The pillars are: Safe Release & Progressive Delivery, Operational Excellence, Security & Compliance, Reliability & Resilience, Governance & Artifact Lifecycle, Experimentation & Measurement, Performance & Cost Efficiency.

**D-2. Developer Experience placement: lens.**
DX is about *how* you use LaunchDarkly as an engineer. It cuts across pillars rather than being one of them. Demoting it to a lens preserves the content depth while clarifying the structure.

**D-3. Experimentation is a pillar.**
Already drafted in Phase 2; confirmed. The discipline of hypothesis design, metric design, decision capture, and AI experimentation is large enough to warrant its own pillar.

### Positioning

**D-4. Fully public — AWS Well-Architected style.**
LDWA ships as an open, public framework. Maximum reach, SEO, evangelism, partner adoption. The framework documentation, pillars, lenses, labs, and review tool are all publicly accessible.

**D-5. Relationship to existing LaunchDarkly content: complement.**
LDWA is opinionated *practice*; LaunchDarkly's product docs are reference; the Guide is tutorial; Galaxy is community. Each serves a distinct purpose. LDWA links into the others rather than supersedes them.

**D-6. Hosting: GitHub-first.**
This repository is the canonical source. A GitHub Pages site can render the markdown into a navigable web property. When the v2 interactive review tool ships, it lives on its own dedicated subdomain (likely `wellarchitected.launchdarkly.com`).

**D-7. License: CC BY 4.0.**
Creative Commons Attribution 4.0 International. Anyone may use, share, adapt — including commercially — with attribution. This is the license that makes LDWA practically useful to consultants, partners, customers, and the broader engineering community. Code samples in labs may use a separate permissive license (e.g., MIT) when added.

**D-8. Name: LaunchDarkly Well-Architected (LDWA) — working title; brand/legal review pending.**
The current name remains the working title throughout the repository and the framework. A formal brand/legal review will confirm or revise it before any public launch event. Content can ship publicly under the working title; renames are mechanical.

### Operating model

**D-9. Editorial owner: small cross-functional team (SAs + DevRel + PMM).**
A steering group composed of Solutions Architects (closest to customer practice), DevRel (technical depth and authoring), and Product Marketing (positioning and public framing). One accountable lead within that group. Decisions on framework content require quorum.

**D-10. Contribution model (v1): internal LaunchDarkly contributions only.**
Pull requests are accepted only from LaunchDarkly employees during the v1 phase. External community members file issues. This minimizes coordination overhead at launch. Once the framework is stable and the editorial board's review cadence is established, external PRs may be opened up.

**D-11. Versioning: continuous + annual major.**
Patches and minor additions ship continuously to `main`. Once per year, the framework is locked to a major version so reviews have a stable target. Per-pillar versioning lives in each pillar's index. Triggered minor updates accompany meaningful LaunchDarkly product GAs.

**D-12. Review tool v2 form factor: interactive web tool on a dedicated subdomain.**
The v1 markdown workbook (shipped) remains for users who prefer text. The v2 build is a standalone interactive web tool — likely on `wellarchitected.launchdarkly.com` — that walks teams through pillar questions, scores risks, produces an improvement plan, and exports PDF. Decoupled from the LaunchDarkly product so prospects can use it.

### Build queue

**D-13. Next build: supporting assets.**
Phase 1+2 framework content is essentially complete. The next build wave focuses on supporting assets: reference architecture diagrams (Mermaid in-repo) and an exec one-pager (PDF using the LaunchDarkly design system).

**D-14. Diagram tooling: Mermaid in-repo.**
Reference architecture diagrams are authored as Mermaid source files inside the repository. They render natively on GitHub, are version-controllable, and are easy for contributors to edit. Designed illustrations are reserved for hero/section visuals where polish matters more than editability.

**D-15. Exec one-pager format: PDF via the LaunchDarkly design system.**
The one-pager is a polished, branded PDF authored via the design-system pipeline (HTML → headless Chromium → PDF, per Path C of the design system skill). Audience: engineering executives at LaunchDarkly customers and prospects.

**D-16. Reference architectures to diagram first (all four).**
- Server SDK + Relay Proxy topology (3 instances, 2 availability zones).
- Mobile + client-side + bootstrap pattern.
- Multi-region + daemon mode for serverless workloads.
- Edge evaluation (Cloudflare Workers / Vercel Edge / Fastly Compute).

**D-17. Next lens after supporting assets: Mobile Lens.**
The Phase 3 lens to draft next. Distinct topology (client-side SDK, offline-first, app-store cadence), common customer profile, ready demand. Drafted as a full lens following the Regulated Industries + AI/GenAI shape.

---

## How this log is used

- **New decisions** are appended below as additional entries, dated, with the same shape.
- **Superseded decisions** are not edited; a new entry references the prior decision by ID and explains the supersession.
- **Open questions** that have not been decided remain in [`todo.md` §12](../todo.md#12-open-questions-to-resolve-before-phase-1) until they are.

The decision log is the answer to "wait, why did we do it this way?"
