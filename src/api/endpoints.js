const id = (value) => encodeURIComponent(value)

export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    verifyEmail: '/api/auth/verify-email',
    resendOtp: '/api/auth/resend-otp',
    forgotPassword: '/api/auth/forgot-password',
    verifyResetOtp: '/api/auth/verify-reset-otp',
    setNewPassword: '/api/auth/set-new-password',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    me: '/auth/me',
  },

  profile: {
    me: '/api/profile/me',
    details: '/profile',
    update: '/api/profile/me',
  },

  courses: {
    list: '/api/courses',
    details: (courseId) => `/api/courses/${id(courseId)}`,
    locations: (courseId) => `/api/courses/${id(courseId)}/locations`,
  },

  location: {
    search: '/api/location/search',
    reverse: '/api/location/reverse',
  },

  games: {
    list: '/api/games',
    create: '/api/games',
    details: (gameId) => `/games/${id(gameId)}`,
    update: (gameId) => `/games/${id(gameId)}`,
    remove: (gameId) => `/games/${id(gameId)}`,
    hosted: '/games/hosted',
    joined: '/games/joined',
    past: '/games/past',
    requestToJoin: (gameId) => `/api/games/${id(gameId)}/join`,
    requests: (gameId) => `/games/${id(gameId)}/join-requests`,
  },

  myGames: {
    counts: '/api/my-games/counts',
    hosting: '/api/my-games/hosting',
    joined: '/api/my-games/joined',
    pastHosted: '/api/my-games/past/hosted',
    pastJoined: '/api/my-games/past/joined',
  },

  joinRequests: {
    list: '/join-requests',
    details: (requestId) => `/join-requests/${id(requestId)}`,
    accept: (requestId) => `/api/join-requests/${id(requestId)}/accept`,
    decline: (requestId) => `/api/join-requests/${id(requestId)}/decline`,
    cancel: (requestId) => `/join-requests/${id(requestId)}/cancel`,
  },

  reviews: {
    list: '/reviews',
    create: '/reviews',
    createForGame: (gameId) => `/api/reviews/${id(gameId)}`,
    forUser: (userId) => `/users/${id(userId)}/reviews`,
  },

  chats: {
    list: '/chats',
    details: (chatId) => `/chats/${id(chatId)}`,
    messages: (chatId) => `/chats/${id(chatId)}/messages`,
  },
}

export default API_ENDPOINTS
