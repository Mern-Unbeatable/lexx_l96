import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Calendar,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { showLoginRequiredToast } from "../utils/toast";
import NotificationBell from "./NotificationBell";
import ContactModal from "./ContactModal";

const linkBase =
  "inline-flex h-full shrink-0 items-center gap-2 whitespace-nowrap border-b-2 text-sm transition-colors";

const navClass = ({ isActive }) =>
  isActive
    ? `${linkBase} border-ink font-semibold text-ink`
    : `${linkBase} border-transparent text-muted hover:text-ink`;

const mobileLinkBase =
  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition";

const mobileNavClass = ({ isActive }) =>
  isActive
    ? `${mobileLinkBase} bg-[#e8f0ea] text-forest`
    : `${mobileLinkBase} text-ink hover:bg-[#f5f5f5]`;

const mobileNavItems = [
  { to: "/", label: "Find Games", icon: Search, end: true },
  { to: "/host", label: "Host Game", icon: Plus, requiresAuth: true },
  { to: "/my-games", label: "My Games", icon: Calendar, requiresAuth: true },
];

const desktopRightNavItems = [
  { to: "/host", label: "Host Game", icon: Plus, requiresAuth: true },
  { to: "/my-games", label: "My Games", icon: Calendar, requiresAuth: true },
  { to: "/profile", label: "Profile", icon: User, loggedInOnly: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated: loggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleProtectedNavClick = (event, path) => {
    if (loggedIn) return;

    event.preventDefault();
    closeMenu();
    showLoginRequiredToast();
    navigate("/login", { state: { from: { pathname: path } } });
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const visibleMobileItems = [
    ...mobileNavItems,
    ...(loggedIn
      ? [{ to: "/profile", label: "Profile", icon: User, requiresAuth: false }]
      : []),
  ];

  const visibleDesktopRightItems = desktopRightNavItems.filter(
    (item) => !item.loggedInOnly || loggedIn,
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[#ffffff]">
      <div className="relative z-[70] flex items-center justify-between bg-[#ffffff] px-4 py-3 xl:hidden">
        <Link to="/" className="flex items-center gap-1" onClick={closeMenu}>
          <img
            src="/logo.png"
            alt="Golf Linking"
            className="h-8 w-auto object-contain"
          />
          <span className="font-serif text-base tracking-tight text-ink">
            <span className="font-semibold">Golf Linking</span>
            <span className="mx-1 text-muted">·</span>
            <span className="italic text-muted">Premium</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {loggedIn && <NotificationBell />}
          <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-[#ffffff] text-ink transition hover:bg-[#f5f5f5]"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative size-5">
            <Menu
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                menuOpen
                  ? "rotate-90 scale-75 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              size={20}
              strokeWidth={1.75}
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                menuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0"
              }`}
            />
          </span>
        </button>
        </div>
      </div>

      <button
        type="button"
        className={`fixed inset-x-0 bottom-0 top-[57px] z-[60] bg-ink/25 transition-opacity duration-300 ease-out xl:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-label="Close menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <div
        className={`absolute inset-x-0 top-full z-[65] overflow-hidden border-b border-line bg-[#ffffff] shadow-[0_12px_30px_rgba(26,46,38,0.12)] transition-all duration-300 ease-out xl:hidden ${
          menuOpen
            ? "pointer-events-auto max-h-[28rem] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 bg-[#ffffff] px-4 py-3">
          {visibleMobileItems.map(
            ({ to, label, icon: Icon, end, requiresAuth }, index) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={mobileNavClass}
                onClick={(event) => {
                  if (requiresAuth) handleProtectedNavClick(event, to);
                  if (!event.defaultPrevented) closeMenu();
                }}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span
                  className={`inline-flex items-center gap-3 transition-all duration-300 ease-out ${
                    menuOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-2 opacity-0"
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${80 + index * 40}ms` : "0ms",
                  }}
                >
                  <Icon size={18} strokeWidth={1.75} />
                  {label}
                </span>
              </NavLink>
            ),
          )}
          <button
            type="button"
            onClick={() => {
              closeMenu();
              setContactOpen(true);
            }}
            tabIndex={menuOpen ? 0 : -1}
            className={`${mobileLinkBase} text-ink hover:bg-[#f5f5f5] ${
              menuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0"
            }`}
            style={{
              transitionDelay: menuOpen
                ? `${80 + visibleMobileItems.length * 40}ms`
                : "0ms",
            }}
          >
            <span className="inline-flex items-center gap-3">
              <Mail size={18} strokeWidth={1.75} />
              Contact
            </span>
          </button>
          {loggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              tabIndex={menuOpen ? 0 : -1}
              className={`mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-3.5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#244a37] ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? "240ms" : "0ms" }}
            >
              <LogOut size={16} strokeWidth={1.75} />
              Log Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className={`mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-forest px-3.5 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:bg-[#244a37] ${
                menuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-2 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? "240ms" : "0ms" }}
            >
              <LogIn size={16} strokeWidth={1.75} />
              Sign In
            </Link>
          )}
        </nav>
      </div>

      <nav className="container relative mx-auto hidden h-[4.5rem] items-stretch bg-[#ffffff] px-4 sm:px-6 xl:flex 2xl:h-[5rem]">
        <div className="flex min-w-0 flex-1 items-stretch justify-start pr-[5.5rem] sm:pr-[6.5rem] 2xl:pr-[7.5rem]">
          <NavLink to="/" className={navClass} end>
            <Search size={18} strokeWidth={1.75} className="shrink-0" />
            Find Games
          </NavLink>
        </div>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 z-10 flex max-w-[min(100%,14rem)] -translate-x-1/2 -translate-y-1/2 items-center gap-2 px-2 sm:max-w-[min(100%,16rem)] sm:gap-2.5 2xl:max-w-none 2xl:gap-3"
        >
          <img
            src="/logo.png"
            alt="Golf Linking"
            className="h-12 w-auto shrink-0 object-contain 2xl:h-14"
          />
          <span className="hidden min-w-0 font-serif text-base tracking-tight text-ink 2xl:inline 2xl:text-lg">
            <span className="font-semibold">Golf Linking</span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-stretch justify-end gap-2 pl-[5.5rem] sm:gap-3 sm:pl-[6.5rem] 2xl:gap-4 2xl:pl-[7.5rem]">
          {visibleDesktopRightItems.map(
            ({ to, label, icon: Icon, requiresAuth }) => (
              <NavLink
                key={to}
                to={to}
                className={navClass}
                onClick={(event) => {
                  if (requiresAuth) handleProtectedNavClick(event, to);
                }}
              >
                <Icon size={18} strokeWidth={1.75} className="shrink-0" />
                {label}
              </NavLink>
            ),
          )}
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="inline-flex h-full shrink-0 items-center gap-2 whitespace-nowrap border-b-2 border-transparent text-sm text-muted transition-colors hover:text-ink"
          >
            <Mail size={18} strokeWidth={1.75} className="shrink-0" />
            Contact
          </button>
          {loggedIn && (
            <div className="flex shrink-0 items-center self-stretch">
              <NotificationBell />
            </div>
          )}
          <div className="flex shrink-0 items-center">
            {loggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 inline-flex items-center gap-2 rounded-lg bg-forest px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#244a37] sm:ml-2"
              >
                <LogOut size={16} strokeWidth={1.75} />
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-1 inline-flex items-center gap-2 rounded-lg bg-forest px-3.5 py-2 text-sm font-medium text-white transition hover:bg-[#244a37] sm:ml-2"
              >
                <LogIn size={16} strokeWidth={1.75} />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
};

export default Navbar;
