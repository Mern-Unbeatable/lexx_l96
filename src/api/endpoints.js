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
    list: '/courses',
    details: (courseId) => `/courses/${id(courseId)}`,
  },

  games: {
    list: '/api/games',
    create: '/games',
    details: (gameId) => `/games/${id(gameId)}`,
    update: (gameId) => `/games/${id(gameId)}`,
    remove: (gameId) => `/games/${id(gameId)}`,
    hosted: '/games/hosted',
    joined: '/games/joined',
    past: '/games/past',
    requestToJoin: (gameId) => `/games/${id(gameId)}/join-requests`,
    requests: (gameId) => `/games/${id(gameId)}/join-requests`,
  },

  joinRequests: {
    list: '/join-requests',
    details: (requestId) => `/join-requests/${id(requestId)}`,
    accept: (requestId) => `/join-requests/${id(requestId)}/accept`,
    decline: (requestId) => `/join-requests/${id(requestId)}/decline`,
    cancel: (requestId) => `/join-requests/${id(requestId)}/cancel`,
  },

  reviews: {
    list: '/reviews',
    create: '/reviews',
    forUser: (userId) => `/users/${id(userId)}/reviews`,
  },

  chats: {
    list: '/chats',
    details: (chatId) => `/chats/${id(chatId)}`,
    messages: (chatId) => `/chats/${id(chatId)}/messages`,
  },
}

export default API_ENDPOINTS
