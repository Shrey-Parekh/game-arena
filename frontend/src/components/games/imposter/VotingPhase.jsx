import { useState, useEffect } from 'react'
import { useGame } from '../../../contexts/GameContext'
import { useAuth } from '../../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Clock, Vote, CheckCircle, Users } from 'lucide-react'

function VotingPhase({ gameState, players, timeRemaining }) {
  const { user } = useAuth()
  const { submitVote } = useGame()
  const [selectedVote, setSelectedVote] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const answers = gameState.answers || []
  const votedCount = gameState.votedCount || 0
  const totalPlayers = gameState.totalPlayers || players.length
  const votingPlayers = gameState.players || players

  useEffect(() => {
    // Auto-submit no vote when timer expires (handled by server)
    if (timeRemaining === 0 && !hasVoted) {
      // Server will handle this
    }
  }, [timeRemaining, hasVoted])

  const handleVote = (playerId) => {
    if (hasVoted || playerId === user.id) return
    
    setSelectedVote(playerId)
  }

  const handleConfirmVote = () => {
    if (!selectedVote || hasVoted) return
    
    submitVote(selectedVote)
    setHasVoted(true)
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-secondary-600" />
            <div className={`text-5xl font-bold ${
              timeRemaining <= 10 ? 'text-error animate-pulse' : 'text-secondary-600'
            }`}>
              {timeRemaining}s
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-text mb-2">
            Who is the Imposter?
          </h2>
          <p className="text-slate-400">Read the answers and vote for the most suspicious one</p>
        </motion.div>

        {/* Answers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Player Answers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {answers.map((answer, index) => (
              <motion.div
                key={answer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-600 rounded-lg text-sm font-semibold">
                    {answer.playerName || 'Unknown'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Answer {index + 1}
                  </div>
                </div>
                <p className="text-text leading-relaxed min-h-[4rem]">
                  {answer.text || <span className="text-slate-500 italic">No answer submitted</span>}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Voting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Cast Your Vote</h3>
            {hasVoted && (
              <span className="flex items-center gap-1 text-success text-sm">
                <CheckCircle className="w-4 h-4" />
                Vote Submitted
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {votingPlayers.map((player) => {
              const isMe = player.userId === user.id
              const isSelected = selectedVote === player.userId
              
              return (
                <motion.button
                  key={player.userId}
                  whileHover={!isMe && !hasVoted ? { scale: 1.02 } : {}}
                  whileTap={!isMe && !hasVoted ? { scale: 0.98 } : {}}
                  onClick={() => handleVote(player.userId)}
                  disabled={isMe || hasVoted}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : isMe
                      ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'
                      : hasVoted
                      ? 'bg-surface border-border text-slate-400 cursor-not-allowed'
                      : 'bg-surface border-border text-text hover:border-primary-600'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      isSelected ? 'bg-white text-primary-600' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {(player.username || player.email)?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium truncate w-full text-center">
                      {player.username || player.email}
                    </span>
                    {isMe && (
                      <span className="text-xs">(You)</span>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </div>

          {!hasVoted && selectedVote && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleConfirmVote}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Vote
            </motion.button>
          )}

          {!hasVoted && !selectedVote && (
            <p className="text-center text-slate-400 text-sm">
              Select a player to vote for them as the imposter
            </p>
          )}

          {/* Voting Status */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Votes Cast
              </span>
              <span className="text-primary-600 font-semibold">
                {votedCount}/{totalPlayers}
              </span>
            </div>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPlayers }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full ${
                    index < votedCount ? 'bg-success' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VotingPhase
