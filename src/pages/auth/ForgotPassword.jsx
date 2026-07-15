import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Mail } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'
import OtpVerifyStep from './components/OtpVerifyStep'
import FormField from '../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
} from '../../schemas/formSchemas'

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const BackLink = ({ onClick, to }) =>
  to ? (
    <Link
      to={to}
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
    >
      <ArrowLeft size={16} strokeWidth={1.75} />
      Back to Sign In
    </Link>
  ) : (
    <button
      type="button"
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
    >
      <ArrowLeft size={16} strokeWidth={1.75} />
      Back
    </button>
  )

const EmailStep = ({ onContinue }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data) => {
    console.log('Send OTP to email:', data.email)
    await wait(700)
    onContinue(data.email)
  }

  return (
    <div>
      <BackLink to="/login" />
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Forgot password?
      </h2>
      <p className="mt-2 text-sm text-muted">
        Enter your email and we&apos;ll send a one-time password (OTP).
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <FormField
          label="Email address"
          htmlFor="email"
          error={errors.email?.message}
        >
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? 'Sending OTP…' : 'Send OTP'}
        </button>
      </form>
    </div>
  )
}

const PasswordStep = ({ onBack, onDone }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    console.log('Password reset:', data)
    await wait(700)
    onDone()
  }

  return (
    <div>
      <BackLink onClick={onBack} />
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Set new password
      </h2>
      <p className="mt-2 text-sm text-muted">
        Choose a strong password for your Golf Links account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <FormField
          label="New password"
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
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Re-enter password"
              className={`${inputClass} pr-11 ${errors.confirmPassword ? inputErrorClass : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted transition hover:text-ink"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? (
                <EyeOff size={18} strokeWidth={1.75} />
              ) : (
                <Eye size={18} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? 'Updating…' : 'Reset password'}
        </button>
      </form>
    </div>
  )
}

const SuccessStep = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#e8f0ea] text-forest">
        <CheckCircle2 size={28} strokeWidth={1.75} />
      </div>
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Password updated
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your password has been reset successfully. You can now sign in with your
        new password.
      </p>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99]"
      >
        Back to Sign In
      </button>
    </div>
  )
}

const ForgotPassword = () => {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')

  return (
    <div className="flex min-h-screen bg-forest font-sans antialiased">
      <AuthBrandPanel />

      <main className="flex flex-1 flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:rounded-l-[5rem] lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <img src="/logo.png" alt="" className="h-8 w-auto" />
            <span className="text-base font-semibold text-ink">Golf Links</span>
          </Link>

          {step === 'email' && (
            <EmailStep
              onContinue={(value) => {
                setEmail(value)
                setStep('otp')
              }}
            />
          )}

          {step === 'otp' && (
            <OtpVerifyStep
              email={email}
              onBack={() => setStep('email')}
              onVerified={() => setStep('password')}
            />
          )}

          {step === 'password' && (
            <PasswordStep
              onBack={() => setStep('otp')}
              onDone={() => setStep('success')}
            />
          )}

          {step === 'success' && <SuccessStep />}

          {step !== 'success' && (
            <p className="mt-8 text-center text-sm text-muted">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-semibold text-forest transition hover:underline"
              >
                Sign In
              </Link>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword
