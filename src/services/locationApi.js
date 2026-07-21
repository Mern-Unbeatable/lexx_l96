import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../api/endpoints'

export const searchLocations = async (query, { page = 1, limit = 10 } = {}) => {
  const q = query.trim()
  if (!q) return []

  const response = await axiosInstance.get(API_ENDPOINTS.location.search, {
    params: { q, page, limit },
    skipAuth: true,
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to search locations.',
      data: payload,
    }
  }

  return Array.isArray(payload?.data) ? payload.data : []
}

export const fetchLocationSuggestions = searchLocations

export const reverseGeocodeLocation = async (lat, lon) => {
  const response = await axiosInstance.get(API_ENDPOINTS.location.reverse, {
    params: { lat, lon },
    skipAuth: true,
  })
  const payload = response.data

  if (payload?.success === false) {
    throw {
      status: response.status,
      message: payload?.message || 'Unable to resolve your location.',
      data: payload,
    }
  }

  return payload?.data ?? null
}

export const reverseGeocode = async (lat, lng) => {
  const location = await reverseGeocodeLocation(lat, lng)
  return location?.displayName ?? ''
}

export const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(new Error('User denied the request for Geolocation'))
          return
        }
        if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('Location information is unavailable'))
          return
        }
        if (error.code === error.TIMEOUT) {
          reject(new Error('The request to get user location timed out'))
          return
        }
        reject(new Error('Unable to retrieve your location'))
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
