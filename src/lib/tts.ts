import type { Card, LangCode } from '../types';
import { lang } from './languages';

let voices: SpeechSynthesisVoice[] = [];
const listeners = new Set<() => void>();

function refresh() {
  if (typeof speechSynthesis === 'undefined') return;
  voices = speechSynthesis.getVoices();
  listeners.forEach((l) => l());
}

if (typeof speechSynthesis !== 'undefined') {
  refresh();
  speechSynthesis.addEventListener?.('voiceschanged', refresh);
}

export const ttsSupported = () => typeof speechSynthesis !== 'undefined';

export function onVoicesChanged(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function voicesFor(code: LangCode): SpeechSynthesisVoice[] {
  const tag = lang(code).tts.toLowerCase();
  const base = tag.split('-')[0];
  const alt = code === 'no' ? ['nb', 'no', 'nn'] : [base];
  return voices
    .filter((v) => alt.includes(v.lang.toLowerCase().replace('_', '-').split('-')[0]))
    .sort((a, b) => {
      // Exact region first, then "natural"/online voices which sound better on Windows.
      const score = (v: SpeechSynthesisVoice) =>
        (v.lang.toLowerCase().replace('_', '-') === tag ? 2 : 0) + (/natural|online|neural/i.test(v.name) ? 1 : 0);
      return score(b) - score(a);
    });
}

export function pickVoice(code: LangCode, preferredUri?: string): SpeechSynthesisVoice | undefined {
  const list = voicesFor(code);
  return list.find((v) => v.voiceURI === preferredUri) ?? list[0];
}

export function speak(text: string, code: LangCode, opts: { rate?: number; voiceUri?: string } = {}): void {
  if (!ttsSupported() || !text.trim()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang(code).tts;
  const v = pickVoice(code, opts.voiceUri);
  if (v) u.voice = v;
  u.rate = opts.rate ?? 1;
  speechSynthesis.speak(u);
}

export function stopSpeaking(): void {
  if (ttsSupported()) speechSynthesis.cancel();
}

/** What should be pronounced for a card: article + word, or the kana reading for Japanese. */
export function spokenText(card: Card, code: LangCode): string {
  const raw = lang(code).kana ? card.reading?.trim() || card.term : card.article ? `${card.article} ${card.term}` : card.term;
  // "cold (illness)", "mormor/farmor", "ich heiße …" → speak only the word itself.
  return raw.replace(/\([^)]*\)/g, ' ').replace(/[\/]/g, ', ').replace(/…/g, ' ').replace(/\s+/g, ' ').trim();
}
