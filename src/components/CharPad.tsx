import type { RefObject } from 'react';
import type { LangCode } from '../types';
import { lang } from '../lib/languages';

/** Buttons for letters that are missing on many keyboards (ä, ß, å …). */
export function CharPad({ code, inputRef, onInsert }: { code: LangCode; inputRef: RefObject<HTMLInputElement | null>; onInsert(value: string): void }) {
  const chars = lang(code).specialChars;
  if (!chars?.length) return null;
  const insert = (ch: string) => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const value = el.value.slice(0, start) + ch + el.value.slice(end);
    onInsert(value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + ch.length, start + ch.length);
    });
  };
  return (
    <div className="charpad">
      {chars.map((ch) => (
        <button key={ch} type="button" tabIndex={-1} className="chip" onMouseDown={(e) => e.preventDefault()} onClick={() => insert(ch)}>
          {ch}
        </button>
      ))}
    </div>
  );
}
