import { Volume2 } from 'lucide-react';
import type { Card, LangCode } from '../types';
import { speak, spokenText, ttsSupported } from '../lib/tts';
import { useSettings } from '../store';

export function useSpeak() {
  const settings = useSettings();
  return (text: string, code: LangCode) => speak(text, code, { rate: settings.ttsRate, voiceUri: settings.voices[code] });
}

export function SpeakButton({ card, code, size = 18, title }: { card: Card; code: LangCode; size?: number; title?: string }) {
  const say = useSpeak();
  if (!ttsSupported()) return null;
  return (
    <button
      type="button"
      className="icon-btn speak"
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.stopPropagation();
        say(spokenText(card, code), code);
      }}
    >
      <Volume2 size={size} />
    </button>
  );
}
