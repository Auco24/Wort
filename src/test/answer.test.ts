import { describe, expect, it } from 'vitest';
import { checkAnswer, normalize, variants } from '../lib/answer';
import type { Card } from '../types';

const card = (p: Partial<Card>): Card => ({
  id: 'x', deckId: 'd', term: '', translation: '', tags: [], createdAt: 0, srs: {}, ...p,
});

describe('normalize & variants', () => {
  it('ignores case, ё, punctuation and parentheses', () => {
    expect(normalize('  Ещё (разг.)! ')).toBe('еще');
  });
  it('splits meanings', () => {
    expect(variants('интересный, забавный')).toEqual(['интересный, забавный', 'интересный', 'забавный']);
  });
});

describe('checkAnswer', () => {
  const hund = card({ term: 'Hund', article: 'der', translation: 'собака, пёс' });

  it('accepts any of several meanings (fwd)', () => {
    expect(checkAnswer('пес', hund, 'fwd', 'de', 'ru').verdict).toBe('correct');
    expect(checkAnswer('Собака', hund, 'fwd', 'de', 'ru').verdict).toBe('correct');
    expect(checkAnswer('кошка', hund, 'fwd', 'de', 'ru').verdict).toBe('wrong');
  });

  it('checks German articles (rev)', () => {
    expect(checkAnswer('der Hund', hund, 'rev', 'de', 'ru').verdict).toBe('correct');
    expect(checkAnswer('Hund', hund, 'rev', 'de', 'ru')).toMatchObject({ verdict: 'almost', note: 'article-missing' });
    expect(checkAnswer('die Hund', hund, 'rev', 'de', 'ru')).toMatchObject({ verdict: 'wrong', note: 'article-wrong' });
  });

  it('understands umlaut transliteration and missing diacritics', () => {
    const schoen = card({ term: 'schön', translation: 'красивый' });
    expect(checkAnswer('schoen', schoen, 'rev', 'de', 'ru').verdict).toBe('correct');
    expect(checkAnswer('schon', schoen, 'rev', 'de', 'ru')).toMatchObject({ verdict: 'almost', note: 'diacritics' });
    const aka = card({ term: 'åka', translation: 'ехать' });
    expect(checkAnswer('aka', aka, 'rev', 'sv', 'ru').verdict).toBe('almost');
  });

  it('tolerates small typos in long words', () => {
    const w = card({ term: 'opportunity', translation: 'возможность' });
    expect(checkAnswer('oportunity', w, 'rev', 'en', 'ru').verdict).toBe('typo');
    expect(checkAnswer('возможнсть', w, 'fwd', 'en', 'ru').verdict).toBe('typo');
  });

  it('allows omitting "to" / "att" for verbs', () => {
    const eat = card({ term: '食べる', reading: 'たべる', translation: 'to eat' });
    expect(checkAnswer('eat', eat, 'fwd', 'ja', 'en').verdict).toBe('correct');
  });

  it('accepts Japanese as kanji, kana or romaji', () => {
    const eat = card({ term: '食べる', reading: 'たべる', translation: 'есть' });
    expect(checkAnswer('食べる', eat, 'rev', 'ja', 'ru').verdict).toBe('correct');
    expect(checkAnswer('たべる', eat, 'rev', 'ja', 'ru').verdict).toBe('correct');
    expect(checkAnswer('taberu', eat, 'rev', 'ja', 'ru').verdict).toBe('correct');
    expect(checkAnswer('nomu', eat, 'rev', 'ja', 'ru').verdict).toBe('wrong');
  });

  it('checks Swedish en/ett', () => {
    const hus = card({ term: 'hus', article: 'ett', translation: 'дом' });
    expect(checkAnswer('ett hus', hus, 'rev', 'sv', 'ru').verdict).toBe('correct');
    expect(checkAnswer('en hus', hus, 'rev', 'sv', 'ru').note).toBe('article-wrong');
  });
});
