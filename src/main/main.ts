import { app, BrowserWindow, ipcMain, dialog, Tray, Menu, nativeImage, shell } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import WebTorrent from 'webtorrent'
import fs from 'fs'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const isDev = process.env.NODE_ENV === 'development'

interface Settings {
  downloadPath: string
  uploadLimit: number
  downloadLimit: number
  port: number
  maxConnections: number
  enableDHT: boolean
  enablePEX: boolean
  autoStart: boolean
}

class TorrentApp {
  public mainWindow: BrowserWindow | null = null
  private client: WebTorrent.Instance
  private tray: Tray | null = null
  private settings: Settings
  private settingsPath: string

  constructor() {
    this.settingsPath = path.join(app.getPath('userData'), 'settings.json')
    this.settings = this.loadSettings()
    this.client = new WebTorrent({
      maxConns: this.settings.maxConnections,
      dht: this.settings.enableDHT,
    })

    this.setupIPC()
  }

  private loadSettings(): Settings {
    const defaultSettings: Settings = {
      downloadPath: path.join(os.homedir(), 'Downloads', 'GGTorrents'),
      uploadLimit: -1, // unlimited
      downloadLimit: -1, // unlimited
      port: 6881,
      maxConnections: 55,
      enableDHT: true,
      enablePEX: true,
      autoStart: false,
    }

    try {
      if (fs.existsSync(this.settingsPath)) {
        const data = fs.readFileSync(this.settingsPath, 'utf-8')
        return { ...defaultSettings, ...JSON.parse(data) }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }

    // Ensure download directory exists
    if (!fs.existsSync(defaultSettings.downloadPath)) {
      fs.mkdirSync(defaultSettings.downloadPath, { recursive: true })
    }

    return defaultSettings
  }

  private saveSettings() {
    try {
      fs.writeFileSync(this.settingsPath, JSON.stringify(this.settings, null, 2))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  createWindow() {
    // Remove default menu
    Menu.setApplicationMenu(null)

    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      icon: path.join(__dirname, '../../assets/icon.png'),
      backgroundColor: '#0f172a',
      show: false,
    })

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show()
    })

    if (isDev) {
      this.mainWindow.loadURL('http://localhost:5173')
      this.mainWindow.webContents.openDevTools()
    } else {
      this.mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'))
    }

    this.mainWindow.on('close', (event) => {
      if (!isQuitting) {
        event.preventDefault()
        this.mainWindow?.hide()
      }
    })

    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    })
  }

  createTray() {
    const iconPath = path.join(__dirname, '../../assets/icon.png')
    const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 })

    this.tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App',
        click: () => {
          this.mainWindow?.show()
        },
      },
      {
        label: 'Quit',
        click: () => {
          isQuitting = true
          app.quit()
        },
      },
    ])

    this.tray.setContextMenu(contextMenu)
    this.tray.setToolTip('GGTorrents')

    this.tray.on('click', () => {
      this.mainWindow?.show()
    })
  }

  private setupIPC() {
    // Add torrent
    ipcMain.handle('add-torrent', async (_, torrentId: string) => {
      return new Promise((resolve, reject) => {
        try {
          this.client.add(torrentId, { path: this.settings.downloadPath }, (torrent) => {
            resolve(this.getTorrentInfo(torrent))
            this.sendTorrentUpdate()
          })
        } catch (error) {
          reject(error)
        }
      })
    })

    // Add torrent from file
    ipcMain.handle('add-torrent-file', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Torrent Files', extensions: ['torrent'] }],
      })

      if (!result.canceled && result.filePaths.length > 0) {
        return new Promise((resolve, reject) => {
          try {
            this.client.add(result.filePaths[0], { path: this.settings.downloadPath }, (torrent) => {
              resolve(this.getTorrentInfo(torrent))
              this.sendTorrentUpdate()
            })
          } catch (error) {
            reject(error)
          }
        })
      }
      return null
    })

    // Get all torrents
    ipcMain.handle('get-torrents', () => {
      return this.client.torrents.map(t => this.getTorrentInfo(t))
    })

    // Remove torrent
    ipcMain.handle('remove-torrent', (_, infoHash: string, deleteFiles: boolean) => {
      const torrent = this.client.get(infoHash)
      if (torrent) {
        this.client.remove(infoHash, { destroyStore: deleteFiles })
        this.sendTorrentUpdate()
        return true
      }
      return false
    })

    // Get settings
    ipcMain.handle('get-settings', () => {
      return this.settings
    })

    // Update settings
    ipcMain.handle('update-settings', (_, newSettings: Partial<Settings>) => {
      this.settings = { ...this.settings, ...newSettings }
      this.saveSettings()

      // Ensure download directory exists
      if (!fs.existsSync(this.settings.downloadPath)) {
        fs.mkdirSync(this.settings.downloadPath, { recursive: true })
      }

      return this.settings
    })

    // Select download directory
    ipcMain.handle('select-directory', async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath: this.settings.downloadPath,
      })

      if (!result.canceled && result.filePaths.length > 0) {
        return result.filePaths[0]
      }
      return null
    })

    // Get client stats
    ipcMain.handle('get-stats', () => {
      return {
        downloadSpeed: this.client.downloadSpeed,
        uploadSpeed: this.client.uploadSpeed,
        progress: this.client.progress,
        ratio: this.client.ratio,
      }
    })

    // Set file priority
    ipcMain.handle('set-file-priority', (_, infoHash: string, fileIndex: number, priority: number) => {
      const torrent = this.client.get(infoHash)
      if (torrent && torrent.files[fileIndex]) {
        if (priority === 0) {
          torrent.files[fileIndex].deselect()
        } else {
          torrent.files[fileIndex].select()
        }
        this.sendTorrentUpdate()
        return true
      }
      return false
    })

    // Open file location
    ipcMain.handle('open-file-location', (_, infoHash: string) => {
      const torrent: any = this.client.get(infoHash)
      if (torrent && torrent.name) {
        const fullPath = path.join(this.settings.downloadPath, torrent.name)
        if (fs.existsSync(fullPath)) {
          shell.showItemInFolder(fullPath)
          return true
        } else {
          shell.openPath(this.settings.downloadPath)
          return true
        }
      }
      shell.openPath(this.settings.downloadPath)
      return true
    })

    // Start periodic updates
    setInterval(() => {
      this.sendTorrentUpdate()
    }, 1000)
  }

  private getTorrentInfo(torrent: WebTorrent.Torrent) {
    return {
      infoHash: torrent.infoHash,
      name: torrent.name,
      magnetURI: torrent.magnetURI,
      size: torrent.length,
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      progress: torrent.progress,
      ratio: torrent.ratio,
      numPeers: torrent.numPeers,
      path: torrent.path,
      timeRemaining: torrent.timeRemaining,
      done: torrent.done,
      paused: false,
      files: torrent.files.map((file, index) => ({
        name: file.name,
        size: file.length,
        downloaded: file.downloaded,
        progress: file.progress,
        path: file.path,
      })),
    }
  }

  private sendTorrentUpdate() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      const torrents = this.client.torrents.map(t => this.getTorrentInfo(t))
      this.mainWindow.webContents.send('torrents-update', torrents)

      const stats = {
        downloadSpeed: this.client.downloadSpeed,
        uploadSpeed: this.client.uploadSpeed,
        progress: this.client.progress,
        ratio: this.client.ratio,
      }
      this.mainWindow.webContents.send('stats-update', stats)
    }
  }
}

// App lifecycle
let isQuitting = false
const torrentApp = new TorrentApp()

// Register as default protocol handler for magnet links
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('magnet', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('magnet')
}

// Handle magnet links on macOS
app.on('open-url', (event, url) => {
  event.preventDefault()
  if (url.startsWith('magnet:')) {
    if (torrentApp.mainWindow) {
      torrentApp.mainWindow.webContents.send('add-magnet', url)
    } else {
      // Store for when window is ready
      app.once('browser-window-created', () => {
        setTimeout(() => {
          torrentApp.mainWindow?.webContents.send('add-magnet', url)
        }, 1000)
      })
    }
  }
})

// Handle magnet links on Windows/Linux
if (process.argv.length >= 2 && process.argv[1].startsWith('magnet:')) {
  app.once('browser-window-created', () => {
    setTimeout(() => {
      torrentApp.mainWindow?.webContents.send('add-magnet', process.argv[1])
    }, 1000)
  })
}

app.whenReady().then(() => {
  torrentApp.createWindow()
  torrentApp.createTray()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      torrentApp.createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // Don't quit, just hide to tray
  }
})

app.on('before-quit', () => {
  isQuitting = true
})
