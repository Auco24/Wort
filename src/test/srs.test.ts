import { describe, expect, it } from 'vitest';
import { intervalParts, newSrs, preview, review } from '../lib/srs';
import { furigana } from '../lib/furigana';

const opts = { retention: 0.9, maxIntervalDays: 3650 };

describe('srs', () => {
  it('moves a new card into learning and later into review', () => {
    const now = new Date('2026-01-01T10:00:00Z');
    let s = review(undefined, 3, now, opts);
    expect(s.state).toBe(1);
    expect(s.reps).toBe(1);
    // keep answering "Good" after each due date
    for (let i = 0; i < 4; i++) s = review(s, 3, new Date(s.due), opts);
    expect(s.state).toBe(2);
    expect(s.scheduled_days).toBeGreaterThan(1);
  });

  it('gives longer intervals for better grades', () => {
    const now = new Date('2026-01-01T10:00:00Z');
    const p = preview(newSrs(now), now, opts);
    expect(p[1]).toBeLessThan(p[3]);
    expect(p[3]).toBeLessThan(p[4]);
  });

  it('formats intervals', () => {
    expect(intervalParts(10 * 60_000)).toEqual({ value: 10, unit: 'min' });
    expect(intervalParts(3 * 86_400_000)).toEqual({ value: 3, unit: 'd' });
    expect(intervalParts(90 * 86_400_000).unit).toBe('mo');
  });
});

describe('furigana', () => {
  it('puts readings only above kanji', () => {
    expect(furigana('食べる', 'たべる')).toEqual([{ text: '食', rt: 'た' }, { text: 'べる' }]);
    expect(furigana('お金', 'おかね')).toEqual([{ text: 'お' }, { text: '金', rt: 'かね' }]);
    expect(furigana('日本語', 'にほんご')).toEqual([{ text: '日本語', rt: 'にほんご' }]);
    expect(furigana('ありがとう', '')).toEqual([{ text: 'ありがとう' }]);
  });
});
