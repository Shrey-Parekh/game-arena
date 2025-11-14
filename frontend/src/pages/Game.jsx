import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import Lobby from '../components/layout/Lobby'
import GameRoom from '../components/layout/GameRoom'
import ScoreBoard from '../components/layout/ScoreBoard'

function Game() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { gameStatus, roomCode } = useGame()
  const [gameType, setGameType] = useState(location.state?.gameType || 'truth-or-dare')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    // Set default game type if joining a room
    if (location.state?.gameType) {
      setGameType(location.state.gameType)
    }

    // Give time for room creation/joining
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, navigate, location.state])

  // If no room code and not in a game, redirect to home
  useEffect(() => {
    if (!isLoading && !roomCode && gameStatus === 'idle') {
      const redirectTimer = setTimeout(() => {
        navigate('/')
      }, 2000)
      return () => clearTimeout(redirectTimer)
    }
  }, [isLoading, roomCode, gameStatus, navigate])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Loader2 className="w-12 h-12 text-primary-500" />
          </motion.div>
          <p className="text-lg font-medium text-slate-900">Loading game...</p>
        </motion.div>
      </div>
    )
  }

  // No room code - show error
  if (!roomCode && gameStatus === 'idle') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card max-w-md w-full text-center"
        >
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">No Room Found</h2>
          <p className="text-slate-600 mb-6">
            You need to create or join a room first.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Go to Home
          </button>
        </motion.div>
      </div>
    )
  }

  console.log('Game.jsx render:', { gameStatus, roomCode, gameType })

  return (
    <div className="min-h-screen bg-background">
      {(gameStatus === 'lobby' || (gameStatus === 'idle' && roomCode)) && (
        <Lobby gameType={gameType} />
      )}
      {gameStatus === 'playing' && <GameRoom />}
      {gameStatus === 'finished' && <ScoreBoard />}
      {!gameStatus && (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600">No game status</p>
        </div>
      )}
    </div>
  )
}

export default Game
