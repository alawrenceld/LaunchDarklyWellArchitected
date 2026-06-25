import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { PILLARS } from "../data/questions.generated";

export function HomePage() {
  const { review, startNew } = useStore();
  const navigate = useNavigate();

  function handleStart() {
    if (!review) startNew();
    navigate("/new");
  }

  return (
    <div className="page page--home">
      <section className="hero">
        <p className="eyebrow">LDWA / Review Tool · v0.1</p>
        <h1 className="hero__title">
          Run a structured <span className="accent">LaunchDarkly Well-Architected</span> review.
        </h1>
        <p className="hero__lede">
          A guided assessment workbook for engineering teams. Walk a system through the framework's
          229 review questions across seven pillars, capture risk levels, and produce a prioritized
          improvement plan.
        </p>
        <div className="hero__actions">
          {review && review.systemName ? (
            <>
              <Link to="/workbook" className="btn btn--primary">
                Continue review of {review.systemName}
              </Link>
              <button onClick={handleStart} className="btn btn--ghost">
                Start a new review
              </button>
            </>
          ) : (
            <button onClick={handleStart} className="btn btn--primary">
              Start a review
            </button>
          )}
        </div>
      </section>

      <section className="how">
        <p className="eyebrow eyebrow--section">How the review works</p>
        <ol className="how__steps">
          <li>
            <span className="how__step-num mono">01</span>
            <div>
              <h3>Frame the system</h3>
              <p>
                Name the LD-managed system you're reviewing. Capture owner, reviewers, and the
                LaunchDarkly capabilities in scope.
              </p>
            </div>
          </li>
          <li>
            <span className="how__step-num mono">02</span>
            <div>
              <h3>Walk the questions</h3>
              <p>
                Work through the in-scope pillars. For each question, answer with evidence and
                assign a risk level — <span className="mono">HIGH</span>,{" "}
                <span className="mono">MEDIUM</span>, or <span className="mono">NONE</span>.
              </p>
            </div>
          </li>
          <li>
            <span className="how__step-num mono">03</span>
            <div>
              <h3>Build the improvement plan</h3>
              <p>
                Aggregate findings into a prioritized improvement plan. Export to PDF. Schedule the
                re-review.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <section className="pillars-grid">
        <p className="eyebrow eyebrow--section">The seven pillars</p>
        <div className="pillars-grid__grid">
          {PILLARS.map((p, i) => (
            <div className="pillar-card" key={p.key}>
              <span className="pillar-card__num mono">{String(i + 1).padStart(2, "0")}</span>
              <h4>{p.name}</h4>
              <p className="mono pillar-card__count">{p.count} questions</p>
            </div>
          ))}
        </div>
      </section>

      <section className="local-note">
        <p className="eyebrow eyebrow--section">A note on storage</p>
        <p>
          This tool runs entirely in your browser. Your review is saved to{" "}
          <span className="mono">localStorage</span> on this device; nothing is sent to a server.
          To collaborate, export the summary and share it through your team's normal channels.
        </p>
      </section>
    </div>
  );
}
