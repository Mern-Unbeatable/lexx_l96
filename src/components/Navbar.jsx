import { NavLink } from 'react-router-dom'

function SearchIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function PlusIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

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
          <SearchIcon className="size-[18px]" />
          Find Games
        </NavLink>

        <div className="flex items-center gap-6 sm:gap-10">
          <NavLink to="/host" className={navClass}>
            <PlusIcon className="size-[18px]" />
            <span className="hidden sm:inline">Host Game</span>
          </NavLink>
          <NavLink to="/my-games" className={navClass}>
            <CalendarIcon className="size-[18px]" />
            <span className="hidden sm:inline">My Games</span>
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <UserIcon className="size-[18px]" />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
