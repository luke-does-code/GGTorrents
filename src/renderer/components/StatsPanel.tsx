import { Stats, Torrent } from '../types'
import { formatBytes, formatSpeed } from '../utils'
import { Download, Upload, HardDrive, Activity, TrendingUp } from 'lucide-react'

interface StatsPanelProps {
  stats: Stats
  torrents: Torrent[]
}

export default function StatsPanel({ stats, torrents }: StatsPanelProps) {
  const totalSize = torrents.reduce((sum, t) => sum + t.size, 0)
  const totalDownloaded = torrents.reduce((sum, t) => sum + t.downloaded, 0)
  const totalUploaded = torrents.reduce((sum, t) => sum + t.uploaded, 0)
  const activeTorrents = torrents.filter(t => !t.paused && !t.done).length
  const completedTorrents = torrents.filter(t => t.done).length

  return (
    <div className="p-6 overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Statistics</h2>
          <p className="text-slate-400">Overview of your torrenting activity</p>
        </div>

        {/* Speed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Download className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Download Speed</p>
              <p className="text-3xl font-bold text-green-400">{formatSpeed(stats.downloadSpeed)}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400/50" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Upload Speed</p>
              <p className="text-3xl font-bold text-blue-400">{formatSpeed(stats.uploadSpeed)}</p>
            </div>
          </div>
        </div>

        {/* Torrent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm text-slate-400">Active Torrents</p>
            </div>
            <p className="text-2xl font-bold">{activeTorrents}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Download className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-slate-400">Completed</p>
            </div>
            <p className="text-2xl font-bold">{completedTorrents}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <HardDrive className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm text-slate-400">Total Torrents</p>
            </div>
            <p className="text-2xl font-bold">{torrents.length}</p>
          </div>
        </div>

        {/* Transfer Stats */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Transfer Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Size</p>
              <p className="text-xl font-semibold">{formatBytes(totalSize)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Downloaded</p>
              <p className="text-xl font-semibold text-green-400">{formatBytes(totalDownloaded)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Uploaded</p>
              <p className="text-xl font-semibold text-blue-400">{formatBytes(totalUploaded)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Overall Ratio</p>
              <p className="text-xl font-semibold text-purple-400">
                {totalDownloaded > 0 ? (totalUploaded / totalDownloaded).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Session Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Global Progress:</span>
              <span className="font-medium">{((stats.progress || 0) * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Global Ratio:</span>
              <span className="font-medium">{(stats.ratio || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
