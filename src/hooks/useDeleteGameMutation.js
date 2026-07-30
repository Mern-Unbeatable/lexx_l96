import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { deleteGame } from '../services/gamesApi'

export const useDeleteGameMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.counts })
      queryClient.invalidateQueries({ queryKey: queryKeys.games.all })
    },
  })
}
