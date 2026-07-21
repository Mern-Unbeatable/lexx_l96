import Swal from 'sweetalert2'

const toastDefaults = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
}

export const showErrorToast = (message) =>
  Swal.fire({
    ...toastDefaults,
    icon: 'error',
    title: message || 'Something went wrong. Please try again.',
  })

export const showSuccessToast = (message) =>
  Swal.fire({
    ...toastDefaults,
    icon: 'success',
    title: message,
  })

export const showErrorAlert = (message, title = 'Something went wrong') =>
  Swal.fire({
    icon: 'error',
    title,
    text: message || 'Something went wrong. Please try again.',
    confirmButtonText: 'Try again',
    confirmButtonColor: '#2D6A4F',
  })

export const showSuccessAlert = (
  message,
  title = 'Success',
) =>
  Swal.fire({
    icon: 'success',
    title,
    text: message || 'Completed successfully.',
    confirmButtonText: 'Done',
    confirmButtonColor: '#2D6A4F',
  })

export const showInfoAlert = (message, title = 'Coming soon') =>
  Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'Got it',
    confirmButtonColor: '#2D6A4F',
  })

export const showLoginRequiredToast = (
  message = 'Please sign in to continue.',
) =>
  Swal.fire({
    ...toastDefaults,
    icon: 'info',
    title: message,
  })

export const showLoginRequiredAlert = () =>
  Swal.fire({
    icon: 'info',
    title: 'Sign in required',
    text: 'Please sign in to request joining a game.',
    confirmButtonText: 'Sign In',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2D6A4F',
  })
