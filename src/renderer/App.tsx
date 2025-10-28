import { useState, useEffect } from 'react'
import {
  Download,
  Upload,
  Settings as SettingsIcon,
  Plus,
  FileText,
  Activity,
} from 'lucide-react'
import { Torrent, Settings, Stats } from './types'
import { formatSpeed } from './utils'
import TorrentList from './components/TorrentList'
import AddTorrentDialog from './components/AddTorrentDialog'
import SettingsDialog from './components/SettingsDialog'
import TorrentDetails from './components/TorrentDetails'
import StatsPanel from './components/StatsPanel'

function App() {
  const [torrents, setTorrents] = useState<Torrent[]>([])
  const [stats, setStats] = useState<Stats>({
    downloadSpeed: 0,
    uploadSpeed: 0,
    progress: 0,
    ratio: 0,
  })
  const [settings, setSettings] = useState<Settings | null>(null)
  const [selectedTorrent, setSelectedTorrent] = useState<Torrent | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'torrents' | 'stats'>('torrents')

  useEffect(() => {
    // Load initial data
    window.electronAPI.getTorrents().then(setTorrents)
    window.electronAPI.getSettings().then(setSettings)
    window.electronAPI.getStats().then(setStats)

    // Setup listeners
    window.electronAPI.onTorrentsUpdate((updatedTorrents) => {
      setTorrents(updatedTorrents)
      // Update selected torrent if it's in the list
      if (selectedTorrent) {
        const updated = updatedTorrents.find(t => t.infoHash === selectedTorrent.infoHash)
        if (updated) {
          setSelectedTorrent(updated)
        } else {
          setSelectedTorrent(null)
        }
      }
    })

    window.electronAPI.onStatsUpdate(setStats)
  }, [selectedTorrent])

  const handleAddTorrent = async (magnetOrFile: string) => {
    try {
      if (magnetOrFile === 'file') {
        await window.electronAPI.addTorrentFile()
      } else {
        await window.electronAPI.addTorrent(magnetOrFile)
      }
      setShowAddDialog(false)
    } catch (error) {
      console.error('Error adding torrent:', error)
      alert('Failed to add torrent')
    }
  }

  const handleUpdateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = await window.electronAPI.updateSettings(newSettings)
      setSettings(updated)
      setShowSettings(false)
    } catch (error) {
      console.error('Error updating settings:', error)
      alert('Failed to update settings')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              GGTorrents
            </h1>
            <p className="text-xs text-slate-400">High-performance BitTorrent client</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-green-400">
                {formatSpeed(stats.downloadSpeed)}
              </span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">
                {formatSpeed(stats.uploadSpeed)}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Torrent</span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-700/50 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('torrents')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'torrents'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Torrents</span>
              <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded">
                {torrents.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'hover:bg-slate-800/50 text-slate-400'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Statistics</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'torrents' ? (
            <div className="flex flex-1 overflow-hidden">
              <div className={`${selectedTorrent ? 'w-1/2' : 'w-full'} overflow-auto`}>
                <TorrentList
                  torrents={torrents}
                  selectedTorrent={selectedTorrent}
                  onSelectTorrent={setSelectedTorrent}
                />
              </div>
              {selectedTorrent && (
                <div className="w-1/2 border-l border-slate-700/50 overflow-auto">
                  <TorrentDetails
                    torrent={selectedTorrent}
                    onClose={() => setSelectedTorrent(null)}
                  />
                </div>
              )}
            </div>
          ) : (
            <StatsPanel stats={stats} torrents={torrents} />
          )}
        </div>
      </div>

      {/* Dialogs */}
      {showAddDialog && (
        <AddTorrentDialog
          onAdd={handleAddTorrent}
          onClose={() => setShowAddDialog(false)}
        />
      )}

      {showSettings && settings && (
        <SettingsDialog
          settings={settings}
          onSave={handleUpdateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
