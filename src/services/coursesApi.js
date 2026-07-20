import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const getCourses = async (search = '') => {
  const response = await axiosInstance.get(API_ENDPOINTS.courses.list, {
    params: search ? { search } : undefined,
  })

  return Array.isArray(response.data?.data) ? response.data.data : []
}

export const getCourseLocations = async (courseId) => {
  const response = await axiosInstance.get(
    API_ENDPOINTS.courses.locations(courseId),
  )

  return Array.isArray(response.data?.data) ? response.data.data : []
}
