import { useState, useEffect, useCallback } from 'react'
import { Search, Grid3X3, List, Download, Upload, Plug, RefreshCw } from 'lucide-react'
import IntegrationCard from '../components/IntegrationCard'
import CredentialDrawer from '../components/CredentialDrawer'
import IntegrationsSpreadsheet from '../components/IntegrationsSpreadsheet'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'communication', label: 'Communication' },
  { id: 'social', label: 'Social' },
  { id: 'development', label: 'Development' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'ai', label: 'AI' },
  { id: 'publishing', label: 'Publishing' },
  { id: 'crm', label: 'CRM' },
  { id: 'research', label: 'Research' },
  { id: 'email', label: 'Email' },
]

export default function Integrations() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedIntegration, setSelectedIntegration] = useState(null)
  const [showSpreadsheet, setShowSpreadsheet] = useState(false)

  const fetchIntegrations = useCallback(async () => {
    try {
      const resp = await fetch(`${API}/api/integrations`)
      const data = await resp.json()
      setIntegrations(data.integrations || [])
    } catch (err) {
      console.error('Failed to fetch integrations:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchIntegrations() }, [fetchIntegrations])

  const handleToggle = async (id, currentlyConnected) => {
    try {
      const endpoint = currentlyConnected ? 'disable' : 'enable'
      await fetch(`${API}/api/integrations/${endpoint}/${id}`, { method: 'POST' })

      if (!currentlyConnected) {
        const integration = integrations.find(i => i.id === id)
        setSelectedIntegration(integration)
      }

      fetchIntegrations()
    } catch (err) {
      console.error('Failed to toggle integration:', err)
    }
  }

  const handleTest = async (id) => {
    try {
      await fetch(`${API}/api/integrations/test/${id}`, { method: 'POST' })
      fetchIntegrations()
    } catch (err) {
      console.error('Failed to test integration:', err)
    }
  }

  const handleExportCSV = async () => {
    try {
      const resp = await fetch(`${API}/api/integrations/export`)
      const csv = await resp.text()
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bizbrain-integrations.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to export CSV:', err)
    }
  }

  const handleImportCSV = async (csvContent) => {
    try {
      await fetch(`${API}/api/integrations/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvContent }),
      })
      fetchIntegrations()
    } catch (err) {
      console.error('Failed to import CSV:', err)
    }
  }

  const filtered = integrations.filter(i => {
    const matchesSearch = !search ||
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || i.category === category
    return matchesSearch && matchesCategory
  })

  const connectedCount = integrations.filter(i => i.connected).length
  const pendingCount = integrations.filter(i => i.pendingSince && !i.connected).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-gray-400 mt-1">
            {connectedCount} connected, {pendingCount} pending setup
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSpreadsheet(!showSpreadsheet)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
          >
            <List className="w-4 h-4" />
            {showSpreadsheet ? 'Card View' : 'Spreadsheet'}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {showSpreadsheet ? (
        <IntegrationsSpreadsheet
          integrations={filtered}
          onImport={handleImportCSV}
          onToggle={handleToggle}
          onTest={handleTest}
        />
      ) : (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search integrations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-2'
          }>
            {filtered.map(integration => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                viewMode={viewMode}
                onToggle={() => handleToggle(integration.id, integration.connected)}
                onTest={() => handleTest(integration.id)}
                onConfigure={() => setSelectedIntegration(integration)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Plug className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No integrations match your search.</p>
            </div>
          )}
        </>
      )}

      {selectedIntegration && (
        <CredentialDrawer
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onSave={async (credentials) => {
            try {
              await fetch(`${API}/api/integrations/save-credentials/${selectedIntegration.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credentials }),
              })
              setSelectedIntegration(null)
              fetchIntegrations()
            } catch (err) {
              console.error('Failed to save credentials:', err)
            }
          }}
        />
      )}
    </div>
  )
}
