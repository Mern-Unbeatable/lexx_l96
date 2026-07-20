import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getMyPastJoinedGames } from '../services/gamesApi'
import { useAuth } from '../context/AuthContext'

export const useMyPastJoinedGames = ({ page = 1, limit = 10 } = {}) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.myGames.pastJoined({ page, limit }),
    queryFn: () => getMyPastJoinedGames({ page, limit }),
    enabled: isAuthenticated,
    retry: 1,
  })
}
