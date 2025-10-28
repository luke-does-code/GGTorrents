import { Torrent } from '../types'
import { formatBytes, formatSpeed, formatProgress, formatTime } from '../utils'
import {
  Download,
  Upload,
  Pause,
  Play,
  Trash2,
  FolderOpen,
  CheckCircle,
  Users,
} from 'lucide-react'

interface TorrentListProps {
  torrents: Torrent[]
  selectedTorrent: Torrent | null
  onSelectTorrent: (torrent: Torrent) => void
}

export default function TorrentList({ torrents, selectedTorrent, onSelectTorrent }: TorrentListProps) {
  const handlePause = async (e: React.MouseEvent, torrent: Torrent) => {
    e.stopPropagation()
    await window.electronAPI.pauseTorrent(torrent.infoHash)
  }

  const handleResume = async (e: React.MouseEvent, torrent: Torrent) => {
    e.stopPropagation()
    await window.electronAPI.resumeTorrent(torrent.infoHash)
  }

  const handleRemove = async (e: React.MouseEvent, torrent: Torrent) => {
    e.stopPropagation()
    const deleteFiles = confirm(`Remove "${torrent.name}"?\n\nDelete files from disk?`)
    if (deleteFiles !== null) {
      await window.electronAPI.removeTorrent(torrent.infoHash, deleteFiles)
    }
  }

  const handleOpenLocation = async (e: React.MouseEvent, torrent: Torrent) => {
    e.stopPropagation()
    await window.electronAPI.openFileLocation(torrent.infoHash)
  }

  if (torrents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Download className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-400 mb-2">No torrents yet</h3>
          <p className="text-slate-500">Click "Add Torrent" to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-2">
      {torrents.map((torrent) => (
        <div
          key={torrent.infoHash}
          onClick={() => onSelectTorrent(torrent)}
          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-lg animate-slide-in ${
            selectedTorrent?.infoHash === torrent.infoHash
              ? 'bg-blue-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20'
              : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {torrent.done ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : torrent.paused ? (
                  <Pause className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                ) : (
                  <Download className="w-5 h-5 text-blue-400 flex-shrink-0" />
                )}
                <h3 className="font-medium truncate">{torrent.name}</h3>
              </div>
              <p className="text-xs text-slate-400">
                {formatBytes(torrent.size)} • {torrent.files.length} file{torrent.files.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-1 ml-4">
              {torrent.paused ? (
                <button
                  onClick={(e) => handleResume(e, torrent)}
                  className="p-2 hover:bg-green-500/20 text-green-400 rounded transition-colors"
                  title="Resume"
                >
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={(e) => handlePause(e, torrent)}
                  className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded transition-colors"
                  title="Pause"
                >
                  <Pause className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => handleOpenLocation(e, torrent)}
                className="p-2 hover:bg-blue-500/20 text-blue-400 rounded transition-colors"
                title="Open folder"
              >
                <FolderOpen className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleRemove(e, torrent)}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="text-slate-400">{formatProgress(torrent.progress)}</span>
              {!torrent.done && !torrent.paused && (
                <span className="text-slate-500">ETA: {formatTime(torrent.timeRemaining / 1000)}</span>
              )}
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  torrent.done
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${torrent.progress * 100}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-green-400">
              <Download className="w-3.5 h-3.5" />
              <span>{formatSpeed(torrent.downloadSpeed)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-400">
              <Upload className="w-3.5 h-3.5" />
              <span>{formatSpeed(torrent.uploadSpeed)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-purple-400">
              <Users className="w-3.5 h-3.5" />
              <span>{torrent.numPeers} peers</span>
            </div>
            <div className="ml-auto text-slate-400">
              Ratio: {torrent.ratio.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
