import { useMutation } from '@tanstack/react-query'
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  resendOtp,
  setNewPassword,
  verifyEmail,
  verifyResetOtp,
} from '../services/authApi'

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginUser,
  })

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: registerUser,
  })

export const useVerifyEmailMutation = () =>
  useMutation({
    mutationFn: verifyEmail,
  })

export const useResendOtpMutation = () =>
  useMutation({
    mutationFn: resendOtp,
  })

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: requestPasswordReset,
  })

export const useVerifyResetOtpMutation = () =>
  useMutation({
    mutationFn: verifyResetOtp,
  })

export const useSetNewPasswordMutation = () =>
  useMutation({
    mutationFn: setNewPassword,
  })
