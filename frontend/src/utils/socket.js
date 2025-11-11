import { io } from 'socket.io-client'

export function createSocketConnection(token) {
  const socketUrl = import.meta.env.VITE_SOCKET_URL

  if (!socketUrl) {
    throw new Error('Missing VITE_SOCKET_URL environment variable')
  }

  const socket = io(socketUrl, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 10,
    timeout: 20000
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
    if (reason === 'io server disconnect') {
      // Server forcefully disconnected, reconnect manually
      socket.connect()
    }
  })

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error)
  })

  return socket
}
