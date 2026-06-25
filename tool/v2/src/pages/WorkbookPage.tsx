import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { PILLARS, QUESTIONS_BY_PILLAR } from "../data/questions.generated";
import { QuestionCard } from "../components/QuestionCard";
import type { RiskLevel } from "../lib/types";

export function WorkbookPage() {
  const { review } = useStore();
  const [activePillar, setActivePillar] = useState<string | null>(null);

  const inScopePillars = useMemo(
    () => PILLARS.filter((p) => review?.inScopePillars.includes(p.key)),
    [review]
  );

  useEffect(() => {
    if (inScopePillars.length > 0 && !activePillar) {
      setActivePillar(inScopePillars[0].key);
    }
  }, [inScopePillars, activePillar]);

  if (!review) return <Navigate to="/" replace />;
  if (!review.systemName || review.inScopePillars.length === 0) {
    return <Navigate to="/new" replace />;
  }

  // Counts by pillar
  const pillarStats = inScopePillars.map((p) => {
    const qs = QUESTIONS_BY_PILLAR[p.key] ?? [];
    const responded = qs.filter((q) => review.responses[q.id]?.riskLevel != null);
    return {
      ...p,
      total: qs.length,
      answered: responded.length,
      high: responded.filter((q) => review.responses[q.id]?.riskLevel === "high").length,
      medium: responded.filter((q) => review.responses[q.id]?.riskLevel === "medium").length,
      none: responded.filter((q) => review.responses[q.id]?.riskLevel === "none").length,
    };
  });

  const activeQuestions =
    activePillar !== null ? QUESTIONS_BY_PILLAR[activePillar] ?? [] : [];

  const activePillarMeta = PILLARS.find((p) => p.key === activePillar);

  return (
    <div className="workbook">
      <aside className="workbook__nav no-print" aria-label="Pillar navigation">
        <p className="eyebrow eyebrow--section">Pillars in scope</p>
        <ul className="pillar-nav">
          {pillarStats.map((p) => (
            <li key={p.key}>
              <button
                type="button"
                className={`pillar-nav__item ${activePillar === p.key ? "is-active" : ""}`}
                onClick={() => setActivePillar(p.key)}
              >
                <span className="pillar-nav__name">{p.name}</span>
                <span className="pillar-nav__counts mono">
                  {p.answered}
                  <span className="pillar-nav__sep">/</span>
                  {p.total}
                </span>
                {(p.high > 0 || p.medium > 0) && (
                  <span className="pillar-nav__risks">
                    {p.high > 0 && (
                      <span className="dot dot--high" title={`${p.high} high-risk findings`}>
                        {p.high}
                      </span>
                    )}
                    {p.medium > 0 && (
                      <span
                        className="dot dot--medium"
                        title={`${p.medium} medium-risk findings`}
                      >
                        {p.medium}
                      </span>
                    )}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="workbook__nav-divider" />
        <Link to="/summary" className="workbook__nav-summary">
          → Summary &amp; improvement plan
        </Link>
      </aside>

      <div className="workbook__pages">
        {activePillarMeta && (
          <header className="workbook__pillar-head">
            <p className="eyebrow">{activePillarMeta.short}</p>
            <h1 className="workbook__pillar-title">{activePillarMeta.name}</h1>
            <p className="workbook__pillar-meta mono">
              {activeQuestions.length} questions ·{" "}
              <a
                href={`https://github.com/alawrenceld/LaunchDarklyWellArchitected/tree/main/pillars/${activePillarMeta.key}`}
                target="_blank"
                rel="noreferrer"
              >
                view pillar on GitHub
              </a>
            </p>
          </header>
        )}

        <SectionedQuestions questions={activeQuestions} pillarShort={activePillarMeta?.short ?? ""} />

        {activePillarMeta && (
          <div className="workbook__nav-buttons no-print">
            <PillarNavButtons
              pillars={inScopePillars.map((p) => p.key)}
              current={activePillarMeta.key}
              onNav={setActivePillar}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SectionedQuestions({
  questions,
  pillarShort,
}: {
  questions: ReturnType<typeof Object>;
  pillarShort: string;
}) {
  const sections: { name: string; items: typeof questions }[] = [];
  let lastSection: string | null = null;
  for (const q of questions as any[]) {
    if (q.section !== lastSection) {
      sections.push({ name: q.section, items: [] as any[] });
      lastSection = q.section;
    }
    (sections[sections.length - 1].items as any[]).push(q);
  }

  return (
    <>
      {sections.map((section) => (
        <section key={section.name} className="workbook__section">
          <h2 className="workbook__section-heading">
            <span className="workbook__section-rule" aria-hidden />
            <span className="workbook__section-name">{section.name}</span>
          </h2>
          {(section.items as any[]).map((q) => (
            <QuestionCard key={q.id} question={q} pillarShort={pillarShort} />
          ))}
        </section>
      ))}
    </>
  );
}

function PillarNavButtons({
  pillars,
  current,
  onNav,
}: {
  pillars: string[];
  current: string;
  onNav: (key: string) => void;
}) {
  const idx = pillars.indexOf(current);
  const prev = idx > 0 ? pillars[idx - 1] : null;
  const next = idx < pillars.length - 1 ? pillars[idx + 1] : null;
  const prevPillar = prev ? PILLARS.find((p) => p.key === prev) : null;
  const nextPillar = next ? PILLARS.find((p) => p.key === next) : null;

  return (
    <div className="pillar-nav-buttons">
      {prevPillar ? (
        <button
          type="button"
          className="pillar-nav-button pillar-nav-button--prev"
          onClick={() => {
            onNav(prevPillar.key);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="mono">←</span>
          <span className="pillar-nav-button__label">
            <span className="eyebrow">Previous</span>
            <span>{prevPillar.name}</span>
          </span>
        </button>
      ) : (
        <span />
      )}
      {nextPillar ? (
        <button
          type="button"
          className="pillar-nav-button pillar-nav-button--next"
          onClick={() => {
            onNav(nextPillar.key);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="pillar-nav-button__label pillar-nav-button__label--right">
            <span className="eyebrow">Next</span>
            <span>{nextPillar.name}</span>
          </span>
          <span className="mono">→</span>
        </button>
      ) : (
        <Link to="/summary" className="pillar-nav-button pillar-nav-button--next">
          <span className="pillar-nav-button__label pillar-nav-button__label--right">
            <span className="eyebrow">Done answering</span>
            <span>Summary &amp; improvement plan</span>
          </span>
          <span className="mono">→</span>
        </Link>
      )}
    </div>
  );
}
