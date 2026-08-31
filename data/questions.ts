export const genderOptions = ['男性', '女性', '回答しない'] as const;
export const ageOptions = ['10代', '20代', '30代', '40代', '50代', '60代', '70代以上'] as const;
export const reasonOptions = [
  '自宅・職場から近い',
  '家族・知人からの紹介',
  'Google検索・Googleマップ',
  '口コミ・評判',
  'ホームページを見て',
  '以前から通院している',
  '他の医療機関からの紹介',
  'その他',
] as const;

export type SurveyFormState = {
  gender: string;
  ageGroup: string;
  medicalCareRating: number | null;
  staffRating: number | null;
  reasons: string[];
  otherReason: string;
  comments: string;
};

export type SurveyFormErrors = Partial<Record<'medicalCareRating' | 'staffRating', string>>;

export const initialFormState: SurveyFormState = {
  gender: '',
  ageGroup: '',
  medicalCareRating: null,
  staffRating: null,
  reasons: [],
  otherReason: '',
  comments: '',
};
