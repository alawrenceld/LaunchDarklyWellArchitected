import type { RiskLevel } from "../lib/types";

type Props = {
  value: RiskLevel | null;
  onChange: (next: RiskLevel | null) => void;
  size?: "sm" | "md";
};

const LEVELS: { value: RiskLevel; label: string; sublabel: string }[] = [
  { value: "high", label: "HIGH", sublabel: "Plausible incident; no compensating control" },
  { value: "medium", label: "MEDIUM", sublabel: "Operational drag or future risk; not acute" },
  { value: "none", label: "NONE", sublabel: "No material gap" },
];

export function RiskPicker({ value, onChange, size = "md" }: Props) {
  return (
    <div
      className={`risk-picker risk-picker--${size}`}
      role="radiogroup"
      aria-label="Risk level"
    >
      {LEVELS.map((lvl) => {
        const selected = value === lvl.value;
        return (
          <button
            key={lvl.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`risk-chip risk-chip--${lvl.value} ${selected ? "is-selected" : ""}`}
            onClick={() => onChange(selected ? null : lvl.value)}
          >
            <span className="risk-chip__label mono">{lvl.label}</span>
            {size === "md" && (
              <span className="risk-chip__sublabel">{lvl.sublabel}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
