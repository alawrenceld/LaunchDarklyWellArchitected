import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { QUESTIONS } from "../data/questions.generated";

export function AppShell({ children }: { children: ReactNode }) {
  const { review, reset } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const onPrintLayout = location.pathname === "/summary";

  const inScopeIds = new Set(
    QUESTIONS.filter((q) => review?.inScopePillars.includes(q.pillarKey)).map((q) => q.id)
  );
  const answeredCount = review
    ? Object.values(review.responses).filter(
        (r) => inScopeIds.has(r.questionId) && r.riskLevel !== null
      ).length
    : 0;
  const total = inScopeIds.size;

  function handleStartOver() {
    if (!confirm("Discard the current review and start over? This cannot be undone.")) return;
    reset();
    navigate("/");
  }

  return (
    <div className={`shell ${onPrintLayout ? "shell--print-ready" : ""}`}>
      <header className="topbar no-print">
        <div className="topbar__inner">
          <Link to="/" className="topbar__brand">
            <span className="topbar__brand-name">LaunchDarkly</span>
            <span className="topbar__brand-arrow" aria-hidden>
              →
            </span>
            <span className="topbar__brand-product">Well-Architected · Review</span>
          </Link>

          {review && review.systemName && (
            <div className="topbar__review">
              <span className="topbar__review-label">Reviewing</span>
              <span className="topbar__review-system">{review.systemName}</span>
              {total > 0 && (
                <span className="topbar__review-progress">
                  <span className="mono">{answeredCount}</span>
                  <span className="topbar__sep">/</span>
                  <span className="mono">{total}</span>
                  <span className="topbar__progress-label">answered</span>
                </span>
              )}
            </div>
          )}

          <nav className="topbar__nav">
            {review && (
              <>
                <Link
                  to="/workbook"
                  className={`nav-link ${location.pathname === "/workbook" ? "is-active" : ""}`}
                >
                  Workbook
                </Link>
                <Link
                  to="/summary"
                  className={`nav-link ${location.pathname === "/summary" ? "is-active" : ""}`}
                >
                  Summary
                </Link>
                <button className="link-button" onClick={handleStartOver}>
                  Start over
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main">{children}</main>

      <footer className="footer no-print">
        <div className="footer__inner">
          <span>
            <span className="mono">CC BY 4.0</span>{" "}
            <a href="https://github.com/alawrenceld/LaunchDarklyWellArchitected" target="_blank" rel="noreferrer">
              github.com/alawrenceld/LaunchDarklyWellArchitected
            </a>
          </span>
          <span className="mono footer__version">LDWA Review Tool · v0.1</span>
        </div>
      </footer>
    </div>
  );
}
