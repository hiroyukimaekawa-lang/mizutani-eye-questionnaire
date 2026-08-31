import type { SurveyFormErrors, SurveyFormState } from '@/data/questions';

export type SurveyPayload = {
  submittedAt: string;
  gender: string;
  ageGroup: string;
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
  if (form.medicalCareRating === null) errors.medicalCareRating = 'こちらの項目をご回答ください。';
  if (form.staffRating === null) errors.staffRating = 'こちらの項目をご回答ください。';
  return errors;
}

export function calculateScores(medicalCareRating: number, staffRating: number) {
  const totalScore = medicalCareRating + staffRating;
  return { totalScore, averageScore: Number((totalScore / 2).toFixed(2)) };
}

export function createSurveyPayload(form: SurveyFormState, submittedAt = new Date().toISOString()): SurveyPayload {
  if (form.medicalCareRating === null || form.staffRating === null) {
    throw new Error('必須の評価が未回答です。');
  }
  return {
    submittedAt,
    gender: form.gender,
    ageGroup: form.ageGroup,
    medicalCareRating: form.medicalCareRating,
    staffRating: form.staffRating,
    ...calculateScores(form.medicalCareRating, form.staffRating),
    reasons: [...form.reasons],
    otherReason: form.reasons.includes('その他') ? form.otherReason.trim() : '',
    comments: form.comments.trim(),
  };
}
