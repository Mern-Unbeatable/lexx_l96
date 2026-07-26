import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const createReviewForGame = async ({
  gameId,
  revieweeId,
  rating,
  punctuality,
  friendliness,
  handicapAccuracy,
  notes,
}) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.reviews.createForGame(gameId),
    {
      revieweeId,
      rating,
      punctuality,
      friendliness,
      handicapAccuracy,
      notes: notes || undefined,
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

export const getReviewsForUser = async (userId) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.reviews.forUser(userId),
  )

  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to load reviews.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}
