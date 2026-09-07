'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClinicMark } from '@/components/ClinicMark';
import { clinicConfig, STORAGE_KEYS } from '@/data/config';

export default function ThanksPage() {
  const [totalScore, setTotalScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const storedScore = sessionStorage.getItem(STORAGE_KEYS.totalScore);
      setTotalScore(storedScore === null ? null : Number(storedScore));
      setComment(sessionStorage.getItem(STORAGE_KEYS.comment) || '');
      setShowReview(sessionStorage.getItem(STORAGE_KEYS.showReview) === '1');
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const copyComment = async () => {
    if (!comment) return true;
    try {
      await navigator.clipboard.writeText(comment);
      setCopied(true);
      setCopyError(false);
      return true;
    } catch {
      setCopyError(true);
      return false;
    }
  };

  const openReview = async () => {
    if (comment && !(await copyComment())) return;
    window.open(clinicConfig.googleReviewUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <main>
      <header className="site-header">
        <div className="header-inner"><ClinicMark /><span className="clinic-name">{clinicConfig.name}</span></div>
      </header>

      <div className="thanks-shell">
        <div className="success-mark" aria-hidden="true">✓</div>
        <p className="eyebrow">THANK YOU</p>
        <h1 className="thanks-title jp-heading">
          <span className="thanks-title-phrase">ご回答</span>
          <span className="thanks-title-phrase">ありがとうございました。</span>
        </h1>
        <p className="thanks-lead jp-copy">
          いただいたご意見は、今後より良い診療環境づくりのために活用させていただきます。
        </p>

        {totalScore !== null && totalScore <= 15 && (
          <section className="improvement-message">
            <h2 className="jp-heading">貴重なご意見をありがとうございます。</h2>
            <p className="jp-copy">いただいた内容は、今後の診療・サービス改善に活用させていただきます。</p>
          </section>
        )}

        {showReview && clinicConfig.googleReviewUrl && (
          <section className="review-card">
            <h2 className="review-heading jp-heading">
              <span className="keep-phrase">よろしければ、</span>
              Googleでもご感想をお聞かせください。
            </h2>
            {comment && (
              <div className="comment-box">
                <p className="comment-label">アンケートにご入力いただいた内容</p>
                <p className="comment-text">{comment}</p>
                <button type="button" className="copy-button jp-ui-label" onClick={copyComment}>{copied ? 'コピーしました ✓' : 'この文章をコピーする'}</button>
              </div>
            )}
            {copyError && <p className="submit-error jp-copy" role="alert">コピーできませんでした。文章を長押ししてコピーしてからお進みください。</p>}
            <button type="button" className="submit-button jp-ui-label" onClick={openReview}>{comment ? '感想をコピーしてGoogle口コミへ' : 'Googleで口コミを書く'}</button>
            <p className="review-note jp-copy">投稿内容や星の数は、Googleの画面で自由に編集できます。</p>
          </section>
        )}

        <Link href="/" className="back-link jp-ui-label">アンケート画面へ戻る</Link>
      </div>
    </main>
  );
}
