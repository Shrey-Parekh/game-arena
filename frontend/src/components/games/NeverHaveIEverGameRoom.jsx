import { useState, useEffect } from 'react'
import { useGame } from '../../contexts/GameContext'
import { useSocket } from '../../contexts/SocketContext'
import { motion, AnimatePresence } from 'framer-motion'
import CategorySelection from './nhie/CategorySelection'
import ResponsePhase from './nhie/ResponsePhase'
import RevealPhase from './nhie/RevealPhase'
import RoundBreak from './nhie/RoundBreak'
import MatchSummary from './nhie/MatchSummary'

function NeverHaveIEverGameRoom() {
  const { gameState: contextGameState, players, roomCode } = useGame()
  const { socket } = useSocket()
  const [localGameState, setLocalGameState] = useState(contextGameState)
  const [timeRemaining, setTimeRemaining] = useState(20)
  const [localResponse, setLocalResponse] = useState(null)
  const [countdownValue, setCountdownValue] = useState(null)
  const [revealData, setRevealData] = useState(null)
  const [roundEndData, setRoundEndData] = useState(null)
  const [matchEndData, setMatchEndData] = useState(null)

  // Sync local game state with context
  useEffect(() => {
    if (contextGameState) {
      setLocalGameState(contextGameState)
    }
  }, [contextGameState])

  // Subscribe to NHIE socket events
  useEffect(() => {
    if (!socket) return

    // Game started - update local game state directly
    socket.on('nhie:game-started', (data) => {
      console.log('🎮 NHIE game started in component:', data)
      setLocalGameState(data) // Update local state immediately
      setLocalResponse(null)
      setCountdownValue(null)
      setRevealData(null)
      setRoundEndData(null)
      setMatchEndData(null)
    })

    // Player responded
    socket.on('nhie:player-responded', (data) => {
      console.log('📝 Player responded:', data)
    })

    // Countdown
    socket.on('nhie:countdown', (data) => {
      console.log('⏱️ Countdown:', data.count)
      setCountdownValue(data.count)
    })

    // Reveal
    socket.on('nhie:reveal', (data) => {
      console.log('🎭 Reveal:', data)
      setCountdownValue(0)
      setRevealData(data)
    })

    // New statement
    socket.on('nhie:new-statement', (data) => {
      console.log('📄 New statement:', data)
      setLocalGameState(prev => ({ ...prev, ...data }))
      setLocalResponse(null)
      setCountdownValue(null)
      setRevealData(null)
    })

    // Round end
    socket.on('nhie:round-end', (data) => {
      console.log('🏆 Round end:', data)
      setRoundEndData(data)
    })

    // New round
    socket.on('nhie:new-round', (data) => {
      console.log('🔄 New round:', data)
      setLocalGameState(prev => ({ ...prev, ...data }))
      setLocalResponse(null)
      setCountdownValue(null)
      setRevealData(null)
      setRoundEndData(null)
    })

    // Match end
    socket.on('nhie:match-end', (data) => {
      console.log('🏁 Match end:', data)
      setMatchEndData(data)
    })

    // Match ended by disconnect
    socket.on('nhie:match-ended-disconnect', (data) => {
      console.log('⚠️ Match ended by disconnect:', data)
      setMatchEndData(data)
    })

    // Player disconnected
    socket.on('nhie:player-disconnected', (data) => {
      console.log('⚠️ Player disconnected:', data)
    })

    // Reaction received
    socket.on('nhie:reaction-received', (data) => {
      console.log('😄 Reaction received:', data)
    })

    return () => {
      socket.off('nhie:game-started')
      socket.off('nhie:player-responded')
      socket.off('nhie:countdown')
      socket.off('nhie:reveal')
      socket.off('nhie:new-statement')
      socket.off('nhie:round-end')
      socket.off('nhie:new-round')
      socket.off('nhie:match-end')
      socket.off('nhie:match-ended-disconnect')
      socket.off('nhie:player-disconnected')
      socket.off('nhie:reaction-received')
    }
  }, [socket])

  // Timer countdown
  useEffect(() => {
    if (!gameState || !gameState.phaseStartTime) return
    if (gameState.phase !== 'response') return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.phaseStartTime) / 1000)
      const remaining = Math.max(0, gameState.responseTimer - elapsed)
      setTimeRemaining(remaining)

      if (remaining === 0) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState?.phaseStartTime, gameState?.phase, gameState?.responseTimer])

  // Handle response submission
  const handleResponse = (response) => {
    if (!socket || !roomCode || localResponse) return

    setLocalResponse(response)
    socket.emit('nhie:response', { roomCode, response })
  }

  // Handle reaction
  const handleReaction = (emoji) => {
    if (!socket || !roomCode) return
    socket.emit('nhie:reaction', { roomCode, emoji })
  }

  // Handle next statement
  const handleNext = () => {
    if (!socket || !roomCode) return
    socket.emit('nhie:next-statement', { roomCode })
  }

  // Handle category selection
  const handleCategoryStart = (categories) => {
    console.log('🎯 NeverHaveIEverGameRoom: handleCategoryStart called', { 
      socket: !!socket, 
      socketConnected: socket?.connected,
      roomCode, 
      categories 
    })
    
    if (!socket) {
      console.error('❌ Cannot start game - no socket')
      return
    }
    
    if (!socket.connected) {
      console.error('❌ Cannot start game - socket not connected')
      return
    }
    
    if (!roomCode) {
      console.error('❌ Cannot start game - no roomCode')
      return
    }
    
    console.log('📤 Emitting nhie:start-game event to room:', roomCode)
    socket.emit('nhie:start-game', { roomCode, categories })
    console.log('✅ Event emitted successfully')
  }

  // Loading state
  if (!gameState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🤫</div>
          <p className="text-lg text-slate-600">Loading game...</p>
        </div>
      </div>
    )
  }

  // Match summary (final results)
  if (matchEndData) {
    return (
      <div className="min-h-screen bg-background">
        <MatchSummary 
          matchEndData={matchEndData}
          players={players}
        />
      </div>
    )
  }

  // Round break
  if (roundEndData) {
    return (
      <div className="min-h-screen bg-background">
        <RoundBreak 
          roundEndData={roundEndData}
          players={players}
        />
      </div>
    )
  }

  // Use local game state for rendering
  const gameState = localGameState

  // Debug: log when gameState changes
  useEffect(() => {
    console.log('🔄 GameState changed in NeverHaveIEverGameRoom:', gameState)
  }, [gameState])

  // Debug log
  console.log('NeverHaveIEverGameRoom render - phase:', gameState?.phase, 'gameState:', gameState)

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {gameState.phase === 'category' && (
          <motion.div
            key="category"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CategorySelection onStart={handleCategoryStart} />
          </motion.div>
        )}

        {gameState.phase === 'response' && (
          <motion.div
            key="response"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ResponsePhase 
              gameState={gameState}
              players={players}
              timeRemaining={timeRemaining}
              onResponse={handleResponse}
              hasResponded={!!localResponse}
              localResponse={localResponse}
            />
          </motion.div>
        )}

        {(gameState.phase === 'reveal-countdown' || gameState.phase === 'reveal') && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <RevealPhase 
              gameState={gameState}
              players={players}
              countdownValue={countdownValue}
              revealData={revealData}
              onReaction={handleReaction}
              onNext={handleNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NeverHaveIEverGameRoom
