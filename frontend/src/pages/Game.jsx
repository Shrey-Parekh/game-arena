import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import Lobby from '../components/layout/Lobby'
import GameRoom from '../components/layout/GameRoom'
import ScoreBoard from '../components/layout/ScoreBoard'

function Game() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { gameStatus, roomCode } = useGame()
  const gameType = location.state?.gameType

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (!roomCode && gameStatus === 'idle') {
      // No room code, redirect to home
      navigate('/')
    }
  }, [roomCode, gameStatus, navigate])

  return (
    <div className="min-h-screen p-4">
      {gameStatus === 'lobby' && <Lobby gameType={gameType} />}
      {gameStatus === 'playing' && <GameRoom />}
      {gameStatus === 'finished' && <ScoreBoard />}
    </div>
  )
}

export default Game
