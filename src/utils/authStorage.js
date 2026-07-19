import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'auth_token'
const AUTH_CHANGE_EVENT = 'auth-change'
const LEGACY_TOKEN_KEYS = ['accessToken', 'auth_token']

const cookieOptions = {
  expires: 7,
  sameSite: 'Lax',
  secure: window.location.protocol === 'https:',
}

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const getAccessToken = () => {
  const cookieToken = Cookies.get(ACCESS_TOKEN_KEY)
  if (cookieToken) return cookieToken

  const legacyToken = LEGACY_TOKEN_KEYS.map((key) =>
    localStorage.getItem(key),
  ).find(Boolean)

  if (legacyToken) {
    Cookies.set(ACCESS_TOKEN_KEY, legacyToken, cookieOptions)
    LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key))
  }

  return legacyToken ?? null
}

export const setAccessToken = (token) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions)
  LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key))
  notifyAuthChange()
}

export const clearAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY, cookieOptions)
  LEGACY_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key))
  notifyAuthChange()
}

export const extractAccessToken = (response) =>
  response?.accessToken ??
  response?.access_token ??
  response?.authToken ??
  response?.auth_token ??
  response?.token ??
  response?.data?.accessToken ??
  response?.data?.access_token ??
  response?.data?.authToken ??
  response?.data?.auth_token ??
  response?.data?.token ??
  null

export const isAuthenticated = () => Boolean(getAccessToken())

export const authChangeEvent = AUTH_CHANGE_EVENT
