import { motion } from 'framer-motion'
import { useSocket } from '../../../contexts/SocketContext'

const categoryColors = {
  pg: 'bg-green-500',
  funny: 'bg-yellow-500',
  deep: 'bg-purple-500',
  adult: 'bg-red-500'
}

const categoryIcons = {
  pg: '😊',
  funny: '😂',
  deep: '🤔',
  adult: '🔞'
}

function ResponsePhase({ gameState, players, timeRemaining, onResponse, hasResponded, localResponse }) {
  const { socket } = useSocket()
  const currentUserId = socket?.userId

  // Get finger counts
  const fingerCounts = gameState?.fingerCounts || {}
  
  // Get player info
  const playersArray = Array.from(players || [])
  const currentPlayer = playersArray.find(p => p.userId === currentUserId)
  const otherPlayer = playersArray.find(p => p.userId !== currentUserId)

  const statement = gameState?.statement || gameState?.currentStatement?.statement || 'Loading...'
  const category = gameState?.category || gameState?.currentStatement?.category || 'pg'
  const currentRound = gameState?.currentRound || 1

  // Calculate progress percentage
  const progressPercentage = (timeRemaining / 20) * 100

  // Render finger icons
  const renderFingers = (count) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`
              w-8 h-8 rounded-full flex items-center justify-center text-lg
              ${i < count ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400'}
            `}
          >
            ✋
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🤫</div>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Never Have I Ever</h1>
              <p className="text-sm text-slate-600">Round {currentRound} of 3</p>
            </div>
          </div>
          
          {/* Timer */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-slate-600">Time Remaining</p>
              <p className={`text-2xl font-bold ${timeRemaining <= 5 ? 'text-red-500' : 'text-slate-800'}`}>
                {timeRemaining}s
              </p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-slate-200"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progressPercentage / 100)}`}
                  className={timeRemaining <= 5 ? 'text-red-500' : 'text-primary'}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full">
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <div className={`
              ${categoryColors[category]} text-white px-6 py-2 rounded-full
              flex items-center gap-2 font-semibold shadow-lg
            `}>
              <span className="text-xl">{categoryIcons[category]}</span>
              <span className="uppercase text-sm">{category}</span>
            </div>
          </motion.div>

          {/* Statement */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8"
          >
            <p className="text-3xl font-bold text-slate-800 text-center leading-relaxed">
              {statement}
            </p>
          </motion.div>

          {/* Response Buttons */}
          {!hasResponded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <motion.button
                onClick={() => onResponse('have')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-red-500 hover:bg-red-600 text-white py-6 rounded-xl font-bold text-xl shadow-lg transition-colors"
              >
                <div className="text-3xl mb-2">😳</div>
                I Have
              </motion.button>
              
              <motion.button
                onClick={() => onResponse('havent')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-xl font-bold text-xl shadow-lg transition-colors"
              >
                <div className="text-3xl mb-2">😇</div>
                I Haven't
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-8"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-lg font-semibold text-slate-800 mb-1">
                  Response Submitted
                </p>
                <p className="text-sm text-slate-600">
                  You answered: <span className="font-bold">
                    {localResponse === 'have' ? 'I Have 😳' : 'I Haven\'t 😇'}
                  </span>
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Waiting for other player...
                </p>
              </div>
            </motion.div>
          )}

          {/* Player Finger Counts */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Player */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {currentPlayer?.username?.[0]?.toUpperCase() || 'Y'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {currentPlayer?.username || 'You'}
                  </p>
                  <p className="text-xs text-slate-500">You</p>
                </div>
              </div>
              {renderFingers(fingerCounts[currentUserId] || 5)}
            </div>

            {/* Other Player */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold">
                  {otherPlayer?.username?.[0]?.toUpperCase() || 'O'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    {otherPlayer?.username || 'Opponent'}
                  </p>
                  <p className="text-xs text-slate-500">Opponent</p>
                </div>
              </div>
              {renderFingers(fingerCounts[otherPlayer?.userId] || 5)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResponsePhase
