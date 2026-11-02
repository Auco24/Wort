import type { LangCode, UiLang } from '../types';

export type Gender = 'm' | 'f' | 'n' | 'c';

export interface ArticleDef {
  value: string;
  gender: Gender;
}

export interface LangMeta {
  code: LangCode;
  name: Record<UiLang, string>;
  /** BCP-47 tag for speech synthesis. */
  tts: string;
  articles?: ArticleDef[];
  /** Characters offered as on-screen buttons while typing answers. */
  specialChars?: string[];
  /** Japanese: romaji → kana typing and furigana. */
  kana?: boolean;
  /** Infinitive particle that may be omitted in answers ("to", "att"). */
  infinitiveMarker?: string;
}

export const LANGUAGES: LangMeta[] = [
  {
    code: 'en',
    name: { ru: 'Английский', en: 'English', de: 'Englisch' },
    tts: 'en-US',
    infinitiveMarker: 'to',
  },
  {
    code: 'de',
    name: { ru: 'Немецкий', en: 'German', de: 'Deutsch' },
    tts: 'de-DE',
    articles: [
      { value: 'der', gender: 'm' },
      { value: 'die', gender: 'f' },
      { value: 'das', gender: 'n' },
    ],
    specialChars: ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'],
  },
  {
    code: 'sv',
    name: { ru: 'Шведский', en: 'Swedish', de: 'Schwedisch' },
    tts: 'sv-SE',
    articles: [
      { value: 'en', gender: 'c' },
      { value: 'ett', gender: 'n' },
    ],
    specialChars: ['å', 'ä', 'ö', 'Å', 'Ä', 'Ö'],
    infinitiveMarker: 'att',
  },
  {
    code: 'ja',
    name: { ru: 'Японский', en: 'Japanese', de: 'Japanisch' },
    tts: 'ja-JP',
    kana: true,
  },
  {
    code: 'fr',
    name: { ru: 'Французский', en: 'French', de: 'Französisch' },
    tts: 'fr-FR',
    articles: [
      { value: 'le', gender: 'm' },
      { value: 'la', gender: 'f' },
    ],
    specialChars: ['é', 'è', 'ê', 'à', 'â', 'ç', 'î', 'ô', 'ù', 'û', 'œ'],
  },
  {
    code: 'es',
    name: { ru: 'Испанский', en: 'Spanish', de: 'Spanisch' },
    tts: 'es-ES',
    articles: [
      { value: 'el', gender: 'm' },
      { value: 'la', gender: 'f' },
    ],
    specialChars: ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'],
  },
  {
    code: 'it',
    name: { ru: 'Итальянский', en: 'Italian', de: 'Italienisch' },
    tts: 'it-IT',
    articles: [
      { value: 'il', gender: 'm' },
      { value: 'la', gender: 'f' },
    ],
    specialChars: ['à', 'è', 'é', 'ì', 'ò', 'ù'],
  },
  {
    code: 'nl',
    name: { ru: 'Нидерландский', en: 'Dutch', de: 'Niederländisch' },
    tts: 'nl-NL',
    articles: [
      { value: 'de', gender: 'c' },
      { value: 'het', gender: 'n' },
    ],
    specialChars: ['é', 'ë', 'ï'],
  },
  {
    code: 'no',
    name: { ru: 'Норвежский', en: 'Norwegian', de: 'Norwegisch' },
    tts: 'nb-NO',
    articles: [
      { value: 'en', gender: 'm' },
      { value: 'ei', gender: 'f' },
      { value: 'et', gender: 'n' },
    ],
    specialChars: ['æ', 'ø', 'å'],
    infinitiveMarker: 'å',
  },
  {
    code: 'fi',
    name: { ru: 'Финский', en: 'Finnish', de: 'Finnisch' },
    tts: 'fi-FI',
    specialChars: ['ä', 'ö'],
  },
  {
    code: 'pt',
    name: { ru: 'Португальский', en: 'Portuguese', de: 'Portugiesisch' },
    tts: 'pt-BR',
    specialChars: ['ã', 'õ', 'á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'ô', 'ç', 'à'],
  },
  { code: 'ko', name: { ru: 'Корейский', en: 'Korean', de: 'Koreanisch' }, tts: 'ko-KR' },
  { code: 'zh', name: { ru: 'Китайский', en: 'Chinese', de: 'Chinesisch' }, tts: 'zh-CN' },
  { code: 'ru', name: { ru: 'Русский', en: 'Russian', de: 'Russisch' }, tts: 'ru-RU' },
];

export const PRIORITY_LANGS: LangCode[] = ['en', 'de', 'sv', 'ja'];

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));

export function lang(code: LangCode): LangMeta {
  return BY_CODE.get(code) ?? LANGUAGES[0];
}

export function genderOf(code: LangCode, article?: string): Gender | undefined {
  if (!article) return undefined;
  const a = article.trim().toLowerCase();
  return lang(code).articles?.find((x) => x.value === a)?.gender;
}

/**
 * Splits "der Hund" into article + word when the language has articles.
 * Returns null if the text does not start with a known article.
 */
export function splitArticle(code: LangCode, text: string): { article: string; rest: string } | null {
  const arts = lang(code).articles;
  if (!arts) return null;
  const m = /^(\S+)\s+(.+)$/.exec(text.trim());
  if (!m) return null;
  const found = arts.find((a) => a.value === m[1].toLowerCase());
  return found ? { article: found.value, rest: m[2] } : null;
}

export const UI_LANG_NAMES: Record<UiLang, string> = { ru: 'Русский', en: 'English', de: 'Deutsch' };
