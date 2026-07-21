const getInitials = (name = '') =>
  name
    .replace(/\./g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'GL'

const formatGameDate = (value) => {
  if (!value) return 'Date unavailable'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Date unavailable'

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(date)
}

const mapJoinRequest = (request) => {
  const user = request.user || request.player || request
  const name = user.fullName || user.name || 'Golfer'
  const rating =
    user.rating ?? user.averageRating ?? request.rating ?? null
  const reviews =
    user.reviewCount ?? user.reviewsCount ?? user.reviews ?? request.reviews ?? 0

  return {
    id: user.id ?? request.user?.id,
    joinRequestId: request.id,
    conversationId: request.conversationId ?? null,
    status: String(request.status || 'pending').toLowerCase(),
    initials: getInitials(name),
    name,
    age: user.age ?? '—',
    handicap: user.handicap ?? '—',
    rating: rating === null || rating === undefined ? null : Number(rating),
    reviews: Number(reviews) || 0,
    message: request.message || request.note || '',
  }
}

export const mapHostingGame = (game) => ({
  ...game,
  course: game.courseName || 'Course unavailable',
  date: formatGameDate(game.date),
  time: game.time || 'Time unavailable',
  pending: Number(game.pendingCount) || 0,
  requests: Array.isArray(game.joinRequests)
    ? game.joinRequests.map(mapJoinRequest)
    : [],
})
