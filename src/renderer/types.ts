export interface TorrentFile {
  name: string
  size: number
  downloaded: number
  progress: number
  path: string
}

export interface Torrent {
  infoHash: string
  name: string
  magnetURI: string
  size: number
  downloaded: number
  uploaded: number
  downloadSpeed: number
  uploadSpeed: number
  progress: number
  ratio: number
  numPeers: number
  path: string
  timeRemaining: number
  done: boolean
  paused: boolean
  files: TorrentFile[]
}

export interface Settings {
  downloadPath: string
  uploadLimit: number
  downloadLimit: number
  port: number
  maxConnections: number
  enableDHT: boolean
  enablePEX: boolean
  autoStart: boolean
}

export interface Stats {
  downloadSpeed: number
  uploadSpeed: number
  progress: number
  ratio: number
}

declare global {
  interface Window {
    electronAPI: {
      addTorrent: (torrentId: string) => Promise<Torrent>
      addTorrentFile: () => Promise<Torrent | null>
      getTorrents: () => Promise<Torrent[]>
      removeTorrent: (infoHash: string, deleteFiles: boolean) => Promise<boolean>
      pauseTorrent: (infoHash: string) => Promise<boolean>
      resumeTorrent: (infoHash: string) => Promise<boolean>
      getSettings: () => Promise<Settings>
      updateSettings: (settings: Partial<Settings>) => Promise<Settings>
      selectDirectory: () => Promise<string | null>
      getStats: () => Promise<Stats>
      setFilePriority: (infoHash: string, fileIndex: number, priority: number) => Promise<boolean>
      openFileLocation: (infoHash: string) => Promise<boolean>
      onTorrentsUpdate: (callback: (torrents: Torrent[]) => void) => void
      onStatsUpdate: (callback: (stats: Stats) => void) => void
    }
  }
}
