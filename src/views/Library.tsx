import { useEffect, useMemo, useState } from 'react';
import {
  Apple, ArrowLeft, Briefcase, Building2, ChevronLeft, ChevronRight, Clock, Coffee, Gamepad2, GraduationCap, Hash,
  HeartPulse, House, Landmark, LayoutGrid, Laptop, List, MessageCircle, Palette, PawPrint, Plane, Plus, Puzzle, Search,
  Shirt, ShoppingCart, Shuffle, Smile, Sparkles, Star, Trees, Users, Volume2, Zap, type LucideIcon,
} from 'lucide-react';
import type { Card, Deck, LangCode } from '../types';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { CATEGORIES, CATEGORY_BY_ID, LEVELS, LIB_LANGS, libraryWords, wordKey, type Level, type LibWord } from '../data/library';
import type { CardDraft } from '../lib/importExport';
import { lang } from '../lib/languages';
import { normalize } from '../lib/answer';
import { spokenText } from '../lib/tts';
import { Flag } from '../components/Flag';
import { Term } from '../components/Term';
import { Modal } from '../components/Modal';
import { CardForm } from '../components/CardForm';
import { useSpeak } from '../components/SpeakButton';

const ICONS: Record<string, LucideIcon> = {
  MessageCircle, Puzzle, Users, HeartPulse, Apple, Coffee, House, Shirt, Building2, Plane, Trees, PawPrint, Clock, Hash,
  Palette, Briefcase, GraduationCap, ShoppingCart, Smile, Gamepad2, Laptop, Zap, Sparkles, Landmark,
};

/** Library words and the user's own words share this shape in the UI. */
interface Item {
  key: string;
  draft: CardDraft;
  level?: Level;
  /** The card in one of the user's decks, if the word is saved. */
  saved?: Card;
  own?: boolean;
}

function asCard(d: CardDraft): Card {
  return {
    id: '',
    deckId: '',
    term: d.term,
    reading: d.reading,
    article: d.article,
    pos: d.pos,
    translation: d.translation,
    forms: d.forms,
    tags: d.tags,
    createdAt: 0,
    srs: {},
  };
}

function shuffled<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------------------

function StarButton({ saved, onClick, title }: { saved: boolean; onClick(): void; title: string }) {
  return (
    <button
      type="button"
      className={'icon-btn star' + (saved ? ' on' : '')}
      title={title}
      aria-label={title}
      aria-pressed={saved}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Star size={18} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}

function WordList({ items, code, onToggle }: { items: Item[]; code: LangCode; onToggle(item: Item): void }) {
  const t = useT();
  const say = useSpeak();
  return (
    <div className="word-list">
      {items.map((it) => (
        <div key={it.key} className={'word-row' + (it.saved ? ' saved' : '')}>
          <StarButton saved={!!it.saved} onClick={() => onToggle(it)} title={it.saved ? t('library.unsave') : t('library.save')} />
          <div className="word-main">
            <span className="word-term">
              <Term card={asCard(it.draft)} code={code} />
            </span>
            {it.draft.forms && <span className="muted small"> · {it.draft.forms}</span>}
          </div>
          <div className="word-tr">{it.draft.translation}</div>
          {it.level && <span className="badge">{it.level}</span>}
          {it.own && <span className="badge badge-new">{t('library.own')}</span>}
          <button className="icon-btn speak" onClick={() => say(spokenText(asCard(it.draft), code), code)}>
            <Volume2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

/** One big card at a time: click or Space flips it, arrows move, S saves. */
function FlipViewer({ items, code, onToggle }: { items: Item[]; code: LangCode; onToggle(item: Item): void }) {
  const t = useT();
  const say = useSpeak();
  const autoplay = useStore((s) => s.data.settings.autoplay);
  const [order, setOrder] = useState(() => items.map((i) => i.key));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [meaningFirst, setMeaningFirst] = useState(false);

  // Keep the order when items only change their "saved" state.
  useEffect(() => {
    setOrder((cur) => {
      const keys = items.map((i) => i.key);
      const same = cur.length === keys.length && cur.every((k) => keys.includes(k));
      return same ? cur : keys;
    });
  }, [items]);

  const byKey = useMemo(() => new Map(items.map((i) => [i.key, i])), [items]);
  const item = byKey.get(order[Math.min(pos, order.length - 1)]);
  const card = item ? asCard(item.draft) : null;

  const go = (delta: number) => {
    setFlipped(false);
    setPos((p) => (p + delta + order.length) % order.length);
  };

  useEffect(() => {
    if (card && autoplay && (!meaningFirst || flipped)) say(spokenText(card, code), code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.key, meaningFirst ? flipped : null]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || document.querySelector('.modal')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if ((e.key === 's' || e.key === 'ы' || e.key === 'S') && item) onToggle(item);
      else if ((e.key === 'r' || e.key === 'к') && card) say(spokenText(card, code), code);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!item || !card) return null;

  const wordSide = (
    <div className="flip-face-content">
      <div className="flip-word">
        <Term card={card} code={code} />
      </div>
      <button
        className="icon-btn speak"
        onClick={(e) => {
          e.stopPropagation();
          say(spokenText(card, code), code);
        }}
      >
        <Volume2 size={22} />
      </button>
    </div>
  );
  const meaningSide = (
    <div className="flip-face-content">
      <div className="flip-meaning">{item.draft.translation}</div>
      {item.draft.forms && <div className="muted">{item.draft.forms}</div>}
      {item.draft.pos && <div className="muted small">{t(`pos.${item.draft.pos}`)}</div>}
    </div>
  );

  return (
    <div className="flip-viewer">
      <div className="row gap center wrap">
        <button className="btn btn-sm" onClick={() => { setOrder(shuffled(order)); setPos(0); setFlipped(false); }}>
          <Shuffle size={14} /> {t('library.shuffle')}
        </button>
        <label className="row gap small">
          <input type="checkbox" checked={meaningFirst} onChange={(e) => { setMeaningFirst(e.target.checked); setFlipped(false); }} />
          {t('library.meaningFirst')}
        </label>
      </div>
      <div className="flip-stage">
        <button className="icon-btn nav-arrow" onClick={() => go(-1)} aria-label="←">
          <ChevronLeft size={28} />
        </button>
        <div className={'flip-card' + (flipped ? ' flipped' : '')} onClick={() => setFlipped((f) => !f)}>
          <div className="flip-inner">
            <div className="flip-face front">{meaningFirst ? meaningSide : wordSide}</div>
            <div className="flip-face back">{meaningFirst ? wordSide : meaningSide}</div>
          </div>
          <div className="flip-star">
            <StarButton saved={!!item.saved} onClick={() => onToggle(item)} title={item.saved ? t('library.unsave') : t('library.save')} />
          </div>
          {item.level && <span className="badge flip-level">{item.level}</span>}
        </div>
        <button className="icon-btn nav-arrow" onClick={() => go(1)} aria-label="→">
          <ChevronRight size={28} />
        </button>
      </div>
      <div className="muted small center-text">
        {pos + 1} / {order.length} · {t('library.flipHint')}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export function LibraryView() {
  const t = useT();
  const data = useData();
  const { addDeck, addCards, deleteCards, notify, go } = useStore.getState();
  const ui = data.settings.uiLang;
  const native = data.settings.nativeLang;
  const langs = LIB_LANGS.filter((l) => l !== native);

  const [code, setCode] = useState<LangCode>(() => {
    const used = data.decks.map((d) => d.language).find((l) => langs.includes(l));
    return used ?? langs[0];
  });
  const [levels, setLevels] = useState<Set<Level>>(new Set());
  const [query, setQuery] = useState('');
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'cards'>('list');
  const [targets, setTargets] = useState<Partial<Record<LangCode, string>>>({});
  const [adding, setAdding] = useState(false);

  const decks = data.decks.filter((d) => d.language === code);
  const target: Deck | undefined = decks.find((d) => d.id === targets[code]) ?? decks[decks.length - 1];

  const words = useMemo(() => libraryWords(code, native), [code, native]);

  /** Every word the user already has in some deck of this language. */
  const savedIndex = useMemo(() => {
    const ids = new Set(decks.map((d) => d.id));
    const m = new Map<string, Card>();
    for (const c of data.cards) if (ids.has(c.deckId)) m.set(wordKey(c), c);
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.cards, data.decks, code]);

  const libKeys = useMemo(() => new Set(words.map((w) => wordKey(w.draft))), [words]);
  const toItem = (w: LibWord): Item => {
    const key = wordKey(w.draft);
    return { key: w.entry.id, draft: w.draft, level: w.entry.level, saved: savedIndex.get(key) };
  };
  const levelOk = (w: LibWord) => !levels.size || levels.has(w.entry.level);

  const ensureDeck = (): string => {
    if (target) return target.id;
    const d = addDeck({ name: t('library.myWords', { lang: lang(code).name[ui] }), language: code });
    setTargets((m) => ({ ...m, [code]: d.id }));
    return d.id;
  };

  const toggle = (item: Item) => {
    if (item.saved) {
      const studied = Object.values(item.saved.srs).some((s) => s && s.reps > 0);
      if (studied) {
        notify(t('library.inStudy'));
        return;
      }
      deleteCards([item.saved.id]);
      notify(t('library.removed', { term: item.draft.term }));
    } else {
      addCards(ensureDeck(), [item.draft]);
      notify(t('library.savedOne', { term: item.draft.term }));
    }
  };

  const saveAll = (items: Item[]) => {
    const fresh = items.filter((i) => !i.saved);
    if (!fresh.length) return;
    addCards(ensureDeck(), fresh.map((i) => i.draft));
    notify(t('library.addedAll', { n: fresh.length }));
  };

  const levelChips = (
    <div className="chip-row">
      <button className={'lang-chip' + (!levels.size ? ' on' : '')} onClick={() => setLevels(new Set())}>
        {t('library.allLevels')}
      </button>
      {LEVELS.map((l) => (
        <button
          key={l}
          className={'lang-chip' + (levels.has(l) ? ' on' : '')}
          onClick={() =>
            setLevels((cur) => {
              const n = new Set(cur);
              if (n.has(l)) n.delete(l);
              else n.add(l);
              return n;
            })
          }
        >
          {l}
        </button>
      ))}
    </div>
  );

  const targetPicker = (
    <label className="row gap small target-picker">
      <span className="muted">{t('library.saveTo')}</span>
      <select
        className="input input-sm"
        value={target?.id ?? ''}
        onChange={(e) => {
          if (e.target.value === '__new') {
            const d = addDeck({ name: t('library.myWords', { lang: lang(code).name[ui] }), language: code });
            setTargets((m) => ({ ...m, [code]: d.id }));
          } else setTargets((m) => ({ ...m, [code]: e.target.value }));
        }}
      >
        {!target && <option value="">{t('library.myWords', { lang: lang(code).name[ui] })} ({t('library.willCreate')})</option>}
        {decks.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
        <option value="__new">+ {t('decks.create')}</option>
      </select>
    </label>
  );

  // ---------- Category page ----------
  if (openCat) {
    const meta = CATEGORY_BY_ID.get(openCat)!;
    const Icon = ICONS[meta.icon] ?? Sparkles;
    const items = words.filter((w) => w.entry.cat === openCat && levelOk(w)).map(toItem);
    const own: Item[] = data.cards
      .filter((c) => decks.some((d) => d.id === c.deckId) && c.tags.includes(openCat) && !libKeys.has(wordKey(c)))
      .map((c) => ({ key: c.id, draft: { ...c, tags: c.tags }, saved: c, own: true }));
    const all = [...items, ...own];
    const savedCount = all.filter((i) => i.saved).length;
    const fakeDeck: Deck = target ?? { id: '__new', name: '', language: code, reverse: true, createdAt: 0 };

    return (
      <div className="page">
        <button className="btn btn-ghost back" onClick={() => setOpenCat(null)}>
          <ArrowLeft size={16} /> {t('nav.library')}
        </button>
        <header className="page-head">
          <div className="row gap">
            <div className="cat-icon big">
              <Icon size={28} />
            </div>
            <div>
              <h1>{meta.name[ui]}</h1>
              <p className="muted">
                <Flag code={code} size={16} /> {lang(code).name[ui]} · {t('library.savedOf', { n: savedCount, total: all.length })}
              </p>
            </div>
          </div>
          <div className="seg">
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')} title={t('library.list')}>
              <List size={16} />
            </button>
            <button className={view === 'cards' ? 'on' : ''} onClick={() => setView('cards')} title={t('library.cards')}>
              <LayoutGrid size={16} />
            </button>
          </div>
        </header>

        <div className="toolbar">
          {levelChips}
          <span className="grow" />
          {targetPicker}
        </div>
        <div className="toolbar">
          <button className="btn btn-primary" disabled={savedCount === all.length} onClick={() => saveAll(all)}>
            <Star size={16} /> {t('library.saveAll', { n: all.length - savedCount })}
          </button>
          <button className="btn" onClick={() => setAdding(true)}>
            <Plus size={16} /> {t('library.addOwn')}
          </button>
          {target && savedCount > 0 && (
            <button className="btn btn-ghost" onClick={() => go({ name: 'deck', deckId: target.id })}>
              {t('library.openDeck')}
            </button>
          )}
        </div>

        {all.length === 0 ? (
          <p className="muted">{t('library.empty')}</p>
        ) : view === 'cards' ? (
          <FlipViewer key={`${openCat}-${code}-${[...levels].join()}`} items={all} code={code} onToggle={toggle} />
        ) : (
          <WordList items={all} code={code} onToggle={toggle} />
        )}

        {adding && (
          <Modal title={t('library.addOwn')} onClose={() => setAdding(false)} wide>
            <CardForm
              deck={fakeDeck}
              defaultCategory={openCat}
              submitLabel={t('add.save')}
              onCancel={() => setAdding(false)}
              onSubmit={(d) => {
                addCards(ensureDeck(), [d]);
                notify(t('add.saved', { term: d.term }));
              }}
            />
          </Modal>
        )}
      </div>
    );
  }

  // ---------- Overview ----------
  const q = normalize(query);
  const results = q
    ? words
        .filter((w) => levelOk(w) && normalize(`${w.draft.article ?? ''} ${w.draft.term} ${w.draft.reading ?? ''} ${w.draft.translation}`).includes(q))
        .map(toItem)
    : [];

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{t('nav.library')}</h1>
          <p className="muted">{t('library.subtitle', { n: words.length, c: CATEGORIES.length })}</p>
        </div>
      </header>

      <div className="lang-tabs">
        {langs.map((l) => (
          <button key={l} className={'lang-tab' + (l === code ? ' on' : '')} onClick={() => setCode(l)}>
            <Flag code={l} size={22} /> {lang(l).name[ui]}
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={16} />
          <input className="input" placeholder={t('library.search')} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {levelChips}
      </div>
      <div className="toolbar">
        <span className="grow" />
        {targetPicker}
      </div>

      {q ? (
        results.length ? (
          <WordList items={results.slice(0, 200)} code={code} onToggle={toggle} />
        ) : (
          <p className="muted">{t('library.noResults')}</p>
        )
      ) : (
        <div className="cat-grid">
          {CATEGORIES.map((c) => {
            const list = words.filter((w) => w.entry.cat === c.id && levelOk(w));
            if (!list.length) return null;
            const saved = list.filter((w) => savedIndex.has(wordKey(w.draft))).length;
            const Icon = ICONS[c.icon] ?? Sparkles;
            const sample = list.slice(0, 3).map((w) => w.draft.term).join(', ');
            return (
              <button key={c.id} className="cat-tile" onClick={() => setOpenCat(c.id)}>
                <div className="cat-icon">
                  <Icon size={22} />
                </div>
                <div className="grow left">
                  <strong>{c.name[ui]}</strong>
                  <div className="muted small ellipsis" lang={lang(code).tts}>
                    {sample}…
                  </div>
                  <div className="mini-bar">
                    <span className="seg-mature" style={{ flex: saved }} />
                    <span className="seg-new" style={{ flex: list.length - saved }} />
                  </div>
                </div>
                <span className="muted small nowrap">
                  {saved > 0 ? `${saved} / ${list.length}` : list.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
