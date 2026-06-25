/// <reference types="vite/client" />

interface Window {
  // Runtime config injected by nginx at container start.
  __LDWA_CONFIG__?: {
    canonicalUrl?: string;
    version?: string;
  };
}
