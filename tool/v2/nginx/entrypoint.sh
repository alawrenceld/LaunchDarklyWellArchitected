#!/bin/sh
# Injects runtime config into index.html using the LDWA_* env vars.
# Runs once per container start, before nginx is invoked.
#
# The index.html ships with literal __LDWA_FOO__ placeholders; this script
# replaces them with the current values of LDWA_CANONICAL_URL and
# LDWA_VERSION. If a value is unset, the placeholder stays — the app's
# config.ts treats unreplaced placeholders as "unset" and falls back.

set -eu

HTML="/usr/share/nginx/html/index.html"

if [ ! -f "$HTML" ]; then
  echo "[ldwa-runtime-config] $HTML not found; skipping"
  exit 0
fi

CANONICAL="${LDWA_CANONICAL_URL:-}"
VERSION="${LDWA_VERSION:-}"

echo "[ldwa-runtime-config] LDWA_CANONICAL_URL=$CANONICAL"
echo "[ldwa-runtime-config] LDWA_VERSION=$VERSION"

# In-place substitution. Using sed instead of envsubst because envsubst
# would also try to expand $ inside other parts of the HTML.
sed -i.bak \
  -e "s|__LDWA_CANONICAL_URL__|${CANONICAL}|g" \
  -e "s|__LDWA_VERSION__|${VERSION}|g" \
  "$HTML"
rm -f "${HTML}.bak"

echo "[ldwa-runtime-config] index.html updated"
