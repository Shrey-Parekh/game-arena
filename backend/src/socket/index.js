import { setupRoomHandlers } from './handlers/roomHandlers.js'
import { setupTwoPlayerHandlers } from './handlers/twoPlayerHandlers.js'

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    // Setup all event handlers
    setupRoomHandlers(io, socket)
    setupTwoPlayerHandlers(io, socket)
  })
}
