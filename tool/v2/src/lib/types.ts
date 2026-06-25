// ============================================================================
// Question bank types (consumed by data/questions.generated.ts)
// ============================================================================

export type Pillar = {
  key: string;
  name: string;
  short: string;
  count: number;
};

export type Question = {
  id: string;
  pillarKey: string;
  section: string;
  question: string;
  probe?: string;
  criteria: {
    high?: string;
    medium?: string;
    none?: string;
  };
};

// ============================================================================
// Review state types (persisted to localStorage)
// ============================================================================

export type RiskLevel = "high" | "medium" | "none";

export type QuestionResponse = {
  questionId: string;
  answer: string;
  evidence: string;
  riskLevel: RiskLevel | null;
  improvementIdea: string;
};

export type ImprovementItem = {
  id: string;
  description: string;
  owner: string;
  effort: "S" | "M" | "L" | "XL" | null;
  risk: "high" | "medium" | null;
  targetDate: string; // ISO date or freeform
  status: "not-started" | "in-progress" | "blocked" | "done";
};

export type RiskAccepted = {
  finding: string;
  rationale: string;
  reReviewTrigger: string;
};

export type Review = {
  id: string;
  createdAt: string;
  updatedAt: string;
  // System framing
  systemName: string;
  systemDescription: string;
  systemOwner: string;
  reviewers: string;
  scribe: string;
  executiveSponsor: string;
  reReviewDate: string;
  // Scope
  inScopePillars: string[];
  inScopeCapabilities: string[];
  // Findings
  responses: Record<string, QuestionResponse>;
  // Outputs
  improvements: ImprovementItem[];
  risksAccepted: RiskAccepted[];
  notes: string;
};

// ============================================================================
// Capabilities (in-scope checklist)
// ============================================================================

export const CAPABILITIES = [
  "Feature flags",
  "Contexts & segments",
  "Release Pipelines",
  "Guarded Releases",
  "AI Configs",
  "Experiments",
  "Relay Proxy",
  "Edge SDK / edge delivery",
  "Code References",
  "Audit Log / RBAC / Teams",
  "Guardian Edition workflows",
  "Federal offering",
  "LaunchDarkly Observability",
  "Data Export",
] as const;
