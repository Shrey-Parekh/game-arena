import { Server } from 'socket.io'
import { verifyToken } from '../controllers/authController.js'

export function setupSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication token required'))
    }

    try {
      const user = await verifyToken(token)
      socket.userId = user.id
      socket.userEmail = user.email
      next()
    } catch (error) {
      console.error('Socket auth error:', error.message)
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`✓ Socket connected: ${socket.id} (User: ${socket.userId})`)

    socket.on('disconnect', (reason) => {
      console.log(`✗ Socket disconnected: ${socket.id} (${reason})`)
    })
  })

  return io
}
