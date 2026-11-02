import { toHiragana } from 'wanakana';
import type { Card, Direction, Grade, LangCode } from '../types';
import { lang, splitArticle } from './languages';

export type Verdict = 'correct' | 'typo' | 'almost' | 'wrong';
export type VerdictNote = 'article-missing' | 'article-wrong' | 'diacritics' | 'typo';

export interface CheckResult {
  verdict: Verdict;
  note?: VerdictNote;
  /** The variant that matched best (or the full expected answer). */
  expected: string;
}

/** Lower-case, ё→е, drop parentheses, punctuation and extra spaces. */
export function normalize(s: string): string {
  return s
    .normalize('NFC')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .replace(/[.!?¿¡,;:"«»„“”‘’'`´…。、！？]/g, '')
    .replace(/[-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove diacritics: ä→a, é→e, å→a, ß→ss … */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ß/g, 'ss')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/œ/g, 'oe');
}

/** German keyboards without umlauts: "schoen" → "schön". */
function germanTranslit(s: string): string {
  return s.replace(/ae/g, 'ä').replace(/oe/g, 'ö').replace(/ue/g, 'ü');
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

function typoAllowance(len: number): number {
  if (len <= 3) return 0;
  if (len <= 7) return 1;
  return 2;
}

/** "собака, пёс; псина" → ["собака", "пёс", "псина"] (plus the whole string). */
export function variants(expected: string): string[] {
  const parts = expected
    .split(/[,;/|、，；]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return Array.from(new Set([expected.trim(), ...parts]));
}

function stripMarker(s: string, marker?: string): string {
  if (!marker) return s;
  const prefix = marker + ' ';
  return s.startsWith(prefix) ? s.slice(prefix.length) : s;
}

const rank: Record<Verdict, number> = { correct: 3, typo: 2, almost: 1, wrong: 0 };

/** Compare a typed answer with one expected string in a given language. */
export function compareText(input: string, expected: string, code: LangCode): { verdict: Verdict; note?: VerdictNote } {
  const marker = lang(code).infinitiveMarker;
  const a = stripMarker(normalize(input), marker);
  const b = stripMarker(normalize(expected), marker);
  if (!a || !b) return { verdict: 'wrong' };
  if (a === b) return { verdict: 'correct' };
  if (code === 'de' && germanTranslit(a) === b) return { verdict: 'correct' };
  if (fold(a) === fold(b)) return { verdict: 'almost', note: 'diacritics' };
  if (levenshtein(a, b) <= typoAllowance(b.length)) return { verdict: 'typo', note: 'typo' };
  return { verdict: 'wrong' };
}

function best(input: string, options: string[], code: LangCode): CheckResult {
  let out: CheckResult = { verdict: 'wrong', expected: options[0] ?? '' };
  for (const opt of options) {
    const r = compareText(input, opt, code);
    if (rank[r.verdict] > rank[out.verdict]) out = { ...r, expected: opt };
    if (out.verdict === 'correct') break;
  }
  return out;
}

function japaneseMatches(input: string, card: Card): boolean {
  const raw = input.trim();
  if (!raw) return false;
  const typed = toHiragana(raw.toLowerCase());
  const targets = [card.term, card.reading ?? '']
    .flatMap((t) => variants(t))
    .filter(Boolean);
  return targets.some((t) => t === raw || toHiragana(t) === typed);
}

/**
 * Check a typed answer.
 *  - fwd: the learner sees the word and types the meaning (in their own language).
 *  - rev: the learner sees the meaning and types the word in the target language.
 */
export function checkAnswer(input: string, card: Card, dir: Direction, code: LangCode, nativeCode: LangCode): CheckResult {
  if (dir === 'fwd') return best(input, variants(card.translation), nativeCode);

  const fullTerm = card.article ? `${card.article} ${card.term}` : card.term;
  if (lang(code).kana) {
    if (japaneseMatches(input, card)) return { verdict: 'correct', expected: card.term };
    return { ...best(input, variants(card.term), code), expected: card.term };
  }

  if (card.article) {
    const split = splitArticle(code, input);
    const word = best(split ? split.rest : input, variants(card.term), code);
    const expected = fullTerm;
    if (word.verdict === 'wrong') return { verdict: 'wrong', expected };
    if (!split) return { verdict: 'almost', note: 'article-missing', expected };
    if (split.article !== card.article.toLowerCase()) return { verdict: 'wrong', note: 'article-wrong', expected };
    return { ...word, expected };
  }
  return best(input, variants(card.term), code);
}

/** Grade suggested to the learner after a typed answer. */
export function suggestedGrade(r: CheckResult, lenientTypos: boolean): Grade {
  switch (r.verdict) {
    case 'correct':
      return 3;
    case 'typo':
      return lenientTypos ? 3 : 2;
    case 'almost':
      return 2;
    default:
      return 1;
  }
}
