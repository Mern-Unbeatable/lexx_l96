import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Layout = () => (
  <div className="min-h-screen bg-cream font-sans text-ink antialiased">
    <Navbar />
    <Outlet />
  </div>
)

export default Layout
