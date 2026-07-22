import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.notifications.list, {
    params: { page, limit },
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load notifications.',
      data: payload,
    }
  }

  return {
    notifications: payload?.data ?? [],
    pagination: payload?.pagination ?? null,
  }
}

export const getUnreadNotificationCount = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.notifications.unreadCount)
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load notification count.',
      data: payload,
    }
  }

  return payload?.data?.unreadCount ?? 0
}

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.notifications.markRead(notificationId),
  )
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to mark notification as read.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}

export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.patch(API_ENDPOINTS.notifications.markAllRead)
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to mark notifications as read.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}
