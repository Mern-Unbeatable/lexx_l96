import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const registerUser = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.register, payload)
  return response.data
}

export const verifyEmail = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.auth.verifyEmail,
    payload,
  )
  return response.data
}
