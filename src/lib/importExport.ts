import type { Card, LangCode } from '../types';
import { splitArticle } from './languages';

export type Field = 'term' | 'translation' | 'reading' | 'article' | 'forms' | 'example' | 'notes' | 'tags' | 'skip';

export const FIELDS: Field[] = ['term', 'translation', 'reading', 'article', 'forms', 'example', 'notes', 'tags', 'skip'];

export type CardDraft = Pick<Card, 'term' | 'translation'> &
  Partial<Pick<Card, 'reading' | 'article' | 'pos' | 'forms' | 'example' | 'exampleTranslation' | 'notes'>> & { tags: string[] };

/** Splits one CSV/TSV line, honouring "quoted, values". */
export function splitLine(line: string, sep: string): string[] {
  if (sep.length > 1) return line.split(sep).map((s) => s.trim());
  const out: string[] = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"' && cur.trim() === '') {
      quoted = true;
      cur = '';
    } else if (ch === sep) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

const SEPARATORS = ['\t', ';', ' — ', ' – ', ' - ', ' = ', '=', ','];

/** Picks the separator that splits most lines into at least two parts. */
export function detectSeparator(lines: string[]): string {
  const sample = lines.slice(0, 50);
  let bestSep = '\t';
  let bestScore = -1;
  for (const sep of SEPARATORS) {
    const score = sample.filter((l) => splitLine(l, sep).filter(Boolean).length >= 2).length;
    if (score > bestScore) {
      bestScore = score;
      bestSep = sep;
    }
    if (score === sample.length) break;
  }
  return bestSep;
}

const HEADER_ALIASES: Record<string, Field> = {
  term: 'term', word: 'term', front: 'term', wort: 'term', слово: 'term',
  translation: 'translation', meaning: 'translation', back: 'translation', перевод: 'translation', übersetzung: 'translation',
  reading: 'reading', чтение: 'reading', kana: 'reading', furigana: 'reading',
  article: 'article', артикль: 'article', artikel: 'article',
  forms: 'forms', формы: 'forms', formen: 'forms',
  example: 'example', пример: 'example', beispiel: 'example',
  notes: 'notes', заметки: 'notes', notizen: 'notes',
  tags: 'tags', теги: 'tags',
};

export interface ParsedTable {
  sep: string;
  rows: string[][];
  /** Mapping guessed from a header row (if there was one). */
  headerMapping: Field[] | null;
}

export function parseTable(text: string): ParsedTable {
  const lines = text
    .replace(/^﻿/, '')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.startsWith('#'));
  const sep = detectSeparator(lines);
  let rows = lines.map((l) => splitLine(l, sep));
  let headerMapping: Field[] | null = null;
  if (rows.length) {
    const mapped = rows[0].map((h) => HEADER_ALIASES[h.trim().toLowerCase()]);
    if (mapped.filter(Boolean).length >= 2 && mapped.includes('term')) {
      headerMapping = mapped.map((f) => f ?? 'skip');
      rows = rows.slice(1);
    }
  }
  return { sep, rows, headerMapping };
}

export function defaultMapping(columns: number, language: LangCode): Field[] {
  const extra: Field[] = language === 'ja' ? ['reading', 'example', 'notes'] : ['example', 'notes', 'forms'];
  return Array.from({ length: columns }, (_, i) => (i === 0 ? 'term' : i === 1 ? 'translation' : extra[i - 2] ?? 'skip'));
}

export function rowsToDrafts(rows: string[][], mapping: Field[], language: LangCode): CardDraft[] {
  const out: CardDraft[] = [];
  for (const row of rows) {
    const d: CardDraft = { term: '', translation: '', tags: [] };
    mapping.forEach((field, i) => {
      const v = (row[i] ?? '').trim();
      if (!v || field === 'skip') return;
      if (field === 'tags') d.tags = v.split(/[\s,]+/).filter(Boolean);
      else d[field] = v;
    });
    if (!d.article) {
      const split = splitArticle(language, d.term);
      if (split) {
        d.article = split.article;
        d.term = split.rest;
      }
    }
    if (d.term && d.translation) out.push(d);
  }
  return out;
}

const EXPORT_FIELDS: (keyof CardDraft)[] = ['term', 'translation', 'reading', 'article', 'forms', 'example', 'notes', 'tags'];

function csvCell(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function cardsToCsv(cards: Card[]): string {
  const lines = [EXPORT_FIELDS.join(',')];
  for (const c of cards) {
    lines.push(
      EXPORT_FIELDS.map((f) => {
        const v = c[f as keyof Card];
        return csvCell(Array.isArray(v) ? v.join(' ') : v == null ? '' : String(v));
      }).join(','),
    );
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
