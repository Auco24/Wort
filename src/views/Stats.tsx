import { useMemo } from 'react';
import { useData } from '../store';
import { useT } from '../i18n';
import { addDays, dayKey, dayStart } from '../lib/day';
import { forecast, retentionRate, reviewsPerDay, streak, wordsByLanguage } from '../lib/stats';
import { lang } from '../lib/languages';
import { Flag } from '../components/Flag';

const WEEKS = 26;

function Heatmap({ perDay, startHour, ui }: { perDay: Map<string, number>; startHour: number; ui: string }) {
  const today = dayStart(new Date(), startHour);
  // Align columns to weeks starting on Monday.
  const offset = (today.getDay() + 6) % 7;
  const first = addDays(today, -(WEEKS - 1) * 7 - offset);
  const max = Math.max(1, ...perDay.values());
  const cells: { x: number; y: number; n: number; label: string }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(first, w * 7 + d);
      if (date > today) continue;
      const n = perDay.get(dayKey(date, startHour)) ?? 0;
      cells.push({ x: w, y: d, n, label: `${date.toLocaleDateString(ui)}: ${n}` });
    }
  }
  const level = (n: number) => (n === 0 ? 0 : Math.min(4, 1 + Math.floor((n / max) * 3.999)));
  return (
    <svg className="heatmap" viewBox={`0 0 ${WEEKS * 14} ${7 * 14}`} role="img">
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x * 14} y={c.y * 14} width="11" height="11" rx="2.5" className={`heat-${level(c.n)}`}>
          <title>{c.label}</title>
        </rect>
      ))}
    </svg>
  );
}

export function StatsView() {
  const t = useT();
  const data = useData();
  const ui = data.settings.uiLang;
  const now = useMemo(() => new Date(), [data]);
  const perDay = useMemo(() => reviewsPerDay(data), [data]);
  const st = streak(data, now, perDay);
  const retention = retentionRate(data, now);
  const fc = useMemo(() => forecast(data, now, 14), [data, now]);
  const fcMax = Math.max(1, ...fc);
  const byLang = useMemo(() => wordsByLanguage(data), [data]);
  const totalMinutes = Math.round(data.reviews.reduce((s, r) => s + r.ms, 0) / 60_000);
  const studyDays = [...perDay.values()].filter((n) => n > 0).length;

  return (
    <div className="page">
      <header className="page-head">
        <h1>{t('nav.stats')}</h1>
      </header>

      <section className="stat-row">
        <div className="stat-card col">
          <div className="stat-value">{t('common.days', { n: st.days })}</div>
          <div className="muted">{t('stats.streak')}</div>
        </div>
        <div className="stat-card col">
          <div className="stat-value">{data.reviews.length}</div>
          <div className="muted">{t('stats.answers')}</div>
        </div>
        <div className="stat-card col">
          <div className="stat-value">{retention == null ? '—' : `${Math.round(retention * 100)}%`}</div>
          <div className="muted">{t('stats.retention')}</div>
        </div>
        <div className="stat-card col">
          <div className="stat-value">{t('common.minutes', { n: totalMinutes })}</div>
          <div className="muted">{t('stats.time', { n: studyDays })}</div>
        </div>
      </section>

      <section className="panel">
        <h3 className="section-title">{t('stats.activity')}</h3>
        <Heatmap perDay={perDay} startHour={data.settings.dayStartHour} ui={ui} />
      </section>

      <section className="panel">
        <h3 className="section-title">{t('stats.forecast')}</h3>
        <div className="bars">
          {fc.map((n, i) => (
            <div key={i} className="bar-col" title={`${n}`}>
              <span className="bar-num">{n || ''}</span>
              <div className="bar" style={{ height: `${(n / fcMax) * 100}%` }} />
              <span className="bar-label">{i === 0 ? t('stats.today') : addDays(now, i).toLocaleDateString(ui, { weekday: 'short' })}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="section-title">{t('stats.byLanguage')}</h3>
        <table className="table">
          <thead>
            <tr>
              <th />
              <th>{t('status.new')}</th>
              <th>{t('status.learning')}</th>
              <th>{t('status.young')}</th>
              <th>{t('status.mature')}</th>
            </tr>
          </thead>
          <tbody>
            {[...byLang.entries()].map(([code, b]) => (
              <tr key={code}>
                <td className="row gap">
                  <Flag code={code} /> {lang(code).name[ui]}
                </td>
                <td>{b.new}</td>
                <td>{b.learning}</td>
                <td>{b.young}</td>
                <td>
                  <b>{b.mature}</b>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="muted small">{t('stats.matureHint')}</p>
      </section>
    </div>
  );
}
