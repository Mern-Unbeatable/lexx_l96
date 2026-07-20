import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const createReviewForGame = async ({ gameId, revieweeId, rating }) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.reviews.createForGame(gameId),
    {
      revieweeId,
      rating,
    },
  )

  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to submit review.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}

