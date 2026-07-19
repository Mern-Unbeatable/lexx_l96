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

const formatCost = (value) => {
  if (value === null || value === undefined) return 'Not specified'
  if (Number(value) === 0) return 'Free'
  return `£${value} per person`
}

const formatRange = (minimum, maximum) => {
  if (minimum === null || minimum === undefined) return 'Any'
  if (maximum === null || maximum === undefined) return `${minimum}+`
  return `${minimum}-${maximum}`
}

export const mapApiGame = (game) => ({
  ...game,
  course: game.courseName || 'Course unavailable',
  date: formatGameDate(game.date),
  time: game.time || 'Time unavailable',
  ageRange: formatRange(game.ageMin, game.ageMax),
  handicapRange: formatRange(game.handicapMin, game.handicapMax),
  cost: formatCost(game.costPerRound),
  host: {
    ...game.host,
    initials: getInitials(game.host?.name),
  },
})
