import { motion } from 'framer-motion'

function PlayerCard({ player, isActive = false, showScore = false }) {
  const getPlayerEmoji = (username) => {
    const emojis = ['😎', '🤠', '🥳', '🤓', '😺', '🦊', '🐼', '🦄']
    const index = username?.charCodeAt(0) % emojis.length || 0
    return emojis[index]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isActive ? 'border-primary border-4 shadow-fun-lg' : ''}`}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${
          isActive ? 'bg-primary/20 border-4 border-primary animate-bounce-slow' : 'bg-surface border-4 border-border'
        }`}>
          {getPlayerEmoji(player.username || player.email)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg text-text">
              {player.username || player.email?.split('@')[0] || 'Player'}
            </h3>
            {player.isHost && (
              <span className="badge-secondary text-xs">
                👑 Host
              </span>
            )}
          </div>
          
          {showScore && (
            <p className="text-sm text-textLight font-semibold mt-1">
              ⭐ Score: <span className="text-primary text-lg">{player.score || 0}</span>
            </p>
          )}
        </div>

        {/* Connection Status */}
        <div className={`w-4 h-4 rounded-full ${
          player.isConnected ? 'bg-success animate-pulse' : 'bg-textLight'
        }`} />
      </div>

      {isActive && (
        <div className="mt-3 text-center">
          <span className="badge-primary">
            ▶ Your Turn!
          </span>
        </div>
      )}
    </motion.div>
  )
}

export default PlayerCard
