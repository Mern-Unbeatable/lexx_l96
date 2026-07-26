import { useEffect, useState } from 'react'
import { Star, X } from 'lucide-react'

const ENTER_MS = 20
const EXIT_MS = 280

const RATING_CATEGORIES = [
  {
    key: 'punctuality',
    label: 'Punctuality',
    hint: 'Were they on time?',
  },
  {
    key: 'friendliness',
    label: 'Friendliness',
    hint: 'How was the company on the round?',
  },
  {
    key: 'handicapAccuracy',
    label: 'Handicap accuracy',
    hint: 'Did their play match their handicap?',
  },
]

const emptyRatings = () =>
  RATING_CATEGORIES.reduce((acc, category) => {
    acc[category.key] = 0
    return acc
  }, {})

const StarPicker = ({ value, onChange, size = 26 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const active = star <= value
      return (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="rounded p-0.5 transition hover:scale-105"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            strokeWidth={1.5}
            className={active ? 'fill-[#F0A500] text-[#F0A500]' : 'text-line'}
          />
        </button>
      )
    })}
  </div>
)

const LeaveReviewModal = ({ open, onClose, game, onSubmit }) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ratings, setRatings] = useState(emptyRatings)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setRatings(emptyRatings())
      setNotes('')
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

  const reviewee = game.participant ?? game.host
  const revieweeLabel = game.participant
    ? game.participant.name
    : game.host
      ? `Host · ${game.host.name}`
      : ''

  const updateRating = (key, value) => {
    setRatings((current) => ({ ...current, [key]: value }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const incomplete = RATING_CATEGORIES.find(
      (category) => (ratings[category.key] ?? 0) < 1,
    )
    if (incomplete) {
      setError(`Please rate ${incomplete.label.toLowerCase()}`)
      return
    }

    if (!reviewee?.id) {
      setError('Unable to identify who to review')
      return
    }

    const ratingValues = RATING_CATEGORIES.map(
      (category) => ratings[category.key],
    )
    const overallRating = Math.round(
      ratingValues.reduce((sum, value) => sum + value, 0) / ratingValues.length,
    )

    setSubmitting(true)
    try {
      await onSubmit?.({
        gameId: game.id,
        revieweeId: reviewee.id,
        rating: overallRating,
        punctuality: ratings.punctuality,
        friendliness: ratings.friendliness,
        handicapAccuracy: ratings.handicapAccuracy,
        notes: notes.trim(),
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-80 flex items-end justify-center p-0 sm:items-center sm:p-6"
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
        aria-labelledby="leave-review-title"
        className={`relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-h-[85vh] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="leave-review-title"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Leave a Review
            </h2>
            <p className="mt-1 text-sm text-muted">
              {game.course} · {game.date} · {game.time}
              {revieweeLabel ? ` · ${revieweeLabel}` : ''}
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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            {RATING_CATEGORIES.map((category) => (
              <div
                key={category.key}
                className="rounded-xl border border-line/80 bg-[#fafafa] px-4 py-3.5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-medium text-ink">
                      {category.label}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{category.hint}</p>
                  </div>
                  <StarPicker
                    value={ratings[category.key]}
                    onChange={(next) => updateRating(category.key, next)}
                  />
                </div>
              </div>
            ))}

            <div>
              <label
                htmlFor="review-notes"
                className="mb-2 block text-base font-medium text-ink"
              >
                Notes
                <span className="ml-1.5 text-sm font-normal text-muted">
                  (optional)
                </span>
              </label>
              <textarea
                id="review-notes"
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Anything else worth mentioning about the round…"
                className="w-full resize-none rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-forest focus:ring-2 focus:ring-forest/15"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-line/70 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-[#f5f5f5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-forest px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#244a37] disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeaveReviewModal
