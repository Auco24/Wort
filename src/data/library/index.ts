import type { LangCode, PartOfSpeech, UiLang } from '../../types';
import type { CardDraft } from '../../lib/importExport';
import { splitArticle } from '../../lib/languages';
import { LEVELS, type Level } from './categories';
import { WORDS_1 } from './words1';
import { WORDS_2 } from './words2';
import { WORDS_3 } from './words3';
import { WORDS_4 } from './words4';
import { WORDS_5 } from './words5';

/** Languages the library provides words for. */
export const LIB_LANGS: LangCode[] = ['en', 'de', 'sv', 'ja'];

type Field = 'en' | 'ru' | 'de' | 'sv' | 'ja';

export interface LibEntry {
  id: string;
  cat: string;
  level: Level;
  pos: PartOfSpeech;
  only?: LangCode[];
  f: Record<Field, string>;
}

const POS: Record<string, PartOfSpeech> = { n: 'noun', v: 'verb', a: 'adj', d: 'adv', p: 'phrase', o: 'other' };
/** English modal verbs are listed without "to". */
const NO_TO = new Set(['can', 'must']);

export function parseLines(cat: string, text: string): LibEntry[] {
  const out: LibEntry[] = [];
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line, i) => {
      const parts = line.split('|').map((s) => s.trim());
      if (parts.length !== 7) throw new Error(`Library ${cat}:${i + 1}: expected 7 fields, got ${parts.length}: ${line}`);
      const [level, posRaw, en, ru, de, sv, ja] = parts;
      if (!(LEVELS as readonly string[]).includes(level)) throw new Error(`Library ${cat}:${i + 1}: bad level ${level}`);
      const [p, only] = posRaw.split(':');
      const pos = POS[p];
      if (!pos) throw new Error(`Library ${cat}:${i + 1}: bad part of speech ${posRaw}`);
      out.push({
        id: `${cat}.${i}`,
        cat,
        level: level as Level,
        pos,
        only: only ? (only.split(',') as LangCode[]) : undefined,
        f: { en, ru, de, sv, ja },
      });
    });
  return out;
}

let cache: LibEntry[] | null = null;

export function libraryEntries(): LibEntry[] {
  if (!cache) {
    cache = Object.entries({ ...WORDS_1, ...WORDS_2, ...WORDS_3, ...WORDS_4, ...WORDS_5 }).flatMap(([cat, text]) => parseLines(cat, text));
  }
  return cache;
}

export function availableIn(e: LibEntry, code: LangCode): boolean {
  if (!LIB_LANGS.includes(code)) return false;
  if (e.only && !e.only.includes(code)) return false;
  const v = e.f[code as Field];
  return !!v && v !== '-';
}

const head = (s: string) => s.split('~')[0].trim();
const tail = (s: string) => {
  const i = s.indexOf('~');
  return i >= 0 ? s.slice(i + 1).trim() : undefined;
};

function englishTerm(e: LibEntry): string {
  const base = head(e.f.en);
  return e.pos === 'verb' && !NO_TO.has(base) ? `to ${base}` : base;
}

/** The meaning shown to a learner whose own language is `native`. */
export function translationOf(e: LibEntry, native: UiLang): string {
  if (native === 'ru') return e.f.ru;
  if (native === 'en') return englishTerm(e);
  const de = head(e.f.de);
  return de && de !== '-' ? de : englishTerm(e);
}

/** Card fields for learning this entry in language `code`. */
export function entryDraft(e: LibEntry, code: LangCode, native: UiLang): CardDraft {
  const tags = [e.cat, e.level];
  const translation = translationOf(e, native);
  if (code === 'en') {
    return { term: englishTerm(e), translation, forms: tail(e.f.en), pos: e.pos, tags };
  }
  if (code === 'ja') {
    const main = head(e.f.ja);
    const [term, reading] = main.split('=');
    return { term: term.trim(), reading: reading?.trim() || undefined, translation, forms: tail(e.f.ja), pos: e.pos, tags };
  }
  const raw = e.f[code as 'de' | 'sv'];
  const main = head(raw);
  const split = e.pos === 'noun' ? splitArticle(code, main) : null;
  return {
    term: split ? split.rest : main,
    article: split?.article,
    translation,
    forms: tail(raw),
    pos: e.pos,
    tags,
  };
}

/**
 * Identity of a word inside one language: article + spelling (+ kana reading),
 * so "das Essen" ≠ "essen" and 空 (そら) ≠ 空 (から).
 */
export function wordKey(c: { term: string; article?: string; reading?: string }): string {
  return `${c.article ?? ''} ${c.term}|${c.reading ?? ''}`.normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
}

export interface LibWord {
  entry: LibEntry;
  draft: CardDraft;
}

const wordCache = new Map<string, LibWord[]>();

/** All library words for a language, translated into the learner's language. */
export function libraryWords(code: LangCode, native: UiLang): LibWord[] {
  const key = `${code}|${native}`;
  let list = wordCache.get(key);
  if (!list) {
    list = libraryEntries()
      .filter((e) => availableIn(e, code))
      .map((entry) => ({ entry, draft: entryDraft(entry, code, native) }));
    wordCache.set(key, list);
  }
  return list;
}

export { CATEGORIES, CATEGORY_BY_ID, LEVELS, type Level } from './categories';
