import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getGames } from '../services/gamesApi'

export const useGames = ({ limit = 6, latitude, longitude, radiusKm, date } = {}) =>
  useInfiniteQuery({
    queryKey: queryKeys.games.list({
      limit,
      latitude,
      longitude,
      radiusKm,
      date,
    }),
    queryFn: ({ pageParam }) =>
      getGames({
        page: pageParam,
        limit,
        latitude,
        longitude,
        radiusKm,
        date,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination
      if (!pagination?.hasNext) return undefined
      return pagination.currentPage + 1
    },
    retry: 1,
  })
