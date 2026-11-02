import { forwardRef, useRef, type InputHTMLAttributes } from 'react';
import { toKana } from 'wanakana';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string;
  onValue(value: string): void;
  /** Convert romaji to kana while typing (Japanese). Uppercase letters give katakana. */
  kana?: boolean;
};

/** Text input that can turn romaji into kana on the fly, without breaking a system IME. */
export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput({ value, onValue, kana, ...rest }, ref) {
  const composing = useRef(false);
  return (
    <input
      {...rest}
      ref={ref}
      value={value}
      autoComplete="off"
      spellCheck={false}
      onCompositionStart={() => (composing.current = true)}
      onCompositionEnd={(e) => {
        composing.current = false;
        onValue(e.currentTarget.value);
      }}
      onChange={(e) => {
        const v = e.target.value;
        if (kana && !composing.current && /[a-zA-Z]/.test(v)) onValue(toKana(v, { IMEMode: true }));
        else onValue(v);
      }}
    />
  );
});
