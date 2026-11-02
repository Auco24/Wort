import { useMemo, useState } from 'react';
import { Ear, Keyboard, ListChecks, RotateCcw, Shuffle } from 'lucide-react';
import type { Direction, StudyMode } from '../types';
import { useData, useStore, type StudyConfig } from '../store';
import { useT } from '../i18n';
import { Modal } from './Modal';
import { Flag } from './Flag';
import { buildCramQueue, buildQueue, tagFilter } from '../lib/queue';
import { CATEGORIES, LEVELS } from '../data/library/categories';

export const MODES: { mode: StudyMode; icon: typeof Ear }[] = [
  { mode: 'flip', icon: RotateCcw },
  { mode: 'type', icon: Keyboard },
  { mode: 'choice', icon: ListChecks },
  { mode: 'listen', icon: Ear },
  { mode: 'mixed', icon: Shuffle },
];

/** Starts a session; shows a message instead when there is nothing to study. */
export function startStudy(config: StudyConfig, nothingText: string): boolean {
  const { data, go, notify } = useStore.getState();
  const filter = tagFilter(config.categories, config.levels);
  const queue = config.cram
    ? buildCramQueue(data, config.deckIds, config.cramDir, config.cramLimit, filter)
    : buildQueue(data, config.deckIds, new Date(), filter);
  if (!queue.length) {
    notify(nothingText);
    return false;
  }
  go({ name: 'study', config, queue });
  return true;
}

export function StudySetup({ deckIds: initialIds, cram: initialCram = false, onClose }: { deckIds: string[]; cram?: boolean; onClose(): void }) {
  const t = useT();
  const data = useData();
  const last = useStore((s) => s.lastStudy);
  const [ids, setIds] = useState<Set<string>>(new Set(initialIds));
  const [mode, setMode] = useState<StudyMode>(last?.mode ?? data.settings.defaultMode);
  const [cram, setCram] = useState(initialCram);
  const [dir, setDir] = useState<Direction | 'both'>(last?.cramDir ?? 'fwd');
  const [limit, setLimit] = useState(last?.cramLimit ?? 20);
  const [cats, setCats] = useState<Set<string>>(new Set());
  const [levels, setLevels] = useState<Set<string>>(new Set());

  // Categories and levels that actually occur in the chosen decks.
  const present = useMemo(() => {
    const tags = new Set<string>();
    for (const c of data.cards) if (ids.has(c.deckId)) c.tags.forEach((t) => tags.add(t));
    return {
      cats: CATEGORIES.filter((c) => tags.has(c.id)),
      levels: LEVELS.filter((l) => tags.has(l)),
    };
  }, [data.cards, ids]);

  const catList = [...cats].filter((c) => present.cats.some((p) => p.id === c));
  const levelList = [...levels].filter((l) => (present.levels as string[]).includes(l));

  const count = useMemo(() => {
    const list = [...ids];
    const filter = tagFilter(catList, levelList);
    return cram ? buildCramQueue(data, list, dir, limit, filter).length : buildQueue(data, list, new Date(), filter).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, ids, cram, dir, limit, catList.join(), levelList.join()]);

  const toggleIn = (setter: typeof setCats, value: string) =>
    setter((cur) => {
      const n = new Set(cur);
      if (n.has(value)) n.delete(value);
      else n.add(value);
      return n;
    });

  const toggle = (id: string) =>
    setIds((cur) => {
      const n = new Set(cur);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const start = () => {
    if (
      startStudy(
        { deckIds: [...ids], mode, cram, cramDir: dir, cramLimit: limit, categories: catList, levels: levelList },
        t('study.nothing'),
      )
    )
      onClose();
  };

  return (
    <Modal title={t('setup.title')} onClose={onClose} wide>
      <h4>{t('setup.decks')}</h4>
      <div className="deck-checks">
        {data.decks.map((d) => (
          <label key={d.id} className={'check-tile' + (ids.has(d.id) ? ' on' : '')}>
            <input type="checkbox" checked={ids.has(d.id)} onChange={() => toggle(d.id)} />
            <Flag code={d.language} />
            <span>{d.name}</span>
          </label>
        ))}
      </div>

      {(present.cats.length > 0 || present.levels.length > 0) && (
        <>
          <h4>
            {t('setup.topics')} <small className="muted">{t('setup.topicsHint')}</small>
          </h4>
          <div className="chip-row">
            {present.levels.map((l) => (
              <button key={l} className={'lang-chip' + (levels.has(l) ? ' on' : '')} onClick={() => toggleIn(setLevels, l)}>
                {l}
              </button>
            ))}
            {present.levels.length > 0 && <span className="chip-sep" />}
            {present.cats.map((c) => (
              <button key={c.id} className={'lang-chip' + (cats.has(c.id) ? ' on' : '')} onClick={() => toggleIn(setCats, c.id)}>
                {c.name[data.settings.uiLang]}
              </button>
            ))}
          </div>
        </>
      )}

      <h4>{t('setup.mode')}</h4>
      <div className="mode-grid">
        {MODES.map(({ mode: m, icon: Icon }) => (
          <button key={m} className={'mode-tile' + (mode === m ? ' on' : '')} onClick={() => setMode(m)}>
            <Icon size={22} />
            <strong>{t(`mode.${m}`)}</strong>
            <small className="muted">{t(`mode.${m}.desc`)}</small>
          </button>
        ))}
      </div>

      <label className="switch-row">
        <input type="checkbox" checked={cram} onChange={(e) => setCram(e.target.checked)} />
        <span>
          <strong>{t('setup.cram')}</strong>
          <small className="muted">{t('setup.cram.desc')}</small>
        </span>
      </label>
      {cram && (
        <div className="form-grid">
          <label className="field">
            <span>{t('setup.direction')}</span>
            <select className="input" value={dir} onChange={(e) => setDir(e.target.value as Direction | 'both')}>
              <option value="fwd">{t('dir.fwd')}</option>
              <option value="rev">{t('dir.rev')}</option>
              <option value="both">{t('dir.both')}</option>
            </select>
          </label>
          <label className="field">
            <span>{t('setup.limit')}</span>
            <select className="input" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
              {[10, 20, 30, 50, 100, 0].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? t('setup.all') : n}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <div className="row end gap">
        <span className="muted grow">{t('setup.count', { n: count })}</span>
        <button className="btn" onClick={onClose}>
          {t('common.cancel')}
        </button>
        <button className="btn btn-primary" disabled={!count} onClick={start}>
          {t('setup.start')}
        </button>
      </div>
    </Modal>
  );
}
