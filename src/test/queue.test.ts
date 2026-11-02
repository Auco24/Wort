import { describe, expect, it } from 'vitest';
import { buildQueue, deckCounts } from '../lib/queue';
import { emptyData } from '../lib/defaults';
import { review } from '../lib/srs';
import type { AppData, Card } from '../types';

function makeData(n: number): AppData {
  const d = emptyData();
  d.decks.push({ id: 'd1', name: 'Test', language: 'de', reverse: true, createdAt: 0 });
  for (let i = 0; i < n; i++) {
    d.cards.push({ id: `c${i}`, deckId: 'd1', term: `w${i}`, translation: `t${i}`, tags: [], createdAt: i, srs: {} } as Card);
  }
  d.settings.newPerDay = 5;
  return d;
}

describe('queue', () => {
  it('respects the daily new-card limit and introduces forward first', () => {
    const d = makeData(20);
    const q = buildQueue(d, ['d1'], new Date());
    expect(q).toHaveLength(5);
    expect(q.every((i) => i.dir === 'fwd')).toBe(true);
    expect(q.map((i) => i.cardId)).toEqual(['c0', 'c1', 'c2', 'c3', 'c4']);
  });

  it('counts new cards already introduced today', () => {
    const d = makeData(20);
    const now = new Date();
    d.reviews.push({ t: now.getTime() - 1000, c: 'c0', k: 'd1', d: 'fwd', r: 3, s: 0, ms: 1000 });
    d.cards[0].srs.fwd = review(undefined, 3, new Date(now.getTime() - 1000), { retention: 0.9, maxIntervalDays: 3650 });
    const c = deckCounts(d, d.decks[0], now);
    expect(c.newAvailable).toBe(4);
    const q = buildQueue(d, ['d1'], now);
    // c0 is a learning card due soon, plus 4 new ones
    expect(q.filter((i) => i.cardId === 'c0')).toHaveLength(1);
    expect(q).toHaveLength(5);
  });

  it('never puts both directions of a word in one session', () => {
    const d = makeData(3);
    const past = new Date(Date.now() - 30 * 86_400_000);
    for (const c of d.cards) {
      let s = review(undefined, 4, past, { retention: 0.9, maxIntervalDays: 3650 });
      s = { ...s, due: past.toISOString(), state: 2 };
      c.srs = { fwd: s, rev: s };
    }
    const q = buildQueue(d, ['d1'], new Date());
    expect(new Set(q.map((i) => i.cardId)).size).toBe(q.length);
    expect(q).toHaveLength(3);
  });
});
