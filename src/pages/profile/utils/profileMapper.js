const EMPTY_VALUE = '—'

export const getInitials = (firstName, lastName) =>
  `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

export const formatMemberSince = (value) => {
  if (!value) return EMPTY_VALUE

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return EMPTY_VALUE

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export const mapUserToProfile = (user) => {
  const personalInfo = user?.personalInfo ?? {}
  const firstName = personalInfo.firstName ?? ''
  const lastName = personalInfo.lastName ?? ''

  return {
    firstName,
    lastName,
    initials: getInitials(firstName, lastName) || 'GL',
    email: personalInfo.email ?? '',
    phone: personalInfo.phone ?? '',
    location: personalInfo.location ?? '',
    homeCourse: personalInfo.homeCourse ?? '',
    about: personalInfo.about ?? '',
    handicap: user?.currentHandicap ?? EMPTY_VALUE,
    roundsPlayed: user?.roundsPlayed ?? 0,
    roundsHosted: user?.roundsHosted ?? 0,
    memberSince: formatMemberSince(user?.memberSince),
    averageRating: user?.averageRating ?? null,
    totalReviews: user?.totalReviews ?? 0,
    membership: 'Member',
  }
}

export const getProfileFullName = (profile) =>
  `${profile.firstName} ${profile.lastName}`.trim() || 'Golf Links Member'
