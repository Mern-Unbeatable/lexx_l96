export const hostedGames = [
  {
    id: 1,
    course: 'Sunningdale Golf Club',
    date: 'Saturday 19 Jul',
    time: '08:30',
    pending: 2,
    requests: [
      {
        id: 'r1',
        initials: 'TB',
        name: 'Tom B.',
        age: 42,
        handicap: 12,
        rating: 4.7,
        reviews: 3,
        message: 'Looking forward to a good round!',
      },
      {
        id: 'r2',
        initials: 'SM',
        name: 'Sarah M.',
        age: 38,
        handicap: 8,
        rating: null,
        reviews: 0,
        message: 'Happy to share a buggy if needed.',
      },
    ],
  },
  {
    id: 2,
    course: 'Wentworth Club',
    date: 'Sunday 20 Jul',
    time: '09:15',
    pending: 1,
    requests: [
      {
        id: 'r3',
        initials: 'JK',
        name: 'James K.',
        age: 45,
        handicap: 14,
        rating: 4.2,
        reviews: 5,
        message: 'Prefer walking if the weather holds.',
      },
    ],
  },
]

export const pastGames = [
  {
    id: 3,
    course: "Royal St George's",
    date: 'Friday 4 Jul',
    time: '07:45',
    pending: 0,
    needsReview: true,
    requests: [],
  },
]
