import { Torrent } from '../types'
import { formatBytes, formatSpeed, formatProgress } from '../utils'
import { X, File, CheckCircle, Circle } from 'lucide-react'

interface TorrentDetailsProps {
  torrent: Torrent
  onClose: () => void
}

export default function TorrentDetails({ torrent, onClose }: TorrentDetailsProps) {
  const handleToggleFile = async (fileIndex: number, currentPriority: number) => {
    const newPriority = currentPriority === 0 ? 1 : 0
    await window.electronAPI.setFilePriority(torrent.infoHash, fileIndex, newPriority)
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/30">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
        <h2 className="font-semibold truncate">{torrent.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* General Info */}
        <section>
          <h3 className="text-sm font-semibold text-blue-400 mb-3">General</h3>
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Size:</span>
              <span className="font-medium">{formatBytes(torrent.size)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Downloaded:</span>
              <span className="font-medium">{formatBytes(torrent.downloaded)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Uploaded:</span>
              <span className="font-medium">{formatBytes(torrent.uploaded)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ratio:</span>
              <span className="font-medium">{torrent.ratio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Peers:</span>
              <span className="font-medium">{torrent.numPeers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Download Speed:</span>
              <span className="font-medium text-green-400">{formatSpeed(torrent.downloadSpeed)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Upload Speed:</span>
              <span className="font-medium text-blue-400">{formatSpeed(torrent.uploadSpeed)}</span>
            </div>
          </div>
        </section>

        {/* Files */}
        <section>
          <h3 className="text-sm font-semibold text-purple-400 mb-3">
            Files ({torrent.files.length})
          </h3>
          <div className="space-y-1">
            {torrent.files.map((file, index) => {
              const isSelected = file.progress > 0 || !torrent.done
              return (
                <div
                  key={index}
                  className="bg-slate-800/50 hover:bg-slate-800/70 rounded-lg p-3 transition-colors cursor-pointer"
                  onClick={() => handleToggleFile(index, isSelected ? 1 : 0)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isSelected ? (
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <File className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {formatBytes(file.size)}
                        </span>
                      </div>
                      {isSelected && file.progress < 1 && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">{formatProgress(file.progress)}</span>
                            <span className="text-slate-500">{formatBytes(file.downloaded)} / {formatBytes(file.size)}</span>
                          </div>
                          <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                              style={{ width: `${file.progress * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Magnet Link */}
        <section>
          <h3 className="text-sm font-semibold text-green-400 mb-3">Magnet Link</h3>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <input
              type="text"
              value={torrent.magnetURI}
              readOnly
              className="w-full bg-transparent text-xs text-slate-400 focus:outline-none select-all"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Click to select and copy</p>
        </section>
      </div>
    </div>
  )
}
