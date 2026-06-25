// Render one-pager.html to PDF using headless Chromium.
// Produces a single-page US Letter PDF with LaunchDarkly brand assets embedded.
//
// Prereqs (from this directory):
//   npm install
//   npx playwright install chromium
// Run:
//   node render.mjs
// Output:
//   build/launchdarkly-well-architected-one-pager.pdf

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "one-pager.html");
const pdfPath = path.join(__dirname, "build", "launchdarkly-well-architected-one-pager.pdf");

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1224, height: 1584 }, // 8.5in × 11in at 144dpi viewport
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });

// Wait for fonts to be ready before rendering — otherwise the PDF can
// render with fallback fonts.
await page.evaluate(() => document.fonts.ready);

// Print-only style fixes: the headline uses a gradient-text effect that
// Chromium's PDF engine renders incorrectly in some pipelines. Fall back
// to a solid LD blue in print so the headline reads cleanly.
await page.addStyleTag({ content: `
  @media print {
    h1 {
      background: none !important;
      -webkit-background-clip: initial !important;
      background-clip: initial !important;
      color: var(--ld-blue) !important;
    }
  }
`});

await page.pdf({
  path: pdfPath,
  format: "Letter",
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
});

await browser.close();
console.log(`✓ Rendered ${pdfPath}`);
