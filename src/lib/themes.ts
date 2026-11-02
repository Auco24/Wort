import type { Theme } from '../types';

export interface ThemeInfo {
  id: Theme;
  dark: boolean;
  /** Swatches for the picker: background, surface, accent. */
  swatch: [string, string, string];
}

export const THEMES: ThemeInfo[] = [
  { id: 'system', dark: false, swatch: ['#f6f5f2', '#1e2128', '#4766e8'] },
  { id: 'light', dark: false, swatch: ['#f6f5f2', '#ffffff', '#4766e8'] },
  { id: 'dark', dark: true, swatch: ['#15171c', '#1e2128', '#7b91ff'] },
  { id: 'sepia', dark: false, swatch: ['#f3ead7', '#fbf6ea', '#b0631f'] },
  { id: 'ocean', dark: false, swatch: ['#eaf3f8', '#ffffff', '#0f8db0'] },
  { id: 'sakura', dark: false, swatch: ['#fbf1f4', '#ffffff', '#d4507a'] },
  { id: 'forest', dark: true, swatch: ['#0f1a16', '#16241f', '#4cc38a'] },
  { id: 'midnight', dark: true, swatch: ['#07080c', '#11131a', '#9a8bff'] },
];

/** The concrete palette to apply ("system" follows the OS light/dark setting). */
export function resolveTheme(theme: Theme, systemDark: boolean): Exclude<Theme, 'system'> {
  if (theme === 'system') return systemDark ? 'dark' : 'light';
  return theme;
}
