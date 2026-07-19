import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ChevronDown, Eye, EyeOff } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'
import OtpVerifyStep from './components/OtpVerifyStep'
import FormField from '../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import { registerSchema } from '../../schemas/formSchemas'
import {
  useRegisterMutation,
  useVerifyEmailMutation,
} from '../../hooks/useAuthMutations'

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('form')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const registerMutation = useRegisterMutation()
  const verifyEmailMutation = useVerifyEmailMutation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      gender: '',
      age: '',
      handicap: '',
    },
  })

  const onSubmit = async (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      gender: data.gender.toUpperCase().replace('-', '_'),
      age: data.age,
      handicap: data.handicap,
    }

    try {
      await registerMutation.mutateAsync(payload)
      setEmail(data.email)
      setStep('otp')
    } catch (error) {
      setError('root', {
        message: error?.message || 'Registration failed. Please try again.',
      })
    }
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

          {step === 'form' && (
            <>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-muted">
                Join the community and find your perfect round today.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-7 space-y-4"
                noValidate
              >
                <FormField
                  label="Full name"
                  htmlFor="fullName"
                  error={errors.fullName?.message}
                >
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    className={`${inputClass} ${errors.fullName ? inputErrorClass : ''}`}
                    {...register('fullName')}
                  />
                </FormField>

                <FormField
                  label="Email address"
                  htmlFor="email"
                  error={errors.email?.message}
                >
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className={`${inputClass} ${errors.email ? inputErrorClass : ''}`}
                    {...register('email')}
                  />
                </FormField>

                <FormField
                  label="Password"
                  htmlFor="password"
                  error={errors.password?.message}
                >
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      className={`${inputClass} pr-11 ${errors.password ? inputErrorClass : ''}`}
                      {...register('password')}
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
                </FormField>

                <FormField
                  label="Gender"
                  htmlFor="gender"
                  error={errors.gender?.message}
                >
                  <div className="relative">
                    <select
                      id="gender"
                      className={`${inputClass} appearance-none pr-10 ${errors.gender ? inputErrorClass : ''}`}
                      {...register('gender')}
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
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Age"
                    htmlFor="age"
                    error={errors.age?.message}
                  >
                    <input
                      id="age"
                      type="number"
                      placeholder="e.g. 35"
                      className={`${inputClass} ${errors.age ? inputErrorClass : ''}`}
                      {...register('age')}
                    />
                  </FormField>
                  <FormField
                    label="Handicap"
                    htmlFor="handicap"
                    error={errors.handicap?.message}
                  >
                    <input
                      id="handicap"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 12"
                      className={`${inputClass} ${errors.handicap ? inputErrorClass : ''}`}
                      {...register('handicap')}
                    />
                  </FormField>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating…' : 'Create Account'}
                </button>

                {errors.root?.message && (
                  <p role="alert" className="text-center text-sm text-red-500">
                    {errors.root.message}
                  </p>
                )}
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
            </>
          )}

          {step === 'otp' && (
            <OtpVerifyStep
              email={email}
              title="Verify your email"
              backLabel="Back to details"
              submitLabel="Verify & continue"
              onBack={() => setStep('form')}
              onVerify={(code) =>
                verifyEmailMutation.mutateAsync({ email, code })
              }
              onVerified={() => setStep('success')}
            />
          )}

          {step === 'success' && (
            <div>
              <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#e8f0ea] text-forest">
                <CheckCircle2 size={28} strokeWidth={1.75} />
              </div>
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Account ready
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Your email has been verified. Welcome to Golf Links — find your
                next round.
              </p>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
              >
                Go to Find Games
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Register
