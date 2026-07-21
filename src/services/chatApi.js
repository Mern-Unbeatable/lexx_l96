import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getConversations = async ({ page = 1, limit = 50 } = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.chat.conversations, {
    params: { page, limit },
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load conversations.',
      data: payload,
    }
  }

  return Array.isArray(payload?.data) ? payload.data : []
}

export const findConversation = async ({ gameId, otherUserId }) => {
  if (!gameId || !otherUserId) {
    return null
  }

  try {
    const response = await axiosInstance.get(API_ENDPOINTS.chat.lookup, {
      params: { gameId, otherUserId },
    })
    const payload = response.data

    if (payload?.success === false) {
      return null
    }

    return payload?.data ?? null
  } catch (error) {
    if (error?.status === 404) {
      return null
    }

    throw error
  }
}

export const getConversationMessages = async (
  conversationId,
  { page = 1, limit = 100 } = {},
) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.chat.messages(conversationId),
    { params: { page, limit } },
  )
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load messages.',
      data: payload,
    }
  }

  return Array.isArray(payload?.data) ? payload.data : []
}
