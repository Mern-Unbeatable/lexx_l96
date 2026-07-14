import { Star } from 'lucide-react'

const Stars = ({ rating }) => {
  const filled = Math.round(rating ?? 0)

  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={12}
          strokeWidth={0}
          className={
            n <= filled ? 'fill-forest text-forest' : 'fill-line text-line'
          }
        />
      ))}
    </span>
  )
}

export default Stars
