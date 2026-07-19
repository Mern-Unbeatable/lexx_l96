import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getMyProfile } from '../services/profileApi'
import { queryKeys } from '../api/queryKeys'
import {
  authChangeEvent,
  clearAccessToken,
  isAuthenticated as hasAccessToken,
  setAccessToken,
} from '../utils/authStorage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const [isAuthenticated, setIsAuthenticated] = useState(hasAccessToken)

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(hasAccessToken())
    syncAuthState()
    window.addEventListener(authChangeEvent, syncAuthState)
    window.addEventListener('storage', syncAuthState)

    return () => {
      window.removeEventListener(authChangeEvent, syncAuthState)
      window.removeEventListener('storage', syncAuthState)
    }
  }, [])

  const profileQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getMyProfile,
    enabled: isAuthenticated,
    retry: false,
  })

  const login = useCallback((token) => {
    setAccessToken(token)
  }, [])

  const logout = useCallback(() => {
    clearAccessToken()
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    if (profileQuery.error?.status === 401) logout()
  }, [logout, profileQuery.error])

  const value = useMemo(
    () => ({
      user: profileQuery.data ?? null,
      isAuthenticated,
      isLoadingUser: isAuthenticated && profileQuery.isPending,
      userError: profileQuery.error,
      login,
      logout,
      refetchUser: profileQuery.refetch,
    }),
    [
      isAuthenticated,
      login,
      logout,
      profileQuery.data,
      profileQuery.error,
      profileQuery.isPending,
      profileQuery.refetch,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
