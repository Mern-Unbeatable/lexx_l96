import Stars from '../pages/myGames/components/Stars'

const ClickableRating = ({
  rating,
  reviewCount,
  onClick,
  className = '',
  suffix = 'reviews',
  showOutOfFive = false,
}) => {
  if (!reviewCount || rating === null || rating === undefined) {
    return (
      <p className={`mt-1.5 text-sm text-muted ${className}`}>No reviews yet</p>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`mt-1.5 inline-flex flex-wrap items-center gap-1.5 text-left text-sm text-muted transition hover:text-ink ${className}`}
    >
      <Stars rating={rating} />
      <span className="underline decoration-line underline-offset-2">
        {Number(rating).toFixed(1)}
        {showOutOfFive ? ' out of 5' : ''} · {reviewCount} {suffix}
      </span>
    </button>
  )
}

export default ClickableRating
