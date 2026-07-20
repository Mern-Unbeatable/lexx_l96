export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  games: {
    all: ['games'],
    list: (params) => ['games', 'list', params],
  },
  courses: {
    all: ['courses'],
    list: (search) => ['courses', 'list', search],
  },
}
