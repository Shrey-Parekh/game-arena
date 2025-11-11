import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { createSocketConnection } from '../utils/socket'
import { useNavigate } from 'react-router-dom'

const SocketContext = createContext({})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [reconnecting, setReconnecting] = useState(false)
  const { session, user } = useAuth()

  useEffect(() => {
    if (session?.access_token && user) {
      console.log('Creating new socket connection...')
      const newSocket = createSocketConnection(session.access_token)

      newSocket.on('connect', () => {
        console.log('Socket connected in context')
        setConnected(true)
        setReconnecting(false)
      })

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected in context:', reason)
        setConnected(false)
      })

      newSocket.on('reconnecting', () => {
        console.log('Socket reconnecting...')
        setReconnecting(true)
      })

      newSocket.on('reconnect', () => {
        console.log('Socket reconnected')
        setReconnecting(false)
        setConnected(true)
      })

      newSocket.on('error', (error) => {
        console.error('Socket error:', error)
        showError(error)
      })

      setSocket(newSocket)

      return () => {
        console.log('Cleaning up socket connection')
        newSocket.close()
      }
    } else {
      if (socket) {
        console.log('No auth, closing socket')
        socket.close()
        setSocket(null)
        setConnected(false)
      }
    }
  }, [session, user])

  const showError = (error) => {
    // TODO: Implement toast notification system
    console.error('Error:', error)
  }

  const value = {
    socket,
    connected,
    reconnecting,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
