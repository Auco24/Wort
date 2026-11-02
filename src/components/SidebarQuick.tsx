import { Moon, Palette, Sun } from 'lucide-react';
import type { UiLang } from '../types';
import { useStore } from '../store';
import { useT } from '../i18n';
import { THEMES } from '../lib/themes';

const LANGS: UiLang[] = ['ru', 'en', 'de'];

/** Bottom of the sidebar: interface language and a one-click theme switch. */
export function SidebarQuick() {
  const t = useT();
  const s = useStore((st) => st.data.settings);
  const set = useStore((st) => st.setSettings);
  const go = useStore((st) => st.go);
  const current = THEMES.find((x) => x.id === s.theme) ?? THEMES[0];
  const systemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = s.theme === 'system' ? systemDark : current.dark;

  return (
    <div className="sidebar-quick">
      <div className="seg seg-sm" role="group" aria-label={t('settings.uiLang')}>
        {LANGS.map((l) => (
          <button key={l} className={s.uiLang === l ? 'on' : ''} onClick={() => set({ uiLang: l })} title={t('settings.uiLang')}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="row gap-xs">
        <button
          className="icon-btn"
          title={isDark ? t('theme.light') : t('theme.dark')}
          onClick={() => set({ theme: isDark ? 'light' : 'dark' })}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="icon-btn" title={t('settings.appearance')} onClick={() => go({ name: 'settings' })}>
          <Palette size={18} />
        </button>
      </div>
    </div>
  );
}
