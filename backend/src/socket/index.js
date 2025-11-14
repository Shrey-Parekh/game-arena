import { setupRoomHandlers } from './handlers/roomHandlers.js'
import { setupTwoPlayerHandlers } from './handlers/twoPlayerHandlers.js'
import { setupImposterHandlers } from './handlers/imposterHandlers.js'
import { setupNHIEHandlers } from './handlers/nhieHandlers.js'

export function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    // Setup all event handlers
    setupRoomHandlers(io, socket)
    setupTwoPlayerHandlers(io, socket)
    setupImposterHandlers(io, socket)
    setupNHIEHandlers(io, socket)
  })
}
