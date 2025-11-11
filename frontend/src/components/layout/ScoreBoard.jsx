import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import Button from '../common/Button'
import { motion } from 'framer-motion'

function ScoreBoard() {
  const navigate = useNavigate()
  const { gameState, resetGameState, startGame, gameType } = useGame()

  const handlePlayAgain = () => {
    if (gameType) {
      startGame(gameType)
    }
  }

  const handleReturnToLobby = () => {
    resetGameState()
    navigate('/')
  }

  const winner = gameState?.winner
  const finalScores = gameState?.finalScores || {}

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4 text-gradient">
          Game Over!
        </h1>
        {winner && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-2xl font-bold text-primary">
              {winner.username || winner.email} Wins!
            </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="card mb-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Final Scores</h2>
        <div className="space-y-4">
          {Object.entries(finalScores).map(([playerId, score], index) => (
            <motion.div
              key={playerId}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between p-4 bg-background rounded-lg"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-text/50">
                  #{index + 1}
                </span>
                <span className="font-semibold">
                  Player {index + 1}
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">
                {score} pts
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 justify-center"
      >
        <Button variant="primary" onClick={handlePlayAgain}>
          Play Again
        </Button>
        <Button variant="outline" onClick={handleReturnToLobby}>
          Return to Home
        </Button>
      </motion.div>
    </div>
  )
}

export default ScoreBoard
