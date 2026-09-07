export const clinicConfig = {
  name: '水谷眼科診療所',
  homepageUrl: 'https://www.mizutani-eye-clinic.com/',
  gasUrl: process.env.NEXT_PUBLIC_GAS_URL?.trim() || '',
  googleReviewUrl:
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL?.trim() ||
    'https://www.google.com/search?q=%E6%B0%B4%E8%B0%B7%E7%9C%BC%E7%A7%91%E8%A8%BA%E7%99%82%E6%89%80&oq=%E6%B0%B4%E8%B0%B7%E7%9C%BC%E7%A7%91%E8%A8%BA%E7%99%82%E6%89%80&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIGCAMQABgeMgYIBBAAGB4yBggFEEUYPTIGCAYQRRg9MgYIBxBFGD3SAQc0MTdqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x600376def9c14e19:0xc1e8d25a99428056,3,,,,',
} as const;

export const STORAGE_KEYS = {
  totalScore: 'mizutani-eye-total-score',
  comment: 'mizutani-eye-review-comment',
  showReview: 'mizutani-eye-show-review',
} as const;
