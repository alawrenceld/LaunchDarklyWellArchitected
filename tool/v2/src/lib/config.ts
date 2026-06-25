// Runtime configuration. Populated by nginx envsubst in container; falls
// back to sensible defaults in local dev.

const raw = typeof window !== "undefined" ? window.__LDWA_CONFIG__ : undefined;

function isTemplated(v: string | undefined): boolean {
  // The index.html template uses __LDWA_FOO__ placeholders. If envsubst
  // didn't replace them (e.g., in local dev served by Vite directly), treat
  // as unset.
  return !v || /^__LDWA_/.test(v);
}

export const CONFIG = {
  canonicalUrl: isTemplated(raw?.canonicalUrl)
    ? "https://wellarchitected.launchdarkly.com"
    : (raw!.canonicalUrl as string),
  version: isTemplated(raw?.version) ? "v0.1-dev" : (raw!.version as string),
};
