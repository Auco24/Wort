import { useMemo, useState } from 'react';
import { ArrowLeft, Download, Dumbbell, Pause, Pencil, Play, Plus, RotateCcw, Search, Trash2, Upload } from 'lucide-react';
import type { Card } from '../types';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { Flag } from '../components/Flag';
import { Term } from '../components/Term';
import { SpeakButton } from '../components/SpeakButton';
import { Confirm, Modal } from '../components/Modal';
import { CardForm, draftFromCard } from '../components/CardForm';
import { StudySetup, startStudy } from '../components/StudySetup';
import { DeckEditor } from './Decks';
import { deckCounts } from '../lib/queue';
import { breakdown } from '../lib/stats';
import { isMature } from '../lib/srs';
import { normalize } from '../lib/answer';
import { cardsToCsv } from '../lib/importExport';
import { exportText } from '../lib/storage';
import { lang } from '../lib/languages';

type Filter = 'all' | 'new' | 'learning' | 'young' | 'mature' | 'suspended';

function status(c: Card): Exclude<Filter, 'all'> {
  if (c.suspended) return 'suspended';
  const s = c.srs.fwd;
  if (!s || s.state === 0) return 'new';
  if (s.state !== 2) return 'learning';
  return isMature(s) ? 'mature' : 'young';
}

const PAGE = 200;

export function DeckView({ deckId }: { deckId: string }) {
  const t = useT();
  const data = useData();
  const { go, addCards, updateCard, deleteCards, deleteDeck, setSuspended, resetProgress, notify, lastStudy } = useStore.getState();
  const deck = data.decks.find((d) => d.id === deckId);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Card | null>(null);
  const [adding, setAdding] = useState(false);
  const [editDeck, setEditDeck] = useState(false);
  const [confirm, setConfirm] = useState<null | 'deck' | 'cards' | 'reset'>(null);
  const [practice, setPractice] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const cards = useMemo(() => data.cards.filter((c) => c.deckId === deckId), [data.cards, deckId]);
  const visible = useMemo(() => {
    const q = normalize(query);
    return cards
      .filter((c) => filter === 'all' || status(c) === filter)
      .filter((c) => !q || normalize(`${c.article ?? ''} ${c.term} ${c.reading ?? ''} ${c.translation} ${c.tags.join(' ')}`).includes(q))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [cards, query, filter]);

  if (!deck) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => go({ name: 'decks' })}>
          <ArrowLeft size={16} /> {t('nav.decks')}
        </button>
      </div>
    );
  }

  const counts = deckCounts(data, deck, new Date());
  const b = breakdown(cards);
  const ui = data.settings.uiLang;
  const sel = [...selected];
  const allSelected = visible.length > 0 && visible.every((c) => selected.has(c.id));

  const toggle = (id: string) =>
    setSelected((cur) => {
      const n = new Set(cur);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const fmtDue = (c: Card) => {
    const s = c.srs.fwd;
    if (!s || s.state === 0) return '—';
    return new Date(s.due).toLocaleDateString(ui, { day: 'numeric', month: 'short' });
  };

  return (
    <div className="page">
      <button className="btn btn-ghost back" onClick={() => go({ name: 'decks' })}>
        <ArrowLeft size={16} /> {t('nav.decks')}
      </button>
      <header className="page-head">
        <div className="row gap">
          <Flag code={deck.language} size={40} />
          <div>
            <h1>{deck.name}</h1>
            <p className="muted">
              {lang(deck.language).name[ui]} · {t('common.words', { n: cards.length })}
              {deck.description ? ` · ${deck.description}` : ''}
            </p>
          </div>
        </div>
        <div className="row gap wrap">
          <button className="icon-btn" title={t('decks.edit')} onClick={() => setEditDeck(true)}>
            <Pencil size={18} />
          </button>
          <button className="icon-btn danger" title={t('decks.delete')} onClick={() => setConfirm('deck')}>
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <section className="stat-row compact">
        <div className="stat-pill"><span className="count due">{counts.due + counts.learning}</span>{t('count.due')}</div>
        <div className="stat-pill"><span className="count new">{counts.newAvailable}</span>{t('count.newToday')}</div>
        <div className="stat-pill"><b>{b.new}</b>{t('status.new')}</div>
        <div className="stat-pill"><b>{b.learning}</b>{t('status.learning')}</div>
        <div className="stat-pill"><b>{b.young}</b>{t('status.young')}</div>
        <div className="stat-pill"><b>{b.mature}</b>{t('status.mature')}</div>
      </section>

      <div className="toolbar">
        <button
          className="btn btn-primary"
          disabled={!counts.due && !counts.learning && !counts.newAvailable}
          onClick={() =>
            startStudy(
              { deckIds: [deck.id], mode: lastStudy?.mode ?? data.settings.defaultMode, cram: false, cramDir: 'fwd', cramLimit: 20 },
              t('study.nothing'),
            )
          }
        >
          <Play size={16} /> {t('deck.study')}
        </button>
        <button className="btn" disabled={!cards.length} onClick={() => setPractice(true)}>
          <Dumbbell size={16} /> {t('home.practice')}
        </button>
        <button className="btn" onClick={() => setAdding(true)}>
          <Plus size={16} /> {t('deck.addWord')}
        </button>
        <button className="btn" onClick={() => go({ name: 'import', deckId: deck.id })}>
          <Upload size={16} /> {t('deck.import')}
        </button>
        <button
          className="btn"
          disabled={!cards.length}
          onClick={async () => {
            if (await exportText(`${deck.name}.csv`, cardsToCsv(cards), [{ name: 'CSV', extensions: ['csv'] }])) notify(t('deck.exported'));
          }}
        >
          <Download size={16} /> {t('deck.export')}
        </button>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input className="input" placeholder={t('deck.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input input-narrow" value={filter} onChange={(e) => setFilter(e.target.value as Filter)}>
          {(['all', 'new', 'learning', 'young', 'mature', 'suspended'] as Filter[]).map((f) => (
            <option key={f} value={f}>
              {t(`status.${f}`)}
            </option>
          ))}
        </select>
        {sel.length > 0 && (
          <div className="row gap bulk">
            <span className="muted">{t('deck.selected', { n: sel.length })}</span>
            <button className="btn btn-sm" onClick={() => setSuspended(sel, !cards.find((c) => c.id === sel[0])?.suspended)}>
              <Pause size={14} /> {t('deck.suspend')}
            </button>
            <button className="btn btn-sm" onClick={() => setConfirm('reset')}>
              <RotateCcw size={14} /> {t('deck.reset')}
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => setConfirm('cards')}>
              <Trash2 size={14} /> {t('common.delete')}
            </button>
          </div>
        )}
      </div>

      {cards.length === 0 ? (
        <div className="empty">
          <p>{t('deck.empty')}</p>
          <div className="row gap center">
            <button className="btn btn-primary" onClick={() => setAdding(true)}>
              <Plus size={16} /> {t('deck.addWord')}
            </button>
            <button className="btn" onClick={() => go({ name: 'import', deckId: deck.id })}>
              <Upload size={16} /> {t('deck.import')}
            </button>
          </div>
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th className="col-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => setSelected(allSelected ? new Set() : new Set(visible.map((c) => c.id)))}
                />
              </th>
              <th>{t('form.term')}</th>
              <th>{t('form.translation')}</th>
              <th>{t('deck.status')}</th>
              <th>{t('deck.next')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.slice(0, limit).map((c) => {
              const st = status(c);
              return (
                <tr key={c.id} className={c.suspended ? 'suspended' : ''} onClick={() => setEditing(c)}>
                  <td className="col-check" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                  </td>
                  <td className="cell-term">
                    <Term card={c} code={deck.language} />
                  </td>
                  <td>{c.translation}</td>
                  <td>
                    <span className={`badge badge-${st}`}>{t(`status.${st}`)}</span>
                  </td>
                  <td className="muted nowrap">{fmtDue(c)}</td>
                  <td className="cell-actions">
                    <SpeakButton card={c} code={deck.language} size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {visible.length > limit && (
        <div className="row center">
          <button className="btn" onClick={() => setLimit((l) => l + PAGE)}>
            {t('deck.showMore', { n: visible.length - limit })}
          </button>
        </div>
      )}

      {adding && (
        <Modal title={t('deck.addWord')} onClose={() => setAdding(false)} wide>
          <CardForm
            deck={deck}
            submitLabel={t('add.save')}
            onCancel={() => setAdding(false)}
            onSubmit={(d) => {
              addCards(deck.id, [d]);
              notify(t('add.saved', { term: d.term }));
            }}
          />
        </Modal>
      )}
      {editing && (
        <Modal title={t('deck.editWord')} onClose={() => setEditing(null)} wide>
          <CardForm
            deck={deck}
            initial={draftFromCard(editing)}
            editingId={editing.id}
            submitLabel={t('common.save')}
            onCancel={() => setEditing(null)}
            onSubmit={(d) => {
              updateCard(editing.id, d);
              setEditing(null);
            }}
          />
        </Modal>
      )}
      {editDeck && <DeckEditor deck={deck} onClose={() => setEditDeck(false)} />}
      {practice && <StudySetup deckIds={[deck.id]} cram onClose={() => setPractice(false)} />}
      {confirm === 'deck' && (
        <Confirm
          title={t('decks.delete')}
          text={t('decks.deleteConfirm', { name: deck.name, n: cards.length })}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            deleteDeck(deck.id);
            go({ name: 'decks' });
          }}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm === 'cards' && (
        <Confirm
          title={t('common.delete')}
          text={t('deck.deleteConfirm', { n: sel.length })}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          danger
          onConfirm={() => {
            deleteCards(sel);
            setSelected(new Set());
          }}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm === 'reset' && (
        <Confirm
          title={t('deck.reset')}
          text={t('deck.resetConfirm', { n: sel.length })}
          confirmLabel={t('deck.reset')}
          cancelLabel={t('common.cancel')}
          onConfirm={() => {
            resetProgress(sel);
            setSelected(new Set());
          }}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
