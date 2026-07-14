import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Host from '../pages/Host'
import MyGames from '../pages/MyGames'
import Profile from '../pages/Profile'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import NotFound from '../pages/NotFound'
import Layout from '../components/Layout'

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="host" element={<Host />} />
          <Route path="my-games" element={<MyGames />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
