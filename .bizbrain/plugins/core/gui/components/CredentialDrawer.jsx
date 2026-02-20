import { useState } from 'react'
import { X, ExternalLink, Eye, EyeOff, Save, CheckCircle } from 'lucide-react'

export default function CredentialDrawer({ integration, onClose, onSave }) {
  const [credentials, setCredentials] = useState({})
  const [visibleFields, setVisibleFields] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const envVars = integration.envVars || []
  const guide = integration.credentialGuide || {}

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(credentials)
      setSaved(true)
      setTimeout(() => onClose(), 1500)
    } catch {
      setSaving(false)
    }
  }

  const toggleVisibility = (key) => {
    setVisibleFields(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const allFilled = envVars.every(v => !v.secret || credentials[v.key]?.trim())

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border-l border-gray-700 shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold"
              style={{ backgroundColor: (integration.logoColor || '#6366F1') + '15', color: integration.logoColor || '#6366F1' }}
            >
              {integration.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-semibold">{integration.name}</h2>
              <p className="text-xs text-gray-400">{integration.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <p className="text-sm text-gray-300">{integration.description}</p>

          {integration.what_it_enables && integration.what_it_enables.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2 text-gray-300">What it enables</h3>
              <ul className="space-y-1">
                {integration.what_it_enables.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guide.steps && guide.steps.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
              <h3 className="text-sm font-medium mb-2">Setup Steps</h3>
              <ol className="space-y-2">
                {guide.steps.map((step, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-gray-500 shrink-0">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
              {guide.url && (
                <a
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-blue-400 hover:text-blue-300"
                >
                  Open setup page <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {envVars.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Credentials</h3>
              <div className="space-y-3">
                {envVars.map(envVar => (
                  <div key={envVar.key}>
                    <label className="block text-xs text-gray-400 mb-1">{envVar.label}</label>
                    <div className="relative">
                      <input
                        type={envVar.secret && !visibleFields[envVar.key] ? 'password' : 'text'}
                        value={credentials[envVar.key] || ''}
                        onChange={e => setCredentials(prev => ({ ...prev, [envVar.key]: e.target.value }))}
                        placeholder={envVar.key}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 pr-10"
                      />
                      {envVar.secret && (
                        <button
                          onClick={() => toggleVisibility(envVar.key)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300"
                        >
                          {visibleFields[envVar.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || saved || !allFilled}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {saved ? (
              <><CheckCircle className="w-4 h-4" /> Saved</>
            ) : saving ? (
              'Saving...'
            ) : (
              <><Save className="w-4 h-4" /> Save Credentials</>
            )}
          </button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Or paste your credentials in Claude Code — it will set them up conversationally.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
