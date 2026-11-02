# Wort

Wort is a desktop app for Windows for learning vocabulary in foreign languages. It focuses on **English, German, Swedish and Japanese**, and also supports French, Spanish, Italian, Dutch, Norwegian, Finnish, Portuguese, Korean, Chinese and Russian.

Interface languages: Russian, English, German.

## Features

- **Spaced repetition (FSRS).** Wort uses FSRS, the scheduling algorithm Anki also uses. It picks which words are due so you review each one just before you would forget it.
- **Both directions.** "Word → meaning" (recognition) and "meaning → word" (recall) are scheduled separately. The reverse card for a word unlocks only after you have seen it in the forward direction.
- **Five study modes:** flashcards, typing, multiple choice, listening (dictation) and a mix of all four. A practice mode reviews words without changing their schedule.
- **Answer checking:**
  - accepts any of several meanings ("собака, пёс")
  - tolerates typos
  - accepts `schoen` for `schön`
  - points out missing diacritics
  - for German and Swedish, checks the article (`der/die/das`, `en/ett`)
  - for Japanese, accepts the answer in kanji, kana or romaji, and converts romaji to kana as you type
- **Language helpers:**
  - articles are colour-coded by gender: der (blue), die (red), das (green)
  - buttons for ä ö ü ß å
  - furigana appears only above the kanji (食<sup>た</sup>べる)
  - grammar forms (plural, verb forms)
- **Pronunciation** through the voices installed in Windows. Words can play automatically, and you can pick the voice and speed.
- **Keyboard-driven:**

  | Key | Action |
  | --- | --- |
  | Space | show the answer / rate "Good" |
  | 1–4 | rate the answer |
  | R | play the word again |
  | E | edit the card mid-session |
  | Ctrl+Z | undo the last answer |
  | Ctrl+1…5 | switch sections |

- **Adding words:**
  - a quick-add form: type `der Hund` and the article is filled in by itself
  - duplicate warnings
  - bulk import from a pasted list or a CSV file, with column mapping
- **Statistics:** daily goal, study streak, activity calendar, 2-week review forecast, success rate.
- **Starter decks** of 40–55 words each for English, German, Swedish and Japanese, with translations, grammar forms and examples.
- **Data safety.** Everything is stored locally in `%APPDATA%\Wort\wort-data.json`. Wort makes a backup every day and keeps the last 14. You can also export a backup or a CSV file yourself.
- Light and dark themes, adjustable text size.

## Installation (Windows)

1. Open the **Actions** tab in the GitHub repository and choose the latest successful **Build** run.
2. Download the **Wort-Windows** artifact.
3. Inside it are two files:
   - `Wort-Setup-x.y.z.exe`, the installer (Start menu and desktop shortcuts);
   - `Wort-Portable-x.y.z.exe`, a portable version that runs without installation.

When a `v*` tag is pushed (for example `v0.1.0`), the installers are also attached to a GitHub release.

> The app is not code-signed yet, so Windows SmartScreen may show a warning on first launch. Click "More info" → "Run anyway".

**Voices for pronunciation.** If a language has no voice, open *Settings → Time & language → Speech → Add voices* in Windows and install the Swedish, Japanese or other voice you need.

## Development

You need Node.js 20 or newer.

```bash
npm install
```

Run the desktop app with hot reload:

```bash
npm run dev
```

Run only the interface in a browser (data goes to localStorage):

```bash
npm run dev:web
```

Run the tests:

```bash
npm test
```

Build the Windows installer into `release/`:

```bash
npm run dist:win
```

The NSIS installer must be built on Windows, or on Linux/macOS with Wine installed. CI builds it on `windows-latest`.

### Structure

```
electron/          Electron main process: data file, backups, file dialogs
src/
  lib/srs.ts       FSRS wrapper (ts-fsrs)
  lib/queue.ts     daily queue: limits, learning, review order
  lib/answer.ts    answer checking (typos, articles, kana)
  lib/furigana.ts  aligns readings with kanji
  lib/tts.ts       speech synthesis
  lib/importExport.ts  CSV/TSV parsing and export
  data/starter.ts  starter decks
  views/           screens: Today, Decks, Study, Statistics, Settings…
  strings.ts       interface strings (ru/en/de)
```

Stack: Electron, React, TypeScript, Vite, Zustand, ts-fsrs, WanaKana.
