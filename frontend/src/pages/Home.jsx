import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { Users, LogIn, UserPlus, DoorOpen, LogOut, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, signIn, signUp, signOut } = useAuth()
  const { joinRoom } = useGame()
  const navigate = useNavigate()

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError} = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (authError) {
      setError(authError)
    }
  }

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomCodeInput.length === 6) {
      joinRoom(roomCodeInput.toUpperCase())
      navigate('/game')
    } else {
      setError('Room code must be 6 characters')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-semibold mb-2 text-slate-900">
              Nexus Arena
            </h1>
            <p className="text-slate-600 text-sm">Your virtual hangout spot</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                'Loading...'
              ) : isLogin ? (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary-100 rounded-lg">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">
                Nexus Arena
              </h1>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="p-2 hover:bg-accent-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold mb-3 text-slate-900">
            Ready to play?
          </h2>
          <p className="text-slate-600">Create a room or join your friends</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Create Room Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => navigate('/mode-select')}
              className="card-hover w-full h-full text-left p-8 group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-xl mb-4 group-hover:bg-primary-200 transition-colors">
                <Users className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Create Room</h3>
              <p className="text-slate-600 text-sm mb-6">
                Start a new game and invite your friends
              </p>
              <div className="flex items-center gap-2 text-primary-600 font-medium text-sm">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </motion.div>

          {/* Join Room Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card p-8 h-full">
              <div className="text-left mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-secondary-100 rounded-xl mb-4">
                  <DoorOpen className="w-7 h-7 text-secondary-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Join Room</h3>
                <p className="text-slate-600 text-sm">Enter the 6-digit room code</p>
              </div>
              <form onSubmit={handleJoinRoom} className="space-y-4">
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  className="input-field font-mono text-center text-2xl tracking-widest"
                  placeholder="ABC123"
                  maxLength={6}
                  required
                />
                <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2">
                  <DoorOpen className="w-5 h-5" />
                  Join Game
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home
