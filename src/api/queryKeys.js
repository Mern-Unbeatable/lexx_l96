export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  games: {
    all: ['games'],
    list: (params) => ['games', 'list', params],
  },
  myGames: {
    all: ['my-games'],
    counts: ['my-games', 'counts'],
    hosting: (params) => ['my-games', 'hosting', params],
  },
  courses: {
    all: ['courses'],
    list: (search) => ['courses', 'list', search],
    locations: (courseId) => ['courses', courseId, 'locations'],
  },
}
