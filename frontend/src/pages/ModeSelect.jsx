import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import { Users, ArrowLeft, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-accent-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-slate-900">Choose Mode</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3 text-slate-900">Choose Your Mode</h2>
          <p className="text-slate-600">How many friends are joining?</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* 2 Players Mode */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => handleModeSelect('2-player')}
              className="card-hover w-full h-full text-left p-8 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-100 rounded-xl mb-4 group-hover:bg-secondary-200 transition-colors">
                <Heart className="w-7 h-7 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-900">2 Players</h3>
              <p className="text-slate-600 mb-6">Perfect for intimate hangouts</p>
              
              <div className="space-y-2 text-left bg-accent-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                  <span>Truth or Dare</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>Would You Rather</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>Never Have I Ever</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>20 Questions</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-secondary-600 font-medium text-sm">
                <span>Select</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* Multiplayer Mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => handleModeSelect('multiplayer')}
              className="card-hover w-full h-full text-left p-8 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-slate-900">Multiplayer</h3>
              <p className="text-slate-600 mb-6">Party time with 2-6 players</p>
              
              <div className="space-y-2 text-left bg-accent-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>Imposter Game</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>Pictionary</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>Trivia</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-300"></div>
                  <span>More Games</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                <span>Select</span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ModeSelect
