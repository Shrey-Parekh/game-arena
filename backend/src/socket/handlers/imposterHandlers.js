import { roomManager } from '../../models/roomManager.js'
import { getRandomPromptPair } from '../../controllers/promptController.js'

/**
 * Randomly select one player to be the imposter
 * @param {Array} players - Array of player objects
 * @returns {string} - User ID of the selected imposter
 */
function selectImposter(players) {
  if (!players || players.length === 0) {
    throw new Error('No players available to select imposter')
  }
  
  const randomIndex = Math.floor(Math.random() * players.length)
  const imposter = players[randomIndex]
  
  console.log('🎭 Selected imposter:', imposter.username || imposter.email)
  return imposter.userId
}

/**
 * Shuffle answers array while maintaining player mapping
 * @param {Map} answersMap - Map of userId -> answer text
 * @returns {Array} - Shuffled array of {id, text, playerId}
 */
function shuffleAnswers(answersMap) {
  // Convert Map to array
  const answersArray = Array.from(answersMap.entries()).map(([playerId, text]) => ({
    id: Math.random().toString(36).substr(2, 9), // Generate unique ID for voting
    text: text || '', // Handle blank answers
    playerId: playerId // Keep track for scoring (not sent to clients)
  }))
  
  // Fisher-Yates shuffle algorithm
  for (let i = answersArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answersArray[i], answersArray[j]] = [answersArray[j], answersArray[i]]
  }
  
  console.log('🔀 Shuffled', answersArray.length, 'answers')
  return answersArray
}

/**
 * Calculate scores for the round
 * @param {Map} votesMap - Map of userId -> votedForUserId
 * @param {string} imposterId - User ID of the imposter
 * @param {Map} playersMap - Map of userId -> player object
 * @returns {Object} - {roundScores: Map, voteDistribution: Object}
 */
function calculateScores(votesMap, imposterId, playersMap) {
  const roundScores = new Map()
  const voteDistribution = {}
  
  // Initialize scores and vote distribution
  for (const [userId] of playersMap) {
    roundScores.set(userId, 0)
    voteDistribution[userId] = []
  }
  
  // Count votes and calculate scores
  let correctVotes = 0
  for (const [voterId, votedForId] of votesMap) {
    // Track who voted for whom
    if (voteDistribution[votedForId]) {
      voteDistribution[votedForId].push(voterId)
    }
    
    // Award points for correct votes (non-imposters who voted for imposter)
    if (voterId !== imposterId && votedForId === imposterId) {
      roundScores.set(voterId, 100)
      correctVotes++
    }
  }
  
  // Calculate imposter score (50 points per player they fooled)
  const totalPlayers = playersMap.size
  const fooledPlayers = totalPlayers - correctVotes - 1 // -1 for imposter themselves
  const imposterScore = Math.max(0, fooledPlayers * 50)
  roundScores.set(imposterId, imposterScore)
  
  console.log('📊 Round scores calculated:', {
    correctVotes,
    fooledPlayers,
    imposterScore
  })
  
  return { roundScores, voteDistribution }
}

/**
 * Check if answer phase is complete
 * @param {Object} room - Room object
 * @returns {boolean}
 */
function checkAnswerPhaseComplete(room) {
  if (!room || !room.gameState) return false
  
  const totalPlayers = room.players.size
  const submittedAnswers = room.gameState.answers.size
  
  return submittedAnswers >= totalPlayers
}

/**
 * Check if voting phase is complete
 * @param {Object} room - Room object
 * @returns {boolean}
 */
function checkVotingPhaseComplete(room) {
  if (!room || !room.gameState) return false
  
  const totalPlayers = room.players.size
  const submittedVotes = room.gameState.votes.size
  
  return submittedVotes >= totalPlayers
}

/**
 * Setup all Imposter game socket event handlers
 * @param {Object} io - Socket.IO server instance
 * @param {Object} socket - Socket instance
 */
export function setupImposterHandlers(io, socket) {
  console.log('🎮 Setting up Imposter game handlers for socket:', socket.id)
  
  // Start Imposter game
  socket.on('start-imposter-game', async (data) => {
    console.log('📥 Received start-imposter-game event:', data)
    try {
      const { roomCode, settings = {} } = data
      const userId = socket.userId
      
      // Extract settings with defaults
      const answerTime = settings.answerTime || 90
      const totalRounds = settings.totalRounds || 5
      
      console.log('Game settings:', { answerTime, totalRounds })

      console.log('User attempting to start Imposter game:', { userId, roomCode })

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

      // Validate player count (3-6 players)
      const playerCount = room.players.size
      if (playerCount < 3 || playerCount > 6) {
        console.error('❌ Invalid player count:', playerCount)
        return socket.emit('error', { 
          code: 'INVALID_PLAYER_COUNT', 
          message: 'Imposter game requires 3-6 players' 
        })
      }

      // Make sure socket is in the room
      if (!socket.rooms.has(roomCode)) {
        console.log('⚠️ Socket not in room, joining now:', roomCode)
        socket.join(roomCode)
      }

      // Initialize game state for Imposter
      const playersArray = Array.from(room.players.values())
      const imposterId = selectImposter(playersArray)
      
      // Get a random prompt pair
      const { data: promptPair, error: promptError } = await getRandomPromptPair([])
      
      if (promptError || !promptPair) {
        console.error('❌ Failed to get prompt pair:', promptError)
        return socket.emit('error', { 
          code: 'NO_PROMPTS', 
          message: 'Failed to load game prompts' 
        })
      }

      const gameState = {
        phase: 'answer',
        roundNumber: 1,
        totalRounds: totalRounds,
        answerTime: answerTime,
        imposterId: imposterId,
        regularPrompt: promptPair.regular_prompt,
        imposterPrompt: promptPair.imposter_prompt,
        answers: new Map(),
        shuffledAnswers: [],
        votes: new Map(),
        scores: new Map(),
        usedPromptIds: [promptPair.id],
        roundStartTime: Date.now(),
        phaseStartTime: Date.now(),
        roundScores: []
      }

      // Initialize scores for all players
      for (const [playerId] of room.players) {
        gameState.scores.set(playerId, 0)
      }

      roomManager.startGame(roomCode, 'imposter')
      roomManager.updateGameState(roomCode, gameState)

      console.log('📤 Emitting imposter-game-started to room:', roomCode)
      console.log('Sockets in room:', io.sockets.adapter.rooms.get(roomCode)?.size || 0)
      
      // Send personalized events to each player
      for (const [playerId, player] of room.players) {
        const isImposter = playerId === imposterId
        const prompt = isImposter ? promptPair.imposter_prompt : promptPair.regular_prompt
        
        io.to(player.socketId).emit('imposter-game-started', {
          gameType: 'imposter',
          phase: 'answer',
          roundNumber: 1,
          totalRounds: totalRounds,
          answerTime: answerTime,
          prompt: prompt,
          isImposter: isImposter,
          phaseStartTime: gameState.phaseStartTime,
          totalPlayers: playerCount
        })
      }

      console.log(`✅ Imposter game started in room ${roomCode}`)
      console.log(`🎭 Imposter: ${imposterId}`)
      console.log(`📝 Regular prompt: ${promptPair.regular_prompt}`)
      console.log(`📝 Imposter prompt: ${promptPair.imposter_prompt}`)
      
    } catch (error) {
      console.error('Start Imposter game error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to start game' 
      })
    }
  })
  
  // Submit answer
  socket.on('submit-answer', async (data) => {
    console.log('📥 Received submit-answer event')
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

      // Validate answer phase is active
      if (room.gameState.phase !== 'answer') {
        return socket.emit('error', { 
          code: 'WRONG_PHASE', 
          message: 'Not in answer phase' 
        })
      }

      // Store the answer (can be empty string for blank)
      room.gameState.answers.set(userId, answer || '')
      
      const submittedCount = room.gameState.answers.size
      const totalPlayers = room.players.size
      
      console.log(`✅ Answer submitted by ${userId}: ${submittedCount}/${totalPlayers}`)
      
      // Broadcast submission status to all players
      io.to(roomCode).emit('player-submitted', {
        submittedCount,
        totalPlayers
      })

      // Check if all players have submitted
      if (checkAnswerPhaseComplete(room)) {
        console.log('📊 All answers submitted, transitioning to voting phase')
        
        // Shuffle answers
        const shuffled = shuffleAnswers(room.gameState.answers)
        room.gameState.shuffledAnswers = shuffled
        room.gameState.phase = 'voting'
        room.gameState.phaseStartTime = Date.now()
        
        // Send shuffled answers to all players WITH player names
        const answersForClient = shuffled.map(({ id, text, playerId }) => {
          const player = room.players.get(playerId)
          return {
            id,
            text,
            playerId,
            playerName: player?.username || player?.email || 'Unknown'
          }
        })
        
        io.to(roomCode).emit('voting-phase-started', {
          phase: 'voting',
          answers: answersForClient,
          phaseStartTime: room.gameState.phaseStartTime,
          players: Array.from(room.players.values()).map(p => ({
            userId: p.userId,
            username: p.username || p.email
          }))
        })
        
        console.log('✅ Voting phase started')
      }
      
    } catch (error) {
      console.error('Submit answer error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to submit answer' 
      })
    }
  })
  
  // Submit vote
  socket.on('submit-vote', async (data) => {
    console.log('📥 Received submit-vote event')
    try {
      const { roomCode, votedForUserId } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room || !room.gameState) {
        return socket.emit('error', { 
          code: 'INVALID_STATE', 
          message: 'Game not in valid state' 
        })
      }

      // Validate voting phase is active
      if (room.gameState.phase !== 'voting') {
        return socket.emit('error', { 
          code: 'WRONG_PHASE', 
          message: 'Not in voting phase' 
        })
      }

      // Prevent self-voting
      if (userId === votedForUserId) {
        return socket.emit('error', { 
          code: 'CANNOT_VOTE_SELF', 
          message: 'You cannot vote for yourself' 
        })
      }

      // Validate voted player exists
      if (!room.players.has(votedForUserId)) {
        return socket.emit('error', { 
          code: 'INVALID_PLAYER', 
          message: 'Invalid player selected' 
        })
      }

      // Store the vote
      room.gameState.votes.set(userId, votedForUserId)
      
      const votedCount = room.gameState.votes.size
      const totalPlayers = room.players.size
      
      console.log(`✅ Vote submitted by ${userId} for ${votedForUserId}: ${votedCount}/${totalPlayers}`)
      
      // Broadcast voting status to all players
      io.to(roomCode).emit('player-voted', {
        votedCount,
        totalPlayers
      })

      // Check if all players have voted
      if (checkVotingPhaseComplete(room)) {
        console.log('📊 All votes submitted, calculating scores')
        
        // Calculate scores and vote distribution
        const { roundScores, voteDistribution } = calculateScores(
          room.gameState.votes,
          room.gameState.imposterId,
          room.players
        )
        
        // Update cumulative scores
        for (const [playerId, roundScore] of roundScores) {
          const currentScore = room.gameState.scores.get(playerId) || 0
          room.gameState.scores.set(playerId, currentScore + roundScore)
        }
        
        // Store round results
        room.gameState.roundScores.push({
          roundNumber: room.gameState.roundNumber,
          scores: Object.fromEntries(roundScores),
          imposterId: room.gameState.imposterId
        })
        
        // Transition to reveal phase
        room.gameState.phase = 'reveal'
        
        // Get imposter info
        const imposter = room.players.get(room.gameState.imposterId)
        
        // Send reveal data to all players
        io.to(roomCode).emit('reveal-phase-started', {
          phase: 'reveal',
          imposterId: room.gameState.imposterId,
          imposterName: imposter?.username || imposter?.email || 'Unknown',
          regularPrompt: room.gameState.regularPrompt,
          imposterPrompt: room.gameState.imposterPrompt,
          voteDistribution,
          roundScores: Object.fromEntries(roundScores),
          totalScores: Object.fromEntries(room.gameState.scores),
          roundNumber: room.gameState.roundNumber
        })
        
        console.log('✅ Reveal phase started')
        console.log('🎭 Imposter was:', imposter?.username || imposter?.email)
      }
      
    } catch (error) {
      console.error('Submit vote error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to submit vote' 
      })
    }
  })
  
  // Next round
  socket.on('next-round', async (data) => {
    console.log('📥 Received next-round event')
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

      // Validate host
      if (room.hostId !== userId) {
        return socket.emit('error', { 
          code: 'NOT_HOST', 
          message: 'Only host can start next round' 
        })
      }

      // Check if game is complete (dynamic total rounds)
      const totalRounds = room.gameState.totalRounds || 5
      if (room.gameState.roundNumber >= totalRounds) {
        console.log(`🏁 Game complete after ${totalRounds} rounds, showing final results`)
        
        // Calculate final rankings
        const rankedPlayers = Array.from(room.players.values())
          .map(player => ({
            userId: player.userId,
            username: player.username || player.email,
            totalScore: room.gameState.scores.get(player.userId) || 0,
            roundsAsImposter: room.gameState.roundScores.filter(r => r.imposterId === player.userId).length
          }))
          .sort((a, b) => b.totalScore - a.totalScore)
        
        // Find all winners (players with max score)
        const maxScore = rankedPlayers[0]?.totalScore || 0
        const winners = rankedPlayers.filter(p => p.totalScore === maxScore)
        
        room.gameState.phase = 'final'
        roomManager.endGame(roomCode)
        
        io.to(roomCode).emit('game-completed', {
          phase: 'final',
          rankedPlayers,
          winners: winners,
          finalScores: Object.fromEntries(room.gameState.scores),
          roundHistory: room.gameState.roundScores
        })
        
        console.log('✅ Game completed, winners:', winners.map(w => w.username).join(', '))
        return
      }

      // Start next round
      const nextRoundNumber = room.gameState.roundNumber + 1
      console.log(`🔄 Starting round ${nextRoundNumber}`)
      
      // Select new imposter (try to avoid previous imposter)
      const playersArray = Array.from(room.players.values())
      const previousImposterId = room.gameState.imposterId
      let newImposterId
      
      if (playersArray.length > 1) {
        // Try to select someone who wasn't the imposter last round
        const otherPlayers = playersArray.filter(p => p.userId !== previousImposterId)
        if (otherPlayers.length > 0) {
          newImposterId = selectImposter(otherPlayers)
        } else {
          newImposterId = selectImposter(playersArray)
        }
      } else {
        newImposterId = selectImposter(playersArray)
      }
      
      // Get new prompt pair
      const { data: promptPair, error: promptError } = await getRandomPromptPair(room.gameState.usedPromptIds)
      
      if (promptError || !promptPair) {
        console.error('❌ Failed to get prompt pair:', promptError)
        return socket.emit('error', { 
          code: 'NO_PROMPTS', 
          message: 'Failed to load game prompts' 
        })
      }

      // Reset round state
      room.gameState.phase = 'answer'
      room.gameState.roundNumber = nextRoundNumber
      room.gameState.imposterId = newImposterId
      room.gameState.regularPrompt = promptPair.regular_prompt
      room.gameState.imposterPrompt = promptPair.imposter_prompt
      room.gameState.answers = new Map()
      room.gameState.shuffledAnswers = []
      room.gameState.votes = new Map()
      room.gameState.usedPromptIds.push(promptPair.id)
      room.gameState.roundStartTime = Date.now()
      room.gameState.phaseStartTime = Date.now()

      // Send personalized events to each player
      for (const [playerId, player] of room.players) {
        const isImposter = playerId === newImposterId
        const prompt = isImposter ? promptPair.imposter_prompt : promptPair.regular_prompt
        
        io.to(player.socketId).emit('imposter-game-started', {
          gameType: 'imposter',
          phase: 'answer',
          roundNumber: nextRoundNumber,
          totalRounds: room.gameState.totalRounds,
          answerTime: room.gameState.answerTime,
          prompt: prompt,
          isImposter: isImposter,
          phaseStartTime: room.gameState.phaseStartTime,
          totalPlayers: room.players.size
        })
      }

      console.log(`✅ Round ${nextRoundNumber} started`)
      console.log(`🎭 New imposter: ${newImposterId}`)
      
    } catch (error) {
      console.error('Next round error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'Failed to start next round' 
      })
    }
  })

  // Handle player disconnection during Imposter game
  socket.on('disconnect', () => {
    // Find rooms this socket is in
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
    
    rooms.forEach(roomCode => {
      const room = roomManager.getRoom(roomCode)
      if (room && room.gameType === 'imposter' && room.gameState) {
        const userId = socket.userId
        
        console.log(`⚠️ Player ${userId} disconnected from Imposter game in room ${roomCode}`)
        
        // Handle disconnection based on current phase
        if (room.gameState.phase === 'answer') {
          // Treat as blank answer if not already submitted
          if (!room.gameState.answers.has(userId)) {
            room.gameState.answers.set(userId, '')
            console.log(`📝 Auto-submitted blank answer for disconnected player ${userId}`)
            
            // Check if answer phase is now complete
            if (checkAnswerPhaseComplete(room)) {
              console.log('📊 All answers submitted (including disconnected), transitioning to voting')
              
              const shuffled = shuffleAnswers(room.gameState.answers)
              room.gameState.shuffledAnswers = shuffled
              room.gameState.phase = 'voting'
              room.gameState.phaseStartTime = Date.now()
              
              const answersForClient = shuffled.map(({ id, text, playerId }) => {
                const player = room.players.get(playerId)
                return {
                  id,
                  text,
                  playerId,
                  playerName: player?.username || player?.email || 'Unknown'
                }
              })
              
              io.to(roomCode).emit('voting-phase-started', {
                phase: 'voting',
                answers: answersForClient,
                phaseStartTime: room.gameState.phaseStartTime,
                players: Array.from(room.players.values()).map(p => ({
                  userId: p.userId,
                  username: p.username || p.email
                }))
              })
            }
          }
        } else if (room.gameState.phase === 'voting') {
          // Treat as no vote if not already voted
          if (!room.gameState.votes.has(userId)) {
            // Don't add a vote, just check if voting is complete
            console.log(`🗳️ Disconnected player ${userId} did not vote`)
            
            // Check if all connected players have voted
            const connectedPlayers = Array.from(room.players.values()).filter(p => p.isConnected)
            const votesFromConnected = Array.from(room.gameState.votes.keys()).filter(voterId => {
              const voter = room.players.get(voterId)
              return voter && voter.isConnected
            })
            
            if (votesFromConnected.length >= connectedPlayers.length) {
              console.log('📊 All connected players voted, calculating scores')
              
              const { roundScores, voteDistribution } = calculateScores(
                room.gameState.votes,
                room.gameState.imposterId,
                room.players
              )
              
              for (const [playerId, roundScore] of roundScores) {
                const currentScore = room.gameState.scores.get(playerId) || 0
                room.gameState.scores.set(playerId, currentScore + roundScore)
              }
              
              room.gameState.roundScores.push({
                roundNumber: room.gameState.roundNumber,
                scores: Object.fromEntries(roundScores),
                imposterId: room.gameState.imposterId
              })
              
              room.gameState.phase = 'reveal'
              
              const imposter = room.players.get(room.gameState.imposterId)
              
              io.to(roomCode).emit('reveal-phase-started', {
                phase: 'reveal',
                imposterId: room.gameState.imposterId,
                imposterName: imposter?.username || imposter?.email || 'Unknown',
                regularPrompt: room.gameState.regularPrompt,
                imposterPrompt: room.gameState.imposterPrompt,
                voteDistribution,
                roundScores: Object.fromEntries(roundScores),
                totalScores: Object.fromEntries(room.gameState.scores),
                roundNumber: room.gameState.roundNumber
              })
            }
          }
        }
        
        // Check if too few players remain
        const connectedCount = Array.from(room.players.values()).filter(p => p.isConnected).length
        if (connectedCount < 3) {
          console.log(`⚠️ Too few players (${connectedCount}) in room ${roomCode}, ending game`)
          
          roomManager.endGame(roomCode)
          
          io.to(roomCode).emit('game-ended-insufficient-players', {
            message: 'Game ended due to insufficient players'
          })
        }
      }
    })
  })
}

// Export helper functions for testing
export {
  selectImposter,
  shuffleAnswers,
  calculateScores,
  checkAnswerPhaseComplete,
  checkVotingPhaseComplete
}
