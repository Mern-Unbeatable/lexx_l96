import { NavLink, Link } from 'react-router-dom'
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
      <nav className="container mx-auto grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        <div className="flex items-center justify-start">
          <NavLink to="/" className={navClass} end>
            <Search size={18} strokeWidth={1.75} />
            <span className="hidden sm:inline">Find Games</span>
          </NavLink>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2.5 px-2 py-3 sm:gap-3"
        >
          <img
            src="/logo.png"
            alt="Golf Links"
            className="h-8 w-auto object-contain sm:h-9"
          />
          <span className="font-serif text-sm tracking-tight text-ink sm:text-lg">
            <span className="font-semibold">Golf Links</span>
            <span className="mx-1 text-muted sm:mx-1.5">·</span>
            <span className="italic text-muted">Premium Pairings</span>
          </span>
        </Link>

        <div className="flex items-center justify-end gap-4 sm:gap-8">
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
