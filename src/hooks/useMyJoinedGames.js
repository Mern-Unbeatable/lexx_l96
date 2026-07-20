import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getMyJoinedGames } from '../services/gamesApi'
import { useAuth } from '../context/AuthContext'

export const useMyJoinedGames = ({ page = 1, limit = 10 } = {}) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.myGames.joined({ page, limit }),
    queryFn: () => getMyJoinedGames({ page, limit }),
    enabled: isAuthenticated,
    retry: 1,
  })
}
