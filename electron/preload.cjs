// Bridge between the sandboxed UI and the main process.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wort', {
  isDesktop: true,
  load: () => ipcRenderer.invoke('store:load'),
  save: (json) => ipcRenderer.invoke('store:save', json),
  saveSync: (json) => ipcRenderer.sendSync('store:saveSync', json),
  exportFile: (opts) => ipcRenderer.invoke('file:export', opts),
  importFile: (opts) => ipcRenderer.invoke('file:import', opts),
  openDataFolder: () => ipcRenderer.invoke('app:openDataFolder'),
  info: () => ipcRenderer.invoke('app:info'),
});
