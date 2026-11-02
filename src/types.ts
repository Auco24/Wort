export type LangCode =
  | 'en' | 'de' | 'sv' | 'ja'
  | 'fr' | 'es' | 'it' | 'nl' | 'no' | 'fi' | 'pt' | 'ko' | 'zh' | 'ru';

/** Languages the interface is translated into (also used as "native" language for translations). */
export type UiLang = 'ru' | 'en' | 'de';

/** Recognition (word → meaning) or production (meaning → word). Each has its own schedule. */
export type Direction = 'fwd' | 'rev';

export type PartOfSpeech = 'noun' | 'verb' | 'adj' | 'adv' | 'phrase' | 'other';

/** 1 = Again, 2 = Hard, 3 = Good, 4 = Easy (same numbers as FSRS/Anki). */
export type Grade = 1 | 2 | 3 | 4;

/** FSRS card state, serialised with ISO date strings. */
export interface SrsState {
  due: string;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  /** 0 New, 1 Learning, 2 Review, 3 Relearning */
  state: 0 | 1 | 2 | 3;
  last_review?: string;
}

export interface Card {
  id: string;
  deckId: string;
  /** Word or phrase in the language being learned (kanji form for Japanese). */
  term: string;
  /** Kana reading for Japanese, pronunciation hint for other languages. */
  reading?: string;
  /** Grammatical article / gender word: der/die/das, en/ett, le/la … */
  article?: string;
  pos?: PartOfSpeech;
  /** Meaning in the learner's own language. Several meanings separated by commas. */
  translation: string;
  /** Grammar forms: plural, verb forms, etc. */
  forms?: string;
  example?: string;
  exampleTranslation?: string;
  notes?: string;
  tags: string[];
  createdAt: number;
  suspended?: boolean;
  srs: Partial<Record<Direction, SrsState>>;
}

export interface Deck {
  id: string;
  name: string;
  language: LangCode;
  description?: string;
  /** Also practise meaning → word. */
  reverse: boolean;
  /** Overrides the global "new cards per day" setting. */
  newPerDay?: number;
  createdAt: number;
}

export interface ReviewLog {
  /** Timestamp (ms). */
  t: number;
  /** Card id. */
  c: string;
  /** Deck id (kept so statistics survive card deletion). */
  k: string;
  d: Direction;
  r: Grade;
  /** Card state before the answer. */
  s: 0 | 1 | 2 | 3;
  /** Time spent on the card, ms. */
  ms: number;
}

export type StudyMode = 'flip' | 'type' | 'choice' | 'listen' | 'mixed';
export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  uiLang: UiLang;
  nativeLang: UiLang;
  theme: Theme;
  fontScale: number;
  newPerDay: number;
  maxReviewsPerDay: number;
  dailyGoal: number;
  retention: number;
  maxIntervalDays: number;
  dayStartHour: number;
  autoplay: boolean;
  ttsRate: number;
  voices: Partial<Record<LangCode, string>>;
  furiganaOnFront: boolean;
  lenientTypos: boolean;
  defaultMode: StudyMode;
  onboarded: boolean;
}

export interface AppData {
  version: 1;
  decks: Deck[];
  cards: Card[];
  reviews: ReviewLog[];
  settings: Settings;
}

export interface QueueItem {
  cardId: string;
  dir: Direction;
}
