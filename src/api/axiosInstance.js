import axios from 'axios'
import { getAccessToken } from '../utils/authStorage'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status ?? null,
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors ?? null,
      data: error.response?.data ?? null,
      originalError: error,
    }

    return Promise.reject(normalizedError)
  },
)

export default axiosInstance
