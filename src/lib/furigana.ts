import { isKana, isKanji, toHiragana, tokenize } from 'wanakana';

export interface RubySegment {
  text: string;
  rt?: string;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Aligns a kana reading with a word written in kanji so furigana is only shown above kanji:
 *   食べる / たべる  →  [食(た)] [べる]
 *   引き出し / ひきだし  →  [引(ひ)] [き] [出(だ)] [し]
 * Falls back to one ruby over the whole word when alignment is impossible.
 */
export function furigana(term: string, reading?: string): RubySegment[] {
  if (!reading || !term || isKana(term) || ![...term].some((ch) => isKanji(ch))) return [{ text: term }];
  const tokens = (tokenize(term) as unknown[]).map(String).filter(Boolean);
  const pattern = tokens
    .map((tok) => (isKana(tok) ? escape(toHiragana(tok)) : '(.+?)'))
    .join('');
  const m = new RegExp(`^${pattern}$`).exec(toHiragana(reading));
  if (!m) return [{ text: term, rt: reading }];
  let group = 1;
  return tokens.map((tok) => (isKana(tok) ? { text: tok } : { text: tok, rt: m[group++] }));
}
