/** Persistence: a JSON file via Electron in the desktop app, localStorage in a plain browser (dev). */

interface DesktopBridge {
  isDesktop: true;
  load(): Promise<string | null>;
  save(json: string): Promise<boolean>;
  saveSync(json: string): boolean;
  exportFile(opts: { defaultName: string; content: string; filters?: { name: string; extensions: string[] }[] }): Promise<string | null>;
  importFile(opts: { filters?: { name: string; extensions: string[] }[] }): Promise<{ name: string; content: string } | null>;
  openDataFolder(): Promise<string>;
  info(): Promise<{ version: string; dataPath: string; platform: string }>;
}

declare global {
  interface Window {
    wort?: DesktopBridge;
  }
}

const KEY = 'wort-data';

export const desktop = (): DesktopBridge | undefined => (typeof window !== 'undefined' ? window.wort : undefined);

export async function loadRaw(): Promise<string | null> {
  const d = desktop();
  if (d) return d.load();
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export async function saveRaw(json: string): Promise<void> {
  const d = desktop();
  if (d) {
    await d.save(json);
    return;
  }
  try {
    localStorage.setItem(KEY, json);
  } catch (err) {
    console.error('Could not save', err);
  }
}

export function saveRawSync(json: string): void {
  const d = desktop();
  if (d) d.saveSync(json);
  else {
    try {
      localStorage.setItem(KEY, json);
    } catch {
      /* ignore */
    }
  }
}

type Filter = { name: string; extensions: string[] };

export async function exportText(defaultName: string, content: string, filters: Filter[]): Promise<boolean> {
  const d = desktop();
  if (d) return !!(await d.exportFile({ defaultName, content, filters }));
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = defaultName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  return true;
}

export async function importText(filters: Filter[]): Promise<{ name: string; content: string } | null> {
  const d = desktop();
  if (d) return d.importFile({ filters });
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = filters.flatMap((f) => f.extensions.map((e) => '.' + e)).join(',');
    input.onchange = async () => {
      const file = input.files?.[0];
      resolve(file ? { name: file.name, content: await file.text() } : null);
    };
    input.click();
  });
}
