// Wort — Electron main process.
// Keeps all user data in a single JSON file inside the OS "userData" folder
// (on Windows: %APPDATA%\Wort) and makes a daily backup copy of it.
const { app, BrowserWindow, ipcMain, dialog, shell, Menu, nativeTheme } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const fsp = fs.promises;

const DEV_URL = process.env.VITE_DEV_SERVER_URL;
const BACKUPS_TO_KEEP = 14;

const dataFile = () => path.join(app.getPath('userData'), 'wort-data.json');
const backupDir = () => path.join(app.getPath('userData'), 'backups');

/** @type {BrowserWindow | null} */
let win = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });
}

async function readData() {
  try {
    return await fsp.readFile(dataFile(), 'utf8');
  } catch (err) {
    if (err && err.code === 'ENOENT') return null;
    throw err;
  }
}

// Serialize writes so two saves never interleave.
let writeChain = Promise.resolve();
function writeData(json) {
  writeChain = writeChain
    .catch(() => {})
    .then(async () => {
      const file = dataFile();
      const tmp = file + '.tmp';
      await fsp.mkdir(path.dirname(file), { recursive: true });
      await fsp.writeFile(tmp, json, 'utf8');
      try {
        await fsp.rename(tmp, file);
      } catch {
        // Windows can refuse the rename if another process (antivirus, indexer) holds the file.
        await fsp.writeFile(file, json, 'utf8');
        await fsp.rm(tmp, { force: true });
      }
    });
  return writeChain;
}

async function makeDailyBackup() {
  try {
    const file = dataFile();
    if (!fs.existsSync(file)) return;
    const dir = backupDir();
    await fsp.mkdir(dir, { recursive: true });
    const stamp = new Date().toISOString().slice(0, 10);
    const target = path.join(dir, `wort-${stamp}.json`);
    if (!fs.existsSync(target)) await fsp.copyFile(file, target);
    const files = (await fsp.readdir(dir)).filter((f) => /^wort-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
    for (const old of files.slice(0, Math.max(0, files.length - BACKUPS_TO_KEEP))) {
      await fsp.rm(path.join(dir, old), { force: true });
    }
  } catch (err) {
    console.error('Backup failed', err);
  }
}

function registerIpc() {
  ipcMain.handle('store:load', () => readData());
  ipcMain.handle('store:save', async (_e, json) => {
    if (typeof json !== 'string') throw new Error('Invalid payload');
    await writeData(json);
    return true;
  });
  // Used on window close so the last change is never lost.
  ipcMain.on('store:saveSync', (e, json) => {
    try {
      if (typeof json === 'string') {
        fs.mkdirSync(path.dirname(dataFile()), { recursive: true });
        fs.writeFileSync(dataFile(), json, 'utf8');
      }
      e.returnValue = true;
    } catch (err) {
      console.error(err);
      e.returnValue = false;
    }
  });

  ipcMain.handle('file:export', async (_e, opts) => {
    const { defaultName, content, filters } = opts || {};
    const res = await dialog.showSaveDialog(win, {
      defaultPath: path.join(app.getPath('documents'), String(defaultName || 'wort-export.json')),
      filters: Array.isArray(filters) ? filters : undefined,
    });
    if (res.canceled || !res.filePath) return null;
    await fsp.writeFile(res.filePath, String(content ?? ''), 'utf8');
    return res.filePath;
  });

  ipcMain.handle('file:import', async (_e, opts) => {
    const { filters } = opts || {};
    const res = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: Array.isArray(filters) ? filters : undefined,
    });
    if (res.canceled || !res.filePaths[0]) return null;
    const file = res.filePaths[0];
    const stat = await fsp.stat(file);
    if (stat.size > 50 * 1024 * 1024) throw new Error('File is too large');
    return { name: path.basename(file), content: await fsp.readFile(file, 'utf8') };
  });

  ipcMain.handle('app:openDataFolder', () => shell.openPath(app.getPath('userData')));
  ipcMain.handle('app:info', () => ({
    version: app.getVersion(),
    dataPath: dataFile(),
    platform: process.platform,
  }));
}

function createWindow() {
  win = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: 'Wort',
    autoHideMenuBar: true,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#16181d' : '#f6f5f2',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
    },
  });

  win.once('ready-to-show', () => win && win.show());

  // Open external links in the default browser, never inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    const allowed = DEV_URL ? url.startsWith(DEV_URL) : url.startsWith('file://');
    if (!allowed) e.preventDefault();
  });

  win.webContents.on('before-input-event', (_e, input) => {
    if (input.type === 'keyDown' && input.key === 'F12' && win) win.webContents.toggleDevTools();
  });

  if (DEV_URL) {
    win.loadURL(DEV_URL);
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(async () => {
  if (process.platform === 'win32') app.setAppUserModelId('app.wort.desktop');
  Menu.setApplicationMenu(null);
  registerIpc();
  await makeDailyBackup();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
