import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'

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
      // User is already logged in, show room options
    }
  }, [user])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: authError } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setLoading(false)

    if (authError) {
      setError(authError)
    } else if (data) {
      // Success - user will be redirected by useEffect
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full">
          <h1 className="text-4xl font-bold text-center mb-2 text-gradient">
            Nexus Arena
          </h1>
          <p className="text-center text-text/70 mb-8">
            Your virtual hangout spot for long-distance friendships
          </p>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
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
              <label className="block text-sm font-medium mb-2">Password</label>
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
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-5xl font-bold text-center mb-4 text-gradient">
          Nexus Arena
        </h1>
        <p className="text-center text-text/70 mb-12 text-lg">
          Your virtual hangout spot for long-distance friendships
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/mode-select')}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <h2 className="text-2xl font-bold mb-2 text-primary">Create Room</h2>
            <p className="text-text/70">Start a new game and invite friends</p>
          </button>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4 text-secondary">Join Room</h2>
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
              <button type="submit" className="btn-secondary w-full">
                Join Game
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-text/50 text-sm">
            Logged in as {user.email}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home
