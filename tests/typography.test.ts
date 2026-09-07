import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string) => readFileSync(join(import.meta.dirname, '..', path), 'utf8');

test('Thanks見出しは語尾を分断しない意味単位で保持する', () => {
  const page = read('app/thanks/page.tsx');
  assert.match(page, /thanks-title-phrase">ご回答<\/span>/);
  assert.match(page, /thanks-title-phrase">ありがとうございました。<\/span>/);
  assert.doesNotMatch(page, /いただいたご意見は、<br/);
  assert.doesNotMatch(page, /よろしければ、<br/);
});

test('日本語Typography CSSは禁則とauto-phraseを採用する', () => {
  const css = read('app/globals.css');
  assert.match(css, /line-break:\s*strict/);
  assert.match(css, /word-break:\s*normal/);
  assert.match(css, /@supports \(word-break: auto-phrase\)/);
  assert.match(css, /word-break:\s*auto-phrase/);
  assert.match(css, /text-wrap:\s*balance/);
  assert.match(css, /text-wrap:\s*pretty/);
  assert.doesNotMatch(css, /word-break:\s*break-all/);
});

test('緊急折り返しanywhereは自由記述再表示だけに限定する', () => {
  const css = read('app/globals.css');
  const anywhere = css.match(/overflow-wrap:\s*anywhere/g) ?? [];
  assert.equal(anywhere.length, 1);
  assert.match(css, /\.comment-text[^}]*overflow-wrap:\s*anywhere/);
});

test('Thanksの主要コピーとCTAへ共通Typography classを適用する', () => {
  const page = read('app/thanks/page.tsx');
  assert.match(page, /thanks-title jp-heading/);
  assert.match(page, /thanks-lead jp-copy/);
  assert.match(page, /review-heading jp-heading/);
  assert.match(page, /copy-button jp-ui-label/);
  assert.match(page, /back-link jp-ui-label/);
});
