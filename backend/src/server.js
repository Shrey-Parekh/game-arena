import express from 'express'
import { createServer } from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import cron from 'node-cron'
import { setupSocketIO } from './config/socket.js'
import { setupSocketHandlers } from './socket/index.js'
import { deleteExpiredRooms } from './controllers/roomController.js'
import { roomManager } from './models/roomManager.js'

// Load environment variables
dotenv.config()

const app = express()
const httpServer = createServer(app)

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeRooms: roomManager.getAllRooms().length
  })
})

// Setup Socket.IO
const io = setupSocketIO(httpServer)
setupSocketHandlers(io)

// Cleanup job - runs every 15 minutes
cron.schedule('*/15 * * * *', async () => {
  console.log('🧹 Running cleanup job...')
  
  try {
    // Delete expired rooms from database
    const { data: expiredRooms } = await deleteExpiredRooms()
    
    // Remove from memory
    expiredRooms.forEach(room => {
      roomManager.deleteRoom(room.room_code)
    })
    
    console.log(`✓ Cleaned up ${expiredRooms.length} expired rooms`)
  } catch (error) {
    console.error('✗ Cleanup job failed:', error)
  }
})

// Start server
const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║     Nexus Arena Backend Server        ║
╠═══════════════════════════════════════╣
║  Port: ${PORT}                           ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}  ║
╚═══════════════════════════════════════╝
  `)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...')
  httpServer.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
