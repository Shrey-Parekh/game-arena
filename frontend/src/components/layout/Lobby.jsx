import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Users, Play, DoorOpen, Crown } from 'lucide-react'
import RoomCode from '../common/RoomCode'
import PlayerCard from '../common/PlayerCard'
import Button from '../common/Button'

function Lobby({ gameType }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { roomCode, players, isHost, startGame, leaveRoom } = useGame()

  const handleStartGame = () => {
    console.log('Start Game clicked', { isHost, gameType, roomCode })
    if (isHost && gameType) {
      console.log('Emitting start-game event')
      startGame(gameType)
    }
  }

  const handleLeaveRoom = () => {
    leaveRoom()
    navigate('/')
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4"
          >
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-text">Game Lobby</h1>
          <p className="text-sm sm:text-base lg:text-lg text-textLight font-semibold">
            Waiting for everyone to join...
          </p>
        </motion.div>
        
        {/* Room Code */}
        {roomCode && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <RoomCode code={roomCode} />
          </motion.div>
        )}

        {/* Players List */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="card mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-text flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-8 sm:h-8" />
              Players
            </h2>
            <span className="badge-primary text-sm sm:text-base">
              {players.length} {players.length === 1 ? 'Player' : 'Players'}
            </span>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {players.length > 0 ? (
              players.map((player, index) => (
                <motion.div key={player.userId} variants={item}>
                  <PlayerCard player={player} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl sm:text-6xl mb-4"
                >
                  <Users className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-textLight" />
                </motion.div>
                <p className="text-lg sm:text-xl text-textLight mb-2 font-semibold">
                  Waiting for players...
                </p>
                <p className="text-sm text-textLight">
                  Share the room code with your friends!
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3 sm:gap-4 justify-center flex-wrap"
        >
          {isHost ? (
            <Button
              variant="primary"
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="px-8 sm:px-12 text-base sm:text-xl flex items-center gap-2"
            >
              {players.length < 2 ? (
                <>
                  <Users className="w-5 h-5" />
                  Waiting for players...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Game!
                </>
              )}
            </Button>
          ) : (
            <div className="card text-center py-4 sm:py-6 px-6 sm:px-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-3"
              >
                <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
              </motion.div>
              <p className="text-base sm:text-xl text-textLight font-semibold">
                Waiting for host to start the game...
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleLeaveRoom}
            className="px-6 sm:px-8 flex items-center gap-2 text-sm sm:text-base"
          >
            <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            Leave Room
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

export default Lobby
