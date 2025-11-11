import { motion } from 'framer-motion'
import { Crown } from 'lucide-react'

function PlayerCard({ player, isActive = false, showScore = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isActive ? 'border-primary-500 border-2 shadow-md' : ''}`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg ${
          isActive ? 'bg-primary-100 text-primary-600 border-2 border-primary-500' : 'bg-accent-100 text-accent-600'
        }`}>
          {player.username?.[0]?.toUpperCase() || player.email?.[0]?.toUpperCase()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-slate-900">
              {player.username || player.email?.split('@')[0] || 'Player'}
            </h3>
            {player.isHost && (
              <span className="badge-secondary text-xs flex items-center gap-1">
                <Crown className="w-3 h-3" />
                Host
              </span>
            )}
          </div>
          
          {showScore && (
            <p className="text-sm text-slate-600 font-medium mt-1">
              Score: <span className="text-primary-600 font-semibold">{player.score || 0}</span>
            </p>
          )}
        </div>

        {/* Connection Status */}
        <div className={`w-2 h-2 rounded-full ${
          player.isConnected ? 'bg-success' : 'bg-accent-300'
        }`} />
      </div>

      {isActive && (
        <div className="mt-3 text-center">
          <span className="badge-primary text-xs">
            Your Turn
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default PlayerCard
