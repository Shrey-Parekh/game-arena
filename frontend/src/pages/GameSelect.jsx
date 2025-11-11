import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { useEffect, useState } from 'react'
import { Sparkles, Palette, Brain, Dices, ArrowLeft, Lock } from 'lucide-react'
import { motion } from 'framer-motion'

function GameSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { createRoom, roomCode, gameStatus } = useGame()
  const mode = location.state?.mode || '2-player'
  const [selectedGame, setSelectedGame] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    if (selectedGame && roomCode && gameStatus === 'lobby') {
      navigate('/game', { state: { gameType: selectedGame } })
    }
  }, [roomCode, gameStatus, selectedGame, navigate])

  const handleGameSelect = (gameType) => {
    setSelectedGame(gameType)
    createRoom(mode)
  }

  const twoPlayerGames = [
    {
      id: 'truth-or-dare',
      name: 'Truth or Dare',
      icon: Sparkles,
      description: 'Classic party game with customizable spice levels',
      color: 'bg-primary-100 text-primary-600',
      available: true,
      players: '2'
    },
    {
      id: 'would-you-rather',
      name: 'Would You Rather',
      icon: Brain,
      description: 'Debate impossible dilemmas and tough choices',
      color: 'bg-secondary-100 text-secondary-600',
      available: false,
      players: '2'
    },
    {
      id: 'never-have-i-ever',
      name: 'Never Have I Ever',
      icon: Dices,
      description: 'Discover secrets and shared experiences',
      color: 'bg-accent-100 text-accent-600',
      available: false,
      players: '2'
    },
    {
      id: '20-questions',
      name: '20 Questions',
      icon: Brain,
      description: 'Guess what your friend is thinking',
      color: 'bg-primary-100 text-primary-600',
      available: false,
      players: '2'
    }
  ]

  const multiplayerGames = [
    {
      id: 'imposter',
      name: 'Imposter Game',
      icon: Sparkles,
      description: 'Find the imposter among your friends',
      color: 'bg-primary-100 text-primary-600',
      available: false,
      players: '3-6'
    },
    {
      id: 'pictionary',
      name: 'Pictionary',
      icon: Palette,
      description: 'Draw and guess in real-time',
      color: 'bg-secondary-100 text-secondary-600',
      available: false,
      players: '2-6'
    },
    {
      id: 'trivia',
      name: 'Trivia',
      icon: Brain,
      description: 'Test your knowledge with betting',
      color: 'bg-accent-100 text-accent-600',
      available: false,
      players: '2-6'
    }
  ]

  const games = mode === '2-player' ? twoPlayerGames : multiplayerGames

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/mode-select')}
            disabled={selectedGame !== null}
            className="p-2 hover:bg-accent-50 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Choose Game</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Dices className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3 text-slate-900">Choose a Game</h2>
          <p className="text-slate-600">
            {mode === '2-player' ? '2 Player Games' : 'Multiplayer Games (2-6 players)'}
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => {
            const Icon = game.icon
            const isCreating = selectedGame === game.id
            
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => game.available && !isCreating && handleGameSelect(game.id)}
                  disabled={!game.available || isCreating}
                  className={`card-hover w-full h-full text-left p-6 ${
                    !game.available ? 'opacity-60 cursor-not-allowed' : ''
                  } ${isCreating ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${game.color} rounded-xl`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {!game.available && (
                      <div className="p-1.5 bg-accent-100 text-accent-600 rounded-lg">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold mb-2 text-slate-900">{game.name}</h3>
                  <p className="text-slate-600 mb-4 min-h-[3rem] text-sm">{game.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="badge-accent text-xs">
                      {game.players} Players
                    </span>
                    {!game.available && (
                      <span className="text-xs text-slate-400 font-medium">
                        Coming Soon
                      </span>
                    )}
                    {isCreating && (
                      <span className="text-xs text-primary-600 font-medium">
                        Creating...
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GameSelect
