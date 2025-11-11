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
}

export const roomManager = new RoomManager()
