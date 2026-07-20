import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getMyGamesCounts } from '../services/gamesApi'
import { useAuth } from '../context/AuthContext'

export const useMyGamesCounts = () => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.myGames.counts,
    queryFn: getMyGamesCounts,
    enabled: isAuthenticated,
  })
}
