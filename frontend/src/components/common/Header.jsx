import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'

function Header() {
  const { user, signOut } = useAuth()
  const { connected, reconnecting } = useSocket()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-surface border-b border-surface/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gradient">Nexus Arena</h1>
          {user && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                reconnecting ? 'bg-yellow-500 animate-pulse' :
                connected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-sm text-text/70">
                {reconnecting ? 'Reconnecting...' : connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-text/70">{user.email}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-text/50 hover:text-text transition-colors"
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
