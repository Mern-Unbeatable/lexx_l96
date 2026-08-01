import { useEffect, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import FormField from '../../../components/form/FormField'
import { inputClass, inputErrorClass } from '../../../components/form/formStyles'

const ENTER_MS = 20
const EXIT_MS = 280

const RequestToJoinModal = ({ open, onClose, game, onSubmit }) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [spotsRequested, setSpotsRequested] = useState(1)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const spotsLeft = Math.max(0, Number(game?.spotsLeft) || 0)
  const spotOptions = Array.from({ length: spotsLeft }, (_, index) => index + 1)

  useEffect(() => {
    if (open) {
      setMessage('')
      setSpotsRequested(1)
      setError('')
      setSubmitting(false)
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open, game])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted || !game) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) {
      setError('Please write a short message to the host')
      return
    }

    if (spotsLeft < 1) {
      setError('No spots left for this game')
      return
    }

    if (spotsRequested < 1 || spotsRequested > spotsLeft) {
      setError(`Please choose between 1 and ${spotsLeft} spots`)
      return
    }

    setSubmitting(true)
    try {
      await onSubmit?.({
        message: text,
        spotsRequested,
        game,
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className={`absolute inset-0 bg-ink/45 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-join-title"
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="request-join-title"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Request to Join
            </h2>
            <p className="mt-1 text-sm text-muted">
              {game.course} · {game.date} · {game.time}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-[#f5f5f5] hover:text-ink"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3 rounded-xl bg-cream/80 px-3.5 py-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#ebe8e1] text-sm font-semibold text-ink">
                {game.host?.initials || 'GL'}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {game.host?.name || 'Host'}
                </p>
                <p className="text-xs text-muted">Host</p>
              </div>
            </div>

            <FormField label="Number of spots" htmlFor="join-spots">
              <div className="relative">
                <select
                  id="join-spots"
                  value={spotsRequested}
                  onChange={(event) =>
                    setSpotsRequested(Number(event.target.value))
                  }
                  disabled={spotsLeft < 1}
                  className={`${inputClass} appearance-none pr-10`}
                >
                  {spotOptions.length > 0 ? (
                    spotOptions.map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'spot' : 'spots'}
                      </option>
                    ))
                  ) : (
                    <option value={1}>No spots left</option>
                  )}
                </select>
                <ChevronDown
                  size={18}
                  strokeWidth={1.75}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">
                {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} available
              </p>
            </FormField>

            <FormField
              label="Message to host"
              htmlFor="join-message"
              error={error}
            >
              <textarea
                id="join-message"
                rows={4}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value)
                  if (event.target.value.trim()) setError('')
                }}
                placeholder="e.g. Looking forward to a good round — happy to share a buggy."
                className={`${inputClass} resize-y ${error ? inputErrorClass : ''}`}
              />
            </FormField>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-line/70 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || spotsLeft < 1}
              className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestToJoinModal
