import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream font-sans text-ink antialiased">
      <Navbar />
      <Outlet />
    </div>
  )
}
