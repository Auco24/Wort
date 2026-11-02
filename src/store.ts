import { create } from 'zustand';
import type { AppData, Card, Deck, Direction, Grade, LangCode, QueueItem, Settings, SrsState, StudyMode } from './types';
import { emptyData, migrate } from './lib/defaults';
import { loadRaw, saveRaw, saveRawSync } from './lib/storage';
import { review as srsReview } from './lib/srs';
import { uid } from './lib/id';
import type { CardDraft } from './lib/importExport';

export interface StudyConfig {
  deckIds: string[];
  mode: StudyMode;
  /** Practice without changing the schedule. */
  cram: boolean;
  cramDir: Direction | 'both';
  cramLimit: number;
  /** Only words from these categories / levels (card tags); empty = everything. */
  categories?: string[];
  levels?: string[];
}

export type View =
  | { name: 'home' }
  | { name: 'decks' }
  | { name: 'library' }
  | { name: 'deck'; deckId: string }
  | { name: 'add'; deckId?: string }
  | { name: 'import'; deckId?: string }
  | { name: 'study'; config: StudyConfig; queue?: QueueItem[] }
  | { name: 'stats' }
  | { name: 'settings' };

export interface UndoEntry {
  cardId: string;
  dir: Direction;
  prev: SrsState | undefined;
  logged: boolean;
}

interface Store {
  loaded: boolean;
  data: AppData;
  view: View;
  lastStudy: Omit<StudyConfig, 'deckIds'> | null;
  toast: { text: string; id: number } | null;

  init(): Promise<void>;
  go(view: View): void;
  notify(text: string): void;
  setSettings(patch: Partial<Settings>): void;

  addDeck(input: { name: string; language: LangCode; reverse?: boolean; description?: string }): Deck;
  updateDeck(id: string, patch: Partial<Deck>): void;
  deleteDeck(id: string): void;

  addCards(deckId: string, drafts: CardDraft[]): number;
  updateCard(id: string, patch: Partial<Card>): void;
  deleteCards(ids: string[]): void;
  setSuspended(ids: string[], suspended: boolean): void;
  resetProgress(ids: string[]): void;

  /** Applies an answer; returns what is needed to undo it. */
  answer(cardId: string, dir: Direction, grade: Grade, ms: number): UndoEntry | null;
  undo(entry: UndoEntry): void;

  replaceData(data: AppData): void;
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pending: string | null = null;

function scheduleSave(data: AppData) {
  pending = JSON.stringify(data);
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const json = pending;
    pending = null;
    saveTimer = null;
    if (json) void saveRaw(json);
  }, 400);
}

export function flushSave() {
  if (pending) {
    if (saveTimer) clearTimeout(saveTimer);
    saveRawSync(pending);
    pending = null;
  }
}

if (typeof window !== 'undefined') window.addEventListener('beforeunload', flushSave);

export const useStore = create<Store>((set, get) => {
  /** Immutable update of `data` followed by a debounced save. */
  const mutate = (fn: (d: AppData) => AppData) => {
    const data = fn(get().data);
    set({ data });
    scheduleSave(data);
  };

  return {
    loaded: false,
    data: emptyData(),
    view: { name: 'home' },
    lastStudy: null,
    toast: null,

    async init() {
      let data = emptyData();
      try {
        const raw = await loadRaw();
        if (raw) data = migrate(JSON.parse(raw));
      } catch (err) {
        console.error('Failed to load data', err);
      }
      set({ data, loaded: true });
    },

    go(view) {
      if (view.name === 'study') {
        const { deckIds: _ignored, ...rest } = view.config;
        void _ignored;
        set({ view, lastStudy: rest });
      } else set({ view });
    },

    notify(text) {
      set({ toast: { text, id: Date.now() } });
    },

    setSettings(patch) {
      mutate((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
    },

    addDeck({ name, language, reverse = true, description }) {
      const deck: Deck = { id: uid(), name: name.trim(), language, reverse, description, createdAt: Date.now() };
      mutate((d) => ({ ...d, decks: [...d.decks, deck] }));
      return deck;
    },

    updateDeck(id, patch) {
      mutate((d) => ({ ...d, decks: d.decks.map((x) => (x.id === id ? { ...x, ...patch, id } : x)) }));
    },

    deleteDeck(id) {
      mutate((d) => ({
        ...d,
        decks: d.decks.filter((x) => x.id !== id),
        cards: d.cards.filter((c) => c.deckId !== id),
      }));
    },

    addCards(deckId, drafts) {
      const now = Date.now();
      const cards: Card[] = drafts.map((dr, i) => ({
        id: uid(),
        deckId,
        term: dr.term.trim(),
        translation: dr.translation.trim(),
        reading: dr.reading?.trim() || undefined,
        article: dr.article?.trim() || undefined,
        pos: dr.pos,
        forms: dr.forms?.trim() || undefined,
        example: dr.example?.trim() || undefined,
        exampleTranslation: dr.exampleTranslation?.trim() || undefined,
        notes: dr.notes?.trim() || undefined,
        tags: dr.tags ?? [],
        // Keep the given order for "new card" introduction.
        createdAt: now + i,
        srs: {},
      }));
      mutate((d) => ({ ...d, cards: [...d.cards, ...cards] }));
      return cards.length;
    },

    updateCard(id, patch) {
      mutate((d) => ({ ...d, cards: d.cards.map((c) => (c.id === id ? { ...c, ...patch, id } : c)) }));
    },

    deleteCards(ids) {
      const set_ = new Set(ids);
      mutate((d) => ({ ...d, cards: d.cards.filter((c) => !set_.has(c.id)) }));
    },

    setSuspended(ids, suspended) {
      const set_ = new Set(ids);
      mutate((d) => ({ ...d, cards: d.cards.map((c) => (set_.has(c.id) ? { ...c, suspended } : c)) }));
    },

    resetProgress(ids) {
      const set_ = new Set(ids);
      mutate((d) => ({ ...d, cards: d.cards.map((c) => (set_.has(c.id) ? { ...c, srs: {} } : c)) }));
    },

    answer(cardId, dir, grade, ms) {
      const { data } = get();
      const card = data.cards.find((c) => c.id === cardId);
      if (!card) return null;
      const now = new Date();
      const prev = card.srs[dir];
      const next = srsReview(prev, grade, now, {
        retention: data.settings.retention,
        maxIntervalDays: data.settings.maxIntervalDays,
      });
      mutate((d) => ({
        ...d,
        cards: d.cards.map((c) => (c.id === cardId ? { ...c, srs: { ...c.srs, [dir]: next } } : c)),
        reviews: [
          ...d.reviews,
          { t: now.getTime(), c: cardId, k: card.deckId, d: dir, r: grade, s: prev?.state ?? 0, ms: Math.min(ms, 120_000) },
        ],
      }));
      return { cardId, dir, prev, logged: true };
    },

    undo(entry) {
      mutate((d) => {
        let reviews = d.reviews;
        if (entry.logged) {
          const idx = reviews.map((r) => r.c === entry.cardId && r.d === entry.dir).lastIndexOf(true);
          if (idx >= 0) reviews = [...reviews.slice(0, idx), ...reviews.slice(idx + 1)];
        }
        return {
          ...d,
          reviews,
          cards: d.cards.map((c) => {
            if (c.id !== entry.cardId) return c;
            const srs = { ...c.srs };
            if (entry.prev) srs[entry.dir] = entry.prev;
            else delete srs[entry.dir];
            return { ...c, srs };
          }),
        };
      });
    },

    replaceData(data) {
      mutate(() => data);
    },
  };
});

/** Convenience selectors. */
export const useData = () => useStore((s) => s.data);
export const useSettings = () => useStore((s) => s.data.settings);
