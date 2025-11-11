import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'

function Header() {
  const { user, signOut } = useAuth()
  const { connected, reconnecting } = useSocket()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-surface border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-900">Nexus Arena</h1>
          {user && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                reconnecting ? 'bg-yellow-500 animate-pulse' :
                connected ? 'bg-success' : 'bg-red-500'
              }`} />
              <span className="text-xs text-slate-400">
                {reconnecting ? 'Reconnecting...' : connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
