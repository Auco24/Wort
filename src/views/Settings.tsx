import { useEffect, useState } from 'react';
import { Download, FolderOpen, Play, Upload } from 'lucide-react';
import type { LangCode, Settings, StudyMode, Theme, UiLang } from '../types';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { PRIORITY_LANGS, UI_LANG_NAMES, lang } from '../lib/languages';
import { onVoicesChanged, speak, ttsSupported, voicesFor } from '../lib/tts';
import { desktop, exportText, importText } from '../lib/storage';
import { isAppData, migrate } from '../lib/defaults';
import { Confirm } from '../components/Modal';
import { Flag } from '../components/Flag';
import { MODES } from '../components/StudySetup';

const SAMPLE: Partial<Record<LangCode, string>> = {
  en: 'Good morning! How are you today?',
  de: 'Guten Morgen! Wie geht es dir heute?',
  sv: 'God morgon! Hur mår du idag?',
  ja: 'おはようございます。お元気ですか。',
};

function Num({ value, min, max, step = 1, onChange }: { value: number; min: number; max: number; step?: number; onChange(n: number): void }) {
  return (
    <input
      className="input input-narrow"
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
      }}
    />
  );
}

function Voices() {
  const t = useT();
  const data = useData();
  const set = useStore((s) => s.setSettings);
  const [, force] = useState(0);
  useEffect(() => onVoicesChanged(() => force((n) => n + 1)), []);
  const langs = Array.from(new Set([...PRIORITY_LANGS, ...data.decks.map((d) => d.language)]));
  if (!ttsSupported()) return <p className="muted">{t('settings.noTts')}</p>;
  return (
    <div className="voice-list">
      {langs.map((code) => {
        const list = voicesFor(code);
        return (
          <div key={code} className="voice-row">
            <Flag code={code} />
            <span className="voice-lang">{lang(code).name[data.settings.uiLang]}</span>
            {list.length ? (
              <select
                className="input"
                value={data.settings.voices[code] ?? ''}
                onChange={(e) => set({ voices: { ...data.settings.voices, [code]: e.target.value || undefined } })}
              >
                <option value="">{t('settings.voiceAuto')}</option>
                {list.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="warn small grow">{t('settings.noVoice')}</span>
            )}
            <button
              className="icon-btn"
              disabled={!list.length}
              onClick={() => speak(SAMPLE[code] ?? lang(code).name[data.settings.uiLang], code, { rate: data.settings.ttsRate, voiceUri: data.settings.voices[code] })}
            >
              <Play size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function SettingsView() {
  const t = useT();
  const data = useData();
  const s = data.settings;
  const { setSettings, replaceData, notify } = useStore.getState();
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof migrate> | null>(null);
  const [info, setInfo] = useState<{ version: string; dataPath: string } | null>(null);
  const set = (patch: Partial<Settings>) => setSettings(patch);

  useEffect(() => {
    desktop()?.info().then(setInfo).catch(() => {});
  }, []);

  const backup = async () => {
    const stamp = new Date().toISOString().slice(0, 10);
    if (await exportText(`wort-backup-${stamp}.json`, JSON.stringify(data, null, 1), [{ name: 'Wort backup', extensions: ['json'] }]))
      notify(t('settings.backupDone'));
  };

  const restore = async () => {
    const f = await importText([{ name: 'Wort backup', extensions: ['json'] }]);
    if (!f) return;
    try {
      const raw = JSON.parse(f.content);
      if (!isAppData(raw)) throw new Error('bad');
      setPendingImport(migrate(raw));
    } catch {
      notify(t('settings.restoreBad'));
    }
  };

  return (
    <div className="page page-narrow">
      <header className="page-head">
        <h1>{t('nav.settings')}</h1>
      </header>

      <section className="panel settings">
        <h3 className="section-title">{t('settings.general')}</h3>
        <div className="setting">
          <span>{t('settings.uiLang')}</span>
          <select className="input" value={s.uiLang} onChange={(e) => set({ uiLang: e.target.value as UiLang })}>
            {(Object.keys(UI_LANG_NAMES) as UiLang[]).map((l) => (
              <option key={l} value={l}>
                {UI_LANG_NAMES[l]}
              </option>
            ))}
          </select>
        </div>
        <div className="setting">
          <span>
            {t('settings.nativeLang')}
            <small className="muted">{t('settings.nativeLang.desc')}</small>
          </span>
          <select className="input" value={s.nativeLang} onChange={(e) => set({ nativeLang: e.target.value as UiLang })}>
            {(Object.keys(UI_LANG_NAMES) as UiLang[]).map((l) => (
              <option key={l} value={l}>
                {UI_LANG_NAMES[l]}
              </option>
            ))}
          </select>
        </div>
        <div className="setting">
          <span>{t('settings.theme')}</span>
          <div className="seg">
            {(['system', 'light', 'dark'] as Theme[]).map((th) => (
              <button key={th} className={s.theme === th ? 'on' : ''} onClick={() => set({ theme: th })}>
                {t(`theme.${th}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="setting">
          <span>{t('settings.fontScale')}</span>
          <div className="seg">
            {[0.9, 1, 1.1, 1.25].map((f) => (
              <button key={f} className={s.fontScale === f ? 'on' : ''} onClick={() => set({ fontScale: f })}>
                {Math.round(f * 100)}%
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel settings">
        <h3 className="section-title">{t('settings.study')}</h3>
        <div className="setting">
          <span>{t('settings.defaultMode')}</span>
          <select className="input" value={s.defaultMode} onChange={(e) => set({ defaultMode: e.target.value as StudyMode })}>
            {MODES.map((m) => (
              <option key={m.mode} value={m.mode}>
                {t(`mode.${m.mode}`)}
              </option>
            ))}
          </select>
        </div>
        <div className="setting">
          <span>{t('settings.newPerDay')}</span>
          <Num value={s.newPerDay} min={0} max={500} onChange={(n) => set({ newPerDay: n })} />
        </div>
        <div className="setting">
          <span>{t('settings.maxReviews')}</span>
          <Num value={s.maxReviewsPerDay} min={10} max={5000} step={10} onChange={(n) => set({ maxReviewsPerDay: n })} />
        </div>
        <div className="setting">
          <span>{t('settings.dailyGoal')}</span>
          <Num value={s.dailyGoal} min={5} max={1000} step={5} onChange={(n) => set({ dailyGoal: n })} />
        </div>
        <div className="setting">
          <span>
            {t('settings.retention', { n: Math.round(s.retention * 100) })}
            <small className="muted">{t('settings.retention.desc')}</small>
          </span>
          <input
            type="range"
            min={0.8}
            max={0.97}
            step={0.01}
            value={s.retention}
            onChange={(e) => set({ retention: Number(e.target.value) })}
          />
        </div>
        <div className="setting">
          <span>{t('settings.dayStart')}</span>
          <Num value={s.dayStartHour} min={0} max={12} onChange={(n) => set({ dayStartHour: n })} />
        </div>
        <label className="setting">
          <span>
            {t('settings.lenient')}
            <small className="muted">{t('settings.lenient.desc')}</small>
          </span>
          <input type="checkbox" checked={s.lenientTypos} onChange={(e) => set({ lenientTypos: e.target.checked })} />
        </label>
        <label className="setting">
          <span>
            {t('settings.furigana')}
            <small className="muted">{t('settings.furigana.desc')}</small>
          </span>
          <input type="checkbox" checked={s.furiganaOnFront} onChange={(e) => set({ furiganaOnFront: e.target.checked })} />
        </label>
      </section>

      <section className="panel settings">
        <h3 className="section-title">{t('settings.audio')}</h3>
        <label className="setting">
          <span>{t('settings.autoplay')}</span>
          <input type="checkbox" checked={s.autoplay} onChange={(e) => set({ autoplay: e.target.checked })} />
        </label>
        <div className="setting">
          <span>{t('settings.rate', { n: s.ttsRate.toFixed(2) })}</span>
          <input type="range" min={0.5} max={1.3} step={0.05} value={s.ttsRate} onChange={(e) => set({ ttsRate: Number(e.target.value) })} />
        </div>
        <Voices />
        <p className="muted small">{t('settings.voiceHelp')}</p>
      </section>

      <section className="panel settings">
        <h3 className="section-title">{t('settings.data')}</h3>
        <div className="row gap wrap">
          <button className="btn" onClick={backup}>
            <Download size={16} /> {t('settings.backup')}
          </button>
          <button className="btn" onClick={restore}>
            <Upload size={16} /> {t('settings.restore')}
          </button>
          {desktop() && (
            <button className="btn" onClick={() => desktop()?.openDataFolder()}>
              <FolderOpen size={16} /> {t('settings.openFolder')}
            </button>
          )}
        </div>
        <p className="muted small">
          {t('settings.autoBackup')}
          {info && (
            <>
              <br />
              {info.dataPath} · Wort {info.version}
            </>
          )}
        </p>
      </section>

      {pendingImport && (
        <Confirm
          title={t('settings.restore')}
          text={t('settings.restoreConfirm', { decks: pendingImport.decks.length, cards: pendingImport.cards.length })}
          confirmLabel={t('settings.restore')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            replaceData({ ...pendingImport, settings: { ...pendingImport.settings, onboarded: true } });
            notify(t('settings.restoreDone'));
          }}
          onClose={() => setPendingImport(null)}
        />
      )}
    </div>
  );
}
