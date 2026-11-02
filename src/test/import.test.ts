import { describe, expect, it } from 'vitest';
import { cardsToCsv, defaultMapping, parseTable, rowsToDrafts } from '../lib/importExport';
import type { Card } from '../types';

describe('import', () => {
  it('detects " - " separator and splits articles', () => {
    const t = parseTable('der Hund - собака\ndie Katze - кошка, киска\n');
    expect(t.sep).toBe(' - ');
    const drafts = rowsToDrafts(t.rows, defaultMapping(2, 'de'), 'de');
    expect(drafts[0]).toMatchObject({ term: 'Hund', article: 'der', translation: 'собака' });
    expect(drafts[1].translation).toBe('кошка, киска');
  });

  it('handles tabs, quotes and header rows', () => {
    const t = parseTable('word\ttranslation\treading\n食べる\tесть\tたべる\n');
    expect(t.headerMapping).toEqual(['term', 'translation', 'reading']);
    expect(rowsToDrafts(t.rows, t.headerMapping!, 'ja')[0]).toMatchObject({ term: '食べる', reading: 'たべる' });
    const q = parseTable('"hello, world",привет\n');
    expect(q.rows[0]).toEqual(['hello, world', 'привет']);
  });

  it('round-trips through CSV export', () => {
    const cards = [{ id: '1', deckId: 'd', term: 'Hund', article: 'der', translation: 'собака, пёс', tags: ['a'], createdAt: 0, srs: {} } as Card];
    const csv = cardsToCsv(cards);
    const t = parseTable(csv);
    const d = rowsToDrafts(t.rows, t.headerMapping!, 'de');
    expect(d[0]).toMatchObject({ term: 'Hund', article: 'der', translation: 'собака, пёс', tags: ['a'] });
  });
});
