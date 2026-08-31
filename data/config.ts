export const clinicConfig = {
  name: '水谷眼科診療所',
  homepageUrl: 'https://www.mizutani-eye-clinic.com/',
  gasUrl: process.env.NEXT_PUBLIC_GAS_URL?.trim() || '',
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() || '',
} as const;

export const STORAGE_KEYS = {
  totalScore: 'mizutani-eye-total-score',
  comment: 'mizutani-eye-review-comment',
} as const;
