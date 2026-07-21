import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const AUTH_PROMPT_KEY = 'golf_linking_auth_prompt_shown'

const AUTH_PAGES = ['/login', '/signup', '/forgot-password']

const FirstVisitAuthRedirect = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) return

    if (AUTH_PAGES.includes(location.pathname)) {
      sessionStorage.setItem(AUTH_PROMPT_KEY, '1')
      return
    }

    if (sessionStorage.getItem(AUTH_PROMPT_KEY)) return

    sessionStorage.setItem(AUTH_PROMPT_KEY, '1')
    navigate('/login', { replace: true, state: { from: location } })
  }, [isAuthenticated, location, navigate])

  return <Outlet />
}

export default FirstVisitAuthRedirect
