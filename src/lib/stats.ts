import type { AppData, Card, LangCode } from '../types';
import { addDays, dayKey, dayStart } from './day';
import { isMature } from './srs';
import { directions } from './queue';

/** Number of answers per study day. */
export function reviewsPerDay(data: AppData): Map<string, number> {
  const m = new Map<string, number>();
  for (const r of data.reviews) {
    const k = dayKey(r.t, data.settings.dayStartHour);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

/** Consecutive study days ending today (or yesterday, if today is not done yet). */
export function streak(data: AppData, now: Date, perDay = reviewsPerDay(data)): { days: number; today: boolean } {
  const h = data.settings.dayStartHour;
  const todayDone = (perDay.get(dayKey(now, h)) ?? 0) > 0;
  let d = dayStart(now, h);
  if (!todayDone) d = addDays(d, -1);
  let days = 0;
  while ((perDay.get(dayKey(d, h)) ?? 0) > 0) {
    days++;
    d = addDays(d, -1);
  }
  return { days, today: todayDone };
}

export interface CardBreakdown {
  new: number;
  learning: number;
  young: number;
  mature: number;
  suspended: number;
}

export function breakdown(cards: Card[]): CardBreakdown {
  const out: CardBreakdown = { new: 0, learning: 0, young: 0, mature: 0, suspended: 0 };
  for (const c of cards) {
    if (c.suspended) {
      out.suspended++;
      continue;
    }
    // A word's status is its forward (recognition) direction.
    const s = c.srs.fwd;
    if (!s || s.state === 0) out.new++;
    else if (s.state !== 2) out.learning++;
    else if (isMature(s)) out.mature++;
    else out.young++;
  }
  return out;
}

/** Share of successful answers for cards in review state during the last `days` days. */
export function retentionRate(data: AppData, now: Date, days = 30): number | null {
  const from = now.getTime() - days * 86_400_000;
  let total = 0;
  let ok = 0;
  for (const r of data.reviews) {
    if (r.t < from || r.s !== 2) continue;
    total++;
    if (r.r > 1) ok++;
  }
  return total ? ok / total : null;
}

/** Number of card directions that become due on each of the next `days` days. */
export function forecast(data: AppData, now: Date, days = 14): number[] {
  const h = data.settings.dayStartHour;
  const start = dayStart(now, h).getTime();
  const out = new Array(days).fill(0);
  const decks = new Map(data.decks.map((d) => [d.id, d]));
  for (const c of data.cards) {
    const deck = decks.get(c.deckId);
    if (!deck || c.suspended) continue;
    for (const dir of directions(deck)) {
      const s = c.srs[dir];
      if (!s || s.state === 0) continue;
      const idx = Math.floor((new Date(s.due).getTime() - start) / 86_400_000);
      if (idx < days) out[Math.max(0, idx)]++;
    }
  }
  return out;
}

export function wordsByLanguage(data: AppData): Map<LangCode, CardBreakdown> {
  const m = new Map<LangCode, CardBreakdown>();
  for (const deck of data.decks) {
    const b = breakdown(data.cards.filter((c) => c.deckId === deck.id));
    const cur = m.get(deck.language) ?? { new: 0, learning: 0, young: 0, mature: 0, suspended: 0 };
    m.set(deck.language, {
      new: cur.new + b.new,
      learning: cur.learning + b.learning,
      young: cur.young + b.young,
      mature: cur.mature + b.mature,
      suspended: cur.suspended + b.suspended,
    });
  }
  return m;
}

export function studyTimeToday(data: AppData, now: Date): number {
  const start = dayStart(now, data.settings.dayStartHour).getTime();
  let ms = 0;
  for (let i = data.reviews.length - 1; i >= 0 && data.reviews[i].t >= start; i--) ms += data.reviews[i].ms;
  return ms;
}
