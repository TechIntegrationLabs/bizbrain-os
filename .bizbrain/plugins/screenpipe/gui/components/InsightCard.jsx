import { Brain, Users, CheckSquare, Wrench, Monitor, Clipboard, FileText, X } from 'lucide-react'

const INSIGHT_ICONS = {
  'entities-detected': Users,
  'decisions-made': CheckSquare,
  'action-items': CheckSquare,
  'tools-used': Wrench,
  'explorer-clipboard': Clipboard,
  'explorer-file': FileText,
  'screenpipe-scan': Monitor,
}

const INSIGHT_COLORS = {
  'entities-detected': 'text-blue-400 bg-blue-500/10',
  'decisions-made': 'text-purple-400 bg-purple-500/10',
  'action-items': 'text-amber-400 bg-amber-500/10',
  'tools-used': 'text-emerald-400 bg-emerald-500/10',
  'explorer-clipboard': 'text-cyan-400 bg-cyan-500/10',
  'explorer-file': 'text-orange-400 bg-orange-500/10',
  'screenpipe-scan': 'text-pink-400 bg-pink-500/10',
}

export default function InsightCard({ insight, onDismiss, onReview }) {
  const Icon = INSIGHT_ICONS[insight.type] || Brain
  const colorClass = INSIGHT_COLORS[insight.type] || 'text-gray-400 bg-gray-500/10'
  const timeAgo = getTimeAgo(insight.createdAt)

  return (
    <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors group">
      <div className={`p-2 rounded-lg ${colorClass} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-200">{insight.summary}</p>
        {insight.details && typeof insight.details === 'object' && !Array.isArray(insight.details) && (
          <div className="mt-1 flex flex-wrap gap-1">
            {insight.details.apps?.map(app => (
              <span key={app} className="text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">{app}</span>
            ))}
          </div>
        )}
        {Array.isArray(insight.details) && insight.details.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {insight.details.slice(0, 3).map((d, i) => (
              <li key={i} className="text-xs text-gray-500 truncate">
                {d.value || d.text || JSON.stringify(d).slice(0, 60)}
              </li>
            ))}
          </ul>
        )}
        <span className="text-xs text-gray-600 mt-1 block">{timeAgo}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {onReview && (
          <button
            onClick={() => onReview(insight)}
            className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition-colors"
          >
            Review
          </button>
        )}
        {onDismiss && (
          <button
            onClick={() => onDismiss(insight)}
            className="p-1 text-gray-500 hover:text-gray-300 rounded hover:bg-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function getTimeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
