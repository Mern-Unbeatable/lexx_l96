import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const loginUser = async (payload) => {
  const response = await axiosInstance.post(API_ENDPOINTS.auth.login, payload)
  return response.data
}

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

export const resendOtp = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.auth.resendOtp,
    payload,
  )
  return response.data
}

export const requestPasswordReset = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.auth.forgotPassword,
    payload,
  )
  return response.data
}

export const verifyResetOtp = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.auth.verifyResetOtp,
    payload,
  )
  return response.data
}

export const setNewPassword = async (payload) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.auth.setNewPassword,
    payload,
  )
  return response.data
}
