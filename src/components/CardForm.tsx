import { useEffect, useMemo, useRef, useState } from 'react';
import type { Card, Deck, LangCode, PartOfSpeech } from '../types';
import { lang, splitArticle } from '../lib/languages';
import type { CardDraft } from '../lib/importExport';
import { useT } from '../i18n';
import { useData } from '../store';
import { TextInput } from './TextInput';
import { CharPad } from './CharPad';
import { normalize } from '../lib/answer';

const POS: PartOfSpeech[] = ['noun', 'verb', 'adj', 'adv', 'phrase', 'other'];

const TERM_PH: Partial<Record<LangCode, string>> = {
  en: 'achieve',
  de: 'der Hund',
  sv: 'en hund',
  ja: '食べる',
  fr: 'le livre',
  es: 'el libro',
};

const FORMS_PH: Partial<Record<LangCode, string>> = {
  en: 'went, gone',
  de: 'die Hunde · geht, ging, ist gegangen',
  sv: 'hunden, hundar · går, gick, gått',
  ja: '食べます',
};

export function emptyDraft(): CardDraft {
  return { term: '', translation: '', reading: '', article: '', forms: '', example: '', notes: '', tags: [] };
}

export function draftFromCard(c: Card): CardDraft {
  return {
    term: c.term,
    translation: c.translation,
    reading: c.reading ?? '',
    article: c.article ?? '',
    pos: c.pos,
    forms: c.forms ?? '',
    example: c.example ?? '',
    exampleTranslation: c.exampleTranslation ?? '',
    notes: c.notes ?? '',
    tags: c.tags,
  };
}

/**
 * Word editor. Enter in any field saves (and keeps the form open for the next word when adding).
 * Typing "der Hund" fills the article automatically; for Japanese the reading field converts romaji to kana.
 */
export function CardForm({
  deck,
  initial,
  editingId,
  submitLabel,
  onSubmit,
  onCancel,
  autoFocus = true,
}: {
  deck: Deck;
  initial?: CardDraft;
  editingId?: string;
  submitLabel: string;
  onSubmit(draft: CardDraft): void;
  onCancel?(): void;
  autoFocus?: boolean;
}) {
  const t = useT();
  const data = useData();
  const meta = lang(deck.language);
  const [d, setD] = useState<CardDraft>(initial ?? emptyDraft());
  const [more, setMore] = useState(!!(initial && (initial.example || initial.notes || initial.forms)));
  const termRef = useRef<HTMLInputElement>(null);
  const exampleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) termRef.current?.focus();
  }, [autoFocus]);

  const set = (patch: Partial<CardDraft>) => setD((cur) => ({ ...cur, ...patch }));

  const duplicate = useMemo(() => {
    const term = normalize(d.term);
    if (!term) return null;
    return data.cards.find((c) => c.deckId === deck.id && c.id !== editingId && normalize(c.term) === term) ?? null;
  }, [d.term, data.cards, deck.id, editingId]);

  const valid = d.term.trim() && d.translation.trim();

  const submit = () => {
    if (!valid) return;
    onSubmit({ ...d, tags: d.tags.filter(Boolean) });
    if (!editingId) {
      setD({ ...emptyDraft(), pos: d.pos });
      termRef.current?.focus();
    }
  };

  const onTermChange = (v: string) => {
    const split = splitArticle(deck.language, v);
    // "der Hund" → article "der", term "Hund" (only once a space and some letters follow).
    if (split && split.rest.length > 0 && !d.article) set({ term: split.rest, article: split.article, pos: d.pos ?? 'noun' });
    else set({ term: v });
  };

  const keySubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !(e.nativeEvent as KeyboardEvent).isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="card-form" onKeyDown={keySubmit}>
      <div className="form-grid">
        {meta.articles && (
          <label className="field field-article">
            <span>{t('form.article')}</span>
            <div className="seg">
              <button type="button" className={!d.article ? 'on' : ''} onClick={() => set({ article: '' })}>
                —
              </button>
              {meta.articles.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  data-gender={a.gender}
                  className={d.article === a.value ? 'on' : ''}
                  onClick={() => set({ article: a.value, pos: 'noun' })}
                >
                  {a.value}
                </button>
              ))}
            </div>
          </label>
        )}
        <label className="field field-term">
          <span>
            {t('form.term')} <em className="muted">({meta.name[data.settings.uiLang]})</em>
          </span>
          <TextInput ref={termRef} value={d.term} onValue={onTermChange} lang={meta.tts} className="input input-lg" placeholder={TERM_PH[deck.language] ?? ''} />
          <CharPad code={deck.language} inputRef={termRef} onInsert={(v) => set({ term: v })} />
          {duplicate && <small className="warn">{t('form.duplicate', { tr: duplicate.translation })}</small>}
        </label>
        {meta.kana && (
          <label className="field">
            <span>{t('form.readingKana')}</span>
            <TextInput kana value={d.reading ?? ''} onValue={(v) => set({ reading: v })} className="input" lang="ja" placeholder="taberu → たべる" />
          </label>
        )}
        <label className="field field-translation">
          <span>{t('form.translation')}</span>
          <TextInput value={d.translation} onValue={(v) => set({ translation: v })} className="input input-lg" placeholder={t('form.translationPh')} />
        </label>
        <label className="field">
          <span>{t('form.pos')}</span>
          <select className="input" value={d.pos ?? ''} onChange={(e) => set({ pos: (e.target.value || undefined) as PartOfSpeech | undefined })}>
            <option value="">—</option>
            {POS.map((p) => (
              <option key={p} value={p}>
                {t(`pos.${p}`)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!more ? (
        <button type="button" className="link" onClick={() => setMore(true)}>
          + {t('form.more')}
        </button>
      ) : (
        <div className="form-grid">
          {!meta.kana && (
            <label className="field">
              <span>{t('form.reading')}</span>
              <TextInput value={d.reading ?? ''} onValue={(v) => set({ reading: v })} className="input" placeholder={t('form.readingPh')} />
            </label>
          )}
          <label className="field">
            <span>{t('form.forms')}</span>
            <TextInput value={d.forms ?? ''} onValue={(v) => set({ forms: v })} className="input" placeholder={FORMS_PH[deck.language] ?? ''} />
          </label>
          <label className="field field-wide">
            <span>{t('form.example')}</span>
            <TextInput ref={exampleRef} value={d.example ?? ''} onValue={(v) => set({ example: v })} className="input" lang={meta.tts} />
            <CharPad code={deck.language} inputRef={exampleRef} onInsert={(v) => set({ example: v })} />
          </label>
          <label className="field field-wide">
            <span>{t('form.exampleTranslation')}</span>
            <TextInput value={d.exampleTranslation ?? ''} onValue={(v) => set({ exampleTranslation: v })} className="input" />
          </label>
          <label className="field field-wide">
            <span>{t('form.notes')}</span>
            <TextInput value={d.notes ?? ''} onValue={(v) => set({ notes: v })} className="input" placeholder={t('form.notesPh')} />
          </label>
          <label className="field field-wide">
            <span>{t('form.tags')}</span>
            <TextInput value={d.tags.join(' ')} onValue={(v) => set({ tags: v.split(/\s+/) })} className="input" placeholder={t('form.tagsPh')} />
          </label>
        </div>
      )}

      <div className="row end gap form-actions">
        <span className="muted small grow">{t('form.enterHint')}</span>
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
            {t('common.cancel')}
          </button>
        )}
        <button type="button" className="btn btn-primary" disabled={!valid} onClick={submit}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
