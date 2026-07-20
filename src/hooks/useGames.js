import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getGames } from '../services/gamesApi'

export const useGames = ({ page, limit = 5 }) =>
  useQuery({
    queryKey: queryKeys.games.list({ page, limit }),
    queryFn: () => getGames({ page, limit }),
    placeholderData: keepPreviousData,
    retry: 1,
  })
