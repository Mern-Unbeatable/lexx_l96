import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NotificationsProvider } from '../context/NotificationsContext'
import Home from '../pages/home/Home'
import Host from '../pages/host/Host'
import MyGames from '../pages/myGames/MyGames'
import JoinRequests from '../pages/joinRequests/JoinRequests'
import Profile from '../pages/profile/Profile'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/ForgotPassword'
import NotFound from '../pages/NotFound'
import Layout from '../components/Layout'
import FirstVisitAuthRedirect from './FirstVisitAuthRedirect'

const AppRouter = () => (
  <Router>
    <NotificationsProvider>
      <Routes>
      <Route element={<FirstVisitAuthRedirect />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="host" element={<Host />} />
          <Route path="my-games" element={<MyGames />} />
          <Route path="my-games/:gameId/requests" element={<JoinRequests />} />
          <Route path="join-requests" element={<JoinRequests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
    </NotificationsProvider>
  </Router>
)

export default AppRouter
