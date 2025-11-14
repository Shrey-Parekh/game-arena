import { motion, AnimatePresence } from 'framer-motion'
import { useSocket } from '../../../contexts/SocketContext'

const reactionEmojis = ['😱', '😂', '🤭']

function RevealPhase({ gameState, players, countdownValue, revealData, onReaction, onNext }) {
  const { socket } = useSocket()
  const currentUserId = socket?.userId
  const isHost = players?.find(p => p.userId === currentUserId)?.isHost

  // Countdown phase
  if (countdownValue && countdownValue > 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          key={countdownValue}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <div className="text-9xl font-bold text-primary mb-4">
            {countdownValue}
          </div>
          <p className="text-2xl text-slate-600 font-semibold">
            Get ready...
          </p>
        </motion.div>
      </div>
    )
  }

  // Reveal phase
  if (!revealData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-lg text-slate-600">Preparing reveal...</p>
        </div>
      </div>
    )
  }

  const { responses, fingerCounts, fingersLost } = revealData
  const playersArray = Array.from(players || [])

  // Render finger icons
  const renderFingers = (count, lost) => {
    return (
      <div className="flex gap-1 justify-center">
        {[...Array(5)].map((_, i) => {
          const isLost = i >= count && i < count + lost
          return (
            <motion.div
              key={i}
              initial={isLost ? { scale: 1, opacity: 1 } : {}}
              animate={isLost ? { scale: 0, opacity: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-lg
                ${i < count ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}
                ${isLost ? 'bg-red-500' : ''}
              `}
            >
              ✋
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-slate-800">Reveal!</h1>
          <p className="text-sm text-slate-600">See what everyone answered</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Statement Reminder */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <p className="text-xl font-semibold text-slate-800 text-center">
              {gameState?.statement || gameState?.currentStatement?.statement}
            </p>
          </motion.div>

          {/* Player Responses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {playersArray.map((player, index) => {
              const playerResponse = responses[player.userId]
              if (!playerResponse) return null

              const response = playerResponse.response
              const lost = fingersLost[player.userId] || 0
              const newCount = fingerCounts[player.userId] || 5

              return (
                <motion.div
                  key={player.userId}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`
                    bg-white rounded-2xl shadow-xl p-6 border-4
                    ${lost > 0 ? 'border-red-500' : 'border-green-500'}
                  `}
                >
                  {/* Player Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                      ${player.userId === currentUserId ? 'bg-primary' : 'bg-slate-400'}
                    `}>
                      {player.username?.[0]?.toUpperCase() || 'P'}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-lg">
                        {player.username}
                        {player.userId === currentUserId && ' (You)'}
                      </p>
                    </div>
                  </div>

                  {/* Response */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`
                      rounded-xl p-6 mb-4 text-center
                      ${response === 'have' ? 'bg-red-100' : 'bg-green-100'}
                    `}
                  >
                    <div className="text-5xl mb-2">
                      {response === 'have' ? '😳' : '😇'}
                    </div>
                    <p className={`
                      text-2xl font-bold
                      ${response === 'have' ? 'text-red-700' : 'text-green-700'}
                    `}>
                      {response === 'have' ? 'I Have' : 'I Haven\'t'}
                    </p>
                  </motion.div>

                  {/* Finger Count */}
                  <div className="mb-3">
                    {renderFingers(newCount, lost)}
                  </div>

                  {/* Lost Finger Message */}
                  {lost > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-red-50 border border-red-200 rounded-lg p-3 text-center"
                    >
                      <p className="text-red-700 font-semibold">
                        Lost {lost} finger{lost > 1 ? 's' : ''}! 😱
                      </p>
                      <p className="text-sm text-red-600">
                        {newCount} finger{newCount !== 1 ? 's' : ''} remaining
                      </p>
                    </motion.div>
                  )}

                  {lost === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                    >
                      <p className="text-green-700 font-semibold">
                        Safe! 😌
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Reaction Emojis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <p className="text-center text-sm text-slate-600 mb-3">
              React to the reveal!
            </p>
            <div className="flex justify-center gap-4">
              {reactionEmojis.map((emoji) => (
                <motion.button
                  key={emoji}
                  onClick={() => onReaction(emoji)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-3xl transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Next Button (Host Only) */}
          {isHost && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-colors"
            >
              Next Statement →
            </motion.button>
          )}

          {!isHost && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center text-slate-500 text-sm"
            >
              Waiting for host to continue...
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RevealPhase
