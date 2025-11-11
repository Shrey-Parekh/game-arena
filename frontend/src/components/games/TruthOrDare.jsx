import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { useGame } from '../../contexts/GameContext'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Flame, Zap, Send, Users, Crown, ArrowLeft, Image, X } from 'lucide-react'
import Button from '../common/Button'
import toast, { Toaster } from 'react-hot-toast'

function TruthOrDare() {
  const { socket } = useSocket()
  const { user } = useAuth()
  const { roomCode, players, isHost, leaveRoom } = useGame()
  const navigate = useNavigate()
  
  const [mode, setMode] = useState(null)
  const [spiceLevel, setSpiceLevel] = useState('mild')
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [phase, setPhase] = useState('mode-select')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  const chatEndRef = useRef(null)
  const messageInputRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    setPhase('mode-select')
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('game-started', (data) => {
      setPhase('mode-select')
    })

    socket.on('mode-selected', (data) => {
      setMode(data.mode)
      setSpiceLevel(data.spiceLevel || 'mild')
      setPhase('playing')
    })

    socket.on('question-presented', (data) => {
      setCurrentQuestion(data)
      setChatMessages(prev => [...prev, {
        type: 'system',
        content: data.question,
        questionType: data.type,
        timestamp: new Date().toISOString()
      }])
      toast.success(`New ${data.type}!`, { icon: data.type === 'truth' ? '💭' : '⚡' })
    })

    socket.on('show-selection', () => {
      setCurrentQuestion(null)
    })

    socket.on('chat-message', (data) => {
      setChatMessages(prev => [...prev, {
        type: 'user',
        playerId: data.playerId,
        playerName: data.playerName,
        content: data.message,
        image: data.image,
        timestamp: data.timestamp
      }])
    })

    socket.on('spice-level-changed', (data) => {
      setSpiceLevel(data.spiceLevel)
      toast.success(`Spice level: ${data.spiceLevel}`, { icon: '🌶️' })
    })

    return () => {
      socket.off('game-started')
      socket.off('mode-selected')
      socket.off('question-presented')
      socket.off('show-selection')
      socket.off('chat-message')
      socket.off('spice-level-changed')
    }
  }, [socket])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleModeSelect = (selectedMode) => {
    if (socket && roomCode) {
      socket.emit('select-mode', { 
        roomCode, 
        mode: selectedMode,
        spiceLevel: 'mild'
      })
    }
  }

  const handleSpiceLevelChange = (level) => {
    if (socket && roomCode && isHost) {
      socket.emit('change-spice-level', { 
        roomCode, 
        spiceLevel: level
      })
    }
  }

  const handleGetQuestion = (type) => {
    if (socket && roomCode && isHost) {
      socket.emit('select-truth-or-dare', { 
        roomCode, 
        choice: type,
        spiceLevel,
        mode
      })
    }
  }

  const handleNextQuestion = () => {
    if (socket && roomCode && isHost) {
      socket.emit('next-question', { roomCode })
      setCurrentQuestion(null)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(file)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (socket && roomCode && (newMessage.trim() || imagePreview)) {
      socket.emit('send-chat-message', { 
        roomCode, 
        message: newMessage,
        image: imagePreview
      })
      setNewMessage('')
      handleRemoveImage()
      messageInputRef.current?.focus()
    }
  }

  const handleBackToModeSelect = () => {
    if (isHost) {
      setPhase('mode-select')
      setMode(null)
      setChatMessages([])
      setCurrentQuestion(null)
    }
  }

  const handleLeaveGame = () => {
    if (window.confirm('Are you sure you want to leave the game?')) {
      leaveRoom()
      navigate('/')
    }
  }

  const modes = [
    { 
      id: 'friends', 
      name: 'Friends', 
      icon: Users, 
      color: 'from-blue-500 to-cyan-500', 
      desc: 'Fun with friends'
    },
    { 
      id: 'couples', 
      name: 'Couples', 
      icon: Heart, 
      color: 'from-pink-500 to-rose-500', 
      desc: 'Romantic & intimate'
    }
  ]

  const spiceLevels = [
    { id: 'mild', name: 'Mild', icon: Heart, color: 'from-green-500 to-emerald-500' },
    { id: 'spicy', name: 'Spicy', icon: Flame, color: 'from-orange-500 to-red-500' },
    { id: 'extreme', name: 'Extreme', icon: Zap, color: 'from-red-500 to-pink-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-border">
      <Toaster position="top-center" />
      
      {/* Mode Selection Phase */}
      {phase === 'mode-select' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card max-w-2xl w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-text">
                {isHost ? 'Choose Your Mode' : 'Waiting for Host'}
              </h2>
              <Button
                variant="outline"
                onClick={handleLeaveGame}
                className="px-3 py-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {!isHost && (
              <div className="text-center mb-6">
                <Crown className="w-12 h-12 mx-auto text-secondary mb-2" />
                <p className="text-textLight">Host is selecting the game mode...</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modes.map((modeOption) => {
                const Icon = modeOption.icon
                return (
                  <motion.button
                    key={modeOption.id}
                    whileHover={isHost ? { scale: 1.02 } : {}}
                    whileTap={isHost ? { scale: 0.98 } : {}}
                    onClick={() => isHost && handleModeSelect(modeOption.id)}
                    disabled={!isHost}
                    className={`card-hover text-center p-6 ${!isHost ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className={`inline-block p-6 bg-gradient-to-br ${modeOption.color} rounded-2xl mb-3`}>
                      <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-xl mb-1 text-text">{modeOption.name}</h3>
                    <p className="text-sm text-textLight">{modeOption.desc}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Chat Room Phase */}
      {phase === 'playing' && mode && (
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isHost && (
                <button
                  onClick={handleBackToModeSelect}
                  className="p-2 hover:bg-background rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-text" />
                </button>
              )}
              <div>
                <h3 className="font-bold text-lg text-text">Truth or Dare</h3>
                <p className="text-xs text-textLight">
                  {players.length} player{players.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.span 
                key={mode}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="badge badge-primary capitalize text-xs"
              >
                {mode}
              </motion.span>
              <motion.span 
                key={spiceLevel}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="badge badge-secondary capitalize text-xs"
              >
                {spiceLevel}
              </motion.span>
              <button
                onClick={handleLeaveGame}
                className="p-2 hover:bg-background rounded-lg transition-colors ml-2"
              >
                <X className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Host Controls (Desktop) */}
            {isHost && (
              <div className="hidden lg:block w-64 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-text">Host Controls</h3>
                </div>

                {/* Spice Level */}
                <div>
                  <h4 className="text-sm font-semibold text-text mb-2">Spice Level</h4>
                  <div className="space-y-2">
                    {spiceLevels.map((level) => {
                      const Icon = level.icon
                      return (
                        <motion.button
                          key={level.id}
                          onClick={() => handleSpiceLevelChange(level.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-lg transition-all text-sm ${
                            spiceLevel === level.id 
                              ? 'bg-primary text-white shadow-lg' 
                              : 'bg-background hover:bg-border text-text'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="font-semibold">{level.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Question Controls */}
                <div>
                  <h4 className="text-sm font-semibold text-text mb-2">Get Question</h4>
                  <div className="space-y-2">
                    <Button
                      variant="primary"
                      onClick={() => handleGetQuestion('truth')}
                      className="w-full text-sm"
                    >
                      💭 Truth
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleGetQuestion('dare')}
                      className="w-full text-sm"
                    >
                      ⚡ Dare
                    </Button>
                    {currentQuestion && (
                      <Button
                        variant="outline"
                        onClick={handleNextQuestion}
                        className="w-full text-sm"
                      >
                        Next Question
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-background">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-textLight">
                      <p className="text-sm">
                        {isHost ? 'Click "Truth" or "Dare" to start!' : 'Waiting for host to start...'}
                      </p>
                    </div>
                  </div>
                )}
                
                <AnimatePresence>
                  {chatMessages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`${
                        message.type === 'system' 
                          ? 'mx-auto max-w-2xl' 
                          : message.playerId === user?.id
                            ? 'ml-auto max-w-[80%] sm:max-w-md'
                            : 'mr-auto max-w-[80%] sm:max-w-md'
                      }`}
                    >
                      {message.type === 'system' ? (
                        <div className={`bg-gradient-to-r ${
                          message.questionType === 'truth' 
                            ? 'from-primary/20 to-primary/10 border-l-4 border-primary' 
                            : 'from-secondary/20 to-secondary/10 border-l-4 border-secondary'
                        } p-4 rounded-r-xl`}>
                          <span className={`badge ${
                            message.questionType === 'truth' ? 'badge-primary' : 'badge-secondary'
                          } text-xs mb-2`}>
                            {message.questionType?.toUpperCase()}
                          </span>
                          <p className="font-bold text-text text-base leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div className={`${
                          message.playerId === user?.id
                            ? 'bg-primary text-white'
                            : 'bg-card text-text'
                        } p-3 rounded-2xl shadow-sm`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-xs">
                              {message.playerId === user?.id ? 'You' : message.playerName}
                            </span>
                            <span className={`text-xs ${
                              message.playerId === user?.id ? 'text-white/70' : 'text-textLight'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                          </div>
                          {message.image && (
                            <img 
                              src={message.image} 
                              alt="Shared" 
                              className="rounded-lg mb-2 max-w-full h-auto"
                            />
                          )}
                          {message.content && (
                            <p className="text-sm break-words">{message.content}</p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>

              {/* Mobile Host Controls */}
              {isHost && (
                <div className="lg:hidden bg-card border-t border-border p-3">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant="primary"
                      onClick={() => handleGetQuestion('truth')}
                      className="text-xs px-3 py-2 whitespace-nowrap"
                    >
                      💭 Truth
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleGetQuestion('dare')}
                      className="text-xs px-3 py-2 whitespace-nowrap"
                    >
                      ⚡ Dare
                    </Button>
                    {spiceLevels.map((level) => {
                      const Icon = level.icon
                      return (
                        <button
                          key={level.id}
                          onClick={() => handleSpiceLevelChange(level.id)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs whitespace-nowrap ${
                            spiceLevel === level.id 
                              ? 'bg-primary text-white' 
                              : 'bg-background text-text'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {level.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="bg-card border-t border-border p-4">
                {imagePreview && (
                  <div className="mb-3 relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-20 rounded-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 hover:bg-background rounded-lg transition-colors"
                  >
                    <Image className="w-5 h-5 text-textLight" />
                  </button>
                  <input
                    ref={messageInputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="input-field flex-1 text-sm"
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!newMessage.trim() && !imagePreview}
                    className="px-4"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TruthOrDare
