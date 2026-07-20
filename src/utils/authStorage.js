import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'auth_token'
const AUTH_CHANGE_EVENT = 'auth-change'
const LEGACY_TOKEN_KEYS = ['accessToken', 'auth_token']

const cookieOptions = {
  expires: 7,
  path: '/',
  sameSite: 'Lax',
  secure: window.location.protocol === 'https:',
}

const notifyAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

export const getAccessToken = () => {
  const localToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (localToken) return localToken

  const cookieToken = Cookies.get(ACCESS_TOKEN_KEY)
  if (cookieToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, cookieToken)
    return cookieToken
  }

  const legacyToken = LEGACY_TOKEN_KEYS.map((key) =>
    localStorage.getItem(key),
  ).find(Boolean)

  if (legacyToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, legacyToken)
    Cookies.set(ACCESS_TOKEN_KEY, legacyToken, cookieOptions)
    LEGACY_TOKEN_KEYS.forEach((key) => {
      if (key !== ACCESS_TOKEN_KEY) localStorage.removeItem(key)
    })
  }

  return legacyToken ?? null
}

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
  Cookies.set(ACCESS_TOKEN_KEY, token, cookieOptions)
  LEGACY_TOKEN_KEYS.forEach((key) => {
    if (key !== ACCESS_TOKEN_KEY) localStorage.removeItem(key)
  })
  notifyAuthChange()
}

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  Cookies.remove(ACCESS_TOKEN_KEY, { path: '/' })
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
