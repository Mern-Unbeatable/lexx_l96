import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { createReviewForGame } from '../services/reviewsApi'

export const useLeaveReviewMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createReviewForGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.counts })
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}

