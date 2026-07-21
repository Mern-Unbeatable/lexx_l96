import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isAuthenticated as hasAccessToken } from '../utils/authStorage'
import { showLoginRequiredToast } from '../utils/toast'

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const hasPrompted = useRef(false)

  useEffect(() => {
    if (isAuthenticated || hasAccessToken()) return
    if (hasPrompted.current) return

    hasPrompted.current = true
    showLoginRequiredToast()
    navigate('/login', { replace: true, state: { from: location } })
  }, [isAuthenticated, location, navigate])

  return isAuthenticated || hasAccessToken()
}
