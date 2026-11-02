import type { Card, LangCode } from '../types';
import { genderOf, lang } from '../lib/languages';
import { furigana } from '../lib/furigana';

/** A word as it should be displayed: coloured article (der/die/das, en/ett) or furigana for Japanese. */
export function Term({ card, code, showReading = true }: { card: Card; code: LangCode; showReading?: boolean }) {
  if (lang(code).kana) {
    const segs = furigana(card.term, card.reading);
    return (
      <span className="term" lang="ja">
        {segs.map((s, i) =>
          s.rt ? (
            <ruby key={i}>
              {s.text}
              <rt className={showReading ? '' : 'rt-hidden'}>{s.rt}</rt>
            </ruby>
          ) : (
            <span key={i}>{s.text}</span>
          ),
        )}
      </span>
    );
  }
  const gender = genderOf(code, card.article);
  return (
    <span className="term" lang={lang(code).tts} data-gender={gender}>
      {card.article && <span className="article">{card.article} </span>}
      <span className="word">{card.term}</span>
      {showReading && card.reading && <span className="reading-inline"> [{card.reading}]</span>}
    </span>
  );
}
