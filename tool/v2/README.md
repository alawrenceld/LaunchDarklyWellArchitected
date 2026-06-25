# LDWA Review Tool — v2 (interactive)

A self-contained, browser-based interactive review tool for [LaunchDarkly Well-Architected](../../). Walks an engineering team through the framework's 229 review questions across seven pillars, captures risk levels, and produces a prioritized improvement plan that exports to PDF.

This is the **v2** tool from [Decision D-12](../../framework/decisions.md). The v1 markdown workbook is in [`../`](../).

## What's in this directory

| | |
|---|---|
| `src/` | React + TypeScript app source. |
| `scripts/extract-questions.mjs` | Build-time script that parses the framework's pillar `review-questions.md` files into a structured TS data file. |
| `src/data/questions.generated.ts` | Generated at build time. Don't edit by hand. |
| `nginx/` | nginx config + entrypoint that injects runtime config into `index.html`. |
| `Dockerfile` | Multi-stage build (Node build → nginx serve). |
| `docker-compose.yml` | Local container run. |

## Architecture

- **Frontend:** React 18 + TypeScript + Vite. No backend, no database — everything lives in the browser.
- **Persistence:** A single review at a time, persisted to `localStorage`. To collaborate across people, export the summary to PDF.
- **Runtime config:** The container substitutes `LDWA_CANONICAL_URL` and `LDWA_VERSION` env vars into `index.html` at start (via nginx envsubst). The app falls back to sensible defaults if either is unset, so local dev works without configuration.

## Quick start — local development (no container)

```bash
cd tool/v2
npm install
npm run dev
```

Open <http://localhost:5173>. The dev server auto-extracts questions when needed:

```bash
npm run extract:questions   # re-extract from framework MDs
npm run typecheck           # TypeScript only, no emit
npm run build               # production build
npm run preview             # serve the production build at :4173
```

## Run as a container

The Docker build context **must be the repo root** because the build copies in the framework's pillar markdown files.

### With docker-compose (recommended)

From this directory:

```bash
docker compose up --build
```

Open <http://localhost:8080>.

To override the canonical URL (used in meta tags, share links, etc.):

```bash
LDWA_CANONICAL_URL=https://wellarchitected.your-domain.com docker compose up --build
```

Or create a `.env` file in this directory:

```
LDWA_CANONICAL_URL=https://wellarchitected.your-domain.com
LDWA_VERSION=v0.1
```

### Directly with `docker build`

From the repo root:

```bash
docker build -f tool/v2/Dockerfile -t ldwa-review-tool:latest .
docker run --rm -p 8080:8080 \
  -e LDWA_CANONICAL_URL=https://wellarchitected.your-domain.com \
  -e LDWA_VERSION=v0.1 \
  ldwa-review-tool:latest
```

### Verify the container

```bash
curl -s http://localhost:8080/healthz                          # → "ok"
curl -s http://localhost:8080/ | grep canonicalUrl             # → shows the injected URL
```

## Domain / hosting

Per [Decision D-12](../../framework/decisions.md), this tool is intended to live on a dedicated subdomain (`wellarchitected.launchdarkly.com` is the proposed name, pending brand/legal review). The domain is **not** hard-coded:

- Inside the container, the `LDWA_CANONICAL_URL` env var controls the canonical URL that appears in `index.html` metadata.
- When deploying to a real host (Cloudflare Workers, Fly.io, Render, Kubernetes, etc.), pass the actual URL via the orchestrator's env config.
- Until a domain is decided, the default is the proposed `https://wellarchitected.launchdarkly.com`; override at deploy time.

## Updating the question bank

The question bank is generated from the framework's pillar markdown files at build time. To pick up new questions:

1. Edit `pillars/<pillar>/review-questions.md` in the framework.
2. Re-run the build (locally or in CI): `npm run build`. This re-runs `extract:questions` and re-generates `src/data/questions.generated.ts`.
3. Verify the count in the build output.

The script handles the standard question format used across all pillar files (see `scripts/extract-questions.mjs` for the regex).

## Design

The visual design is documented in the [decisions log entry for D-15](../../framework/decisions.md). Short version:

- Token system anchored on the LaunchDarkly 2026 brand library, extended with a "workbook" surface (warm off-white card on a slightly warmer page) for the document-on-desk feeling.
- Sora 700 for question text (display); Inter / Söhne for body; JetBrains Mono / Söhne Mono for question IDs and risk chips — chess-notation feel.
- Three risk colors. LD Lime for *None*, LD Orange for *Medium*, a custom oxide red (`#B33A1D`) for *High* — LD's base palette has no serious red.
- Print stylesheet optimized for the Summary page.

## Limitations of v0.1

- Single review at a time (no review history / multi-review management).
- No authentication; no server-side persistence; no collaboration features.
- No cloud sync between devices. To share, export to PDF.
- Phase 2/3 lenses are not yet in the question bank — pillars only for now.

These are deliberate scope choices for v0.1. The architecture supports adding any of them later without restructuring.

## License

Same as the framework — [CC BY 4.0](../../LICENSE).
