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

const mapHost = (host = {}) => {
  const name = host.name || 'Host'
  const rating =
    host.rating === null || host.rating === undefined
      ? null
      : Number(host.rating)

  return {
    id: host.id,
    initials: getInitials(name),
    name,
    age: host.age ?? '—',
    handicap: host.handicap ?? '—',
    rating: Number.isNaN(rating) ? null : rating,
    reviews: Number(host.reviewCount ?? host.reviews) || 0,
  }
}

export const mapJoinedRequest = (request) => {
  const game = request.game ?? {}
  const status = String(request.status || 'pending').toLowerCase()

  return {
    id: request.id,
    status,
    message: request.message || '',
    canChat: Boolean(request.canChat),
    course: game.courseName || 'Course unavailable',
    date: formatGameDate(game.date),
    time: game.time || 'Time unavailable',
    location: game.locationName || '',
    gameId: game.id,
    host: mapHost(request.host),
  }
}
