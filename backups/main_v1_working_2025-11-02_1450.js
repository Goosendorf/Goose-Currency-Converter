const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 680,
    frame: false, // Removes the window frame for a cleaner look
    transparent: true, // Enables transparency
    alwaysOnTop: false, // Set to true if you want it to stay on top
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Note: In production, consider using contextIsolation: true with preload scripts for security
      enableRemoteModule: false
    }
  });

  // Remove menu bar
  mainWindow.setMenuBarVisibility(false);

  // Load the app
  mainWindow.loadFile('index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window controls
  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });

  ipcMain.on('close-window', () => {
    mainWindow.close();
  });

  ipcMain.on('toggle-always-on-top', () => {
    const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
    mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
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
