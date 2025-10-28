import { contextBridge, ipcRenderer } from 'electron'

const api = {
  // Torrent operations
  addTorrent: (torrentId: string) => ipcRenderer.invoke('add-torrent', torrentId),
  addTorrentFile: () => ipcRenderer.invoke('add-torrent-file'),
  getTorrents: () => ipcRenderer.invoke('get-torrents'),
  removeTorrent: (infoHash: string, deleteFiles: boolean) =>
    ipcRenderer.invoke('remove-torrent', infoHash, deleteFiles),

  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),

  // Stats
  getStats: () => ipcRenderer.invoke('get-stats'),

  // File operations
  setFilePriority: (infoHash: string, fileIndex: number, priority: number) =>
    ipcRenderer.invoke('set-file-priority', infoHash, fileIndex, priority),
  openFileLocation: (infoHash: string) => ipcRenderer.invoke('open-file-location', infoHash),

  // Event listeners
  onTorrentsUpdate: (callback: (torrents: any[]) => void) => {
    ipcRenderer.on('torrents-update', (_, torrents) => callback(torrents))
  },
  onStatsUpdate: (callback: (stats: any) => void) => {
    ipcRenderer.on('stats-update', (_, stats) => callback(stats))
  },
}

contextBridge.exposeInMainWorld('electronAPI', api)

export type ElectronAPI = typeof api
