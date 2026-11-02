import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Deck, LangCode } from '../types';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { LANGUAGES, PRIORITY_LANGS, lang } from '../lib/languages';
import { Flag } from '../components/Flag';
import { Modal } from '../components/Modal';
import { deckCounts, todayCounts } from '../lib/queue';
import { breakdown } from '../lib/stats';
import { STARTER_DECKS, starterDrafts } from '../data/starter';

export function DeckEditor({ deck, onClose }: { deck?: Deck; onClose(): void }) {
  const t = useT();
  const data = useData();
  const { addDeck, updateDeck, go } = useStore.getState();
  const ui = data.settings.uiLang;
  const [name, setName] = useState(deck?.name ?? '');
  const [language, setLanguage] = useState<LangCode>(deck?.language ?? 'en');
  const [reverse, setReverse] = useState(deck?.reverse ?? true);
  const [newPerDay, setNewPerDay] = useState<string>(deck?.newPerDay != null ? String(deck.newPerDay) : '');
  const [description, setDescription] = useState(deck?.description ?? '');

  const ordered = [...PRIORITY_LANGS.map((c) => lang(c)), ...LANGUAGES.filter((l) => !PRIORITY_LANGS.includes(l.code))];

  const save = () => {
    const finalName = name.trim() || lang(language).name[ui];
    const limit = newPerDay.trim() === '' ? undefined : Math.max(0, Math.min(999, Number(newPerDay) || 0));
    if (deck) {
      updateDeck(deck.id, { name: finalName, language, reverse, newPerDay: limit, description: description.trim() || undefined });
      onClose();
    } else {
      const d = addDeck({ name: finalName, language, reverse, description: description.trim() || undefined });
      if (limit !== undefined) updateDeck(d.id, { newPerDay: limit });
      onClose();
      go({ name: 'add', deckId: d.id });
    }
  };

  return (
    <Modal title={deck ? t('decks.edit') : t('decks.create')} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <label className="field">
          <span>{t('decks.language')}</span>
          <div className="lang-chooser">
            {ordered.map((l) => (
              <button type="button" key={l.code} className={'lang-chip' + (language === l.code ? ' on' : '')} onClick={() => setLanguage(l.code)}>
                <Flag code={l.code} size={18} /> {l.name[ui]}
              </button>
            ))}
          </div>
        </label>
        <label className="field">
          <span>{t('decks.name')}</span>
          <input className="input" autoFocus value={name} placeholder={lang(language).name[ui]} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          <span>{t('decks.description')}</span>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label className="switch-row">
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
          <span>
            <strong>{t('decks.reverse')}</strong>
            <small className="muted">{t('decks.reverse.desc')}</small>
          </span>
        </label>
        <label className="field">
          <span>{t('decks.newPerDay')}</span>
          <input
            className="input input-narrow"
            type="number"
            min={0}
            max={999}
            value={newPerDay}
            placeholder={String(data.settings.newPerDay)}
            onChange={(e) => setNewPerDay(e.target.value)}
          />
        </label>
        <div className="row end gap">
          <button type="button" className="btn" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="submit" className="btn btn-primary">
            {deck ? t('common.save') : t('decks.createAndAdd')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function DecksView() {
  const t = useT();
  const data = useData();
  const { go, addDeck, addCards, notify } = useStore.getState();
  const [creating, setCreating] = useState(false);
  const now = useMemo(() => new Date(), [data]);
  const today = useMemo(() => todayCounts(data, now), [data, now]);
  const ui = data.settings.uiLang;
  const existing = new Set(data.decks.map((d) => d.language));
  const missingStarters = STARTER_DECKS.filter((s) => !existing.has(s.language) && s.language !== data.settings.nativeLang);

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t('nav.decks')}</h1>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          <Plus size={16} /> {t('decks.create')}
        </button>
      </header>

      {data.decks.length === 0 && <p className="muted">{t('decks.empty')}</p>}

      <div className="deck-list">
        {data.decks.map((d) => {
          const c = deckCounts(data, d, now, today);
          const b = breakdown(data.cards.filter((x) => x.deckId === d.id));
          const learned = b.young + b.mature;
          return (
            <button key={d.id} className="deck-row" onClick={() => go({ name: 'deck', deckId: d.id })}>
              <Flag code={d.language} size={30} />
              <div className="grow left">
                <strong>{d.name}</strong>
                <div className="muted small">
                  {lang(d.language).name[ui]} · {t('common.words', { n: c.total })} · {t('decks.learned', { n: learned })}
                </div>
                <div className="mini-bar">
                  <span className="seg-mature" style={{ flex: b.mature }} />
                  <span className="seg-young" style={{ flex: b.young }} />
                  <span className="seg-learning" style={{ flex: b.learning }} />
                  <span className="seg-new" style={{ flex: b.new + b.suspended }} />
                </div>
              </div>
              <span className="count due" title={t('count.due')}>
                {c.due + c.learning}
              </span>
              <span className="count new" title={t('count.new')}>
                {c.newAvailable}
              </span>
            </button>
          );
        })}
      </div>

      {missingStarters.length > 0 && (
        <section className="starter-offer">
          <h3 className="section-title">{t('decks.starters')}</h3>
          <div className="row gap wrap">
            {missingStarters.map((s) => (
              <button
                key={s.language}
                className="btn"
                onClick={() => {
                  const deck = addDeck({ name: s.name[ui], language: s.language });
                  addCards(deck.id, starterDrafts(s, data.settings.nativeLang));
                  notify(t('decks.starterAdded', { n: s.rows.length }));
                }}
              >
                <Flag code={s.language} size={18} /> {s.name[ui]}
              </button>
            ))}
          </div>
        </section>
      )}

      {creating && <DeckEditor onClose={() => setCreating(false)} />}
    </div>
  );
}
