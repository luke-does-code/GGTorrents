import { useState } from 'react'
import { X, Folder, HardDrive, Network, Zap } from 'lucide-react'
import { Settings } from '../types'

interface SettingsDialogProps {
  settings: Settings
  onSave: (settings: Partial<Settings>) => void
  onClose: () => void
}

export default function SettingsDialog({ settings, onSave, onClose }: SettingsDialogProps) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleSelectDirectory = async () => {
    const dir = await window.electronAPI.selectDirectory()
    if (dir) {
      setFormData({ ...formData, downloadPath: dir })
    }
  }

  const handleChange = (field: keyof Settings, value: any) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-slide-in">
      <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 w-full max-w-3xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Downloads */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <HardDrive className="w-5 h-5" />
              <h3 className="font-semibold">Downloads</h3>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Download Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.downloadPath}
                  readOnly
                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleSelectDirectory}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Folder className="w-4 h-4" />
                  Browse
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                id="autoStart"
                checked={formData.autoStart}
                onChange={(e) => handleChange('autoStart', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900"
              />
              <label htmlFor="autoStart" className="text-sm">
                Start torrents automatically when added
              </label>
            </div>
          </section>

          {/* Bandwidth */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-purple-400 mb-4">
              <Zap className="w-5 h-5" />
              <h3 className="font-semibold">Bandwidth</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Download Limit (KB/s)
                </label>
                <input
                  type="number"
                  value={formData.downloadLimit === -1 ? '' : formData.downloadLimit}
                  onChange={(e) =>
                    handleChange('downloadLimit', e.target.value ? parseInt(e.target.value) : -1)
                  }
                  placeholder="Unlimited"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-xs text-slate-500 mt-1">Leave empty for unlimited</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Limit (KB/s)
                </label>
                <input
                  type="number"
                  value={formData.uploadLimit === -1 ? '' : formData.uploadLimit}
                  onChange={(e) =>
                    handleChange('uploadLimit', e.target.value ? parseInt(e.target.value) : -1)
                  }
                  placeholder="Unlimited"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-xs text-slate-500 mt-1">Leave empty for unlimited</p>
              </div>
            </div>
          </section>

          {/* Connection */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-green-400 mb-4">
              <Network className="w-5 h-5" />
              <h3 className="font-semibold">Connection</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Listening Port</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => handleChange('port', parseInt(e.target.value))}
                  min="1024"
                  max="65535"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Connections</label>
                <input
                  type="number"
                  value={formData.maxConnections}
                  onChange={(e) => handleChange('maxConnections', parseInt(e.target.value))}
                  min="1"
                  max="200"
                  className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="enableDHT"
                  checked={formData.enableDHT}
                  onChange={(e) => handleChange('enableDHT', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900"
                />
                <label htmlFor="enableDHT" className="text-sm">
                  Enable DHT (Distributed Hash Table)
                </label>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id="enablePEX"
                  checked={formData.enablePEX}
                  onChange={(e) => handleChange('enablePEX', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900"
                />
                <label htmlFor="enablePEX" className="text-sm">
                  Enable PEX (Peer Exchange)
                </label>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
