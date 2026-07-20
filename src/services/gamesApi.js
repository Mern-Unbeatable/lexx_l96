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

export const getMyGamesCounts = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.myGames.counts)
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load game counts.',
      data: payload,
    }
  }

  const data = payload?.data ?? {}
  const past = data.past ?? {}

  return {
    hosting: Number(data.hosting) || 0,
    joined: Number(data.joined) || 0,
    past: {
      hosted: Number(past.hosted) || 0,
      joined: Number(past.joined) || 0,
      hostedToReview: Number(past.hostedToReview) || 0,
      total: Number(past.total) || 0,
    },
  }
}

export const getMyHostingGames = async ({ page = 1, limit = 10 } = {}) => {
  const response = await axiosInstance.get(API_ENDPOINTS.myGames.hosting, {
    params: { page, limit },
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load hosted games.',
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
