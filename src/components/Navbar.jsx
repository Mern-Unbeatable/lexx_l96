import { NavLink } from 'react-router-dom'
import { Search, Plus, Calendar, User } from 'lucide-react'

const linkBase =
  'inline-flex items-center gap-2 border-b-2 py-5 text-sm transition-colors'

function navClass({ isActive }) {
  return isActive
    ? `${linkBase} border-ink font-semibold text-ink`
    : `${linkBase} border-transparent text-muted hover:text-ink`
}

export default function Navbar() {
  return (
    <header className="border-b border-line bg-white">
      <nav className="mx-auto flex container items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className={navClass} end>
          <Search size={18} strokeWidth={1.75} />
          Find Games
        </NavLink>

        <div className="flex items-center gap-6 sm:gap-10">
          <NavLink to="/host" className={navClass}>
            <Plus size={18} strokeWidth={1.75} />
            <span className="hidden sm:inline">Host Game</span>
          </NavLink>
          <NavLink to="/my-games" className={navClass}>
            <Calendar size={18} strokeWidth={1.75} />
            <span className="hidden sm:inline">My Games</span>
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <User size={18} strokeWidth={1.75} />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
