import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen bg-forest font-sans antialiased">
      <AuthBrandPanel />

      <main className="flex flex-1 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:rounded-l-[5rem] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <img src="/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-base font-semibold text-ink">Golf Links</span>
          </Link>

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
