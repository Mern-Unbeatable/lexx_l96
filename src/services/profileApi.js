import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getMyProfile = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.profile.me)
  return response.data?.data ?? response.data
}

export const updateMyProfile = async (payload) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.profile.update,
    payload,
  )
  return response.data?.data ?? response.data
}
