import { useState, useEffect } from 'react'
import { useGame } from '../../../contexts/GameContext'
import { useAuth } from '../../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Clock, Users, Send, CheckCircle } from 'lucide-react'

function AnswerPhase({ gameState, players, timeRemaining }) {
  const { user } = useAuth()
  const { submitAnswer } = useGame()
  const [myAnswer, setMyAnswer] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const MAX_CHARS = 500

  const submittedCount = gameState.submittedCount || 0
  const totalPlayers = gameState.totalPlayers || players.length

  useEffect(() => {
    // Auto-submit blank answer when timer expires
    if (timeRemaining === 0 && !hasSubmitted) {
      handleSubmit()
    }
  }, [timeRemaining, hasSubmitted])

  const handleAnswerChange = (e) => {
    const text = e.target.value
    if (text.length <= MAX_CHARS) {
      setMyAnswer(text)
      setCharCount(text.length)
    }
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    
    submitAnswer(myAnswer.trim())
    setHasSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-600 rounded-full mb-4">
            <span className="font-semibold">Round {gameState.roundNumber}/5</span>
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-primary-600" />
            <div className={`text-5xl font-bold ${
              timeRemaining <= 10 ? 'text-error animate-pulse' : 'text-primary-600'
            }`}>
              {timeRemaining}s
            </div>
          </div>
          
          <p className="text-slate-400 text-sm">Time to answer the prompt</p>
        </motion.div>

        {/* Prompt Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          {gameState.isImposter && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-100 text-secondary-600 rounded-lg mb-4 text-sm font-semibold"
            >
              🎭 You are the Imposter!
            </motion.div>
          )}
          
          <div className="bg-surface p-6 rounded-xl">
            <p className="text-xl sm:text-2xl text-center text-slate-100 leading-relaxed">
              {gameState.prompt}
            </p>
          </div>
        </motion.div>

        {/* Answer Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Your Answer</h3>
          
          <textarea
            className="input-field w-full h-32 resize-none mb-2"
            placeholder="Type your answer here..."
            value={myAnswer}
            onChange={handleAnswerChange}
            disabled={hasSubmitted}
          />
          
          <div className="flex items-center justify-between text-sm">
            <span className={`${charCount > MAX_CHARS * 0.9 ? 'text-warning' : 'text-slate-400'}`}>
              {charCount}/{MAX_CHARS} characters
            </span>
            {hasSubmitted && (
              <span className="flex items-center gap-1 text-success">
                <CheckCircle className="w-4 h-4" />
                Submitted
              </span>
            )}
          </div>

          {!hasSubmitted && (
            <button
              onClick={handleSubmit}
              disabled={hasSubmitted}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Answer
            </button>
          )}
        </motion.div>

        {/* Player Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players Ready
            </h3>
            <span className="text-primary-600 font-semibold">
              {submittedCount}/{totalPlayers}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {players.map((player, index) => (
              <motion.div
                key={player.userId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className={`w-3 h-3 rounded-full ${
                  index < submittedCount ? 'bg-success' : 'bg-slate-600'
                }`}
                title={player.username || player.email}
              />
            ))}
          </div>

          {submittedCount < totalPlayers && (
            <p className="text-sm text-slate-400 mt-4">
              Waiting for {totalPlayers - submittedCount} more {totalPlayers - submittedCount === 1 ? 'player' : 'players'}...
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default AnswerPhase
