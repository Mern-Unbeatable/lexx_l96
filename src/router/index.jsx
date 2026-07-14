import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import PageStub from '../pages/PageStub'
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
          <Route path="host" element={<PageStub title="Host Game" />} />
          <Route path="my-games" element={<PageStub title="My Games" />} />
          <Route path="profile" element={<PageStub title="Profile" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
