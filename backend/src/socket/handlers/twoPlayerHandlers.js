import { roomManager } from '../../models/roomManager.js'
import { getRandomQuestion } from '../../controllers/gameController.js'

export function setupTwoPlayerHandlers(io, socket) {
  
  // Start game
  socket.on('start-game', async (data) => {
    try {
      const { roomCode, gameType } = data
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
          message: 'Only host can start the game' 
        })
      }

      // Initialize game state for Truth or Dare
      if (gameType === 'truth-or-dare') {
        const players = Array.from(room.players.keys())
        const randomIndex = Math.floor(Math.random() * players.length)
        
        const gameState = {
          activePlayerId: players[randomIndex],
          spiceLevel: 'mild',
          currentQuestion: null,
          roundNumber: 1,
          usedQuestionIds: [],
          timerStartedAt: null,
          timerDuration: 60,
          scores: {}
        }

        // Initialize scores
        players.forEach(playerId => {
          gameState.scores[playerId] = 0
        })

        roomManager.startGame(roomCode, gameType)
        roomManager.updateGameState(roomCode, gameState)

        // Notify all players
        io.to(roomCode).emit('game-started', { 
          gameType, 
          gameState 
        })

        io.to(roomCode).emit('turn-started', { 
          activePlayerId: gameState.activePlayerId,
          spiceLevel: gameState.spiceLevel
        })

        console.log(`✓ Game started in room ${roomCode}: ${gameType}`)
      }
    } catch (error) {
      console.error('Start game error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to start game' 
      })
    }
  })

  // Select truth or dare
  socket.on('select-truth-or-dare', async (data) => {
    try {
      const { roomCode, choice, spiceLevel } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      if (room.gameState.activePlayerId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_YOUR_TURN', 
          message: 'Wait for your turn' 
        })
      }

      // Update spice level if provided
      if (spiceLevel) {
        room.gameState.spiceLevel = spiceLevel
      }

      // Get random question
      const { data: question, error } = await getRandomQuestion(
        choice, 
        room.gameState.spiceLevel,
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
      room.gameState.timerStartedAt = new Date()

      // Emit question to all players
      io.to(roomCode).emit('question-presented', {
        question: question.content,
        type: choice,
        timer: 60,
        points: question.points
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

  // Submit answer
  socket.on('submit-answer', async (data) => {
    try {
      const { roomCode, answer } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      if (room.gameState.activePlayerId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_YOUR_TURN', 
          message: 'Wait for your turn' 
        })
      }

      // Award points
      const points = room.gameState.currentQuestion?.points || 10
      room.gameState.scores[userId] = (room.gameState.scores[userId] || 0) + points

      // Update player score in memory
      const player = room.players.get(userId)
      if (player) {
        player.score = room.gameState.scores[userId]
      }

      // Check for winner (first to 5 points)
      const winnerThreshold = 5
      if (room.gameState.scores[userId] >= winnerThreshold) {
        // Game over
        roomManager.endGame(roomCode)
        
        const winner = room.players.get(userId)
        io.to(roomCode).emit('game-ended', {
          winner: {
            userId: winner.userId,
            username: winner.username,
            email: winner.email
          },
          finalScores: room.gameState.scores
        })

        console.log(`✓ Game ended in room ${roomCode}, winner: ${winner.username}`)
        return
      }

      // Switch to next player
      const players = Array.from(room.players.keys())
      const currentIndex = players.indexOf(userId)
      const nextIndex = (currentIndex + 1) % players.length
      const nextPlayerId = players[nextIndex]

      room.gameState.activePlayerId = nextPlayerId
      room.gameState.currentQuestion = null
      room.gameState.roundNumber++

      // Emit round ended
      io.to(roomCode).emit('answer-submitted', {
        playerId: userId,
        points: room.gameState.scores[userId]
      })

      io.to(roomCode).emit('round-ended', {
        scores: room.gameState.scores,
        nextPlayerId
      })

      io.to(roomCode).emit('turn-started', {
        activePlayerId: nextPlayerId,
        spiceLevel: room.gameState.spiceLevel
      })

      console.log(`✓ Answer submitted in room ${roomCode}, next player: ${nextPlayerId}`)
    } catch (error) {
      console.error('Submit answer error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to submit answer' 
      })
    }
  })

  // Skip turn
  socket.on('skip-turn', async (data) => {
    try {
      const { roomCode } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      if (room.gameState.activePlayerId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_YOUR_TURN', 
          message: 'Wait for your turn' 
        })
      }

      // Deduct point
      room.gameState.scores[userId] = Math.max(0, (room.gameState.scores[userId] || 0) - 1)

      // Update player score
      const player = room.players.get(userId)
      if (player) {
        player.score = room.gameState.scores[userId]
      }

      // Switch to next player
      const players = Array.from(room.players.keys())
      const currentIndex = players.indexOf(userId)
      const nextIndex = (currentIndex + 1) % players.length
      const nextPlayerId = players[nextIndex]

      room.gameState.activePlayerId = nextPlayerId
      room.gameState.currentQuestion = null
      room.gameState.roundNumber++

      // Emit events
      io.to(roomCode).emit('round-ended', {
        scores: room.gameState.scores,
        nextPlayerId
      })

      io.to(roomCode).emit('turn-started', {
        activePlayerId: nextPlayerId,
        spiceLevel: room.gameState.spiceLevel
      })

      console.log(`✓ Turn skipped in room ${roomCode}`)
    } catch (error) {
      console.error('Skip turn error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to skip turn' 
      })
    }
  })
}
