import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home } from 'lucide-react'
import Button from '../common/Button'

function ScoreBoard() {
  const navigate = useNavigate()
  const { gameState, resetGameState, startGame, gameType } = useGame()

  const handlePlayAgain = () => {
    if (gameType) {
      startGame(gameType)
    }
  }

  const handleReturnToHome = () => {
    resetGameState()
    navigate('/')
  }

  const winner = gameState?.winner
  const finalScores = gameState?.finalScores || {}

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl w-full">
        {/* Winner Announcement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-2xl mb-4">
            <Trophy className="w-10 h-10 text-secondary-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold mb-4 text-slate-900">
            Game Over
          </h1>
          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-2xl font-semibold text-slate-900 mb-2">
                {winner.username || winner.email} Wins!
              </p>
              <p className="text-slate-600">
                Congratulations! 🎉
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Final Scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center text-slate-900">
            Final Scores
          </h2>
          <div className="space-y-3">
            {Object.entries(finalScores).map(([playerId, score], index) => (
              <motion.div
                key={playerId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-accent-50 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-semibold text-slate-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-slate-900">
                    Player {index + 1}
                  </span>
                </div>
                <span className="text-xl font-semibold text-primary-600">
                  {score} pts
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button 
            variant="primary" 
            onClick={handlePlayAgain}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReturnToHome}
            className="flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to Home
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default ScoreBoard
