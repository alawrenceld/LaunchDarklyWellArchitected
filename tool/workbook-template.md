# LDWA Review Workbook — `[SYSTEM NAME]`

> Copy this file, replace the placeholders, and fill in during the review.

---

## 1. Review metadata

| Field | Value |
|---|---|
| **System under review** | [name + one-line description] |
| **Review date** | YYYY-MM-DD |
| **Framework version** | LDWA 0.1 (Phase 1) |
| **System owner** | [name + team] |
| **Reviewer(s)** | [names] |
| **Scribe** | [name] |
| **Executive sponsor** | [name] |
| **Prior review date** | [if any] |
| **Re-review target date** | YYYY-MM-DD |

---

## 2. System framing

### One-paragraph description

> What does this system do? Who uses it? How is LaunchDarkly involved?

…

### Architecture sketch

> Where do LD SDKs live? Where do Relay Proxies (if any) sit? Where do contexts come from? Where do events go?
> Inline an ASCII or attached diagram.

```
[sketch]
```

### In-scope LaunchDarkly capabilities

Check all that apply.

- [ ] Feature flags
- [ ] Contexts & segments
- [ ] Release Pipelines
- [ ] Guarded Releases
- [ ] AI Configs
- [ ] Experiments
- [ ] Relay Proxy
- [ ] Edge SDK / edge delivery
- [ ] Code References
- [ ] Audit Log / RBAC / Teams
- [ ] Guardian Edition features (approvals, scheduled changes, workflows)
- [ ] Federal offering
- [ ] LaunchDarkly Observability (Session Replay / Errors / Logs)
- [ ] Data Export

### In-scope pillars

Check all that apply. Skip pillars that don't fit this system.

- [ ] Safe Release & Progressive Delivery
- [ ] Operational Excellence
- [ ] Security & Compliance
- [ ] Reliability & Resilience
- [ ] Governance & Artifact Lifecycle
- [ ] Experimentation & Measurement *(Phase 2)*
- [ ] Performance & Cost Efficiency *(Phase 2)*
- [ ] Developer Experience & Velocity *(Phase 2)*

### In-scope lenses

- [ ] Regulated Industries Lens
- [ ] AI / GenAI Lens *(Phase 2)*
- [ ] Mobile Lens *(Phase 3)*
- [ ] Hybrid / Multi-Cloud / On-Prem Lens *(Phase 3)*
- [ ] Platform Engineering Lens *(Phase 3)*
- [ ] Edge & Performance-Critical Lens *(Phase 3)*
- [ ] Migration & Modernization Lens *(Phase 3)*
- [ ] Experimentation / Growth Lens *(Phase 3)*
- [ ] SaaS / Multi-Tenant Lens *(Phase 3)*

---

## 3. Findings by pillar

For each in-scope pillar, walk the review questions. Capture: answer, evidence, risk level (High / Medium / None), and any improvement ideas. Duplicate the section template for each in-scope pillar.

### Pillar: [PILLAR NAME]

| ID | Question | Answer (with evidence) | Risk | Improvement idea |
|---|---|---|---|---|
| [Q-ID] | [paste the question text] | [answer + evidence] | High / Medium / None | [idea, if any] |
| … | … | … | … | … |

**Pillar summary.** Two or three sentences on the team's posture for this pillar.

…

---

### Pillar: [PILLAR NAME]

(duplicate above)

---

## 4. Findings by lens

For each applied lens, walk the lens's review questions. Same table structure.

### Lens: [LENS NAME]

| ID | Question | Answer (with evidence) | Risk | Improvement idea |
|---|---|---|---|---|
| … | … | … | … | … |

**Lens summary.**

…

---

## 5. Aggregated risk picture

### High-risk findings

| Pillar/Lens | Finding | Owner | Target date |
|---|---|---|---|
| … | … | … | … |

### Medium-risk findings

| Pillar/Lens | Finding | Owner | Target date |
|---|---|---|---|
| … | … | … | … |

### Strengths (no-risk findings worth preserving)

| Pillar/Lens | Strength | Why this matters |
|---|---|---|
| … | … | … |

---

## 6. Top three to five improvement items

The prioritized subset for immediate action. Pull these from the high-risk findings (and high-impact medium-risk ones) using **risk × inverse effort** as the ordering.

| # | Improvement item | Owner | Effort (S/M/L/XL) | Risk | Target date |
|---|---|---|---|---|---|
| 1 | … | … | … | High / Medium | YYYY-MM-DD |
| 2 | … | … | … | … | … |
| 3 | … | … | … | … | … |

(Up to 5.)

---

## 7. Risks accepted

Findings the team has reviewed and chosen *not* to remediate at this time, with rationale.

| Finding | Rationale for accepting | Re-review trigger |
|---|---|---|
| … | … | … |

---

## 8. Notes and follow-ups

Anything that came up during the review that isn't an improvement item but is worth recording — questions for LaunchDarkly, design ideas, references to other systems, etc.

…

---

## 9. Sign-off

| Role | Name | Date |
|---|---|---|
| System owner | | |
| Reviewer | | |
| Executive sponsor | | |

---

*Save this workbook alongside the system's architecture documentation. It is the input to the next review.*
