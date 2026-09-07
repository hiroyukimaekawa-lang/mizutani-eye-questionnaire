'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClinicMark } from '@/components/ClinicMark';
import { QuestionCard } from '@/components/QuestionCard';
import { ScoreSelector } from '@/components/ScoreSelector';
import { clinicConfig, STORAGE_KEYS } from '@/data/config';
import { ageOptions, genderOptions, initialFormState, reasonOptions, type SurveyFormErrors, type SurveyFormState } from '@/data/questions';
import { createSurveyPayload, isGoogleReviewEligible, validateSurvey } from '@/lib/survey';

export default function SurveyPage() {
  const router = useRouter();
  const [form, setForm] = useState<SurveyFormState>(initialFormState);
  const [errors, setErrors] = useState<SurveyFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const waitingTimeRef = useRef<HTMLElement>(null);
  const staffRef = useRef<HTMLElement>(null);

  const update = <K extends keyof SurveyFormState>(field: K, value: SurveyFormState[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === 'waitingTimeRating' || field === 'staffRating') {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const toggleReason = (reason: string) => {
    const selected = form.reasons.includes(reason);
    const reasons = selected ? form.reasons.filter((item) => item !== reason) : [...form.reasons, reason];
    setForm((current) => ({ ...current, reasons, otherReason: reason === 'その他' && selected ? '' : current.otherReason }));
  };

  const focusFirstError = (nextErrors: SurveyFormErrors) => {
    const target = nextErrors.waitingTimeRating ? waitingTimeRef.current : staffRef.current;
    requestAnimationFrame(() => {
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const nextErrors = validateSurvey(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    const payload = createSurveyPayload(form);
    if (clinicConfig.gasUrl) {
      try {
        await fetch(clinicConfig.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          mode: 'no-cors',
        });
      } catch {
        setSubmitting(false);
        setSubmitError('送信に失敗しました。通信環境をご確認のうえ、もう一度お試しください。');
        return;
      }
    }

    sessionStorage.setItem(STORAGE_KEYS.totalScore, String(payload.totalScore));
    sessionStorage.setItem(STORAGE_KEYS.comment, payload.comments);
    sessionStorage.setItem(
      STORAGE_KEYS.showReview,
      isGoogleReviewEligible(payload.waitingTimeRating, payload.staffRating) ? '1' : '0',
    );
    router.push('/thanks');
  };

  return (
    <main>
      <header className="site-header">
        <div className="header-inner"><ClinicMark /><span>{clinicConfig.name}</span></div>
      </header>
      <div className="page-shell">
        <section className="intro">
          <p className="eyebrow">PATIENT SURVEY</p>
          <h1>患者様アンケート</h1>
          <p className="intro-copy">
            <span className="intro-line">本日は水谷眼科診療所へご来院いただきありがとうございます。</span>
            <span className="intro-line">今後の診療・サービス改善のため、アンケートへのご協力をお願いいたします。</span>
          </p>
          <aside><strong>匿名でご回答いただけます</strong><br />いただいた内容は、診療・サービス改善のために活用いたします。</aside>
        </section>

        <div className="question-list">
          <QuestionCard number={1} title="性別を教えてください。">
            <div className="choice-list" role="radiogroup" aria-label="性別">
              {genderOptions.map((option) => <label key={option} className="choice"><input type="radio" name="gender" value={option} checked={form.gender === option} onChange={() => update('gender', option)} /><span>{option}</span></label>)}
            </div>
          </QuestionCard>

          <QuestionCard number={2} title="年代を教えてください。">
            <div className="choice-grid" role="radiogroup" aria-label="年代">
              {ageOptions.map((option) => <label key={option} className="choice"><input type="radio" name="ageGroup" value={option} checked={form.ageGroup === option} onChange={() => update('ageGroup', option)} /><span>{option}</span></label>)}
            </div>
          </QuestionCard>

          <div ref={waitingTimeRef as React.RefObject<HTMLDivElement>}>
            <QuestionCard number={3} title="待ち時間には満足いただけましたか？" required error={errors.waitingTimeRating} errorId="waiting-time-error">
              <ScoreSelector name="waiting-time" value={form.waitingTimeRating} onChange={(value) => update('waitingTimeRating', value)} hasError={!!errors.waitingTimeRating} describedBy={errors.waitingTimeRating ? 'waiting-time-error' : undefined} />
            </QuestionCard>
          </div>

          <div ref={staffRef as React.RefObject<HTMLDivElement>}>
            <QuestionCard number={4} title="スタッフの対応には満足いただけましたか？" required error={errors.staffRating} errorId="staff-error">
              <ScoreSelector name="staff" value={form.staffRating} onChange={(value) => update('staffRating', value)} hasError={!!errors.staffRating} describedBy={errors.staffRating ? 'staff-error' : undefined} />
            </QuestionCard>
          </div>

          <QuestionCard number={5} title="当院を選ばれた理由を教えてください。">
            <p className="helper-text">当てはまるものをすべてお選びください。</p>
            <div className="choice-list">
              {reasonOptions.map((option) => <label key={option} className="choice"><input type="checkbox" value={option} checked={form.reasons.includes(option)} onChange={() => toggleReason(option)} /><span>{option}</span></label>)}
            </div>
            {form.reasons.includes('その他') && <div className="other-field"><label htmlFor="otherReason">その他の理由をご入力ください</label><input id="otherReason" type="text" maxLength={200} value={form.otherReason} onChange={(event) => update('otherReason', event.target.value)} /></div>}
          </QuestionCard>

          <QuestionCard number={6} title="その他、お気づきの点や改善点、ご意見・ご要望などございましたらお聞かせください。">
            <label className="sr-only" htmlFor="comments">ご意見・ご要望</label>
            <textarea id="comments" rows={7} maxLength={1000} value={form.comments} onChange={(event) => update('comments', event.target.value)} placeholder={'診療やスタッフ対応、院内環境などについて、\nお気づきの点がございましたらご自由にご記入ください。'} />
            <p className="character-count" aria-live="polite">{form.comments.length} / 1000文字</p>
          </QuestionCard>
        </div>

        <div className="submit-area">
          {submitError && <p className="submit-error" role="alert">{submitError}</p>}
          <button type="button" className="submit-button" onClick={handleSubmit} disabled={submitting} aria-busy={submitting}>
            {submitting ? '送信しています…' : 'アンケートを送信する'}
          </button>
          <p>ご回答は匿名で送信されます。</p>
        </div>
      </div>
    </main>
  );
}
