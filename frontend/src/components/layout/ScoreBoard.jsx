import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import { motion } from 'framer-motion'
import { Trophy, RotateCcw, Home } from 'lucide-react'
import Button from '../common/Button'
import ParticlesBackground from '../common/ParticlesBackground'
import CustomCursor from '../common/CustomCursor'

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
    <>
      <CustomCursor />
      <ParticlesBackground />
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8 content-wrapper">
        <div className="max-w-3xl w-full">
          {/* Winner Announcement */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6 sm:mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block p-6 sm:p-8 bg-gradient-to-br from-secondary to-accent rounded-3xl mb-4 sm:mb-6"
            >
              <Trophy className="w-16 h-16 sm:w-20 sm:h-20 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 text-gradient-animated">
              Game Over!
            </h1>
            {winner && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-text mb-2">
                  {winner.username || winner.email} Wins!
                </p>
                <p className="text-base sm:text-lg text-textLight">
                  Congratulations! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Final Scores */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="card mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-text">
              Final Scores
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {Object.entries(finalScores).map(([playerId, score], index) => (
                <motion.div
                  key={playerId}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 sm:p-6 bg-background rounded-2xl"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-2xl sm:text-3xl font-bold text-textLight">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-base sm:text-lg text-text">
                      Player {index + 1}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {score} pts
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          >
            <Button 
              variant="primary" 
              onClick={handlePlayAgain}
              className="flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
              Play Again
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReturnToHome}
              className="flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Return to Home
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ScoreBoard
