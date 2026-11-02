import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  type Card as FsrsCard,
  type FSRS,
  type Grade as FsrsGrade,
} from 'ts-fsrs';
import type { Grade, SrsState } from '../types';

export interface SrsOptions {
  retention: number;
  maxIntervalDays: number;
}

let cache: { key: string; f: FSRS } | null = null;

function scheduler(opts: SrsOptions): FSRS {
  const key = `${opts.retention}|${opts.maxIntervalDays}`;
  if (!cache || cache.key !== key) {
    cache = {
      key,
      f: fsrs(
        generatorParameters({
          request_retention: opts.retention,
          maximum_interval: opts.maxIntervalDays,
          enable_fuzz: true,
          enable_short_term: true,
        }),
      ),
    };
  }
  return cache.f;
}

function toFsrs(s: SrsState): FsrsCard {
  return {
    ...s,
    due: new Date(s.due),
    last_review: s.last_review ? new Date(s.last_review) : undefined,
  };
}

function fromFsrs(c: FsrsCard): SrsState {
  return {
    due: c.due.toISOString(),
    stability: c.stability,
    difficulty: c.difficulty,
    elapsed_days: c.elapsed_days,
    scheduled_days: c.scheduled_days,
    learning_steps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state as SrsState['state'],
    last_review: c.last_review ? c.last_review.toISOString() : undefined,
  };
}

export function newSrs(now: Date = new Date()): SrsState {
  return fromFsrs(createEmptyCard(now));
}

export function review(s: SrsState | undefined, grade: Grade, now: Date, opts: SrsOptions): SrsState {
  const card = toFsrs(s ?? newSrs(now));
  const res = scheduler(opts).next(card, now, grade as FsrsGrade);
  return fromFsrs(res.card);
}

/** Time until the card would be due again for every grade, in ms. */
export function preview(s: SrsState | undefined, now: Date, opts: SrsOptions): Record<Grade, number> {
  const card = toFsrs(s ?? newSrs(now));
  const rec = scheduler(opts).repeat(card, now);
  const out = {} as Record<Grade, number>;
  for (const g of [1, 2, 3, 4] as Grade[]) {
    out[g] = rec[g as FsrsGrade].card.due.getTime() - now.getTime();
  }
  return out;
}

/** Probability (0..1) that the card is still remembered now. */
export function retrievability(s: SrsState | undefined, now: Date): number {
  if (!s || s.state === 0 || !s.last_review) return 0;
  const days = Math.max(0, (now.getTime() - new Date(s.last_review).getTime()) / 86_400_000);
  // FSRS-6 forgetting curve with the default decay.
  const decay = -0.1542;
  const factor = Math.pow(0.9, 1 / decay) - 1;
  return Math.pow(1 + (factor * days) / Math.max(s.stability, 0.01), decay);
}

/** A card counts as "mature" when its interval is three weeks or more (Anki convention). */
export function isMature(s: SrsState | undefined): boolean {
  return !!s && s.state === 2 && s.scheduled_days >= 21;
}

export type IntervalUnit = 'min' | 'h' | 'd' | 'mo' | 'y';

export function intervalParts(ms: number): { value: number; unit: IntervalUnit } {
  const min = ms / 60_000;
  if (min < 60) return { value: Math.max(1, Math.round(min)), unit: 'min' };
  const h = min / 60;
  if (h < 24) return { value: Math.round(h), unit: 'h' };
  const d = h / 24;
  if (d < 30) return { value: Math.round(d), unit: 'd' };
  if (d < 365) return { value: Math.round((d / 30) * 10) / 10, unit: 'mo' };
  return { value: Math.round((d / 365) * 10) / 10, unit: 'y' };
}
