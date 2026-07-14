import { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Search, Plus, Calendar, User, LogIn, Menu, X } from 'lucide-react'

const linkBase =
  'inline-flex items-center gap-2 border-b-2 py-5 text-sm transition-colors'

const navClass = ({ isActive }) =>
  isActive
    ? `${linkBase} border-ink font-semibold text-ink`
    : `${linkBase} border-transparent text-muted hover:text-ink`

const mobileLinkBase =
  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition'

const mobileNavClass = ({ isActive }) =>
  isActive
    ? `${mobileLinkBase} bg-[#e8f0ea] text-forest`
    : `${mobileLinkBase} text-ink hover:bg-[#f5f5f5]`

const navItems = [
  { to: '/', label: 'Find Games', icon: Search, end: true },
  { to: '/host', label: 'Host Game', icon: Plus },
  { to: '/my-games', label: 'My Games', icon: Calendar },
  { to: '/profile', label: 'Profile', icon: User },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="relative z-50 border-b border-line bg-[#ffffff]">
      {/* Mobile bar — stays white when menu opens */}
      <div className="relative z-[70] flex items-center justify-between bg-[#ffffff] px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Golf Links"
            className="h-8 w-auto object-contain"
          />
          <span className="font-serif text-base tracking-tight text-ink">
            <span className="font-semibold">Golf Links</span>
            <span className="mx-1 text-muted">·</span>
            <span className="italic text-muted">Premium</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-[#ffffff] text-ink transition hover:bg-[#f5f5f5]"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="relative size-5">
            <Menu
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                menuOpen
                  ? 'rotate-90 scale-75 opacity-0'
                  : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                menuOpen
                  ? 'rotate-0 scale-100 opacity-100'
                  : '-rotate-90 scale-75 opacity-0'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Backdrop below header so header color never changes */}
      <button
        type="button"
        className={`fixed inset-x-0 bottom-0 top-[57px] z-[60] bg-ink/25 transition-opacity duration-300 ease-out md:hidden ${
          menuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      {/* Dropdown opens from top under the header */}
      <div
        className={`absolute inset-x-0 top-full z-[65] overflow-hidden border-b border-line bg-[#ffffff] shadow-[0_12px_30px_rgba(26,46,38,0.12)] transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? 'pointer-events-auto max-h-[28rem] translate-y-0 opacity-100'
            : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
        }`}
      >
        <nav className="flex flex-col gap-1 bg-[#ffffff] px-4 py-3">
          {navItems.map(({ to, label, icon: Icon, end }, index) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={mobileNavClass}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              <span
                className={`inline-flex items-center gap-3 transition-all duration-300 ease-out ${
                  menuOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-2 opacity-0'
                }`}
                style={{
                  transitionDelay: menuOpen ? `${80 + index * 40}ms` : '0ms',
                }}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </span>
            </NavLink>
          ))}
          <Link
            to="/login"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            className={`mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-3.5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#244a37] ${
              menuOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-2 opacity-0'
            }`}
            style={{ transitionDelay: menuOpen ? '240ms' : '0ms' }}
          >
            <LogIn size={16} strokeWidth={1.75} />
            Sign In
          </Link>
        </nav>
      </div>

      {/* Desktop bar */}
      <nav className="container mx-auto hidden grid-cols-[1fr_auto_1fr] items-center bg-[#ffffff] px-4 sm:px-6 md:grid">
        <div className="flex items-center justify-start">
          <NavLink to="/" className={navClass} end>
            <Search size={18} strokeWidth={1.75} />
            Find Games
          </NavLink>
        </div>

        <Link to="/" className="flex items-center gap-2.5 px-2 py-3 sm:gap-3">
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
            Host Game
          </NavLink>
          <NavLink to="/my-games" className={navClass}>
            <Calendar size={18} strokeWidth={1.75} />
            My Games
          </NavLink>
          <NavLink to="/profile" className={navClass}>
            <User size={18} strokeWidth={1.75} />
            Profile
          </NavLink>
          <Link
            to="/login"
            className="ml-1 inline-flex items-center gap-2 rounded-lg bg-forest px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#244a37] sm:ml-2"
          >
            <LogIn size={16} strokeWidth={1.75} />
            Sign In
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
