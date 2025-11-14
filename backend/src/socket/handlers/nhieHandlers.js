import { roomManager } from '../../models/roomManager.js'
import { getRandomStatement } from '../../controllers/nhieController.js'

/**
 * Check if response phase is complete (both players responded)
 * @param {Object} room - Room object
 * @returns {boolean}
 */
function checkResponsePhaseComplete(room) {
  if (!room || !room.gameState) return false
  return room.gameState.responses.size >= 2
}

/**
 * Calculate finger losses and update counts
 * @param {Object} room - Room object
 * @returns {Object} - { fingersLost: Map, updatedCounts: Map }
 */
function calculateFingerLosses(room) {
  const fingersLost = new Map()
  const updatedCounts = new Map()
  
  // Check each player's response
  for (const [userId, response] of room.gameState.responses) {
    const currentCount = room.gameState.fingerCounts.get(userId) || 5
    
    if (response === 'have') {
      // Player loses a finger
      const newCount = Math.max(0, currentCount - 1)
      fingersLost.set(userId, 1)
      updatedCounts.set(userId, newCount)
    } else {
      // No finger lost
      fingersLost.set(userId, 0)
      updatedCounts.set(userId, currentCount)
    }
  }
  
  return { fingersLost, updatedCounts }
}

/**
 * Check if round is over (any player at 0 fingers)
 * @param {Map} fingerCounts - Map of userId -> finger count
 * @returns {string|null} - Winner userId or null if round continues
 */
function checkRoundEnd(fingerCounts) {
  for (const [userId, count] of fingerCounts) {
    if (count === 0) {
      // Find the other player (winner)
      for (const [otherUserId, otherCount] of fingerCounts) {
        if (otherUserId !== userId && otherCount > 0) {
          return otherUserId
        }
      }
    }
  }
  return null
}

/**
 * Check if match is over (any player has 2 round wins)
 * @param {Map} roundWins - Map of userId -> round wins
 * @returns {string|null} - Match winner userId or null if match continues
 */
function checkMatchEnd(roundWins) {
  for (const [userId, wins] of roundWins) {
    if (wins >= 2) {
      return userId
    }
  }
  return null
}

/**
 * Update match statistics
 * @param {Object} room - Room object
 * @param {Map} fingersLost - Map of userId -> fingers lost this statement
 */
function updateMatchStats(room, fingersLost) {
  const stats = room.gameState.matchStats
  const statement = room.gameState.currentStatement
  
  // Increment total statements
  stats.totalStatements++
  
  // Track by category
  if (statement && statement.category) {
    stats.statementsByCategory[statement.category] = 
      (stats.statementsByCategory[statement.category] || 0) + 1
  }
  
  // Track fingers lost per player
  for (const [userId, lost] of fingersLost) {
    stats.fingersLostPerPlayer[userId] = 
      (stats.fingersLostPerPlayer[userId] || 0) + lost
  }
  
  // Track most revealing statements
  const totalFingersLost = Array.from(fingersLost.values()).reduce((sum, val) => sum + val, 0)
  if (totalFingersLost > 0 && statement) {
    stats.mostRevealingStatements.push({
      statement: statement.statement,
      category: statement.category,
      fingersLost: totalFingersLost
    })
    
    // Keep only top 10, sorted by fingers lost
    stats.mostRevealingStatements.sort((a, b) => b.fingersLost - a.fingersLost)
    if (stats.mostRevealingStatements.length > 10) {
      stats.mostRevealingStatements = stats.mostRevealingStatements.slice(0, 10)
    }
  }
}

/**
 * Setup all Never Have I Ever game socket event handlers
 * @param {Object} io - Socket.IO server instance
 * @param {Object} socket - Socket instance
 */
export function setupNHIEHandlers(io, socket) {
  console.log('🎮 Setting up NHIE game handlers for socket:', socket.id)
  
  // Start NHIE game
  socket.on('nhie:start-game', async (data) => {
    console.log('📥 Received nhie:start-game event:', data)
    try {
      const { roomCode, categories = ['pg', 'adult', 'funny', 'deep'] } = data
      const userId = socket.userId
      
      console.log('User attempting to start NHIE game:', { userId, roomCode, categories })

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

      // Validate player count (exactly 2 players)
      const playerCount = room.players.size
      if (playerCount !== 2) {
        console.error('❌ Invalid player count:', playerCount)
        return socket.emit('error', { 
          code: 'INVALID_PLAYER_COUNT', 
          message: 'Never Have I Ever requires exactly 2 players' 
        })
      }

      // Make sure socket is in the room
      if (!socket.rooms.has(roomCode)) {
        console.log('⚠️ Socket not in room, joining now:', roomCode)
        socket.join(roomCode)
      }
      
      // Also ensure all players in the room are in the socket room
      for (const [playerId, player] of room.players) {
        const playerSocket = io.sockets.sockets.get(player.socketId)
        if (playerSocket && !playerSocket.rooms.has(roomCode)) {
          console.log('⚠️ Player socket not in room, joining:', playerId)
          playerSocket.join(roomCode)
        }
      }
      
      console.log('📍 Sockets in room before emit:', io.sockets.adapter.rooms.get(roomCode)?.size || 0)

      // Get first statement
      const { data: statement, error: statementError } = await getRandomStatement(categories, [])
      
      if (statementError || !statement) {
        console.error('❌ Failed to get statement:', statementError)
        return socket.emit('error', { 
          code: 'NO_STATEMENTS', 
          message: 'Failed to load game statements' 
        })
      }

      // Initialize game state
      const playersArray = Array.from(room.players.values())
      const gameState = {
        phase: 'response',
        currentRound: 1,
        roundWins: new Map(),
        fingerCounts: new Map(),
        currentStatement: statement,
        responses: new Map(),
        reactions: new Map(),
        usedStatementIds: [statement.id],
        selectedCategories: categories,
        phaseStartTime: Date.now(),
        responseTimer: 20,
        matchStats: {
          totalStatements: 0,
          statementsByCategory: {},
          fingersLostPerPlayer: {},
          mostRevealingStatements: []
        }
      }

      // Initialize finger counts and round wins for both players
      for (const player of playersArray) {
        gameState.fingerCounts.set(player.userId, 5)
        gameState.roundWins.set(player.userId, 0)
        gameState.matchStats.fingersLostPerPlayer[player.userId] = 0
      }

      roomManager.startGame(roomCode, 'never-have-i-ever')
      roomManager.updateGameState(roomCode, gameState)

      console.log('📤 Emitting nhie:game-started to room:', roomCode)
      
      const gameStartedData = {
        gameType: 'never-have-i-ever',
        phase: 'response',
        currentRound: 1,
        statement: statement.statement,
        category: statement.category,
        fingerCounts: Object.fromEntries(gameState.fingerCounts),
        phaseStartTime: gameState.phaseStartTime,
        responseTimer: 20
      }
      
      // Send game started event to both players
      io.to(roomCode).emit('nhie:game-started', gameStartedData)
      
      // Also emit directly to the host socket as a fallback
      socket.emit('nhie:game-started', gameStartedData)
      
      console.log('✅ Game started events emitted')

      console.log(`✅ NHIE game started in room ${roomCode}`)
      console.log(`📝 Statement: ${statement.statement}`)
      
      // Start response timer (20 seconds)
      setTimeout(async () => {
        const currentRoom = roomManager.getRoom(roomCode)
        if (!currentRoom || !currentRoom.gameState || currentRoom.gameState.phase !== 'response') {
          return // Phase already changed
        }
        
        // Auto-submit "I Haven't" for players who didn't respond
        for (const [playerId] of currentRoom.players) {
          if (!currentRoom.gameState.responses.has(playerId)) {
            currentRoom.gameState.responses.set(playerId, 'havent')
            console.log(`⏰ Auto-submitted "havent" for player ${playerId}`)
          }
        }
        
        // Trigger reveal if not already triggered
        if (currentRoom.gameState.responses.size >= 2) {
          await startRevealCountdown(io, roomCode)
        }
      }, 20000)
      
    } catch (error) {
      console.error('Start NHIE game error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to start game' 
      })
    }
  })
  
  // Submit response
  socket.on('nhie:response', async (data) => {
    console.log('📥 Received nhie:response event')
    try {
      const { roomCode, response } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      // Validate response phase is active
      if (room.gameState.phase !== 'response') {
        return socket.emit('error', { 
          code: 'WRONG_PHASE', 
          message: 'Not in response phase' 
        })
      }

      // Validate response value
      if (response !== 'have' && response !== 'havent') {
        return socket.emit('error', { 
          code: 'INVALID_RESPONSE', 
          message: 'Response must be "have" or "havent"' 
        })
      }

      // Prevent duplicate responses
      if (room.gameState.responses.has(userId)) {
        console.log(`⚠️ Player ${userId} already responded`)
        return
      }

      // Store the response
      room.gameState.responses.set(userId, response)
      
      const submittedCount = room.gameState.responses.size
      
      console.log(`✅ Response submitted by ${userId}: ${response} (${submittedCount}/2)`)
      
      // Broadcast submission status to both players
      io.to(roomCode).emit('nhie:player-responded', {
        submittedCount,
        totalPlayers: 2
      })

      // Check if both players have submitted
      if (checkResponsePhaseComplete(room)) {
        console.log('📊 Both players responded, starting reveal countdown')
        await startRevealCountdown(io, roomCode)
      }
      
    } catch (error) {
      console.error('Submit response error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to submit response' 
      })
    }
  })
  
  // Submit reaction emoji
  socket.on('nhie:reaction', (data) => {
    console.log('📥 Received nhie:reaction event')
    try {
      const { roomCode, emoji } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      // Only allow reactions during reveal phase
      if (room.gameState.phase !== 'reveal') {
        return
      }

      // Rate limiting: max 5 reactions per player per reveal
      const playerReactions = Array.from(room.gameState.reactions.values())
        .filter(r => r.userId === userId)
      
      if (playerReactions.length >= 5) {
        console.log(`⚠️ Player ${userId} exceeded reaction limit`)
        return
      }

      // Store reaction with timestamp
      const reactionId = `${userId}-${Date.now()}`
      room.gameState.reactions.set(reactionId, { userId, emoji, timestamp: Date.now() })
      
      // Get player name
      const player = room.players.get(userId)
      const playerName = player?.username || player?.email || 'Unknown'
      
      console.log(`✅ Reaction ${emoji} from ${playerName}`)
      
      // Broadcast reaction to both players
      io.to(roomCode).emit('nhie:reaction-received', {
        userId,
        playerName,
        emoji
      })
      
    } catch (error) {
      console.error('Submit reaction error:', error)
    }
  })
  
  // Next statement
  socket.on('nhie:next-statement', async (data) => {
    console.log('📥 Received nhie:next-statement event')
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

      // Only host can trigger next statement
      if (room.hostId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can continue' 
        })
      }

      // Get next statement
      const { data: statement, error: statementError } = await getRandomStatement(
        room.gameState.selectedCategories,
        room.gameState.usedStatementIds
      )
      
      if (statementError || !statement) {
        console.error('❌ Failed to get statement:', statementError)
        return socket.emit('error', { 
          code: 'NO_STATEMENTS', 
          message: 'Failed to load next statement' 
        })
      }

      // Reset for next statement
      room.gameState.phase = 'response'
      room.gameState.currentStatement = statement
      room.gameState.responses = new Map()
      room.gameState.reactions = new Map()
      room.gameState.usedStatementIds.push(statement.id)
      room.gameState.phaseStartTime = Date.now()

      console.log('📤 Emitting nhie:new-statement to room:', roomCode)
      
      io.to(roomCode).emit('nhie:new-statement', {
        phase: 'response',
        statement: statement.statement,
        category: statement.category,
        fingerCounts: Object.fromEntries(room.gameState.fingerCounts),
        phaseStartTime: room.gameState.phaseStartTime,
        responseTimer: 20
      })

      console.log(`✅ New statement: ${statement.statement}`)
      
      // Start response timer
      setTimeout(async () => {
        const currentRoom = roomManager.getRoom(roomCode)
        if (!currentRoom || !currentRoom.gameState || currentRoom.gameState.phase !== 'response') {
          return
        }
        
        // Auto-submit for non-responders
        for (const [playerId] of currentRoom.players) {
          if (!currentRoom.gameState.responses.has(playerId)) {
            currentRoom.gameState.responses.set(playerId, 'havent')
            console.log(`⏰ Auto-submitted "havent" for player ${playerId}`)
          }
        }
        
        if (currentRoom.gameState.responses.size >= 2) {
          await startRevealCountdown(io, roomCode)
        }
      }, 20000)
      
    } catch (error) {
      console.error('Next statement error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to load next statement' 
      })
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
    
    rooms.forEach(roomCode => {
      const room = roomManager.getRoom(roomCode)
      if (room && room.gameType === 'never-have-i-ever' && room.gameState) {
        const userId = socket.userId
        
        console.log(`⚠️ Player ${userId} disconnected from NHIE game in room ${roomCode}`)
        
        // Notify other player
        io.to(roomCode).emit('nhie:player-disconnected', {
          userId,
          message: 'Opponent disconnected. Waiting for reconnection...'
        })
        
        // Set timeout for 30 seconds
        setTimeout(() => {
          const currentRoom = roomManager.getRoom(roomCode)
          if (!currentRoom) return
          
          const player = currentRoom.players.get(userId)
          if (player && !player.isConnected) {
            // Player didn't reconnect, declare other player as winner
            console.log(`⏰ Player ${userId} didn't reconnect, ending match`)
            
            // Find other player
            for (const [otherUserId] of currentRoom.players) {
              if (otherUserId !== userId) {
                const otherPlayer = currentRoom.players.get(otherUserId)
                
                io.to(roomCode).emit('nhie:match-ended-disconnect', {
                  winnerId: otherUserId,
                  winnerName: otherPlayer?.username || otherPlayer?.email || 'Unknown',
                  reason: 'Opponent disconnected'
                })
                
                roomManager.endGame(roomCode)
                break
              }
            }
          }
        }, 30000)
      }
    })
  })
}

/**
 * Start reveal countdown (3-2-1)
 * @param {Object} io - Socket.IO server instance
 * @param {string} roomCode - Room code
 */
async function startRevealCountdown(io, roomCode) {
  const room = roomManager.getRoom(roomCode)
  if (!room || !room.gameState) return

  room.gameState.phase = 'reveal-countdown'
  
  // Countdown: 3, 2, 1
  for (let count = 3; count >= 1; count--) {
    io.to(roomCode).emit('nhie:countdown', { count })
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Reveal
  await revealResponses(io, roomCode)
}

/**
 * Reveal responses and update finger counts
 * @param {Object} io - Socket.IO server instance
 * @param {string} roomCode - Room code
 */
async function revealResponses(io, roomCode) {
  const room = roomManager.getRoom(roomCode)
  if (!room || !room.gameState) return

  room.gameState.phase = 'reveal'
  
  // Calculate finger losses
  const { fingersLost, updatedCounts } = calculateFingerLosses(room)
  
  // Update finger counts
  room.gameState.fingerCounts = updatedCounts
  
  // Update statistics
  updateMatchStats(room, fingersLost)
  
  // Prepare response data with player names
  const responsesData = {}
  for (const [userId, response] of room.gameState.responses) {
    const player = room.players.get(userId)
    responsesData[userId] = {
      name: player?.username || player?.email || 'Unknown',
      response: response,
      fingersLost: fingersLost.get(userId) || 0,
      newFingerCount: updatedCounts.get(userId) || 0
    }
  }
  
  console.log('📤 Emitting nhie:reveal to room:', roomCode)
  
  io.to(roomCode).emit('nhie:reveal', {
    phase: 'reveal',
    responses: responsesData,
    fingerCounts: Object.fromEntries(updatedCounts),
    fingersLost: Object.fromEntries(fingersLost)
  })
  
  // Check if round is over
  const roundWinnerId = checkRoundEnd(updatedCounts)
  
  if (roundWinnerId) {
    // Round is over
    setTimeout(() => {
      handleRoundEnd(io, roomCode, roundWinnerId)
    }, 3000) // Wait 3 seconds before showing round end
  }
}

/**
 * Handle round end
 * @param {Object} io - Socket.IO server instance
 * @param {string} roomCode - Room code
 * @param {string} winnerId - Winner user ID
 */
async function handleRoundEnd(io, roomCode, winnerId) {
  const room = roomManager.getRoom(roomCode)
  if (!room || !room.gameState) return

  // Update round wins
  const currentWins = room.gameState.roundWins.get(winnerId) || 0
  room.gameState.roundWins.set(winnerId, currentWins + 1)
  
  const winner = room.players.get(winnerId)
  const winnerName = winner?.username || winner?.email || 'Unknown'
  
  console.log(`🏆 Round ${room.gameState.currentRound} winner: ${winnerName}`)
  
  // Check if match is over
  const matchWinnerId = checkMatchEnd(room.gameState.roundWins)
  
  if (matchWinnerId) {
    // Match is over
    handleMatchEnd(io, roomCode, matchWinnerId)
  } else {
    // Start round break
    room.gameState.phase = 'round-break'
    
    io.to(roomCode).emit('nhie:round-end', {
      phase: 'round-break',
      winnerId,
      winnerName,
      roundWins: Object.fromEntries(room.gameState.roundWins),
      currentRound: room.gameState.currentRound,
      breakDuration: 10
    })
    
    // Wait 10 seconds then start next round
    setTimeout(async () => {
      await startNextRound(io, roomCode)
    }, 10000)
  }
}

/**
 * Start next round
 * @param {Object} io - Socket.IO server instance
 * @param {string} roomCode - Room code
 */
async function startNextRound(io, roomCode) {
  const room = roomManager.getRoom(roomCode)
  if (!room || !room.gameState) return

  // Increment round number
  room.gameState.currentRound++
  
  // Reset finger counts to 5
  for (const [userId] of room.players) {
    room.gameState.fingerCounts.set(userId, 5)
  }
  
  // Get new statement
  const { data: statement, error: statementError } = await getRandomStatement(
    room.gameState.selectedCategories,
    room.gameState.usedStatementIds
  )
  
  if (statementError || !statement) {
    console.error('❌ Failed to get statement for new round:', statementError)
    return
  }

  // Reset for new round
  room.gameState.phase = 'response'
  room.gameState.currentStatement = statement
  room.gameState.responses = new Map()
  room.gameState.reactions = new Map()
  room.gameState.usedStatementIds.push(statement.id)
  room.gameState.phaseStartTime = Date.now()

  console.log(`📤 Starting round ${room.gameState.currentRound}`)
  
  io.to(roomCode).emit('nhie:new-round', {
    phase: 'response',
    currentRound: room.gameState.currentRound,
    statement: statement.statement,
    category: statement.category,
    fingerCounts: Object.fromEntries(room.gameState.fingerCounts),
    phaseStartTime: room.gameState.phaseStartTime,
    responseTimer: 20
  })
  
  // Start response timer
  setTimeout(async () => {
    const currentRoom = roomManager.getRoom(roomCode)
    if (!currentRoom || !currentRoom.gameState || currentRoom.gameState.phase !== 'response') {
      return
    }
    
    for (const [playerId] of currentRoom.players) {
      if (!currentRoom.gameState.responses.has(playerId)) {
        currentRoom.gameState.responses.set(playerId, 'havent')
      }
    }
    
    if (currentRoom.gameState.responses.size >= 2) {
      await startRevealCountdown(io, roomCode)
    }
  }, 20000)
}

/**
 * Handle match end
 * @param {Object} io - Socket.IO server instance
 * @param {string} roomCode - Room code
 * @param {string} winnerId - Match winner user ID
 */
function handleMatchEnd(io, roomCode, winnerId) {
  const room = roomManager.getRoom(roomCode)
  if (!room || !room.gameState) return

  room.gameState.phase = 'match-summary'
  
  const winner = room.players.get(winnerId)
  const winnerName = winner?.username || winner?.email || 'Unknown'
  
  console.log(`🏆 Match winner: ${winnerName}`)
  
  // Prepare final statistics
  const stats = {
    totalStatements: room.gameState.matchStats.totalStatements,
    statementsByCategory: room.gameState.matchStats.statementsByCategory,
    fingersLostPerPlayer: room.gameState.matchStats.fingersLostPerPlayer,
    mostRevealingStatements: room.gameState.matchStats.mostRevealingStatements.slice(0, 3)
  }
  
  io.to(roomCode).emit('nhie:match-end', {
    phase: 'match-summary',
    winnerId,
    winnerName,
    roundWins: Object.fromEntries(room.gameState.roundWins),
    stats
  })
  
  // End game
  roomManager.endGame(roomCode)
  
  console.log(`✅ NHIE match completed in room ${roomCode}`)
}

// Export helper functions for testing
export {
  checkResponsePhaseComplete,
  calculateFingerLosses,
  checkRoundEnd,
  checkMatchEnd,
  updateMatchStats
}
