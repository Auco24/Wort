import type { AppData, Settings, UiLang } from '../types';

function guessUiLang(): UiLang {
  const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'ru';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('en')) return 'en';
  return 'ru';
}

export function defaultSettings(): Settings {
  const ui = guessUiLang();
  return {
    uiLang: ui,
    nativeLang: ui,
    theme: 'system',
    design: 'modern',
    fontScale: 1,
    newPerDay: 15,
    maxReviewsPerDay: 300,
    dailyGoal: 40,
    retention: 0.9,
    maxIntervalDays: 3650,
    dayStartHour: 4,
    autoplay: true,
    ttsRate: 0.95,
    voices: {},
    furiganaOnFront: false,
    lenientTypos: true,
    defaultMode: 'flip',
    onboarded: false,
  };
}

export function emptyData(): AppData {
  return { version: 1, decks: [], cards: [], reviews: [], settings: defaultSettings() };
}

/** Accepts anything that looks like Wort data and fills in missing fields. */
export function migrate(raw: unknown): AppData {
  const base = emptyData();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<AppData>;
  return {
    version: 1,
    decks: Array.isArray(r.decks) ? r.decks.map((d) => ({ ...d, reverse: d.reverse ?? true })) : [],
    cards: Array.isArray(r.cards) ? r.cards.map((c) => ({ ...c, tags: c.tags ?? [], srs: c.srs ?? {} })) : [],
    reviews: Array.isArray(r.reviews) ? r.reviews : [],
    settings: { ...base.settings, ...(r.settings ?? {}), voices: { ...(r.settings?.voices ?? {}) } },
  };
}

export function isAppData(raw: unknown): raw is AppData {
  return !!raw && typeof raw === 'object' && Array.isArray((raw as AppData).decks) && Array.isArray((raw as AppData).cards);
}
