// Lightweight review-state store. Single active review at a time, persisted
// to localStorage. No backend; everything lives in the browser.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  ImprovementItem,
  QuestionResponse,
  Review,
  RiskAccepted,
  RiskLevel,
} from "./types";

const STORAGE_KEY = "ldwa.review.v1";

function emptyReview(): Review {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    systemName: "",
    systemDescription: "",
    systemOwner: "",
    reviewers: "",
    scribe: "",
    executiveSponsor: "",
    reReviewDate: "",
    inScopePillars: [],
    inScopeCapabilities: [],
    responses: {},
    improvements: [],
    risksAccepted: [],
    notes: "",
  };
}

function loadReview(): Review | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Review;
  } catch {
    return null;
  }
}

function saveReview(review: Review | null) {
  if (review === null) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(review));
}

// ----------------------------------------------------------------------------
// Context API
// ----------------------------------------------------------------------------

type StoreApi = {
  review: Review | null;
  startNew: () => Review;
  reset: () => void;
  updateMeta: (patch: Partial<Review>) => void;
  setResponse: (questionId: string, patch: Partial<QuestionResponse>) => void;
  setRisk: (questionId: string, risk: RiskLevel | null) => void;
  addImprovement: (item?: Partial<ImprovementItem>) => void;
  updateImprovement: (id: string, patch: Partial<ImprovementItem>) => void;
  removeImprovement: (id: string) => void;
  addRiskAccepted: (item?: Partial<RiskAccepted>) => void;
  updateRiskAccepted: (idx: number, patch: Partial<RiskAccepted>) => void;
  removeRiskAccepted: (idx: number) => void;
};

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [review, setReviewState] = useState<Review | null>(() => loadReview());

  // Auto-persist whenever state changes
  useEffect(() => {
    saveReview(review);
  }, [review]);

  const setReview = useCallback((updater: (r: Review) => Review) => {
    setReviewState((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      next.updatedAt = new Date().toISOString();
      return next;
    });
  }, []);

  const startNew = useCallback(() => {
    const r = emptyReview();
    setReviewState(r);
    return r;
  }, []);

  const reset = useCallback(() => {
    setReviewState(null);
  }, []);

  const updateMeta: StoreApi["updateMeta"] = useCallback(
    (patch) => setReview((r) => ({ ...r, ...patch })),
    [setReview]
  );

  const setResponse: StoreApi["setResponse"] = useCallback(
    (questionId, patch) =>
      setReview((r) => {
        const existing: QuestionResponse = r.responses[questionId] ?? {
          questionId,
          answer: "",
          evidence: "",
          riskLevel: null,
          improvementIdea: "",
        };
        return {
          ...r,
          responses: { ...r.responses, [questionId]: { ...existing, ...patch } },
        };
      }),
    [setReview]
  );

  const setRisk: StoreApi["setRisk"] = useCallback(
    (questionId, risk) => setResponse(questionId, { riskLevel: risk }),
    [setResponse]
  );

  const addImprovement: StoreApi["addImprovement"] = useCallback(
    (patch) =>
      setReview((r) => ({
        ...r,
        improvements: [
          ...r.improvements,
          {
            id: crypto.randomUUID(),
            description: "",
            owner: "",
            effort: null,
            risk: null,
            targetDate: "",
            status: "not-started",
            ...patch,
          },
        ],
      })),
    [setReview]
  );

  const updateImprovement: StoreApi["updateImprovement"] = useCallback(
    (id, patch) =>
      setReview((r) => ({
        ...r,
        improvements: r.improvements.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      })),
    [setReview]
  );

  const removeImprovement: StoreApi["removeImprovement"] = useCallback(
    (id) =>
      setReview((r) => ({
        ...r,
        improvements: r.improvements.filter((it) => it.id !== id),
      })),
    [setReview]
  );

  const addRiskAccepted: StoreApi["addRiskAccepted"] = useCallback(
    (patch) =>
      setReview((r) => ({
        ...r,
        risksAccepted: [
          ...r.risksAccepted,
          { finding: "", rationale: "", reReviewTrigger: "", ...patch },
        ],
      })),
    [setReview]
  );

  const updateRiskAccepted: StoreApi["updateRiskAccepted"] = useCallback(
    (idx, patch) =>
      setReview((r) => ({
        ...r,
        risksAccepted: r.risksAccepted.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
      })),
    [setReview]
  );

  const removeRiskAccepted: StoreApi["removeRiskAccepted"] = useCallback(
    (idx) =>
      setReview((r) => ({
        ...r,
        risksAccepted: r.risksAccepted.filter((_, i) => i !== idx),
      })),
    [setReview]
  );

  const api = useMemo<StoreApi>(
    () => ({
      review,
      startNew,
      reset,
      updateMeta,
      setResponse,
      setRisk,
      addImprovement,
      updateImprovement,
      removeImprovement,
      addRiskAccepted,
      updateRiskAccepted,
      removeRiskAccepted,
    }),
    [
      review,
      startNew,
      reset,
      updateMeta,
      setResponse,
      setRisk,
      addImprovement,
      updateImprovement,
      removeImprovement,
      addRiskAccepted,
      updateRiskAccepted,
      removeRiskAccepted,
    ]
  );

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
