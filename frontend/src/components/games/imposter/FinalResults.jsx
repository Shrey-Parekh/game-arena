import { useNavigate } from 'react-router-dom'
import { useGame } from '../../../contexts/GameContext'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home, Crown, Target } from 'lucide-react'

function FinalResults({ gameState }) {
  const navigate = useNavigate()
  const { resetGameState } = useGame()
  
  const rankedPlayers = gameState.rankedPlayers || []
  const winners = gameState.winners || [rankedPlayers[0]]
  const roundHistory = gameState.roundHistory || []
  const isTie = winners.length > 1

  const handlePlayAgain = () => {
    // Reset game state and return to lobby
    resetGameState()
    navigate('/')
  }

  const handleReturnToLobby = () => {
    resetGameState()
    navigate('/')
  }

  // Calculate stats for each player
  const getPlayerStats = (player) => {
    const correctVotes = roundHistory.filter(round => {
      // Check if this player voted correctly (voted for the imposter)
      return round.scores[player.userId] === 100
    }).length

    return {
      correctVotes,
      timesAsImposter: player.roundsAsImposter || 0
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Winner Celebration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-4"
          >
            🏆
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-text mb-3"
          >
            Game Over!
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary-600 text-white rounded-2xl"
          >
            <Crown className="w-8 h-8" />
            <div className="text-left">
              <div className="text-sm opacity-90">{isTie ? 'Winners (Tie!)' : 'Winner'}</div>
              <div className="text-3xl font-bold">
                {isTie ? winners.map(w => w.username).join(' & ') : winners[0]?.username}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Final Scoreboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-6 h-6 text-secondary-600" />
            <h3 className="text-xl font-semibold text-text">Final Standings</h3>
          </div>
          
          <div className="space-y-3">
            {rankedPlayers.map((player, index) => {
              const stats = getPlayerStats(player)
              const isWinner = index === 0
              
              return (
                <motion.div
                  key={player.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`p-5 rounded-xl ${
                    isWinner
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white border-2 border-primary-400'
                      : 'bg-surface border-2 border-border'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className={`text-3xl font-bold ${
                        isWinner ? 'text-white' : 'text-slate-400'
                      }`}>
                        #{index + 1}
                      </div>
                      <div>
                        <div className={`text-lg font-semibold ${
                          isWinner ? 'text-white' : 'text-text'
                        }`}>
                          {player.username}
                        </div>
                        <div className={`text-sm ${
                          isWinner ? 'text-white opacity-90' : 'text-slate-400'
                        }`}>
                          {stats.correctVotes} correct votes • {stats.timesAsImposter} times as imposter
                        </div>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold ${
                      isWinner ? 'text-white' : 'text-primary-600'
                    }`}>
                      {player.totalScore}
                    </div>
                  </div>
                  
                  {/* Score breakdown */}
                  <div className="flex gap-4 text-sm">
                    <div className={`flex items-center gap-1 ${
                      isWinner ? 'text-white opacity-90' : 'text-slate-400'
                    }`}>
                      <Target className="w-4 h-4" />
                      <span>{stats.correctVotes * 100} pts from correct votes</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      isWinner ? 'text-white opacity-90' : 'text-slate-400'
                    }`}>
                      <span>🎭</span>
                      <span>{player.totalScore - (stats.correctVotes * 100)} pts as imposter</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Game Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Game Summary</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-3xl font-bold text-primary-600">5</div>
              <div className="text-sm text-slate-400 mt-1">Rounds Played</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-3xl font-bold text-secondary-600">{rankedPlayers.length}</div>
              <div className="text-sm text-slate-400 mt-1">Players</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-3xl font-bold text-accent-600">{winners[0]?.totalScore || 0}</div>
              <div className="text-sm text-slate-400 mt-1">Winning Score</div>
            </div>
            <div className="text-center p-4 bg-surface rounded-xl">
              <div className="text-3xl font-bold text-success">
                {Math.round((rankedPlayers.reduce((sum, p) => sum + getPlayerStats(p).correctVotes, 0) / (rankedPlayers.length * 5)) * 100)}%
              </div>
              <div className="text-sm text-slate-400 mt-1">Accuracy</div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handlePlayAgain}
            className="btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={handleReturnToLobby}
            className="btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </motion.div>

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="text-center mt-8 text-slate-400 text-sm"
        >
          <p>🎭 The best imposters are the ones who blend in perfectly!</p>
        </motion.div>
      </div>
    </div>
  )
}

export default FinalResults
