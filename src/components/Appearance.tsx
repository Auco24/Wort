import { Check } from 'lucide-react';
import type { Design, Theme } from '../types';
import { THEMES } from '../lib/themes';

type T = (key: string) => string;

/** Grid of colour themes with small previews. */
export function ThemePicker({ value, onChange, t }: { value: Theme; onChange(v: Theme): void; t: T }) {
  return (
    <div className="theme-grid">
      {THEMES.map((th) => (
        <button
          key={th.id}
          type="button"
          className={'theme-tile' + (value === th.id ? ' on' : '')}
          onClick={() => onChange(th.id)}
          aria-pressed={value === th.id}
        >
          <span className={'theme-preview' + (th.id === 'system' ? ' split' : '')} style={{ background: th.swatch[0] }}>
            <span className="tp-card" style={{ background: th.swatch[1] }}>
              <span className="tp-line" style={{ background: th.swatch[2] }} />
              <span className="tp-line short" style={{ background: th.dark ? '#ffffff33' : '#00000022' }} />
            </span>
          </span>
          <span className="theme-name">{t(`theme.${th.id}`)}</span>
          {value === th.id && (
            <span className="tick">
              <Check size={12} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Classic (flat, calm) or modern (glass, gradients, rounder shapes). */
export function DesignPicker({ value, onChange, t }: { value: Design; onChange(v: Design): void; t: T }) {
  return (
    <div className="design-grid">
      {(['modern', 'classic'] as Design[]).map((d) => (
        <button key={d} type="button" className={'design-tile' + (value === d ? ' on' : '')} onClick={() => onChange(d)} aria-pressed={value === d}>
          <span className={`design-preview dp-${d}`}>
            <span className="dp-side" />
            <span className="dp-main">
              <span className="dp-card" />
              <span className="dp-btn" />
            </span>
          </span>
          <strong>{t(`design.${d}`)}</strong>
          <small className="muted">{t(`design.${d}.desc`)}</small>
        </button>
      ))}
    </div>
  );
}
