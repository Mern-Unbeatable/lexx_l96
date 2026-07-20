import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { requestToJoinGame } from '../services/gamesApi'

export const useRequestToJoinMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: requestToJoinGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.games.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
    },
  })
}
