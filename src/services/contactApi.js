import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const submitContactForm = async ({ name, email, message }) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.contact.submit,
    { name, email, message },
    { skipAuth: true },
  )
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to send your message.',
      data: payload,
    }
  }

  return payload
}
