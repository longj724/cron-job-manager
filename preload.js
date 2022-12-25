const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  showFileDialog: () => ipcRenderer.invoke('showFileDialog'),
  createCronJob: (title, filePath, textExpression) =>
    ipcRenderer.invoke('createCronJob', title, filePath, textExpression),
  getJobs: () => ipcRenderer.invoke('getJobs'),
  deleteJob: (id, cronExpression, filePath) =>
    ipcRenderer.invoke('deleteJob', id, cronExpression, filePath),
  updateJob: (id, title, filePath, textExpression) =>
    ipcRenderer.invoke('updateJob', id, title, filePath, textExpression),
});
