import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { getAccessToken } from '../utils/authStorage'
import { getSocketUrl } from '../utils/socketUrl'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setSocket((current) => {
        current?.disconnect()
        return null
      })
      setConnected(false)
      return undefined
    }

    const token = getAccessToken()
    if (!token) return undefined

    const instance = io(getSocketUrl(), {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    const handleConnect = () => setConnected(true)
    const handleDisconnect = () => setConnected(false)

    instance.on('connect', handleConnect)
    instance.on('disconnect', handleDisconnect)

    setSocket(instance)

    return () => {
      instance.off('connect', handleConnect)
      instance.off('disconnect', handleDisconnect)
      instance.disconnect()
    }
  }, [isAuthenticated])

  const value = useMemo(
    () => ({
      socket,
      connected,
    }),
    [socket, connected],
  )

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)

  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }

  return context
}
