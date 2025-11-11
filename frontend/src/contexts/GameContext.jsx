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

  const startGame = (selectedGameType) => {
    console.log('startGame called', { socket: !!socket, roomCode, isHost, selectedGameType })
    if (socket && roomCode && isHost) {
      console.log('Emitting start-game to server')
      socket.emit('start-game', { roomCode, gameType: selectedGameType })
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
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
