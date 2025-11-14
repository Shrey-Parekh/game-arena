import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const motivationalMessages = [
  "Get ready for the next round!",
  "Time to step up your game!",
  "Let's see who's more honest!",
  "The truth will set you free... or cost you fingers!",
  "Ready for more revelations?"
]

function RoundBreak({ roundEndData, players }) {
  const [timeRemaining, setTimeRemaining] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const { winnerId, winnerName, roundWins, currentRound } = roundEndData
  const playersArray = Array.from(players || [])

  // Get winner and loser
  const winner = playersArray.find(p => p.userId === winnerId)
  const loser = playersArray.find(p => p.userId !== winnerId)

  // Random motivational message
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-purple-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        {/* Round Winner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Round {currentRound} Winner!
          </h1>
          <p className="text-3xl font-bold text-primary">
            {winnerName}
          </p>
        </motion.div>

        {/* Match Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-xl font-semibold text-slate-800 text-center mb-6">
            Match Score
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            {playersArray.map((player) => {
              const wins = roundWins[player.userId] || 0
              const isWinner = player.userId === winnerId
              
              return (
                <div
                  key={player.userId}
                  className={`
                    text-center p-6 rounded-xl border-2
                    ${isWinner ? 'border-primary bg-primary/5' : 'border-slate-200'}
                  `}
                >
                  <div className={`
                    w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl
                    ${isWinner ? 'bg-primary' : 'bg-slate-400'}
                  `}>
                    {player.username?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <p className="font-semibold text-slate-800 mb-2">
                    {player.username}
                  </p>
                  <div className="flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-lg
                          ${i < wins ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'}
                        `}
                      >
                        {i < wins ? '⭐' : '○'}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    {wins} {wins === 1 ? 'win' : 'wins'}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6"
        >
          <p className="text-center text-slate-600 mb-3">
            {message}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-1">
                {timeRemaining}
              </div>
              <p className="text-sm text-slate-600">
                seconds until next round
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Round Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
            <span className="text-2xl">🔄</span>
            <span className="font-semibold text-slate-800">
              Starting Round {currentRound + 1}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-3">
            Fingers reset to 5 for both players
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RoundBreak
