import { createContext, useContext, useState, useEffect } from 'react'
import { useSocket } from './SocketContext'

const GameContext = createContext({})

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [roomCode, setRoomCode] = useState(null)
  const [players, setPlayers] = useState([])
  const [isHost, setIsHost] = useState(false)
  const [gameType, setGameType] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [gameStatus, setGameStatus] = useState('idle') // idle, lobby, playing, finished
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    // Room events
    socket.on('room-created', (data) => {
      setRoomCode(data.roomCode)
      setIsHost(true)
      setGameStatus('lobby')
    })

    socket.on('player-joined', (data) => {
      setPlayers(data.players)
    })

    socket.on('player-left', (data) => {
      setPlayers(data.players)
      if (data.newHostId) {
        setIsHost(data.newHostId === socket.userId)
      }
    })

    socket.on('game-started', (data) => {
      console.log('🎮 Game started event received:', data)
      setGameType(data.gameType)
      setGameState(data.gameState)
      setGameStatus('playing')
      console.log('Game status set to playing')
    })

    socket.on('game-ended', (data) => {
      setGameState(data)
      setGameStatus('finished')
    })

    // Imposter game events
    socket.on('imposter-game-started', (data) => {
      console.log('🎭 Imposter game started:', data)
      setGameType('imposter')
      setGameState(data)
      setGameStatus('playing')
    })

    socket.on('player-submitted', (data) => {
      console.log('📝 Player submitted answer:', data)
      setGameState(prev => ({ ...prev, ...data }))
    })

    socket.on('voting-phase-started', (data) => {
      console.log('🗳️ Voting phase started:', data)
      setGameState(prev => ({ ...prev, ...data }))
    })

    socket.on('player-voted', (data) => {
      console.log('✅ Player voted:', data)
      setGameState(prev => ({ ...prev, ...data }))
    })

    socket.on('reveal-phase-started', (data) => {
      console.log('🎭 Reveal phase started:', data)
      setGameState(prev => ({ ...prev, ...data }))
    })

    socket.on('game-completed', (data) => {
      console.log('🏁 Game completed:', data)
      setGameState(data)
      setGameStatus('finished')
    })

    socket.on('game-ended-insufficient-players', (data) => {
      console.log('⚠️ Game ended - insufficient players')
      setGameState(data)
      setGameStatus('finished')
    })

    socket.on('player-disconnected', (data) => {
      console.log('Player disconnected:', data.playerId)
    })

    socket.on('player-reconnected', (data) => {
      console.log('Player reconnected:', data.playerId)
      if (data.gameState) {
        setGameState(data.gameState)
      }
    })

    socket.on('player-rejoined', (data) => {
      console.log('You rejoined the room:', data)
      setPlayers(data.players)
      if (data.gameState) {
        setGameState(data.gameState)
      }
      if (data.gameType) {
        setGameType(data.gameType)
        setGameStatus('playing')
      }
    })

    // Rejoin room on reconnect
    socket.on('connect', () => {
      console.log('Socket reconnected, attempting to rejoin room...')
      if (roomCode) {
        console.log('Rejoining room:', roomCode)
        socket.emit('rejoin-room', { roomCode })
      }
    })

    return () => {
      socket.off('room-created')
      socket.off('player-joined')
      socket.off('player-left')
      socket.off('game-started')
      socket.off('game-ended')
      socket.off('player-disconnected')
      socket.off('player-reconnected')
      socket.off('player-rejoined')
      socket.off('connect')
      socket.off('imposter-game-started')
      socket.off('player-submitted')
      socket.off('voting-phase-started')
      socket.off('player-voted')
      socket.off('reveal-phase-started')
      socket.off('game-completed')
      socket.off('game-ended-insufficient-players')
    }
  }, [socket, roomCode])

  const createRoom = (mode) => {
    if (socket) {
      socket.emit('create-room', { mode })
    }
  }

  const joinRoom = (code) => {
    if (socket) {
      socket.emit('join-room', { roomCode: code })
      setRoomCode(code)
      setGameStatus('lobby')
    }
  }

  const leaveRoom = () => {
    if (socket && roomCode) {
      console.log('Leaving room:', roomCode)
      socket.emit('leave-room', { roomCode })
    }
    // Always reset state when leaving
    resetGameState()
  }

  const startGame = (selectedGameType, settings = {}) => {
    console.log('startGame called', { socket: !!socket, roomCode, isHost, selectedGameType, settings })
    if (socket && roomCode && isHost) {
      // Emit different events based on game type
      if (selectedGameType === 'imposter') {
        console.log('Emitting start-imposter-game to server with settings:', settings)
        socket.emit('start-imposter-game', { roomCode, settings })
      } else {
        console.log('Emitting start-game to server')
        socket.emit('start-game', { roomCode, gameType: selectedGameType })
      }
    } else {
      console.error('Cannot start game:', { hasSocket: !!socket, roomCode, isHost })
    }
  }

  const resetGameState = () => {
    setRoomCode(null)
    setPlayers([])
    setIsHost(false)
    setGameType(null)
    setGameState(null)
    setGameStatus('idle')
  }

  // Imposter game actions
  const submitAnswer = (answer) => {
    if (socket && roomCode) {
      console.log('Submitting answer:', answer)
      socket.emit('submit-answer', { roomCode, answer })
    }
  }

  const submitVote = (votedForUserId) => {
    if (socket && roomCode) {
      console.log('Submitting vote for:', votedForUserId)
      socket.emit('submit-vote', { roomCode, votedForUserId })
    }
  }

  const nextRound = () => {
    if (socket && roomCode && isHost) {
      console.log('Starting next round')
      socket.emit('next-round', { roomCode })
    }
  }

  const value = {
    roomCode,
    players,
    isHost,
    gameType,
    gameState,
    gameStatus,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    resetGameState,
    setGameState,
    submitAnswer,
    submitVote,
    nextRound,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
