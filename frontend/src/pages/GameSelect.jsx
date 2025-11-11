import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { useEffect, useState } from 'react'
import { Sparkles, Palette, Brain, Dices, ArrowLeft, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import ParticlesBackground from '../components/common/ParticlesBackground'
import CustomCursor from '../components/common/CustomCursor'

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

  // Wait for room to be created, then navigate
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
      color: 'from-pink-500 to-rose-500',
      available: true,
      players: '2'
    },
    {
      id: 'would-you-rather',
      name: 'Would You Rather',
      icon: Brain,
      description: 'Debate impossible dilemmas and tough choices',
      color: 'from-purple-500 to-indigo-500',
      available: false,
      players: '2'
    },
    {
      id: 'never-have-i-ever',
      name: 'Never Have I Ever',
      icon: Dices,
      description: 'Discover secrets and shared experiences',
      color: 'from-blue-500 to-cyan-500',
      available: false,
      players: '2'
    },
    {
      id: '20-questions',
      name: '20 Questions',
      icon: Brain,
      description: 'Guess what your friend is thinking',
      color: 'from-green-500 to-emerald-500',
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
      color: 'from-red-500 to-orange-500',
      available: false,
      players: '3-6'
    },
    {
      id: 'pictionary',
      name: 'Pictionary',
      icon: Palette,
      description: 'Draw and guess in real-time',
      color: 'from-yellow-500 to-amber-500',
      available: false,
      players: '2-6'
    },
    {
      id: 'trivia',
      name: 'Trivia',
      icon: Brain,
      description: 'Test your knowledge with betting',
      color: 'from-teal-500 to-cyan-500',
      available: false,
      players: '2-6'
    }
  ]

  const games = mode === '2-player' ? twoPlayerGames : multiplayerGames

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
    <>
      <CustomCursor />
      <ParticlesBackground />
      <div className="min-h-screen bg-pattern p-4 sm:p-6 lg:p-8 content-wrapper">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4 sm:mb-6 animate-float">
              <Dices className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-text">Choose a Game</h1>
            <p className="text-base sm:text-lg lg:text-xl text-textLight font-semibold">
              {mode === '2-player' ? '2 Player Games' : 'Multiplayer Games (2-6 players)'}
            </p>
          </motion.div>

          {/* Games Grid */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
          >
            {games.map((game) => {
              const Icon = game.icon
              const isCreating = selectedGame === game.id
              
              return (
                <motion.div
                  key={game.id}
                  variants={item}
                  whileHover={{ scale: game.available ? 1.02 : 1 }}
                  whileTap={{ scale: game.available ? 0.98 : 1 }}
                >
                  <div
                    onClick={() => game.available && !isCreating && handleGameSelect(game.id)}
                    className={`card-hover group ${!game.available ? 'opacity-60 cursor-not-allowed' : ''} ${isCreating ? 'opacity-50' : ''}`}
                  >
                    {/* Game Icon */}
                    <div className="relative mb-4 sm:mb-6">
                      <div className={`inline-block p-4 sm:p-6 bg-gradient-to-br ${game.color} rounded-3xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-white" strokeWidth={2.5} />
                      </div>
                      {!game.available && (
                        <div className="absolute top-0 right-0 bg-textLight text-white rounded-full p-2">
                          <Lock className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-text">{game.name}</h2>
                    <p className="text-sm sm:text-base text-textLight mb-4 min-h-[3rem]">{game.description}</p>

                    {/* Players Badge */}
                    <div className="flex items-center justify-between">
                      <span className="badge-primary text-xs sm:text-sm">
                        {game.players} Players
                      </span>
                      {!game.available && (
                        <span className="text-xs sm:text-sm text-accent font-bold">
                          Coming Soon
                        </span>
                      )}
                      {isCreating && (
                        <span className="text-xs sm:text-sm text-primary font-bold">
                          Creating...
                        </span>
                      )}
                    </div>

                    {/* Hover Effect Overlay */}
                    {game.available && (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 rounded-3xl transition-all duration-300 pointer-events-none" />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Back Button */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/mode-select')}
              className="btn-ghost flex items-center gap-2 mx-auto text-sm sm:text-base"
              disabled={selectedGame !== null}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Mode Selection
            </button>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default GameSelect
