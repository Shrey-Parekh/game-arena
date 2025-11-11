import { roomManager } from '../../models/roomManager.js'
import { createRoomInDB, getRoomFromDB, addPlayerToDB, removePlayerFromDB } from '../../controllers/roomController.js'

export function setupRoomHandlers(io, socket) {
  
  // Create room
  socket.on('create-room', async (data) => {
    try {
      const { mode } = data
      const userId = socket.userId

      // Create room in database
      const { data: dbRoom, error } = await createRoomInDB(userId, mode)
      
      if (error) {
        return socket.emit('error', { 
          code: 'ROOM_CREATE_FAILED', 
          message: 'Failed to create room' 
        })
      }

      // Create room in memory
      const room = roomManager.createRoom(dbRoom.room_code, userId, mode)
      
      // Add host as player
      const player = roomManager.addPlayer(
        dbRoom.room_code, 
        userId, 
        socket.id, 
        socket.userEmail
      )

      // Join socket room
      socket.join(dbRoom.room_code)

      // Emit success
      socket.emit('room-created', {
        roomCode: dbRoom.room_code,
        hostId: userId
      })

      console.log(`✓ Room created: ${dbRoom.room_code} by ${socket.userEmail}`)
    } catch (error) {
      console.error('Create room error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'An error occurred' 
      })
    }
  })

  // Join room
  socket.on('join-room', async (data) => {
    try {
      const { roomCode } = data
      const userId = socket.userId

      // Check if room exists in database
      const { data: dbRoom, error: dbError } = await getRoomFromDB(roomCode)
      
      if (dbError || !dbRoom) {
        return socket.emit('error', { 
          code: 'ROOM_NOT_FOUND', 
          message: 'Room not found' 
        })
      }

      // Get or create room in memory
      let room = roomManager.getRoom(roomCode)
      if (!room) {
        room = roomManager.createRoom(roomCode, dbRoom.host_id, dbRoom.mode)
      }

      // Check if room is full
      const maxPlayers = dbRoom.max_players
      if (room.players.size >= maxPlayers) {
        return socket.emit('error', { 
          code: 'ROOM_FULL', 
          message: 'This room is full' 
        })
      }

      // Add player to database
      await addPlayerToDB(dbRoom.id, userId, false)

      // Add player to memory
      const player = roomManager.addPlayer(roomCode, userId, socket.id, socket.userEmail)

      // Join socket room
      socket.join(roomCode)

      // Notify all players
      const players = roomManager.getPlayersArray(roomCode)
      io.to(roomCode).emit('player-joined', { players })

      console.log(`✓ Player ${socket.userEmail} joined room ${roomCode}`)
    } catch (error) {
      console.error('Join room error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'An error occurred' 
      })
    }
  })

  // Leave room
  socket.on('leave-room', async (data) => {
    try {
      const { roomCode } = data
      const userId = socket.userId

      const room = roomManager.getRoom(roomCode)
      if (!room) return

      // Get room from DB for ID
      const { data: dbRoom } = await getRoomFromDB(roomCode)
      if (dbRoom) {
        await removePlayerFromDB(dbRoom.id, userId)
      }

      // Remove from memory
      const result = roomManager.removePlayer(roomCode, userId)

      // Leave socket room
      socket.leave(roomCode)

      // Notify remaining players
      const players = roomManager.getPlayersArray(roomCode)
      io.to(roomCode).emit('player-left', { 
        players,
        newHostId: result.newHostId 
      })

      console.log(`✓ Player ${socket.userEmail} left room ${roomCode}`)
    } catch (error) {
      console.error('Leave room error:', error)
    }
  })

  // Rejoin room (for reconnections)
  socket.on('rejoin-room', async (data) => {
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

      // Check if player is in the room
      const player = room.players.get(userId)
      if (!player) {
        return socket.emit('error', { 
          code: 'NOT_IN_ROOM', 
          message: 'You are not in this room' 
        })
      }

      // Update socket ID and connection status
      roomManager.updatePlayerSocket(roomCode, userId, socket.id)
      roomManager.updatePlayerConnection(roomCode, userId, true)

      // Join socket room
      socket.join(roomCode)

      // Send current state
      const players = roomManager.getPlayersArray(roomCode)
      socket.emit('player-rejoined', { 
        players,
        gameState: room.gameState,
        gameType: room.gameType
      })

      // Notify others
      io.to(roomCode).emit('player-reconnected', { 
        playerId: userId 
      })

      console.log(`✓ Player ${socket.userEmail} rejoined room ${roomCode}`)
    } catch (error) {
      console.error('Rejoin room error:', error)
      socket.emit('error', { 
        code: 'INTERNAL_ERROR', 
        message: 'An error occurred' 
      })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    // Find all rooms this socket is in
    const rooms = Array.from(socket.rooms).filter(room => room !== socket.id)
    
    rooms.forEach(roomCode => {
      const room = roomManager.getRoom(roomCode)
      if (room) {
        roomManager.updatePlayerConnection(roomCode, socket.userId, false)
        
        io.to(roomCode).emit('player-disconnected', { 
          playerId: socket.userId 
        })

        // Set timeout to remove player if they don't reconnect
        setTimeout(() => {
          const room = roomManager.getRoom(roomCode)
          if (room) {
            const player = room.players.get(socket.userId)
            if (player && !player.isConnected) {
              roomManager.removePlayer(roomCode, socket.userId)
              const players = roomManager.getPlayersArray(roomCode)
              io.to(roomCode).emit('player-left', { players })
            }
          }
        }, 120000) // 2 minutes
      }
    })
  })
}
