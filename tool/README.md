# LDWA Review Tool

This is the **workbook form** of the LaunchDarkly Well-Architected review tool — the v1 delivery vehicle for running a review against an LD-managed system. Future phases will deliver an interactive web tool and (potentially) an in-product LaunchDarkly experience; this workbook is the canonical structure both will be built on.

To run a review, see [The Review Process](../framework/review-process.md) for the end-to-end flow. This tool provides the templates.

---

## What's in this folder

| File | Purpose |
|---|---|
| [`workbook-template.md`](./workbook-template.md) | The blank workbook — copy this for each review. |
| [`improvement-plan-template.md`](./improvement-plan-template.md) | The output template for the prioritized improvement plan. |
| [`executive-summary-template.md`](./executive-summary-template.md) | The one-page summary for sponsors and leadership. |
| [`scoring-model.md`](./scoring-model.md) | How risk levels are assigned and aggregated. |
| [`questions/`](./questions/) | The structured question bank — one file per pillar/lens (future). |

---

## How to use it

1. **Copy** the workbook template into a new file for the system you're reviewing.
2. **Frame** the system: name, description, architecture sketch, in-scope LD capabilities.
3. **Pick** the in-scope pillars and lenses. Skip the rest.
4. **Walk** the questions for each in-scope pillar/lens. Capture answers, evidence, and risk levels.
5. **Aggregate** the findings into the improvement plan template.
6. **Brief** the sponsor with the executive summary template.
7. **Schedule** the re-review.

A typical review covering 4–5 pillars takes 4–6 hours, split across one or two sessions. Reviews covering more pillars or applying lenses can extend to a full day.

---

## A note on form factor

The workbook is markdown-based for portability — it works in any text editor, any version-control system, any document tool. You can convert it to:

- **Google Docs / Notion / Confluence** by pasting; markdown is widely supported.
- **A spreadsheet** by extracting the questions table.
- **A PDF** via any markdown-to-PDF converter.
- **A web form** by transforming the question bank into HTML.

A future LDWA release will ship an interactive web tool with native scoring, milestone tracking, and the ability to pull live data from your LaunchDarkly account to pre-answer some questions. The question bank used by that tool will be derived from the same source as this workbook.

---

## Versioning

The workbook follows the LDWA framework version. When the framework or a pillar materially changes, the workbook is updated. Past reviews remain valid against the version they were run with; re-reviews use the current version.

Current version: **0.1 (draft)** — Phase 1.
