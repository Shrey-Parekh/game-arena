import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { motion, AnimatePresence } from 'framer-motion'
import AnswerPhase from './imposter/AnswerPhase'
import VotingPhase from './imposter/VotingPhase'
import RevealPhase from './imposter/RevealPhase'
import FinalResults from './imposter/FinalResults'

function ImposterGameRoom() {
  const { gameState, players } = useGame()
  const [timeRemaining, setTimeRemaining] = useState(90)

  // Calculate time remaining based on phase
  useEffect(() => {
    if (!gameState || !gameState.phaseStartTime) return

    const phaseDuration = gameState.phase === 'answer' ? (gameState.answerTime || 90) : gameState.phase === 'voting' ? 90 : 0
    
    if (phaseDuration === 0) return // No timer for reveal/final phases
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.phaseStartTime) / 1000)
      const remaining = Math.max(0, phaseDuration - elapsed)
      setTimeRemaining(remaining)

      // Auto-submit when timer expires
      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState?.phaseStartTime, gameState?.phase])

  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-lg text-slate-600">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {gameState.phase === 'answer' && (
          <motion.div
            key="answer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AnswerPhase 
              gameState={gameState}
              players={players}
              timeRemaining={timeRemaining}
            />
          </motion.div>
        )}

        {gameState.phase === 'voting' && (
          <motion.div
            key="voting"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VotingPhase 
              gameState={gameState}
              players={players}
              timeRemaining={timeRemaining}
            />
          </motion.div>
        )}

        {gameState.phase === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <RevealPhase 
              gameState={gameState}
              players={players}
            />
          </motion.div>
        )}

        {gameState.phase === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <FinalResults 
              gameState={gameState}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImposterGameRoom
