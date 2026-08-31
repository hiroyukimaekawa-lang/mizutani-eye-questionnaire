'use client';

type Props = {
  name: string;
  value: number | null;
  onChange: (score: number) => void;
  hasError?: boolean;
  describedBy?: string;
};

const scores = Array.from({ length: 10 }, (_, index) => index + 1);

export function ScoreSelector({ name, value, onChange, hasError = false, describedBy }: Props) {
  return (
    <div>
      <div
        className="score-row"
        role="radiogroup"
        aria-label="1（非常に不満）から10（非常に満足）までの評価"
        aria-invalid={hasError}
        aria-describedby={describedBy}
      >
        {scores.map((score) => (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={value === score}
            aria-label={`${score}点${score === 1 ? '、非常に不満' : score === 10 ? '、非常に満足' : ''}`}
            className="score-button"
            onClick={() => onChange(score)}
            data-selected={value === score}
            name={`${name}-${score}`}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="score-scale" aria-hidden="true">
        <span>非常に不満</span><span className="score-line">←────────→</span><span>非常に満足</span>
      </div>
    </div>
  );
}
