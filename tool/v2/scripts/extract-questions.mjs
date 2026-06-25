#!/usr/bin/env node
// Extracts review questions from the framework's pillar markdown files
// into a structured TypeScript data file the app can consume.
//
// Source: ../../../pillars/*/review-questions.md
// Output: ../src/data/questions.generated.ts
//
// Question format expected in the source markdown:
//
//   ## <section heading>
//
//   ### <ID>. <question text on one or more lines until blank>
//   <optional prose, "Probe:" lines, etc.>
//   - **High Risk** if <criterion>
//   - **Medium Risk** if <criterion>
//   - **None** if <criterion>
//
// Anything before the first ### is treated as the pillar intro and skipped.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..", "..");
const PILLARS_DIR = join(REPO_ROOT, "pillars");
const OUTPUT = join(__dirname, "..", "src", "data", "questions.generated.ts");

// Map of pillar directory name → { key, displayName, shortName }
// Phase 1 + Phase 2 pillars only for now; lenses can be added later.
const PILLARS = [
  { dir: "safe-release", key: "safe-release", name: "Safe Release & Progressive Delivery", short: "Safe Release" },
  { dir: "operational-excellence", key: "operational-excellence", name: "Operational Excellence", short: "OpEx" },
  { dir: "security-and-compliance", key: "security-and-compliance", name: "Security & Compliance", short: "Security" },
  { dir: "reliability", key: "reliability", name: "Reliability & Resilience", short: "Reliability" },
  { dir: "governance", key: "governance", name: "Governance & Artifact Lifecycle", short: "Governance" },
  { dir: "experimentation", key: "experimentation", name: "Experimentation & Measurement", short: "Experimentation" },
  { dir: "performance-and-cost", key: "performance-and-cost", name: "Performance & Cost Efficiency", short: "Performance & Cost" },
];

/**
 * Parse one review-questions.md into a list of questions.
 */
function parseQuestions(markdown, pillarKey) {
  const questions = [];
  const lines = markdown.split("\n");

  let currentSection = null;
  let currentQuestion = null;

  const flush = () => {
    if (currentQuestion) {
      questions.push(currentQuestion);
      currentQuestion = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Section header (## heading)
    if (/^## /.test(line) && !/^### /.test(line)) {
      flush();
      currentSection = line.replace(/^## /, "").trim();
      continue;
    }

    // Question header (### ID. text)
    const qMatch = line.match(/^### ([A-Z]+(?:-[A-Z]+)?-Q?\d+(?:\.\d+)?)\.\s+(.+)$/);
    if (qMatch) {
      flush();
      currentQuestion = {
        id: qMatch[1],
        section: currentSection ?? "Uncategorized",
        question: qMatch[2].trim(),
        probe: undefined,
        criteria: { high: undefined, medium: undefined, none: undefined },
      };
      continue;
    }

    if (!currentQuestion) continue;

    // Probe line
    const probeMatch = line.match(/^Probe:\s*(.+)$/);
    if (probeMatch) {
      currentQuestion.probe = probeMatch[1].trim();
      continue;
    }

    // Risk criteria
    const highMatch = line.match(/^-\s+\*\*High Risk\*\*\s+(.+)$/);
    if (highMatch) {
      currentQuestion.criteria.high = highMatch[1].trim().replace(/\.$/, "");
      continue;
    }
    const mediumMatch = line.match(/^-\s+\*\*Medium Risk\*\*\s+(.+)$/);
    if (mediumMatch) {
      currentQuestion.criteria.medium = mediumMatch[1].trim().replace(/\.$/, "");
      continue;
    }
    const noneMatch = line.match(/^-\s+\*\*None\*\*\s+(.+)$/);
    if (noneMatch) {
      currentQuestion.criteria.none = noneMatch[1].trim().replace(/\.$/, "");
      continue;
    }

    // Multi-line question continuation: if we're still in the question line
    // (no criteria captured yet, no probe, no blank), treat as continuation
    const isBlank = /^\s*$/.test(line);
    const isProseLine = line && !line.startsWith("#") && !line.startsWith("-") && !line.startsWith("<");
    if (
      currentQuestion &&
      !currentQuestion.criteria.high &&
      !currentQuestion.criteria.medium &&
      !currentQuestion.criteria.none &&
      !currentQuestion.probe &&
      isProseLine &&
      !isBlank
    ) {
      // Append to question text if it's clearly a continuation
      // (not a "Probe:" line, not a bullet, not a heading)
      currentQuestion.question += " " + line.trim();
      continue;
    }
  }
  flush();

  return questions.map((q) => ({ ...q, pillarKey }));
}

async function main() {
  const allQuestions = [];
  const pillarSummaries = [];

  for (const pillar of PILLARS) {
    const path = join(PILLARS_DIR, pillar.dir, "review-questions.md");
    if (!existsSync(path)) {
      console.warn(`[skip] ${path} not found`);
      continue;
    }
    const md = await readFile(path, "utf-8");
    const qs = parseQuestions(md, pillar.key);
    console.log(`  ${pillar.name}: ${qs.length} questions`);
    allQuestions.push(...qs);
    pillarSummaries.push({ ...pillar, count: qs.length });
  }

  // Emit TypeScript data file
  const banner = `// AUTO-GENERATED by scripts/extract-questions.mjs.
// Do not edit by hand. Re-run \`npm run extract:questions\` after updating
// the pillar review-questions.md files in the framework.
`;

  const pillarsLiteral = pillarSummaries
    .map(
      (p) =>
        `  { key: ${JSON.stringify(p.key)}, name: ${JSON.stringify(p.name)}, short: ${JSON.stringify(p.short)}, count: ${p.count} }`
    )
    .join(",\n");

  const questionsLiteral = allQuestions
    .map((q) => {
      return `  {
    id: ${JSON.stringify(q.id)},
    pillarKey: ${JSON.stringify(q.pillarKey)},
    section: ${JSON.stringify(q.section)},
    question: ${JSON.stringify(q.question)},
    probe: ${q.probe ? JSON.stringify(q.probe) : "undefined"},
    criteria: {
      high: ${q.criteria.high ? JSON.stringify(q.criteria.high) : "undefined"},
      medium: ${q.criteria.medium ? JSON.stringify(q.criteria.medium) : "undefined"},
      none: ${q.criteria.none ? JSON.stringify(q.criteria.none) : "undefined"},
    },
  }`;
    })
    .join(",\n");

  const out = `${banner}
import type { Pillar, Question } from "../lib/types";

export const PILLARS: Pillar[] = [
${pillarsLiteral}
];

export const QUESTIONS: Question[] = [
${questionsLiteral}
];

export const QUESTIONS_BY_PILLAR: Record<string, Question[]> = PILLARS.reduce(
  (acc, p) => {
    acc[p.key] = QUESTIONS.filter((q) => q.pillarKey === p.key);
    return acc;
  },
  {} as Record<string, Question[]>
);
`;

  await writeFile(OUTPUT, out, "utf-8");
  console.log(`\n✓ Wrote ${allQuestions.length} questions across ${pillarSummaries.length} pillars to ${OUTPUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
