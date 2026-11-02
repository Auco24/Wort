/** Day boundaries that respect the "new day starts at" hour (default 4:00), like Anki. */

export function dayStart(date: Date, startHour: number): Date {
  const d = new Date(date);
  if (d.getHours() < startHour) d.setDate(d.getDate() - 1);
  d.setHours(startHour, 0, 0, 0);
  return d;
}

export function nextDayStart(date: Date, startHour: number): Date {
  const d = dayStart(date, startHour);
  d.setDate(d.getDate() + 1);
  return d;
}

/** Local calendar key (YYYY-MM-DD) of the study day that contains `date`. */
export function dayKey(date: Date | number, startHour: number): string {
  const d = dayStart(new Date(date), startHour);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
