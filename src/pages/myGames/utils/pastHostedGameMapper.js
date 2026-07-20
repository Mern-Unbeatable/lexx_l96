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

const mapParticipant = (participant) => ({
  id: participant.id,
  initials: getInitials(participant.name),
  name: participant.name || 'Golfer',
  age: participant.age ?? '—',
  handicap: participant.handicap ?? '—',
  reviewed: Boolean(participant.reviewed),
  rating:
    participant.rating === null || participant.rating === undefined
      ? null
      : Number(participant.rating),
})

export const mapPastHostedGame = (game) => ({
  ...game,
  course: game.courseName || 'Course unavailable',
  location: game.locationName || '',
  date: formatGameDate(game.date),
  time: game.time || 'Time unavailable',
  needsReview: Boolean(game.needsReview),
  participants: Array.isArray(game.participants)
    ? game.participants.map(mapParticipant)
    : [],
})
