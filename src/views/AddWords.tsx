import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import type { Card } from '../types';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { CardForm } from '../components/CardForm';
import { Term } from '../components/Term';
import { Flag } from '../components/Flag';
import { DeckEditor } from './Decks';

export function AddWordsView({ deckId }: { deckId?: string }) {
  const t = useT();
  const data = useData();
  const { addCards, go } = useStore.getState();
  const [current, setCurrent] = useState(deckId ?? data.decks[data.decks.length - 1]?.id ?? '');
  const [added, setAdded] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const deck = data.decks.find((d) => d.id === current);
  const recent = added
    .map((id) => data.cards.find((c) => c.id === id))
    .filter((c): c is Card => !!c)
    .reverse();

  return (
    <div className="page page-narrow">
      <header className="page-head">
        <h1>{t('nav.add')}</h1>
      </header>

      {data.decks.length === 0 ? (
        <div className="empty">
          <p>{t('add.noDeck')}</p>
          <button className="btn btn-primary" onClick={() => setCreating(true)}>
            <Plus size={16} /> {t('decks.create')}
          </button>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <label className="field grow">
              <span>{t('add.deck')}</span>
              <div className="deck-switch">
                {data.decks.map((d) => (
                  <button key={d.id} className={'lang-chip' + (d.id === current ? ' on' : '')} onClick={() => setCurrent(d.id)}>
                    <Flag code={d.language} size={18} /> {d.name}
                  </button>
                ))}
                <button className="lang-chip" onClick={() => setCreating(true)}>
                  <Plus size={14} /> {t('decks.create')}
                </button>
              </div>
            </label>
          </div>
          {deck && (
            <div className="panel">
              <CardForm
                key={deck.id}
                deck={deck}
                submitLabel={t('add.save')}
                onSubmit={(d) => {
                  addCards(deck.id, [d]);
                  const last = useStore.getState().data.cards.at(-1);
                  if (last) setAdded((a) => [...a, last.id]);
                }}
              />
            </div>
          )}
          {deck && (
            <button className="link" onClick={() => go({ name: 'import', deckId: deck.id })}>
              <Upload size={14} /> {t('add.bulkHint')}
            </button>
          )}

          {recent.length > 0 && (
            <section>
              <h3 className="section-title">{t('add.recent', { n: recent.length })}</h3>
              <ul className="recent-list">
                {recent.map((c) => {
                  const d = data.decks.find((x) => x.id === c.deckId);
                  return (
                    <li key={c.id}>
                      {d && <Term card={c} code={d.language} />}
                      <span className="muted">— {c.translation}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}
      {creating && <DeckEditor onClose={() => setCreating(false)} />}
    </div>
  );
}
