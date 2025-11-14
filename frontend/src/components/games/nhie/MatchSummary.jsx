import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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

function MatchSummary({ matchEndData, players }) {
  const navigate = useNavigate()
  const { winnerId, winnerName, roundWins, stats, reason } = matchEndData
  const playersArray = Array.from(players || [])

  // Get winner and loser
  const winner = playersArray.find(p => p.userId === winnerId)
  const loser = playersArray.find(p => p.userId !== winnerId)

  const handlePlayAgain = () => {
    navigate('/game-select')
  }

  const handleReturnToLobby = () => {
    navigate('/')
  }

  // If match ended by disconnect
  if (reason === 'Opponent disconnected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Match Ended
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Your opponent disconnected
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <p className="text-2xl font-bold text-primary mb-2">
              {winnerName} Wins!
            </p>
            <p className="text-slate-600">
              Victory by default
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handlePlayAgain}
              className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={handleReturnToLobby}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-800 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors border-2 border-slate-200"
            >
              Return to Lobby
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Winner Celebration */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.2, 1, 1.2, 1]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              repeatDelay: 2
            }}
            className="text-9xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className="text-5xl font-bold text-slate-800 mb-2">
            Match Complete!
          </h1>
          <p className="text-3xl font-bold text-primary mb-4">
            {winnerName} Wins!
          </p>
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-md">
            <span className="text-xl">🎮</span>
            <span className="font-semibold text-slate-800">
              Best of 3 Rounds
            </span>
          </div>
        </motion.div>

        {/* Round Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Round Breakdown
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {playersArray.map((player) => {
              const wins = roundWins[player.userId] || 0
              const isWinner = player.userId === winnerId
              
              return (
                <div
                  key={player.userId}
                  className={`
                    text-center p-6 rounded-xl border-4
                    ${isWinner ? 'border-yellow-400 bg-yellow-50' : 'border-slate-200'}
                  `}
                >
                  <div className={`
                    w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-3xl
                    ${isWinner ? 'bg-yellow-400' : 'bg-slate-400'}
                  `}>
                    {isWinner ? '👑' : player.username?.[0]?.toUpperCase() || 'P'}
                  </div>
                  <p className="font-bold text-slate-800 text-lg mb-3">
                    {player.username}
                  </p>
                  <div className="flex justify-center gap-2 mb-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-xl
                          ${i < wins ? 'bg-yellow-400 text-white' : 'bg-slate-200 text-slate-400'}
                        `}
                      >
                        {i < wins ? '⭐' : '○'}
                      </div>
                    ))}
                  </div>
                  <p className="text-lg font-semibold text-slate-700">
                    {wins} Round{wins !== 1 ? 's' : ''} Won
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Statistics */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              Match Statistics
            </h2>

            {/* Total Statements */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-4xl font-bold text-primary mb-1">
                {stats.totalStatements || 0}
              </p>
              <p className="text-slate-600">
                Total Statements Answered
              </p>
            </div>

            {/* Fingers Lost Comparison */}
            <div className="mb-6">
              <h3 className="font-semibold text-slate-800 mb-3 text-center">
                Fingers Lost
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {playersArray.map((player) => {
                  const fingersLost = stats.fingersLostPerPlayer?.[player.userId] || 0
                  
                  return (
                    <div
                      key={player.userId}
                      className="bg-slate-50 rounded-xl p-4 text-center"
                    >
                      <p className="font-semibold text-slate-800 mb-2">
                        {player.username}
                      </p>
                      <p className="text-3xl font-bold text-red-500 mb-1">
                        {fingersLost}
                      </p>
                      <p className="text-sm text-slate-600">
                        finger{fingersLost !== 1 ? 's' : ''} lost
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            {stats.statementsByCategory && Object.keys(stats.statementsByCategory).length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3 text-center">
                  Categories Played
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(stats.statementsByCategory).map(([category, count]) => (
                    <div
                      key={category}
                      className="bg-slate-50 rounded-xl p-3 text-center"
                    >
                      <div className={`
                        w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-xl
                        ${categoryColors[category]}
                      `}>
                        {categoryIcons[category]}
                      </div>
                      <p className="text-xs uppercase font-semibold text-slate-600 mb-1">
                        {category}
                      </p>
                      <p className="text-lg font-bold text-slate-800">
                        {count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Most Revealing Statements */}
            {stats.mostRevealingStatements && stats.mostRevealingStatements.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 text-center">
                  Most Revealing Statements
                </h3>
                <div className="space-y-3">
                  {stats.mostRevealingStatements.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="bg-slate-50 rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-800 font-medium mb-1">
                          {item.statement}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`
                            ${categoryColors[item.category]} text-white text-xs px-2 py-1 rounded uppercase font-semibold
                          `}>
                            {item.category}
                          </span>
                          <span className="text-sm text-slate-600">
                            {item.fingersLost} finger{item.fingersLost !== 1 ? 's' : ''} lost
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button
            onClick={handlePlayAgain}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-colors"
          >
            🎮 Play Again
          </button>
          <button
            onClick={handleReturnToLobby}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 py-4 rounded-xl font-bold text-lg shadow-lg transition-colors border-2 border-slate-200"
          >
            🏠 Return to Lobby
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default MatchSummary
