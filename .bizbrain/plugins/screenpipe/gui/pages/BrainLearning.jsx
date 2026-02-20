import { useState, useEffect, useCallback } from 'react'
import { Brain, Eye, Telescope, Monitor, RefreshCw, Trash2, Settings } from 'lucide-react'
import InsightCard from '../components/InsightCard'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const TIERS = [
  {
    id: 'observer',
    label: 'Observer',
    icon: Eye,
    description: 'Learns from Claude Code sessions only',
    color: 'text-emerald-400',
  },
  {
    id: 'explorer',
    label: 'Explorer',
    icon: Telescope,
    description: '+ clipboard & file changes',
    color: 'text-blue-400',
  },
  {
    id: 'full',
    label: 'Full Context',
    icon: Monitor,
    description: '+ entire screen via Screenpipe',
    color: 'text-purple-400',
  },
]

export default function BrainLearning() {
  const [insights, setInsights] = useState([])
  const [stats, setStats] = useState({})
  const [currentTier, setCurrentTier] = useState('observer')
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [insightsRes, statsRes] = await Promise.all([
        fetch(`${API}/api/learning/insights`).then(r => r.json()).catch(() => ({ insights: [] })),
        fetch(`${API}/api/learning/stats`).then(r => r.json()).catch(() => ({})),
      ])
      setInsights(insightsRes.insights || [])
      setStats(statsRes)
      setCurrentTier(statsRes.tier || 'observer')
    } catch {
      // API may not exist yet — that's fine
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDismiss = async (insight) => {
    setInsights(prev => prev.filter(i => i !== insight))
    try {
      await fetch(`${API}/api/learning/dismiss`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdAt: insight.createdAt }),
      })
    } catch {}
  }

  const handleDismissAll = async () => {
    setInsights([])
    try {
      await fetch(`${API}/api/learning/dismiss-all`, { method: 'POST' })
    } catch {}
  }

  const handleTierChange = async (tierId) => {
    setCurrentTier(tierId)
    try {
      await fetch(`${API}/api/learning/set-tier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierId }),
      })
    } catch {}
  }

  const pendingInsights = insights.filter(i => !i.dismissedAt)
  const currentTierInfo = TIERS.find(t => t.id === currentTier) || TIERS[0]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-xl">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Brain Learning</h1>
            <p className="text-sm text-gray-400">
              Your brain noticed {pendingInsights.length} thing{pendingInsights.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {pendingInsights.length > 0 && (
            <button
              onClick={handleDismissAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Dismiss All
            </button>
          )}
        </div>
      </div>

      {/* Privacy Tier Selector */}
      <div className="grid grid-cols-3 gap-3">
        {TIERS.map(tier => {
          const TierIcon = tier.icon
          const isActive = currentTier === tier.id
          return (
            <button
              key={tier.id}
              onClick={() => handleTierChange(tier.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-gray-800/80 border-blue-500/50 ring-1 ring-blue-500/30'
                  : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <TierIcon className={`w-5 h-5 ${isActive ? tier.color : 'text-gray-500'}`} />
                <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  {tier.label}
                </span>
              </div>
              <p className="text-xs text-gray-500">{tier.description}</p>
            </button>
          )
        })}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Observations', value: stats.totalObservations || 0 },
          { label: 'Entities Found', value: stats.entitiesFound || 0 },
          { label: 'Decisions Logged', value: stats.decisionsLogged || 0 },
          { label: 'Action Items', value: stats.actionItems || 0 },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Insights */}
      {pendingInsights.length > 0 ? (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-gray-400">Your Brain noticed:</h2>
          {pendingInsights.map((insight, i) => (
            <InsightCard
              key={insight.createdAt || i}
              insight={insight}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No new observations. Your brain is quietly learning.</p>
          <p className="text-xs text-gray-600 mt-1">Insights will appear after your next Claude Code session.</p>
        </div>
      )}
    </div>
  )
}
