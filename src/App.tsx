import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, Home, Layers, Plus, Settings as SettingsIcon } from 'lucide-react';
import { useStore } from './store';
import { useT } from './i18n';
import { HomeView } from './views/Home';
import { DecksView } from './views/Decks';
import { DeckView } from './views/DeckView';
import { AddWordsView } from './views/AddWords';
import { ImportView } from './views/Import';
import { StudyView } from './views/Study';
import { StatsView } from './views/Stats';
import { SettingsView } from './views/Settings';
import { Onboarding } from './views/Onboarding';
import type { View } from './store';

function useTheme() {
  const theme = useStore((s) => s.data.settings.theme);
  const scale = useStore((s) => s.data.settings.fontScale);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
  useEffect(() => {
    document.documentElement.style.fontSize = `${Math.round(16 * scale)}px`;
  }, [scale]);
}

function Toast() {
  const toast = useStore((s) => s.toast);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast || !visible) return null;
  return (
    <div className="toast" role="status">
      {toast.text}
    </div>
  );
}

const NAV: { view: View['name']; icon: typeof Home; key: string }[] = [
  { view: 'home', icon: Home, key: 'nav.home' },
  { view: 'decks', icon: Layers, key: 'nav.decks' },
  { view: 'add', icon: Plus, key: 'nav.add' },
  { view: 'stats', icon: BarChart3, key: 'nav.stats' },
  { view: 'settings', icon: SettingsIcon, key: 'nav.settings' },
];

function Sidebar() {
  const t = useT();
  const view = useStore((s) => s.view);
  const go = useStore((s) => s.go);
  const active = view.name === 'deck' || view.name === 'import' ? 'decks' : view.name;
  return (
    <nav className="sidebar">
      <div className="brand">
        <BookOpen size={22} />
        <span>Wort</span>
      </div>
      {NAV.map(({ view: v, icon: Icon, key }, i) => (
        <button
          key={v}
          className={'nav-item' + (active === v ? ' active' : '')}
          onClick={() => go({ name: v } as View)}
          title={`${t(key)} (Ctrl+${i + 1})`}
        >
          <Icon size={19} />
          <span>{t(key)}</span>
        </button>
      ))}
    </nav>
  );
}

export function App() {
  const loaded = useStore((s) => s.loaded);
  const init = useStore((s) => s.init);
  const view = useStore((s) => s.view);
  const go = useStore((s) => s.go);
  const onboarded = useStore((s) => s.data.settings.onboarded);
  useTheme();

  useEffect(() => {
    void init();
  }, [init]);

  // Ctrl+1…5 switches sections (not during a study session).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.ctrlKey || e.altKey || e.shiftKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= NAV.length && useStore.getState().view.name !== 'study') {
        e.preventDefault();
        go({ name: NAV[n - 1].view } as View);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (!loaded) return <div className="splash">Wort</div>;
  if (!onboarded) return <Onboarding />;

  if (view.name === 'study') {
    return (
      <div className="app app-focus">
        <StudyView key={JSON.stringify(view.config)} config={view.config} queue={view.queue} />
        <Toast />
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        {view.name === 'home' && <HomeView />}
        {view.name === 'decks' && <DecksView />}
        {view.name === 'deck' && <DeckView deckId={view.deckId} />}
        {view.name === 'add' && <AddWordsView deckId={view.deckId} />}
        {view.name === 'import' && <ImportView deckId={view.deckId} />}
        {view.name === 'stats' && <StatsView />}
        {view.name === 'settings' && <SettingsView />}
      </main>
      <Toast />
    </div>
  );
}
