import type { ReactNode } from 'react';

type Props = {
  number: number;
  title: string;
  required?: boolean;
  error?: string;
  errorId?: string;
  children: ReactNode;
};

export function QuestionCard({ number, title, required = false, error, errorId, children }: Props) {
  return (
    <section className={`question-card ${error ? 'question-card-error' : ''}`} aria-labelledby={`question-${number}`}>
      <div className="question-heading">
        <span className="question-number">Q{number}</span>
        <div>
          <h2 id={`question-${number}`}>{title}</h2>
          <span className={required ? 'badge-required' : 'badge-optional'}>{required ? '必須' : '任意'}</span>
        </div>
      </div>
      {children}
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </section>
  );
}
