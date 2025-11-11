import { useState, useEffect } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
import Timer from '../common/Timer'
import PlayerCard from '../common/PlayerCard'
import Button from '../common/Button'

function TruthOrDare() {
  const { socket } = useSocket()
  const { user } = useAuth()
  const { roomCode, players, gameState, setGameState } = useGame()
  
  const [spiceLevel, setSpiceLevel] = useState('mild')
  const [showSpiceSelector, setShowSpiceSelector] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [phase, setPhase] = useState('select') // select, question, answer

  useEffect(() => {
    if (!socket) return

    socket.on('turn-started', (data) => {
      setPhase('select')
      setCurrentQuestion(null)
      setAnswer('')
    })

    socket.on('question-presented', (data) => {
      setCurrentQuestion(data)
      setPhase('question')
      setShowSpiceSelector(false)
    })

    socket.on('answer-submitted', (data) => {
      // Update scores
      setPhase('select')
    })

    socket.on('round-ended', (data) => {
      setGameState(data)
      setPhase('select')
      setCurrentQuestion(null)
    })

    return () => {
      socket.off('turn-started')
      socket.off('question-presented')
      socket.off('answer-submitted')
      socket.off('round-ended')
    }
  }, [socket, setGameState])

  const handleSpiceLevelSelect = (level) => {
    setSpiceLevel(level)
    setShowSpiceSelector(false)
  }

  const handleChoiceMade = (choice) => {
    if (socket && roomCode) {
      socket.emit('select-truth-or-dare', { 
        roomCode, 
        choice,
        spiceLevel 
      })
    }
  }

  const handleSubmitAnswer = () => {
    if (socket && roomCode && answer.trim()) {
      socket.emit('submit-answer', { 
        roomCode, 
        answer: answer.trim() 
      })
      setAnswer('')
    }
  }

  const handleSkip = () => {
    if (socket && roomCode) {
      socket.emit('skip-turn', { roomCode })
    }
  }

  const isMyTurn = gameState?.activePlayerId === user?.id

  return (
    <div className="space-y-6">
      {/* Header with scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {players.map((player) => (
          <PlayerCard
            key={player.userId}
            player={player}
            isActive={player.userId === gameState?.activePlayerId}
            showScore={true}
          />
        ))}
      </div>

      {/* Spice Level Selector */}
      {showSpiceSelector && isMyTurn && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Choose Spice Level
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleSpiceLevelSelect('mild')}
              className={`card hover:scale-105 transition-transform cursor-pointer ${
                spiceLevel === 'mild' ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="text-4xl mb-2">😊</div>
              <h3 className="font-bold">Mild</h3>
              <p className="text-sm text-text/70">Keep it light</p>
            </button>
            <button
              onClick={() => handleSpiceLevelSelect('spicy')}
              className={`card hover:scale-105 transition-transform cursor-pointer ${
                spiceLevel === 'spicy' ? 'ring-2 ring-secondary' : ''
              }`}
            >
              <div className="text-4xl mb-2">🌶️</div>
              <h3 className="font-bold">Spicy</h3>
              <p className="text-sm text-text/70">Getting interesting</p>
            </button>
            <button
              onClick={() => handleSpiceLevelSelect('extreme')}
              className={`card hover:scale-105 transition-transform cursor-pointer ${
                spiceLevel === 'extreme' ? 'ring-2 ring-accent' : ''
              }`}
            >
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-bold">Extreme</h3>
              <p className="text-sm text-text/70">No holding back</p>
            </button>
          </div>
        </div>
      )}

      {/* Truth or Dare Selection */}
      {phase === 'select' && !showSpiceSelector && isMyTurn && (
        <div className="card text-center">
          <h2 className="text-3xl font-bold mb-6">Your Turn!</h2>
          <p className="text-text/70 mb-8">Choose Truth or Dare</p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => handleChoiceMade('truth')}
              className="px-12 py-6 text-xl"
            >
              Truth
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleChoiceMade('dare')}
              className="px-12 py-6 text-xl"
            >
              Dare
            </Button>
          </div>
        </div>
      )}

      {/* Question Display */}
      {phase === 'question' && currentQuestion && (
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                currentQuestion.type === 'truth' ? 'bg-primary' : 'bg-secondary'
              }`}>
                {currentQuestion.type.toUpperCase()}
              </span>
              <span className="ml-2 text-sm text-text/70">
                {spiceLevel} • {currentQuestion.points} pts
              </span>
            </div>
            <Timer 
              duration={currentQuestion.timer || 60} 
              onComplete={handleSkip}
              warning={10}
            />
          </div>

          <h2 className="text-2xl font-bold mb-6 text-center">
            {currentQuestion.question}
          </h2>

          {isMyTurn && (
            <div className="space-y-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="input-field min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="flex gap-4">
                <Button
                  variant="primary"
                  onClick={handleSubmitAnswer}
                  disabled={!answer.trim()}
                  className="flex-1"
                >
                  Submit Answer
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSkip}
                >
                  Skip (-1 pt)
                </Button>
              </div>
            </div>
          )}

          {!isMyTurn && (
            <div className="text-center py-8 text-text/70">
              <p>Waiting for player to answer...</p>
              <div className="animate-pulse mt-2">⏳</div>
            </div>
          )}
        </div>
      )}

      {/* Waiting for turn */}
      {!isMyTurn && phase === 'select' && !showSpiceSelector && (
        <div className="card text-center py-12">
          <p className="text-xl text-text/70 mb-4">
            Waiting for other player's turn...
          </p>
          <div className="animate-pulse text-4xl">👀</div>
        </div>
      )}
    </div>
  )
}

export default TruthOrDare
