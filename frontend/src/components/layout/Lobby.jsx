import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
import RoomCode from '../common/RoomCode'
import PlayerCard from '../common/PlayerCard'
import Button from '../common/Button'

function Lobby({ gameType }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { roomCode, players, isHost, startGame, leaveRoom } = useGame()

  const handleStartGame = () => {
    if (isHost && gameType) {
      startGame(gameType)
    }
  }

  const handleLeaveRoom = () => {
    leaveRoom()
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-8">Game Lobby</h1>
        
        {roomCode && <RoomCode code={roomCode} />}
      </div>

      <div className="card mb-6">
        <h2 className="text-2xl font-bold mb-4">Players in Room</h2>
        <div className="space-y-3">
          {players.length > 0 ? (
            players.map((player) => (
              <PlayerCard 
                key={player.userId} 
                player={player}
              />
            ))
          ) : (
            <div className="text-center py-8 text-text/50">
              <p className="text-lg mb-2">Waiting for players...</p>
              <div className="animate-pulse">👥</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        {isHost ? (
          <Button
            variant="primary"
            onClick={handleStartGame}
            disabled={players.length < 2}
            className="px-12"
          >
            {players.length < 2 ? 'Waiting for players...' : 'Start Game'}
          </Button>
        ) : (
          <div className="text-center py-4">
            <p className="text-text/70">Waiting for host to start the game...</p>
            <div className="animate-pulse mt-2">⏳</div>
          </div>
        )}

        <Button
          variant="outline"
          onClick={handleLeaveRoom}
        >
          Leave Room
        </Button>
      </div>
    </div>
  )
}

export default Lobby
