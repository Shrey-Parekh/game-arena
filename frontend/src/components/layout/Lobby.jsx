import { useNavigate } from 'react-router-dom'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Users, Play, DoorOpen, Crown, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'
import toast, { Toaster } from 'react-hot-toast'

function Lobby({ gameType }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { roomCode, players, isHost, startGame, leaveRoom } = useGame()
  const [copied, setCopied] = useState(false)

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

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    toast.success('Room code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '12px 16px',
          },
        }}
      />
      
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-100 rounded-lg">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Game Lobby</h1>
              <p className="text-xs text-slate-400">Waiting for players...</p>
            </div>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="px-4 py-2 hover:bg-accent-50 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-600"
          >
            <DoorOpen className="w-4 h-4" />
            Leave
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Room Code */}
        {roomCode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6 text-center"
          >
            <p className="text-sm font-medium text-slate-600 mb-4">Room Code</p>
            <div className="flex items-center justify-center gap-3">
              <div className="font-mono text-4xl font-semibold tracking-wider text-primary-600">
                {roomCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="p-3 hover:bg-accent-50 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-success" />
                ) : (
                  <Copy className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-4">Share this code with your friends!</p>
          </motion.div>
        )}

        {/* Players List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players
            </h2>
            <span className="badge-primary">
              {players.length} {players.length === 1 ? 'Player' : 'Players'}
            </span>
          </div>
          
          <div className="space-y-3">
            {players.length > 0 ? (
              players.map((player) => (
                <motion.div 
                  key={player.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-accent-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">
                      {player.username?.[0]?.toUpperCase() || player.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {player.username || player.email}
                      </p>
                      {player.isHost && (
                        <span className="text-xs text-secondary-600 flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Host
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    player.isConnected ? 'bg-success' : 'bg-accent-300'
                  }`} />
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-accent-300 mb-4" />
                <p className="text-slate-600 mb-2">Waiting for players...</p>
                <p className="text-sm text-slate-400">Share the room code with your friends!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          {isHost ? (
            <Button
              variant="primary"
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="px-12 py-4 text-lg flex items-center gap-2"
            >
              {players.length < 2 ? (
                <>
                  <Users className="w-5 h-5" />
                  Waiting for players...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Game
                </>
              )}
            </Button>
          ) : (
            <div className="card text-center py-8 px-12">
              <Crown className="w-12 h-12 mx-auto text-secondary-600 mb-3" />
              <p className="text-lg text-slate-600 font-medium">
                Waiting for host to start the game...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Lobby
