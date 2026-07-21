import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getGames } from '../services/gamesApi'

export const useGames = ({ page, limit = 5, latitude, longitude, radiusKm }) =>
  useQuery({
    queryKey: queryKeys.games.list({
      page,
      limit,
      latitude,
      longitude,
      radiusKm,
    }),
    queryFn: () =>
      getGames({ page, limit, latitude, longitude, radiusKm }),
    placeholderData: keepPreviousData,
    retry: 1,
  })
