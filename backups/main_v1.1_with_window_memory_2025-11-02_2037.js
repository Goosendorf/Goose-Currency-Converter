const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, 'window-config.json');

function loadWindowConfig() {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch {
    return { x: undefined, y: undefined, width: 420, height: 680 };
  }
}

function saveWindowConfig(bounds) {
  fs.writeFileSync(configPath, JSON.stringify(bounds, null, 2));
}

function createWindow() {
  const config = loadWindowConfig();
  const mainWindow = new BrowserWindow({
    width: config.width,
    height: config.height,
    x: config.x,
    y: config.y,
    frame: false,
    transparent: true,
    alwaysOnTop: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false
    }
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile('index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Save position when moved or resized
  mainWindow.on('moved', () => {
    saveWindowConfig(mainWindow.getBounds());
  });

  mainWindow.on('resized', () => {
    saveWindowConfig(mainWindow.getBounds());
  });

  // Handle window controls
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('close-window', () => {
    saveWindowConfig(mainWindow.getBounds());
    mainWindow.close();
  });

  ipcMain.on('toggle-always-on-top', () => {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
