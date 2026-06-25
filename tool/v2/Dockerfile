# =============================================================================
# LDWA Review Tool — container image
#
# Build context MUST be the repo root (one directory above this Dockerfile),
# so the build can pull in both the v2 app and the framework's pillar
# review-questions.md files that the question-extraction script reads from.
#
# From the repo root:
#   docker build -f tool/v2/Dockerfile -t ldwa-review-tool:latest .
#
# Or via docker-compose (which sets context correctly):
#   docker compose -f tool/v2/docker-compose.yml build
# =============================================================================


# -----------------------------------------------------------------------------
# Stage 1 — install + build
# -----------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files for the v2 app and install dependencies.
COPY tool/v2/package.json tool/v2/package-lock.json* ./
RUN npm ci --no-audit --no-fund 2>/dev/null || npm install --no-audit --no-fund

# Copy the v2 source.
COPY tool/v2/tsconfig.json tool/v2/vite.config.ts tool/v2/vite-env.d.ts tool/v2/index.html ./
COPY tool/v2/src ./src
COPY tool/v2/scripts ./scripts
COPY tool/v2/public ./public

# Mirror the framework's pillars under /pillars-root/ so the
# extract-questions.mjs script (which looks for ../../pillars relative to
# its own location) resolves correctly: scripts/extract-questions.mjs sees
# /app/../pillars-root/pillars → /pillars-root/pillars.
# Simpler: just put the pillars where the script expects: under the repo
# layout the script assumes. The script does:
#   join(__dirname, "..", "..", "..", "pillars")
# So from /app/scripts/extract-questions.mjs that becomes /pillars.
COPY pillars /pillars

# Build (extracts questions, runs typecheck, produces /app/dist).
RUN npm run build


# -----------------------------------------------------------------------------
# Stage 2 — nginx runtime with envsubst on container start
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# nginx config (uses envsubst on container start to inject runtime config)
COPY tool/v2/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY tool/v2/nginx/entrypoint.sh /docker-entrypoint.d/40-ldwa-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-ldwa-runtime-config.sh

# Built static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Runtime defaults — override at `docker run -e ...` or via docker-compose.
ENV LDWA_CANONICAL_URL="https://wellarchitected.launchdarkly.com" \
    LDWA_VERSION="v0.1"

EXPOSE 8080

# nginx:alpine entrypoint runs scripts in /docker-entrypoint.d/, then exec's CMD.
CMD ["nginx", "-g", "daemon off;"]
