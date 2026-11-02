import { useMemo, useState } from 'react';
import { Clock, Flame, Play, Plus, Sparkles, Target, Dumbbell } from 'lucide-react';
import { useData, useStore } from '../store';
import { useT } from '../i18n';
import { deckCounts, todayCounts } from '../lib/queue';
import { streak, studyTimeToday } from '../lib/stats';
import { Flag } from '../components/Flag';
import { StudySetup, startStudy } from '../components/StudySetup';
import { lang } from '../lib/languages';

function Ring({ value, max, children }: { value: number; max: number; children: React.ReactNode }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, max ? value / max : 0);
  return (
    <div className="ring">
      <svg width="84" height="84" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} className="ring-bg" />
        <circle cx="42" cy="42" r={r} className="ring-fg" strokeDasharray={c} strokeDashoffset={c * (1 - p)} />
      </svg>
      <div className="ring-label">{children}</div>
    </div>
  );
}

export function HomeView() {
  const t = useT();
  const data = useData();
  const go = useStore((s) => s.go);
  const last = useStore((s) => s.lastStudy);
  const [setup, setSetup] = useState<{ ids: string[]; cram: boolean } | null>(null);
  const now = useMemo(() => new Date(), [data]);
  const today = useMemo(() => todayCounts(data, now), [data, now]);
  const counts = useMemo(() => new Map(data.decks.map((d) => [d.id, deckCounts(data, d, now, today)])), [data, now, today]);
  const st = useMemo(() => streak(data, now), [data, now]);
  const minutes = Math.round(studyTimeToday(data, now) / 60_000);

  let due = 0;
  let fresh = 0;
  counts.forEach((c) => {
    due += c.due + c.learning;
    fresh += c.newAvailable;
  });
  const allIds = data.decks.map((d) => d.id);
  const mode = last?.mode ?? data.settings.defaultMode;

  const quickStart = (ids: string[]) =>
    startStudy({ deckIds: ids, mode, cram: false, cramDir: 'fwd', cramLimit: 20 }, t('study.nothing'));

  const hour = now.getHours();
  const greeting = hour < 5 ? 'home.night' : hour < 12 ? 'home.morning' : hour < 18 ? 'home.day' : 'home.evening';

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>{t(greeting)}</h1>
          <p className="muted">
            {now.toLocaleDateString(data.settings.uiLang, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </header>

      <section className="stat-row">
        <div className="stat-card">
          <Ring value={today.reviewsDone} max={data.settings.dailyGoal}>
            <Target size={18} />
          </Ring>
          <div>
            <div className="stat-value">
              {today.reviewsDone} / {data.settings.dailyGoal}
            </div>
            <div className="muted">{t('home.goal')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className={'stat-icon flame' + (st.today ? ' lit' : '')}>
            <Flame size={28} />
          </div>
          <div>
            <div className="stat-value">{t('common.days', { n: st.days })}</div>
            <div className="muted">{st.today || !st.days ? t('home.streak') : t('home.streakKeep')}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={26} />
          </div>
          <div>
            <div className="stat-value">{t('common.minutes', { n: minutes })}</div>
            <div className="muted">{t('home.time')}</div>
          </div>
        </div>
      </section>

      {data.decks.length === 0 ? (
        <section className="empty">
          <Sparkles size={32} />
          <p>{t('home.noDecks')}</p>
          <button className="btn btn-primary" onClick={() => go({ name: 'decks' })}>
            <Plus size={16} /> {t('decks.create')}
          </button>
        </section>
      ) : (
        <section className="hero">
          {due + fresh > 0 ? (
            <>
              <div>
                <h2>{t('home.ready')}</h2>
                <p className="muted">
                  {t('home.dueSummary', { due, fresh })}
                </p>
              </div>
              <div className="row gap">
                <button className="btn" onClick={() => setSetup({ ids: allIds, cram: false })}>
                  {t('home.options')}
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => quickStart(allIds)} autoFocus>
                  <Play size={18} /> {t('home.start')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2>{t('home.allDone')}</h2>
                <p className="muted">{t('home.allDoneHint')}</p>
              </div>
              <button className="btn" onClick={() => setSetup({ ids: allIds, cram: true })}>
                <Dumbbell size={16} /> {t('home.practice')}
              </button>
            </>
          )}
        </section>
      )}

      {data.decks.length > 0 && (
        <section>
          <h3 className="section-title">{t('home.decks')}</h3>
          <div className="deck-grid">
            {data.decks.map((d) => {
              const c = counts.get(d.id)!;
              const todo = c.due + c.learning + c.newAvailable;
              return (
                <div key={d.id} className="deck-tile" onClick={() => go({ name: 'deck', deckId: d.id })}>
                  <div className="row gap">
                    <Flag code={d.language} size={28} />
                    <div className="grow">
                      <strong>{d.name}</strong>
                      <div className="muted small">
                        {lang(d.language).name[data.settings.uiLang]} · {t('common.words', { n: c.total })}
                      </div>
                    </div>
                  </div>
                  <div className="deck-counts">
                    <span className="count due" title={t('count.due')}>
                      {c.due + c.learning}
                    </span>
                    <span className="count new" title={t('count.new')}>
                      {c.newAvailable}
                    </span>
                    <span className="grow" />
                    {todo > 0 ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickStart([d.id]);
                        }}
                      >
                        <Play size={14} /> {t('deck.study')}
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm"
                        disabled={!c.total}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSetup({ ids: [d.id], cram: true });
                        }}
                      >
                        <Dumbbell size={14} /> {t('home.practice')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {setup && <StudySetup deckIds={setup.ids} cram={setup.cram} onClose={() => setSetup(null)} />}
    </div>
  );
}
