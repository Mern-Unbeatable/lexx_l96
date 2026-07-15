import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Mail } from 'lucide-react'
import AuthBrandPanel from './components/AuthBrandPanel'
import FormField from '../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../components/form/formStyles'
import {
  forgotPasswordOtpSchema,
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

const OtpStep = ({ email, onBack, onVerified }) => {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [resendIn, setResendIn] = useState(30)
  const inputsRef = useRef([])

  const {
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: '' },
  })

  useEffect(() => {
    if (resendIn <= 0) return undefined
    const timer = window.setTimeout(() => setResendIn((v) => v - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [resendIn])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  const updateOtp = (nextDigits) => {
    setDigits(nextDigits)
    const otp = nextDigits.join('')
    setValue('otp', otp, { shouldValidate: otp.length === 6 })
    if (otp.length === 6) clearErrors('otp')
  }

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = cleaned
    updateOtp(next)
    if (cleaned && index < 5) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (!pasted) return
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || '')
    updateOtp(next)
    inputsRef.current[Math.min(pasted.length, 5)]?.focus()
  }

  const onSubmit = async () => {
    const otp = digits.join('')
    setValue('otp', otp)
    if (!/^\d{6}$/.test(otp)) {
      setError('otp', { message: 'Enter the 6-digit OTP' })
      return
    }

    // Demo OTP for UI testing
    if (otp !== '123456') {
      setError('otp', { message: 'Invalid OTP. Try 123456 for demo.' })
      return
    }

    console.log('OTP verified for:', email)
    await wait(700)
    onVerified()
  }

  const resendOtp = async () => {
    if (resendIn > 0) return
    console.log('Resend OTP to email:', email)
    await wait(500)
    setResendIn(30)
    setDigits(['', '', '', '', '', ''])
    setValue('otp', '')
    clearErrors('otp')
    inputsRef.current[0]?.focus()
  }

  return (
    <div>
      <BackLink onClick={onBack} />
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Enter OTP
      </h2>
      <p className="mt-2 text-sm text-muted">
        We sent a 6-digit code to{' '}
        <span className="font-medium text-ink">{email}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
        noValidate
      >
        <div>
          <p className="mb-1.5 block text-base font-medium text-ink">OTP code</p>
          <div className="flex gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={digit}
                onChange={(event) => handleDigitChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                aria-label={`Digit ${index + 1}`}
                className={`h-12 w-full rounded-lg border bg-white text-center text-lg font-semibold text-ink outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/15 sm:h-14 ${
                  errors.otp ? inputErrorClass : 'border-line'
                }`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="mt-1.5 text-sm text-red-500">{errors.otp.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-forest px-4 py-3.5 text-sm font-medium text-white transition hover:bg-[#244a37] active:scale-[0.99] disabled:opacity-60"
        >
          {isSubmitting ? 'Verifying…' : 'Verify OTP'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Didn&apos;t get the code?{' '}
        {resendIn > 0 ? (
          <span>Resend in {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={resendOtp}
            className="font-semibold text-forest transition hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>
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
            <OtpStep
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
