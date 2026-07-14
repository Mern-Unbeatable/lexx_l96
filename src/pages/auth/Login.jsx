import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'
import FormField from '../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import { loginSchema } from '../../schemas/formSchemas'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data) => {
    console.log('Login form:', data)
    navigate('/')
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

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`${inputClass} pr-11 ${errors.email ? inputErrorClass : ''}`}
                  {...register('email')}
                />
                <Mail
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </FormField>

            <FormField label="Password" htmlFor="password" error={errors.password?.message}>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={`${inputClass} pr-20 ${errors.password ? inputErrorClass : ''}`}
                  {...register('password')}
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
            </FormField>
            <div className="-mt-3 flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-forest transition hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
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

export default Login
