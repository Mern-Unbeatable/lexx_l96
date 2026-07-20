import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const acceptJoinRequest = async (joinRequestId) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.joinRequests.accept(joinRequestId),
  )
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to accept join request.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}

export const declineJoinRequest = async (joinRequestId) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.joinRequests.decline(joinRequestId),
  )
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to decline join request.',
      data: payload,
    }
  }

  return payload?.data ?? payload
}
