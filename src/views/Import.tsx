import { useMemo, useState } from 'react';
import { ArrowLeft, FileUp } from 'lucide-react';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { FIELDS, defaultMapping, parseTable, rowsToDrafts, type Field } from '../lib/importExport';
import { importText } from '../lib/storage';
import { normalize } from '../lib/answer';
import { Flag } from '../components/Flag';

export function ImportView({ deckId }: { deckId?: string }) {
  const t = useT();
  const data = useData();
  const { addCards, go, notify } = useStore.getState();
  const [target, setTarget] = useState(deckId ?? data.decks[0]?.id ?? '');
  const [text, setText] = useState('');
  const [mapping, setMapping] = useState<Field[] | null>(null);
  const [skipDupes, setSkipDupes] = useState(true);
  const deck = data.decks.find((d) => d.id === target);

  const table = useMemo(() => parseTable(text), [text]);
  const columns = Math.max(0, ...table.rows.map((r) => r.length));
  const effective: Field[] =
    mapping && mapping.length === columns
      ? mapping
      : table.headerMapping && table.headerMapping.length >= columns
        ? table.headerMapping
        : defaultMapping(columns, deck?.language ?? 'en');

  const drafts = useMemo(() => (deck ? rowsToDrafts(table.rows, effective, deck.language) : []), [table, effective, deck]);
  const existing = useMemo(
    () => new Set(data.cards.filter((c) => c.deckId === target).map((c) => normalize(c.term))),
    [data.cards, target],
  );
  const fresh = skipDupes ? drafts.filter((d) => !existing.has(normalize(d.term))) : drafts;

  const loadFile = async () => {
    const f = await importText([{ name: 'CSV / TXT', extensions: ['csv', 'tsv', 'txt'] }]);
    if (f) {
      setText(f.content);
      setMapping(null);
    }
  };

  const doImport = () => {
    if (!deck || !fresh.length) return;
    const n = addCards(deck.id, fresh);
    notify(t('import.done', { n }));
    go({ name: 'deck', deckId: deck.id });
  };

  return (
    <div className="page">
      <button className="btn btn-ghost back" onClick={() => (deckId ? go({ name: 'deck', deckId }) : go({ name: 'decks' }))}>
        <ArrowLeft size={16} /> {t('common.back')}
      </button>
      <header className="page-head">
        <h1>{t('import.title')}</h1>
      </header>

      <div className="toolbar">
        <label className="field grow">
          <span>{t('add.deck')}</span>
          <div className="deck-switch">
            {data.decks.map((d) => (
              <button key={d.id} className={'lang-chip' + (d.id === target ? ' on' : '')} onClick={() => setTarget(d.id)}>
                <Flag code={d.language} size={18} /> {d.name}
              </button>
            ))}
          </div>
        </label>
      </div>

      <p className="muted">{t('import.help')}</p>
      <pre className="sample">{t('import.sample')}</pre>
      <textarea
        className="input textarea"
        rows={10}
        value={text}
        placeholder={t('import.placeholder')}
        onChange={(e) => {
          setText(e.target.value);
          setMapping(null);
        }}
      />
      <div className="row gap">
        <button className="btn" onClick={loadFile}>
          <FileUp size={16} /> {t('import.file')}
        </button>
        <label className="row gap small">
          <input type="checkbox" checked={skipDupes} onChange={(e) => setSkipDupes(e.target.checked)} />
          {t('import.skipDupes')}
        </label>
      </div>

      {columns > 0 && (
        <>
          <h3 className="section-title">{t('import.preview', { n: fresh.length })}</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {Array.from({ length: columns }, (_, i) => (
                    <th key={i}>
                      <select
                        className="input input-sm"
                        value={effective[i]}
                        onChange={(e) => {
                          const m = [...effective];
                          m[i] = e.target.value as Field;
                          setMapping(m);
                        }}
                      >
                        {FIELDS.map((f) => (
                          <option key={f} value={f}>
                            {t(`field.${f}`)}
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.slice(0, 8).map((r, i) => (
                  <tr key={i}>
                    {Array.from({ length: columns }, (_, j) => (
                      <td key={j} className={effective[j] === 'skip' ? 'muted' : ''}>
                        {r[j] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.rows.length > 8 && <p className="muted small">{t('import.more', { n: table.rows.length - 8 })}</p>}
          <div className="row end gap">
            {drafts.length !== fresh.length && <span className="muted">{t('import.dupes', { n: drafts.length - fresh.length })}</span>}
            <button className="btn btn-primary" disabled={!fresh.length || !deck} onClick={doImport}>
              {t('import.go', { n: fresh.length })}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
