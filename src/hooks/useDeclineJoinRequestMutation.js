import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { declineJoinRequest } from '../services/joinRequestsApi'

export const useDeclineJoinRequestMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: declineJoinRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myGames.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.joinRequests.all })
    },
  })
}
