import { roomManager } from '../../models/roomManager.js'
import { getRandomQuestion } from '../../controllers/gameController.js'

export function setupTwoPlayerHandlers(io, socket) {
  
  // Start game
  socket.on('start-game', async (data) => {
    console.log('📥 Received start-game event:', data)
    try {
      const { roomCode, gameType } = data
      const userId = socket.userId

      console.log('User attempting to start game:', { userId, roomCode, gameType })

      const room = roomManager.getRoom(roomCode)
      if (!room) {
        console.error('❌ Room not found:', roomCode)
        return socket.emit('error', { 
          code: 'ROOM_NOT_FOUND', 
          message: 'Room not found' 
        })
      }

      if (room.hostId !== userId) {
        console.error('❌ User is not host:', { userId, hostId: room.hostId })
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can start the game' 
        })
      }

      // Make sure socket is in the room
      if (!socket.rooms.has(roomCode)) {
        console.log('⚠️ Socket not in room, joining now:', roomCode)
        socket.join(roomCode)
      }

      // Initialize game state for Truth or Dare
      if (gameType === 'truth-or-dare') {
        const gameState = {
          mode: null,
          spiceLevel: 'mild',
          currentQuestion: null,
          roundNumber: 0,
          usedQuestionIds: []
        }

        roomManager.startGame(roomCode, gameType)
        roomManager.updateGameState(roomCode, gameState)

        console.log('📤 Emitting game-started to room:', roomCode)
        console.log('Sockets in room:', io.sockets.adapter.rooms.get(roomCode)?.size || 0)
        
        // Notify all players
        io.to(roomCode).emit('game-started', { 
          gameType, 
          gameState 
        })

        console.log(`✓ Game started in room ${roomCode}: ${gameType}`)
      } else {
        console.error('❌ Unsupported game type:', gameType)
      }
    } catch (error) {
      console.error('Start game error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to start game' 
      })
    }
  })

  // Select mode (host only)
  socket.on('select-mode', async (data) => {
    try {
      const { roomCode, mode, spiceLevel } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      if (room.hostId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can select mode' 
        })
      }

      // Update game state
      room.gameState.mode = mode
      room.gameState.spiceLevel = spiceLevel || 'mild'

      // Notify all players
      io.to(roomCode).emit('mode-selected', {
        mode,
        spiceLevel: room.gameState.spiceLevel
      })

      console.log(`✓ Mode selected in room ${roomCode}: ${mode}`)
    } catch (error) {
      console.error('Select mode error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to select mode' 
      })
    }
  })

  // Change spice level (host only)
  socket.on('change-spice-level', async (data) => {
    try {
      const { roomCode, spiceLevel } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      if (room.hostId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can change spice level' 
        })
      }

      // Update spice level
      room.gameState.spiceLevel = spiceLevel

      // Notify all players
      io.to(roomCode).emit('spice-level-changed', {
        spiceLevel
      })

      console.log(`✓ Spice level changed in room ${roomCode}: ${spiceLevel}`)
    } catch (error) {
      console.error('Change spice level error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to change spice level' 
      })
    }
  })

  // Select truth or dare
  socket.on('select-truth-or-dare', async (data) => {
    try {
      const { roomCode, choice, spiceLevel, mode } = data

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      // Update spice level and mode if provided
      if (spiceLevel) {
        room.gameState.spiceLevel = spiceLevel
      }
      if (mode) {
        room.gameState.mode = mode
      }

      // Get random question
      const { data: question, error } = await getRandomQuestion(
        choice, 
        room.gameState.spiceLevel,
        room.gameState.mode || 'friends',
        room.gameState.usedQuestionIds
      )

      if (error || !question) {
        return socket.emit('error', { 
          code: 'NO_QUESTIONS', 
          message: 'No questions available' 
        })
      }

      // Update game state
      room.gameState.currentQuestion = question
      room.gameState.usedQuestionIds.push(question.id)
      room.gameState.roundNumber++

      // Emit question to all players
      io.to(roomCode).emit('question-presented', {
        question: question.content,
        type: choice,
        mode: room.gameState.mode,
        spiceLevel: room.gameState.spiceLevel
      })

      console.log(`✓ Question presented in room ${roomCode}`)
    } catch (error) {
      console.error('Select truth or dare error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to get question' 
      })
    }
  })

  // Next question (host only)
  socket.on('next-question', async (data) => {
    try {
      const { roomCode } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room) {
        return socket.emit('error', { 
          code: 'ROOM_NOT_FOUND', 
          message: 'Room not found' 
        })
      }

      if (room.hostId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can go to next question' 
        })
      }

      // Clear current question
      room.gameState.currentQuestion = null

      // Notify all players to show selection screen
      io.to(roomCode).emit('show-selection')

      console.log(`✓ Next question requested in room ${roomCode}`)
    } catch (error) {
      console.error('Next question error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to go to next question' 
      })
    }
  })

  // Send chat message
  socket.on('send-chat-message', async (data) => {
    try {
      const { roomCode, message, image } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room) {
        return socket.emit('error', { 
          code: 'ROOM_NOT_FOUND', 
          message: 'Room not found' 
        })
      }

      const player = room.players.get(userId)
      if (!player) {
        return socket.emit('error', { 
          code: 'PLAYER_NOT_FOUND', 
          message: 'Player not in room' 
        })
      }

      // Broadcast message to all players in room
      io.to(roomCode).emit('chat-message', {
        playerId: userId,
        playerName: player.username || player.email,
        message: message ? message.trim() : '',
        image: image || null,
        timestamp: new Date().toISOString()
      })

      console.log(`✓ Chat message sent in room ${roomCode}`)
    } catch (error) {
      console.error('Send chat message error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to send message' 
      })
    }
  })
}
