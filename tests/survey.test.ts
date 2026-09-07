import assert from 'node:assert/strict';
import test from 'node:test';
import { initialFormState } from '../data/questions';
import { calculateScores, createSurveyPayload, isGoogleReviewEligible, validateSurvey } from '../lib/survey';

test('Q3とQ4を必須として検証する', () => {
  assert.deepEqual(validateSurvey(initialFormState), {
    waitingTimeRating: 'こちらの項目をご回答ください。',
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
    gender: '回答しない', ageGroup: '70代以上', waitingTimeRating: 8, staffRating: 7,
    reasons: ['自宅・職場から近い', 'その他'], otherReason: '看板を見て', comments: ' 丁寧でした。 ',
  }, '2026-08-31T00:00:00.000Z');
  assert.deepEqual(payload, {
    submittedAt: '2026-08-31T00:00:00.000Z', gender: '回答しない', ageGroup: '70代以上',
    waitingTimeRating: 8, medicalCareRating: 8, staffRating: 7, totalScore: 15, averageScore: 7.5,
    reasons: ['自宅・職場から近い', 'その他'], otherReason: '看板を見て', comments: '丁寧でした。',
  });
});

test('その他が未選択ならその他理由をpayloadに含めない', () => {
  const payload = createSurveyPayload({ ...initialFormState, waitingTimeRating: 1, staffRating: 10, otherReason: '残存値' });
  assert.equal(payload.otherReason, '');
});

test('口コミ案内は待ち時間とスタッフ対応がともに9点以上の場合だけ表示する', () => {
  for (const [waiting, staff] of [[9, 9], [9, 10], [10, 9], [10, 10]]) {
    assert.equal(isGoogleReviewEligible(waiting, staff), true, `${waiting}, ${staff}`);
  }
  for (const [waiting, staff] of [[8, 9], [9, 8], [8, 10], [10, 8], [1, 10]]) {
    assert.equal(isGoogleReviewEligible(waiting, staff), false, `${waiting}, ${staff}`);
  }
});
