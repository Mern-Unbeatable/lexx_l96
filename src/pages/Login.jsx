import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const stats = [
  { value: '12,400+', label: 'Active Players' },
  { value: '840', label: 'Courses Listed' },
  { value: '238', label: 'Games Today' },
]

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen bg-forest font-sans antialiased">
      <aside className="relative hidden w-[46%] flex-col justify-between px-10 py-10 text-white lg:flex xl:px-14">
        <p className="text-sm font-semibold tracking-wide">Golf Links</p>

        <div className="max-w-md">
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Golf on your own terms.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-white/75">
            Find solo golfers nearby who match your age group and handicap. No
            more awkward pairings — just great rounds.
          </p>

          <div className="mt-14 grid grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-2xl font-semibold text-[#d4a017] xl:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/50">© 2026 Golf Links</p>
      </aside>

      <main className="flex flex-1 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:rounded-l-[4.5rem] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <img src="/logo.png" alt="" className="h-8 w-auto" />
            <span className="font-serif text-lg font-semibold text-ink">
              Golf Links
            </span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-muted">
            Please enter your details to sign in to your account.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-line bg-white py-3 pl-4 pr-11 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
                <Mail
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ink"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-line bg-white py-3 pl-4 pr-20 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15"
                />
                <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="rounded p-0.5 text-muted transition hover:text-ink"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff size={18} strokeWidth={1.75} />
                    ) : (
                      <Eye size={18} strokeWidth={1.75} />
                    )}
                  </button>
                  <Lock
                    size={18}
                    strokeWidth={1.75}
                    className="text-muted"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-forest transition hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-forest transition hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
