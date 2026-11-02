import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Ear, Pencil, Undo2, Volume2, X } from 'lucide-react';
import type { Card, Deck, Direction, Grade, LangCode, QueueItem, StudyMode } from '../types';
import { useStore, type StudyConfig, type UndoEntry } from '../store';
import { useT, type TFn } from '../i18n';
import { lang } from '../lib/languages';
import { spokenText, stopSpeaking } from '../lib/tts';
import { intervalParts, preview } from '../lib/srs';
import { checkAnswer, suggestedGrade, type CheckResult } from '../lib/answer';
import { LEARN_AHEAD_MS, buildQueue } from '../lib/queue';
import { Term } from '../components/Term';
import { TextInput } from '../components/TextInput';
import { CharPad } from '../components/CharPad';
import { useSpeak } from '../components/SpeakButton';
import { Modal } from '../components/Modal';
import { CardForm, draftFromCard } from '../components/CardForm';

type ActualMode = Exclude<StudyMode, 'mixed'>;

interface Pending extends QueueItem {
  due: number;
}

interface SessionState {
  queue: QueueItem[];
  /** Cards in (re)learning that come back later in this session. */
  pending: Pending[];
  current: QueueItem | null;
  done: number;
  correct: number;
  again: number;
}

interface Snapshot {
  session: SessionState;
  undo: UndoEntry | null;
}

const isTyping = (e: KeyboardEvent) => {
  const el = e.target as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT');
};

function pickNext(s: SessionState, now: number): SessionState {
  const pending = [...s.pending].sort((a, b) => a.due - b.due);
  if (pending.length && pending[0].due <= now) {
    const [first, ...rest] = pending;
    return { ...s, pending: rest, current: { cardId: first.cardId, dir: first.dir } };
  }
  if (s.queue.length) {
    const [first, ...rest] = s.queue;
    return { ...s, queue: rest, pending, current: first };
  }
  if (pending.length) {
    const [first, ...rest] = pending;
    return { ...s, pending: rest, current: { cardId: first.cardId, dir: first.dir } };
  }
  return { ...s, pending, current: null };
}

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatIvl(ms: number, t: TFn) {
  const { value, unit } = intervalParts(ms);
  return t(`ivl.${unit}`, { n: value });
}

export function StudyView({ config, queue: initialQueue }: { config: StudyConfig; queue?: QueueItem[] }) {
  const t = useT();
  const data = useStore((s) => s.data);
  const { go, answer, undo, updateCard } = useStore.getState();
  const settings = data.settings;
  const say = useSpeak();

  const [session, setSession] = useState<SessionState>(() =>
    pickNext(
      {
        queue: initialQueue ?? buildQueue(useStore.getState().data, config.deckIds, new Date()),
        pending: [],
        current: null,
        done: 0,
        correct: 0,
        again: 0,
      },
      Date.now(),
    ),
  );
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const shownAt = useRef(Date.now());
  const inputRef = useRef<HTMLInputElement>(null);

  const cardMap = useMemo(() => new Map(data.cards.map((c) => [c.id, c])), [data.cards]);
  const deckMap = useMemo(() => new Map(data.decks.map((d) => [d.id, d])), [data.decks]);
  const cur = session.current;
  const card: Card | undefined = cur ? cardMap.get(cur.cardId) : undefined;
  const deck: Deck | undefined = card ? deckMap.get(card.deckId) : undefined;
  const code: LangCode = deck?.language ?? 'en';
  const dir: Direction = cur?.dir ?? 'fwd';

  // Pick the concrete mode for this card (mixed mode rotates; multiple choice needs enough cards).
  const options = useMemo(() => {
    if (!card || !deck) return [] as Card[];
    const pool = data.cards.filter((c) => c.id !== card.id && deckMap.get(c.deckId)?.language === deck.language);
    const key = (c: Card) => (dir === 'fwd' ? c.translation : c.term).trim().toLowerCase();
    const seen = new Set([key(card)]);
    const same = shuffle(pool.filter((c) => c.pos && c.pos === card.pos));
    const others = shuffle(pool.filter((c) => !c.pos || c.pos !== card.pos));
    const picked: Card[] = [];
    for (const c of [...same, ...others]) {
      if (picked.length >= 3) break;
      if (seen.has(key(c))) continue;
      seen.add(key(c));
      picked.push(c);
    }
    return picked.length === 3 ? shuffle([card, ...picked]) : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, dir, session.done]);

  const mode: ActualMode = useMemo(() => {
    let m: ActualMode =
      config.mode === 'mixed'
        ? (['flip', 'type', 'choice', 'listen'] as ActualMode[])[Math.floor(Math.random() * 4)]
        : config.mode;
    if (m === 'choice' && options.length < 4) m = 'flip';
    // Listening only makes sense when the word itself is the prompt.
    if (m === 'listen' && dir === 'rev') m = 'type';
    return m;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, dir, session.done, options.length]);

  const showWord = dir === 'fwd' && mode !== 'listen';
  const answerShown = revealed || result !== null || choice !== null;

  // New card on screen: reset per-card state and play the audio.
  useEffect(() => {
    if (!card) return;
    setRevealed(false);
    setTyped('');
    setResult(null);
    setChoice(null);
    shownAt.current = Date.now();
    if ((settings.autoplay && dir === 'fwd') || mode === 'listen') say(spokenText(card, code), code);
    if (mode === 'type' || mode === 'listen') requestAnimationFrame(() => inputRef.current?.focus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, dir, session.done]);

  // Reverse cards: pronounce the word once the answer is shown.
  useEffect(() => {
    if (answerShown && card && dir === 'rev' && settings.autoplay) say(spokenText(card, code), code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerShown]);

  useEffect(() => () => stopSpeaking(), []);

  const intervals = useMemo(() => {
    if (!card || config.cram) return null;
    return preview(card.srs[dir], new Date(), { retention: settings.retention, maxIntervalDays: settings.maxIntervalDays });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id, dir, session.done, answerShown]);

  const grade = useCallback(
    (g: Grade) => {
      if (!cur || !card) return;
      const ms = Date.now() - shownAt.current;
      let entry: UndoEntry | null = null;
      let next: SessionState = {
        ...session,
        done: session.done + 1,
        correct: session.correct + (g > 1 ? 1 : 0),
        again: session.again + (g === 1 ? 1 : 0),
      };
      if (config.cram) {
        // Practice: a forgotten word returns a few cards later.
        if (g === 1) {
          const q = [...next.queue];
          q.splice(Math.min(q.length, 4), 0, cur);
          next.queue = q;
        }
      } else {
        entry = answer(cur.cardId, cur.dir, g, ms);
        const updated = useStore.getState().data.cards.find((c) => c.id === cur.cardId);
        const s = updated?.srs[cur.dir];
        if (s && s.state !== 2) {
          const due = new Date(s.due).getTime();
          if (due - Date.now() < LEARN_AHEAD_MS * 3) next.pending = [...next.pending, { ...cur, due }];
        }
      }
      setHistory((h) => [...h.slice(-30), { session, undo: entry }]);
      next = pickNext(next, Date.now());
      setSession(next);
    },
    [cur, card, session, config.cram, answer],
  );

  const doUndo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    if (last.undo) undo(last.undo);
    setHistory((h) => h.slice(0, -1));
    setSession(last.session);
  }, [history, undo]);

  const submitTyped = () => {
    if (!card || result) return;
    const native = settings.nativeLang as LangCode;
    // Listening: the learner writes the word they heard.
    const r = mode === 'listen' ? checkAnswer(typed, card, 'rev', code, native) : checkAnswer(typed, card, dir, code, native);
    setResult(r);
  };

  const pickChoice = (i: number) => {
    if (choice !== null || !options[i]) return;
    setChoice(i);
  };

  const suggested: Grade | null = result
    ? suggestedGrade(result, settings.lenientTypos)
    : choice !== null
      ? options[choice]?.id === card?.id
        ? 3
        : 1
      : null;

  // Keyboard: Space/Enter reveal or accept, 1–4 grade, R replay, E edit, Ctrl+Z undo, Esc leave.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editing) return;
      if (e.key === 'Escape') {
        go({ name: 'home' });
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        doUndo();
        return;
      }
      const typing = isTyping(e);
      if (typing && !answerShown) return; // input handles its own Enter
      if (!card) return;
      if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') {
        if (!typing) say(spokenText(card, code), code);
        return;
      }
      if ((e.key === 'e' || e.key === 'у') && !typing) {
        e.preventDefault();
        setEditing(true);
        return;
      }
      if (mode === 'choice' && choice === null && /^[1-4]$/.test(e.key)) {
        pickChoice(Number(e.key) - 1);
        return;
      }
      if (!answerShown) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      if (/^[1-4]$/.test(e.key)) {
        e.preventDefault();
        grade(Number(e.key) as Grade);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        grade(suggested ?? 3);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // ---------- Finished ----------
  if (!cur || !card || !deck) {
    const pct = session.done ? Math.round((session.correct / session.done) * 100) : 0;
    return (
      <div className="study study-done">
        <div className="done-card">
          <div className="done-icon">
            <Check size={36} />
          </div>
          <h1>{t('study.doneTitle')}</h1>
          <p className="muted">{t('study.doneText', { n: session.done, pct })}</p>
          <div className="row gap center">
            {history.length > 0 && (
              <button className="btn" onClick={doUndo}>
                <Undo2 size={16} /> {t('study.undo')}
              </button>
            )}
            <button className="btn btn-primary" autoFocus onClick={() => go({ name: 'home' })}>
              {t('study.backHome')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const remaining = session.queue.length + session.pending.length + 1;
  const progress = session.done / (session.done + remaining);
  const isNew = !card.srs[dir] || card.srs[dir]!.state === 0;
  const meta = lang(code);

  const prompt = (
    <div className="prompt">
      {mode === 'listen' ? (
        <button className="listen-btn" onClick={() => say(spokenText(card, code), code)} title={t('study.replay')}>
          <Ear size={44} />
        </button>
      ) : showWord ? (
        <div className="prompt-word">
          <Term card={card} code={code} showReading={settings.furiganaOnFront || answerShown} />
        </div>
      ) : (
        <div className="prompt-word prompt-meaning">{card.translation}</div>
      )}
      {mode !== 'listen' && dir === 'rev' && card.pos && <div className="muted small">{t(`pos.${card.pos}`)}</div>}
    </div>
  );

  const correctAnswer = (
    <div className="answer">
      {dir === 'fwd' && mode !== 'listen' ? (
        <div className="answer-main">{card.translation}</div>
      ) : (
        <div className="answer-main answer-word">
          <Term card={card} code={code} />
          <button className="icon-btn speak" onClick={() => say(spokenText(card, code), code)}>
            <Volume2 size={20} />
          </button>
        </div>
      )}
      {mode === 'listen' && <div className="answer-sub">{card.translation}</div>}
      {meta.kana && card.reading && dir === 'fwd' && <div className="answer-sub" lang="ja">{card.reading}</div>}
      {card.forms && <div className="answer-extra"><span className="label">{t('form.forms')}:</span> {card.forms}</div>}
      {card.example && (
        <div className="answer-extra example" lang={meta.tts}>
          <button className="icon-btn speak" onClick={() => say(card.example!, code)}>
            <Volume2 size={15} />
          </button>
          <span>{card.example}</span>
          {card.exampleTranslation && <span className="muted"> — {card.exampleTranslation}</span>}
        </div>
      )}
      {card.notes && <div className="answer-extra muted">{card.notes}</div>}
    </div>
  );

  return (
    <div className="study">
      <header className="study-head">
        <button className="btn btn-ghost" onClick={() => go({ name: 'home' })} title="Esc">
          <ArrowLeft size={18} /> {t('study.exit')}
        </button>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
        </div>
        <span className="muted small nowrap">
          {t('study.left', { n: session.queue.length + session.pending.length + 1 })}
        </span>
        <button className="icon-btn" disabled={!history.length} onClick={doUndo} title={`${t('study.undo')} (Ctrl+Z)`}>
          <Undo2 size={18} />
        </button>
        <button className="icon-btn" onClick={() => setEditing(true)} title={`${t('study.edit')} (E)`}>
          <Pencil size={18} />
        </button>
      </header>

      <div className="study-body">
        <div className="study-meta">
          <span className="chip-static">{deck.name}</span>
          <span className="chip-static">{t(`dir.${dir}.short`)}</span>
          {isNew && !config.cram && <span className="chip-static chip-new">{t('study.newCard')}</span>}
          {config.cram && <span className="chip-static">{t('setup.cram')}</span>}
        </div>

        <div className={'flashcard' + (answerShown ? ' revealed' : '')}>
          {prompt}

          {mode === 'choice' && (
            <div className="choices">
              {options.map((o, i) => {
                const isRight = o.id === card.id;
                const state = choice === null ? '' : isRight ? ' right' : choice === i ? ' wrong' : ' dim';
                return (
                  <button key={o.id} className={'choice' + state} onClick={() => pickChoice(i)} disabled={choice !== null}>
                    <kbd>{i + 1}</kbd>
                    {dir === 'fwd' ? <span>{o.translation}</span> : <Term card={o} code={code} showReading={false} />}
                  </button>
                );
              })}
            </div>
          )}

          {(mode === 'type' || mode === 'listen') && (
            <div className="type-area">
              <TextInput
                ref={inputRef}
                kana={!!meta.kana && (dir === 'rev' || mode === 'listen')}
                className={'input input-xl' + (result ? ` verdict-${result.verdict}` : '')}
                value={typed}
                onValue={setTyped}
                readOnly={!!result}
                lang={dir === 'rev' || mode === 'listen' ? meta.tts : undefined}
                placeholder={dir === 'rev' || mode === 'listen' ? t('study.typeWord') : t('study.typeMeaning')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing && !result) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typed.trim()) submitTyped();
                    else setResult({ verdict: 'wrong', expected: '' });
                  }
                }}
              />
              {(dir === 'rev' || mode === 'listen') && !result && <CharPad code={code} inputRef={inputRef} onInsert={setTyped} />}
              {result && (
                <div className={`verdict verdict-${result.verdict}`}>
                  {result.verdict === 'correct' ? <Check size={18} /> : result.verdict === 'wrong' ? <X size={18} /> : <Check size={18} />}
                  <span>
                    {t(`verdict.${result.verdict}`)}
                    {result.note && ` · ${t(`note.${result.note}`)}`}
                  </span>
                </div>
              )}
              {!result && <div className="muted small">{t('study.typeHint')}</div>}
            </div>
          )}

          {answerShown ? <><hr />{correctAnswer}</> : mode === 'flip' && (
            <button className="btn btn-primary btn-lg reveal" onClick={() => setRevealed(true)}>
              {t('study.show')} <kbd>Space</kbd>
            </button>
          )}
        </div>

        {answerShown && (
          <div className="grades">
            {([1, 2, 3, 4] as Grade[]).map((g) => (
              <button key={g} className={`grade grade-${g}` + (suggested === g ? ' suggested' : '')} onClick={() => grade(g)}>
                <strong>{t(`grade.${g}`)}</strong>
                <small>{intervals ? formatIvl(intervals[g], t) : g === 1 ? t('grade.repeat') : '✓'}</small>
                <kbd>{g}</kbd>
              </button>
            ))}
          </div>
        )}
        <div className="shortcuts muted small">{t('study.shortcuts')}</div>
      </div>

      {editing && (
        <Modal title={t('study.edit')} onClose={() => setEditing(false)} wide>
          <CardForm
            deck={deck}
            initial={draftFromCard(card)}
            editingId={card.id}
            submitLabel={t('common.save')}
            onCancel={() => setEditing(false)}
            onSubmit={(d) => {
              updateCard(card.id, { ...d, tags: d.tags });
              setEditing(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
