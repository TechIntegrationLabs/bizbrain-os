import { useState, useRef } from 'react'
import { Upload, Download, TestTube, Check, X } from 'lucide-react'

export default function IntegrationsSpreadsheet({ integrations, onImport, onToggle, onTest }) {
  const [importMode, setImportMode] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    await onImport(text)
    setImportMode(false)
  }

  const getStatusBadge = (integration) => {
    if (integration.connected) {
      return <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><Check className="w-3 h-3" /> Connected</span>
    }
    if (integration.pendingSince) {
      return <span className="text-xs text-amber-400">Pending</span>
    }
    return <span className="text-xs text-gray-500">Disconnected</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Spreadsheet view — {integrations.length} integrations
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/20 text-sm transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            hidden
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-800/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Integration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Required Keys</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Guide</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {integrations.map(integration => (
              <tr key={integration.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: (integration.logoColor || '#6366F1') + '15', color: integration.logoColor || '#6366F1' }}
                    >
                      {integration.name.charAt(0)}
                    </div>
                    <span className="font-medium">{integration.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-400 capitalize">{integration.category}</span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(integration)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(integration.envVars || []).map(v => (
                      <code key={v.key} className="text-xs px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
                        {v.key}
                      </code>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {integration.credentialGuide?.url && (
                    <a
                      href={integration.credentialGuide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300 truncate block max-w-[200px]"
                    >
                      {new URL(integration.credentialGuide.url).hostname}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {integration.connected && (
                      <button
                        onClick={() => onTest(integration.id)}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                        title="Test connection"
                      >
                        <TestTube className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onToggle(integration.id, integration.connected)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        integration.connected ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        integration.connected ? 'left-[18px]' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
