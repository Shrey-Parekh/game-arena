import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import { Gamepad2, Users, LogIn, UserPlus, DoorOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import ParticlesBackground from '../components/common/ParticlesBackground'
import CustomCursor from '../components/common/CustomCursor'

function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roomCodeInput, setRoomCodeInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, signIn, signUp } = useAuth()
  const { joinRoom } = useGame()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      // User is already logged in
    }
  }, [user])

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
      <>
        <CustomCursor />
        <ParticlesBackground />
        <div className="min-h-screen bg-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8 content-wrapper">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="card max-w-md w-full"
          >
            {/* Logo/Icon */}
            <div className="text-center mb-6">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4"
              >
                <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={2.5} />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                <span className="text-gradient-animated">Nexus Arena</span>
              </h1>
              <p className="text-textLight text-sm font-semibold">
                Your virtual hangout spot
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-text">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field text-sm sm:text-base"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-text">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-sm sm:text-base"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border-4 border-primary text-primary px-4 py-3 rounded-2xl font-semibold text-sm"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  'Loading...'
                ) : isLogin ? (
                  <>
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
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
                className="text-primary hover:text-secondary font-semibold transition-colors text-xs sm:text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <CustomCursor />
      <ParticlesBackground />
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4 sm:p-6 lg:p-8 content-wrapper">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4 sm:mb-6"
            >
              <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              <span className="text-gradient-animated">Nexus Arena</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-textLight font-semibold">
              Ready to play? Let's go!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Create Room Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                onClick={() => navigate('/mode-select')}
                className="card-hover group h-full"
              >
                <div className="text-center">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-primary to-secondary rounded-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-text">Create Room</h2>
                  <p className="text-sm sm:text-base lg:text-lg text-textLight mb-4">
                    Start a new game and invite your friends
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <span className="badge-primary text-xs sm:text-sm">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      Host a Game
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Join Room Card */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="card h-full">
                <div className="text-center mb-4">
                  <div className="inline-block p-4 sm:p-6 bg-gradient-to-br from-secondary to-accent rounded-3xl mb-4">
                    <DoorOpen className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-text">Join Room</h2>
                </div>
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <input
                    type="text"
                    value={roomCodeInput}
                    onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                    className="input-field font-mono text-center text-2xl sm:text-3xl tracking-widest"
                    placeholder="ABC123"
                    maxLength={6}
                    required
                  />
                  <button type="submit" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm sm:text-base">
                    <DoorOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                    Join Game
                  </button>
                </form>
              </div>
            </motion.div>
          </div>

          {/* User Info */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="inline-block bg-surface/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-4 border-border shadow-fun">
              <p className="text-textLight text-xs sm:text-sm">
                Logged in as <span className="font-bold text-text">{user.email}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Home
