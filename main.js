// External Dependencies
const path = require('path');
const { fork } = require('child_process');
const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');

// Relative Dependencies
const {
  handleCreateCronJob,
  handleDeleteJob,
  handleGetJobs,
  handleShowFileDialog,
  handleUpdateJob,
} = require('./ipcHandlers/handlers.js');

function createWindow() {
  const win = new BrowserWindow({
    title: 'Cron Job Manager',
    width: 850,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, './build/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then(() => {
  ipcMain.handle('getJobs', handleGetJobs);
  ipcMain.handle('showFileDialog', handleShowFileDialog);
  ipcMain.handle('createCronJob', handleCreateCronJob);
  ipcMain.handle('deleteJob', handleDeleteJob);
  ipcMain.handle('updateJob', handleUpdateJob);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
