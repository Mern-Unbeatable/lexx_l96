import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { getReviewsForUser } from '../services/reviewsApi'
import { queryKeys } from '../api/queryKeys'
import Stars from '../pages/myGames/components/Stars'

const ENTER_MS = 20
const EXIT_MS = 280

const CATEGORY_LABELS = [
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'friendliness', label: 'Friendliness' },
  { key: 'handicapAccuracy', label: 'Handicap accuracy' },
]

const CategoryRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-sm text-muted">{label}</span>
    <div className="flex items-center gap-1.5">
      <Stars rating={value} />
      <span className="w-6 text-right text-sm font-medium text-ink">
        {Number(value).toFixed(1)}
      </span>
    </div>
  </div>
)

const ReviewsDetailModal = ({ open, onClose, userId, userName }) => {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const showTimer = window.setTimeout(() => setVisible(true), ENTER_MS)
      return () => window.clearTimeout(showTimer)
    }

    setVisible(false)
    const hideTimer = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(hideTimer)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const reviewsQuery = useQuery({
    queryKey: queryKeys.reviews.forUser(userId),
    queryFn: () => getReviewsForUser(userId),
    enabled: open && Boolean(userId),
  })

  if (!mounted || !userId) return null

  const data = reviewsQuery.data
  const displayName = data?.user?.name || userName || 'Golfer'
  const categoryAverages = data?.categoryAverages
  const totalReviews = data?.totalReviews ?? 0

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
        aria-labelledby="reviews-detail-title"
        className={`relative z-10 w-full max-w-lg overflow-hidden rounded-t-[1.35rem] border border-white/70 bg-white shadow-[0_24px_60px_rgba(26,46,38,0.22)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[1.35rem] ${
          visible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-[0.97] sm:translate-y-4'
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line/70 px-5 py-4 sm:px-6">
          <div>
            <h2
              id="reviews-detail-title"
              className="text-xl font-semibold tracking-tight text-ink"
            >
              Reviews
            </h2>
            <p className="mt-1 text-sm text-muted">{displayName}</p>
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

        <div className="px-5 py-5 sm:px-6">
          {reviewsQuery.isPending && (
            <p className="py-8 text-center text-sm text-muted">Loading reviews…</p>
          )}

          {reviewsQuery.isError && (
            <p className="py-8 text-center text-sm text-red-500">
              {reviewsQuery.error?.message || 'Unable to load reviews.'}
            </p>
          )}

          {!reviewsQuery.isPending && !reviewsQuery.isError && (
            <div className="rounded-xl border border-line/80 bg-[#fafafa] px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <Stars rating={data?.averageRating ?? 0} />
                <span className="text-base font-semibold text-ink">
                  {(data?.averageRating ?? 0).toFixed(1)}
                </span>
                <span className="text-sm text-muted">
                  · {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                </span>
              </div>

              {categoryAverages && totalReviews > 0 ? (
                <div className="mt-4 space-y-3 border-t border-line/70 pt-4">
                  {CATEGORY_LABELS.map(({ key, label }) => (
                    <CategoryRow
                      key={key}
                      label={label}
                      value={categoryAverages[key]}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">No reviews yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReviewsDetailModal
