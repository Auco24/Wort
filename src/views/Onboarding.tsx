import { useState } from 'react';
import { BookOpen, Check } from 'lucide-react';
import type { LangCode, UiLang } from '../types';
import { useStore } from '../store';
import { translate } from '../i18n';
import { STARTER_DECKS, starterDrafts } from '../data/starter';
import { UI_LANG_NAMES, lang } from '../lib/languages';
import { Flag } from '../components/Flag';

export function Onboarding() {
  const settings = useStore((s) => s.data.settings);
  const { setSettings, addDeck, addCards } = useStore.getState();
  const [ui, setUi] = useState<UiLang>(settings.uiLang);
  const [native, setNative] = useState<UiLang>(settings.nativeLang);
  const [picked, setPicked] = useState<Set<LangCode>>(new Set(['en', 'de', 'sv', 'ja']));
  const t = (k: string, v?: Record<string, string | number>) => translate(ui, k, v);

  const toggle = (c: LangCode) =>
    setPicked((cur) => {
      const n = new Set(cur);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });

  const start = () => {
    for (const sd of STARTER_DECKS) {
      if (!picked.has(sd.language) || (sd.language === native)) continue;
      const deck = addDeck({ name: sd.name[ui], language: sd.language, reverse: true });
      addCards(deck.id, starterDrafts(sd, native));
    }
    setSettings({ uiLang: ui, nativeLang: native, onboarded: true });
  };

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="brand brand-lg">
          <BookOpen size={34} />
          <span>Wort</span>
        </div>
        <p className="lead">{t('onb.lead')}</p>

        <div className="form-grid">
          <label className="field">
            <span>{t('settings.uiLang')}</span>
            <select className="input" value={ui} onChange={(e) => setUi(e.target.value as UiLang)}>
              {(Object.keys(UI_LANG_NAMES) as UiLang[]).map((l) => (
                <option key={l} value={l}>
                  {UI_LANG_NAMES[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t('settings.nativeLang')}</span>
            <select className="input" value={native} onChange={(e) => setNative(e.target.value as UiLang)}>
              {(Object.keys(UI_LANG_NAMES) as UiLang[]).map((l) => (
                <option key={l} value={l}>
                  {UI_LANG_NAMES[l]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h3>{t('onb.pick')}</h3>
        <div className="lang-pick">
          {STARTER_DECKS.filter((d) => d.language !== native).map((d) => (
            <button key={d.language} className={'lang-tile' + (picked.has(d.language) ? ' on' : '')} onClick={() => toggle(d.language)}>
              <Flag code={d.language} size={36} />
              <strong>{lang(d.language).name[ui]}</strong>
              <small className="muted">{t('common.words', { n: d.rows.length })}</small>
              {picked.has(d.language) && (
                <span className="tick">
                  <Check size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="muted small">{t('onb.hint')}</p>
        <div className="row end">
          <button className="btn btn-primary btn-lg" onClick={start}>
            {t('onb.start')}
          </button>
        </div>
      </div>
    </div>
  );
}
