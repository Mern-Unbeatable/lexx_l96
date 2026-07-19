import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getMyProfile = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.profile.me)
  return response.data?.data ?? response.data
}
