import assert from 'node:assert/strict';
import test from 'node:test';
import { initialFormState } from '../data/questions';
import { calculateScores, createSurveyPayload, validateSurvey } from '../lib/survey';

test('Q3とQ4を必須として検証する', () => {
  assert.deepEqual(validateSurvey(initialFormState), {
    medicalCareRating: 'こちらの項目をご回答ください。',
    staffRating: 'こちらの項目をご回答ください。',
  });
});

test('合計と平均を計算する', () => {
  assert.deepEqual(calculateScores(9, 8), { totalScore: 17, averageScore: 8.5 });
  assert.deepEqual(calculateScores(10, 10), { totalScore: 20, averageScore: 10 });
});

test('複数選択・その他・スコアをpayloadへ保存する', () => {
  const payload = createSurveyPayload({
    ...initialFormState,
    gender: '回答しない', ageGroup: '70代以上', medicalCareRating: 8, staffRating: 7,
    reasons: ['自宅・職場から近い', 'その他'], otherReason: '看板を見て', comments: ' 丁寧でした。 ',
  }, '2026-08-31T00:00:00.000Z');
  assert.deepEqual(payload, {
    submittedAt: '2026-08-31T00:00:00.000Z', gender: '回答しない', ageGroup: '70代以上',
    medicalCareRating: 8, staffRating: 7, totalScore: 15, averageScore: 7.5,
    reasons: ['自宅・職場から近い', 'その他'], otherReason: '看板を見て', comments: '丁寧でした。',
  });
});

test('その他が未選択ならその他理由をpayloadに含めない', () => {
  const payload = createSurveyPayload({ ...initialFormState, medicalCareRating: 1, staffRating: 10, otherReason: '残存値' });
  assert.equal(payload.otherReason, '');
});
