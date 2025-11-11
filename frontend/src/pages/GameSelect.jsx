import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { useEffect } from 'react'

function GameSelect() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { createRoom } = useGame()
  const mode = location.state?.mode || '2-player'

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleGameSelect = (gameType) => {
    createRoom(mode)
    // Room creation will trigger navigation via GameContext
    setTimeout(() => {
      navigate('/game', { state: { gameType } })
    }, 500)
  }

  const twoPlayerGames = [
    {
      id: 'truth-or-dare',
      name: 'Truth or Dare',
      emoji: '🎭',
      description: 'Classic party game with customizable spice levels',
      available: true
    },
    {
      id: 'would-you-rather',
      name: 'Would You Rather',
      emoji: '🤔',
      description: 'Debate impossible dilemmas',
      available: false
    },
    {
      id: 'never-have-i-ever',
      name: 'Never Have I Ever',
      emoji: '🙈',
      description: 'Discover secrets and shared experiences',
      available: false
    },
    {
      id: '20-questions',
      name: '20 Questions',
      emoji: '❓',
      description: 'Guess what your friend is thinking',
      available: false
    }
  ]

  const multiplayerGames = [
    {
      id: 'imposter',
      name: 'Imposter Game',
      emoji: '🕵️',
      description: 'Find the imposter among your friends',
      available: false
    },
    {
      id: 'pictionary',
      name: 'Pictionary',
      emoji: '🎨',
      description: 'Draw and guess in real-time',
      available: false
    },
    {
      id: 'trivia',
      name: 'Trivia',
      emoji: '🧠',
      description: 'Test your knowledge with betting',
      available: false
    }
  ]

  const games = mode === '2-player' ? twoPlayerGames : multiplayerGames

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">Choose a Game</h1>
        <p className="text-center text-text/70 mb-12">
          {mode === '2-player' ? '2 Player Games' : 'Multiplayer Games (2-6 players)'}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => game.available && handleGameSelect(game.id)}
              disabled={!game.available}
              className={`card text-left transition-all duration-200 ${
                game.available
                  ? 'hover:scale-105 cursor-pointer'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-5xl mb-3">{game.emoji}</div>
              <h2 className="text-2xl font-bold mb-2">{game.name}</h2>
              <p className="text-text/70">{game.description}</p>
              {!game.available && (
                <span className="inline-block mt-3 text-sm text-accent">
                  Coming Soon
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/mode-select')}
            className="text-text/50 hover:text-text transition-colors"
          >
            ← Back to Mode Selection
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameSelect
