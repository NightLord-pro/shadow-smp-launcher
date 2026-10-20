const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcherAPI', {
  checkServer: (host, port) => ipcRenderer.invoke('server:check', host, port),
  copyServer: (address) => ipcRenderer.invoke('server:copy', address),
  openMinecraft: () => ipcRenderer.invoke('minecraft:open'),
  openDownloadPage: () => ipcRenderer.invoke('external:open', 'https://www.minecraft.net/download')
});
