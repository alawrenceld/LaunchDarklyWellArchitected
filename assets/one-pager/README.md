# LDWA Executive One-Pager

A single-page US Letter PDF summarizing the LaunchDarkly Well-Architected framework. Intended for exec briefings, sales enablement, partner conversations, and any context where a quick, branded overview of LDWA is useful.

## Output

The rendered PDF lives at `build/launchdarkly-well-architected-one-pager.pdf` after running the build. It is checked into the repo so consumers can grab it directly without running the toolchain.

## Source

- **`one-pager.html`** — the HTML source. Edit this when content changes.
- **`assets/`** — LaunchDarkly brand assets: typography (Söhne + Sora), color tokens, and the logo lockup. Copied from the LaunchDarkly Brand Library 2026 via the design-system skill.
- **`render.mjs`** — headless Chromium render script (Playwright). Produces the PDF from the HTML.
- **`package.json`** — local Node project for the Playwright dependency.

## Building the PDF locally

The fonts are not committed to this repo (see "Fonts and licensing" below). Before rendering, copy them in from the LaunchDarkly design system source you have access to. If you're running the LaunchDarkly Design System Claude skill locally:

```bash
# from this directory
cp -r ~/.claude/skills/ld-design-system-skill/assets/fonts assets/
```

Then build:

```bash
npm install
npx playwright install chromium
node render.mjs
```

Output appears at `build/launchdarkly-well-architected-one-pager.pdf`.

## Fonts and licensing

The Söhne family is a commercial font from Klim Type Foundry and is not licensed for redistribution. It is **not** committed to this repository. The `assets/fonts/` directory is gitignored.

Sora (open under the SIL Open Font License) and the other fallback fonts referenced in the CSS may be obtained separately under their respective licenses.

If you don't have the Söhne fonts available, the rendered PDF will fall back to the Google-Slides-safe substitutions (Söhne → Inter) per the LaunchDarkly Design System's font-substitution table. The CSS already declares the fallback chains, so the render still works — it just looks slightly less polished.

A future revision of this build will produce two PDF variants: one with Söhne (for LaunchDarkly-internal use), and one with only open-source fonts (for redistribution).

## Why HTML → PDF?

This follows Path C of the LaunchDarkly Design System skill: HTML is the authoring format (easy to version-control, easy to edit), and a headless browser produces the final PDF with the real Söhne + Sora fonts and the real brand colors. The HTML file is not the deliverable — the PDF is.

## What's on the one-pager

- Hero with the framework's positioning statement.
- The seven pillars, with one-line descriptors.
- A nod to the lens system.
- The ten general design principles.
- "Who it's for" and "How to use it" blocks.
- Repo URL, license, version, and revision.

## Versioning

The version label in the footer ("v0.1 draft") should match the framework's current version. Update it when the framework's major version moves.

## Editing

Content changes are made in `one-pager.html`. Re-render with `node render.mjs`. Commit the updated `one-pager.html` and the regenerated PDF together.

## License & attribution

The one-pager itself is licensed under [CC BY 4.0](../../LICENSE), matching the rest of LDWA. The Söhne and Sora fonts are licensed separately under their respective foundry licenses; they are bundled here for the rendering pipeline only and should not be redistributed outside this project's render workflow.
