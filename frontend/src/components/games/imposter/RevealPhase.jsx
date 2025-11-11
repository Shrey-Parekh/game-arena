import { useGame } from '../../../contexts/GameContext'
import { motion } from 'framer-motion'
import { Trophy, TrendingUp, Eye, ArrowRight } from 'lucide-react'

function RevealPhase({ gameState, players }) {
  const { isHost, nextRound } = useGame()
  
  const imposterId = gameState.imposterId
  const imposterName = gameState.imposterName
  const voteDistribution = gameState.voteDistribution || {}
  const roundScores = gameState.roundScores || {}
  const totalScores = gameState.totalScores || {}
  const roundNumber = gameState.roundNumber || 1
  const regularPrompt = gameState.regularPrompt
  const imposterPrompt = gameState.imposterPrompt

  // Calculate total votes
  const totalVotes = Object.values(voteDistribution).reduce((sum, votes) => sum + votes.length, 0)

  // Get player name by ID
  const getPlayerName = (playerId) => {
    const player = players.find(p => p.userId === playerId)
    return player?.username || player?.email || 'Unknown'
  }

  const totalRounds = gameState.totalRounds || 5
  
  const handleNextRound = () => {
    if (isHost && roundNumber < totalRounds) {
      nextRound()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Imposter Reveal */}
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
            🎭
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl sm:text-4xl font-bold text-text mb-3"
          >
            The Imposter Was...
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="inline-block px-8 py-4 bg-accent-600 text-white rounded-2xl text-3xl font-bold"
          >
            {imposterName}
          </motion.div>
        </motion.div>

        {/* Prompts Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-text">The Prompts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface p-4 rounded-xl border-2 border-primary-600">
              <div className="text-xs font-semibold text-primary-600 mb-2">REGULAR PLAYERS</div>
              <p className="text-text">{regularPrompt}</p>
            </div>
            <div className="bg-surface p-4 rounded-xl border-2 border-accent-600">
              <div className="text-xs font-semibold text-accent-600 mb-2">IMPOSTER</div>
              <p className="text-text">{imposterPrompt}</p>
            </div>
          </div>
        </motion.div>

        {/* Vote Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-semibold text-text mb-4">Vote Results</h3>
          
          <div className="space-y-3">
            {Object.entries(voteDistribution).map(([playerId, votes], index) => {
              const percentage = totalVotes > 0 ? (votes.length / totalVotes) * 100 : 0
              const isImposter = playerId === imposterId
              
              return (
                <motion.div
                  key={playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className={`p-3 rounded-xl ${isImposter ? 'bg-accent-100' : 'bg-surface'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isImposter ? 'text-accent-600' : 'text-text'}`}>
                      {getPlayerName(playerId)}
                      {isImposter && ' 🎭'}
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      {votes.length} {votes.length === 1 ? 'vote' : 'votes'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                      className={`h-2 rounded-full ${isImposter ? 'bg-accent-600' : 'bg-primary-600'}`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Round Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-secondary-600" />
            <h3 className="text-lg font-semibold text-text">Round {roundNumber} Scores</h3>
          </div>
          
          <div className="space-y-2">
            {Object.entries(roundScores).map(([playerId, score], index) => (
              <motion.div
                key={playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 + index * 0.05 }}
                className="flex items-center justify-between p-3 bg-surface rounded-xl"
              >
                <span className="text-text font-medium">
                  {getPlayerName(playerId)}
                </span>
                <span className="text-primary-600 font-bold text-lg">
                  +{score} pts
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Total Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-secondary-600" />
            <h3 className="text-lg font-semibold text-text">Total Scores</h3>
          </div>
          
          <div className="space-y-2">
            {Object.entries(totalScores)
              .sort(([, a], [, b]) => b - a)
              .map(([playerId, score], index) => (
                <motion.div
                  key={playerId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 + index * 0.05 }}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    index === 0 ? 'bg-primary-600 text-white' : 'bg-surface text-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold opacity-50">#{index + 1}</span>
                    <span className="font-semibold">{getPlayerName(playerId)}</span>
                  </div>
                  <span className="text-2xl font-bold">{score}</span>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Next Round Button */}
        {isHost && roundNumber < totalRounds && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            onClick={handleNextRound}
            className="btn-primary w-full flex items-center justify-center gap-2 text-lg py-4"
          >
            Next Round
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}

        {!isHost && roundNumber < totalRounds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="text-center text-slate-400"
          >
            Waiting for host to start next round...
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RevealPhase
