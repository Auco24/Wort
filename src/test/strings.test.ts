import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { STRINGS } from '../strings';

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : [];
  });
}

describe('translations', () => {
  const keys = new Set(Object.keys(STRINGS));

  it('has every language for every key', () => {
    for (const [k, v] of Object.entries(STRINGS)) {
      for (const l of ['ru', 'en', 'de']) expect(v, `${k}.${l}`).toHaveProperty(l);
    }
  });

  it('defines every static key used in the code', () => {
    const src = files(join(__dirname, '..')).map((f) => readFileSync(f, 'utf8')).join('\n');
    const used = [...src.matchAll(/\bt\(\s*'([a-zA-Z0-9_.-]+)'/g)].map((m) => m[1]);
    const missing = [...new Set(used)].filter((k) => !keys.has(k));
    expect(missing).toEqual([]);
  });

  it('defines dynamic key families', () => {
    const families: Record<string, string[]> = {
      grade: ['1', '2', '3', '4'],
      ivl: ['min', 'h', 'd', 'mo', 'y'],
      mode: ['flip', 'type', 'choice', 'listen', 'mixed', 'flip.desc', 'type.desc', 'choice.desc', 'listen.desc', 'mixed.desc'],
      verdict: ['correct', 'typo', 'almost', 'wrong'],
      note: ['article-missing', 'article-wrong', 'diacritics', 'typo'],
      pos: ['noun', 'verb', 'adj', 'adv', 'phrase', 'other'],
      status: ['all', 'new', 'learning', 'young', 'mature', 'suspended'],
      theme: ['system', 'light', 'dark'],
      field: ['term', 'translation', 'reading', 'article', 'forms', 'example', 'notes', 'tags', 'skip'],
      dir: ['fwd', 'rev', 'both', 'fwd.short', 'rev.short'],
      home: ['morning', 'day', 'evening', 'night'],
      nav: ['home', 'decks', 'library', 'add', 'stats', 'settings'],
    };
    const missing = Object.entries(families).flatMap(([f, ks]) => ks.map((k) => `${f}.${k}`)).filter((k) => !keys.has(k));
    expect(missing).toEqual([]);
  });
});
