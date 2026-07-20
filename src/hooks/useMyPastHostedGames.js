import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getMyPastHostedGames } from '../services/gamesApi'
import { useAuth } from '../context/AuthContext'

export const useMyPastHostedGames = ({ page = 1, limit = 10 } = {}) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.myGames.pastHosted({ page, limit }),
    queryFn: () => getMyPastHostedGames({ page, limit }),
    enabled: isAuthenticated,
    retry: 1,
  })
}
