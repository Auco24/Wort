import type { AppData, Card, Deck, Direction, QueueItem, SrsState } from '../types';
import { dayStart, nextDayStart } from './day';

/** Learning cards due within this window may be shown a bit early. */
export const LEARN_AHEAD_MS = 20 * 60_000;

export function directions(deck: Deck): Direction[] {
  return deck.reverse ? ['fwd', 'rev'] : ['fwd'];
}

export function isNew(s: SrsState | undefined): boolean {
  return !s || s.state === 0;
}

/**
 * Whether a card direction is due. Review cards are due for the whole study day,
 * learning cards only when their (short) step has elapsed.
 */
export function isDue(s: SrsState | undefined, now: Date, dayStartHour: number): boolean {
  if (isNew(s)) return false;
  const due = new Date(s!.due).getTime();
  if (s!.state === 2) return due < nextDayStart(now, dayStartHour).getTime();
  return due <= now.getTime() + LEARN_AHEAD_MS;
}

/** The reverse direction is introduced only after the word was seen in the forward one. */
function canIntroduce(card: Card, dir: Direction): boolean {
  return dir === 'fwd' || !isNew(card.srs.fwd);
}

export interface TodayCounts {
  newDone: number;
  reviewsDone: number;
  /** Reviews done today per deck id. */
  newByDeck: Map<string, number>;
}

export function todayCounts(data: AppData, now: Date): TodayCounts {
  const start = dayStart(now, data.settings.dayStartHour).getTime();
  const newByDeck = new Map<string, number>();
  let newDone = 0;
  let reviewsDone = 0;
  for (let i = data.reviews.length - 1; i >= 0; i--) {
    const r = data.reviews[i];
    if (r.t < start) break;
    reviewsDone++;
    if (r.s === 0) {
      newDone++;
      newByDeck.set(r.k, (newByDeck.get(r.k) ?? 0) + 1);
    }
  }
  return { newDone, reviewsDone, newByDeck };
}

export interface DeckCounts {
  due: number;
  learning: number;
  newAvailable: number;
  newTotal: number;
  total: number;
}

export function deckCounts(data: AppData, deck: Deck, now: Date, today = todayCounts(data, now)): DeckCounts {
  const dirs = directions(deck);
  let due = 0;
  let learning = 0;
  let newTotal = 0;
  let total = 0;
  for (const c of data.cards) {
    if (c.deckId !== deck.id || c.suspended) continue;
    total++;
    // Mirrors buildQueue: at most one direction of a word per day, due cards before new ones.
    const dueDir = dirs.find((d) => !isNew(c.srs[d]) && isDue(c.srs[d], now, data.settings.dayStartHour));
    if (dueDir) {
      if (c.srs[dueDir]!.state === 2) due++;
      else learning++;
    } else if (dirs.some((d) => isNew(c.srs[d]) && canIntroduce(c, d))) newTotal++;
  }
  const limit = deck.newPerDay ?? data.settings.newPerDay;
  const left = Math.max(0, limit - (today.newByDeck.get(deck.id) ?? 0));
  return { due, learning, newAvailable: Math.min(left, newTotal), newTotal, total };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds today's study queue for the given decks:
 * due learning cards first, then reviews (most overdue first) with new cards spread evenly between them.
 * Two directions of the same word are never put in the same session.
 */
export function buildQueue(data: AppData, deckIds: string[], now: Date, filter?: (c: Card) => boolean): QueueItem[] {
  const today = todayCounts(data, now);
  const decks = data.decks.filter((d) => deckIds.includes(d.id));
  const learning: { item: QueueItem; due: number }[] = [];
  const reviews: { item: QueueItem; due: number }[] = [];
  const fresh: QueueItem[] = [];
  const used = new Set<string>();

  for (const deck of decks) {
    const dirs = directions(deck);
    const limit = deck.newPerDay ?? data.settings.newPerDay;
    let newLeft = Math.max(0, limit - (today.newByDeck.get(deck.id) ?? 0));
    const cards = data.cards.filter((c) => c.deckId === deck.id && !c.suspended && (!filter || filter(c)));

    for (const c of cards) {
      for (const d of dirs) {
        const s = c.srs[d];
        if (!isNew(s) && isDue(s, now, data.settings.dayStartHour) && !used.has(c.id)) {
          (s!.state === 2 ? reviews : learning).push({ item: { cardId: c.id, dir: d }, due: new Date(s!.due).getTime() });
          used.add(c.id);
        }
      }
    }
    for (const c of [...cards].sort((a, b) => a.createdAt - b.createdAt)) {
      if (newLeft <= 0) break;
      if (used.has(c.id)) continue;
      const d = dirs.find((dir) => isNew(c.srs[dir]) && canIntroduce(c, dir));
      if (!d) continue;
      fresh.push({ cardId: c.id, dir: d });
      used.add(c.id);
      newLeft--;
    }
  }

  const reviewLeft = Math.max(0, data.settings.maxReviewsPerDay - (today.reviewsDone - today.newDone));
  const revItems = shuffle(reviews)
    .sort((a, b) => a.due - b.due)
    .slice(0, reviewLeft)
    .map((r) => r.item);
  // Keep the order of most overdue first, but mix inside one day so it does not feel mechanical.
  const mixedReviews = shuffle(revItems.slice(0, 50)).concat(revItems.slice(50));

  const out: QueueItem[] = learning.sort((a, b) => a.due - b.due).map((l) => l.item);
  if (!fresh.length) return out.concat(mixedReviews);
  const gap = Math.max(1, Math.floor(mixedReviews.length / fresh.length));
  let n = 0;
  for (let i = 0; i < mixedReviews.length; i++) {
    out.push(mixedReviews[i]);
    if ((i + 1) % gap === 0 && n < fresh.length) out.push(fresh[n++]);
  }
  while (n < fresh.length) out.push(fresh[n++]);
  return out;
}

/** Practice queue that ignores scheduling ("cram"): every card of the decks, shuffled. */
export function buildCramQueue(
  data: AppData,
  deckIds: string[],
  dir: Direction | 'both',
  limit = 0,
  filter?: (c: Card) => boolean,
): QueueItem[] {
  const items: QueueItem[] = [];
  for (const c of data.cards) {
    if (!deckIds.includes(c.deckId) || c.suspended || (filter && !filter(c))) continue;
    const d: Direction = dir === 'both' ? (Math.random() < 0.5 ? 'fwd' : 'rev') : dir;
    items.push({ cardId: c.id, dir: d });
  }
  const shuffled = shuffle(items);
  return limit > 0 ? shuffled.slice(0, limit) : shuffled;
}

/** Cards matching any of the chosen categories and any of the chosen levels (empty list = no restriction). */
export function tagFilter(categories?: string[], levels?: string[]): ((c: Card) => boolean) | undefined {
  const cats = categories?.length ? new Set(categories) : null;
  const lvls = levels?.length ? new Set(levels) : null;
  if (!cats && !lvls) return undefined;
  return (c) => (!cats || c.tags.some((t) => cats.has(t))) && (!lvls || c.tags.some((t) => lvls.has(t)));
}
