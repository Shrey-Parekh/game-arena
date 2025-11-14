// In-memory room state management
class RoomManager {
  constructor() {
    this.rooms = new Map() // roomCode -> RoomState
  }

  createRoom(roomCode, hostId, mode) {
    const room = {
      roomCode,
      hostId,
      mode,
      players: new Map(), // userId -> PlayerState
      gameType: null,
      gameState: null,
      createdAt: new Date(),
      status: 'waiting'
    }
    
    this.rooms.set(roomCode, room)
    return room
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode)
  }

  deleteRoom(roomCode) {
    return this.rooms.delete(roomCode)
  }

  addPlayer(roomCode, userId, socketId, userEmail) {
    const room = this.rooms.get(roomCode)
    if (!room) return null

    const player = {
      userId,
      socketId,
      username: userEmail.split('@')[0], // Use email prefix as username
      email: userEmail,
      score: 0,
      isConnected: true,
      isHost: userId === room.hostId,
      lastSeen: new Date()
    }

    room.players.set(userId, player)
    return player
  }

  removePlayer(roomCode, userId) {
    const room = this.rooms.get(roomCode)
    if (!room) return null

    const removed = room.players.delete(userId)
    
    // If host left, assign new host
    if (userId === room.hostId && room.players.size > 0) {
      const newHost = Array.from(room.players.values())[0]
      room.hostId = newHost.userId
      newHost.isHost = true
      return { removed, newHostId: newHost.userId }
    }

    // If room is empty, delete it
    if (room.players.size === 0) {
      this.deleteRoom(roomCode)
    }

    return { removed, newHostId: null }
  }

  updatePlayerConnection(roomCode, userId, isConnected) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    const player = room.players.get(userId)
    if (!player) return false

    player.isConnected = isConnected
    player.lastSeen = new Date()
    return true
  }

  updatePlayerSocket(roomCode, userId, socketId) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    const player = room.players.get(userId)
    if (!player) return false

    player.socketId = socketId
    player.isConnected = true
    player.lastSeen = new Date()
    return true
  }

  getPlayersArray(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room) return []

    return Array.from(room.players.values())
  }

  updateGameState(roomCode, gameState) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    room.gameState = gameState
    return true
  }

  startGame(roomCode, gameType) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    room.gameType = gameType
    room.status = 'active'
    return true
  }

  endGame(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    room.status = 'finished'
    return true
  }

  getAllRooms() {
    return Array.from(this.rooms.values())
  }

  // ===== NHIE Game Specific Methods =====

  /**
   * Initialize NHIE game state
   * @param {string} roomCode - Room code
   * @param {Array<string>} categories - Selected categories
   * @returns {boolean} - Success status
   */
  initializeNHIEGame(roomCode, categories = ['pg', 'adult', 'funny', 'deep']) {
    const room = this.rooms.get(roomCode)
    if (!room) return false

    const playersArray = Array.from(room.players.values())
    
    const gameState = {
      phase: 'category',
      currentRound: 1,
      roundWins: new Map(),
      fingerCounts: new Map(),
      currentStatement: null,
      responses: new Map(),
      reactions: new Map(),
      usedStatementIds: [],
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

    // Initialize finger counts and round wins for all players
    for (const player of playersArray) {
      gameState.fingerCounts.set(player.userId, 5)
      gameState.roundWins.set(player.userId, 0)
      gameState.matchStats.fingersLostPerPlayer[player.userId] = 0
    }

    room.gameState = gameState
    room.gameType = 'never-have-i-ever'
    room.status = 'active'
    
    return true
  }

  /**
   * Update finger count for a player
   * @param {string} roomCode - Room code
   * @param {string} userId - User ID
   * @param {number} newCount - New finger count
   * @returns {boolean} - Success status
   */
  updateFingerCount(roomCode, userId, newCount) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return false

    // Validate count is between 0 and 5
    if (newCount < 0 || newCount > 5) {
      console.error('Invalid finger count:', newCount)
      return false
    }

    room.gameState.fingerCounts.set(userId, newCount)
    return true
  }

  /**
   * Record round winner
   * @param {string} roomCode - Room code
   * @param {string} winnerId - Winner user ID
   * @returns {boolean} - Success status
   */
  recordRoundWin(roomCode, winnerId) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return false

    const currentWins = room.gameState.roundWins.get(winnerId) || 0
    room.gameState.roundWins.set(winnerId, currentWins + 1)
    
    console.log(`🏆 Round win recorded for ${winnerId}. Total wins: ${currentWins + 1}`)
    return true
  }

  /**
   * Reset round (fingers back to 5)
   * @param {string} roomCode - Room code
   * @returns {boolean} - Success status
   */
  resetRound(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return false

    // Reset all finger counts to 5
    for (const [userId] of room.players) {
      room.gameState.fingerCounts.set(userId, 5)
    }

    // Clear responses and reactions
    room.gameState.responses = new Map()
    room.gameState.reactions = new Map()
    
    // Increment round number
    room.gameState.currentRound++
    
    console.log(`🔄 Round reset. Starting round ${room.gameState.currentRound}`)
    return true
  }

  /**
   * Get match statistics
   * @param {string} roomCode - Room code
   * @returns {Object|null} - Match statistics or null
   */
  getMatchStats(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return null

    const stats = room.gameState.matchStats
    
    // Calculate most revealing category
    let mostRevealingCategory = null
    let maxFingers = 0
    
    for (const [category, count] of Object.entries(stats.statementsByCategory)) {
      // Calculate total fingers lost for this category
      const categoryFingers = stats.mostRevealingStatements
        .filter(s => s.category === category)
        .reduce((sum, s) => sum + s.fingersLost, 0)
      
      if (categoryFingers > maxFingers) {
        maxFingers = categoryFingers
        mostRevealingCategory = category
      }
    }

    return {
      totalStatements: stats.totalStatements,
      statementsByCategory: stats.statementsByCategory,
      fingersLostPerPlayer: stats.fingersLostPerPlayer,
      mostRevealingStatements: stats.mostRevealingStatements.slice(0, 3),
      mostRevealingCategory
    }
  }

  /**
   * Get current finger counts
   * @param {string} roomCode - Room code
   * @returns {Object|null} - Finger counts object or null
   */
  getFingerCounts(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return null

    return Object.fromEntries(room.gameState.fingerCounts)
  }

  /**
   * Get round wins
   * @param {string} roomCode - Room code
   * @returns {Object|null} - Round wins object or null
   */
  getRoundWins(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return null

    return Object.fromEntries(room.gameState.roundWins)
  }

  /**
   * Check if player has responded
   * @param {string} roomCode - Room code
   * @param {string} userId - User ID
   * @returns {boolean} - True if player has responded
   */
  hasPlayerResponded(roomCode, userId) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return false

    return room.gameState.responses.has(userId)
  }

  /**
   * Get response count
   * @param {string} roomCode - Room code
   * @returns {number} - Number of responses submitted
   */
  getResponseCount(roomCode) {
    const room = this.rooms.get(roomCode)
    if (!room || !room.gameState) return 0

    return room.gameState.responses.size
  }
}

export const roomManager = new RoomManager()
