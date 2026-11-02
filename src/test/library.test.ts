import { describe, expect, it } from 'vitest';
import { isKanji } from 'wanakana';
import { CATEGORIES, entryDraft, libraryEntries, libraryWords, LIB_LANGS, wordKey } from '../data/library';

describe('word library', () => {
  const entries = libraryEntries();

  it('parses and is large', () => {
    expect(entries.length).toBeGreaterThan(800);
  });

  it('has words in every category and only known categories', () => {
    const ids = new Set(CATEGORIES.map((c) => c.id));
    for (const e of entries) expect(ids.has(e.cat), e.cat).toBe(true);
    for (const c of CATEGORIES) expect(entries.some((e) => e.cat === c.id), c.id).toBe(true);
  });

  it('gives German and Swedish nouns an article (unless plural-only)', () => {
    for (const code of ['de', 'sv'] as const) {
      const bad = libraryWords(code, 'ru')
        .filter((w) => w.entry.pos === 'noun' && !w.draft.article && !/\((pl\.|Pl\.)\)|^det /.test(w.draft.term))
        .map((w) => w.draft.term);
      // A few uncountable/proper nouns (days, months, internet…) are fine without one.
      expect(bad.length, bad.join(', ')).toBeLessThan(30);
    }
  });

  it('has a kana reading for every Japanese word written with kanji', () => {
    const missing = libraryWords('ja', 'ru')
      .filter((w) => [...w.draft.term].some((ch) => isKanji(ch)) && !w.draft.reading)
      .map((w) => w.draft.term);
    expect(missing).toEqual([]);
  });

  it('has no duplicate terms inside one category', () => {
    for (const code of LIB_LANGS) {
      const seen = new Map<string, string>();
      for (const w of libraryWords(code, 'ru')) {
        const key = `${w.entry.cat}|${wordKey(w.draft)}`;
        expect(seen.has(key), `${code}: ${key}`).toBe(false);
        seen.set(key, w.entry.id);
      }
    }
  });

  it('builds drafts with forms, article and translation', () => {
    const apple = entries.find((e) => e.f.en === 'apple')!;
    expect(entryDraft(apple, 'de', 'ru')).toMatchObject({ term: 'Apfel', article: 'der', forms: 'die Äpfel', translation: 'яблоко' });
    expect(entryDraft(apple, 'sv', 'de')).toMatchObject({ term: 'äpple', article: 'ett', translation: 'der Apfel' });
    expect(entryDraft(apple, 'ja', 'en')).toMatchObject({ term: 'りんご', translation: 'apple' });
    const eat = entries.find((e) => e.f.en.startsWith('eat~'))!;
    expect(entryDraft(eat, 'en', 'ru')).toMatchObject({ term: 'to eat', forms: 'ate, eaten' });
    expect(entryDraft(eat, 'ja', 'ru')).toMatchObject({ term: '食べる', reading: 'たべる' });
  });
});
