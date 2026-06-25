import { useState } from "react";
import type { Question, QuestionResponse } from "../lib/types";
import { useStore } from "../lib/store";
import { RiskPicker } from "./RiskPicker";

type Props = {
  question: Question;
  pillarShort: string;
};

export function QuestionCard({ question, pillarShort }: Props) {
  const { review, setResponse, setRisk } = useStore();
  const response: QuestionResponse = review!.responses[question.id] ?? {
    questionId: question.id,
    answer: "",
    evidence: "",
    riskLevel: null,
    improvementIdea: "",
  };
  const [criteriaOpen, setCriteriaOpen] = useState(false);

  return (
    <article
      id={`q-${question.id}`}
      className={`q-card ${response.riskLevel ? "is-answered" : ""} ${
        response.riskLevel ? `is-risk-${response.riskLevel}` : ""
      }`}
    >
      <header className="q-card__head">
        <span className="q-card__id mono">{question.id}</span>
        <span className="q-card__pillar mono">{pillarShort}</span>
        <span className="q-card__section">{question.section}</span>
      </header>

      <h3 className="q-card__question">{question.question}</h3>

      {question.probe && (
        <p className="q-card__probe">
          <span className="q-card__probe-label mono">Probe ·</span> {question.probe}
        </p>
      )}

      <div className="q-card__criteria">
        <button
          type="button"
          className="q-card__criteria-toggle link-button"
          onClick={() => setCriteriaOpen(!criteriaOpen)}
        >
          {criteriaOpen ? "Hide" : "Show"} risk criteria
        </button>
        {criteriaOpen && (
          <dl className="criteria">
            {question.criteria.high && (
              <>
                <dt className="mono criteria__level criteria__level--high">HIGH</dt>
                <dd>{question.criteria.high}.</dd>
              </>
            )}
            {question.criteria.medium && (
              <>
                <dt className="mono criteria__level criteria__level--medium">MEDIUM</dt>
                <dd>{question.criteria.medium}.</dd>
              </>
            )}
            {question.criteria.none && (
              <>
                <dt className="mono criteria__level criteria__level--none">NONE</dt>
                <dd>{question.criteria.none}.</dd>
              </>
            )}
          </dl>
        )}
      </div>

      <div className="q-card__fields">
        <label className="field">
          <span className="field__label">Answer + evidence</span>
          <textarea
            rows={3}
            value={response.evidence}
            onChange={(e) => setResponse(question.id, { evidence: e.target.value })}
            placeholder="What's the team's actual posture? Link to a doc, paste a config, describe the state."
          />
        </label>

        <div className="field">
          <span className="field__label">Risk level</span>
          <RiskPicker
            value={response.riskLevel}
            onChange={(next) => setRisk(question.id, next)}
          />
        </div>

        <label className="field">
          <span className="field__label">Improvement idea (optional)</span>
          <input
            type="text"
            value={response.improvementIdea}
            onChange={(e) =>
              setResponse(question.id, { improvementIdea: e.target.value })
            }
            placeholder="What would you fix? Captured to the improvement plan on the Summary."
          />
        </label>
      </div>
    </article>
  );
}
