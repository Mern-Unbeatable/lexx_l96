import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../api/queryKeys'
import { updateMyProfile } from '../services/profileApi'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(queryKeys.auth.me, data)
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me })
    },
  })
}
