import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { queryKeys } from '../api/queryKeys'
import { useAuth } from './AuthContext'
import { useSocket } from './SocketContext'
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../services/notificationsApi'

const NotificationsContext = createContext(null)

const getNotificationPath = (notification) => {
  if (notification.type === 'JOIN_REQUEST_RECEIVED') {
    return '/my-games?tab=hosting'
  }

  if (notification.type === 'NEW_MESSAGE' && notification.conversationId) {
    const tab = notification.targetTab === 'hosting' ? 'hosting' : 'joined'
    return `/my-games?tab=${tab}&conversation=${notification.conversationId}`
  }

  return '/my-games?tab=joined'
}

export const NotificationsProvider = ({ children }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuth()
  const { socket } = useSocket()

  const notificationsQuery = useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: () => getNotifications({ page: 1, limit: 20 }),
    enabled: isAuthenticated,
  })

  const unreadCountQuery = useQuery({
    queryKey: queryKeys.notifications.unreadCount,
    queryFn: getUnreadNotificationCount,
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? 60_000 : false,
  })

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all })
    queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
  }, [queryClient])

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: invalidateNotifications,
  })

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: invalidateNotifications,
  })

  useEffect(() => {
    if (!socket) return undefined

    const handleNewNotification = () => {
      invalidateNotifications()
    }

    socket.on('new_notification', handleNewNotification)

    return () => {
      socket.off('new_notification', handleNewNotification)
    }
  }, [socket, invalidateNotifications])

  const openNotification = useCallback(
    async (notification) => {
      if (!notification?.isRead) {
        await markReadMutation.mutateAsync(notification.id)
      }

      navigate(getNotificationPath(notification))
    },
    [markReadMutation, navigate],
  )

  const value = useMemo(
    () => ({
      notifications: notificationsQuery.data?.notifications ?? [],
      isLoading: notificationsQuery.isLoading,
      unreadCount: unreadCountQuery.data ?? 0,
      openNotification,
      markAsRead: (notificationId) => markReadMutation.mutateAsync(notificationId),
      markAllAsRead: () => markAllReadMutation.mutateAsync(),
      isMarkingAllRead: markAllReadMutation.isPending,
      isMarkingRead: markReadMutation.isPending,
    }),
    [
      notificationsQuery.data?.notifications,
      notificationsQuery.isLoading,
      unreadCountQuery.data,
      openNotification,
      markReadMutation,
      markAllReadMutation,
    ],
  )

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }

  return context
}
