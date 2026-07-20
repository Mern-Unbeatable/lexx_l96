import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getGames = async ({ page = 1, limit = 5 }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.games.list, {
    params: { page, limit },
    skipAuth: true,
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load games.',
      data: payload,
    }
  }

  return {
    games: Array.isArray(payload?.data) ? payload.data : [],
    pagination: payload?.pagination ?? {
      currentPage: page,
      totalPages: 1,
      limit,
      totalItems: 0,
      hasPrevious: false,
      hasNext: false,
    },
  }
}

export const createGame = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.games.create, payload)
  return response.data?.data ?? response.data
}
