import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'

const inputClass =
  'w-full rounded-lg border border-line bg-white py-3 px-4 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15'

const labelClass = 'mb-1.5 block text-sm font-medium text-ink'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <div className="flex min-h-screen bg-forest font-sans antialiased">
      <AuthBrandPanel />

      <main className="flex flex-1 flex-col justify-center bg-white px-6 py-10 sm:px-12 lg:rounded-l-[5rem] lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <img src="/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-base font-semibold text-ink">Golf Links</span>
          </Link>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted">
            Join the community and find your perfect round today.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="fullName" className={labelClass}>
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted transition hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.75} />
                  ) : (
                    <Eye size={18} strokeWidth={1.75} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="gender" className={labelClass}>
                Gender
              </label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  required
                  defaultValue=""
                  className={`${inputClass} appearance-none pr-10`}
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
                <ChevronDown
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className={labelClass}>
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  required
                  min={1}
                  max={120}
                  placeholder="e.g. 35"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="handicap" className={labelClass}>
                  Handicap
                </label>
                <input
                  id="handicap"
                  name="handicap"
                  type="number"
                  required
                  min={0}
                  max={54}
                  step={0.1}
                  placeholder="e.g. 12"
                  className={inputClass}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-forest transition hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
