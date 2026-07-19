import { useMutation } from '@tanstack/react-query'
import { registerUser, verifyEmail } from '../services/authApi'

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: registerUser,
  })

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: verifyEmail,
  })
