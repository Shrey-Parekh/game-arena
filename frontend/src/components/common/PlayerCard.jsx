import { motion } from 'framer-motion'

function PlayerCard({ player, isActive = false, showScore = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isActive ? 'ring-2 ring-primary' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
          isActive ? 'bg-primary' : 'bg-surface'
        }`}>
          {player.username?.[0]?.toUpperCase() || '?'}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{player.username || player.email || 'Player'}</h3>
            {player.isHost && (
              <span className="text-xs bg-accent text-background px-2 py-1 rounded">
                Host
              </span>
            )}
          </div>
          
          {showScore && (
            <p className="text-sm text-text/70">
              Score: {player.score || 0}
            </p>
          )}
        </div>

        <div className={`w-3 h-3 rounded-full ${
          player.isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </div>

      {isActive && (
        <div className="mt-2 text-sm text-primary font-medium">
          ▶ Active Player
        </div>
      )}
    </motion.div>
  )
}

export default PlayerCard
