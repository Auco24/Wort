import type { LangCode } from '../types';

/** Small drawn flags: emoji flags are not rendered on Windows. */
export function Flag({ code, size = 22 }: { code: LangCode; size?: number }) {
  const w = size;
  const h = Math.round((size * 2) / 3);
  const common = { width: w, height: h, viewBox: '0 0 30 20', className: 'flag', 'aria-hidden': true } as const;
  switch (code) {
    case 'en':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0L30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
          <path d="M0 0L30 20M30 0L0 20" stroke="#C8102E" strokeWidth="1.5" />
          <path d="M15 0V20M0 10H30" stroke="#fff" strokeWidth="6" />
          <path d="M15 0V20M0 10H30" stroke="#C8102E" strokeWidth="3.5" />
        </svg>
      );
    case 'de':
      return (
        <svg {...common}>
          <rect width="30" height="7" fill="#000" />
          <rect y="6.67" width="30" height="6.67" fill="#DD0000" />
          <rect y="13.33" width="30" height="6.67" fill="#FFCE00" />
        </svg>
      );
    case 'sv':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#006AA7" />
          <rect x="9" width="4" height="20" fill="#FECC00" />
          <rect y="8" width="30" height="4" fill="#FECC00" />
        </svg>
      );
    case 'ja':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fff" stroke="#ddd" strokeWidth="0.6" />
          <circle cx="15" cy="10" r="6" fill="#BC002D" />
        </svg>
      );
    case 'fr':
    case 'it': {
      const [a, b, c] = code === 'fr' ? ['#0055A4', '#fff', '#EF4135'] : ['#009246', '#fff', '#CE2B37'];
      return (
        <svg {...common}>
          <rect width="10" height="20" fill={a} />
          <rect x="10" width="10" height="20" fill={b} />
          <rect x="20" width="10" height="20" fill={c} />
        </svg>
      );
    }
    case 'es':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#AA151B" />
          <rect y="5" width="30" height="10" fill="#F1BF00" />
        </svg>
      );
    case 'nl':
    case 'ru': {
      const [a, b, c] = code === 'nl' ? ['#AE1C28', '#fff', '#21468B'] : ['#fff', '#0039A6', '#D52B1E'];
      return (
        <svg {...common}>
          <rect width="30" height="7" fill={a} />
          <rect y="6.67" width="30" height="6.67" fill={b} />
          <rect y="13.33" width="30" height="6.67" fill={c} />
        </svg>
      );
    }
    case 'no':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#BA0C2F" />
          <rect x="8" width="6" height="20" fill="#fff" />
          <rect y="7" width="30" height="6" fill="#fff" />
          <rect x="9.5" width="3" height="20" fill="#00205B" />
          <rect y="8.5" width="30" height="3" fill="#00205B" />
        </svg>
      );
    case 'fi':
      return (
        <svg {...common}>
          <rect width="30" height="20" fill="#fff" />
          <rect x="8" width="5" height="20" fill="#002F6C" />
          <rect y="7.5" width="30" height="5" fill="#002F6C" />
        </svg>
      );
    default:
      return (
        <span className="flag flag-code" style={{ width: w, height: h, fontSize: h * 0.6 }}>
          {code.toUpperCase()}
        </span>
      );
  }
}
