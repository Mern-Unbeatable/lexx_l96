import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { createGame } from '../services/gamesApi'

export const useCreateGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.games.all })
    },
  })
}
