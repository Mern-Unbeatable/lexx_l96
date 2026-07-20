import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { inputErrorClass } from '../../../components/form/formStyles'
import { otpSchema } from '../../../schemas/formSchemas'
import { showErrorToast } from '../../../utils/toast'

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

const DEMO_OTP = '123456'

const OtpVerifyStep = ({
  email,
  title = 'Enter OTP',
  description,
  backLabel = 'Back',
  submitLabel = 'Verify OTP',
  onBack,
  onVerify,
  onResend,
  onVerified,
}) => {
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
    resolver: zodResolver(otpSchema),
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

    if (onVerify) {
      try {
        await onVerify(otp)
        await onVerified?.()
      } catch (error) {
        showErrorToast(error?.message || 'Email verification failed')
      }
      return
    }

    if (otp !== DEMO_OTP) {
      setError('otp', { message: 'Invalid OTP. Try 123456 for demo.' })
      return
    }

    await wait(700)
    onVerified?.()
  }

  const resendOtp = async () => {
    if (resendIn > 0) return
    try {
      if (onResend) {
        await onResend()
      } else {
        await wait(500)
      }
      setResendIn(30)
      setDigits(['', '', '', '', '', ''])
      setValue('otp', '')
      clearErrors('otp')
      inputsRef.current[0]?.focus()
    } catch (error) {
      showErrorToast(error?.message || 'Unable to resend OTP')
    }
  }

  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          {backLabel}
        </button>
      )}

      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {description || (
          <>
            We sent a 6-digit code to{' '}
            <span className="font-medium text-ink">{email}</span>
          </>
        )}
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
                onChange={(event) =>
                  handleDigitChange(index, event.target.value)
                }
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
          {isSubmitting ? 'Verifying…' : submitLabel}
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

export default OtpVerifyStep
