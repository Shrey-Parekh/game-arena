import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

function ModeSelect() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleModeSelect = (mode) => {
    navigate('/game-select', { state: { mode } })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">Choose Your Mode</h1>
        <p className="text-center text-text/70 mb-12">
          Select how many players will join
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => handleModeSelect('2-player')}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer text-left"
          >
            <div className="text-6xl mb-4">👥</div>
            <h2 className="text-3xl font-bold mb-3 text-primary">2 Players</h2>
            <p className="text-text/70 mb-4">
              Intimate hangouts with conversation-focused games
            </p>
            <ul className="space-y-2 text-text/60">
              <li>• Truth or Dare</li>
              <li>• Would You Rather</li>
              <li>• Never Have I Ever</li>
              <li>• 20 Questions</li>
            </ul>
          </button>

          <button
            onClick={() => handleModeSelect('multiplayer')}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer text-left"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-3 text-secondary">Multiplayer</h2>
            <p className="text-text/70 mb-4">
              Group party games for 2-6 players
            </p>
            <ul className="space-y-2 text-text/60">
              <li>• Imposter Game</li>
              <li>• Pictionary</li>
              <li>• Trivia</li>
              <li>• Mafia/Werewolf</li>
            </ul>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-text/50 hover:text-text transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModeSelect
