import { Link, Navigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { PILLARS, QUESTIONS } from "../data/questions.generated";
import type { RiskLevel } from "../lib/types";

export function SummaryPage() {
  const { review, addImprovement, updateImprovement, removeImprovement, updateMeta } = useStore();

  if (!review) return <Navigate to="/" replace />;

  const inScopePillarKeys = new Set(review.inScopePillars);
  const inScopeQuestions = QUESTIONS.filter((q) => inScopePillarKeys.has(q.pillarKey));

  // Findings by risk level
  const findingsByRisk = {
    high: inScopeQuestions.filter((q) => review.responses[q.id]?.riskLevel === "high"),
    medium: inScopeQuestions.filter((q) => review.responses[q.id]?.riskLevel === "medium"),
    none: inScopeQuestions.filter((q) => review.responses[q.id]?.riskLevel === "none"),
  };
  const unanswered = inScopeQuestions.filter((q) => !review.responses[q.id]?.riskLevel);

  // Per-pillar summary
  const pillarSummaries = PILLARS.filter((p) => inScopePillarKeys.has(p.key)).map((p) => {
    const qs = inScopeQuestions.filter((q) => q.pillarKey === p.key);
    return {
      ...p,
      high: qs.filter((q) => review.responses[q.id]?.riskLevel === "high").length,
      medium: qs.filter((q) => review.responses[q.id]?.riskLevel === "medium").length,
      none: qs.filter((q) => review.responses[q.id]?.riskLevel === "none").length,
      unanswered: qs.filter((q) => !review.responses[q.id]?.riskLevel).length,
      total: qs.length,
    };
  });

  // Maturity rating
  const maturity = computeMaturity(findingsByRisk.high.length, findingsByRisk.medium.length);

  return (
    <div className="page page--summary">
      <header className="summary-head">
        <p className="eyebrow">Summary &amp; improvement plan</p>
        <h1>{review.systemName || "Untitled review"}</h1>
        {review.systemDescription && (
          <p className="summary-head__description">{review.systemDescription}</p>
        )}
        <dl className="summary-head__meta">
          <div>
            <dt>Owner</dt>
            <dd>{review.systemOwner || "—"}</dd>
          </div>
          <div>
            <dt>Reviewers</dt>
            <dd>{review.reviewers || "—"}</dd>
          </div>
          <div>
            <dt>Reviewed</dt>
            <dd>{formatDate(review.updatedAt)}</dd>
          </div>
          <div>
            <dt>Re-review</dt>
            <dd>{review.reReviewDate || "—"}</dd>
          </div>
        </dl>

        <div className="summary-actions no-print">
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            Export to PDF
          </button>
          <Link to="/workbook" className="btn btn--ghost">
            Back to workbook
          </Link>
        </div>
      </header>

      <section className="summary-section">
        <p className="eyebrow eyebrow--section">Overall picture</p>
        <div className="overall">
          <div className="overall__maturity">
            <span className="eyebrow">Maturity</span>
            <h2 className="overall__maturity-value">{maturity.label}</h2>
            <p className="overall__maturity-desc">{maturity.description}</p>
          </div>
          <div className="overall__counts">
            <CountTile risk="high" count={findingsByRisk.high.length} />
            <CountTile risk="medium" count={findingsByRisk.medium.length} />
            <CountTile risk="none" count={findingsByRisk.none.length} />
            <CountTile risk="unanswered" count={unanswered.length} />
          </div>
        </div>
      </section>

      <section className="summary-section">
        <p className="eyebrow eyebrow--section">By pillar</p>
        <table className="pillar-table">
          <thead>
            <tr>
              <th>Pillar</th>
              <th className="mono right">HIGH</th>
              <th className="mono right">MEDIUM</th>
              <th className="mono right">NONE</th>
              <th className="mono right">Unanswered</th>
            </tr>
          </thead>
          <tbody>
            {pillarSummaries.map((p) => (
              <tr key={p.key}>
                <td>{p.name}</td>
                <td className="mono right">{count(p.high, "high")}</td>
                <td className="mono right">{count(p.medium, "medium")}</td>
                <td className="mono right">{count(p.none, "none")}</td>
                <td className="mono right">{count(p.unanswered, "unanswered")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {findingsByRisk.high.length > 0 && (
        <section className="summary-section">
          <p className="eyebrow eyebrow--section">High-risk findings</p>
          <ul className="findings">
            {findingsByRisk.high.map((q) => (
              <li key={q.id} className="finding finding--high">
                <header className="finding__head">
                  <span className="mono finding__id">{q.id}</span>
                  <span className="finding__pillar mono">
                    {PILLARS.find((p) => p.key === q.pillarKey)?.short}
                  </span>
                </header>
                <h4 className="finding__question">{q.question}</h4>
                {review.responses[q.id]?.evidence && (
                  <p className="finding__evidence">{review.responses[q.id].evidence}</p>
                )}
                {review.responses[q.id]?.improvementIdea && (
                  <p className="finding__improvement">
                    <span className="finding__improvement-label mono">Idea ·</span>{" "}
                    {review.responses[q.id].improvementIdea}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {findingsByRisk.medium.length > 0 && (
        <section className="summary-section">
          <p className="eyebrow eyebrow--section">Medium-risk findings</p>
          <ul className="findings findings--compact">
            {findingsByRisk.medium.map((q) => (
              <li key={q.id} className="finding finding--medium finding--inline">
                <span className="mono finding__id">{q.id}</span>
                <span className="finding__pillar mono">
                  {PILLARS.find((p) => p.key === q.pillarKey)?.short}
                </span>
                <span className="finding__question">{q.question}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="summary-section">
        <p className="eyebrow eyebrow--section">Improvement plan</p>
        <p className="form-section__lede">
          Pick the items the team will actually do. Sort by risk × inverse effort — high-risk,
          low-effort items go to the top.
        </p>

        {review.improvements.length === 0 ? (
          <div className="empty">
            <p>No items yet.</p>
          </div>
        ) : (
          <table className="improvement-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Owner</th>
                <th className="mono">Effort</th>
                <th className="mono">Risk</th>
                <th>Target</th>
                <th className="mono">Status</th>
                <th className="no-print" />
              </tr>
            </thead>
            <tbody>
              {review.improvements.map((it, i) => (
                <tr key={it.id}>
                  <td className="mono">{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <input
                      className="cell-input"
                      value={it.description}
                      onChange={(e) => updateImprovement(it.id, { description: e.target.value })}
                      placeholder="A specific change"
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={it.owner}
                      onChange={(e) => updateImprovement(it.id, { owner: e.target.value })}
                      placeholder="Name"
                    />
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={it.effort ?? ""}
                      onChange={(e) =>
                        updateImprovement(it.id, {
                          effort: (e.target.value || null) as any,
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={it.risk ?? ""}
                      onChange={(e) =>
                        updateImprovement(it.id, {
                          risk: (e.target.value || null) as any,
                        })
                      }
                    >
                      <option value="">—</option>
                      <option value="high">HIGH</option>
                      <option value="medium">MED</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      type="date"
                      value={it.targetDate}
                      onChange={(e) => updateImprovement(it.id, { targetDate: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      className="cell-select"
                      value={it.status}
                      onChange={(e) =>
                        updateImprovement(it.id, { status: e.target.value as any })
                      }
                    >
                      <option value="not-started">Not started</option>
                      <option value="in-progress">In progress</option>
                      <option value="blocked">Blocked</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="no-print">
                    <button
                      type="button"
                      className="row-delete"
                      onClick={() => removeImprovement(it.id)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="improvement-actions no-print">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => addImprovement({})}
          >
            + Add item
          </button>
          {findingsByRisk.high.length > 0 && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                findingsByRisk.high.forEach((q) => {
                  const idea = review.responses[q.id]?.improvementIdea;
                  addImprovement({
                    description: idea || `Address ${q.id}: ${q.question}`,
                    risk: "high",
                  });
                });
              }}
            >
              Seed from all high-risk findings
            </button>
          )}
        </div>
      </section>

      <section className="summary-section">
        <p className="eyebrow eyebrow--section">Notes</p>
        <textarea
          rows={4}
          className="notes"
          value={review.notes}
          onChange={(e) => updateMeta({ notes: e.target.value })}
          placeholder="Anything else worth recording — open questions, follow-ups, ideas for next time."
        />
      </section>

      <footer className="summary-foot">
        <p className="mono">
          LDWA · v0.1 · Generated {formatDate(new Date().toISOString())}
        </p>
      </footer>
    </div>
  );
}

function CountTile({
  risk,
  count,
}: {
  risk: RiskLevel | "unanswered";
  count: number;
}) {
  const labels: Record<typeof risk, string> = {
    high: "HIGH",
    medium: "MEDIUM",
    none: "NONE",
    unanswered: "UNANSWERED",
  };
  return (
    <div className={`count-tile count-tile--${risk}`}>
      <span className="count-tile__number mono">{count}</span>
      <span className="count-tile__label mono">{labels[risk]}</span>
    </div>
  );
}

function count(n: number, kind: "high" | "medium" | "none" | "unanswered") {
  if (n === 0) return "—";
  return <span className={`pill pill--${kind}`}>{n}</span>;
}

function computeMaturity(high: number, medium: number) {
  if (high >= 3) {
    return {
      label: "Foundational",
      description:
        "Multiple high-risk findings. The team has core practices to put in place before optimization.",
    };
  }
  if (high >= 1) {
    return {
      label: "Managed",
      description:
        "A small number of high-risk findings, several medium-risk. The team has the basics; specific gaps are being closed.",
    };
  }
  if (medium >= 4) {
    return {
      label: "Effective",
      description:
        "No high-risk findings; modest medium-risk findings. The team operates well; improvements are incremental.",
    };
  }
  return {
    label: "Exemplary",
    description:
      "No high-risk findings; few medium-risk; multiple notable strengths. The team's practice is reference-worthy.",
  };
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
