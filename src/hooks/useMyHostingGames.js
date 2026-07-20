import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { getMyHostingGames } from '../services/gamesApi'
import { useAuth } from '../context/AuthContext'

export const useMyHostingGames = ({ page = 1, limit = 10 } = {}) => {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.myGames.hosting({ page, limit }),
    queryFn: () => getMyHostingGames({ page, limit }),
    enabled: isAuthenticated,
    retry: 1,
  })
}
