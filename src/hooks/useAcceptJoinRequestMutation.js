import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { acceptJoinRequest } from '../services/joinRequestsApi'

export const useAcceptJoinRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: acceptJoinRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.joinRequests.all })
    },
  })
}
