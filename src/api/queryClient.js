import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount >= 2) return false
        if (error?.status >= 400 && error?.status < 500) return false
        return true
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export default queryClient
