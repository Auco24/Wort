import type { UiLang } from './types';
import { useStore } from './store';
import { STRINGS } from './strings';

export type PluralForms = { one: string; few?: string; many?: string; other: string };
export type Entry = Record<UiLang, string | PluralForms>;

const rules: Record<UiLang, Intl.PluralRules> = {
  ru: new Intl.PluralRules('ru'),
  en: new Intl.PluralRules('en'),
  de: new Intl.PluralRules('de'),
};

function fill(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function translate(ui: UiLang, key: string, vars?: Record<string, string | number>): string {
  const entry = (STRINGS as Record<string, Entry>)[key];
  if (!entry) return key;
  const v = entry[ui] ?? entry.en;
  if (typeof v === 'string') return fill(v, vars);
  const n = Number(vars?.n ?? 0);
  const cat = rules[ui].select(n) as keyof PluralForms;
  return fill(v[cat] ?? v.other, vars);
}

export type TFn = (key: string, vars?: Record<string, string | number>) => string;

export function useT(): TFn {
  const ui = useStore((s) => s.data.settings.uiLang);
  return (key, vars) => translate(ui, key, vars);
}
