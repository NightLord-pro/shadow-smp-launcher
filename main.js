const { app, BrowserWindow, ipcMain, shell, clipboard } = require('electron');
const net = require('node:net');
const path = require('node:path');

const DEFAULT_SERVER = {
  name: 'YOUR SMP',
  host: 'play.example.net',
  port: 25565
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 720,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#090811',
    title: 'Monarch Client',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('server:check', async (_event, host, port) => {
  if (typeof host !== 'string' || !/^[a-zA-Z0-9.-]+$/.test(host) || host.length > 253) {
    return { online: false, message: 'Check the server address in renderer.js.' };
  }
  const numericPort = Number(port);
  if (!Number.isInteger(numericPort) || numericPort < 1 || numericPort > 65535) {
    return { online: false, message: 'Invalid server port.' };
  }

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(2500);
    socket.once('connect', () => finish({ online: true, message: 'Server is reachable' }));
    socket.once('timeout', () => finish({ online: false, message: 'Connection timed out' }));
    socket.once('error', () => finish({ online: false, message: 'Server is offline or unreachable' }));
    socket.connect(numericPort, host);
  });
});

ipcMain.handle('server:copy', (_event, address) => {
  if (typeof address !== 'string' || address.length > 300) return false;
  clipboard.writeText(address);
  return true;
});

ipcMain.handle('minecraft:open', async () => {
  // Opens the official Minecraft Launcher protocol handler, if installed.
  // This app does not implement or bypass Minecraft account authentication.
  try {
    await shell.openExternal('minecraft://');
    return {
      ok: true,
      message: 'Requested the official Minecraft Launcher. If it did not open, start it from the Start menu.'
    };
  } catch {
    return {
      ok: false,
      message: 'Could not open Minecraft automatically. Install/open the official Minecraft Launcher, then try again.'
    };
  }
});

ipcMain.handle('external:open', async (_event, url) => {
  if (url === 'https://www.minecraft.net/download') {
    await shell.openExternal(url);
    return true;
  }
  return false;
});
