import { ExternalLink, Settings, TestTube, Plug } from 'lucide-react'

const STATUS_COLORS = {
  connected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  disconnected: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
}

const LOGO_COLORS = {
  github: '#181717', gmail: '#EA4335', slack: '#4A154B', discord: '#5865F2',
  notion: '#000000', supabase: '#3FCF8E', stripe: '#635BFF', clerk: '#6C47FF',
  openai: '#412991', anthropic: '#D97757', elevenlabs: '#000000',
  'x-twitter': '#000000', linkedin: '#0A66C2', facebook: '#1877F2',
  instagram: '#E4405F', youtube: '#FF0000', bluesky: '#0085FF',
  netlify: '#00C7B7', vercel: '#000000', firecrawl: '#FF6B35',
  postiz: '#FF6B35', resend: '#000000', whatsapp: '#25D366',
  telegram: '#26A5E4', reddit: '#FF4500',
}

function getStatus(integration) {
  if (integration.connected) return 'connected'
  if (integration.pendingSince) return 'pending'
  return 'disconnected'
}

function getStatusLabel(status) {
  return { connected: 'Connected', pending: 'Pending', disconnected: 'Disconnected' }[status]
}

export default function IntegrationCard({ integration, viewMode, onToggle, onTest, onConfigure }) {
  const status = getStatus(integration)
  const logoColor = integration.logoColor || LOGO_COLORS[integration.id] || '#6366F1'

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: logoColor + '20', color: logoColor }}
        >
          {integration.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{integration.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="text-xs text-gray-400 truncate">{integration.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {integration.connected && (
            <button onClick={onTest} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
              <TestTube className="w-4 h-4" />
            </button>
          )}
          <button onClick={onConfigure} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              integration.connected ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              integration.connected ? 'left-[22px]' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4 hover:border-gray-600/50 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
          style={{ backgroundColor: logoColor + '15', color: logoColor }}
        >
          {integration.name.charAt(0)}
        </div>
        <button
          onClick={onToggle}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            integration.connected ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            integration.connected ? 'left-[22px]' : 'left-0.5'
          }`} />
        </button>
      </div>

      <h3 className="font-semibold text-sm mb-1">{integration.name}</h3>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{integration.description}</p>

      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
          {getStatusLabel(status)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {integration.connected && (
            <button onClick={onTest} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" title="Test connection">
              <TestTube className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={onConfigure} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white" title="Configure">
            <Settings className="w-3.5 h-3.5" />
          </button>
          {integration.credentialGuide?.url && (
            <a
              href={integration.credentialGuide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
              title="Setup guide"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
