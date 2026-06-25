import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { PILLARS } from "../data/questions.generated";
import { CAPABILITIES } from "../lib/types";

export function NewReviewPage() {
  const { review, startNew, updateMeta } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!review) startNew();
  }, [review, startNew]);

  if (!review) return null;
  const r = review; // narrow once

  function togglePillar(key: string) {
    const set = new Set(r.inScopePillars);
    if (set.has(key)) set.delete(key);
    else set.add(key);
    updateMeta({ inScopePillars: Array.from(set) });
  }

  function toggleCapability(name: string) {
    const set = new Set(r.inScopeCapabilities);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    updateMeta({ inScopeCapabilities: Array.from(set) });
  }

  const canProceed = review.systemName.trim() && review.inScopePillars.length > 0;

  return (
    <div className="page page--new">
      <header className="page-head">
        <p className="eyebrow">Step 01 / Frame the system</p>
        <h1>Start a review</h1>
        <p className="page-head__lede">
          Fill in what you can. You can always edit this later — what matters is naming the system
          and picking the pillars in scope.
        </p>
      </header>

      <section className="form-section">
        <p className="eyebrow eyebrow--section">System</p>
        <div className="form-grid">
          <label className="field field--span-2">
            <span className="field__label">System name</span>
            <input
              type="text"
              value={review.systemName}
              onChange={(e) => updateMeta({ systemName: e.target.value })}
              placeholder="e.g., Checkout Platform"
              autoFocus
            />
          </label>
          <label className="field field--span-2">
            <span className="field__label">
              One-paragraph description
              <span className="field__hint">What does this system do? How is LD involved?</span>
            </span>
            <textarea
              rows={3}
              value={review.systemDescription}
              onChange={(e) => updateMeta({ systemDescription: e.target.value })}
              placeholder="The Checkout Platform powers our purchase flow across web and mobile. We use LaunchDarkly for…"
            />
          </label>
          <label className="field">
            <span className="field__label">System owner</span>
            <input
              type="text"
              value={review.systemOwner}
              onChange={(e) => updateMeta({ systemOwner: e.target.value })}
              placeholder="Name + team"
            />
          </label>
          <label className="field">
            <span className="field__label">Reviewer(s)</span>
            <input
              type="text"
              value={review.reviewers}
              onChange={(e) => updateMeta({ reviewers: e.target.value })}
              placeholder="Names"
            />
          </label>
          <label className="field">
            <span className="field__label">Scribe</span>
            <input
              type="text"
              value={review.scribe}
              onChange={(e) => updateMeta({ scribe: e.target.value })}
              placeholder="Name"
            />
          </label>
          <label className="field">
            <span className="field__label">Executive sponsor</span>
            <input
              type="text"
              value={review.executiveSponsor}
              onChange={(e) => updateMeta({ executiveSponsor: e.target.value })}
              placeholder="Optional"
            />
          </label>
          <label className="field">
            <span className="field__label">Target re-review date</span>
            <input
              type="date"
              value={review.reReviewDate}
              onChange={(e) => updateMeta({ reReviewDate: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="form-section">
        <p className="eyebrow eyebrow--section">Pillars in scope</p>
        <p className="form-section__lede">
          Pick the pillars relevant to this system. Skip pillars that don't fit — a review that
          pretends every pillar applies is a review that gets nothing done.
        </p>
        <div className="check-grid">
          {PILLARS.map((p) => {
            const checked = review.inScopePillars.includes(p.key);
            return (
              <label
                key={p.key}
                className={`check-card ${checked ? "is-checked" : ""}`}
                onClick={(e) => {
                  // Only handle the row click if the click target isn't the
                  // checkbox itself (the native onChange handles that).
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                    e.preventDefault();
                    togglePillar(p.key);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePillar(p.key)}
                />
                <div className="check-card__body">
                  <span className="check-card__title">{p.name}</span>
                  <span className="check-card__meta mono">{p.count} questions</span>
                </div>
              </label>
            );
          })}
        </div>
      </section>

      <section className="form-section">
        <p className="eyebrow eyebrow--section">LaunchDarkly capabilities in scope</p>
        <p className="form-section__lede">
          Pick the capabilities this system actually uses. Helps the workbook focus questions and
          informs the improvement plan's framing. Optional.
        </p>
        <div className="capabilities-grid">
          {CAPABILITIES.map((cap) => {
            const checked = review.inScopeCapabilities.includes(cap);
            return (
              <label key={cap} className={`tag-check ${checked ? "is-checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCapability(cap)}
                />
                <span>{cap}</span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="form-actions">
        <button
          className="btn btn--primary"
          disabled={!canProceed}
          onClick={() => navigate("/workbook")}
        >
          Begin workbook →
        </button>
        {!canProceed && (
          <p className="form-actions__hint">
            Name the system and pick at least one pillar to proceed.
          </p>
        )}
      </div>
    </div>
  );
}
