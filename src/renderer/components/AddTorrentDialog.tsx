import { useState } from 'react'
import { X, Link, FileUp } from 'lucide-react'

interface AddTorrentDialogProps {
  onAdd: (magnetOrFile: string) => void
  onClose: () => void
}

export default function AddTorrentDialog({ onAdd, onClose }: AddTorrentDialogProps) {
  const [magnetLink, setMagnetLink] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (magnetLink.trim()) {
      onAdd(magnetLink.trim())
      setMagnetLink('')
    }
  }

  const handleFileSelect = () => {
    onAdd('file')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-slide-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-2xl mx-4">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold">Add Torrent</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Magnet Link */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <div className="flex items-center gap-2 mb-2">
                <Link className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Magnet Link or Torrent URL</span>
              </div>
              <input
                type="text"
                value={magnetLink}
                onChange={(e) => setMagnetLink(e.target.value)}
                placeholder="magnet:?xt=urn:btih:..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </label>
            <button
              type="submit"
              disabled={!magnetLink.trim()}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              Add from Magnet Link
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800 text-slate-400">OR</span>
            </div>
          </div>

          {/* File Upload */}
          <button
            onClick={handleFileSelect}
            className="w-full px-4 py-4 bg-slate-900/50 border-2 border-dashed border-slate-700 hover:border-blue-500/50 hover:bg-slate-900/70 rounded-lg transition-all group"
          >
            <div className="flex flex-col items-center gap-2">
              <FileUp className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
              <div>
                <p className="font-medium group-hover:text-blue-400 transition-colors">
                  Choose Torrent File
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click to browse for .torrent files
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
