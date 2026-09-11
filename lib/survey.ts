import type { SurveyFormErrors, SurveyFormState } from '@/data/questions';

export type SurveyPayload = {
  clinicKey: 'mizutani';
  submittedAt: string;
  gender: string;
  ageGroup: string;
  waitingTimeRating: number;
  /** Kept for compatibility with the currently deployed GAS. */
  medicalCareRating: number;
  staffRating: number;
  totalScore: number;
  averageScore: number;
  reasons: string[];
  otherReason: string;
  comments: string;
};

export function validateSurvey(form: SurveyFormState): SurveyFormErrors {
  const errors: SurveyFormErrors = {};
  if (form.waitingTimeRating === null) errors.waitingTimeRating = 'こちらの項目をご回答ください。';
  if (form.staffRating === null) errors.staffRating = 'こちらの項目をご回答ください。';
  return errors;
}

export function calculateScores(waitingTimeRating: number, staffRating: number) {
  const totalScore = waitingTimeRating + staffRating;
  return { totalScore, averageScore: Number((totalScore / 2).toFixed(2)) };
}

export function isGoogleReviewEligible(waitingTimeRating: number, staffRating: number) {
  return waitingTimeRating >= 9 && staffRating >= 9;
}

export function createSurveyPayload(form: SurveyFormState, submittedAt = new Date().toISOString()): SurveyPayload {
  if (form.waitingTimeRating === null || form.staffRating === null) {
    throw new Error('必須の評価が未回答です。');
  }
  return {
    clinicKey: 'mizutani',
    submittedAt,
    gender: form.gender,
    ageGroup: form.ageGroup,
    waitingTimeRating: form.waitingTimeRating,
    medicalCareRating: form.waitingTimeRating,
    staffRating: form.staffRating,
    ...calculateScores(form.waitingTimeRating, form.staffRating),
    reasons: [...form.reasons],
    otherReason: form.reasons.includes('その他') ? form.otherReason.trim() : '',
    comments: form.comments.trim(),
  };
}
