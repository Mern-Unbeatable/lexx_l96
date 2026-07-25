import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password']

const FirstVisitAuthRedirect = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const isPublicPath = PUBLIC_PATHS.includes(location.pathname)

  if (!isAuthenticated && !isPublicPath) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (isAuthenticated && isPublicPath) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default FirstVisitAuthRedirect
