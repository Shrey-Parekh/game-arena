import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { Users, PartyPopper, Heart, ArrowLeft } from 'lucide-react'
import ParticlesBackground from '../components/common/ParticlesBackground'
import CustomCursor from '../components/common/CustomCursor'

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
    <>
      <CustomCursor />
      <ParticlesBackground />
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4 content-wrapper">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-block p-6 bg-gradient-to-br from-primary to-accent rounded-3xl mb-6 animate-float">
              <Users className="w-20 h-20 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-5xl font-bold mb-4 text-text">Choose Your Mode</h1>
            <p className="text-textLight text-xl font-semibold">
              How many friends are joining?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* 2 Players Mode */}
            <div
              onClick={() => handleModeSelect('2-player')}
              className="card-hover group"
            >
              <div className="text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-20 h-20 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-text">2 Players</h2>
                <p className="text-textLight text-lg mb-6 font-semibold">
                  Perfect for intimate hangouts
                </p>
                
                <div className="space-y-3 text-left bg-background/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-text font-semibold">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Truth or Dare</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>Would You Rather</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>Never Have I Ever</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>20 Questions</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="badge-primary">
                    <Heart className="w-4 h-4" />
                    Cozy & Fun
                  </span>
                </div>
              </div>
            </div>

            {/* Multiplayer Mode */}
            <div
              onClick={() => handleModeSelect('multiplayer')}
              className="card-hover group"
            >
              <div className="text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-secondary to-accent rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PartyPopper className="w-20 h-20 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-text">Multiplayer</h2>
                <p className="text-textLight text-lg mb-6 font-semibold">
                  Party time with 2-6 players
                </p>
                
                <div className="space-y-3 text-left bg-background/30 rounded-2xl p-4">
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>Imposter Game</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>Pictionary</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>Trivia</span>
                  </div>
                  <div className="flex items-center gap-3 text-textLight">
                    <div className="w-2 h-2 rounded-full bg-textLight"></div>
                    <span>More Games</span>
                  </div>
                </div>

                <div className="mt-6">
                  <span className="badge-secondary">
                    <PartyPopper className="w-4 h-4" />
                    Epic & Wild
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="btn-ghost flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModeSelect
